import { notFound } from 'next/navigation';
import dynamic from 'next/dynamic';
import { getPageBySlug, getChildPages, stripHtml } from '@/lib/wordpress';
import { generateProductSchema, generateOrganizationSchema } from '@/lib/seo/structured-data';

const WordPressPageComponent = dynamic(() => import('@/components/WordPressPage'));

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

  const description = stripHtml(page.excerpt.rendered).trim() || page.title.rendered;
  const productSchema = generateProductSchema(
    page.title.rendered.replace(/<[^>]*>/g, ''),
    description,
    slug,
    true,
    'BusinessApplication'
  );
  const orgSchema = generateOrganizationSchema();

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify([productSchema, orgSchema]) }}
      />
      <WordPressPageComponent
        page={page}
        showBackButton={true}
        backButtonText="Zurück zu Produkte"
        backButtonHref="/produkte"
      />
    </>
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
