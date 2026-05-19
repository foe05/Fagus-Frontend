import Link from 'next/link';
import Image from 'next/image';
import { getChildPages, getPageBySlug, stripHtml, getFeaturedImage } from '@/lib/wordpress';
import { CardGrid, FeatureCard } from '@/components/ui';

export const revalidate = 300;

const fallbackServices = [
  {
    title: 'Digitalisierungs-Strategie',
    slug: 'digitalisierungsstrategie',
    icon: 'rocket_launch',
    description: 'Strategische Beratung für digitale Transformation in Forstbetrieben',
  },
  {
    title: 'Prozessoptimierung & Automatisierung',
    slug: 'prozessoptimierung-automatisierung',
    icon: 'settings_suggest',
    description: 'Effizienzsteigerung durch intelligente Automatisierung',
  },
  {
    title: 'Change Management',
    slug: 'change-management',
    icon: 'groups',
    description: 'Erfolgreiche Einführung neuer Technologien im Team',
  },
  {
    title: 'Prototyping & MVP',
    slug: 'prototyping-mvp',
    icon: 'science',
    description: 'Schnelle Entwicklung von Prototypen und Minimal Viable Products',
  },
];

export async function generateMetadata() {
  const wpPage = await getPageBySlug('services');

  if (wpPage) {
    const title = wpPage.title.rendered.replace(/<[^>]*>/g, '');
    const description = stripHtml(wpPage.excerpt.rendered).trim();
    return {
      title: `${title} - Broetzens IT`,
      ...(description && { description }),
    };
  }

  return {
    title: 'Unsere Services - Broetzens IT',
    description: 'AI-First Beratung und Entwicklung für Forstbetriebe. Wir begleiten dich von der Strategie bis zur erfolgreichen Umsetzung.',
  };
}

export default async function ServicesPage() {
  const [wpPage, wpChildren] = await Promise.all([
    getPageBySlug('services'),
    getChildPages('services'),
  ]);

  const hasWpContent = wpPage && wpPage.content.rendered.replace(/<[^>]*>/g, '').trim().length > 0;

  return (
    <div className="pt-[70px] min-h-screen bg-bg-light">
      {/* Header */}
      <div className="container-custom py-20 pb-0">
        <div className="max-w-3xl mb-16">
          {wpPage ? (
            <h1
              className="display-medium text-text-dark mb-6"
              dangerouslySetInnerHTML={{ __html: wpPage.title.rendered }}
            />
          ) : (
            <h1 className="display-medium text-text-dark mb-6">
              Unsere Services
            </h1>
          )}
          {!hasWpContent && (
            <p className="body-large text-text-medium">
              AI-First Beratung und Entwicklung für Forstbetriebe. Wir begleiten dich
              von der Strategie bis zur erfolgreichen Umsetzung.
            </p>
          )}
        </div>
      </div>

      {/* WordPress Page Content */}
      {hasWpContent && (
        <article className="pb-12 bg-bg-light">
          <div className="container-custom max-w-4xl">
            <div
              className="prose prose-lg max-w-none
                prose-headings:text-text-dark
                prose-h2:headline-medium
                prose-h3:headline-small
                prose-p:text-text-medium prose-p:body-large
                prose-a:text-primary prose-a:no-underline hover:prose-a:underline
                prose-strong:text-text-dark
                prose-ul:text-text-medium
                prose-ol:text-text-medium
                prose-li:body-medium
                prose-img:rounded-xl
                prose-img:shadow-lg"
              dangerouslySetInnerHTML={{ __html: wpPage!.content.rendered }}
            />
          </div>
        </article>
      )}

      <div className="container-custom py-20">
        {wpChildren.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {wpChildren.map((page) => {
              const image = getFeaturedImage(page);
              const excerpt = stripHtml(page.excerpt.rendered).trim();
              return (
                <Link
                  key={page.slug}
                  href={`/services/${page.slug}`}
                  className="group bg-white rounded-2xl overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
                >
                  {image && (
                    <div className="relative h-48 w-full">
                      <Image
                        src={image}
                        alt={page.title.rendered}
                        fill
                        className="object-cover"
                      />
                    </div>
                  )}
                  <div className="p-8">
                    <h2
                      className="headline-small text-text-dark mb-4 group-hover:text-primary transition-colors"
                      dangerouslySetInnerHTML={{ __html: page.title.rendered }}
                    />
                    {excerpt && (
                      <p className="body-large text-text-medium mb-6">{excerpt}</p>
                    )}
                    <div className="flex items-center gap-2 label-large text-primary">
                      <span>Mehr erfahren</span>
                      <span className="material-symbols-outlined text-[20px] group-hover:translate-x-1 transition-transform">
                        arrow_forward
                      </span>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        ) : (
          <CardGrid columns={2} gap="lg">
            {fallbackServices.map((service) => (
              <FeatureCard
                key={service.slug}
                title={service.title}
                description={service.description}
                icon={service.icon}
                href={`/services/${service.slug}`}
              />
            ))}
          </CardGrid>
        )}
      </div>
    </div>
  );
}
