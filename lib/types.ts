// ============================================
// HOTSPOT TYPES
// ============================================
export interface Hotspot {
  id: string;
  icon: string;
  label: string;
  position: { left: string; top: string };
  type: 'produkte' | 'services' | 'blog' | 'referenzen' | 'team' | 'werte';
  title: string;
  description: string;
  link: string;
  features?: string[];
}

export interface PopupContent {
  icon: string;
  title: string;
  description: string;
  features: string[];
  link: string;
  type: Hotspot['type'];
}

// ============================================
// NAVIGATION TYPES
// ============================================
export interface NavigationItem {
  label: string;
  href: string;
  icon: string;
  children?: NavigationItem[];
}

// ============================================
// FOOTER TYPES
// ============================================
export interface FooterColumn {
  title: string;
  links: Array<{
    label: string;
    href: string;
  }>;
}

export interface SocialLink {
  platform: string;
  icon: string;
  url: string;
  ariaLabel: string;
}

// ============================================
// WORDPRESS API TYPES
// ============================================
export interface WordPressPost {
  id: number;
  slug: string;
  title: { rendered: string };
  content: { rendered: string };
  excerpt: { rendered: string };
  date: string;
  modified: string;
  featured_media: number;
  _embedded?: {
    'wp:featuredmedia'?: Array<{
      source_url: string;
      alt_text: string;
      media_details?: {
        width: number;
        height: number;
      };
    }>;
  };
}

export interface WordPressPage {
  id: number;
  slug: string;
  title: { rendered: string };
  content: { rendered: string };
  excerpt: { rendered: string };
  date: string;
  modified: string;
  featured_media: number;
  parent: number;
  menu_order: number;
  _embedded?: {
    'wp:featuredmedia'?: Array<{
      source_url: string;
      alt_text: string;
      media_details?: {
        width: number;
        height: number;
      };
    }>;
  };
}

export interface WordPressAPIResponse {
  posts: WordPressPost[];
  total: number;
  totalPages: number;
}
