# LinkedIn → WordPress Import

`import-linkedin-posts.mjs` legt LinkedIn-Posts aus einer JSON-Datei als
Blogbeiträge in WordPress an (über die REST API, `POST /wp-json/wp/v2/posts`).

## Was es macht

- Liest `data/linkedin-posts.json` (oder `--file <pfad>`).
- Bereinigt die CSV-Export-Artefakte im Text (`\"`, leere `""`-Zeilen) und
  wandelt den Text in Absätze (`<p>`) um.
- Leitet einen **Titel** aus der ersten Textzeile ab (lange Zeilen werden an
  einer Wortgrenze auf ~70 Zeichen gekürzt).
- Übernimmt das **Original-Veröffentlichungsdatum** von LinkedIn.
- Extrahiert **Hashtags** aus dem Text und legt sie als WordPress-Tags an.
- Ordnet alle Beiträge der Kategorie **„LinkedIn"** zu (anpassbar via `--category`).
- Hängt am Ende einen Link zum **Originalbeitrag auf LinkedIn** an.
- Legt Beiträge standardmäßig als **Entwurf** an – du prüfst und veröffentlichst
  manuell im WP-Admin.
- **Idempotent**: erkennt bereits importierte Posts an der LinkedIn-URN-ID im
  Beitragstext und überspringt sie. Ein erneuter Lauf erzeugt keine Duplikate.

Es werden **keine** zusätzlichen npm-Pakete benötigt (nutzt das in Node 18+
eingebaute `fetch`).

## Voraussetzungen

1. **Anwendungspasswort** in WordPress erstellen:
   WP-Admin → Benutzer → Profil → *Anwendungspasswörter*. Der Benutzer braucht
   das Recht, Beiträge zu erstellen (Redakteur/Administrator).
2. Zugangsdaten in einer lokalen `.env` hinterlegen (siehe `.env.example`,
   `.env` ist per `.gitignore` ausgeschlossen):

   ```env
   WP_BASE_URL=https://broetzens.de
   WP_USER=dein-wp-benutzername
   WP_APP_PASSWORD=xxxx xxxx xxxx xxxx xxxx xxxx
   ```

   Alternativ als Umgebungsvariablen exportieren.

## Verwendung

```bash
# 1. Erst testen, was passieren würde (schreibt nichts):
npm run import:linkedin -- --dry-run

# 2. Als Entwürfe importieren:
npm run import:linkedin

# Weitere Optionen:
node scripts/import-linkedin-posts.mjs --file data/linkedin-posts.json
node scripts/import-linkedin-posts.mjs --category "LinkedIn"
node scripts/import-linkedin-posts.mjs --limit 3        # nur die ersten 3
node scripts/import-linkedin-posts.mjs --publish        # direkt veröffentlichen
node scripts/import-linkedin-posts.mjs --help
```

> Hinweis: `npm run import:linkedin -- --dry-run` – das `--` ist nötig, damit
> npm die Flags an das Skript durchreicht.

## Hinweise

- Das Quell-JSON enthält teils kleinere Tippfehler/Artefakte aus dem LinkedIn-
  Export (z. B. `gab"s` statt `gab's`). Da alles als Entwurf landet, kannst du
  vor dem Veröffentlichen im WP-Editor korrigieren.
- Beiträge 2 und 3 im Beispiel-JSON sind nahezu identisch (zwei Versionen
  desselben Posts) – ggf. einen davon im Entwurf löschen.
