# Gutenberg-Editor: Design-Bausteine fuer Redakteure

Diese Anleitung zeigt dir, wie du im WordPress-Backend Inhalte so anlegst, dass sie auf der oeffentlichen Webseite (broetzens.de) im richtigen Design erscheinen. Die Webseite laeuft als Next.js-Frontend, das die WordPress-Inhalte ausliest und mit einem eigenen Stylesheet rendert. Damit Layouts wie farbige Info-Boxen, Buttons oder Spalten korrekt aussehen, musst du den passenden Gutenberg-Block auswaehlen und ihm gegebenenfalls eine **zusaetzliche CSS-Klasse** mitgeben.

---

## 1. Wie das Design in Gutenberg anwenden

Du arbeitest im WordPress-Editor ganz normal mit den eingebauten Gutenberg-Bloecken (Absatz, Gruppe, Spalten, Button, Tabelle usw.). Der Unterschied ist: Einige Layouts (z.B. Info-Boxen, Feature-Cards, CTAs) erkennt das Frontend nur dann als solche, wenn du dem Block eine bestimmte **CSS-Klasse** mitgibst. Diese Klasse wird beim Veroeffentlichen mitgeschickt und das Next.js-Frontend blendet darauf das passende Styling ein.

Kurzregel:

1. Wahle den passenden Gutenberg-Block.
2. Trage bei Bedarf die richtige CSS-Klasse ein (siehe unten).
3. Speichern / Aktualisieren -> fertig.

---

## 2. Zusaetzliche CSS-Klasse - wo finde ich das?

Das Feld ist im Editor nicht auf den ersten Blick sichtbar. So kommst du hin:

1. Klicke im Editor auf den Block, dem du das Design geben willst (z.B. eine Gruppe).
2. Oeffne rechts die **Seitenleiste** (falls nicht sichtbar: oben rechts auf das Zahnrad-Symbol klicken).
3. Stelle sicher, dass der Tab **"Block"** aktiv ist (nicht "Beitrag" / "Seite").
4. Scrolle in der Seitenleiste ganz nach unten bis zum Eintrag **"Erweitert"** und klicke ihn auf.
5. Dort findest du das Feld **"Zusaetzliche CSS-Klasse(n)"**.
6. Trage die Klasse genau so ein, wie sie unten angegeben ist (kleingeschrieben, Bindestriche, **kein** vorangestellter Punkt).

Wichtige Hinweise:

- Trage die Klasse **ohne** fuehrenden Punkt ein. Also `callout`, **nicht** `.callout`.
- Mehrere Klassen trennst du mit Leerzeichen, z.B. `callout columns-3`.
- Klassen sind **case-sensitive** - `Callout` funktioniert nicht, `callout` schon.
- Nach dem Eintragen siehst du im Editor meist noch nicht das finale Design; das passiert erst im Frontend (Vorschau / Live-Seite).

---

## 3. Blocktypen und Design-Klassen

### 3.1 Spalten (2- und 3-spaltig)

**Gutenberg-Block:** Spalten (Columns)
**CSS-Klasse:** _keine_ fuer 2 Spalten, `columns-3` fuer 3 Spalten

**Wann verwenden:**
Immer, wenn du Inhalte nebeneinander zeigen willst, z.B. Vorteile, Produktmerkmale, Team-Mitglieder.

**Was passiert visuell:**

- Ohne zusaetzliche Klasse: Auf dem Desktop (ab 768 px Breite) zwei gleich breite Spalten nebeneinander, auf dem Handy untereinander gestapelt.
- Mit Klasse `columns-3`: Auf dem Desktop drei gleich breite Spalten, auf dem Handy ebenfalls untereinander.
- Zwischen den Spalten liegen 1,5 rem Abstand (ca. 24 px). Auch nach oben/unten gibt es etwas Luft.

**Hinweis:** Die im Gutenberg-Editor selbst waehlbaren Spalten-Varianten (z.B. "30 / 70") werden im Frontend bewusst auf die beiden Muster "alle gleich breit, 2-spaltig" bzw. "alle gleich breit, 3-spaltig" normalisiert. Wenn du asymmetrische Spalten brauchst, sprich uns an.

---

### 3.2 Gruppe (Standard-Card)

**Gutenberg-Block:** Gruppe (Group)
**CSS-Klasse:** _keine_

**Wann verwenden:**
Fuer kleine in sich geschlossene Inhaltsbloecke, die optisch leicht vom Fliesstext abgehoben sein sollen. Z.B. ein Kurzportrait, ein Hinweiskasten in dezent, eine kleine Info-Box innerhalb einer Spalte.

**Was passiert visuell:**

- Hellgrauer / cremefarbener Hintergrund (`--bg-light`).
- Padding rundherum (1,5 rem / ca. 24 px).
- Abgerundete Ecken (Radius 0,75 rem).
- Der erste und der letzte Kindblock haben automatisch keinen zusaetzlichen Abstand nach oben/unten, damit die Card kompakt bleibt.

---

### 3.3 Gruppe mit Primaerfarben-Hintergrund

**Gutenberg-Block:** Gruppe (Group)
**CSS-Klasse:** `has-primary-bg`

**Wann verwenden:**
Wenn ein Block besonders auffallen soll, etwa ein Zitat mit Highlight-Charakter, ein Abschnitt mit Kernbotschaft, oder ein Intro-Kasten.

**Was passiert visuell:**

- Hintergrund: Farbverlauf aus unserer Markenfarbe (`--primary` nach `--primary-light`).
- Alle Texte (Ueberschriften H3, H4 und Absaetze) werden automatisch **weiss** dargestellt - du musst die Textfarben nicht manuell setzen.
- Gleiche abgerundete Ecken und das Padding wie die Standard-Gruppe.

**Sparsam einsetzen:** Der Kasten ist bewusst auffaellig. Mehr als ein bis zwei pro Seite verlieren ihre Wirkung.

---

### 3.4 Feature Card (Icon + Text)

**Gutenberg-Block:** Gruppe (Group) mit genau zwei Kind-Elementen
**CSS-Klasse:** `feature-card`

**Wann verwenden:**
Fuer Listen von Merkmalen, Leistungen oder Vorteilen, bei denen links ein kleines Icon (oder Emoji) und rechts Titel + Beschreibung steht. Typisch auf Leistungs- und Produktseiten.

**Was passiert visuell:**

- Das erste Kind-Element wird zu einem runden, leicht eingefaerbten Kreis (3 rem Durchmesser, Hintergrund mit 10 % Primaerfarbe, Icon/Text in Primaerfarbe).
- Das zweite Kind-Element nimmt den uebrigen Platz ein und enthaelt z.B. einen Titel (H3/H4) plus Beschreibungs-Absatz.
- Die beiden Elemente stehen nebeneinander (Flex-Layout), oben ausgerichtet.

**So baust du sie auf:**

1. Gruppe einfuegen.
2. Ihr die CSS-Klasse `feature-card` geben.
3. In die Gruppe **zwei** Bloecke packen:
   - 1. Block: ein kleiner Absatz oder eine Ueberschrift mit einem Icon oder Emoji (z.B. `*` oder ein Material-Symbol). Dieser Block wird automatisch der runde Kreis.
   - 2. Block: eine weitere Gruppe oder ein Absatz mit dem eigentlichen Inhalt (Titel + Text).

Beispiel-Aufbau in Gutenberg:

```
Gruppe (CSS-Klasse: feature-card)
  - Absatz: "*"   (oder ein Icon-Block)
  - Gruppe
      - Ueberschrift (H3): "Schnell erstellt"
      - Absatz: "Prototyp in unter 4 Wochen live."
```

**Tipp:** Feature-Cards machen sich besonders gut **innerhalb von Spalten** (3.1) - so bekommst du eine Rasteransicht aus mehreren Karten.

---

### 3.5 Hervorgehobene Info-Box (Callout)

**Gutenberg-Block:** Gruppe (Group)
**CSS-Klasse:** `callout`

**Wann verwenden:**
Fuer wichtige Hinweise, die dem Leser auffallen sollen, aber den Lesefluss nicht brutal unterbrechen - z.B. "Gut zu wissen", "Achtung", Handlungsempfehlungen, Zwischenfazits.

**Was passiert visuell:**

- Dezent eingefaerbter Hintergrund (5 % Primaerfarbe, also ein helles Gruen-Grau).
- Auffaelliger **linker Rand** in Primaerfarbe (4 px breit) - wirkt wie ein Zitatbalken.
- Mehr Innenabstand als die Standard-Gruppe (2 rem rundum).
- Abgerundet nur rechts (links laeuft der Balken durch).

---

### 3.6 Call-to-Action-Box (CTA-Box)

**Gutenberg-Block:** Gruppe (Group)
**CSS-Klasse:** `cta-box`

**Wann verwenden:**
Am Ende einer Seite oder eines Abschnitts, wenn du den Leser zu einer konkreten Handlung bewegen willst: "Jetzt Kontakt aufnehmen", "Beratungstermin buchen", "Newsletter abonnieren". Innerhalb der Box kommt typischerweise eine kurze Aussage plus ein Button.

**Was passiert visuell:**

- Inhalt zentriert ausgerichtet.
- 2 rem Innenabstand, grosszuegiger Abstand nach oben (3 rem), damit die Box sich vom vorherigen Inhalt absetzt.
- Behaelt den hellen Standard-Gruppen-Hintergrund (kann bei Bedarf mit `has-primary-bg` kombiniert werden, dann wird die Box farbig - einfach beide Klassen mit Leerzeichen eintragen: `cta-box has-primary-bg`).

**Typischer Aufbau:**

```
Gruppe (CSS-Klasse: cta-box)
  - Ueberschrift (H3): "Lust, das gemeinsam anzugehen?"
  - Absatz: "Wir melden uns innerhalb eines Werktags."
  - Buttons-Block
      - Button: "Kontakt aufnehmen"
```

---

### 3.7 Button (Primaer, gefuellt)

**Gutenberg-Block:** Button (innerhalb eines Buttons-Blocks)
**CSS-Klasse:** _keine_

**Wann verwenden:**
Fuer die **Hauptaktion** auf einer Seite oder in einem Abschnitt - typisch "Kontakt", "Anfrage", "Mehr erfahren".

**Was passiert visuell:**

- Gefuellter Pillen-Button in Primaerfarbe, weisser Text.
- Komplett abgerundet (Radius 9999 px).
- Padding: 0,75 rem oben/unten, 2 rem links/rechts.
- Hover: Button wird minimal heller, erhaelt einen weichen Schatten, hebt sich leicht an.
- Mehrere Buttons in einem Buttons-Block stehen nebeneinander und umbrechen bei wenig Platz automatisch.

---

### 3.8 Button (Outline / Sekundaer)

**Gutenberg-Block:** Button, Block-Stil **"Umriss"** (Outline)
**CSS-Klasse:** _keine_ (es reicht, den Stil "Umriss" zu waehlen; technisch setzt Gutenberg dann automatisch `is-style-outline`)

So setzt du ihn:

1. Button einfuegen.
2. In der rechten Seitenleiste unter **"Stile"** die Variante **"Umriss"** waehlen.

**Wann verwenden:**
Fuer Neben- oder Sekundaer-Aktionen direkt neben einem Primaer-Button, z.B. "Mehr erfahren" neben "Jetzt kontaktieren".

**Was passiert visuell:**

- Transparenter Hintergrund, 2 px breiter Rahmen in Primaerfarbe, Text in Primaerfarbe.
- Hover: Der Button fuellt sich mit Primaerfarbe, Text wird weiss.
- Gleiche Rundung und Masse wie der Primaer-Button.

**Faustregel:** Pro Abschnitt nur **ein** Primaer-Button, sonst verliert er seine Wirkung. Outline-Buttons duerfen ruhig mehrfach vorkommen.

---

### 3.9 Trenner / Separator

**Gutenberg-Block:** Trenner (Separator)
**CSS-Klasse:** _keine_

**Wann verwenden:**
Um thematische Abschnitte innerhalb einer Seite voneinander abzusetzen, wenn eine neue Ueberschrift alleine zu abrupt wirkt.

**Was passiert visuell:**

- Feine, waagerechte Linie in hellem Grau (1 px, `--border-light`).
- 2 rem Abstand nach oben und unten.
- Kein dicker Balken - bewusst dezent.

---

### 3.10 Tabelle

**Gutenberg-Block:** Tabelle (Table)
**CSS-Klasse:** _keine_

**Wann verwenden:**
Fuer Vergleichsuebersichten, Preistabellen, Feature-Listen und aehnliche strukturierte Daten.

**Was passiert visuell:**

- Volle Breite des umgebenden Text-Containers.
- **Kopfzeile:** heller Hintergrund (`--bg-light`), linksbuendig, halbfett, mit zwei-Pixel-Rahmen nach unten.
- **Datenzeilen:** 0,75 rem / 1 rem Innenabstand, feine Trennlinie unter jeder Zeile.
- Die letzte Zeile hat bewusst keine Trennlinie (sauberer Abschluss).

**Tipp:** Wenn du eine Tabelle im Editor einfuegst, nutze unbedingt die Option **"Kopfzeile"** im Tabellen-Setup, damit die Kopfzeile ihr Styling bekommt.

---

### 3.11 Checklisten-Liste

**Gutenberg-Block:** Liste (unsortiert)
**CSS-Klasse:** `checklist`

**Wann verwenden:**
Wenn du eine Liste als Hakenliste zeigen willst - z.B. "Das bekommst du bei uns", Leistungsumfang, Vorteile.

**Was passiert visuell:**

- Normale Aufzaehlungspunkte werden ersetzt durch **gruene Haken** (Unicode-Haken `*` in kraeftigem Gruen).
- Kein Einzug, Text beginnt direkt links.
- Funktioniert auch, wenn du die Klasse auf einen umschliessenden Block setzt, der intern eine `<ul>` enthaelt.

---

## 4. Typografie - welche Ueberschriften wohin?

Im Fliesstext-Bereich (dem sogenannten `.prose`-Container) werden Ueberschriften automatisch auf unser Designsystem gemappt. Du musst **keine** CSS-Klassen setzen - einfach die richtige Heading-Ebene im Editor waehlen (Block "Ueberschrift" -> oben in der Toolbar H1, H2, H3, H4).

| Ebene im Editor | Automatisches Design     | Groesse Desktop       | Wofuer gedacht                                                     |
| --------------- | ------------------------ | --------------------- | ------------------------------------------------------------------ |
| H1              | Hero-Titel-Styling der Seite (headline-large im prose-Kontext) | 32 px / 40 px Zeile   | **Nur einmal pro Seite.** In der Regel uebernimmt die Seitentitel-Logik der Webseite das automatisch - du setzt H1 nur, wenn du wirklich eine eigene Hauptueberschrift im Inhalt willst. |
| H2              | headline-medium          | 28 px / 36 px Zeile   | Hauptabschnitte einer laengeren Seite                              |
| H3              | headline-small           | 24 px / 32 px Zeile   | Unterabschnitte innerhalb eines H2-Abschnitts                      |
| H4              | title-large              | 22 px / 28 px Zeile   | Feinere Zwischenueberschriften, Titel in Cards / Feature-Cards     |

Was sonst noch automatisch gestyled wird:

- **Absaetze (`p`)**: body-large (16 px, 24 px Zeilenhoehe), Textfarbe mittelgrau-dunkel.
- **Links (`a`)**: in Primaerfarbe, ohne Unterstrich. Beim Drueberfahren erscheint der Unterstrich.
- **Fett (`strong`)**: in dunklerer Textfarbe fuer bessere Lesbarkeit.
- **Listen (`ul`, `ol`)**: in mittlerer Textfarbe, Listenpunkte etwas kleiner (body-medium).
- **Bilder**: automatisch abgerundete Ecken und weicher Schatten.
- **Zitate (Blockquote)**: heller Hintergrund, linker Rand in Primaerfarbe, dezent abgerundet, nicht kursiv.
- **Inline-Code** (Backticks im Editor): heller Hintergrund, Primaerfarbe, leichtes Padding.
- **Code-Bloecke**: dunkelgruener Hintergrund in Primaerfarbe, weisser Text.

**Responsive:** Auf Mobilgeraeten (< 768 px) werden die Ueberschriften automatisch kleiner skaliert. Du musst dafuer nichts tun.

---

## 5. Best-Practice-Hinweise

### Kurze Absaetze

Halte Absaetze kurz (zwei bis fuenf Zeilen am Bildschirm). Das wirkt auf dem Handy deutlich angenehmer und laedt zum Weiterlesen ein.

### Ueberschriften hierarchisch aufbauen

Auf einer Seite gibt es **genau ein H1** (meist automatisch vom System). Danach folgst du der Logik H2 fuer Hauptabschnitte, H3 fuer Unterabschnitte, H4 fuer die feinste Ebene. Ueberspringe keine Ebenen (nicht direkt von H2 auf H4 springen). Das ist wichtig fuer SEO und Barrierefreiheit.

### Bilder immer mit Alt-Text

Jedes Bild braucht einen Alternativ-Text. Den traegst du im Editor ein, indem du das Bild anklickst und in der rechten Seitenleiste unter "Alternativtext" eine kurze Beschreibung hinterlegst (z.B. "Drei Menschen im Gespraech vor einem Whiteboard"). Der Text wird Screenreadern vorgelesen und hilft Suchmaschinen beim Verstehen des Bildes.

### Bilder nicht zu gross hochladen

Lade Bilder moeglichst schon in der Zielgroesse hoch. Als Faustregel: maximal 1600 px auf der laengsten Seite fuer Fliesstext-Bilder, maximal 2400 px fuer Hero-Bilder. Das schont die Ladezeit.

### Klassen sauber eintragen

- Immer **klein** schreiben.
- **Ohne** fuehrenden Punkt.
- Mehrere Klassen mit Leerzeichen trennen: `callout columns-3`.
- Keine Tippfehler: `feature-card`, nicht `feature_card` oder `featureCard`.

### Kombinieren geht

Klassen lassen sich oft kombinieren, z.B. `cta-box has-primary-bg` ergibt eine zentrierte, farbige Handlungsaufforderung. Kein Mischverbot, aber: Halte dich zurueck, damit die Seite nicht ueberladen wirkt.

### Vorschau nutzen

Die **Vorschau**-Funktion in WordPress oben rechts zeigt dir die Seite so, wie sie auf der Webseite aussehen wird. Das Backend-Rendering unterscheidet sich vom Frontend. Pruefe komplexere Layouts immer in der Vorschau, **bevor** du "Aktualisieren" klickst.

### Caching

Das Frontend aktualisiert Inhalte ca. alle 5 Minuten automatisch. Wenn du gerade etwas geaendert hast und es noch nicht siehst: kurz warten oder Seite neu laden.

### Blocke, die **nicht** hier auftauchen

Andere Gutenberg-Bloecke (Cover-Block, Galerie, Video, Einbettungen usw.) funktionieren grundsaetzlich, haben aber kein spezielles Styling im Stylesheet. Sie erscheinen im WordPress-Standardlook. Wenn du so einen Block regelmaessig brauchst, sag Bescheid - wir ergaenzen das Design dann.

---

## 6. Spickzettel - alle Klassen auf einen Blick

| Design                   | Block        | CSS-Klasse                 |
| ------------------------ | ------------ | -------------------------- |
| 3-spaltiges Layout       | Spalten      | `columns-3`                |
| Farbige Hero-Gruppe      | Gruppe       | `has-primary-bg`           |
| Icon + Text Feature-Card | Gruppe       | `feature-card`             |
| Hinweis- / Info-Box      | Gruppe       | `callout`                  |
| Call-to-Action-Box       | Gruppe       | `cta-box`                  |
| Farbige CTA-Box          | Gruppe       | `cta-box has-primary-bg`   |
| Hakenliste               | Liste        | `checklist`                |
| Outline-Button           | Button       | (Block-Stil "Umriss")      |

---

## 7. Abschluss

Wenn du ein Layout brauchst, das hier nicht aufgefuehrt ist - sei es eine spezielle Kachel, ein Preisplan, ein Vergleichs-Slider oder eine ausgefallene Kombination - meld dich bei uns. Wir pruefen dann, ob wir das zentrale Stylesheet um eine neue CSS-Klasse erweitern (dann kannst du es kuenftig selbst im Backend einsetzen) oder ob wir die Seite direkt im Frontend-Code bauen. So bleibt das System aufgeraeumt und fuer dich als Redakteur uebersichtlich.

Bei Fragen oder Unklarheiten: kurze Mail an `hallo@broetzens.de` reicht.
