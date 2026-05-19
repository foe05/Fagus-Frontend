import type { Metadata } from 'next';
import { Roboto } from 'next/font/google';
import Script from 'next/script';
import './globals.css';
import Header from '@/components/Header';
import LazyFooter from '@/components/LazyFooter';
import ProgressBar from '@/components/ProgressBar';
import LazyAnalytics from '@/components/LazyAnalytics';
import { CookieConsentProvider } from '@/components/cookie-consent/CookieConsentProvider';
import CookieConsentBanner from '@/components/cookie-consent/CookieConsentBanner';
import { getSiteIcon, getHeaderNavigation, getFooterNavigation } from '@/lib/wordpress';


const roboto = Roboto({
  weight: ['300', '400', '500', '700'],
  subsets: ['latin'],
  display: 'swap',
});

export async function generateMetadata(): Promise<Metadata> {
  const siteIconUrl = await getSiteIcon();

  return {
    title: 'Broetzens IT Cattles & Cows - AI-First IT-Beratung für Forstbetriebe',
    description: 'Moderne IT-Lösungen und Digitalisierung für Forstbetriebe. Verwurzelt in Tradition, gewachsen durch Innovation.',
    keywords: ['IT-Beratung', 'Forstbetriebe', 'Digitalisierung', 'AI-First', 'Hegegemeinschaft', 'Prozessoptimierung'],
    authors: [{ name: 'Broetzens IT Cattles & Cows' }],
    openGraph: {
      title: 'Broetzens IT Cattles & Cows',
      description: 'AI-First IT-Beratung für Forstbetriebe',
      type: 'website',
      locale: 'de_DE',
    },
    ...(siteIconUrl && {
      icons: {
        icon: siteIconUrl,
        apple: siteIconUrl,
      },
    }),
  };
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const gaId = process.env.NEXT_PUBLIC_GA_ID;
  const plausibleDomain = process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN;

  const [headerNav, footerColumns] = await Promise.all([
    getHeaderNavigation(),
    getFooterNavigation(),
  ]);

  return (
    <html lang="de" className={roboto.className}>
      <head>
        {/*
          Plausible Analytics — cookieless, GDPR-compliant by design.
          No consent banner needed. Loaded directly via next/script.

          UTM parameter structure for campaign landing pages:
            ?utm_source=<platform>        e.g. linkedin, newsletter, github
            &utm_medium=<channel>         e.g. social, email, cpc
            &utm_campaign=<campaign-name> e.g. launch-2025, forst-digi
            &utm_term=<keyword>           optional, for paid search terms
            &utm_content=<variant>        optional, for A/B test variants

          Plausible auto-tracks UTM params as properties on the pageview.
          View campaign data at: https://plausible.io/broetzens.de?utm_source=...
        */}

        {/*
          Material Symbols Outlined sowie Roboto werden lokal ausgeliefert
          (siehe app/globals.css @font-face bzw. next/font). Es werden
          bewusst KEINE Schriften/Stylesheets von Google-Servern geladen
          — kein DNS-Prefetch/Preconnect zu fonts.googleapis.com nötig.
        */}

        {/* Plausible Analytics — cookieless, no consent required */}
        <Script
          defer
          data-domain="broetzens.de"
          src="https://plausible.io/js/script.js"
          strategy="afterInteractive"
        />
      </head>
      <body className="antialiased">
        <CookieConsentProvider>
          {/* Analytics - must be inside provider to access consent context */}
          <LazyAnalytics gaId={gaId} plausibleDomain={plausibleDomain} />

          <ProgressBar />
          <Header navigation={headerNav} />
          <main className="min-h-screen">
            {children}
          </main>
          <LazyFooter footerColumns={footerColumns} />
          <CookieConsentBanner />
        </CookieConsentProvider>
      </body>
    </html>
  );
}
