# WordPress Integration Guide

Diese Next.js-Website kann Content direkt von deiner WordPress-Installation bei https://broetzens.de laden.

## 🎯 Wie es funktioniert

### Zwei Arten von WordPress-Content

#### 1. **Blog-Posts** (bereits aktiv ✅)
- **URL in Next.js**: `/ueber-uns/blog-wissen/[slug]`
- **WordPress**: Erstelle normale Blog-Posts
- **Automatisch**: Alle Posts werden automatisch geladen

#### 2. **WordPress-Seiten** (NEU ✅)
Es gibt **zwei Wege**, WordPress-Seiten zu nutzen:

##### Option A: Automatische Dynamic Route
- **URL in Next.js**: `https://deine-domain.de/[beliebiger-slug]`
- **WordPress**: Erstelle eine Seite mit beliebigem Slug
- **Automatisch**: Next.js findet und zeigt die Seite an

**Beispiele der bereits erkannten Seiten:**
```
✅ /ki-first-ansatz
✅ /wissen
✅ /erdmassenberechnung
✅ /team-werte
✅ /referenzen
... und 9 weitere
```

##### Option B: Hybrid-Ansatz (empfohlen)
- **Next.js Seite** existiert bereits (z.B. `/ueber-uns/team-werte`)
- **WordPress**: Erstelle Seite mit passendem Slug (`team-werte`)
- **Automatisch**: WordPress-Content überschreibt die statische Seite
- **Fallback**: Wenn keine WordPress-Seite existiert, wird die Next.js Seite angezeigt

## 📝 WordPress-Seite erstellen

### Schritt 1: In WordPress einloggen
Gehe zu https://broetzens.de/wp-admin

### Schritt 2: Neue Seite erstellen
1. Klicke auf "Seiten" → "Erstellen"
2. Schreibe deinen Content im WordPress-Editor
3. **WICHTIG**: Setze den richtigen Slug

### Schritt 3: Slug festlegen
Der **Slug** bestimmt die URL in Next.js!

**Beispiele:**

| WordPress Slug | Next.js URL |
|----------------|-------------|
| `team-werte` | `/team-werte` ODER `/ueber-uns/team-werte` (wenn Hybrid) |
| `ai-first-ansatz` | `/ai-first-ansatz` |
| `impressum` | `/impressum` |
| `datenschutz` | `/datenschutz` |

### Schritt 4: Seite veröffentlichen
Klicke auf "Veröffentlichen" - fertig! 🎉

## 🔄 Wie oft wird aktualisiert?

- **Automatisches Caching**: 5 Minuten
- **Nach 5 Minuten**: Next.js holt sich neue Daten von WordPress
- **Instant Update**: Rebuild triggern mit `npm run build`

## 💡 Empfohlene Seiten für WordPress

Diese Seiten solltest du in WordPress erstellen:

### Rechtliche Seiten
- ✅ `impressum` - Impressum
- ✅ `datenschutz` - Datenschutzerklärung
- ✅ `agb` - Allgemeine Geschäftsbedingungen

### Content-Seiten
- ✅ `team-werte` - Team & Werte
- ✅ `ai-first-ansatz` - AI-First Ansatz
- ✅ `referenzen` - Referenzen & Case Studies

### Service-Detailseiten
- ✅ `prozessoptimierung-automatisierung` - Prozessoptimierung
- ✅ `change-management` - Change Management
- ✅ `prototyping-mvp` - Prototyping & MVP

### Produkt-Detailseiten
- ✅ `erdmassenberechnung` - Erdmassenberechnung
- ✅ `hosting` - Hosting & Support

## 🎨 WordPress-Editor Tipps

### Bilder
- **Featured Image** wird automatisch als Hero-Image angezeigt
- **Im Content**: Bilder werden responsive und optimiert

### Formatierung
Die folgenden WordPress-Formatierungen werden automatisch styled:

- **Überschriften** (H1-H6): Material Design Typography
- **Listen** (ul/ol): Styled Bullets
- **Blockquotes**: Grüner Border + Hintergrund
- **Code**: Syntax Highlighting
- **Links**: Primary Color mit Hover
- **Bilder**: Rounded Corners + Shadow

### Gutenberg Blocks
Fast alle Gutenberg Blocks werden unterstützt:
- ✅ Absatz
- ✅ Überschriften
- ✅ Listen
- ✅ Bilder
- ✅ Zitate
- ✅ Code
- ✅ Spalten
- ✅ Buttons (werden zu Primary Buttons)

## 🔧 Technische Details

### API Endpoints

```typescript
// Alle Seiten abrufen
const pages = await getPages(100);

// Einzelne Seite per Slug
const page = await getPageBySlug('team-werte');

// Alle Slugs (für Static Generation)
const slugs = await getAllPageSlugs();
```

### WordPress REST API URLs
```
https://broetzens.de/wp-json/wp/v2/pages
https://broetzens.de/wp-json/wp/v2/posts
```

### Caching
```typescript
export const revalidate = 300; // 5 Minuten
```

## 🚀 Best Practices

### DO ✅
- Verwende **beschreibende Slugs** (z.B. `team-werte` statt `seite-1`)
- Setze **Featured Images** für Hero-Sections
- Nutze **Überschriften-Hierarchie** (H2 → H3 → H4)
- Schreibe **kurze Absätze** (besser lesbar)
- Füge **Alt-Texte** zu Bildern hinzu

### DON'T ❌
- Keine **inline Styles** (werden ignoriert)
- Keine **Custom HTML** mit absoluten Positionierungen
- Keine **sehr großen Bilder** (max 2 MB)
- Keine **Sonderzeichen in Slugs** (nur: a-z, 0-9, -)

## 📊 WordPress-Seiten verwalten

### Aktuelle Seiten prüfen

```bash
# API direkt aufrufen (im Browser oder Terminal)
curl https://broetzens.de/wp-json/wp/v2/pages
```

### Seite löschen
1. In WordPress: Seite in Papierkorb verschieben
2. Nach 5 Minuten: Automatisch aus Next.js entfernt

### Seite umbenennen
1. In WordPress: Slug ändern
2. **ACHTUNG**: Alte URL funktioniert nicht mehr!
3. Redirect einrichten (optional)

## 🎯 Nächste Schritte

1. **Erstelle erste Seite**: Teste mit `impressum`
2. **Prüfe Ergebnis**: Gehe zu `http://localhost:3000/impressum`
3. **Iteriere**: Passe Design in WordPress an
4. **Produktiv**: Rebuild + Deploy

## ❓ Troubleshooting

### Seite wird nicht angezeigt?

**Prüfe:**
1. Ist die Seite in WordPress **veröffentlicht**? (nicht "Entwurf")
2. Ist der **Slug** korrekt gesetzt?
3. Warte **5 Minuten** (Caching)
4. Oder: `npm run build` → neu builden

### WordPress API nicht erreichbar?

```bash
# API testen
curl https://broetzens.de/wp-json/wp/v2/pages

# Erwartete Antwort: JSON mit Seiten-Array
# Bei Fehler: WordPress API aktivieren / CORS prüfen
```

### Featured Image wird nicht angezeigt?

1. Featured Image in WordPress gesetzt?
2. Bild-URL erreichbar?
3. `_embed` Parameter wird verwendet (automatisch)

## 🎨 Customization

### Eigenes Template erstellen

Kopiere `components/WordPressPage.tsx` und passe an:

```typescript
// components/WordPressPageCustom.tsx
import WordPressPageComponent from './WordPressPage';

export default function CustomPage({ page }) {
  return (
    <WordPressPageComponent
      page={page}
      showBackButton={true}
      backButtonText="Zur Übersicht"
      backButtonHref="/uebersicht"
    />
  );
}
```

### Spezielle Seite nur aus WordPress

```typescript
// app/meine-seite/page.tsx
import { getPageBySlug } from '@/lib/wordpress';
import WordPressPageComponent from '@/components/WordPressPage';
import { notFound } from 'next/navigation';

export default async function MeineSeitePage() {
  const page = await getPageBySlug('meine-seite');

  if (!page) {
    notFound(); // 404 wenn nicht in WordPress
  }

  return <WordPressPageComponent page={page} />;
}
```

---

**Fragen?** Schau in die [README.md](README.md) oder erstelle ein Issue.

**WordPress URL**: https://broetzens.de/wp-admin
**Live Preview**: http://localhost:3000
