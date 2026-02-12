import { notFound } from 'next/navigation';
import dynamic from 'next/dynamic';
import { getPageByPath, getAllPagesWithPaths } from '@/lib/wordpress';

const WordPressPageComponent = dynamic(() => import('@/components/WordPressPage'));

export const revalidate = 300;

export async function generateStaticParams() {
  const pagesWithPaths = await getAllPagesWithPaths();
  return pagesWithPaths.map(({ slug }) => ({ slug }));
}

interface PageProps {
  params: Promise<{ slug: string[] }>;
}

export default async function CatchAllWPPage({ params }: PageProps) {
  const { slug } = await params;
  const page = await getPageByPath(slug);

  if (!page) {
    notFound();
  }

  const parentPath = slug.length > 1 ? '/' + slug.slice(0, -1).join('/') : '/';
  const backText = slug.length > 1 ? 'Zurück' : 'Zurück zur Startseite';

  return (
    <WordPressPageComponent
      page={page}
      showBackButton={true}
      backButtonText={backText}
      backButtonHref={parentPath}
    />
  );
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  const page = await getPageByPath(slug);

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
