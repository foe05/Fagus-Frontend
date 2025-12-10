import type { WordPressPost, WordPressPage } from './types';
import { WP_API_URL, WP_CACHE_REVALIDATE } from './constants';

// ============================================
// POSTS API
// ============================================

/**
 * Fetch multiple posts from WordPress REST API
 * @param limit - Number of posts to fetch (default: 10)
 * @returns Array of WordPress posts
 */
export async function getPosts(limit: number = 10): Promise<WordPressPost[]> {
  try {
    const response = await fetch(
      `${WP_API_URL}/posts?per_page=${limit}&_embed`,
      {
        next: { revalidate: WP_CACHE_REVALIDATE },
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    if (!response.ok) {
      console.error(`WordPress API Error: ${response.status} ${response.statusText}`);
      return [];
    }

    const posts = await response.json();
    return posts;
  } catch (error) {
    console.error('WordPress API Error:', error);
    return [];
  }
}

/**
 * Fetch a single post by slug
 * @param slug - Post slug
 * @returns WordPress post or null if not found
 */
export async function getPostBySlug(slug: string): Promise<WordPressPost | null> {
  try {
    const response = await fetch(
      `${WP_API_URL}/posts?slug=${slug}&_embed`,
      {
        next: { revalidate: WP_CACHE_REVALIDATE },
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    if (!response.ok) {
      console.error(`WordPress API Error: ${response.status} ${response.statusText}`);
      return null;
    }

    const posts = await response.json();
    return posts[0] || null;
  } catch (error) {
    console.error('WordPress API Error:', error);
    return null;
  }
}

/**
 * Get all post slugs for static site generation
 * @returns Array of post slugs
 */
export async function getAllPostSlugs(): Promise<string[]> {
  try {
    const response = await fetch(
      `${WP_API_URL}/posts?per_page=100&_fields=slug`,
      {
        next: { revalidate: WP_CACHE_REVALIDATE },
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    if (!response.ok) {
      console.error(`WordPress API Error: ${response.status} ${response.statusText}`);
      return [];
    }

    const posts = await response.json();
    return posts.map((post: { slug: string }) => post.slug);
  } catch (error) {
    console.error('WordPress API Error:', error);
    return [];
  }
}

/**
 * Format WordPress date to German locale
 * @param dateString - ISO date string
 * @returns Formatted date string
 */
export function formatPostDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('de-DE', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

/**
 * Extract plain text from HTML content
 * @param html - HTML string
 * @returns Plain text
 */
export function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, '');
}

/**
 * Get featured image URL from post or page
 * @param item - WordPress post or page
 * @returns Image URL or fallback
 */
export function getFeaturedImage(item: WordPressPost | WordPressPage): string | null {
  if (item._embedded?.['wp:featuredmedia']?.[0]?.source_url) {
    return item._embedded['wp:featuredmedia'][0].source_url;
  }
  return null;
}

// ============================================
// PAGES API
// ============================================

/**
 * Fetch multiple pages from WordPress REST API
 * @param limit - Number of pages to fetch (default: 100)
 * @returns Array of WordPress pages
 */
export async function getPages(limit: number = 100): Promise<WordPressPage[]> {
  try {
    const response = await fetch(
      `${WP_API_URL}/pages?per_page=${limit}&_embed`,
      {
        next: { revalidate: WP_CACHE_REVALIDATE },
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    if (!response.ok) {
      console.error(`WordPress API Error: ${response.status} ${response.statusText}`);
      return [];
    }

    const pages = await response.json();
    return pages;
  } catch (error) {
    console.error('WordPress API Error:', error);
    return [];
  }
}

/**
 * Fetch a single page by slug
 * @param slug - Page slug
 * @returns WordPress page or null if not found
 */
export async function getPageBySlug(slug: string): Promise<WordPressPage | null> {
  try {
    const response = await fetch(
      `${WP_API_URL}/pages?slug=${slug}&_embed`,
      {
        next: { revalidate: WP_CACHE_REVALIDATE },
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    if (!response.ok) {
      console.error(`WordPress API Error: ${response.status} ${response.statusText}`);
      return null;
    }

    const pages = await response.json();
    return pages[0] || null;
  } catch (error) {
    console.error('WordPress API Error:', error);
    return null;
  }
}

/**
 * Get all page slugs for static site generation
 * @returns Array of page slugs
 */
export async function getAllPageSlugs(): Promise<string[]> {
  try {
    const response = await fetch(
      `${WP_API_URL}/pages?per_page=100&_fields=slug`,
      {
        next: { revalidate: WP_CACHE_REVALIDATE },
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    if (!response.ok) {
      console.error(`WordPress API Error: ${response.status} ${response.statusText}`);
      return [];
    }

    const pages = await response.json();
    return pages.map((page: { slug: string }) => page.slug);
  } catch (error) {
    console.error('WordPress API Error:', error);
    return [];
  }
}
