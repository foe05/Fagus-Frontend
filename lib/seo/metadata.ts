import type { Metadata } from 'next';
import { COMPANY_INFO } from '../constants';
import { stripHtml } from '../wordpress';
import { PRIMARY_KEYWORDS, SECONDARY_KEYWORDS, getKeywordString } from './keywords';

// Re-export for any consumers that imported from here
export { stripHtml };

// ============================================
// SITE CONFIGURATION
// ============================================

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://broetzens.de';
const SITE_NAME = COMPANY_INFO.name;
const DEFAULT_TITLE_SUFFIX = 'Broetzens IT';
const DEFAULT_IMAGE = '/images/og-default.jpg'; // Fallback OG image

/**
 * Truncate text to a specific length, ensuring it ends at a word boundary
 * @param text - Text to truncate
 * @param maxLength - Maximum length (default: 160 for meta descriptions)
 * @returns Truncated text with ellipsis if needed
 */
export function truncateText(text: string, maxLength: number = 160): string {
  if (text.length <= maxLength) {
    return text;
  }

  // Find the last space before maxLength
  const truncated = text.slice(0, maxLength);
  const lastSpace = truncated.lastIndexOf(' ');

  if (lastSpace > 0) {
    return truncated.slice(0, lastSpace) + '...';
  }

  return truncated + '...';
}

/**
 * Clean and prepare description text for metadata
 * Strips HTML tags and truncates to SEO-friendly length
 * @param html - Raw HTML or text content
 * @param maxLength - Maximum length (default: 160)
 * @returns Clean, truncated description
 */
export function cleanDescription(html: string, maxLength: number = 160): string {
  const plainText = stripHtml(html).trim();
  return truncateText(plainText, maxLength);
}

// ============================================
// TITLE FORMATTING
// ============================================

/**
 * Format a page title with consistent structure
 * @param title - Page title
 * @param section - Optional section name (e.g., 'Services', 'Produkte')
 * @param includeSuffix - Whether to include the site name suffix (default: true)
 * @returns Formatted title string
 */
export function formatTitle(
  title: string,
  section?: string,
  includeSuffix: boolean = true
): string {
  const parts = [title];

  if (section) {
    parts.push(section);
  }

  if (includeSuffix) {
    parts.push(DEFAULT_TITLE_SUFFIX);
  }

  return parts.join(' - ');
}

/**
 * Format homepage title with primary keywords
 * @returns SEO-optimized homepage title
 */
export function formatHomeTitle(): string {
  return `${SITE_NAME} - ${COMPANY_INFO.tagline}`;
}

// ============================================
// CANONICAL URL
// ============================================

/**
 * Generate canonical URL for a page
 * @param path - Page path (e.g., '/services/digitalisierungsstrategie')
 * @returns Full canonical URL
 */
export function getCanonicalUrl(path: string): string {
  // Ensure path starts with /
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  // Remove trailing slash except for root
  const cleanPath = normalizedPath === '/' ? normalizedPath : normalizedPath.replace(/\/$/, '');
  return `${SITE_URL}${cleanPath}`;
}

// ============================================
// METADATA GENERATORS
// ============================================

interface BaseMetadataOptions {
  title: string;
  description: string;
  keywords?: string[];
  path?: string;
  image?: string;
  section?: string;
  includeTitleSuffix?: boolean;
}

/**
 * Generate base metadata object with common SEO fields
 * @param options - Metadata configuration options
 * @returns Next.js Metadata object
 */
export function generateBaseMetadata(options: BaseMetadataOptions): Metadata {
  const {
    title,
    description,
    keywords = [],
    path = '/',
    image = DEFAULT_IMAGE,
    section,
    includeTitleSuffix = true,
  } = options;

  const formattedTitle = formatTitle(title, section, includeTitleSuffix);
  const canonicalUrl = getCanonicalUrl(path);
  const imageUrl = image.startsWith('http') ? image : `${SITE_URL}${image}`;

  // Combine provided keywords with primary keywords
  const allKeywords = Array.from(new Set([...keywords, ...PRIMARY_KEYWORDS]));

  return {
    title: formattedTitle,
    description: cleanDescription(description),
    keywords: allKeywords,
    authors: [{ name: SITE_NAME }],
    openGraph: {
      title: formattedTitle,
      description: cleanDescription(description),
      type: 'website',
      locale: 'de_DE',
      url: canonicalUrl,
      siteName: SITE_NAME,
      images: [
        {
          url: imageUrl,
          alt: title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: formattedTitle,
      description: cleanDescription(description),
      images: [imageUrl],
    },
    alternates: {
      canonical: canonicalUrl,
    },
  };
}

/**
 * Generate metadata for a service page
 * @param title - Service title
 * @param description - Service description
 * @param slug - Service URL slug
 * @param additionalKeywords - Additional service-specific keywords
 * @returns Next.js Metadata object
 */
export function generateServiceMetadata(
  title: string,
  description: string,
  slug: string,
  additionalKeywords: string[] = []
): Metadata {
  return generateBaseMetadata({
    title,
    description,
    keywords: [...additionalKeywords, ...SECONDARY_KEYWORDS],
    path: `/services/${slug}`,
    section: 'Services',
  });
}

/**
 * Generate metadata for a product page
 * @param title - Product title
 * @param description - Product description
 * @param slug - Product URL slug
 * @param additionalKeywords - Additional product-specific keywords
 * @returns Next.js Metadata object
 */
export function generateProductMetadata(
  title: string,
  description: string,
  slug: string,
  additionalKeywords: string[] = []
): Metadata {
  return generateBaseMetadata({
    title,
    description,
    keywords: [...additionalKeywords, ...SECONDARY_KEYWORDS],
    path: `/produkte/${slug}`,
    section: 'Produkte',
  });
}

/**
 * Generate metadata for a blog post/article page
 * @param title - Article title
 * @param description - Article description/excerpt
 * @param slug - Article URL slug
 * @param image - Optional featured image URL
 * @param additionalKeywords - Additional article-specific keywords
 * @returns Next.js Metadata object
 */
export function generateArticleMetadata(
  title: string,
  description: string,
  slug: string,
  image?: string,
  additionalKeywords: string[] = []
): Metadata {
  const formattedTitle = formatTitle(title, 'Blog & Wissen', true);
  const canonicalUrl = getCanonicalUrl(`/ueber-uns/blog-wissen/${slug}`);
  const imageUrl = image?.startsWith('http') ? image : `${SITE_URL}${image || DEFAULT_IMAGE}`;
  const allKeywords = Array.from(new Set([...additionalKeywords, ...PRIMARY_KEYWORDS]));

  return {
    title: formattedTitle,
    description: cleanDescription(description),
    keywords: allKeywords,
    authors: [{ name: SITE_NAME }],
    openGraph: {
      title: formattedTitle,
      description: cleanDescription(description),
      type: 'article',
      locale: 'de_DE',
      url: canonicalUrl,
      siteName: SITE_NAME,
      images: [
        {
          url: imageUrl,
          alt: title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: formattedTitle,
      description: cleanDescription(description),
      images: [imageUrl],
    },
    alternates: {
      canonical: canonicalUrl,
    },
  };
}

/**
 * Generate metadata for a static page
 * @param title - Page title
 * @param description - Page description
 * @param path - Page path
 * @param additionalKeywords - Additional page-specific keywords
 * @returns Next.js Metadata object
 */
export function generatePageMetadata(
  title: string,
  description: string,
  path: string,
  additionalKeywords: string[] = []
): Metadata {
  return generateBaseMetadata({
    title,
    description,
    keywords: additionalKeywords,
    path,
  });
}

/**
 * Generate homepage metadata with optimal SEO keywords
 * @returns Next.js Metadata object
 */
export function generateHomeMetadata(): Metadata {
  const description = `${COMPANY_INFO.tagline}. ${COMPANY_INFO.description}. Moderne IT-Lösungen und Digitalisierung für Forstbetriebe, Waldbesitzer und Hegegemeinschaften.`;

  return generateBaseMetadata({
    title: SITE_NAME,
    description,
    keywords: [
      ...PRIMARY_KEYWORDS,
      ...SECONDARY_KEYWORDS.slice(0, 5), // Include top secondary keywords
    ],
    path: '/',
    includeTitleSuffix: false, // Homepage uses full site name
  });
}

// ============================================
// KEYWORD HELPERS
// ============================================

/**
 * Generate keywords array for metadata
 * Combines provided keywords with default primary keywords
 * @param customKeywords - Custom keywords specific to the page
 * @returns Deduplicated array of keywords
 */
export function generateKeywords(...customKeywords: string[][]): string[] {
  const combined = [...PRIMARY_KEYWORDS, ...customKeywords.flat()];
  return Array.from(new Set(combined)); // Remove duplicates
}

/**
 * Generate keywords string for meta tag
 * @param keywords - Array of keywords
 * @returns Comma-separated keyword string
 */
export function generateKeywordString(keywords: string[]): string {
  return getKeywordString(keywords);
}
