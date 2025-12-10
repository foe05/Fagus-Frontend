import { MetadataRoute } from 'next';
import { getAllPostSlugs, getAllPageSlugs } from '@/lib/wordpress';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://broetzens.de'; // In Production anpassen!

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
    // Service-Detailseiten
    {
      url: `${baseUrl}/services/digitalisierungsstrategie`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    // Produkt-Detailseiten
    {
      url: `${baseUrl}/produkte/hegegemeinschaft-management`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    // Blog-Übersicht
    {
      url: `${baseUrl}/ueber-uns/blog-wissen`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
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

  // WordPress-Seiten
  const pageSlugs = await getAllPageSlugs();
  const wordpressPages: MetadataRoute.Sitemap = pageSlugs.map((slug) => ({
    url: `${baseUrl}/${slug}`,
    lastModified: new Date(),
    changeFrequency: 'monthly',
    priority: 0.7,
  }));

  return [...staticRoutes, ...blogPosts, ...wordpressPages];
}
