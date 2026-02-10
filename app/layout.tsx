import type { Metadata } from 'next';
import { Roboto } from 'next/font/google';
import './globals.css';
import Header from '@/components/Header';
import LazyFooter from '@/components/LazyFooter';
import ProgressBar from '@/components/ProgressBar';
import LazyAnalytics from '@/components/LazyAnalytics';
import { CookieConsentProvider } from '@/components/cookie-consent/CookieConsentProvider';
import CookieConsentBanner from '@/components/cookie-consent/CookieConsentBanner';
import { getSiteIcon } from '@/lib/wordpress';
import { ThemeProvider } from '@/lib/ThemeProvider';

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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const gaId = process.env.NEXT_PUBLIC_GA_ID;
  const plausibleDomain = process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN;

  return (
    <html lang="de" className={roboto.className} suppressHydrationWarning>
      <head>
        {/* DNS Prefetch for external resources */}
        <link rel="dns-prefetch" href="https://fonts.googleapis.com" />
        <link rel="dns-prefetch" href="https://fonts.gstatic.com" />

        {/* Preconnect to Google Fonts for faster loading */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />

        {/* FOUC Prevention: Apply theme immediately before hydration */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  const theme = localStorage.getItem('theme-preference') ||
                    (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
                  if (theme === 'dark') {
                    document.documentElement.classList.add('dark');
                  }
                } catch (e) {}
              })();
            `,
          }}
        />
        {/* Material Symbols Outlined Icons */}
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@24,300,0,0&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="antialiased">
        <ThemeProvider>
          <CookieConsentProvider>
            {/* Analytics - must be inside provider to access consent context */}
            <LazyAnalytics gaId={gaId} plausibleDomain={plausibleDomain} />

            <ProgressBar />
            <Header />
            <main className="min-h-screen">
              {children}
            </main>
            <LazyFooter />
            <CookieConsentBanner />
          </CookieConsentProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
