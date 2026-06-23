# Konzept: Digitale Kontaktkarte ("Lemontaps-Lite") für Fagus-Frontend

> Spec zur Umsetzung mit Claude Code. Zielprojekt: `foe05/Fagus-Frontend`
> (Next.js 15 App Router, TypeScript strict, Tailwind, Material Design 3).
> Diese Datei gehört nach `docs/` und kann direkt als Auftrag dienen.

---

## 1. Ziel & Scope

Eine digitale Visitenkarte mit **zwei** Kontakt-Richtungen, integriert in die
bestehende Next.js-Website (kein separater Dienst):

1. **Raus (Owner → Besucher):** Öffentliche Kartenseite zeigt die Kontaktdaten
   einer Person. Besucher kann die Karte als `.vcf` speichern oder einen
   QR-Code scannen → der Owner landet im Adressbuch des Besuchers.
2. **Rein (Besucher → Owner):** Formular, in das ein Besucher *seine eigenen*
   Daten einträgt. Diese werden zu einer `.vcf` und per E-Mail an den
   Karten-Owner geschickt (1 Tap zum Import in Nextcloud).

**Scope V1 (MVP):** Mehrere Karten (Team/Kunden), Config-basiert. Raus-Richtung
komplett. Rein-Richtung als E-Mail-Versand, inkl. **mehrzeiliger Messagebox**
(landet in der `.vcf`) und **Bestätigungsmail an den Besucher** mit
Zusammenfassung + angehängter Owner-`.vcf`. **Kein** direkter Nextcloud-Zugriff.

**Explizit nicht in V1:** CardDAV/Nextcloud-Sync (Phase 2), Analytics/Tracking,
NFC-Bestellung, Admin-UI.

---

## 2. Architektur-Überblick

```
Besucher-Browser
   │
   ├── GET /c/[slug]                 → Server Component (liest Card-Config)
   │       ├─ zeigt Owner-Daten + QR-Code
   │       ├─ Button "Kontakt speichern" → GET .../vcard
   │       └─ Formular "Meine Daten teilen" → POST /api/exchange
   │
   ├── GET /c/[slug]/vcard           → Route Handler, liefert Owner-.vcf
   │                                     (Content-Disposition: attachment)
   │
   └── POST /api/exchange             → Route Handler
           ├─ validiert + Spamschutz (Honeypot, Timing, Rate-Limit)
           ├─ baut Besucher-.vcf
           └─ Nodemailer → SMTP → E-Mail an Card-Owner (.vcf als Anhang)

(Phase 2: POST /api/exchange schreibt zusätzlich/alternativ per
 CardDAV-PUT direkt in eine Nextcloud-Adressliste.)
```

Backend = **Next.js Route Handler** (`app/.../route.ts`). Secrets (SMTP, später
CardDAV-App-Passwort) liegen ausschließlich serverseitig in Env-Variablen,
**niemals** im Client-Bundle.

---

## 3. Datenmodell (Multi-Card-Registry)

V1: versionierte TypeScript-Config, eine Person = ein Slug. Keine DB.

`lib/cards.ts`:

```ts
export interface ContactCard {
  slug: string;            // URL-Segment, z.B. "johannes-broetzen"
  firstName: string;
  lastName: string;
  fullName: string;        // FN (vCard Pflichtfeld)
  org?: string;
  title?: string;          // Position
  emails: { type: "work" | "home"; value: string }[];
  phones: { type: "cell" | "work" | "home"; value: string }[];
  url?: string;            // Website
  addresses?: {
    type: "work" | "home";
    street?: string; city?: string; zip?: string; country?: string;
  }[];
  links?: { label: string; href: string }[];   // LinkedIn, GitHub etc.
  photoUrl?: string;       // absolute URL zu Foto/Logo (für vCard PHOTO)
  note?: string;
  // Ziel-Adresse für eingehende Kontakte dieser Karte:
  inboxEmail: string;      // wohin "Besucher → Owner" gemailt wird
}

export const CARDS: ContactCard[] = [ /* ... */ ];
export const getCardBySlug = (slug: string): ContactCard | undefined =>
  CARDS.find(c => c.slug === slug);
```

> **Phase 3 (optional):** Karten aus WordPress als Custom Post Type ziehen,
> analog zur bestehenden `lib/wordpress.ts`-Integration. Interface bleibt gleich,
> nur die Quelle ändert sich.

---

## 4. Routen & Komponenten (App Router)

```
app/
  c/
    [slug]/
      page.tsx              # Server Component: Kartenseite
      vcard/
        route.ts            # GET → Owner-.vcf Download
  api/
    exchange/
      route.ts              # POST → Besucher-Daten → E-Mail
components/
  card/
    ContactCardView.tsx     # Darstellung Owner-Daten (Server-tauglich)
    SaveContactButton.tsx   # 'use client' (optional, sonst simpler <a>)
    QrCode.tsx              # rendert QR (SVG) der Kartenseiten-URL
    ExchangeForm.tsx        # 'use client' Formular + Submit-Logik
lib/
  cards.ts                  # Registry (s.o.)
  vcard.ts                  # vCard-Builder + Escaping
  mailer.ts                 # Nodemailer-Transport
  rate-limit.ts             # simpler In-Memory-Limiter
```

**Wichtig:** Optik mit bestehendem Design-System bauen (MD3-Tokens
`--primary`, `--secondary`, Roboto, Material Symbols, vorhandene Typography-
Klassen). Die Karte soll wie Teil der Seite wirken, nicht wie ein Fremdkörper.

- `generateStaticParams` über `CARDS` für die bekannten Slugs.
- Unbekannter Slug → `notFound()`.

---

## 5. vCard-Generierung (`lib/vcard.ts`)

**Format: vCard 3.0** (beste Kompatibilität mit iOS/Android/Nextcloud).

Pflicht/Empfehlung:
- `BEGIN/END:VCARD`, `VERSION:3.0`
- `FN` (Pflicht), `N:Nachname;Vorname;;;`
- `UID` (stabil, z.B. `slug@broetzens.de` für Owner; UUID für Besucher)
- `REV` als UTC-Timestamp (`YYYYMMDDTHHMMSSZ`)
- Zeilen mit **CRLF** trennen.

**Escaping (zwingend, sonst kaputte Karten):** in Textwerten
`\` → `\\`, `;` → `\;`, `,` → `\,`, Zeilenumbruch → `\n`.
(Im `N`-Feld trennen unescapte `;` die Komponenten – also nur die *Inhalte*
escapen, nicht die Strukturtrenner.)

**Line-Folding** (nice-to-have): Zeilen > 75 Oktette mit `CRLF + Space` falten.
Viele Importer tolerieren ungefaltete Zeilen; für V1 optional, aber sauber.

Beispiel-Output (Owner):
```
BEGIN:VCARD
VERSION:3.0
UID:johannes-broetzen@broetzens.de
FN:Johannes Brötzen
N:Brötzen;Johannes;;;
ORG:Broetzens IT Cattles & Cows
TITLE:IT-Beratung Forst
EMAIL;TYPE=WORK:kontakt@broetzens.de
TEL;TYPE=CELL:+49...
URL:https://broetzens.de
NOTE:Kennengelernt über digitale Kontaktkarte
REV:20260623T120000Z
END:VCARD
```

API-Vorschlag:
```ts
export function buildVCard(input: VCardInput): string; // gibt vCard-String zurück
```

`vcard/route.ts` (Owner-Download):
```
Content-Type: text/vcard; charset=utf-8
Content-Disposition: attachment; filename="johannes-broetzen.vcf"
```

---

## 6. QR-Code (`components/card/QrCode.tsx`)

- Inhalt: **die URL der Kartenseite** (`https://broetzens.de/c/<slug>`),
  **nicht** die vCard selbst (vCard-QRs werden dicht/fehleranfällig; URL ist
  robuster und erlaubt Tracking/Updates später).
- Lib: `qrcode` (npm), als **SVG** rendern (scharf, klein, kein extra Image).
- Serverseitig generierbar; kein Client-State nötig.

---

## 7. Eingehende Kontakte (`app/api/exchange/route.ts` + Mailer)

**Formularfelder:** `vorname, nachname, email, telefon?, firma?, position?,
nachricht?, slug` + Consent-Checkbox + Honeypot.
Die **Messagebox** (`nachricht`) ist ein mehrzeiliges Textarea, optional, aber
prominent – ihr Inhalt fließt in die `.vcf` (`NOTE`) **und** in beide Mails.

Ablauf:
1. POST mit obigen Feldern.
2. Server validiert (Pflicht: vorname, nachname, mind. email **oder** telefon;
   valide E-Mail; slug existiert in `CARDS`).
3. Spamschutz greift (Abschnitt 8) → sonst `400`/`429`.
4. `buildVCard(...)` aus den Besucher-Daten
   (`NOTE` = Datum + Kartenname + Messagebox-Text).
5. **Mail an Owner** (`card.inboxEmail`):
   - Betreff: `Neuer Kontakt über deine Karte: <Vorname Nachname>`
   - Body: Klartext aller Felder inkl. Nachricht (für schnelle Sicht)
   - Anhang: `<vorname-nachname>.vcf` (`contentType: text/vcard`)
6. **Bestätigungsmail an Besucher** (an dessen `email`, falls angegeben):
   - Betreff: `Deine Kontaktdaten bei <Owner/Org> sind angekommen`
   - Body: Zusammenfassung der eingegebenen Felder + Nachricht, dazu eine
     kurze „Hier sind die Kontaktdaten von <Owner>"-Sektion
   - Anhang: **Owner-`.vcf`** (`<owner-slug>.vcf`) → Besucher bekommt deine
     Karte automatisch zurück (schlanker beidseitiger Tausch)
   - Entfällt still, wenn der Besucher keine E-Mail angegeben hat.
7. Antwort an Browser: `200` + freundliche Bestätigung auf der Seite.

`lib/mailer.ts` (Nodemailer, SMTP via Env – IONOS oder eigener Mailserver,
DSGVO: Versand über deine Infrastruktur, kein US-Drittdienst).

> **Hinweis zu Schritt 6:** einmalige, vom Besucher selbst ausgelöste
> Transaktionsmail (Bestätigung seiner eigenen Aktion) – kein Marketing, kein
> Double-Opt-in nötig. Honeypot + Rate-Limit verhindern, dass jemand fremde
> Adressen einträgt und damit Mails auslöst.

> **Phase 2 erweitert Schritt 5**: zusätzlich oder statt Owner-Mail ein
> CardDAV-PUT (siehe Abschnitt 10).

---

## 8. Spam- & Missbrauchsschutz (öffentliches Formular!)

Ohne CAPTCHA (DSGVO-/UX-freundlich):
- **Honeypot-Feld:** verstecktes Input (z.B. `website`), das nur Bots ausfüllen.
  Befüllt → still verwerfen (`200` faken, nicht senden).
- **Timing-Trap:** Hidden-Timestamp beim Laden; Submit < ~2 s nach Laden → Bot.
- **Rate-Limit:** pro IP, In-Memory (`lib/rate-limit.ts`), z.B. 5 Submits / 10 min.
  (Single-Container-Deployment → In-Memory reicht. Bei mehreren Instanzen
  später Redis.)
- Optional Phase 2: **Cloudflare Turnstile** (DSGVO-freundlicher als reCAPTCHA),
  falls Spam durchkommt.

---

## 9. DSGVO

- **Rein-Formular:** Besucher gibt freiwillig eigene Daten ein. Trotzdem:
  Pflicht-Checkbox „Ich stimme der Verarbeitung gemäß [Datenschutz] zu" +
  Link auf die bestehende `/datenschutz`-Seite. Ohne Haken kein Submit.
- **Zweck dokumentieren:** Daten werden ausschließlich per E-Mail an den
  Karten-Owner zur Kontaktaufnahme übermittelt. In Datenschutzerklärung ergänzen.
- **Datensparsamkeit:** nur wirklich nötige Felder als Pflicht.
- **Raus-Richtung** (Owner-vCard): unkritisch, der Owner stellt seine Daten
  bewusst bereit. Bei Kundenkarten: jeder Owner ist für seine Karte verantwortlich.
- **Kein Tracking in V1.** Falls später Analytics (Lemontaps-Stil: „QR wie oft
  geteilt"), dann separat mit Consent-Banner abwägen.

---

## 10. Phase 2 – Nextcloud-Sync (vordokumentiert, NICHT in V1 bauen)

Nextcloud Contacts spricht **CardDAV**. Kontakt anlegen = `.vcf` per HTTP `PUT`:

```
PUT https://<NEXTCLOUD>/remote.php/dav/addressbooks/users/<USER>/<ADDRESSBOOK>/<UID>.vcf
Authorization: Basic base64(<USER>:<APP_PASSWORT>)
Content-Type: text/vcard; charset=utf-8
If-None-Match: *        # verhindert versehentliches Überschreiben
```
- `<APP_PASSWORT>`: in Nextcloud unter *Einstellungen → Sicherheit →
  App-Passwort* erzeugen (jederzeit widerrufbar, **nicht** das Login-Passwort).
- `<ADDRESSBOOK>`: Default ist `contacts`. Empfehlung: eigene Adressliste
  `eingang` o.ä. als Review-Inbox anlegen, damit öffentliche Einsendungen nicht
  direkt im Hauptadressbuch landen.
- Erfolg: HTTP `201 Created`.
- Umsetzung: kleiner Client `lib/carddav.ts`; `api/exchange` ruft ihn zusätzlich
  zum Mailversand auf (Mail bleibt als Beleg sinnvoll).

---

## 11. Env-Variablen

```
# SMTP (V1) – bedient auch das bestehende Kontaktformular-TODO
SMTP_HOST=
SMTP_PORT=587
SMTP_USER=
SMTP_PASS=
SMTP_FROM="Broetzens IT <kontakt@broetzens.de>"

# Phase 2 – Nextcloud CardDAV
NC_BASE_URL=
NC_USER=
NC_APP_PASSWORD=
NC_ADDRESSBOOK=eingang
```
`.env.example` im Repo entsprechend ergänzen.

---

## 12. Akzeptanzkriterien (Definition of Done, V1)

- [ ] `/c/<slug>` rendert Owner-Daten im bestehenden MD3-Design.
- [ ] „Kontakt speichern" lädt eine valide `.vcf`, die sich auf iOS **und**
      Android sauber importieren lässt (Umlaute korrekt, kein kaputtes `N`).
- [ ] QR-Code auf der Seite öffnet beim Scannen die Kartenseite.
- [ ] Rein-Formular: gültige Eingabe → E-Mail mit `.vcf`-Anhang beim Owner;
      die `.vcf` importiert sich korrekt in Nextcloud.
- [ ] Mehrzeilige Messagebox vorhanden; ihr Text steht in der `.vcf` (`NOTE`)
      und in beiden Mails.
- [ ] Nach erfolgreichem Submit erhält der Besucher (sofern E-Mail angegeben)
      eine Bestätigungsmail mit Zusammenfassung **und angehängter Owner-`.vcf`**.
- [ ] Honeypot + Timing + Rate-Limit aktiv und getestet.
- [ ] Consent-Checkbox erzwungen, Link auf `/datenschutz`.
- [ ] Mehrere Karten über `CARDS` konfigurierbar, je eigene `inboxEmail`.
- [ ] Keine Secrets im Client-Bundle (Build prüfen).
- [ ] Unbekannter Slug → 404.

---

## 13. Roadmap

- **Phase 1 (MVP):** Abschnitte 3–9, 11–12.
- **Phase 2:** CardDAV-Sync (Abschnitt 10), optional Review-Inbox + Turnstile.
- **Phase 3:** Karten-Verwaltung über WordPress; NFC-Karten (NTAG mit
  Karten-URL beschreiben – braucht keinen Code, nur die URL); optionale
  Apple/Google-Wallet-Pässe; consent-basiertes Analytics.

---

## 14. Getroffene Entscheidungen (verbindlich)

- **URL-Schema: `/c/<slug>`** (kurz → bessere QR-Dichte, sauberer auf NFC/Print).
  Überall konsistent verwenden; Routen entsprechend `app/c/[slug]/...`.
- **Owner-Foto: `PHOTO` als URL** (schlanke `.vcf`; Fotos/Logos sind ohnehin
  gehostet). Kein eingebettetes base64 in V1.
- **Beidseitiger Tausch: ja, in schlanker Form** – der Besucher erhält die
  Owner-`.vcf` als Anhang der Bestätigungsmail (Abschnitt 7, Schritt 6).
  Kein zusätzlicher UI-Flow nötig.
