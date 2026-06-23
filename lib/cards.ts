// Digitale Kontaktkarten ("Lemontaps-Lite") — Multi-Card-Registry.
//
// V1: versionierte TypeScript-Config, eine Person = ein Slug, keine DB.
// Quelle laut Spec (docs/Contact.md, Abschnitt 3). Phase 3 könnte die Karten
// stattdessen aus WordPress ziehen — das Interface bleibt dann gleich, nur
// `getCardBySlug` würde gegen lib/wordpress.ts tauschen.

export interface ContactCard {
  slug: string; // URL-Segment, z.B. "johannes-broetzen"
  firstName: string;
  lastName: string;
  fullName: string; // FN (vCard-Pflichtfeld)
  org?: string;
  title?: string; // Position
  emails: { type: 'work' | 'home'; value: string }[];
  phones: { type: 'cell' | 'work' | 'home'; value: string }[];
  url?: string; // Website
  addresses?: {
    type: 'work' | 'home';
    street?: string;
    city?: string;
    zip?: string;
    country?: string;
  }[];
  links?: { label: string; href: string }[]; // LinkedIn, GitHub etc.
  photoUrl?: string; // absolute URL zu Foto/Logo (für vCard PHOTO)
  note?: string;
  // Ziel-Adresse für eingehende Kontakte dieser Karte:
  inboxEmail: string; // wohin "Besucher → Owner" gemailt wird
}

export const CARDS: ContactCard[] = [
  {
    slug: 'xXCGFJ',
    firstName: 'Johannes',
    lastName: 'Brötz',
    fullName: 'Johannes Brötz',
    org: 'Brötzens IT Cattles & Cows',
    title: 'IT-Beratung Forst',
    emails: [{ type: 'work', value: 'johannes@broetzens.de' }],
    phones: [{ type: 'cell', value: '+491632347224' }],
    url: 'https://broetzens.de',
    links: [],
    note: 'Kennengelernt über digitale Kontaktkarte',
    inboxEmail: 'johannes@broetzens.de',
  },
];

export const getCardBySlug = (slug: string): ContactCard | undefined =>
  CARDS.find((c) => c.slug === slug);
