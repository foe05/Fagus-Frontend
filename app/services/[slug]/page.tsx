import { notFound } from 'next/navigation';
import dynamic from 'next/dynamic';
import { getPageBySlug, getChildPages, stripHtml } from '@/lib/wordpress';
import { generateServiceSchema, generateOrganizationSchema } from '@/lib/seo/structured-data';

const WordPressPageComponent = dynamic(() => import('@/components/WordPressPage'));

export const revalidate = 300;

export async function generateStaticParams() {
  const children = await getChildPages('services');
  return children.map((page) => ({ slug: page.slug }));
}

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default async function ServiceDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const page = await getPageBySlug(slug);

  if (!page) {
    notFound();
  }

  const description = stripHtml(page.excerpt.rendered).trim() || page.title.rendered;
  const serviceSchema = generateServiceSchema(
    page.title.rendered.replace(/<[^>]*>/g, ''),
    description,
    slug
  );
  const orgSchema = generateOrganizationSchema();

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify([serviceSchema, orgSchema]) }}
      />
      <WordPressPageComponent
        page={page}
        showBackButton={true}
        backButtonText="Zurück zu Services"
        backButtonHref="/services"
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
    title: `${page.title.rendered} - Services - Broetzens IT`,
    description: page.excerpt.rendered.replace(/<[^>]*>/g, '').substring(0, 160),
  };
}
