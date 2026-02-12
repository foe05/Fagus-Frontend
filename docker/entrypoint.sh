#!/bin/bash
set -e

WP_DIR="/var/www/wordpress"
WP_CONTENT="${WP_DIR}/wp-content"

echo "=== Fagus All-in-One Container ==="
echo "Initializing..."

# ── Create required directories ─────────────────────
mkdir -p "${WP_CONTENT}/uploads"
mkdir -p "${WP_CONTENT}/database"
mkdir -p "${WP_CONTENT}/plugins"
mkdir -p "${WP_CONTENT}/themes"
mkdir -p "${WP_CONTENT}/mu-plugins"
mkdir -p /run/php

# ── Install wp-config.php if missing ────────────────
if [ ! -f "${WP_DIR}/wp-config.php" ]; then
    echo "Installing wp-config.php..."
    cp /opt/fagus/wp-config.php "${WP_DIR}/wp-config.php"
fi

# ── Install SQLite drop-in if missing ───────────────
SQLITE_PLUGIN="${WP_CONTENT}/plugins/sqlite-database-integration"
if [ -d "${SQLITE_PLUGIN}" ] && [ ! -f "${WP_CONTENT}/db.php" ]; then
    echo "Installing SQLite db.php drop-in..."
    cp "${SQLITE_PLUGIN}/db.copy" "${WP_CONTENT}/db.php"
fi

# ── Generate WordPress Salts if not set ─────────────
if [ -z "${WP_AUTH_KEY}" ]; then
    echo "Generating WordPress security keys..."
    # Generate random salts using openssl
    export WP_AUTH_KEY=$(openssl rand -base64 48)
    export WP_SECURE_AUTH_KEY=$(openssl rand -base64 48)
    export WP_LOGGED_IN_KEY=$(openssl rand -base64 48)
    export WP_NONCE_KEY=$(openssl rand -base64 48)
    export WP_AUTH_SALT=$(openssl rand -base64 48)
    export WP_SECURE_AUTH_SALT=$(openssl rand -base64 48)
    export WP_LOGGED_IN_SALT=$(openssl rand -base64 48)
    export WP_NONCE_SALT=$(openssl rand -base64 48)

    # Persist salts so they survive container restarts
    SALT_FILE="${WP_CONTENT}/database/.salts.env"
    if [ ! -f "${SALT_FILE}" ]; then
        cat > "${SALT_FILE}" <<EOF
WP_AUTH_KEY=${WP_AUTH_KEY}
WP_SECURE_AUTH_KEY=${WP_SECURE_AUTH_KEY}
WP_LOGGED_IN_KEY=${WP_LOGGED_IN_KEY}
WP_NONCE_KEY=${WP_NONCE_KEY}
WP_AUTH_SALT=${WP_AUTH_SALT}
WP_SECURE_AUTH_SALT=${WP_SECURE_AUTH_SALT}
WP_LOGGED_IN_SALT=${WP_LOGGED_IN_SALT}
WP_NONCE_SALT=${WP_NONCE_SALT}
EOF
        chmod 600 "${SALT_FILE}"
        echo "Salts persisted to ${SALT_FILE}"
    fi
fi

# ── Load persisted salts if they exist ──────────────
SALT_FILE="${WP_CONTENT}/database/.salts.env"
if [ -f "${SALT_FILE}" ] && [ -z "${WP_AUTH_KEY}" ]; then
    echo "Loading persisted salts..."
    set -a
    source "${SALT_FILE}"
    set +a
fi

# ── Copy bundled mu-plugins (ensure latest version) ──
if [ -d "/opt/fagus/mu-plugins" ]; then
    echo "Updating mu-plugins..."
    cp -f /opt/fagus/mu-plugins/*.php "${WP_CONTENT}/mu-plugins/"
fi

# ── Set permissions ─────────────────────────────────
chown -R www-data:www-data "${WP_CONTENT}"
chmod -R 755 "${WP_CONTENT}"
chmod -R 750 "${WP_CONTENT}/database"

echo "WordPress directory: ${WP_DIR}"
echo "SQLite database: ${WP_CONTENT}/database/.ht.sqlite"
echo "Starting services..."

# ── Start supervisord ───────────────────────────────
exec "$@"
