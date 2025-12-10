import { notFound } from 'next/navigation';
import { getPageBySlug, getAllPageSlugs } from '@/lib/wordpress';
import WordPressPageComponent from '@/components/WordPressPage';

export const revalidate = 300; // Revalidate every 5 minutes

// Generate static params for all WordPress pages
export async function generateStaticParams() {
  const slugs = await getAllPageSlugs();
  return slugs.map((slug) => ({
    'wp-page': slug,
  }));
}

interface PageProps {
  params: Promise<{ 'wp-page': string }>;
}

export default async function DynamicWordPressPage({ params }: PageProps) {
  const { 'wp-page': slug } = await params;
  const page = await getPageBySlug(slug);

  if (!page) {
    notFound();
  }

  return (
    <WordPressPageComponent
      page={page}
      showBackButton={true}
      backButtonText="Zurück zur Startseite"
      backButtonHref="/"
    />
  );
}

// Generate metadata for SEO
export async function generateMetadata({ params }: PageProps) {
  const { 'wp-page': slug } = await params;
  const page = await getPageBySlug(slug);

  if (!page) {
    return {
      title: 'Seite nicht gefunden',
    };
  }

  return {
    title: `${page.title.rendered} - Broetzens IT Cattles & Cows`,
    description: page.excerpt.rendered.replace(/<[^>]*>/g, '').substring(0, 160),
  };
}
