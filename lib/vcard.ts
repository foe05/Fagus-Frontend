// vCard-3.0-Generator (Spec docs/Contact.md, Abschnitt 5).
//
// Format vCard 3.0 — beste Kompatibilität mit iOS, Android und Nextcloud.
// Zeilen werden mit CRLF getrennt; der String endet ebenfalls auf CRLF.
//
// Das Escaping ist der kritischste Teil: in Textwerten müssen
//   \  → \\
//   ;  → \;
//   ,  → \,
//   Zeilenumbruch → \n
// escaped werden. WICHTIG: nur die *Inhalte* werden escaped, niemals die
// Strukturtrenner. Im N- und ADR-Feld trennen unescapte `;` die Komponenten —
// deshalb escapen wir jede Komponente einzeln und fügen die rohen `;` selbst ein.

import type { ContactCard } from './cards';

export interface VCardInput {
  uid: string; // stabil (Owner: slug@broetzens.de) oder UUID (Besucher)
  firstName: string;
  lastName: string;
  fullName: string; // FN (Pflicht)
  org?: string;
  title?: string;
  emails?: { type: string; value: string }[];
  phones?: { type: string; value: string }[];
  url?: string;
  addresses?: {
    type: string;
    street?: string;
    city?: string;
    zip?: string;
    country?: string;
  }[];
  photoUrl?: string; // wird als PHOTO;VALUE=URI ausgegeben
  note?: string;
  // REV-Timestamp (UTC). Optional injizierbar für deterministische Tests;
  // Default ist der aktuelle Zeitpunkt.
  rev?: Date;
}

/**
 * Escaped einen Textwert nach vCard-3.0-Regeln. Reihenfolge ist wichtig:
 * der Backslash zuerst, damit die später eingefügten Escape-Backslashes
 * nicht ein zweites Mal verdoppelt werden.
 */
function escapeText(value: string): string {
  return value
    .replace(/\\/g, '\\\\')
    .replace(/\r\n|\r|\n/g, '\\n')
    .replace(/,/g, '\\,')
    .replace(/;/g, '\\;');
}

/**
 * URI-Werte (URL, PHOTO) werden NICHT wie Text escaped: Kommas und Semikola
 * sind in URLs gültige Zeichen und ihr Escaping bricht viele Scanner/Importer.
 * Wir entfernen lediglich Zeilenumbrüche, die eine vCard-Zeile zerstören würden.
 */
function sanitizeUri(value: string): string {
  return value.replace(/\r\n|\r|\n/g, '');
}

/** UTC-Timestamp im Format YYYYMMDDTHHMMSSZ. */
function revTimestamp(date: Date): string {
  return date
    .toISOString()
    .replace(/[-:]/g, '')
    .replace(/\.\d{3}Z$/, 'Z');
}

/**
 * Faltet eine Zeile > 75 Oktette nach RFC 2426: Fortsetzungszeilen beginnen
 * mit einem einzelnen Leerzeichen. Es wird an Zeichen-, nie an Byte-Grenzen
 * getrennt, damit Mehrbyte-UTF-8-Sequenzen (Umlaute!) intakt bleiben.
 */
function foldLine(line: string): string {
  const MAX = 75;
  const encoder = new TextEncoder();
  if (encoder.encode(line).length <= MAX) return line;

  const out: string[] = [];
  let current = '';
  let currentBytes = 0;
  let isFirst = true;

  for (const ch of line) {
    const chBytes = encoder.encode(ch).length;
    // Fortsetzungszeilen tragen ein führendes Leerzeichen, das auf die
    // 75 Oktette zählt — daher 1 Byte reservieren.
    const cap = isFirst ? MAX : MAX - 1;
    if (currentBytes + chBytes > cap) {
      out.push(current);
      current = ch;
      currentBytes = chBytes;
      isFirst = false;
    } else {
      current += ch;
      currentBytes += chBytes;
    }
  }
  out.push(current);

  return out.map((l, i) => (i === 0 ? l : ' ' + l)).join('\r\n');
}

/** Baut einen vollständigen vCard-3.0-String. */
export function buildVCard(input: VCardInput): string {
  const lines: string[] = [];

  lines.push('BEGIN:VCARD');
  lines.push('VERSION:3.0');
  if (input.uid) lines.push(`UID:${escapeText(input.uid)}`);
  lines.push(`FN:${escapeText(input.fullName)}`);
  // N: Nachname;Vorname;Zusatz;Präfix;Suffix — nur Inhalte escapen.
  lines.push(`N:${escapeText(input.lastName)};${escapeText(input.firstName)};;;`);

  if (input.org) lines.push(`ORG:${escapeText(input.org)}`);
  if (input.title) lines.push(`TITLE:${escapeText(input.title)}`);

  for (const email of input.emails ?? []) {
    if (!email.value) continue;
    lines.push(`EMAIL;TYPE=${email.type.toUpperCase()}:${escapeText(email.value)}`);
  }
  for (const phone of input.phones ?? []) {
    if (!phone.value) continue;
    lines.push(`TEL;TYPE=${phone.type.toUpperCase()}:${escapeText(phone.value)}`);
  }

  if (input.url) lines.push(`URL:${sanitizeUri(input.url)}`);

  for (const addr of input.addresses ?? []) {
    // ADR: PO-Box;Erweiterung;Straße;Ort;Region;PLZ;Land — Inhalte escapen,
    // Strukturtrenner `;` roh.
    const adr = [
      '',
      '',
      addr.street ?? '',
      addr.city ?? '',
      '',
      addr.zip ?? '',
      addr.country ?? '',
    ]
      .map(escapeText)
      .join(';');
    lines.push(`ADR;TYPE=${addr.type.toUpperCase()}:${adr}`);
  }

  if (input.photoUrl) lines.push(`PHOTO;VALUE=URI:${sanitizeUri(input.photoUrl)}`);
  if (input.note) lines.push(`NOTE:${escapeText(input.note)}`);

  lines.push(`REV:${revTimestamp(input.rev ?? new Date())}`);
  lines.push('END:VCARD');

  // Zeilen falten, mit CRLF verbinden und mit CRLF abschließen.
  return lines.map(foldLine).join('\r\n') + '\r\n';
}

/**
 * Baut die Owner-vCard aus einer Registry-Karte. Wird sowohl vom
 * Download-Route-Handler als auch von der Besucher-Bestätigungsmail genutzt.
 * UID ist stabil (`slug@broetzens.de`), damit Re-Importe denselben Kontakt
 * aktualisieren statt zu duplizieren.
 */
export function buildOwnerVCard(card: ContactCard): string {
  return buildVCard({
    uid: `${card.slug}@broetzens.de`,
    firstName: card.firstName,
    lastName: card.lastName,
    fullName: card.fullName,
    org: card.org,
    title: card.title,
    emails: card.emails,
    phones: card.phones,
    url: card.url,
    addresses: card.addresses,
    photoUrl: card.photoUrl,
    note: card.note,
  });
}
