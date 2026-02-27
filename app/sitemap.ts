import { MetadataRoute } from 'next';
import { getAllPostSlugs, getAllPagesWithPaths } from '@/lib/wordpress';

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://broetzens.de';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Statische Routen
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 1,
    },
    {
      url: `${baseUrl}/services`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/produkte`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/ueber-uns`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/kontakt`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/themen`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
  ];

  // WordPress Blog-Posts
  const postSlugs = await getAllPostSlugs();
  const blogPosts: MetadataRoute.Sitemap = postSlugs.map((slug) => ({
    url: `${baseUrl}/ueber-uns/blog-wissen/${slug}`,
    lastModified: new Date(),
    changeFrequency: 'weekly',
    priority: 0.6,
  }));

  // WordPress-Seiten (with full hierarchical paths)
  const pagesWithPaths = await getAllPagesWithPaths();
  const wordpressPages: MetadataRoute.Sitemap = pagesWithPaths.map(({ slug, page }) => ({
    url: `${baseUrl}/${slug.join('/')}`,
    lastModified: new Date(page.modified),
    changeFrequency: 'monthly',
    priority: slug.length === 1 ? 0.7 : 0.6,
  }));

  return [...staticRoutes, ...blogPosts, ...wordpressPages];
}
