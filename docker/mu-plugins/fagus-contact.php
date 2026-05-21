<?php
/**
 * Plugin Name: Fagus Contact Form REST API
 * Description: REST endpoint for contact form submissions using wp_mail().
 *              Leverages WP Mail SMTP plugin for reliable email delivery.
 * Version: 1.0.0
 */

add_action('rest_api_init', function () {
    register_rest_route('fagus/v1', '/contact', [
        'methods'             => 'POST',
        'callback'            => 'fagus_handle_contact_form',
        'permission_callback' => '__return_true',
    ]);
});

/**
 * Handle contact form submission.
 */
function fagus_handle_contact_form(WP_REST_Request $request) {
    $name    = sanitize_text_field($request->get_param('name') ?? '');
    $email   = sanitize_email($request->get_param('email') ?? '');
    $company = sanitize_text_field($request->get_param('company') ?? '');
    $message = sanitize_textarea_field($request->get_param('message'));
    $source  = sanitize_text_field($request->get_param('source') ?? '');

    // For campaign sources (e.g. rostock-postkarte) only the message is required –
    // name and email are explicitly optional per briefing. For the standard
    // /kontakt form, all three remain required.
    if (empty($source)) {
        if (empty($name) || empty($email) || empty($message)) {
            return new WP_REST_Response([
                'success' => false,
                'error'   => 'Bitte fülle alle Pflichtfelder aus.',
            ], 400);
        }
    } else {
        if (empty($message)) {
            return new WP_REST_Response([
                'success' => false,
                'error'   => 'Bitte beschreibe dein Anliegen.',
            ], 400);
        }
    }

    // Validate email format only when provided
    if (!empty($email) && !is_email($email)) {
        return new WP_REST_Response([
            'success' => false,
            'error'   => 'Bitte gib eine gültige E-Mail-Adresse ein.',
        ], 400);
    }

    // Rate limiting: max 5 submissions per IP per hour
    $ip       = $_SERVER['REMOTE_ADDR'] ?? 'unknown';
    $rate_key = 'fagus_contact_' . md5($ip);
    $attempts = (int) get_transient($rate_key);

    if ($attempts >= 5) {
        return new WP_REST_Response([
            'success' => false,
            'error'   => 'Zu viele Anfragen. Bitte versuche es später erneut.',
        ], 429);
    }

    set_transient($rate_key, $attempts + 1, HOUR_IN_SECONDS);

    // Recipient – configurable via WP option, falls back to default
    $to = get_option('fagus_contact_email', 'hallo@broetzens.de');

    // Subject – campaign source gets a bracket-prefix so emails sort easily.
    $subject_prefix = $source ? '[' . $source . '] ' : '';
    $subject_from   = $name !== '' ? $name : ($email !== '' ? $email : 'anonym');
    $subject = sprintf(
        '%sNeue Kontaktanfrage von %s%s',
        $subject_prefix,
        $subject_from,
        $company ? " ($company)" : ''
    );

    // Escape for HTML email body
    $safe_name    = esc_html($name);
    $safe_email   = esc_html($email);
    $safe_company = esc_html($company);
    $safe_source  = esc_html($source);
    $safe_message = nl2br(esc_html($message));
    $date_str     = wp_date('j. F Y, H:i');

    // HTML email body
    $body = <<<HTML
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #2C2C2C; margin: 0; padding: 0;">
  <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
    <div style="background: linear-gradient(135deg, #3E4E3A 0%, #6B8E5C 100%); color: white; padding: 30px; border-radius: 8px 8px 0 0; text-align: center;">
      <h1 style="margin: 0;">Neue Kontaktanfrage</h1>
      <p style="margin: 10px 0 0 0; opacity: 0.9;">Broetzens IT Cattles &amp; Cows</p>
    </div>
    <div style="background: #F8F8F8; padding: 30px; border-radius: 0 0 8px 8px;">
HTML;

    if ($safe_source) {
        $body .= <<<HTML
      <div style="margin-bottom: 20px;">
        <div style="font-weight: 500; color: #616161; font-size: 12px; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 5px;">Quelle</div>
        <div style="font-size: 16px; color: #2C2C2C; padding: 10px; background: white; border-radius: 4px; border-left: 3px solid #6B4A30;">{$safe_source}</div>
      </div>
HTML;
    }

    if ($safe_name) {
        $body .= <<<HTML
      <div style="margin-bottom: 20px;">
        <div style="font-weight: 500; color: #616161; font-size: 12px; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 5px;">Name</div>
        <div style="font-size: 16px; color: #2C2C2C; padding: 10px; background: white; border-radius: 4px; border-left: 3px solid #3E4E3A;">{$safe_name}</div>
      </div>
HTML;
    }

    if ($safe_email) {
        $body .= <<<HTML
      <div style="margin-bottom: 20px;">
        <div style="font-weight: 500; color: #616161; font-size: 12px; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 5px;">E-Mail</div>
        <div style="font-size: 16px; color: #2C2C2C; padding: 10px; background: white; border-radius: 4px; border-left: 3px solid #3E4E3A;">
          <a href="mailto:{$safe_email}" style="color: #3E4E3A; text-decoration: none;">{$safe_email}</a>
        </div>
      </div>
HTML;
    }

    if ($safe_company) {
        $body .= <<<HTML
      <div style="margin-bottom: 20px;">
        <div style="font-weight: 500; color: #616161; font-size: 12px; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 5px;">Unternehmen / Forstbetrieb</div>
        <div style="font-size: 16px; color: #2C2C2C; padding: 10px; background: white; border-radius: 4px; border-left: 3px solid #3E4E3A;">{$safe_company}</div>
      </div>
HTML;
    }

    $body .= <<<HTML
      <div style="margin-bottom: 20px;">
        <div style="font-weight: 500; color: #616161; font-size: 12px; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 5px;">Nachricht</div>
        <div style="font-size: 16px; color: #2C2C2C; padding: 10px; background: white; border-radius: 4px; border-left: 3px solid #3E4E3A; white-space: pre-wrap; word-wrap: break-word;">{$safe_message}</div>
      </div>
    </div>
    <div style="text-align: center; margin-top: 30px; padding: 20px; color: #9E9E9E; font-size: 12px;">
      Diese Nachricht wurde über das Kontaktformular auf broetzens.de gesendet.<br>
      Gesendet am {$date_str}
    </div>
  </div>
</body>
</html>
HTML;

    // Headers
    $headers = ['Content-Type: text/html; charset=UTF-8'];
    if (!empty($email)) {
        $headers[] = $name !== ''
            ? sprintf('Reply-To: %s <%s>', $name, $email)
            : sprintf('Reply-To: %s', $email);
    }

    // Send via wp_mail() – uses WP Mail SMTP plugin configuration
    $sent = wp_mail($to, $subject, $body, $headers);

    if ($sent) {
        return new WP_REST_Response([
            'success' => true,
            'message' => 'Vielen Dank! Wir haben deine Nachricht erhalten und melden uns in Kürze bei dir.',
        ], 200);
    }

    return new WP_REST_Response([
        'success' => false,
        'error'   => 'Die E-Mail konnte nicht gesendet werden. Bitte kontaktiere uns direkt unter hallo@broetzens.de.',
    ], 500);
}
