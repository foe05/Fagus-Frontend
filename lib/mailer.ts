// Mailversand für die digitale Kontaktkarte (Spec docs/Contact.md, Abschnitt 7).
//
// Statt eines eigenen SMTP-Transports läuft der Versand — wie das bestehende
// Kontaktformular (app/actions/sendEmail.ts) — über WordPress: ein POST an den
// mu-plugin-Endpoint `fagus/v1/card-mail`, der `wp_mail()` aufruft und damit die
// vorhandene WP-Mail-SMTP-Zustellung (Hetzner) nutzt. So gibt es genau EINEN
// Mailweg und keine doppelten SMTP-Zugangsdaten.
//
// Server-only: liest CARD_MAIL_TOKEN aus der Umgebung. Niemals aus einer
// Client-Komponente importieren.

export interface MailAttachment {
  filename: string;
  content: string; // Dateiinhalt als String (hier: die .vcf)
  contentType?: string;
}

export interface SendMailInput {
  to: string;
  subject: string;
  text: string;
  attachments?: MailAttachment[];
}

/** Basis-URL der WordPress-REST-API (ohne /wp/v2), analog zu sendEmail.ts. */
function wpBaseUrl(): string {
  const wpApiUrl = (
    process.env.WP_API_URL ??
    process.env.NEXT_PUBLIC_WP_API_URL ??
    'http://127.0.0.1/wp-json/wp/v2'
  ).replace(/\/+$/, '');
  return wpApiUrl.replace(/\/wp\/v2\/?$/, '');
}

/**
 * Versendet eine Plaintext-Mail (optional mit einem .vcf-Anhang) über den
 * WordPress-Endpoint. Wirft bei fehlendem Token oder Zustellfehler — der Aufrufer
 * (app/api/exchange) entscheidet, ob das ein harter Fehler ist (Owner-Mail) oder
 * still ignoriert wird (Bestätigungsmail).
 */
export async function sendMail(input: SendMailInput): Promise<void> {
  const token = process.env.CARD_MAIL_TOKEN;
  if (!token) {
    throw new Error(
      'CARD_MAIL_TOKEN ist nicht gesetzt — der Karten-Mailversand ist deaktiviert.',
    );
  }

  const attachment = input.attachments?.[0];
  const url = `${wpBaseUrl()}/fagus/v1/card-mail`;

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Fagus-Token': token,
    },
    cache: 'no-store',
    body: JSON.stringify({
      to: input.to,
      subject: input.subject,
      text: input.text,
      vcf: attachment?.content,
      vcf_filename: attachment?.filename,
    }),
  });

  const data = (await response.json().catch(() => null)) as
    | { success?: boolean; error?: string }
    | null;

  if (!response.ok || !data?.success) {
    throw new Error(data?.error ?? `WP card-mail antwortete mit ${response.status}.`);
  }
}
