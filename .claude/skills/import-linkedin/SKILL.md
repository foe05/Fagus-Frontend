---
name: import-linkedin
description: Importiert LinkedIn-Posts aus einer JSON-Datei als WordPress-Blogbeiträge über die REST API. Verwenden, wenn der Nutzer LinkedIn-Posts (z. B. data/linkedin-posts.json) als Beiträge nach WordPress übertragen will, einen Re-Import anstoßen oder den LinkedIn→WordPress-Import testen (dry-run) möchte.
---

# LinkedIn → WordPress Import

Wrapper um `scripts/import-linkedin-posts.mjs`. Legt LinkedIn-Posts aus einer
JSON-Datei als WordPress-Beiträge an (REST API `POST /wp-json/wp/v2/posts`),
standardmäßig als **Entwurf**.

## Ablauf

1. **Zugangsdaten prüfen.** Das Skript braucht `WP_BASE_URL`, `WP_USER` und
   `WP_APP_PASSWORD` (aus Umgebungsvariablen oder einer lokalen `.env`).
   - Sind sie nicht gesetzt, den Nutzer NICHT nach dem Passwort im Klartext im
     Chat fragen. Stattdessen darauf hinweisen, dass er sie in `.env`
     (siehe `.env.example`, ist per `.gitignore` ausgeschlossen) oder als
     Environment-Secret hinterlegen soll. Anwendungspasswort erzeugen:
     WP-Admin → Benutzer → Profil → *Anwendungspasswörter*.

2. **Immer zuerst einen Dry-Run** ausführen und das Ergebnis zeigen
   (Titel, Datum, Tags pro Post werden geprüft, es wird nichts geschrieben):

   ```bash
   npm run import:linkedin -- --dry-run
   ```

3. **Bestätigung einholen**, dann den echten Import als Entwurf starten:

   ```bash
   npm run import:linkedin
   ```

   Das schreibt echte Beiträge in WordPress – daher vorher die Zustimmung des
   Nutzers einholen.

## Optionen

```bash
node scripts/import-linkedin-posts.mjs --file data/linkedin-posts.json
node scripts/import-linkedin-posts.mjs --category "LinkedIn"
node scripts/import-linkedin-posts.mjs --limit 3        # nur die ersten n
node scripts/import-linkedin-posts.mjs --publish        # direkt veröffentlichen statt Entwurf
node scripts/import-linkedin-posts.mjs --help
```

## Verhalten / Mapping

- Titel = erste Textzeile (lange Zeilen an Wortgrenze gekürzt).
- Inhalt = Text in `<p>`-Absätze; CSV-Export-Artefakte (`\"`, leere `""`-Zeilen)
  werden bereinigt; Link zum Originalpost wird angehängt.
- Datum = Original-LinkedIn-Datum; Hashtags → WordPress-Tags; Kategorie „LinkedIn".
- **Idempotent**: bereits importierte Posts werden an der LinkedIn-URN-ID erkannt
  und übersprungen – ein erneuter Lauf erzeugt keine Duplikate.

Details: `scripts/README.md`.
