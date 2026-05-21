# Rostock Landingpage → Deployment via Claude Code

## Workflow (5 Schritte)

### 1 · Auf die VM kopieren

Lokal auf deinem Mac/Linux:

```bash
scp -r rostock-landing-deploy/ deine-vm:/tmp/
```

Auf Windows mit WinSCP einfach den Ordner hochladen. Ziel: `/tmp/rostock-landing-deploy/`.

### 2 · Auf der VM ins broetzens.de-Repo wechseln

```bash
ssh deine-vm
cd /pfad/zu/broetzens.de
```

### 3 · Claude Code starten

```bash
claude
```

### 4 · Diesen Trigger-Prompt einfügen

Kopiere folgenden Block und sende ihn an Claude Code:

```
Lies das Briefing unter /tmp/rostock-landing-deploy/BRIEFING.md komplett durch.
Schau dir auch die Asset-Dateien in /tmp/rostock-landing-deploy/assets/ an
und die HTML-Referenzimplementierung in /tmp/rostock-landing-deploy/REFERENCE-html-version.html.

Beachte besonders Abschnitt 2 (Exploration) und Abschnitt 7 (Workflow): 
ich will erst eine Zusammenfassung deiner Findings + einen Vorschlag, 
BEVOR du Code schreibst.
```

### 5 · Im Dialog bleiben

Claude Code wird Findings vorstellen und Fragen stellen. Antworte mit:
- Welches Form-Backend du willst (Tally / Formspree / eigenes)
- Ob die Umfragen-URLs schon da sind oder noch nicht
- Ob er einen Branch + PR machen oder direkt deployen soll

---

## Was im Ordner ist

| Datei | Zweck |
|---|---|
| `BRIEFING.md` | Vollständiger Auftrag inkl. Copy, Design-Tokens, Akzeptanzkriterien |
| `REFERENCE-html-version.html` | Funktionierende Self-contained-HTML als visuelle Referenz |
| `assets/portrait-johannes.png` | Forst-Foto (Anzug + Laptop + Gummistiefel) |
| `assets/logo-trimmed.png` | Cattle-Logo ohne transparenten Rand |
| `assets/qr-rostock.svg` | QR-Code (nur Referenz, kommt nicht auf die Page) |

---

## Sicherheitshinweise

- **Nicht direkt auf main deployen** – Claude Code soll Branch + PR/Review machen
- **Form-Backend nur über HTTPS** – kein direkter SMTP aus dem Frontend
- **Vor Live-Schaltung mit dem Handy testen**: QR scannen (geht aus dem PDF-Druckvorschau-File), Formular submitten, prüfen dass die Mail bei dir ankommt
- **Erst dann Postkarten drucken** – sonst stehen 250 Karten mit kaputtem Link in der Welt

---

## Wenn was schiefgeht

Wenn Claude Code in eine Sackgasse läuft (z. B. Vue-Version unklar, Backend-Endpoint kompliziert) oder eine Entscheidung trifft, die dir komisch vorkommt: stop ihn, beschreib mir hier das Problem, ich helf bei der Klärung.
