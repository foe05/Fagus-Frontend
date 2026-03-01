# WordPress Gutenberg CSS-Klassen

Wiederverwendbare Layout-Klassen fuer WordPress-Seiteninhalte.
Alle Klassen muessen innerhalb eines Containers mit der Klasse `wp-content` verwendet werden.

**Anwendung im Gutenberg-Editor:** Block auswaehlen > rechte Seitenleiste > "Erweitert" > "Zusaetzliche CSS-Klasse(n)"

---

## Uebersicht

| Klasse | Zweck |
|---|---|
| `.wp-content` | Container-Reset: stellt Typografie fuer h2/h3/h4/p/ul/ol/li wieder her |
| `.steps-grid` | 2x2 Kachel-Grid fuer Prozess-Schritte |
| `.step-card` | Einzelne Kachel mit Icon-Kreis und Text |
| `.step-icon` | Icon-Kreis innerhalb einer Step-Card |
| `.feature-bubbles` | 3-spaltiges Grid fuer Feature-/Werte-Karten |
| `.feature-bubble` | Einzelne zentrierte Bubble-Karte |
| `.bubble-icon` | Icon-Kreis innerhalb einer Feature-Bubble |
| `.nav-cards` | Grid fuer groessere Link-Kacheln (2/4 Spalten) |
| `.nav-card` | Einzelne Link-Kachel mit Hover-Effekt |
| `.nav-card-icon` | Icon-Kreis innerhalb einer Nav-Card |
| `.benefits-list` | Liste mit Checkmark-Haekchen statt Bullets |
| `.cta-box` | Call-to-Action Box mit Button |
| `.icon-text` | Icon links, Text rechts (inline) |

---

## 1. `.wp-content` -- Container-Reset

Stellt die von Tailwind-Preflight zurueckgesetzten Standard-Styles fuer Ueberschriften, Absaetze und Listen wieder her.

**Wichtig:** Alle anderen Layout-Klassen muessen innerhalb eines `wp-content`-Containers stehen.

```html
<!-- Gutenberg: Gruppe-Block mit Klasse "wp-content" -->
<div class="wp-block-group wp-content">
  <h2>Ueberschrift wird korrekt dargestellt</h2>
  <p>Absatztext mit korrekter Schriftgroesse und Farbe.</p>
  <ul>
    <li>Listen-Eintrag mit Aufzaehlungszeichen</li>
    <li>Weiterer Eintrag</li>
  </ul>
</div>
```

---

## 2. `.steps-grid` + `.step-card` -- Prozess-Schritte

2x2 Kachel-Layout fuer nummerierte Prozess-Schritte mit Icon, Titel und Beschreibung.

**Referenz-Seite:** `/services/digitalisierungsstrategie` -- Sektion "Unser Ansatz"

```html
<div class="wp-block-group wp-content">
  <h3>Unser Ansatz</h3>

  <div class="wp-block-group steps-grid">

    <div class="wp-block-group step-card">
      <div class="wp-block-group step-icon">
        <span class="material-symbols-outlined">analytics</span>
      </div>
      <div class="wp-block-group">
        <h4>1. Analyse</h4>
        <p>Wir analysieren Ihre aktuellen Prozesse und identifizieren Optimierungspotenziale.</p>
      </div>
    </div>

    <div class="wp-block-group step-card">
      <div class="wp-block-group step-icon">
        <span class="material-symbols-outlined">map</span>
      </div>
      <div class="wp-block-group">
        <h4>2. Strategie</h4>
        <p>Gemeinsam entwickeln wir eine massgeschneiderte Digitalisierungs-Roadmap.</p>
      </div>
    </div>

    <div class="wp-block-group step-card">
      <div class="wp-block-group step-icon">
        <span class="material-symbols-outlined">build</span>
      </div>
      <div class="wp-block-group">
        <h4>3. Umsetzung</h4>
        <p>Wir begleiten Sie bei der Implementierung und Integration neuer Technologien.</p>
      </div>
    </div>

    <div class="wp-block-group step-card">
      <div class="wp-block-group step-icon">
        <span class="material-symbols-outlined">tune</span>
      </div>
      <div class="wp-block-group">
        <h4>4. Optimierung</h4>
        <p>Kontinuierliche Verbesserung und Anpassung an neue Anforderungen.</p>
      </div>
    </div>

  </div>
</div>
```

**Gutenberg-Aufbau:**
1. Gruppe-Block mit Klasse `steps-grid`
2. Darin 4x Gruppe-Block mit Klasse `step-card`
3. Jede Step-Card enthaelt eine Gruppe `step-icon` (mit Material-Icon-Absatz) und eine Gruppe mit h4 + p

---

## 3. `.feature-bubbles` + `.feature-bubble` -- Feature-Karten

3-spaltiges Grid fuer zentrierte Feature- oder Werte-Karten mit grossem Icon.

**Referenz-Seite:** `/ueber-uns` -- Sektion mit 3 Bubbles (Forst-Expertise, Technologie, Partnerschaft)

```html
<div class="wp-block-group wp-content">
  <div class="wp-block-group feature-bubbles">

    <div class="wp-block-group feature-bubble">
      <div class="wp-block-group bubble-icon">
        <span class="material-symbols-outlined">eco</span>
      </div>
      <h3>Forst-Expertise</h3>
      <p>Tiefes Verstaendnis fuer die Herausforderungen der Branche</p>
    </div>

    <div class="wp-block-group feature-bubble">
      <div class="wp-block-group bubble-icon">
        <span class="material-symbols-outlined">code</span>
      </div>
      <h3>Technologie</h3>
      <p>Moderne AI-First Entwicklung fuer zukunftssichere Loesungen</p>
    </div>

    <div class="wp-block-group feature-bubble">
      <div class="wp-block-group bubble-icon">
        <span class="material-symbols-outlined">handshake</span>
      </div>
      <h3>Partnerschaft</h3>
      <p>Langfristige Begleitung auf Augenhoehe</p>
    </div>

  </div>
</div>
```

**Gutenberg-Aufbau:**
1. Gruppe-Block mit Klasse `feature-bubbles`
2. Darin 3x Gruppe-Block mit Klasse `feature-bubble`
3. Jede Bubble enthaelt eine Gruppe `bubble-icon` (mit Material-Icon), h3 und p

---

## 4. `.nav-cards` + `.nav-card` -- Navigations-Kacheln

Grid fuer groessere Link-Kacheln mit Icon, Titel und Beschreibung. Hover-Effekt mit Schatten und Verschiebung.

**Referenz-Seite:** `/ueber-uns` -- Sektion "Mehr ueber uns erfahren"

```html
<div class="wp-block-group wp-content">
  <h2>Mehr ueber uns erfahren</h2>

  <div class="wp-block-group nav-cards">

    <a class="wp-block-group nav-card" href="/ueber-uns/team-werte">
      <div class="wp-block-group nav-card-icon">
        <span class="material-symbols-outlined">group</span>
      </div>
      <h3>Team &amp; Werte</h3>
      <p>Lernen Sie unser Team kennen</p>
    </a>

    <a class="wp-block-group nav-card" href="/ueber-uns/ai-first-ansatz">
      <div class="wp-block-group nav-card-icon">
        <span class="material-symbols-outlined">psychology</span>
      </div>
      <h3>AI-First Ansatz</h3>
      <p>Wie wir KI einsetzen</p>
    </a>

    <a class="wp-block-group nav-card" href="/ueber-uns/referenzen">
      <div class="wp-block-group nav-card-icon">
        <span class="material-symbols-outlined">star</span>
      </div>
      <h3>Referenzen</h3>
      <p>Erfolgreiche Projekte</p>
    </a>

    <a class="wp-block-group nav-card" href="/ueber-uns/blog-wissen">
      <div class="wp-block-group nav-card-icon">
        <span class="material-symbols-outlined">menu_book</span>
      </div>
      <h3>Blog &amp; Wissen</h3>
      <p>Aktuelle Artikel</p>
    </a>

  </div>
</div>
```

**Gutenberg-Aufbau:**
1. Gruppe-Block mit Klasse `nav-cards`
2. Darin Gruppe-Bloecke mit Klasse `nav-card` (ggf. als verlinkte Gruppe)
3. Jede Nav-Card enthaelt eine Gruppe `nav-card-icon` (mit Material-Icon), h3 und p

**Responsive:** 1 Spalte (Mobile) > 2 Spalten (ab 768px) > 4 Spalten (ab 1024px)

---

## 5. `.benefits-list` -- Checkmark-Liste

Liste mit gruenen Haekchen statt Standard-Aufzaehlungszeichen.

**Referenz-Seite:** `/services/digitalisierungsstrategie` -- Sektion "Ihre Vorteile"

```html
<div class="wp-block-group wp-content">
  <h3>Ihre Vorteile</h3>

  <ul class="benefits-list">
    <li>Langfristige Strategie statt Ad-hoc Loesungen</li>
    <li>Praxisorientierte Beratung von Experten mit Forst-Know-how</li>
    <li>AI-First Ansatz fuer moderne, zukunftssichere Loesungen</li>
    <li>Begleitung von der Planung bis zur erfolgreichen Umsetzung</li>
    <li>Schulung und Befaehigung Ihrer Mitarbeiter</li>
  </ul>
</div>
```

**Gutenberg-Aufbau:**
1. Listen-Block erstellen
2. Klasse `benefits-list` hinzufuegen
3. Die Haekchen werden automatisch per CSS eingefuegt

---

## 6. `.cta-box` -- Call-to-Action Box

Hervorgehobene Box mit zentriertem Inhalt, Hintergrundfarbe und Button-Styling fuer Links.

**Referenz-Seite:** `/services/digitalisierungsstrategie` -- CTA am Seitenende, `/produkte/hegegemeinschaft-management` -- CTA-Bereich

```html
<div class="wp-block-group wp-content">
  <div class="wp-block-group cta-box">
    <h3>Bereit fuer die digitale Transformation?</h3>
    <p>Vereinbaren Sie ein kostenloses Erstgespraech und erfahren Sie,
       wie wir Ihren Forstbetrieb digitalisieren koennen.</p>
    <a href="/kontakt">
      <span class="material-symbols-outlined">call</span>
      Jetzt Kontakt aufnehmen
    </a>
  </div>
</div>
```

**Gutenberg-Aufbau:**
1. Gruppe-Block mit Klasse `cta-box`
2. Darin h3, Absatz und Button-Block (oder Link)
3. Der Button/Link erhaelt automatisch das Pill-Design mit Hover-Effekt

---

## 7. `.icon-text` -- Icon + Text inline

Kompaktes Layout mit Icon links und Text rechts, fuer kleinere Informations-Elemente.

**Referenz-Seite:** `/produkte/hegegemeinschaft-management` -- Hero-Statistiken (z.B. "60+ aktive Nutzer")

```html
<div class="wp-block-group wp-content">
  <div class="wp-block-group icon-text">
    <span class="material-symbols-outlined">check_circle</span>
    <span>60+ aktive Nutzer</span>
  </div>

  <div class="wp-block-group icon-text">
    <span class="material-symbols-outlined">verified</span>
    <span>Seit 2022 im Einsatz</span>
  </div>
</div>
```

**Gutenberg-Aufbau:**
1. Gruppe-Block mit Klasse `icon-text`
2. Darin ein Absatz mit Material-Icon-Klasse und ein Text-Absatz

---

## Responsive Verhalten

Alle Grid-Layouts fallen auf Mobile (< 768px) automatisch auf eine Spalte zurueck:

| Klasse | Mobile (< 768px) | Tablet (>= 768px) | Desktop (>= 1024px) |
|---|---|---|---|
| `.steps-grid` | 1 Spalte | 2 Spalten | 2 Spalten |
| `.feature-bubbles` | 1 Spalte | 3 Spalten | 3 Spalten |
| `.nav-cards` | 1 Spalte | 2 Spalten | 4 Spalten |

---

## Material Icons verwenden

Die Klassen setzen voraus, dass Google Material Symbols Outlined geladen ist (ist bereits im Projekt eingebunden). Icon-Namen findet man unter:
https://fonts.google.com/icons

```html
<span class="material-symbols-outlined">icon_name</span>
```

---

## CSS-Variablen (Design-System)

Die Klassen verwenden ausschliesslich die vorhandenen CSS-Variablen:

| Variable | Wert | Verwendung |
|---|---|---|
| `--primary` | `#3E4E3A` | Olivgruen -- Icons, Links, Buttons |
| `--primary-light` | `#6B8E5C` | Moosgruen -- Button-Hover |
| `--text-dark` | `#2C2C2C` | Ueberschriften |
| `--text-medium` | `#616161` | Fliesstexte |
| `--bg-light` | `#F8F8F8` | Karten-/Box-Hintergrund |
| `--bg-surface` | `#FFFFFF` | Nav-Card-Hintergrund |
| `--border-light` | `#E0E0E0` | Rahmen (bei Bedarf) |
