# JSON-LD Structured Data Audit

**Date:** 2026-02-27
**Scope:** All pages of broetzens.de Next.js frontend

---

## Pre-Existing Infrastructure

The codebase had a **complete but unused** structured data setup:

| File | Status |
|------|--------|
| `components/seo/JsonLd.tsx` | Client component for injecting `<script type="application/ld+json">` — **existed, unused** |
| `lib/seo/structured-data.ts` | Schema generators for Organization, Service, Product, Article, BreadcrumbList, WebSite — **existed, unused** |

All generator functions were well-typed, used correct `@context: "https://schema.org"` and valid `@type` values. No typos found in property names. Required fields (name, url, description, contactPoint) were all present.

---

## What Was Added / Fixed

### New Schema Type
- **ContactPage** (`generateContactPageSchema()`) — added to `lib/seo/structured-data.ts`

### Pages With JSON-LD Now Active

| Page | Route | Schema Types | Notes |
|------|-------|-------------|-------|
| **Homepage** | `/` | Organization + WebSite | Includes logo, contactPoint, sameAs (LinkedIn, GitHub), SearchAction |
| **Service detail** | `/services/[slug]` | Service + Organization | Provider linked to organization; description from WP excerpt |
| **Product detail** | `/produkte/[slug]` | SoftwareApplication + Organization | Category: BusinessApplication; brand linked to org |
| **Blog post** | `/ueber-uns/blog-wissen/[slug]` | Article + BreadcrumbList | headline, author, datePublished, dateModified, publisher logo, featured image |
| **Contact** | `/kontakt` | ContactPage + Organization | mainEntity with full address and contact info |

### Schemas Validated Against schema.org

- **Organization**: `@type`, `name`, `url`, `logo`, `contactPoint` (with `@type: ContactPoint`, `telephone`, `email`, `contactType`, `areaServed`, `availableLanguage`), `address` (`PostalAddress`), `sameAs` array — all valid
- **Service**: `@type`, `name`, `description`, `provider` (Organization), `areaServed`, `serviceType`, `url` — all valid
- **SoftwareApplication** (Product): `@type`, `name`, `description`, `brand` (Organization), `offers` (`Offer` with `availability`, `url`), `applicationCategory`, `operatingSystem` — all valid
- **Article**: `@type`, `headline`, `description`, `author` (Organization), `publisher` (Organization with `logo: ImageObject`), `datePublished`, `dateModified`, `image`, `url` — all valid
- **BreadcrumbList**: `@type`, `itemListElement` array of `ListItem` with `position`, `name`, `item` — all valid
- **WebSite**: `@type`, `name`, `description`, `url`, `potentialAction` (`SearchAction` with `target`, `query-input`) — all valid
- **ContactPage**: `@type`, `name`, `description`, `url`, `mainEntity` (Organization) — all valid

---

## URLs to Verify

Test these URLs at [Google Rich Results Test](https://search.google.com/test/rich-results):

- `https://broetzens.de/` — Organization + WebSite
- `https://broetzens.de/services/digitalisierungsstrategie` — Service
- `https://broetzens.de/produkte/hegegemeinschaft-management` — SoftwareApplication
- `https://broetzens.de/ueber-uns/blog-wissen/` (any post slug) — Article + BreadcrumbList
- `https://broetzens.de/kontakt` — ContactPage

---

## Remaining Opportunities

These pages could benefit from JSON-LD in the future but are lower priority:

- `/services` (listing) — `ItemList` of services
- `/produkte` (listing) — `ItemList` of products
- `/ueber-uns/blog-wissen` (listing) — `CollectionPage` or `Blog`
- `/ueber-uns` — `AboutPage`
- `/ueber-uns/team-werte` — `AboutPage` with team members
