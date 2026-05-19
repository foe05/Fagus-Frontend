import Link from 'next/link';
import Image from 'next/image';
import { getChildPages, getPageBySlug, stripHtml, getFeaturedImage } from '@/lib/wordpress';
import { CardGrid, FeatureCard } from '@/components/ui';

export const revalidate = 300;

const fallbackProducts = [
  {
    title: 'Hegegemeinschaft Management',
    slug: 'hegegemeinschaft-management',
    icon: 'pets',
    tagline: '60+ aktive Nutzer',
    description: 'Digitale Lösung für revierübergreifendes Wildtiermanagement',
  },
  {
    title: 'Erdmassenberechnung',
    slug: 'erdmassenberechnung',
    icon: 'terrain',
    tagline: 'Forststraßenbau optimiert',
    description: 'Präzise Berechnung von Erdmassen für Forststraßenprojekte',
  },
  {
    title: 'Hosting & Support',
    slug: 'hosting',
    icon: 'cloud',
    tagline: 'Sicher und zuverlässig',
    description: 'Professionelles Hosting für Forst-Anwendungen',
  },
];

export async function generateMetadata() {
  const wpPage = await getPageBySlug('produkte');

  if (wpPage) {
    const title = wpPage.title.rendered.replace(/<[^>]*>/g, '');
    const description = stripHtml(wpPage.excerpt.rendered).trim();
    return {
      title: `${title} - Broetzens IT`,
      ...(description && { description }),
    };
  }

  return {
    title: 'Unsere Produkte - Broetzens IT',
    description: 'Bewährte Lösungen für die moderne Forstwirtschaft. Entwickelt mit AI-First Ansatz und erprobt in der Praxis.',
  };
}

export default async function ProduktePage() {
  const [wpPage, wpChildren] = await Promise.all([
    getPageBySlug('produkte'),
    getChildPages('produkte'),
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
              Unsere Produkte
            </h1>
          )}
          {!hasWpContent && (
            <p className="body-large text-text-medium">
              Bewährte Lösungen für die moderne Forstwirtschaft. Entwickelt mit
              AI-First Ansatz und erprobt in der Praxis.
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {wpChildren.map((page) => {
              const image = getFeaturedImage(page);
              const excerpt = stripHtml(page.excerpt.rendered).trim();
              return (
                <Link
                  key={page.slug}
                  href={`/produkte/${page.slug}`}
                  className="group bg-white rounded-2xl overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
                >
                  {/* Header */}
                  <div className="bg-gradient-to-br from-primary to-primary-light p-6 text-white">
                    {image ? (
                      <div className="relative h-32 w-full mb-4 rounded-lg overflow-hidden">
                        <Image
                          src={image}
                          alt={page.title.rendered}
                          fill
                          className="object-cover"
                        />
                      </div>
                    ) : (
                      <div className="flex items-start mb-4">
                        <span className="material-symbols-outlined text-[48px]">
                          inventory_2
                        </span>
                      </div>
                    )}
                    <h2
                      className="headline-small mb-2"
                      dangerouslySetInnerHTML={{ __html: page.title.rendered }}
                    />
                  </div>

                  {/* Content */}
                  <div className="p-6">
                    {excerpt && (
                      <p className="body-medium text-text-medium mb-6">{excerpt}</p>
                    )}
                    <div className="flex items-center gap-2 label-medium text-primary">
                      <span>Details ansehen</span>
                      <span className="material-symbols-outlined text-[18px] group-hover:translate-x-1 transition-transform">
                        arrow_forward
                      </span>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        ) : (
          <CardGrid columns={3} gap="lg">
            {fallbackProducts.map((product) => (
              <FeatureCard
                key={product.slug}
                title={product.title}
                description={
                  <>
                    <span className="block label-medium text-primary mb-2">
                      {product.tagline}
                    </span>
                    {product.description}
                  </>
                }
                icon={product.icon}
                href={`/produkte/${product.slug}`}
              />
            ))}
          </CardGrid>
        )}
      </div>
    </div>
  );
}
