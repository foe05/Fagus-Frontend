import type { WordPressPost } from '../types';
import { COMPANY_INFO } from '../constants';

// ============================================
// STRUCTURED DATA TYPES
// ============================================

/**
 * Base schema.org type with @context
 */
interface BaseSchema {
  '@context': 'https://schema.org';
  '@type': string;
}

/**
 * Organization schema for company information
 */
export interface OrganizationSchema extends BaseSchema {
  '@type': 'Organization';
  name: string;
  description?: string;
  url?: string;
  logo?: string;
  image?: string;
  contactPoint?: {
    '@type': 'ContactPoint';
    telephone: string;
    email: string;
    contactType: string;
    areaServed: string;
    availableLanguage: string[];
  };
  address?: {
    '@type': 'PostalAddress';
    streetAddress: string;
    postalCode: string;
    addressLocality: string;
    addressCountry: string;
  };
  sameAs?: string[];
}

/**
 * Service schema for service offerings
 */
export interface ServiceSchema extends BaseSchema {
  '@type': 'Service';
  name: string;
  description: string;
  provider: {
    '@type': 'Organization';
    name: string;
    url?: string;
  };
  areaServed?: string;
  serviceType?: string;
  url?: string;
}

/**
 * Product schema for product offerings
 */
export interface ProductSchema extends BaseSchema {
  '@type': 'Product' | 'SoftwareApplication';
  name: string;
  description: string;
  brand?: {
    '@type': 'Organization';
    name: string;
  };
  offers?: {
    '@type': 'Offer';
    availability?: string;
    url?: string;
  };
  applicationCategory?: string;
  operatingSystem?: string;
  url?: string;
}

/**
 * Article schema for blog posts
 */
export interface ArticleSchema extends BaseSchema {
  '@type': 'Article';
  headline: string;
  description?: string;
  author?: {
    '@type': 'Organization';
    name: string;
  };
  publisher?: {
    '@type': 'Organization';
    name: string;
    logo?: {
      '@type': 'ImageObject';
      url: string;
    };
  };
  datePublished?: string;
  dateModified?: string;
  image?: string;
  url?: string;
}

/**
 * BreadcrumbList schema for navigation
 */
export interface BreadcrumbListSchema extends BaseSchema {
  '@type': 'BreadcrumbList';
  itemListElement: Array<{
    '@type': 'ListItem';
    position: number;
    name: string;
    item?: string;
  }>;
}

/**
 * WebSite schema for site-wide search
 */
export interface WebSiteSchema extends BaseSchema {
  '@type': 'WebSite';
  name: string;
  description?: string;
  url: string;
  potentialAction?: {
    '@type': 'SearchAction';
    target: string;
    'query-input': string;
  };
}

/**
 * ContactPage schema for the contact page
 */
export interface ContactPageSchema extends BaseSchema {
  '@type': 'ContactPage';
  name: string;
  description?: string;
  url: string;
  mainEntity?: {
    '@type': 'Organization';
    name: string;
    telephone: string;
    email: string;
    address: {
      '@type': 'PostalAddress';
      streetAddress: string;
      postalCode: string;
      addressLocality: string;
      addressCountry: string;
    };
  };
}

// ============================================
// SITE CONFIGURATION
// ============================================

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://broetzens.de';
const SITE_NAME = COMPANY_INFO.name;
const SITE_DESCRIPTION = `${COMPANY_INFO.tagline} - ${COMPANY_INFO.description}`;

// ============================================
// ORGANIZATION SCHEMA
// ============================================

/**
 * Generate Organization schema for the company
 * This should be included on every page to establish the organization identity
 * @param logoUrl - Optional URL to the company logo
 * @returns Organization schema object
 */
export function generateOrganizationSchema(logoUrl?: string): OrganizationSchema {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: COMPANY_INFO.name,
    description: SITE_DESCRIPTION,
    url: SITE_URL,
    ...(logoUrl && {
      logo: logoUrl,
      image: logoUrl,
    }),
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: COMPANY_INFO.phone,
      email: COMPANY_INFO.email,
      contactType: 'customer service',
      areaServed: 'DE',
      availableLanguage: ['de', 'en'],
    },
    address: {
      '@type': 'PostalAddress',
      streetAddress: COMPANY_INFO.address.street,
      postalCode: COMPANY_INFO.address.zip,
      addressLocality: COMPANY_INFO.address.city,
      addressCountry: COMPANY_INFO.address.country,
    },
    sameAs: [
      'https://www.linkedin.com/company/108531363',
      'https://github.com/foe05',
    ],
  };
}

// ============================================
// SERVICE SCHEMA
// ============================================

/**
 * Generate Service schema for a service offering
 * @param name - Service name
 * @param description - Service description
 * @param slug - Service URL slug
 * @param serviceType - Optional service type/category
 * @returns Service schema object
 */
export function generateServiceSchema(
  name: string,
  description: string,
  slug: string,
  serviceType?: string
): ServiceSchema {
  return {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name,
    description,
    provider: {
      '@type': 'Organization',
      name: COMPANY_INFO.name,
      url: SITE_URL,
    },
    areaServed: 'Deutschland',
    ...(serviceType && { serviceType }),
    url: `${SITE_URL}/services/${slug}`,
  };
}

/**
 * Generate multiple Service schemas for a list of services
 * @param services - Array of service objects with name, description, and slug
 * @returns Array of Service schema objects
 */
export function generateServiceListSchemas(
  services: Array<{ name: string; description: string; slug: string; serviceType?: string }>
): ServiceSchema[] {
  return services.map((service) =>
    generateServiceSchema(service.name, service.description, service.slug, service.serviceType)
  );
}

// ============================================
// PRODUCT SCHEMA
// ============================================

/**
 * Generate Product/SoftwareApplication schema for a product offering
 * @param name - Product name
 * @param description - Product description
 * @param slug - Product URL slug
 * @param isSoftware - Whether this is a software product (uses SoftwareApplication type)
 * @param applicationCategory - Optional application category for software products
 * @returns Product schema object
 */
export function generateProductSchema(
  name: string,
  description: string,
  slug: string,
  isSoftware: boolean = true,
  applicationCategory?: string
): ProductSchema {
  const schema: ProductSchema = {
    '@context': 'https://schema.org',
    '@type': isSoftware ? 'SoftwareApplication' : 'Product',
    name,
    description,
    brand: {
      '@type': 'Organization',
      name: COMPANY_INFO.name,
    },
    offers: {
      '@type': 'Offer',
      availability: 'https://schema.org/InStock',
      url: `${SITE_URL}/produkte/${slug}`,
    },
    url: `${SITE_URL}/produkte/${slug}`,
  };

  if (isSoftware && applicationCategory) {
    schema.applicationCategory = applicationCategory;
    schema.operatingSystem = 'Web, iOS, Android';
  }

  return schema;
}

/**
 * Generate multiple Product schemas for a list of products
 * @param products - Array of product objects with name, description, slug, and optional type info
 * @returns Array of Product schema objects
 */
export function generateProductListSchemas(
  products: Array<{
    name: string;
    description: string;
    slug: string;
    isSoftware?: boolean;
    applicationCategory?: string;
  }>
): ProductSchema[] {
  return products.map((product) =>
    generateProductSchema(
      product.name,
      product.description,
      product.slug,
      product.isSoftware ?? true,
      product.applicationCategory
    )
  );
}

// ============================================
// ARTICLE SCHEMA
// ============================================

/**
 * Generate Article schema for blog posts
 * @param post - WordPress post object
 * @param imageUrl - Optional featured image URL
 * @param logoUrl - Optional publisher logo URL
 * @returns Article schema object
 */
export function generateArticleSchema(
  post: WordPressPost,
  imageUrl?: string,
  logoUrl?: string
): ArticleSchema {
  const schema: ArticleSchema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: post.title.rendered,
    description: post.excerpt.rendered.replace(/<[^>]*>/g, '').slice(0, 200),
    author: {
      '@type': 'Organization',
      name: COMPANY_INFO.name,
    },
    publisher: {
      '@type': 'Organization',
      name: COMPANY_INFO.name,
      ...(logoUrl && {
        logo: {
          '@type': 'ImageObject',
          url: logoUrl,
        },
      }),
    },
    datePublished: post.date,
    dateModified: post.modified,
    url: `${SITE_URL}/ueber-uns/blog-wissen/${post.slug}`,
  };

  if (imageUrl) {
    schema.image = imageUrl;
  }

  return schema;
}

// ============================================
// BREADCRUMB SCHEMA
// ============================================

/**
 * Generate BreadcrumbList schema for page navigation
 * @param breadcrumbs - Array of breadcrumb items with name and optional url
 * @returns BreadcrumbList schema object
 */
export function generateBreadcrumbSchema(
  breadcrumbs: Array<{ name: string; url?: string }>
): BreadcrumbListSchema {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: breadcrumbs.map((crumb, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: crumb.name,
      ...(crumb.url && { item: `${SITE_URL}${crumb.url}` }),
    })),
  };
}

// ============================================
// WEBSITE SCHEMA
// ============================================

/**
 * Generate WebSite schema with search action
 * Useful for homepage to enable site search in search results
 * @returns WebSite schema object
 */
export function generateWebSiteSchema(): WebSiteSchema {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: SITE_NAME,
    description: SITE_DESCRIPTION,
    url: SITE_URL,
    potentialAction: {
      '@type': 'SearchAction',
      target: `${SITE_URL}/search?q={search_term_string}`,
      'query-input': 'required name=search_term_string',
    },
  };
}

// ============================================
// CONTACT PAGE SCHEMA
// ============================================

/**
 * Generate ContactPage schema for the contact page
 * @returns ContactPage schema object with embedded Organization
 */
export function generateContactPageSchema(): ContactPageSchema {
  return {
    '@context': 'https://schema.org',
    '@type': 'ContactPage',
    name: 'Kontakt - Broetzens IT Cattles & Cows',
    description: 'Kontaktiere uns für AI-First IT-Beratung für Forstbetriebe.',
    url: `${SITE_URL}/kontakt`,
    mainEntity: {
      '@type': 'Organization',
      name: COMPANY_INFO.name,
      telephone: COMPANY_INFO.phone,
      email: COMPANY_INFO.email,
      address: {
        '@type': 'PostalAddress',
        streetAddress: COMPANY_INFO.address.street,
        postalCode: COMPANY_INFO.address.zip,
        addressLocality: COMPANY_INFO.address.city,
        addressCountry: COMPANY_INFO.address.country,
      },
    },
  };
}

// ============================================
// HELPER FUNCTIONS
// ============================================

/**
 * Serialize a schema object to JSON-LD string
 * @param schema - Any structured data schema object
 * @returns JSON-LD string ready to be inserted in a script tag
 */
export function serializeSchema(schema: BaseSchema): string {
  return JSON.stringify(schema, null, 0);
}

/**
 * Serialize multiple schemas into a single JSON-LD string
 * When multiple schemas need to be embedded on the same page
 * @param schemas - Array of schema objects
 * @returns JSON-LD string with array of schemas
 */
export function serializeSchemas(schemas: BaseSchema[]): string {
  return JSON.stringify(schemas, null, 0);
}
