# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev                # Next.js dev server on :3000
npm run build              # Production build (output: standalone → .next/standalone)
npm start                  # Start production server
npm run lint               # next lint (ESLint 9 + eslint-config-next)
ANALYZE=true npm run build # Bundle analyzer (@next/bundle-analyzer)
```

There is no test runner configured — don't invent `npm test`.

All-in-one Docker build (Next.js + WordPress + SQLite + Nginx + PHP-FPM in a single container):

```bash
docker-compose up -d --build   # Uses docker/Dockerfile (NOT the root Dockerfile)
```

The root-level `Dockerfile` is a legacy Next.js-only build; `docker-compose.yml` points to `docker/Dockerfile`, which is the one actually used.

## Architecture

### Headless WordPress with hybrid routing

WordPress is the CMS for content (`broetzens.de/wp-json/wp/v2`), but Next.js routes are not purely catch-all — they form a **hybrid model**:

1. **Static routes** (`app/produkte/page.tsx`, `app/services/page.tsx`, `app/ueber-uns/team-werte/page.tsx`, etc.) render first and try to fetch a matching WP page via `getPageBySlug`. If found, WP content overrides the static fallback.
2. **Section-scoped dynamic routes** (`app/produkte/[slug]`, `app/services/[slug]`, `app/ueber-uns/[slug]`) call `getChildPages(parentSlug)` in `generateStaticParams` — so only pages whose WP `parent` matches the section's top-level page appear. This prevents `/produkte/impressum` collisions.
3. **Global catch-all** (`app/[...slug]/page.tsx`) uses `getPageByPath(segments)` which walks the WP page parent chain and verifies each slug matches. A multi-segment URL only resolves if the WP hierarchy matches exactly and the topmost page has `parent === 0`.

When adding a new static page under an existing section, check whether a section-scoped `[slug]` route already handles it dynamically — creating a static route with the same slug will take precedence and may shadow the WP page (see recent fixes in git log for `/services`, `/ueber-uns`, `/produkte`). `WP-SLUGS-UEBERSICHT.md` is the authoritative map of routes ↔ WP slugs.

`revalidate = 300` (5 min ISR) is used throughout. `lib/wordpress.ts` is the single source of truth for all WP fetches; `fetchAllPaginated` handles `X-WP-TotalPages` automatically.

### WordPress mu-plugins (shipped in the image)

Two custom plugins live in `docker/mu-plugins/` and are copied into `wp-content/mu-plugins/` at build time:

- **`fagus-menus.php`** — exposes `/wp-json/fagus/v1/menus/{location}` returning a hierarchical tree of menu items. Icons are set via a CSS class on the menu item: `menu-item-icon-{name}` maps to Material Symbols. `getHeaderNavigation()` / `getFooterNavigation()` pull from `header-menu` / `footer-menu` locations with a hardcoded fallback to `NAVIGATION_ITEMS` / `FOOTER_COLUMNS` in `lib/constants.ts`. Also force-sets permalink structure to `/%postname%/` on first run.
- **`fagus-contact.php`** — exposes `/wp-json/fagus/v1/contact` for the contact form. The Next.js server action `app/actions/sendEmail.ts` POSTs here instead of using SMTP directly; delivery goes through `wp_mail()` + the WP Mail SMTP plugin. Recipient is the WP option `fagus_contact_email` (default `hallo@broetzens.de`).

### Inside the container

`WP_API_URL=http://127.0.0.1/wp-json/wp/v2` — Nginx fronts both Next.js (`/`) and PHP-FPM (`/wp-json`, `/wp-admin`, etc.) on port 80, and Next.js calls WP over loopback. For local dev without Docker, point `WP_API_URL` at the live site. `WP_API_URL` and `NEXT_PUBLIC_WP_API_URL` are both read (server-side prefers the non-public one); the trailing slash is stripped in `lib/constants.ts`.

### Analytics & consent

- **Plausible** is cookieless — loaded unconditionally in `app/layout.tsx` via `<Script>`.
- **Google Analytics** is gated by `CookieConsentProvider` — only loads after user opts in (`components/cookie-consent/`, `components/analytics/GoogleAnalytics.tsx`, `components/LazyAnalytics.tsx`). `NEXT_PUBLIC_GA_ID` is optional.

### Newsletter

`app/actions/newsletter.ts` implements double opt-in with an in-memory `Map<token, PendingSubscription>`. **This resets on every server restart** — it's marked for DB replacement in production. Provider switches between Mailchimp and Brevo via `NEWSLETTER_PROVIDER` env var.

### Path alias

`@/*` maps to the project root (see `tsconfig.json`), not to `src/`. Imports look like `@/lib/wordpress`, `@/components/Header`.

## Conventions

- **Strict TypeScript**, React 19, Next.js 15 App Router. `next/dynamic` is used to code-split heavy components (e.g. `WordPressPageComponent`).
- **German UI copy.** User-facing strings (error messages, metadata `description`, page titles) are in German — match existing tone.
- **Material Design 3 typography** is implemented as CSS utility classes in `app/globals.css` (`.display-large`, `.headline-medium`, `.body-small`, etc.) alongside Tailwind. Colors use CSS variables (`--primary`, `--primary-light`, `--secondary`, `--accent`) — don't hardcode hex values.
- **Images** from `broetzens.de` are whitelisted in `next.config.ts` `remotePatterns`. Add new external hosts there if you embed images from elsewhere.
- **Interactive tree hotspots** on the homepage are data-driven from `HOTSPOTS` in `lib/constants.ts` — edit the array rather than the JSX.
