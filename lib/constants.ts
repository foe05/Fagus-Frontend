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
    title: 'Hegegemeinschaft Management',
    description: 'Digitale Lösung für Jagdreviere mit 60+ aktiven Nutzern',
    link: '/produkte/hegegemeinschaft-management',
    features: [
      'Revierübergreifendes Wildtiermanagement',
      'Automatische Abschussplanung nach gesetzlichen Vorgaben',
      'Mobile App für Jäger im Revier',
      'Echtzeit-Synchronisation aller Daten',
    ],
  },
  {
    id: 'services',
    icon: 'rocket_launch',
    label: 'Services',
    position: { left: '75%', top: '18%' },
    type: 'services',
    title: 'Digitalisierungs-Strategie',
    description: 'AI-First Beratung für Forstbetriebe',
    link: '/services/digitalisierungsstrategie',
    features: [
      'Strategische Beratung für digitale Transformation',
      'Workshops zur Prozessanalyse',
      'Technologie-Auswahl und Roadmap-Entwicklung',
      'Begleitung bei der Umsetzung',
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
// WORDPRESS API
// ============================================
export const WP_API_URL = process.env.WP_API_URL || 'http://localhost/wp-json/wp/v2';
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
