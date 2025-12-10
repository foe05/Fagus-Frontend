# Broetzens IT Cattles & Cows

Eine moderne, vollständig responsive Next.js-Website für "Broetzens IT Cattles & Cows" – eine AI-First IT-Beratung für Forstbetriebe.

![Next.js](https://img.shields.io/badge/Next.js-15.5.7-black?style=flat-square&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.7.2-blue?style=flat-square&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4.17-38bdf8?style=flat-square&logo=tailwind-css)

## Features

### Homepage - Interaktiver Baum
- Fotorealistisches Baum-Bild (Rotbuche) mit 6 interaktiven Hotspots
- Animierte Pulse-Effekte auf jedem Hotspot
- Click-to-Open Pop-ups mit detaillierten Informationen
- Scroll Indicator mit Bounce-Animation
- Responsive Design für alle Endgeräte

### Design System
- **Material Design 3** Guidelines
- **Roboto** Schriftart via Google Fonts
- **Material Symbols Outlined** Icons
- Gedeckte, natürliche Farben (Olivgrün, Moosgrün, Salbeigrün)
- Vollständige Typography Scale (Display, Headline, Title, Body, Label)

### Komponenten
- **Header**: Fixed Navigation mit Scroll-Effekt, Logo, Mobile Menu
- **Footer**: 5 Spalten mit Services, Produkte, Unternehmen, Kontakt + Social Links
- **Progress Bar**: Zeigt Scroll-Fortschritt an
- **Tree Container**: Hauptkomponente mit Baum-Bild und Hotspots
- **Hotspot Component**: Interaktive Punkte mit Hover-Effekten
- **Popup Component**: Modal-Dialoge mit Slide-up Animation

### Seiten
- **Homepage** (`/`) - Interaktiver Baum
- **Services** (`/services`) - Übersicht aller Services
  - Digitalisierungs-Strategie
  - Prozessoptimierung & Automatisierung
  - Change Management
  - Prototyping & MVP
- **Produkte** (`/produkte`) - Übersicht aller Produkte
  - Hegegemeinschaft Management
  - Erdmassenberechnung
  - Hosting & Support
- **Über uns** (`/ueber-uns`) - Firmeninfo
  - Team & Werte
  - AI-First Ansatz
  - Referenzen
  - Blog & Wissen
- **Kontakt** (`/kontakt`) - Kontaktformular + Infos

### WordPress Integration (NEU ✨)

Die Website kann **kompletten Content aus WordPress** laden!

#### Blog-Posts (aktiv ✅)
- WordPress REST API Integration
- Automatisches Caching (5 Minuten Revalidation)
- Blog-Übersicht mit Grid-Layout
- Einzelne Blog-Posts mit Dynamic Routes
- Featured Images Support

#### WordPress-Seiten (NEU ✅)
- **Automatische Dynamic Route** für alle WordPress-Seiten
- **Hybrid-Ansatz**: WordPress überschreibt statische Next.js Seiten
- **14 Seiten bereits erkannt** aus WordPress
- Vollständig styled mit Material Design 3
- SEO-optimiert mit Metadata

**📖 Ausführliche Anleitung**: Siehe [WORDPRESS_INTEGRATION.md](WORDPRESS_INTEGRATION.md)

**Bereits verfügbare WordPress-Seiten:**
- `/impressum`, `/datenschutz`, `/agb` (rechtliche Seiten)
- `/team-werte`, `/ai-first-ansatz`, `/referenzen` (Content)
- `/erdmassenberechnung`, `/hosting` (Produkte)
- und 6 weitere...

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript (Strict Mode)
- **Styling**: Tailwind CSS
- **Animations**: GSAP
- **Icons**: Material Symbols Outlined (Google Fonts)
- **CMS**: WordPress REST API
- **Image Optimization**: Next.js Image Component

## Getting Started

### Voraussetzungen
- Node.js 20.9.0 oder höher
- npm 9.x oder höher

### Installation

```bash
# Dependencies installieren
npm install

# Development Server starten
npm run dev

# Production Build erstellen
npm run build

# Production Server starten
npm start

# Linting
npm run lint
```

Die Entwicklungs-Website läuft auf [http://localhost:3000](http://localhost:3000).

## Projektstruktur

```
Fagus-Frontend/
├── app/
│   ├── layout.tsx                 # Root Layout mit Header/Footer
│   ├── page.tsx                   # Homepage (Baum)
│   ├── globals.css                # Global Styles + Typography
│   ├── services/                  # Services-Seiten
│   ├── produkte/                  # Produkte-Seiten
│   ├── ueber-uns/                 # Über uns + Blog
│   └── kontakt/                   # Kontakt-Seite
├── components/
│   ├── Header.tsx                 # Navigation Component
│   ├── Footer.tsx                 # Footer Component
│   ├── ProgressBar.tsx            # Scroll Progress
│   ├── Tree/
│   │   ├── TreeContainer.tsx      # Hauptkomponente
│   │   ├── Hotspot.tsx            # Einzelner Hotspot
│   │   └── Popup.tsx              # Pop-up Dialog
│   ├── blog/
│   │   └── BlogCard.tsx           # Blog Preview Card
│   └── ui/                        # Weitere UI-Komponenten
├── lib/
│   ├── wordpress.ts               # WordPress API Client
│   ├── types.ts                   # TypeScript Interfaces
│   └── constants.ts               # Konstanten (Hotspots, Navigation, etc.)
├── public/
│   ├── baum.webp                  # Baum-Foto
│   ├── logo-color.png             # Logo (farbig)
│   └── logo-white.png             # Logo (weiß)
├── tailwind.config.ts             # Tailwind Konfiguration
├── tsconfig.json                  # TypeScript Konfiguration
└── next.config.ts                 # Next.js Konfiguration
```

## Design-System

### Farben

```css
--primary: #3E4E3A;        /* Olivgrün */
--primary-light: #6B8E5C;  /* Moosgrün */
--secondary: #9CAF88;      /* Salbeigrün */
--accent: #8B7355;         /* Warmes Braun */
```

### Typography Scale

- **Display**: Hero-Überschriften (36-57px)
- **Headline**: Sektions-Überschriften (24-32px)
- **Title**: Card-Überschriften (14-22px)
- **Body**: Fließtext (12-16px)
- **Label**: Buttons, Navigation (11-14px)

### Responsive Breakpoints

- **Mobile**: < 768px
- **Tablet**: 768px - 1024px
- **Desktop**: > 1024px

## WordPress Integration

Die Website integriert Blog-Posts von [https://broetzens.de](https://broetzens.de) via WordPress REST API.

### API Endpoints
- Posts: `https://broetzens.de/wp-json/wp/v2/posts`
- Featured Images: Über `_embed` Parameter
- Caching: 5 Minuten Server-Side Revalidation

### Verwendung

```typescript
import { getPosts, getPostBySlug } from '@/lib/wordpress';

// Alle Posts abrufen
const posts = await getPosts(12);

// Einzelnen Post abrufen
const post = await getPostBySlug('mein-post-slug');
```

## Performance

- **Lighthouse Score**: > 90 (Production Build)
- **Image Optimization**: WebP Format, Next.js Image Component
- **Code Splitting**: Automatisch durch Next.js App Router
- **Caching**: WordPress API mit 5 Minuten Revalidation
- **SEO**: Meta Tags, OpenGraph, Structured Data

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile Browsers (iOS Safari, Chrome Mobile)

## Deployment

### Vercel (empfohlen)

```bash
# Vercel CLI installieren
npm i -g vercel

# Deployment
vercel

# Production Deployment
vercel --prod
```

### Environment Variables

Erstelle eine `.env.local` Datei:

```env
NEXT_PUBLIC_WP_API_URL=https://broetzens.de/wp-json/wp/v2
```

## Entwicklung

### Neue Seite hinzufügen

1. Erstelle ein neues Verzeichnis in `app/`
2. Füge `page.tsx` hinzu
3. Optional: Füge Navigation in `lib/constants.ts` hinzu

### Neue Komponente erstellen

1. Erstelle Datei in `components/`
2. Verwende TypeScript Interfaces aus `lib/types.ts`
3. Importiere und verwende in Seiten

### Styling

- Verwende Tailwind Utility Classes
- Verwende vordefinierte Typography Classes (`.display-large`, `.body-medium`, etc.)
- Verwende CSS Variables für Farben (`var(--primary)`)

## Troubleshooting

### Build-Fehler

```bash
# Dependencies neu installieren
rm -rf node_modules package-lock.json
npm install

# Next.js Cache löschen
rm -rf .next
npm run build
```

### TypeScript-Fehler

```bash
# TypeScript Cache löschen
rm -rf .next/types
npm run build
```

## To-Do

- [ ] GSAP Animationen für Scroll-basierte Effects
- [ ] Weitere Service-Detailseiten erstellen
- [ ] Weitere Produkt-Detailseiten erstellen
- [ ] Team & Werte Seite mit Content füllen
- [ ] AI-First Ansatz Seite erstellen
- [ ] Referenzen Seite mit Case Studies
- [ ] Impressum, Datenschutz, AGB Seiten
- [ ] E-Mail-Integration für Kontaktformular
- [ ] Analytics (Google Analytics / Plausible)
- [ ] Sitemap & robots.txt

## License

© 2025 Broetzens IT Cattles & Cows. Alle Rechte vorbehalten.

## Kontakt

- **Website**: [https://broetzens.de](https://broetzens.de)
- **E-Mail**: kontakt@broetzens.de
- **Telefon**: +49 123 456789

---

**Entwickelt mit** ❤️ **und** Next.js 15
