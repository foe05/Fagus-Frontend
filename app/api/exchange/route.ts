// POST /api/exchange — eingehende Kontakte (Besucher → Owner).
// Spec docs/Contact.md, Abschnitte 7 & 8.
//
// Ablauf: validieren → Spamschutz (Honeypot, Timing, Rate-Limit) →
// Besucher-.vcf bauen → zwei Mails (an Owner mit Besucher-.vcf, Bestätigung an
// den Besucher mit Owner-.vcf). Secrets (SMTP) bleiben serverseitig.

import { getCardBySlug, type ContactCard } from '@/lib/cards';
import { buildVCard, buildOwnerVCard } from '@/lib/vcard';
import { sendMail } from '@/lib/mailer';
import { rateLimit } from '@/lib/rate-limit';

interface ExchangePayload {
  vorname?: string;
  nachname?: string;
  email?: string;
  telefon?: string;
  firma?: string;
  position?: string;
  nachricht?: string;
  slug?: string;
  consent?: boolean;
  website?: string; // Honeypot — bleibt bei echten Nutzern leer
  ts?: number; // Zeitstempel beim Laden des Formulars (Timing-Trap)
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MIN_FILL_MS = 2000; // < 2 s zwischen Laden und Absenden → Bot

const OK_MESSAGE =
  'Danke! Deine Kontaktdaten sind angekommen. Wenn du eine E-Mail angegeben hast, bekommst du gleich eine Bestätigung mit meinen Daten zurück.';

function clientIp(request: Request): string {
  const fwd = request.headers.get('x-forwarded-for');
  if (fwd) return fwd.split(',')[0].trim();
  return request.headers.get('x-real-ip') ?? 'unknown';
}

/** Dateinamenstauglicher Slug aus einem Namen (Umlaute → ASCII). */
function nameSlug(first: string, last: string): string {
  const map: Record<string, string> = {
    ä: 'ae', ö: 'oe', ü: 'ue', ß: 'ss', Ä: 'ae', Ö: 'oe', Ü: 'ue',
  };
  return `${first}-${last}`
    .replace(/[äöüßÄÖÜ]/g, (c) => map[c] ?? c)
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '') || 'kontakt';
}

function germanDate(date: Date): string {
  return new Intl.DateTimeFormat('de-DE', { dateStyle: 'long' }).format(date);
}

/** Klartext-Zusammenfassung der eingegebenen Besucher-Felder. */
function summaryLines(p: ExchangePayload): string {
  const rows = [
    `Name: ${p.vorname} ${p.nachname}`,
    p.email ? `E-Mail: ${p.email}` : null,
    p.telefon ? `Telefon: ${p.telefon}` : null,
    p.firma ? `Firma: ${p.firma}` : null,
    p.position ? `Position: ${p.position}` : null,
  ].filter(Boolean);
  const msg = p.nachricht?.trim()
    ? `\nNachricht:\n${p.nachricht.trim()}`
    : '';
  return rows.join('\n') + msg;
}

function ownerMailText(p: ExchangePayload, date: Date): string {
  return [
    'Neuer Kontakt über deine digitale Kontaktkarte.',
    '',
    summaryLines(p),
    '',
    `Eingegangen am ${germanDate(date)}.`,
    'Die Kontaktdaten hängen als .vcf-Datei an dieser Mail — 1 Tap zum Import.',
  ].join('\n');
}

function confirmationMailText(
  card: ContactCard,
  p: ExchangePayload,
  date: Date,
): string {
  const ownerBlock = [
    card.fullName,
    card.org ?? null,
    card.title ?? null,
    card.emails[0] ? `E-Mail: ${card.emails[0].value}` : null,
    card.phones[0] ? `Telefon: ${card.phones[0].value}` : null,
    card.url ? `Web: ${card.url}` : null,
  ]
    .filter(Boolean)
    .join('\n');

  const ownerLabel = card.org ?? card.fullName;

  return [
    `Hallo ${p.vorname},`,
    '',
    `danke – deine Kontaktdaten sind bei ${ownerLabel} angekommen. Hier zur Sicherheit deine Zusammenfassung:`,
    '',
    summaryLines(p),
    '',
    `Eingegangen am ${germanDate(date)}.`,
    '',
    `── Hier sind die Kontaktdaten von ${card.fullName} ──`,
    ownerBlock,
    '',
    `Die vollständige Karte hängt als .vcf-Datei an — einfach öffnen, um ${card.fullName} in deine Kontakte zu übernehmen.`,
    '',
    'Viele Grüße',
  ].join('\n');
}

export async function POST(request: Request) {
  let body: ExchangePayload;
  try {
    body = (await request.json()) as ExchangePayload;
  } catch {
    return Response.json({ success: false, error: 'Ungültige Anfrage.' }, { status: 400 });
  }

  // --- Spamschutz: Honeypot & Timing → still ein "Erfolg" vortäuschen, damit
  // Bots keine Rückmeldung über den Filter bekommen. ---
  if (body.website && body.website.trim() !== '') {
    return Response.json({ success: true, message: OK_MESSAGE });
  }
  if (typeof body.ts !== 'number' || Date.now() - body.ts < MIN_FILL_MS) {
    return Response.json({ success: true, message: OK_MESSAGE });
  }

  // --- Rate-Limit pro IP (5 / 10 min) ---
  const limit = rateLimit(`exchange:${clientIp(request)}`);
  if (!limit.allowed) {
    return Response.json(
      { success: false, error: 'Zu viele Anfragen. Bitte versuche es in ein paar Minuten erneut.' },
      { status: 429 },
    );
  }

  // --- Validierung ---
  const vorname = body.vorname?.trim() ?? '';
  const nachname = body.nachname?.trim() ?? '';
  const email = body.email?.trim() ?? '';
  const telefon = body.telefon?.trim() ?? '';

  const card = body.slug ? getCardBySlug(body.slug) : undefined;
  if (!card) {
    return Response.json({ success: false, error: 'Unbekannte Karte.' }, { status: 400 });
  }
  if (!body.consent) {
    return Response.json(
      { success: false, error: 'Bitte stimme der Verarbeitung deiner Daten zu.' },
      { status: 400 },
    );
  }
  if (!vorname || !nachname) {
    return Response.json(
      { success: false, error: 'Bitte gib Vor- und Nachnamen an.' },
      { status: 400 },
    );
  }
  if (!email && !telefon) {
    return Response.json(
      { success: false, error: 'Bitte gib mindestens eine E-Mail-Adresse oder Telefonnummer an.' },
      { status: 400 },
    );
  }
  if (email && !EMAIL_RE.test(email)) {
    return Response.json(
      { success: false, error: 'Bitte gib eine gültige E-Mail-Adresse ein.' },
      { status: 400 },
    );
  }

  const now = new Date();
  const cleaned: ExchangePayload = {
    vorname,
    nachname,
    email: email || undefined,
    telefon: telefon || undefined,
    firma: body.firma?.trim() || undefined,
    position: body.position?.trim() || undefined,
    nachricht: body.nachricht?.trim() || undefined,
  };

  // --- Besucher-.vcf: NOTE = Datum + Kartenname + Nachricht ---
  const noteParts = [
    `Kennengelernt über digitale Kontaktkarte (${card.org ?? card.fullName}) am ${germanDate(now)}.`,
  ];
  if (cleaned.nachricht) noteParts.push('', cleaned.nachricht);

  const visitorVcf = buildVCard({
    uid: crypto.randomUUID(),
    firstName: vorname,
    lastName: nachname,
    fullName: `${vorname} ${nachname}`,
    org: cleaned.firma,
    title: cleaned.position,
    emails: cleaned.email ? [{ type: 'work', value: cleaned.email }] : [],
    phones: cleaned.telefon ? [{ type: 'cell', value: cleaned.telefon }] : [],
    note: noteParts.join('\n'),
  });

  const visitorFile = `${nameSlug(vorname, nachname)}.vcf`;

  // --- Mail an Owner (Pflicht) ---
  try {
    await sendMail({
      to: card.inboxEmail,
      subject: `Neuer Kontakt über deine Karte: ${vorname} ${nachname}`,
      text: ownerMailText(cleaned, now),
      attachments: [
        { filename: visitorFile, content: visitorVcf, contentType: 'text/vcard; charset=utf-8' },
      ],
    });
  } catch (error) {
    console.error('Exchange: Owner-Mail fehlgeschlagen:', error);
    return Response.json(
      {
        success: false,
        error:
          'Deine Daten konnten gerade nicht zugestellt werden. Bitte versuche es später erneut oder schreib direkt an hallo@broetzens.de.',
      },
      { status: 502 },
    );
  }

  // --- Bestätigungsmail an Besucher (entfällt still ohne E-Mail) ---
  if (cleaned.email) {
    try {
      await sendMail({
        to: cleaned.email,
        subject: `Deine Kontaktdaten bei ${card.org ?? card.fullName} sind angekommen`,
        text: confirmationMailText(card, cleaned, now),
        attachments: [
          {
            filename: `${card.slug}.vcf`,
            content: buildOwnerVCard(card),
            contentType: 'text/vcard; charset=utf-8',
          },
        ],
      });
    } catch (error) {
      // Bestätigung ist nice-to-have; der Owner hat die Daten bereits.
      console.error('Exchange: Bestätigungsmail fehlgeschlagen:', error);
    }
  }

  return Response.json({ success: true, message: OK_MESSAGE });
}
