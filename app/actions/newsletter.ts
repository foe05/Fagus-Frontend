'use server';

import nodemailer from 'nodemailer';
import crypto from 'crypto';

export interface NewsletterSubscriptionData {
  email: string;
  topics: string[];
  gdprConsent: boolean;
}

interface PendingSubscription {
  email: string;
  topics: string[];
  token: string;
  timestamp: number;
}

// In-Memory-Speicher für ausstehende Bestätigungen
// In Produktion sollte dies durch eine Datenbank ersetzt werden
const pendingSubscriptions = new Map<string, PendingSubscription>();

// Token-Gültigkeitsdauer: 24 Stunden
const TOKEN_EXPIRY = 24 * 60 * 60 * 1000;

/**
 * Generiert einen sicheren Token für die Bestätigung
 */
function generateToken(): string {
  return crypto.randomBytes(32).toString('hex');
}

/**
 * Erstellt einen SMTP-Transporter
 */
function createTransporter() {
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.SMTP_PORT || '587'),
    secure: process.env.SMTP_SECURE === 'true',
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });
}

/**
 * Schritt 1: Newsletter-Anmeldung mit Double-Opt-In
 */
export async function subscribeToNewsletter(data: NewsletterSubscriptionData) {
  try {
    // Validierung
    if (!data.email) {
      return {
        success: false,
        error: 'Bitte geben Sie Ihre E-Mail-Adresse ein.',
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

    // GDPR-Consent-Prüfung
    if (!data.gdprConsent) {
      return {
        success: false,
        error: 'Bitte stimmen Sie der Datenschutzerklärung zu.',
      };
    }

    // Token generieren und Subscription temporär speichern
    const token = generateToken();
    pendingSubscriptions.set(token, {
      email: data.email,
      topics: data.topics || [],
      token,
      timestamp: Date.now(),
    });

    // Bestätigungs-E-Mail senden
    const confirmationUrl = `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/newsletter/bestaetigung?token=${token}`;

    const transporter = createTransporter();
    const mailOptions = {
      from: `"Broetzens IT" <${process.env.SMTP_USER}>`,
      to: data.email,
      subject: 'Newsletter-Anmeldung bestätigen',
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
              .button {
                display: inline-block;
                padding: 15px 30px;
                background: linear-gradient(135deg, #3E4E3A 0%, #6B8E5C 100%);
                color: white;
                text-decoration: none;
                border-radius: 6px;
                margin: 20px 0;
                font-weight: 500;
              }
              .topics {
                background: white;
                padding: 15px;
                border-radius: 4px;
                border-left: 3px solid #3E4E3A;
                margin: 20px 0;
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
                <h1 style="margin: 0;">Newsletter-Anmeldung</h1>
                <p style="margin: 10px 0 0 0; opacity: 0.9;">Broetzens IT Cattles & Cows</p>
              </div>

              <div class="content">
                <h2 style="color: #3E4E3A; margin-top: 0;">Bestätigen Sie Ihre Anmeldung</h2>

                <p>Vielen Dank für Ihr Interesse an unserem Newsletter!</p>

                <p>Um Ihre Anmeldung abzuschließen, bestätigen Sie bitte Ihre E-Mail-Adresse durch Klick auf den folgenden Button:</p>

                <div style="text-align: center;">
                  <a href="${confirmationUrl}" class="button">
                    Newsletter-Anmeldung bestätigen
                  </a>
                </div>

                ${data.topics.length > 0 ? `
                  <div class="topics">
                    <strong>Ihre gewählten Themen:</strong>
                    <ul style="margin: 10px 0 0 0; padding-left: 20px;">
                      ${data.topics.map(topic => {
                        const topicLabels: { [key: string]: string } = {
                          'digitalization': 'Digitalisierungs-Tipps',
                          'ai': 'AI-Trends',
                          'products': 'Produkt-Updates'
                        };
                        return `<li>${topicLabels[topic] || topic}</li>`;
                      }).join('')}
                    </ul>
                  </div>
                ` : ''}

                <p style="color: #616161; font-size: 14px; margin-top: 30px;">
                  <strong>Hinweis:</strong> Dieser Link ist 24 Stunden gültig.
                  Falls Sie sich nicht für unseren Newsletter angemeldet haben, ignorieren Sie diese E-Mail einfach.
                </p>
              </div>

              <div class="footer">
                Diese E-Mail wurde gesendet von Broetzens IT Cattles & Cows
                <br>
                Rosenblathstrasse 11, 34121 Kassel, Deutschland
                <br><br>
                <a href="mailto:hallo@broetzens.de" style="color: #9E9E9E;">hallo@broetzens.de</a>
              </div>
            </div>
          </body>
        </html>
      `,
      text: `
Newsletter-Anmeldung bestätigen

Vielen Dank für Ihr Interesse an unserem Newsletter!

Um Ihre Anmeldung abzuschließen, öffnen Sie bitte den folgenden Link:
${confirmationUrl}

${data.topics.length > 0 ? `
Ihre gewählten Themen:
${data.topics.map(topic => {
  const topicLabels: { [key: string]: string } = {
    'digitalization': 'Digitalisierungs-Tipps',
    'ai': 'AI-Trends',
    'products': 'Produkt-Updates'
  };
  return `- ${topicLabels[topic] || topic}`;
}).join('\n')}
` : ''}

Dieser Link ist 24 Stunden gültig.
Falls Sie sich nicht für unseren Newsletter angemeldet haben, ignorieren Sie diese E-Mail einfach.

---
Broetzens IT Cattles & Cows
Rosenblathstrasse 11, 34121 Kassel, Deutschland
hallo@broetzens.de
      `.trim(),
    };

    await transporter.sendMail(mailOptions);

    return {
      success: true,
      message: 'Vielen Dank! Bitte prüfen Sie Ihr E-Mail-Postfach und bestätigen Sie Ihre Anmeldung.',
    };
  } catch (error) {
    console.error('Newsletter-Anmeldung Fehler:', error);
    return {
      success: false,
      error: 'Ein Fehler ist aufgetreten. Bitte versuchen Sie es später erneut.',
    };
  }
}

/**
 * Schritt 2: Bestätigung der Newsletter-Anmeldung
 */
export async function confirmSubscription(token: string) {
  try {
    // Token validieren
    if (!token) {
      return {
        success: false,
        error: 'Ungültiger Bestätigungslink.',
      };
    }

    // Subscription abrufen
    const subscription = pendingSubscriptions.get(token);

    if (!subscription) {
      return {
        success: false,
        error: 'Dieser Bestätigungslink ist ungültig oder wurde bereits verwendet.',
      };
    }

    // Token-Ablauf prüfen
    if (Date.now() - subscription.timestamp > TOKEN_EXPIRY) {
      pendingSubscriptions.delete(token);
      return {
        success: false,
        error: 'Dieser Bestätigungslink ist abgelaufen. Bitte melden Sie sich erneut an.',
      };
    }

    // Zu E-Mail-Liste hinzufügen (Brevo/Mailchimp)
    const provider = process.env.NEWSLETTER_PROVIDER || 'mailchimp';

    if (provider === 'brevo') {
      // Brevo-Integration
      const brevoApiKey = process.env.BREVO_API_KEY;
      const brevoListId = process.env.BREVO_LIST_ID;

      if (!brevoApiKey || !brevoListId) {
        console.error('Brevo nicht konfiguriert');
        return {
          success: false,
          error: 'Newsletter-Service nicht konfiguriert.',
        };
      }

      const response = await fetch('https://api.brevo.com/v3/contacts', {
        method: 'POST',
        headers: {
          'accept': 'application/json',
          'content-type': 'application/json',
          'api-key': brevoApiKey,
        },
        body: JSON.stringify({
          email: subscription.email,
          listIds: [parseInt(brevoListId)],
          attributes: {
            TOPICS: subscription.topics.join(','),
          },
          updateEnabled: true,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Brevo API Fehler:', errorData);
        return {
          success: false,
          error: 'Fehler beim Hinzufügen zur Newsletter-Liste.',
        };
      }
    } else if (provider === 'mailchimp') {
      // Mailchimp-Integration
      const mailchimpApiKey = process.env.MAILCHIMP_API_KEY;
      const audienceId = process.env.MAILCHIMP_AUDIENCE_ID;
      const serverPrefix = process.env.MAILCHIMP_SERVER_PREFIX || 'us1';

      if (!mailchimpApiKey || !audienceId) {
        console.error('Mailchimp nicht konfiguriert');
        return {
          success: false,
          error: 'Newsletter-Service nicht konfiguriert.',
        };
      }

      const response = await fetch(
        `https://${serverPrefix}.api.mailchimp.com/3.0/lists/${audienceId}/members`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${mailchimpApiKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email_address: subscription.email,
            status: 'subscribed',
            merge_fields: {
              TOPICS: subscription.topics.join(','),
            },
          }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Mailchimp API Fehler:', errorData);
        return {
          success: false,
          error: 'Fehler beim Hinzufügen zur Newsletter-Liste.',
        };
      }
    }

    // Willkommens-E-Mail senden
    const transporter = createTransporter();
    const mailOptions = {
      from: `"Broetzens IT" <${process.env.SMTP_USER}>`,
      to: subscription.email,
      subject: 'Willkommen beim Broetzens IT Newsletter!',
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
              .card {
                background: white;
                padding: 20px;
                border-radius: 6px;
                margin: 15px 0;
                border-left: 3px solid #3E4E3A;
              }
              .button {
                display: inline-block;
                padding: 12px 25px;
                background: linear-gradient(135deg, #3E4E3A 0%, #6B8E5C 100%);
                color: white;
                text-decoration: none;
                border-radius: 6px;
                margin: 10px 5px;
                font-weight: 500;
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
                <h1 style="margin: 0;">🎉 Willkommen!</h1>
                <p style="margin: 10px 0 0 0; opacity: 0.9;">Broetzens IT Cattles & Cows</p>
              </div>

              <div class="content">
                <h2 style="color: #3E4E3A; margin-top: 0;">Schön, dass Sie dabei sind!</h2>

                <p>Ihre Newsletter-Anmeldung wurde erfolgreich bestätigt. Ab sofort erhalten Sie regelmäßig wertvolle Insights zu:</p>

                <div class="card">
                  <h3 style="margin: 0 0 10px 0; color: #3E4E3A;">🌲 Digitalisierung im Forst</h3>
                  <p style="margin: 0;">Praktische Tipps zur digitalen Transformation in Forstbetrieben</p>
                </div>

                <div class="card">
                  <h3 style="margin: 0 0 10px 0; color: #3E4E3A;">🤖 Künstliche Intelligenz</h3>
                  <p style="margin: 0;">Neueste Entwicklungen und Anwendungen von KI in der Forstwirtschaft</p>
                </div>

                <div class="card">
                  <h3 style="margin: 0 0 10px 0; color: #3E4E3A;">🚀 Produkt-Updates</h3>
                  <p style="margin: 0;">Informationen zu neuen Features und Produkten von Broetzens IT</p>
                </div>

                <p style="margin-top: 30px;">Entdecken Sie in der Zwischenzeit unsere Ressourcen:</p>

                <div style="text-align: center;">
                  <a href="${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/ueber-uns/blog-wissen" class="button">
                    📚 Blog & Wissen
                  </a>
                  <a href="${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/ueber-uns/referenzen" class="button">
                    ⭐ Referenzen
                  </a>
                </div>

                <p style="color: #616161; font-size: 14px; margin-top: 30px;">
                  Sie können sich jederzeit <a href="${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/newsletter/abmelden?email=${encodeURIComponent(subscription.email)}" style="color: #3E4E3A;">hier abmelden</a>.
                </p>
              </div>

              <div class="footer">
                Broetzens IT Cattles & Cows
                <br>
                Rosenblathstrasse 11, 34121 Kassel, Deutschland
                <br><br>
                <a href="mailto:hallo@broetzens.de" style="color: #9E9E9E;">hallo@broetzens.de</a>
                <br>
                <a href="${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/newsletter/abmelden?email=${encodeURIComponent(subscription.email)}" style="color: #9E9E9E;">Abmelden</a>
              </div>
            </div>
          </body>
        </html>
      `,
      text: `
Willkommen beim Broetzens IT Newsletter!

Ihre Newsletter-Anmeldung wurde erfolgreich bestätigt. Ab sofort erhalten Sie regelmäßig wertvolle Insights zu:

🌲 Digitalisierung im Forst
   Praktische Tipps zur digitalen Transformation in Forstbetrieben

🤖 Künstliche Intelligenz
   Neueste Entwicklungen und Anwendungen von KI in der Forstwirtschaft

🚀 Produkt-Updates
   Informationen zu neuen Features und Produkten von Broetzens IT

Entdecken Sie unsere Ressourcen:
- Blog & Wissen: ${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/ueber-uns/blog-wissen
- Referenzen: ${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/ueber-uns/referenzen

Sie können sich jederzeit hier abmelden:
${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/newsletter/abmelden?email=${encodeURIComponent(subscription.email)}

---
Broetzens IT Cattles & Cows
Rosenblathstrasse 11, 34121 Kassel, Deutschland
hallo@broetzens.de
      `.trim(),
    };

    await transporter.sendMail(mailOptions);

    // Token aus Map entfernen
    pendingSubscriptions.delete(token);

    return {
      success: true,
      message: 'Ihre Newsletter-Anmeldung wurde erfolgreich bestätigt!',
    };
  } catch (error) {
    console.error('Newsletter-Bestätigung Fehler:', error);
    return {
      success: false,
      error: 'Ein Fehler ist aufgetreten. Bitte versuchen Sie es später erneut.',
    };
  }
}

/**
 * Newsletter-Abmeldung (Unsubscribe)
 */
export async function unsubscribeFromNewsletter(email: string) {
  try {
    // E-Mail-Validierung
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email)) {
      return {
        success: false,
        error: 'Ungültige E-Mail-Adresse.',
      };
    }

    // Von E-Mail-Liste entfernen (Brevo/Mailchimp)
    const provider = process.env.NEWSLETTER_PROVIDER || 'mailchimp';

    if (provider === 'brevo') {
      const brevoApiKey = process.env.BREVO_API_KEY;
      const brevoListId = process.env.BREVO_LIST_ID;

      if (!brevoApiKey || !brevoListId) {
        console.error('Brevo nicht konfiguriert');
        return {
          success: false,
          error: 'Newsletter-Service nicht konfiguriert.',
        };
      }

      // Kontakt von Liste entfernen
      const response = await fetch(
        `https://api.brevo.com/v3/contacts/lists/${brevoListId}/contacts/remove`,
        {
          method: 'POST',
          headers: {
            'accept': 'application/json',
            'content-type': 'application/json',
            'api-key': brevoApiKey,
          },
          body: JSON.stringify({
            emails: [email],
          }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Brevo API Fehler:', errorData);
        return {
          success: false,
          error: 'Fehler beim Abmelden vom Newsletter.',
        };
      }
    } else if (provider === 'mailchimp') {
      const mailchimpApiKey = process.env.MAILCHIMP_API_KEY;
      const audienceId = process.env.MAILCHIMP_AUDIENCE_ID;
      const serverPrefix = process.env.MAILCHIMP_SERVER_PREFIX || 'us1';

      if (!mailchimpApiKey || !audienceId) {
        console.error('Mailchimp nicht konfiguriert');
        return {
          success: false,
          error: 'Newsletter-Service nicht konfiguriert.',
        };
      }

      // Subscriber-Hash generieren (MD5 von lowercase email)
      const crypto = require('crypto');
      const subscriberHash = crypto
        .createHash('md5')
        .update(email.toLowerCase())
        .digest('hex');

      const response = await fetch(
        `https://${serverPrefix}.api.mailchimp.com/3.0/lists/${audienceId}/members/${subscriberHash}`,
        {
          method: 'PATCH',
          headers: {
            'Authorization': `Bearer ${mailchimpApiKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            status: 'unsubscribed',
          }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Mailchimp API Fehler:', errorData);
        return {
          success: false,
          error: 'Fehler beim Abmelden vom Newsletter.',
        };
      }
    }

    return {
      success: true,
      message: 'Sie wurden erfolgreich vom Newsletter abgemeldet. Schade, dass Sie gehen!',
    };
  } catch (error) {
    console.error('Newsletter-Abmeldung Fehler:', error);
    return {
      success: false,
      error: 'Ein Fehler ist aufgetreten. Bitte versuchen Sie es später erneut.',
    };
  }
}
