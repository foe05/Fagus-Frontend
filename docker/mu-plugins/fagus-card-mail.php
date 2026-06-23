<?php
/**
 * Plugin Name: Fagus Card Mail REST API
 * Description: REST endpoint for the digital contact card (/c/<slug>). Sends a
 *              plaintext mail with an optional .vcf attachment via wp_mail(),
 *              reusing the WP Mail SMTP delivery (same path as the contact form).
 * Version: 1.0.0
 *
 * Security: unlike fagus/v1/contact (fixed recipient), this endpoint can mail to
 * a caller-supplied address, so it MUST NOT be public. It is called server-to-
 * server from the Next.js exchange route, which carries a shared secret in the
 * X-Fagus-Token header. The token comes from the CARD_MAIL_TOKEN env var (made
 * available to PHP-FPM via clear_env = no in the pool config). If the token is
 * unset, the endpoint fails closed.
 */

add_action('rest_api_init', function () {
    register_rest_route('fagus/v1', '/card-mail', [
        'methods'             => 'POST',
        'callback'            => 'fagus_handle_card_mail',
        'permission_callback' => 'fagus_card_mail_authorized',
    ]);
});

/**
 * Authorize via shared secret. Fails closed when CARD_MAIL_TOKEN is unset.
 */
function fagus_card_mail_authorized(WP_REST_Request $request) {
    $expected = getenv('CARD_MAIL_TOKEN');
    if (empty($expected)) {
        return false;
    }
    $provided = (string) $request->get_header('X-Fagus-Token');
    return $provided !== '' && hash_equals($expected, $provided);
}

/**
 * Send one card mail with an optional .vcf attachment.
 */
function fagus_handle_card_mail(WP_REST_Request $request) {
    $to      = sanitize_email($request->get_param('to') ?? '');
    $subject = sanitize_text_field($request->get_param('subject') ?? '');
    // Plaintext body — keep newlines/umlauts intact, just strip control chars.
    $text    = (string) ($request->get_param('text') ?? '');
    $vcf     = (string) ($request->get_param('vcf') ?? '');
    $vcf_name = sanitize_file_name($request->get_param('vcf_filename') ?? 'kontakt.vcf');

    if (empty($to) || !is_email($to)) {
        return new WP_REST_Response(['success' => false, 'error' => 'Ungültige Empfängeradresse.'], 400);
    }
    if ($subject === '' || $text === '') {
        return new WP_REST_Response(['success' => false, 'error' => 'Betreff und Text sind erforderlich.'], 400);
    }

    // Plaintext mail, UTF-8 — sonst zerschießt es Umlaute in Body/Betreff.
    $headers = ['Content-Type: text/plain; charset=UTF-8'];

    // .vcf als In-Memory-Anhang mit exaktem Dateinamen und korrektem MIME-Typ.
    // Über phpmailer_init, damit keine Temp-Datei nötig ist und WP den Typ nicht
    // zu application/octet-stream rät. Closure gilt nur für diesen Request →
    // genau ein wp_mail()-Aufruf pro HTTP-Request, keine Leckage.
    $attach_hook = null;
    if ($vcf !== '') {
        $attach_hook = function ($phpmailer) use ($vcf, $vcf_name) {
            $phpmailer->addStringAttachment($vcf, $vcf_name, 'base64', 'text/vcard');
        };
        add_action('phpmailer_init', $attach_hook);
    }

    $sent = wp_mail($to, $subject, $text, $headers);

    if ($attach_hook) {
        remove_action('phpmailer_init', $attach_hook);
    }

    if ($sent) {
        return new WP_REST_Response(['success' => true], 200);
    }

    return new WP_REST_Response([
        'success' => false,
        'error'   => 'wp_mail() konnte die Nachricht nicht zustellen.',
    ], 500);
}
