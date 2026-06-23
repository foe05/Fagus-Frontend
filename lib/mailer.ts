// Nodemailer-SMTP-Transport für die digitale Kontaktkarte
// (Spec docs/Contact.md, Abschnitte 7 & 11).
//
// Server-only: liest ausschließlich SMTP_*-Env-Variablen. Niemals aus einer
// Client-Komponente importieren — die Zugangsdaten dürfen das Bundle nie
// erreichen. Versand läuft DSGVO-konform über eigene Infrastruktur (IONOS /
// eigener Mailserver), kein US-Drittdienst.

import nodemailer, { type Transporter } from 'nodemailer';

let cachedTransporter: Transporter | null = null;

/** Lazily erzeugter, wiederverwendeter SMTP-Transport. */
function getTransporter(): Transporter {
  if (cachedTransporter) return cachedTransporter;

  const host = process.env.SMTP_HOST;
  const port = Number(process.env.SMTP_PORT ?? '587');
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;

  if (!host || !user || !pass) {
    throw new Error(
      'SMTP-Konfiguration unvollständig — SMTP_HOST, SMTP_USER und SMTP_PASS müssen gesetzt sein.',
    );
  }

  cachedTransporter = nodemailer.createTransport({
    host,
    port,
    secure: port === 465, // 465 = implizites TLS, 587 = STARTTLS
    auth: { user, pass },
  });

  return cachedTransporter;
}

/** Absender aus SMTP_FROM, mit sinnvollem Fallback. */
export const MAIL_FROM =
  process.env.SMTP_FROM || 'Broetzens IT <kontakt@broetzens.de>';

export interface MailAttachment {
  filename: string;
  content: string | Buffer;
  contentType?: string;
}

export interface SendMailInput {
  to: string;
  subject: string;
  text: string;
  attachments?: MailAttachment[];
}

/** Versendet eine Plaintext-Mail (optional mit Anhängen) über SMTP. */
export async function sendMail(input: SendMailInput): Promise<void> {
  const transporter = getTransporter();
  await transporter.sendMail({
    from: MAIL_FROM,
    to: input.to,
    subject: input.subject,
    text: input.text,
    attachments: input.attachments,
  });
}
