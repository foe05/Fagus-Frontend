'use server';

export interface ContactFormData {
  name: string;
  email: string;
  company?: string;
  message: string;
}

/**
 * Send contact form email via the WordPress REST endpoint.
 * This routes through wp_mail() which uses the WP Mail SMTP plugin
 * for reliable delivery — no separate SMTP credentials needed in Next.js.
 */
export async function sendContactEmail(data: ContactFormData) {
  try {
    // Validation
    if (!data.name || !data.email || !data.message) {
      return {
        success: false,
        error: 'Bitte fülle alle Pflichtfelder aus.',
      };
    }

    // E-Mail-Validierung
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(data.email)) {
      return {
        success: false,
        error: 'Bitte gib eine gültige E-Mail-Adresse ein.',
      };
    }

    // Build the WordPress REST API URL for the contact endpoint
    const wpApiUrl = (
      process.env.WP_API_URL ??
      process.env.NEXT_PUBLIC_WP_API_URL ??
      'http://127.0.0.1/wp-json/wp/v2'
    ).replace(/\/+$/, '');
    const wpBaseUrl = wpApiUrl.replace(/\/wp\/v2\/?$/, '');
    const contactUrl = `${wpBaseUrl}/fagus/v1/contact`;

    const response = await fetch(contactUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: data.name,
        email: data.email,
        company: data.company || '',
        message: data.message,
      }),
    });

    const result = await response.json();

    if (result.success) {
      return {
        success: true,
        message: result.message || 'Vielen Dank! Wir haben deine Nachricht erhalten und melden uns in Kürze bei dir.',
      };
    }

    return {
      success: false,
      error: result.error || 'Ein Fehler ist aufgetreten. Bitte versuche es später erneut.',
    };
  } catch (error) {
    console.error('Contact form error:', error);
    return {
      success: false,
      error: 'Ein Fehler ist aufgetreten. Bitte versuche es später erneut oder kontaktiere uns direkt per E-Mail an hallo@broetzens.de.',
    };
  }
}
