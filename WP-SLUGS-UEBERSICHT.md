# WordPress-Slug Übersicht — Fagus-Frontend

> Generiert am 27.02.2026 durch Analyse des Fagus-Frontend Repositories.

---

## API-Konfiguration

| Einstellung | Wert |
|-------------|------|
| Umgebungsvariable | `WP_API_URL` / `NEXT_PUBLIC_WP_API_URL` |
| Standard-URL | `http://127.0.0.1/wp-json/wp/v2` |
| Cache (ISR) | 5 Minuten (`revalidate = 300`) |

---

## 1. Eltern-Seiten (Parent Pages) — Pflicht

Diese Seiten **müssen** in WordPress als Top-Level-Seiten existieren (`parent = 0`).
Sie dienen als Container für die jeweiligen Kind-Seiten.

| WP-Slug | Zweck | Genutzt in | Fetching-Funktion |
|----------|-------|------------|-------------------|
| `ueber-uns` | Über-Uns Bereich | `app/ueber-uns/page.tsx` | `getChildPages('ueber-uns')` |
| `produkte` | Produkte Bereich | `app/produkte/page.tsx` | `getChildPages('produkte')` |
| `services` | Services Bereich | `app/services/page.tsx` | `getChildPages('services')` |

---

## 2. Kind-Seiten (Child Pages)

### 2.1 Unter `ueber-uns`

| WP-Slug | Route | Datei | Hinweis |
|----------|-------|-------|---------|
| `team-werte` | `/ueber-uns/team-werte` | `app/ueber-uns/team-werte/page.tsx` | Hardcoded + statischer Fallback |
| `ai-first-ansatz` | `/ueber-uns/ai-first-ansatz` | `app/ueber-uns/[slug]/page.tsx` | Dynamisch |
| `referenzen` | `/ueber-uns/referenzen` | `app/ueber-uns/[slug]/page.tsx` | Dynamisch |

### 2.2 Unter `produkte`

| WP-Slug | Route | Datei | Hinweis |
|----------|-------|-------|---------|
| `hegegemeinschaft-management` | `/produkte/hegegemeinschaft-management` | `app/produkte/hegegemeinschaft-management/page.tsx` | Statische Seite + dynamischer Fallback |
| `erdmassenberechnung` | `/produkte/erdmassenberechnung` | `app/produkte/[slug]/page.tsx` | Dynamisch |
| `hosting` | `/produkte/hosting` | `app/produkte/[slug]/page.tsx` | Dynamisch |

### 2.3 Unter `services`

| WP-Slug | Route | Datei | Hinweis |
|----------|-------|-------|---------|
| `digitalisierungsstrategie` | `/services/digitalisierungsstrategie` | `app/services/digitalisierungsstrategie/page.tsx` | Statische Seite + dynamischer Fallback |
| `prozessoptimierung-automatisierung` | `/services/prozessoptimierung-automatisierung` | `app/services/[slug]/page.tsx` | Dynamisch |
| `change-management` | `/services/change-management` | `app/services/[slug]/page.tsx` | Dynamisch |
| `prototyping-mvp` | `/services/prototyping-mvp` | `app/services/[slug]/page.tsx` | Dynamisch |

---

## 3. Top-Level Seiten (Catch-All Route)

Diese Seiten werden über die Catch-All Route `/[...slug]` aufgelöst.
Sie müssen in WordPress als Top-Level-Seiten existieren (`parent = 0`).

| WP-Slug | Route | Beschreibung |
|----------|-------|--------------|
| `impressum` | `/impressum` | Impressum |
| `datenschutz` | `/datenschutz` | Datenschutzerklärung |
| `agb` | `/agb` | AGB |
| *beliebig* | `/{slug}` | Jede weitere Top-Level-Seite |

**Fetching-Funktion:** `getPageByPath(slug)` in `app/[...slug]/page.tsx`

---

## 4. Blog-Posts

| Typ | Route | Fetching-Funktion |
|-----|-------|-------------------|
| Einzelner Post | `/ueber-uns/blog-wissen/[slug]` | `getPostBySlug(slug)` |
| Post-Übersicht | `/ueber-uns/blog-wissen` | `getPosts(12)` |
| Nach Tag gefiltert | `/ueber-uns/blog-wissen?tag={tagSlug}` | `getPostsByTag(tag, 12)` |

Posts können **beliebige Slugs** haben — sie werden dynamisch aus WordPress geladen.

---

## 5. Tags (für Blog-Filterung)

Verwendet unter `/themen` und auf der Blog-Übersichtsseite.

| WP-Tag-Slug | Anzeigename |
|--------------|-------------|
| `digitalisierung` | Digitalisierung |
| `wildtiermanagement` | Wildtiermanagement |
| `automatisierung` | Automatisierung |
| `ai-first` | AI-First |
| `forststrassen` | Forststraßen |
| `mobile-apps` | Mobile Apps |
| `change-management` | Change Management |
| `prozessoptimierung` | Prozessoptimierung |

---

## 6. Hybrid-Verhalten (WordPress + Statischer Fallback)

Das Frontend verwendet ein Hybrid-Modell:

```
1. Versuche Seite per getPageBySlug(slug) aus WordPress zu laden
2. WordPress-Seite gefunden?  →  Zeige WordPress-Inhalt
3. Keine WP-Seite gefunden?   →  Zeige hartcodierten Next.js-Fallback
```

### Seiten mit statischem Fallback:

| Seite | Fallback vorhanden |
|-------|--------------------|
| `team-werte` | Ja |
| `hegegemeinschaft-management` | Ja |
| `digitalisierungsstrategie` | Ja |
| Übersicht `produkte` | Ja |
| Übersicht `services` | Ja |
| Übersicht `ueber-uns` | Ja |

---

## 7. WordPress-Seitenstruktur (Empfehlung)

So sollte die Seitenhierarchie in WordPress aussehen:

```
WordPress-Seiten
├── ueber-uns                          (parent = 0)
│   ├── team-werte                     (parent = ueber-uns)
│   ├── ai-first-ansatz                (parent = ueber-uns)
│   └── referenzen                     (parent = ueber-uns)
├── produkte                           (parent = 0)
│   ├── hegegemeinschaft-management    (parent = produkte)
│   ├── erdmassenberechnung            (parent = produkte)
│   └── hosting                        (parent = produkte)
├── services                           (parent = 0)
│   ├── digitalisierungsstrategie      (parent = services)
│   ├── prozessoptimierung-automatisierung (parent = services)
│   ├── change-management              (parent = services)
│   └── prototyping-mvp                (parent = services)
├── impressum                          (parent = 0)
├── datenschutz                        (parent = 0)
└── agb                                (parent = 0)

WordPress-Beiträge (Posts)
└── beliebige Slugs                    (erscheinen unter /ueber-uns/blog-wissen/)

WordPress-Tags
├── digitalisierung
├── wildtiermanagement
├── automatisierung
├── ai-first
├── forststrassen
├── mobile-apps
├── change-management
└── prozessoptimierung
```

---

## 8. Slug-Konventionen

- **Kleinbuchstaben** — keine Großbuchstaben
- **Keine Umlaute** — `ueber-uns` statt `über-uns`
- **Bindestriche** als Worttrenner — `prozessoptimierung-automatisierung`
- **Erlaubte Zeichen** — nur `a-z`, `0-9` und `-`
- **Eltern-Kind-Beziehung** — wird über das WordPress `parent`-Feld gesteuert, nicht über den Slug-Pfad

---

## 9. Relevante Quelldateien

| Datei | Beschreibung |
|-------|--------------|
| `lib/wordpress.ts` | Alle WordPress API-Funktionen |
| `lib/constants.ts` | API-URL, Navigation, Konfiguration |
| `lib/types.ts` | TypeScript-Interfaces für WP-Datentypen |
| `app/[...slug]/page.tsx` | Catch-All Route für Top-Level-Seiten |
| `app/ueber-uns/[slug]/page.tsx` | Dynamische Über-Uns Unterseiten |
| `app/produkte/[slug]/page.tsx` | Dynamische Produkt-Unterseiten |
| `app/services/[slug]/page.tsx` | Dynamische Service-Unterseiten |
| `app/ueber-uns/blog-wissen/[slug]/page.tsx` | Einzelne Blog-Posts |
