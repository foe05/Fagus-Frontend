# Briefing: Landingpage `/rostock` für Forstvereinstagung-Postkarte

> Lies dieses Dokument komplett durch, bevor du anfängst. Es enthält Kontext,
> Inhalt, Design-Tokens und Akzeptanzkriterien. Frag nach, wenn etwas
> unklar ist – baue **nicht** ungefragt drauflos.

---

## 1 · Kontext

Ich (Johannes Brötz, Broetzens IT Cattles & Cows) verteile in ~4 Wochen auf der
Forstvereinstagung in Rostock physische Postkarten an Forstbetriebsleiter.
Auf der Rückseite ist ein QR‑Code, der auf `https://broetzens.de/rostock`
führt. Diese Landingpage ist die einzige Conversion-Strecke der Kampagne.

**Zielgruppe**: deutschsprachige Forstbetriebsleiter (40‑65 Jahre), nicht
technik-affin, eher konservativ. Lesen am Handy direkt nach dem Scan.

**Ziele der Page**:
1. Vertrauen aufbauen (gleiche Sprache und Bilder wie die Postkarte)
2. Conversion 1: Bürokratie‑Beispiel per Formular einreichen
3. Conversion 2 (sekundär): Teilnahme an einer der zwei Umfragen

---

## 2 · Bevor du Code schreibst: explorieren

Mach dir ein Bild vom Repo, **bevor** du loslegst:

1. Welches Vue (2 oder 3)? Welcher Build (Vite, Webpack)?
2. Wie ist Routing organisiert? Vue Router? History‑Mode oder Hash?
3. Wo liegen bestehende Pages/Views?
4. Gibt es ein Design‑System / CSS‑Tokens im Repo? Reuse alles, was es gibt.
5. Wie wird die App geserved? Nginx im Container? SPA‑Fallback konfiguriert?
6. Gibt es bereits ein Backend / API‑Endpoint für Formulare? Falls ja: nutzen.
7. Ist Plausible / Matomo / sonstige Analytics eingebaut? Falls ja: Pageview‑Tracking für `/rostock` nicht vergessen.
8. Welcher Branch‑Workflow gilt? Direkt auf main oder PR?

**Stell mir deine Findings vor, bevor du implementierst.** Ich will eine kurze
Zusammenfassung von dem, was du gesehen hast, und einen Vorschlag, wie du es
einbauen würdest – dann gebe ich grünes Licht.

---

## 3 · Was zu bauen ist

### 3.1 · Routing
- Neue Route: `/rostock`
- Direkter Aufruf muss funktionieren (nicht nur per Link aus der App).
- Falls Nginx SPA‑Fallback fehlt: konfigurieren.

### 3.2 · Asset‑Dateien (liegen im selben Ordner wie dieses Briefing)
- `assets/portrait-johannes.png` – mein Forstporträt (Anzug + Laptop + Gummistiefel im Wald). Passendes Format in den Vue‑Asset‑Ordner kopieren. Lazy-loading wäre nett.
- `assets/logo-trimmed.png` – das Cattle‑Logo, sauber zugeschnitten (kein transparenter Rand). Falls das Repo schon eine Logo‑Variante hat, nutze die – aber nur, wenn sie ebenfalls zugeschnitten ist.
- `assets/qr-rostock.svg` – nur zur Referenz, kommt **nicht** auf die Landingpage selbst (der QR ist auf der physischen Postkarte).

### 3.3 · Komponentenstruktur (Vorschlag, anpassen falls Repo anders strukturiert ist)

```
views/RostockLanding.vue
├── components/rostock/HeroSection.vue
├── components/rostock/WhyBlock.vue
├── components/rostock/FeedbackForm.vue
└── components/rostock/SecondaryActions.vue
```

Wenn das Repo bereits eine andere Konvention hat: folg ihr.

### 3.4 · Backend: Formular-Submit

**Wenn ein API‑Endpoint im Repo existiert** (z. B. `/api/contact`): nutze ihn,
ergänze ein Subject oder Tag wie `source=rostock-postkarte`, damit die
Einsendungen zu sortieren sind.

**Wenn nicht**: stell mir drei Optionen mit Pro/Contra vor – ich wähle dann.
Mögliche Kandidaten:
- **Tally.so** (extern, kostenlos, gute DSGVO‑Optionen, Webhook möglich)
- **Formspree** (extern, kostenlos bis ~50 Submissions/Monat)
- **Web3Forms** (extern, kostenlos)
- **Eigener Endpoint** im Container (z. B. kleines Node/Express oder PHP) – funktional aber Wartungsaufwand

Was ich auf keinen Fall will:
- Mailto‑Link als „Formular" (bricht ab dem dritten Förster, der LinkedIn‑Mobile als E‑Mail‑Client hat)
- Direkter SMTP‑Aufruf aus dem Frontend (Spam‑Risiko)

### 3.5 · Tracking
- Falls Analytics existiert: Pageview für `/rostock` und Event für erfolgreichen Formular‑Submit.
- Kein UTM‑Parameter‑Tracking nötig (der QR enthält keine UTMs – die Page ist per Definition aus der Postkarten‑Kampagne, alle Visits sind Postkarten‑Traffic).

---

## 4 · Content (Copy verbatim — nicht umformulieren)

Diese Texte sind mit mir abgestimmt. Nichts ohne Rückfrage ändern.

### 4.1 · Eyebrow (klein, gesperrt, oben)
> EINE FRAGE · AN FORSTBETRIEBSLEITER

### 4.2 · Hero-Headline (groß, 3 Zeilen)
> Förster.
> *Und Schneisenschläger*
> durch Prozess‑Dickichte.

(Die zweite Zeile in Soil-Braun + Kursiv – siehe Design‑Tokens.)

### 4.3 · Lead-Text (direkt unter Headline)
> Wir haben uns vermutlich auf der Forstvereinstagung getroffen – oder du hast eine meiner Karten in die Hand bekommen. Schön, dass du hier bist.

### 4.4 · Bildunterschrift unter Foto
> Nordhessen · 2025

### 4.5 · Why-Block (mit linkem Soil-Brown-Border-Accent)

> Du benutzt schon Software, die deine Arbeit erleichtert. Eine Jagd‑App hier, ein GIS da, Excel, ein Stück Windows‑Software, eine forstliche Warenwirtschaft.
>
> Was fehlt, sind die **Verbindungen** zwischen dem, was du schon hast – damit Doppeleingaben verschwinden, Daten dort landen, wo sie gebraucht werden, und der nervige Teil deiner Arbeit kleiner wird. Wo es passt, auch mit KI. Aber zuerst: ran an Datensilos und Prozesse.
>
> **Mein Angebot:** Fokussierte Tage vor Ort beim Kunden. Keine 80‑Seiten‑Reports. Bezahlung bei Erfolg – wenn das Ergebnis nicht trägt, zahlst du nicht den vollen Satz.

### 4.6 · Formular-Sektion

**Titel:** Schick mir dein nervigstes Bürokratie‑Beispiel.

**Subtitle:** Ich lese alles, was reinkommt, und antworte persönlich mit einer Einschätzung. Kein Newsletter, kein Lead‑Funnel.

**Felder:**
1. **Worum geht's?** *(Pflicht, Textarea, schreib einfach drauflos)*
   - Placeholder: `Beispiel: "Wir tippen jede Holzliste dreimal ab – einmal in ProForst, einmal in die FoGIS-Maske, einmal in Excel für den Käufer."`
   - Helfertext: `Anonym ok. Wenn du eine Antwort willst, brauche ich aber unten eine E‑Mail.`

2. **E‑Mail** *(freiwillig, nur für meine Antwort)*
   - Placeholder: `forst@example.de`
   - Validierung: nur prüfen wenn nicht leer

3. **Forstbetrieb / Region** *(freiwillig)*
   - Placeholder: `z. B. Privatwald 600 ha, Mittelhessen`

**Submit-Button:** `Absenden`

**Trust-Row unter dem Button (kleine Mono-Schrift, gesperrt):**
- ✓ KEINE WEITERGABE AN DRITTE
- ✓ KEIN NEWSLETTER
- ✓ PERSÖNLICHE ANTWORT

**Erfolgsmeldung nach Submit (statt Form):**
> Danke. Ich habe deine Nachricht. Wenn du eine E‑Mail hinterlegt hast, antworte ich innerhalb von 48 Stunden – persönlich, nicht automatisiert.

**Fehlermeldung bei Submit-Fehler:**
> Hmm, da ist was schiefgelaufen. Schreib mir einfach direkt an hallo@broetzens.de.

### 4.7 · Sekundäre Aktion (unter dem Formular)

**Titel:** Wenn du eh schon da bist – zwei kurze Umfragen, die mir helfen:

- Link 1: `Digitalisierung im Forstbetrieb – wo scheitert sie wirklich?` *(~ 7 Min →)*
- Link 2: `KI im Forstbetrieb – wo wäre sie hilfreich, wo nervt sie?` *(~ 4 Min →)*

**Footnote:** Ergebnisse bekommst du als Tagungsteilnehmer als Erster – noch vor der öffentlichen Auswertung.

**WICHTIG**: Die Umfragen sind noch nicht final aufgesetzt. Verwende erstmal `href="#"` als Platzhalter und schreib in einen Kommentar `<!-- TODO: Tally/Formbricks-URLs einsetzen -->`. Ich liefere die URLs nach.

### 4.8 · Footer (minimal)

Linke Seite:
> Johannes Brötz · Broetzens IT Cattles & Cows
> Nordhessen · hallo@broetzens.de

Rechte Seite:
> [broetzens.de](https://broetzens.de) · [Impressum](https://broetzens.de/impressum) · [Datenschutz](https://broetzens.de/datenschutz)

---

## 5 · Design-Tokens (aus dem bestehenden Brand-System)

Die Landingpage soll **bewusst vom Rest der Seite leicht abweichen**:
- du-Form statt Sie (Pattern-Interrupt)
- Soil-Braun als Akzent statt Forest-Grün
- Editorial-Manifest-Stil

Aber: alle anderen Marken-Elemente bleiben (Schriften, Schwarz-Hierarchie, Highland-Cattle-Logo).

### CSS-Variablen (falls noch nicht im Repo, anlegen):

```css
:root {
  /* Inks */
  --ink-950: #0A0B0D;
  --ink-900: #15171A;
  --ink-700: #2C2F36;
  --ink-500: #5E636E;
  --ink-300: #A8ADB5;
  --ink-200: #D2D5DB;
  --ink-100: #ECEEF1;
  --ink-50:  #F6F7F8;

  /* Paper (off-white für kraft-feel) */
  --paper:      #FAF8F3;
  --paper-pure: #FFFFFF;

  /* Brand greens (sparsam, nur Konsistenz mit Hauptseite) */
  --forest-700: #1F4F38;
  --forest-100: #E6F1EA;

  /* Soil — Primärakzent dieser Landingpage */
  --soil-800: #3B2A1E;
  --soil-600: #6B4A30;   /* ← Akzentfarbe für Hervorhebungen */
  --soil-200: #E3D0B8;
  --soil-100: #F3ECDF;
}
```

### Typografie

- Display (Headlines): `"Space Grotesk"`, fallback `"Inter"`, weights 600/700
- Body: `"Inter"`, weights 400/600/700
- Mono (Eyebrows, Trust-Row, URLs): `"JetBrains Mono"`, weights 400/500/600

Falls die Hauptseite die Fonts schon lädt: wiederverwenden, nicht doppelt laden.

### Layout-Prinzipien

- Max content width: 720 px (single-column, lesefreundlich)
- Generöser Whitespace (Section-Padding mind. 48px)
- Linker Soil-Brown-Border-Akzent (`border-left: 2px solid var(--soil-600)`) am Why-Block
- Formular-Section auf reinem Weiß (`var(--paper-pure)`) mit 1px Border `var(--ink-200)`, scharfe Ecken (radius 0)
- Submit-Button: schwarz (`var(--ink-950)`), kein Border-Radius
- Mobile-first, aber Desktop sollte nicht beschämend wirken

### Was zu vermeiden ist
- Card-Schatten, Gradients, Glassmorphism
- Bunte Icons (außer ein paar dezente Material-Symbols falls Material schon im Repo)
- Animations außer subtilen Fade-Ins beim Initial-Load (`prefers-reduced-motion` respektieren)

---

## 6 · Akzeptanzkriterien

Bevor du fertig sagst, prüfe:

- [ ] `https://broetzens.de/rostock` lädt auf Desktop und Mobile, kein 404 bei Direktaufruf
- [ ] Headline-Wechsel der zweiten Zeile zu Soil-Braun + Kursiv sichtbar
- [ ] Foto lädt scharf, nicht verzerrt, ist responsive
- [ ] Formular submittet erfolgreich → Erfolgsmeldung erscheint → ich bekomme die Einsendung als E‑Mail oder im konfigurierten Backend
- [ ] Validierung: Pflichtfeld (Textarea) verhindert leeren Submit
- [ ] Mobile: Tippen auf Eingabefelder springt nicht (Viewport-Meta korrekt)
- [ ] Analytics: Pageview wird gezählt (falls vorhanden)
- [ ] Lighthouse-Score Mobile Performance ≥ 85, Accessibility ≥ 95
- [ ] Lädt auch ohne JavaScript zumindest die Inhalte sichtbar an (SSR/SSG falls möglich – sonst egal, ist nicht Pflicht)
- [ ] Keine Console-Errors im Browser
- [ ] Keine ungenutzten Imports oder Dead Code
- [ ] Commit-Message folgt der Repo-Konvention

---

## 7 · Workflow

1. Findings aus Schritt 2 zusammenfassen, Vorschlag machen, **warten auf mein OK**.
2. Branch anlegen, z. B. `feature/rostock-landing`.
3. Bauen, lokal testen mit `npm run dev`.
4. Build, Container neu bauen, deployen auf eine Staging-URL oder zeig mir, wie ich es lokal mit `docker compose up` prüfen kann.
5. Erst nach meinem OK → Merge in main → Production-Deployment.

**Nicht-Ziele für diesen Auftrag**:
- Keine Refaktorierung der Hauptseite
- Keine Brand-System-Updates über die Landingpage hinaus
- Kein Login/Auth (die Page ist öffentlich)
- Keine A/B-Tests

---

## 8 · Fragen, die du mir stellen darfst (Beispiele)

- "Ich sehe kein Backend für Formulare. Empfehlung: Tally mit Webhook auf
   hallo@broetzens.de. Bist du einverstanden?"
- "Routing nutzt aktuell Hash-Mode. Soll ich auf History-Mode umstellen
   (mehr Aufwand, aber schönere URL)?"
- "Plausible ist nicht eingebaut. Soll ich ein Conversion-Event nur in der
   Browser-Console loggen, bis du Plausible aufgeschaltet hast?"

Stell die Fragen lieber einmal zu viel als einmal zu wenig. Ich bin zwar nicht
professioneller Entwickler, aber Förster mit etwas Python‑ und React‑Erfahrung
– du musst mir nichts vorbeten, aber bitte erkläre Entscheidungen kurz.
