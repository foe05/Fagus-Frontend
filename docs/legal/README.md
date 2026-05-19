# Rechtsseiten — Entwürfe & Einbindung

Entwürfe für die rechtlichen Pflicht- und Empfehlungsseiten von broetzens.de.
Stand: Mai 2026.

> ⚠️ **Kein Rechtsrat.** Diese Texte sind sorgfältig erstellte Entwürfe nach
> aktueller Rechtslage, ersetzen aber keine anwaltliche Prüfung. Insbesondere
> Impressum, Datenschutzerklärung und die Widerrufsbelehrung sollten vor
> Veröffentlichung von einem Fachanwalt oder der IHK Kassel geprüft werden — das
> Abmahnrisiko bei Fehlern ist real.

## Dateien

| Datei | Seite | Slug | Pflicht? |
|---|---|---|---|
| `impressum.md` | Impressum | `impressum` | Pflicht (§ 5 DDG) |
| `datenschutz.md` | Datenschutz | `datenschutz` | Pflicht (DSGVO) |
| `agb.md` | AGB | `agb` | Empfohlen (nicht gesetzlich vorgeschrieben) |
| `cookie-richtlinie.md` | Cookie-Richtlinie | `cookie-richtlinie` | Empfohlen |

## Einbindung in WordPress

Die Seiten werden als **WordPress-Seiten** gepflegt (Headless-WP-Modell):

1. WP-Admin → **Seiten → Erstellen**.
2. Titel und Slug exakt wie in der Tabelle oben setzen, **übergeordnete Seite
   = „(keine)"** (damit `parent = 0`).
3. Inhalt aus der jeweiligen `.md`-Datei einfügen. Die HTML-Kommentare
   (`<!-- HINWEISE FÜR JOHANNES … -->`) und Blockzitat-Hinweise am Dateianfang
   **nicht** übernehmen — sie sind nur interne Notizen.
4. Veröffentlichen.

Der Next.js-Catch-All (`app/[...slug]/page.tsx` → `getPageByPath`) rendert die
Seiten anschließend automatisch unter `/impressum`, `/datenschutz`, `/agb` und
`/cookie-richtlinie`.

### Footer-Links

`components/Footer.tsx` verlinkt bereits `/impressum`, `/datenschutz` und `/agb`
— sobald die WP-Seiten existieren, funktionieren diese Links ohne Code-Änderung.

Die **Cookie-Richtlinie** ist im Footer noch **nicht** verlinkt. Optional kann in
`FOOTER_COLUMNS` (`lib/constants.ts`) oder im Footer-Menü ein Link auf
`/cookie-richtlinie` ergänzt werden.

## Erledigte Code-Änderung: Material Symbols lokal gehostet

Unabhängig von den Texten wurde ein Datenschutzproblem behoben: Die
Material-Symbols-Icons wurden bisher bei jedem Seitenaufruf von Googles CDN
geladen (IP-Übertragung in die USA vor jeder Einwilligung — klassischer
Abmahngrund).

Geändert:
- `public/fonts/material-symbols-outlined.woff2` — Font lokal hinzugefügt
- `app/globals.css` — `@font-face` mit lokalem Pfad ergänzt
- `app/layout.tsx` — Google-`<link>` sowie `dns-prefetch`/`preconnect` zu
  `fonts.googleapis.com` / `fonts.gstatic.com` entfernt

Die Aussage in der Datenschutzerklärung (Abschnitt „Schriftarten"), dass keine
Verbindung zu Google-Servern aufgebaut wird, ist damit korrekt.

## Status der Entscheidungen

1. **Kundenkreis: B2B *und* B2C.** `agb.md` enthält die verbraucherschützenden
   Regelungen inkl. Widerrufsbelehrung als festen Bestandteil. Die
   Widerrufsbelehrung vor Einsatz anwaltlich auf den konkreten Leistungstyp
   abstimmen lassen.

2. **Newsletter: kein Anbieter, nicht verlinkt.** Das Anmeldeformular liegt unter
   `/newsletter/abonnieren` (`components/NewsletterForm.tsx`), ist aber von
   keinem Menü/Footer aus verlinkt und es ist kein Versanddienst angebunden — der
   Newsletter ist damit faktisch inaktiv. `datenschutz.md` Abschnitt 8 bleibt mit
   `[PLATZHALTER]` bestehen, damit der Text korrekt ist, falls der Newsletter
   später aktiviert wird. Optionen:
   - Newsletter aktivieren → Anbieter anbinden (Empfehlung: Brevo, EU),
     `/newsletter/abonnieren` im Footer/Menü verlinken, `[PLATZHALTER]` füllen;
   - Newsletter verwerfen → Route `app/newsletter/` entfernen und Abschnitt 8
     aus `datenschutz.md` streichen.

3. **Berufshaftpflicht:** Derzeit keine vorhanden. Für IT-Beratung dringend
   empfohlen; nach Abschluss im Impressum ergänzen.
