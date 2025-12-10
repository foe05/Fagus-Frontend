'use server';

import nodemailer from 'nodemailer';

export interface ContactFormData {
  name: string;
  email: string;
  company?: string;
  message: string;
}

export async function sendContactEmail(data: ContactFormData) {
  try {
    // Validierung
    if (!data.name || !data.email || !data.message) {
      return {
        success: false,
        error: 'Bitte füllen Sie alle Pflichtfelder aus.',
      };
    }

    // E-Mail-Validierung
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(data.email)) {
      return {
        success: false,
        error: 'Bitte geben Sie eine gültige E-Mail-Adresse ein.',
      };
    }

    // SMTP Transporter erstellen
    // WICHTIG: Umgebungsvariablen müssen gesetzt sein
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'smtp.gmail.com',
      port: parseInt(process.env.SMTP_PORT || '587'),
      secure: process.env.SMTP_SECURE === 'true', // true für 465, false für 587
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    // E-Mail-Inhalt
    const mailOptions = {
      from: `"${data.name}" <${process.env.SMTP_USER}>`,
      to: process.env.CONTACT_EMAIL || 'kontakt@broetzens.de',
      replyTo: data.email,
      subject: `Neue Kontaktanfrage von ${data.name}${data.company ? ` (${data.company})` : ''}`,
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <style>
              body {
                font-family: 'Roboto', Arial, sans-serif;
                line-height: 1.6;
                color: #2C2C2C;
              }
              .container {
                max-width: 600px;
                margin: 0 auto;
                padding: 20px;
              }
              .header {
                background: linear-gradient(135deg, #3E4E3A 0%, #6B8E5C 100%);
                color: white;
                padding: 30px;
                border-radius: 8px 8px 0 0;
                text-align: center;
              }
              .content {
                background: #F8F8F8;
                padding: 30px;
                border-radius: 0 0 8px 8px;
              }
              .field {
                margin-bottom: 20px;
              }
              .label {
                font-weight: 500;
                color: #616161;
                font-size: 12px;
                text-transform: uppercase;
                letter-spacing: 0.5px;
                margin-bottom: 5px;
              }
              .value {
                font-size: 16px;
                color: #2C2C2C;
                padding: 10px;
                background: white;
                border-radius: 4px;
                border-left: 3px solid #3E4E3A;
              }
              .message {
                white-space: pre-wrap;
                word-wrap: break-word;
              }
              .footer {
                text-align: center;
                margin-top: 30px;
                padding: 20px;
                color: #9E9E9E;
                font-size: 12px;
              }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h1 style="margin: 0;">Neue Kontaktanfrage</h1>
                <p style="margin: 10px 0 0 0; opacity: 0.9;">Broetzens IT Cattles & Cows</p>
              </div>

              <div class="content">
                <div class="field">
                  <div class="label">Name</div>
                  <div class="value">${data.name}</div>
                </div>

                <div class="field">
                  <div class="label">E-Mail</div>
                  <div class="value">
                    <a href="mailto:${data.email}" style="color: #3E4E3A; text-decoration: none;">
                      ${data.email}
                    </a>
                  </div>
                </div>

                ${data.company ? `
                  <div class="field">
                    <div class="label">Unternehmen / Forstbetrieb</div>
                    <div class="value">${data.company}</div>
                  </div>
                ` : ''}

                <div class="field">
                  <div class="label">Nachricht</div>
                  <div class="value message">${data.message}</div>
                </div>
              </div>

              <div class="footer">
                Diese Nachricht wurde über das Kontaktformular auf broetzens.de gesendet.
                <br>
                Gesendet am ${new Date().toLocaleString('de-DE', {
                  dateStyle: 'long',
                  timeStyle: 'short',
                })}
              </div>
            </div>
          </body>
        </html>
      `,
      text: `
Neue Kontaktanfrage

Name: ${data.name}
E-Mail: ${data.email}
${data.company ? `Unternehmen: ${data.company}` : ''}

Nachricht:
${data.message}

---
Gesendet am ${new Date().toLocaleString('de-DE')}
      `.trim(),
    };

    // E-Mail senden
    await transporter.sendMail(mailOptions);

    return {
      success: true,
      message: 'Vielen Dank! Wir haben Ihre Nachricht erhalten und melden uns in Kürze bei Ihnen.',
    };
  } catch (error) {
    console.error('E-Mail Fehler:', error);
    return {
      success: false,
      error: 'Ein Fehler ist aufgetreten. Bitte versuchen Sie es später erneut oder kontaktieren Sie uns direkt per E-Mail.',
    };
  }
}
