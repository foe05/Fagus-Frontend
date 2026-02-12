# ============================================
# Fagus All-in-One: Next.js + WordPress + SQLite
# ============================================

# ── Stage 1: Build Next.js ──────────────────────────
FROM node:20-alpine AS nextjs-builder
WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY . .
RUN npm run build

# ── Stage 2: Runtime ────────────────────────────────
FROM debian:bookworm-slim

ENV DEBIAN_FRONTEND=noninteractive

# ── Install system packages ─────────────────────────
RUN apt-get update && apt-get install -y --no-install-recommends \
    # Nginx
    nginx \
    # PHP 8.2
    php8.2-fpm \
    php8.2-sqlite3 \
    php8.2-curl \
    php8.2-gd \
    php8.2-xml \
    php8.2-mbstring \
    php8.2-zip \
    php8.2-intl \
    php8.2-imagick \
    # Node.js runtime
    nodejs \
    # Process manager
    supervisor \
    # Utilities
    wget unzip openssl ca-certificates curl \
    && rm -rf /var/lib/apt/lists/*

# ── Create node user ───────────────────────────────
RUN useradd --system --uid 1001 --create-home node

# ── Download WordPress ──────────────────────────────
RUN wget -q https://wordpress.org/latest.tar.gz -O /tmp/wordpress.tar.gz \
    && tar -xzf /tmp/wordpress.tar.gz -C /var/www/ \
    && rm /tmp/wordpress.tar.gz \
    && chown -R www-data:www-data /var/www/wordpress

# ── Download SQLite Database Integration Plugin ─────
RUN wget -q https://downloads.wordpress.org/plugin/sqlite-database-integration.zip -O /tmp/sqlite-plugin.zip \
    && unzip -q /tmp/sqlite-plugin.zip -d /var/www/wordpress/wp-content/plugins/ \
    && rm /tmp/sqlite-plugin.zip \
    && cp /var/www/wordpress/wp-content/plugins/sqlite-database-integration/db.copy \
       /var/www/wordpress/wp-content/db.php \
    && chown -R www-data:www-data /var/www/wordpress/wp-content/plugins/sqlite-database-integration \
    && chown www-data:www-data /var/www/wordpress/wp-content/db.php

# ── Copy Next.js standalone build ───────────────────
COPY --from=nextjs-builder /app/public /app/nextjs/public
COPY --from=nextjs-builder /app/.next/standalone /app/nextjs/
COPY --from=nextjs-builder /app/.next/static /app/nextjs/.next/static
RUN chown -R node:node /app/nextjs

# ── Copy configuration files ───────────────────────
COPY docker/nginx.conf /etc/nginx/nginx.conf
COPY docker/supervisord.conf /etc/supervisor/conf.d/supervisord.conf
COPY docker/php-fpm-pool.conf /etc/php/8.2/fpm/pool.d/www.conf
COPY docker/wp-config.php /opt/fagus/wp-config.php
COPY docker/entrypoint.sh /opt/fagus/entrypoint.sh
RUN chmod +x /opt/fagus/entrypoint.sh

# ── Copy mu-plugins ──────────────────────────────────
COPY docker/mu-plugins/ /opt/fagus/mu-plugins/
COPY docker/mu-plugins/ /var/www/wordpress/wp-content/mu-plugins/
RUN chown -R www-data:www-data /var/www/wordpress/wp-content/mu-plugins

# ── Create required directories ─────────────────────
RUN mkdir -p /run/php \
    && mkdir -p /var/www/wordpress/wp-content/database \
    && mkdir -p /var/www/wordpress/wp-content/uploads

# ── WordPress Permalinks (.htaccess not needed with Nginx)
# Nginx handles rewriting directly in config

EXPOSE 80

HEALTHCHECK --interval=30s --timeout=10s --start-period=60s --retries=3 \
    CMD curl -f http://localhost/ || exit 1

ENTRYPOINT ["/opt/fagus/entrypoint.sh"]
CMD ["/usr/bin/supervisord", "-c", "/etc/supervisor/conf.d/supervisord.conf"]
