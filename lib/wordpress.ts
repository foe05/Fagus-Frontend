import type { WordPressPost, WordPressPage, WordPressCategory, WordPressTag, WordPressAuthor, WPMenuItem, NavigationItem, FooterColumn } from './types';
import { WP_API_URL, WP_CACHE_REVALIDATE, NAVIGATION_ITEMS, FOOTER_COLUMNS } from './constants';

// ============================================
// SITE SETTINGS
// ============================================

/**
 * Fetch the site icon (favicon) URL from WordPress
 * Uses the WordPress REST API root endpoint which exposes site_icon_url
 * @returns Site icon URL or null if not set
 */
export async function getSiteIcon(): Promise<string | null> {
  try {
    // Derive the WP REST API root from WP_API_URL by removing /wp/v2
    const wpJsonUrl = WP_API_URL.replace(/\/wp\/v2\/?$/, '');
    const response = await fetch(wpJsonUrl, {
      next: { revalidate: WP_CACHE_REVALIDATE },
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      console.error(`WordPress API Error: ${response.status} ${response.statusText}`);
      return null;
    }

    const data = await response.json();
    return data.site_icon_url || null;
  } catch (error) {
    console.error('WordPress API Error (site icon):', error);
    return null;
  }
}

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
 * Search posts by query string
 * @param query - Search query string
 * @param limit - Number of posts to fetch (default: 10)
 * @returns Array of WordPress posts matching the search query
 */
export async function searchPosts(query: string, limit: number = 10): Promise<WordPressPost[]> {
  try {
    const response = await fetch(
      `${WP_API_URL}/posts?search=${encodeURIComponent(query)}&per_page=${limit}&_embed`,
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
 * Fetch child pages of a parent page by parent slug
 * @param parentSlug - Slug of the parent page
 * @returns Array of WordPress child pages
 */
export async function getChildPages(parentSlug: string): Promise<WordPressPage[]> {
  try {
    const parent = await getPageBySlug(parentSlug);
    if (!parent) return [];

    const response = await fetch(
      `${WP_API_URL}/pages?parent=${parent.id}&per_page=100&orderby=menu_order&order=asc&_embed`,
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

    return await response.json();
  } catch (error) {
    console.error('WordPress API Error:', error);
    return [];
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

// ============================================
// CATEGORIES AND TAGS API
// ============================================

/**
 * Fetch all categories from WordPress REST API
 * @param limit - Number of categories to fetch (default: 100)
 * @returns Array of WordPress categories
 */
export async function getCategories(limit: number = 100): Promise<WordPressCategory[]> {
  try {
    const response = await fetch(
      `${WP_API_URL}/categories?per_page=${limit}`,
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

    const categories = await response.json();
    return categories;
  } catch (error) {
    console.error('WordPress API Error:', error);
    return [];
  }
}

/**
 * Fetch all tags from WordPress REST API
 * @param limit - Number of tags to fetch (default: 100)
 * @returns Array of WordPress tags
 */
export async function getTags(limit: number = 100): Promise<WordPressTag[]> {
  try {
    const response = await fetch(
      `${WP_API_URL}/tags?per_page=${limit}`,
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

    const tags = await response.json();
    return tags;
  } catch (error) {
    console.error('WordPress API Error:', error);
    return [];
  }
}

// ============================================
// AUTHORS API
// ============================================

/**
 * Fetch all authors from WordPress REST API
 * @param limit - Number of authors to fetch (default: 100)
 * @returns Array of WordPress authors
 */
export async function getAuthors(limit: number = 100): Promise<WordPressAuthor[]> {
  try {
    const response = await fetch(
      `${WP_API_URL}/users?per_page=${limit}`,
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

    const authors = await response.json();
    return authors;
  } catch (error) {
    console.error('WordPress API Error:', error);
    return [];
  }
}

/**
 * Fetch a single author by ID
 * @param id - Author ID
 * @returns WordPress author or null if not found
 */
export async function getAuthor(id: number): Promise<WordPressAuthor | null> {
  try {
    const response = await fetch(
      `${WP_API_URL}/users/${id}`,
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

    const author = await response.json();
    return author;
  } catch (error) {
    console.error('WordPress API Error:', error);
    return null;
  }
}

// ============================================
// MENUS API (via fagus mu-plugin)
// ============================================

/**
 * Fetch a WordPress menu by its registered location.
 * Uses the custom fagus/v1 REST endpoint from the mu-plugin.
 */
export async function getMenuByLocation(location: string): Promise<WPMenuItem[]> {
  try {
    const baseUrl = WP_API_URL.replace(/\/wp\/v2\/?$/, '');
    const response = await fetch(
      `${baseUrl}/fagus/v1/menus/${location}`,
      {
        next: { revalidate: WP_CACHE_REVALIDATE },
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    if (!response.ok) {
      console.warn(`Menu API: ${response.status} for location "${location}"`);
      return [];
    }

    return await response.json();
  } catch (error) {
    console.warn('Menu API unreachable, using fallback:', error);
    return [];
  }
}

/**
 * Extract a Material Symbols icon name from WP menu item CSS classes.
 * Convention: add class "menu-item-icon-{name}" in WP admin.
 */
function extractIconFromClasses(cssClasses: string[]): string {
  for (const cls of cssClasses) {
    if (cls.startsWith('menu-item-icon-')) {
      return cls.replace('menu-item-icon-', '');
    }
  }
  return 'link';
}

/**
 * Map WP menu items to NavigationItem[] for the Header.
 */
function mapMenuToNavigationItems(items: WPMenuItem[]): NavigationItem[] {
  return items.map((item) => ({
    label: item.title,
    href: item.path,
    icon: extractIconFromClasses(item.css_classes),
    ...(item.children.length > 0 && {
      children: mapMenuToNavigationItems(item.children),
    }),
  }));
}

/**
 * Map WP menu items to FooterColumn[] for the Footer.
 * Top-level items become column titles, their children become links.
 */
function mapMenuToFooterColumns(items: WPMenuItem[]): FooterColumn[] {
  return items.map((item) => ({
    title: item.title,
    links: item.children.map((child) => ({
      label: child.title,
      href: child.path,
    })),
  }));
}

/**
 * Get header navigation: from WP menu or hardcoded fallback.
 */
export async function getHeaderNavigation(): Promise<NavigationItem[]> {
  const items = await getMenuByLocation('header-menu');
  if (items.length > 0) {
    return mapMenuToNavigationItems(items);
  }
  return NAVIGATION_ITEMS;
}

/**
 * Get footer navigation: from WP menu or hardcoded fallback.
 */
export async function getFooterNavigation(): Promise<FooterColumn[]> {
  const items = await getMenuByLocation('footer-menu');
  if (items.length > 0) {
    return mapMenuToFooterColumns(items);
  }
  return FOOTER_COLUMNS;
}

// ============================================
// PAGE PATH HELPERS (for catch-all route)
// ============================================

/**
 * Fetch all pages and build full path segments for each.
 * Returns array of { slug: string[], page: WordPressPage }.
 */
export async function getAllPagesWithPaths(): Promise<Array<{ slug: string[]; page: WordPressPage }>> {
  const pages = await getPages();
  if (pages.length === 0) return [];

  const byId = new Map<number, WordPressPage>();
  for (const page of pages) {
    byId.set(page.id, page);
  }

  function buildPath(page: WordPressPage): string[] {
    const segments: string[] = [page.slug];
    let current = page;
    while (current.parent && byId.has(current.parent)) {
      current = byId.get(current.parent)!;
      segments.unshift(current.slug);
    }
    return segments;
  }

  return pages.map((page) => ({
    slug: buildPath(page),
    page,
  }));
}

/**
 * Find a WP page by its URL path segments and verify the parent hierarchy.
 */
export async function getPageByPath(slugSegments: string[]): Promise<WordPressPage | null> {
  if (slugSegments.length === 0) return null;

  const lastSlug = slugSegments[slugSegments.length - 1];
  const page = await getPageBySlug(lastSlug);
  if (!page) return null;

  // For single-segment paths, verify it's a top-level page
  if (slugSegments.length === 1) {
    return page.parent === 0 ? page : null;
  }

  // For multi-segment paths, walk up the parent chain and verify each slug matches
  let current = page;
  for (let i = slugSegments.length - 2; i >= 0; i--) {
    if (!current.parent) return null;

    const parentPage = await getPageBySlug(slugSegments[i]);
    if (!parentPage || parentPage.id !== current.parent) return null;

    current = parentPage;
  }

  // The topmost page in the chain must be a root page
  return current.parent === 0 ? page : null;
}
