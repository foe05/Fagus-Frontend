# Funktionale Erweiterungen - Dokumentation

Alle 4 funktionalen Erweiterungen wurden erfolgreich implementiert! 🎉

## ✅ 1. E-Mail-Integration für Kontaktformular

### Was wurde implementiert:

- **Server Action** mit Nodemailer für sicheren E-Mail-Versand
- **Professionell gestylte E-Mails** im HTML-Format
- **Vollständige Validierung** (Name, E-Mail, Nachricht)
- **Loading States** & **Error Handling**
- **Success/Error Messages** mit Animation

### Dateien:

- `app/actions/sendEmail.ts` - Server Action
- `app/kontakt/page.tsx` - Aktualisiertes Formular

### Setup:

1. **Erstelle `.env.local` Datei:**

```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=deine-email@gmail.com
SMTP_PASS=dein-app-passwort
CONTACT_EMAIL=kontakt@broetzens.de
```

2. **Gmail App-Passwort erstellen:**
   - Gehe zu https://myaccount.google.com/security
   - Aktiviere 2-Faktor-Authentifizierung
   - Erstelle App-Passwort für "Mail"
   - Nutze das 16-stellige Passwort als `SMTP_PASS`

3. **Alternativ: Andere SMTP-Anbieter:**

```env
# SendGrid
SMTP_HOST=smtp.sendgrid.net
SMTP_PORT=587
SMTP_USER=apikey
SMTP_PASS=dein-sendgrid-api-key

# Mailgun
SMTP_HOST=smtp.mailgun.org
SMTP_PORT=587
SMTP_USER=postmaster@deine-domain.com
SMTP_PASS=dein-mailgun-passwort

# AWS SES
SMTP_HOST=email-smtp.eu-central-1.amazonaws.com
SMTP_PORT=587
SMTP_USER=dein-aws-access-key
SMTP_PASS=dein-aws-secret-key
```

### Features:

✅ **Styled HTML E-Mails** mit Material Design
✅ **Plain-Text Fallback** für alte E-Mail-Clients
✅ **Reply-To** auf Absender-E-Mail
✅ **Automatischer Zeitstempel**
✅ **Felder**: Name, E-Mail, Firma (optional), Nachricht

### Test:

```bash
# 1. .env.local erstellen
# 2. Dev Server neustarten
npm run dev

# 3. Formular ausfüllen auf http://localhost:3000/kontakt
# 4. Senden - du solltest E-Mail erhalten!
```

---

## ✅ 2. Analytics Integration (Google Analytics & Plausible)

### Was wurde implementiert:

- **Google Analytics 4** Integration
- **Plausible Analytics** Integration (Privacy-Friendly)
- **Beide parallel nutzbar**
- **Opt-in per Environment Variables**

### Dateien:

- `components/analytics/GoogleAnalytics.tsx`
- `components/analytics/Plausible.tsx`
- `app/layout.tsx` (aktualisiert)

### Setup Google Analytics:

1. **Google Analytics Account erstellen:**
   - Gehe zu https://analytics.google.com
   - Erstelle Property (GA4)
   - Kopiere Measurement ID (z.B. `G-XXXXXXXXXX`)

2. **Environment Variable setzen:**

```env
# .env.local
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
```

3. **Fertig!** Analytics läuft automatisch.

### Setup Plausible Analytics:

1. **Plausible Account erstellen:**
   - Gehe zu https://plausible.io
   - Füge deine Domain hinzu

2. **Environment Variable setzen:**

```env
# .env.local
NEXT_PUBLIC_PLAUSIBLE_DOMAIN=broetzens.de
```

3. **Fertig!** Plausible trackt automatisch.

### Beide gleichzeitig nutzen:

```env
# .env.local
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
NEXT_PUBLIC_PLAUSIBLE_DOMAIN=broetzens.de
```

### Features:

✅ **Automatisches Page Tracking**
✅ **Anonymisierte IPs** (DSGVO-konform)
✅ **Lazy Loading** für Performance
✅ **Keine Cookies** bei Plausible
✅ **Opt-out möglich** durch Weglassen der Env Vars

---

## ✅ 3. Sitemap & robots.txt

### Was wurde implementiert:

- **Dynamische Sitemap** mit allen Routen
- **WordPress-Seiten automatisch** inkludiert
- **Blog-Posts automatisch** inkludiert
- **robots.txt** mit Crawler-Regeln

### Dateien:

- `app/sitemap.ts` - Dynamische Sitemap
- `app/robots.txt` - Crawler-Regeln

### Features:

**Sitemap inkludiert:**
- ✅ Statische Routen (/, /services, /produkte, etc.)
- ✅ Service-Detailseiten
- ✅ Produkt-Detailseiten
- ✅ Alle WordPress Blog-Posts
- ✅ Alle WordPress-Seiten
- ✅ Automatische Prioritäten
- ✅ Change Frequency

**robots.txt:**
- ✅ Erlaubt alle Crawler
- ✅ Blockiert `/api/`, `/_next/`
- ✅ Link zur Sitemap
- ✅ Spezielle Regeln für Googlebot

### URLs:

- **Sitemap**: `https://deine-domain.de/sitemap.xml`
- **Robots**: `https://deine-domain.de/robots.txt`

### Test lokal:

```bash
# Sitemap testen
curl http://localhost:3000/sitemap.xml

# Robots testen
curl http://localhost:3000/robots.txt
```

### Production Setup:

1. **In `app/sitemap.ts` und `app/robots.ts`:**

```typescript
// ÄNDERN von:
const baseUrl = 'https://broetzens.de';

// ZU deiner echten Domain:
const baseUrl = 'https://deine-produktions-domain.de';
```

2. **Nach Deployment:**
   - Google Search Console: Sitemap einreichen
   - Bing Webmaster Tools: Sitemap einreichen

---

## ✅ 4. GSAP Scroll-Animationen

### Was wurde implementiert:

- **Custom Hook** `useScrollAnimation`
- **Intersection Observer** für Performance
- **Fade-in & Slide-up** Animationen
- **Stagger-Effekte** für Kinder-Elemente
- **Konfigurierbare Optionen**

### Dateien:

- `hooks/useScrollAnimation.ts` - Custom Hook

### Verwendung:

```typescript
'use client';

import { useScrollAnimation } from '@/hooks/useScrollAnimation';

export default function MeineSeite() {
  // Einfach
  const ref = useScrollAnimation<HTMLDivElement>();

  // Mit Optionen
  const ref2 = useScrollAnimation<HTMLDivElement>({
    delay: 0.2,
    duration: 1,
    y: 50,
    opacity: 0,
  });

  // Stagger für Kinder
  const ref3 = useScrollAnimation<HTMLDivElement>({
    stagger: 0.1,
  });

  return (
    <div>
      <div ref={ref}>Ich fade ein!</div>

      <div ref={ref2}>Ich auch, mit Verzögerung!</div>

      <div ref={ref3}>
        <div>Item 1</div>
        <div>Item 2</div>
        <div>Item 3</div>
        {/* Alle Kinder animieren nacheinander! */}
      </div>
    </div>
  );
}
```

### Optionen:

```typescript
interface ScrollAnimationOptions {
  delay?: number;       // Verzögerung in Sekunden (default: 0)
  duration?: number;    // Dauer in Sekunden (default: 0.8)
  y?: number;          // Start Y-Position (default: 30)
  opacity?: number;    // Start Opacity (default: 0)
  scale?: number;      // Start Scale (default: 1)
  stagger?: number;    // Stagger für Kinder (default: 0)
}
```

### Beispiele:

**Fade-in:**
```typescript
const ref = useScrollAnimation<HTMLDivElement>({
  opacity: 0,
  y: 0,
  duration: 0.6,
});
```

**Slide-up + Fade:**
```typescript
const ref = useScrollAnimation<HTMLDivElement>({
  opacity: 0,
  y: 50,
  duration: 0.8,
});
```

**Scale-in:**
```typescript
const ref = useScrollAnimation<HTMLDivElement>({
  scale: 0.8,
  opacity: 0,
  duration: 0.6,
});
```

**Stagger Cards:**
```typescript
const ref = useScrollAnimation<HTMLDivElement>({
  stagger: 0.15,
  y: 30,
  opacity: 0,
});

// Im JSX:
<div ref={ref} className="grid grid-cols-3">
  <div>Card 1</div>
  <div>Card 2</div>
  <div>Card 3</div>
</div>
```

### Performance:

✅ **Intersection Observer** - Animation nur wenn sichtbar
✅ **GPU-beschleunigt** - Nur `transform` und `opacity`
✅ **Einmal-Animation** - Observer wird nach Animation entfernt
✅ **Throttling** - Keine unnötigen Berechnungen

---

## 🚀 Deployment Checklist

### Vor dem Live-Gang:

**1. Environment Variables setzen:**
```env
# Production .env
SMTP_HOST=smtp.dein-provider.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=deine-email
SMTP_PASS=dein-passwort
CONTACT_EMAIL=kontakt@broetzens.de

NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
NEXT_PUBLIC_PLAUSIBLE_DOMAIN=broetzens.de
```

**2. Basis-URLs anpassen:**
- `app/sitemap.ts`: Line 5
- `app/robots.ts`: Line 4

**3. Build testen:**
```bash
npm run build
npm run start
```

**4. Checks:**
- [ ] Kontaktformular sendet E-Mails
- [ ] Analytics trackt (Network Tab checken)
- [ ] Sitemap zugänglich
- [ ] Robots.txt zugänglich
- [ ] Scroll-Animationen funktionieren

**5. Nach Deployment:**
- [ ] Google Search Console: Sitemap einreichen
- [ ] Analytics: Tracking verifizieren
- [ ] DSGVO: Cookie-Banner (falls GA genutzt)

---

## 📖 Weitere Ressourcen

**E-Mail:**
- [Nodemailer Docs](https://nodemailer.com/)
- [Gmail SMTP](https://support.google.com/mail/answer/7126229)

**Analytics:**
- [Google Analytics](https://analytics.google.com)
- [Plausible](https://plausible.io)

**SEO:**
- [Next.js Sitemap](https://nextjs.org/docs/app/api-reference/file-conventions/metadata/sitemap)
- [Google Search Console](https://search.google.com/search-console)

**Animationen:**
- [GSAP Docs](https://greensock.com/docs/)
- [Intersection Observer](https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API)

---

**Alle Erweiterungen sind produktionsbereit!** 🎉
