import type { Hotspot, NavigationItem, FooterColumn, SocialLink } from './types';

// ============================================
// HOTSPOT DATA
// ============================================
export const HOTSPOTS: Hotspot[] = [
  {
    id: 'produkte',
    icon: 'computer',
    label: 'Produkte',
    position: { left: '25%', top: '15%' },
    type: 'produkte',
    title: 'Unsere Produkte',
    description: 'Digitale Lösungen für Forst- und Jagdbetriebe',
    link: '/produkte',
    features: [
      'Hegegemeinschaft Management für revierübergreifendes Wildtiermanagement',
      'Erdmassenberechnung für den Forststraßenbau',
      'Hosting & Support für Forstbetriebe',
    ],
  },
  {
    id: 'services',
    icon: 'rocket_launch',
    label: 'Services',
    position: { left: '75%', top: '18%' },
    type: 'services',
    title: 'Unsere Services',
    description: 'AI-First Beratung und Entwicklung für Forstbetriebe',
    link: '/services',
    features: [
      'Digitalisierungs-Strategie für Forstbetriebe',
      'Prozessoptimierung & Automatisierung',
      'Change Management bei Technologieeinführungen',
      'Prototyping & MVP-Entwicklung',
    ],
  },
  {
    id: 'blog',
    icon: 'menu_book',
    label: 'Wissen',
    position: { left: '50%', top: '12%' },
    type: 'blog',
    title: 'Wissen & Insights',
    description: 'Aktuelle Artikel zu Digitalisierung im Forst',
    link: '/ueber-uns/blog-wissen',
    features: [
      'Praxis-Tipps für Forstbetriebe',
      'Technologie-Trends und Best Practices',
      'Case Studies aus echten Projekten',
      'Interviews mit Experten',
    ],
  },
  {
    id: 'referenzen',
    icon: 'star',
    label: 'Referenzen',
    position: { left: '70%', top: '28%' },
    type: 'referenzen',
    title: 'Erfolgsgeschichten',
    description: 'Case Studies aus 15+ Projekten',
    link: '/ueber-uns/referenzen',
    features: [
      'Hegegemeinschaft mit 60+ aktiven Nutzern',
      'Erdmassenberechnung für Forststraßenbau',
      'Prozessautomatisierung in der Holzvermarktung',
      'Digitale Revierplanung und -verwaltung',
    ],
  },
  {
    id: 'themen',
    icon: 'topic',
    label: 'Themen',
    position: { left: '33%', top: '33%' },
    type: 'themen',
    title: 'Themen & Schlagworte',
    description: 'Die wichtigsten Themen rund um Digitalisierung im Forst',
    link: '/themen',
    features: [
      'Digitalisierung in der Forstwirtschaft',
      'Wildtiermanagement & Hegegemeinschaft',
      'Automatisierung & Prozessoptimierung',
      'AI-First Entwicklung',
      'Mobile Apps für Jäger & Förster',
      'Change Management & Transformation',
    ],
  },
  {
    id: 'team',
    icon: 'group',
    label: 'Team',
    position: { left: '50%', top: '48%' },
    type: 'team',
    title: 'Team & AI-First',
    description: 'Förster & Entwickler gemeinsam',
    link: '/ueber-uns/team-werte',
    features: [
      'Interdisziplinäres Team aus Forst und IT',
      'AI-First Entwicklungsansatz',
      'Agile Methoden für schnelle Ergebnisse',
      'Persönliche Betreuung auf Augenhöhe',
    ],
  },
  {
    id: 'werte',
    icon: 'eco',
    label: 'Werte',
    position: { left: '50%', top: '78%' },
    type: 'werte',
    title: 'Unsere Werte',
    description: 'Verwurzelt in Tradition, gewachsen durch Innovation',
    link: '/ueber-uns/team-werte#werte',
    features: [
      'Nachhaltigkeit in Technologie und Geschäftsmodell',
      'Transparente Kommunikation',
      'Langfristige Partnerschaften',
      'Verantwortung für Wald und Gesellschaft',
    ],
  },
];

// ============================================
// NAVIGATION
// ============================================
export const NAVIGATION_ITEMS: NavigationItem[] = [
  {
    label: 'Themen',
    href: '/themen',
    icon: 'topic',
  },
  {
    label: 'Services',
    href: '/services',
    icon: 'rocket_launch',
  },
  {
    label: 'Produkte',
    href: '/produkte',
    icon: 'computer',
  },
  {
    label: 'Referenzen',
    href: '/ueber-uns/referenzen',
    icon: 'star',
  },
  {
    label: 'Wissen',
    href: '/ueber-uns/blog-wissen',
    icon: 'menu_book',
  },
  {
    label: 'Über uns',
    href: '/ueber-uns',
    icon: 'group',
  },
];

// ============================================
// FOOTER COLUMNS
// ============================================
export const FOOTER_COLUMNS: FooterColumn[] = [
  {
    title: 'Services',
    links: [
      { label: 'Digitalisierungs-Strategie', href: '/services/digitalisierungsstrategie' },
      { label: 'Prozessoptimierung & Automatisierung', href: '/services/prozessoptimierung-automatisierung' },
      { label: 'Change Management', href: '/services/change-management' },
      { label: 'Prototyping & MVP', href: '/services/prototyping-mvp' },
    ],
  },
  {
    title: 'Produkte',
    links: [
      { label: 'Hegegemeinschaft Management', href: '/produkte/hegegemeinschaft-management' },
      { label: 'Erdmassenberechnung', href: '/produkte/erdmassenberechnung' },
      { label: 'Hosting & Support', href: '/produkte/hosting' },
    ],
  },
  {
    title: 'Unternehmen',
    links: [
      { label: 'Über uns', href: '/ueber-uns' },
      { label: 'Team & Werte', href: '/ueber-uns/team-werte' },
      { label: 'AI-First Ansatz', href: '/ueber-uns/ai-first-ansatz' },
      { label: 'Referenzen', href: '/ueber-uns/referenzen' },
      { label: 'Blog & Wissen', href: '/ueber-uns/blog-wissen' },
    ],
  },
  {
    title: 'Kontakt',
    links: [
      { label: 'Kontaktformular', href: '/kontakt' },
      { label: 'Erstgespräch buchen', href: '/kontakt#termin' },
    ],
  },
];

// ============================================
// SOCIAL LINKS
// ============================================
export const SOCIAL_LINKS: SocialLink[] = [
  {
    platform: 'LinkedIn',
    icon: 'link',
    url: 'https://www.linkedin.com/company/108531363',
    ariaLabel: 'Besuchen Sie uns auf LinkedIn',
  },
  {
    platform: 'GitHub',
    icon: 'code',
    url: 'https://github.com/foe05',
    ariaLabel: 'Folgen Sie uns auf GitHub',
  },
  {
    platform: 'Email',
    icon: 'email',
    url: 'mailto:hallo@broetzens.de',
    ariaLabel: 'Schreiben Sie uns eine E-Mail',
  },
];

// ============================================
// COMPANY INFO
// ============================================
export const COMPANY_INFO = {
  name: 'Broetzens IT Cattles & Cows',
  tagline: 'AI-First IT-Beratung für Forstbetriebe',
  description: 'Verwurzelt in Tradition, gewachsen durch Innovation',
  phone: '+49 163 2347224',
  email: 'hallo@broetzens.de',
  address: {
    street: 'Rosenblathstrasse 11',
    zip: '34121',
    city: 'Kassel',
    country: 'Deutschland',
  },
};

// ============================================
// COOKIE CONSENT (GDPR/TTDSG)
// ============================================
export const COOKIE_CONSENT_TEXT = {
  title: 'Cookie-Einstellungen',
  description:
    'Wir verwenden Cookies, um Ihnen die bestmögliche Nutzung unserer Website zu ermöglichen. Einige Cookies sind technisch notwendig, während andere uns helfen, die Website zu verbessern und Ihnen ein besseres Nutzungserlebnis zu bieten.',
  acceptAll: 'Alle akzeptieren',
  rejectAll: 'Alle ablehnen',
  customize: 'Einstellungen',
  save: 'Speichern',
  necessaryLabel: 'Notwendige Cookies',
  necessaryDescription:
    'Diese Cookies sind für die Grundfunktionen der Website erforderlich und können nicht deaktiviert werden.',
  analyticsLabel: 'Analyse Cookies',
  analyticsDescription:
    'Diese Cookies helfen uns zu verstehen, wie Besucher mit unserer Website interagieren, indem sie Informationen anonym sammeln und melden.',
  privacyPolicyLink: '/datenschutz',
  privacyPolicyText: 'Mehr in unserer Datenschutzerklärung',
};

// ============================================
// WORDPRESS API
// ============================================
const rawWpApiUrl =
  process.env.WP_API_URL ??
  process.env.NEXT_PUBLIC_WP_API_URL ??
  'http://127.0.0.1/wp-json/wp/v2';

export const WP_API_URL = rawWpApiUrl.replace(/\/$/, '');
export const WP_CACHE_REVALIDATE = 300; // 5 Minuten

// ============================================
// NEWSLETTER
// ============================================
export const NEWSLETTER_TOPICS = [
  {
    id: 'digitalization',
    label: 'Digitalisierungs-Tipps',
    description: 'Praktische Tipps zur Digitalisierung im Forstbetrieb',
  },
  {
    id: 'ai',
    label: 'AI-Trends',
    description: 'Neueste Entwicklungen im Bereich Künstliche Intelligenz',
  },
  {
    id: 'products',
    label: 'Produkt-Updates',
    description: 'Informationen zu neuen Features und Produkten',
  },
] as const;

export const NEWSLETTER_CONFIG = {
  doubleOptIn: true,
  welcomeEmailEnabled: true,
  unsubscribeEnabled: true,
  defaultTopics: ['digitalization', 'ai', 'products'],
} as const;
