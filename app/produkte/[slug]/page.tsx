import { notFound } from 'next/navigation';
import { getPageBySlug, getChildPages } from '@/lib/wordpress';
import WordPressPageComponent from '@/components/WordPressPage';

export const revalidate = 300;

export async function generateStaticParams() {
  const children = await getChildPages('produkte');
  return children.map((page) => ({ slug: page.slug }));
}

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default async function ProductDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const page = await getPageBySlug(slug);

  if (!page) {
    notFound();
  }

  return (
    <WordPressPageComponent
      page={page}
      showBackButton={true}
      backButtonText="Zurück zu Produkte"
      backButtonHref="/produkte"
    />
  );
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  const page = await getPageBySlug(slug);

  if (!page) {
    return { title: 'Seite nicht gefunden' };
  }

  return {
    title: `${page.title.rendered} - Produkte - Broetzens IT`,
    description: page.excerpt.rendered.replace(/<[^>]*>/g, '').substring(0, 160),
  };
}
