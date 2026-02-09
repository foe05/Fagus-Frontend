<?php
/**
 * WordPress Configuration for Fagus All-in-One Container
 * Database: SQLite via SQLite Database Integration Plugin
 */

// ── SQLite Database Configuration ──────────────────
define('DB_DIR', '/var/www/wordpress/wp-content/database');
define('DB_FILE', '.ht.sqlite');

// Dummy values required by WordPress core (unused with SQLite)
define('DB_NAME', 'wordpress');
define('DB_USER', '');
define('DB_PASSWORD', '');
define('DB_HOST', '');
define('DB_CHARSET', 'utf8');
define('DB_COLLATE', '');

// ── Table Prefix ───────────────────────────────────
$table_prefix = 'wp_';

// ── Site URLs ──────────────────────────────────────
if (getenv('WP_URL')) {
    define('WP_HOME', getenv('WP_URL'));
    define('WP_SITEURL', getenv('WP_URL'));
}

// ── Authentication Keys and Salts ──────────────────
// Generated on first container start by entrypoint.sh
// or override via environment variables
define('AUTH_KEY',         getenv('WP_AUTH_KEY')         ?: 'put-your-unique-phrase-here');
define('SECURE_AUTH_KEY',  getenv('WP_SECURE_AUTH_KEY')  ?: 'put-your-unique-phrase-here');
define('LOGGED_IN_KEY',    getenv('WP_LOGGED_IN_KEY')    ?: 'put-your-unique-phrase-here');
define('NONCE_KEY',        getenv('WP_NONCE_KEY')        ?: 'put-your-unique-phrase-here');
define('AUTH_SALT',        getenv('WP_AUTH_SALT')        ?: 'put-your-unique-phrase-here');
define('SECURE_AUTH_SALT', getenv('WP_SECURE_AUTH_SALT') ?: 'put-your-unique-phrase-here');
define('LOGGED_IN_SALT',   getenv('WP_LOGGED_IN_SALT')  ?: 'put-your-unique-phrase-here');
define('NONCE_SALT',       getenv('WP_NONCE_SALT')       ?: 'put-your-unique-phrase-here');

// ── Debug ──────────────────────────────────────────
define('WP_DEBUG', getenv('WP_DEBUG') === 'true');
define('WP_DEBUG_LOG', getenv('WP_DEBUG') === 'true');
define('WP_DEBUG_DISPLAY', false);

// ── Security ───────────────────────────────────────
define('DISALLOW_FILE_EDIT', true);
define('FORCE_SSL_ADMIN', false);

// Prevent HTTPS redirect when behind reverse proxy or on plain HTTP
if (!isset($_SERVER['HTTPS']) || $_SERVER['HTTPS'] !== 'on') {
    $_SERVER['HTTPS'] = 'off';
}

// ── Performance ────────────────────────────────────
define('WP_POST_REVISIONS', 5);
define('AUTOSAVE_INTERVAL', 300);

// ── WordPress Cron ─────────────────────────────────
// Use system cron if preferred; disable WP internal cron
// define('DISABLE_WP_CRON', true);

// ── Absolute Path ──────────────────────────────────
if (!defined('ABSPATH')) {
    define('ABSPATH', __DIR__ . '/');
}

// ── Load WordPress ─────────────────────────────────
require_once ABSPATH . 'wp-settings.php';
