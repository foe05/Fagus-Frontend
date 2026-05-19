# WordPress Inventory

Snapshot of every WordPress page and post pulled from the `fagus` Docker
container on **2026-04-24**. Each entry is stored as a Markdown file with YAML
frontmatter; the body is the original `post_content` (Gutenberg HTML) exactly
as stored in WordPress.

- Pages: **7**
- Posts: **2**

Regenerate by running the PHP export routine documented in the task brief
(`docker exec fagus php -r "..."`) and streaming the resulting files out of
`/tmp/wp-md/` with `docker exec fagus cat`.

## Pages

Sorted by `parent` then `id`. `parent = 0` means top-level (WP `parent === 0`).
Parent slug is shown as a cross-reference when the parent is also in this
export.

| ID | Slug | Parent | Parent slug | Title | Status | File |
|----|------|--------|-------------|-------|--------|------|
| 3 | `datenschutzerklaerung` | 0 | — | Datenschutzerklärung | draft | [`pages/3-datenschutzerklaerung.md`](pages/3-datenschutzerklaerung.md) |
| 19 | `produkte` | 0 | — | Produkte | draft | [`pages/19-produkte.md`](pages/19-produkte.md) |
| 24 | `services` | 0 | — | Services | publish | [`pages/24-services.md`](pages/24-services.md) |
| 22 | `erdmassenberechnung` | 19 | `produkte` | Erdmassenberechnung für Bauplätze von Windenergieanlagen | publish | [`pages/22-erdmassenberechnung.md`](pages/22-erdmassenberechnung.md) |
| 26 | `digital-independence` | 24 | `services` | Digital Independence | publish | [`pages/26-digital-independence.md`](pages/26-digital-independence.md) |
| 30 | `digital-readiness-review` | 24 | `services` | Digital Readiness Review | publish | [`pages/30-digital-readiness-review.md`](pages/30-digital-readiness-review.md) |
| 37 | `prototyping-mvp` | 24 | `services` | Prototyping und MVP | publish | [`pages/37-prototyping-mvp.md`](pages/37-prototyping-mvp.md) |

## Posts

Sorted by `id`.

| ID | Slug | Title | Status | Date | File |
|----|------|-------|--------|------|------|
| 1 | `hallo-welt` | Hallo Welt! | publish | 2026-02-09 21:03:41 | [`posts/1-hallo-welt.md`](posts/1-hallo-welt.md) |
| 8 | `neuer-beitrag` | Neuer Beitrag | publish | 2026-02-10 13:53:36 | [`posts/8-neuer-beitrag.md`](posts/8-neuer-beitrag.md) |

## Slug list (Pages)

Top-level pages first, children indented.

- `datenschutzerklaerung` (id 3, parent 0, draft)
- `produkte` (id 19, parent 0, draft)
  - `erdmassenberechnung` (id 22, parent 19, publish)
- `services` (id 24, parent 0, publish)
  - `digital-independence` (id 26, parent 24, publish)
  - `digital-readiness-review` (id 30, parent 24, publish)
  - `prototyping-mvp` (id 37, parent 24, publish)

## Frontmatter schema

```yaml
id: <int>           # WP post ID
slug: <string>      # post_name
parent: <int>       # parent post ID, 0 = top-level
title: <string>     # post_title
type: page | post
status: publish | draft | pending | private | ...
date: <YYYY-MM-DD HH:MM:SS>
modified: <YYYY-MM-DD HH:MM:SS>
exported_at: <YYYY-MM-DD>
```
