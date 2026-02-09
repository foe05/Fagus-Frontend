import { notFound } from 'next/navigation';
import { getPageBySlug, getChildPages } from '@/lib/wordpress';
import WordPressPageComponent from '@/components/WordPressPage';

export const revalidate = 300;

export async function generateStaticParams() {
  const children = await getChildPages('ueber-uns');
  return children.map((page) => ({ slug: page.slug }));
}

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default async function UeberUnsDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const page = await getPageBySlug(slug);

  if (!page) {
    notFound();
  }

  return (
    <WordPressPageComponent
      page={page}
      showBackButton={true}
      backButtonText="Zurück zu Über uns"
      backButtonHref="/ueber-uns"
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
    title: `${page.title.rendered} - Über uns - Broetzens IT`,
    description: page.excerpt.rendered.replace(/<[^>]*>/g, '').substring(0, 160),
  };
}
