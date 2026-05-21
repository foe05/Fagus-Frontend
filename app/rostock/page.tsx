import type { Metadata } from 'next';
import Image from 'next/image';
import { Inter, Space_Grotesk, JetBrains_Mono } from 'next/font/google';
import RostockForm from './RostockForm';
import PageviewBeacon from './PageviewBeacon';
import styles from './rostock.module.css';

// Page-scoped fonts — only loaded for /rostock so we don't bloat the
// rest of the site (Roboto stays the default elsewhere).
const inter = Inter({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  display: 'swap',
  variable: '--font-inter',
});
const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  weight: ['500', '600', '700'],
  display: 'swap',
  variable: '--font-space-grotesk',
});
const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  display: 'swap',
  variable: '--font-jetbrains-mono',
});

export const metadata: Metadata = {
  title: 'Schick mir dein nervigstes Bürokratie‑Beispiel · Broetzens IT Cattles & Cows',
  description:
    'Für Forstbetriebsleiter: schreib mir dein nervigstes Bürokratie‑Beispiel. Ich antworte persönlich – kein Newsletter, kein Lead‑Funnel.',
  robots: { index: true, follow: true },
  openGraph: {
    title: 'Schick mir dein nervigstes Bürokratie‑Beispiel',
    description:
      'Landingpage zur Forstvereinstagung Rostock 2026. Ein Schritt zur weniger nervigen Forst‑Bürokratie.',
    type: 'website',
    locale: 'de_DE',
  },
};

// 5-minute ISR like the rest of the site. Page is otherwise fully static.
export const revalidate = 300;

export default function RostockPage() {
  const fontClass = `${inter.variable} ${spaceGrotesk.variable} ${jetbrainsMono.variable}`;

  return (
    <div className={`${styles.page} ${fontClass}`}>
      <PageviewBeacon />
      <header className={styles.siteHeader}>
        <div className={styles.siteHeaderInner}>
          <Image
            src="/rostock/logo-trimmed.png"
            alt="Broetzens IT Cattles & Cows"
            width={44}
            height={36}
            className={styles.headerLogo}
            priority
          />
          <div className={styles.headerMeta}>
            Rostock 2026 ·{' '}
            <span className={styles.headerMetaAccent}>Tagungsteilnehmer</span>
          </div>
        </div>
      </header>

      {/* Root layout already provides <main>; using a div here to keep
          the document outline valid (only one <main> per page). */}
      <div className={styles.container}>
        <section className={styles.hero}>
          <div className={styles.eyebrow}>
            Eine Frage ·{' '}
            <span className={styles.eyebrowDim}>an Forstbetriebsleiter</span>
          </div>
          <h1 className={styles.h1}>
            Förster.
            <br />
            <span className={styles.h1Accent}>Und Schneisenschläger</span>
            <br />
            durch Prozess‑Dickichte.
          </h1>
          <p className={styles.lead}>
            Wir haben uns vermutlich auf der Forstvereinstagung getroffen – oder
            du hast eine meiner Karten in die Hand bekommen. Schön, dass du
            hier bist.
          </p>
        </section>

        <div className={styles.heroPhoto}>
          <Image
            src="/rostock/portrait-johannes.png"
            alt="Johannes Brötz im Wald mit Laptop"
            fill
            sizes="(max-width: 720px) 100vw, 720px"
            priority={false}
          />
          <div className={styles.heroPhotoCap}>Nordhessen · 2025</div>
        </div>

        <section className={styles.whyBlock}>
          <p>
            Du benutzt schon Software, die deine Arbeit erleichtert. Eine
            Jagd‑App hier, ein GIS da, Excel, ein Stück Windows‑Software, eine
            forstliche Warenwirtschaft.
          </p>
          <p>
            Was fehlt, sind die <strong>Verbindungen</strong> zwischen dem, was
            du schon hast – damit Doppeleingaben verschwinden, Daten dort
            landen, wo sie gebraucht werden, und der nervige Teil deiner Arbeit
            kleiner wird. Wo es passt, auch mit KI. Aber zuerst: ran an
            Datensilos und Prozesse.
          </p>
          <p>
            <strong>Mein Angebot:</strong> Fokussierte Tage vor Ort beim
            Kunden. Keine 80‑Seiten‑Reports. Bezahlung bei Erfolg – wenn das
            Ergebnis nicht trägt, zahlst du nicht den vollen Satz.
          </p>
        </section>

        <RostockForm />

        <section className={styles.secondary}>
          <h3 className={styles.secondaryHeading}>
            Wenn du eh schon da bist – zwei kurze Umfragen, die mir helfen:
          </h3>
          <div className={styles.secondaryLinks}>
            {/* TODO: Tally/Formbricks-URLs einsetzen, sobald sie stehen. */}
            <a href="#" aria-disabled="true">
              <span>
                Digitalisierung im Forstbetrieb – wo scheitert sie wirklich?
              </span>
              <span className={styles.secondaryArrow}>~ 7 Min →</span>
            </a>
            <a href="#" aria-disabled="true">
              <span>
                KI im Forstbetrieb – wo wäre sie hilfreich, wo nervt sie?
              </span>
              <span className={styles.secondaryArrow}>~ 4 Min →</span>
            </a>
          </div>
          <p className={styles.secondaryFootnote}>
            Ergebnisse bekommst du als Tagungsteilnehmer als Erster – noch vor
            der öffentlichen Auswertung.
          </p>
        </section>
      </div>

      <footer className={styles.siteFooter}>
        <div className={styles.siteFooterInner}>
          <div>
            Johannes Brötz · Broetzens IT Cattles &amp; Cows
            <br />
            Nordhessen ·{' '}
            <a href="mailto:hallo@broetzens.de">hallo@broetzens.de</a>
          </div>
          <div>
            <a href="https://broetzens.de">broetzens.de</a> ·{' '}
            <a href="https://broetzens.de/impressum">Impressum</a> ·{' '}
            <a href="https://broetzens.de/datenschutz">Datenschutz</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
