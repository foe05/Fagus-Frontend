import Link from 'next/link';
import Image from 'next/image';
import { getChildPages, stripHtml, getFeaturedImage } from '@/lib/wordpress';

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

export default async function ProduktePage() {
  const wpChildren = await getChildPages('produkte');

  return (
    <div className="pt-[70px] min-h-screen bg-bg-light">
      <div className="container-custom py-20">
        {/* Header */}
        <div className="max-w-3xl mb-16">
          <h1 className="display-medium text-text-dark mb-6">
            Unsere Produkte
          </h1>
          <p className="body-large text-text-medium">
            Bewährte Lösungen für die moderne Forstwirtschaft. Entwickelt mit
            AI-First Ansatz und erprobt in der Praxis.
          </p>
        </div>

        {/* Products Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {wpChildren.length > 0 ? (
            wpChildren.map((page) => {
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
            })
          ) : (
            fallbackProducts.map((product) => (
              <Link
                key={product.slug}
                href={`/produkte/${product.slug}`}
                className="group bg-white rounded-2xl overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
              >
                <div className="bg-gradient-to-br from-primary to-primary-light p-6 text-white">
                  <div className="flex items-start mb-4">
                    <span className="material-symbols-outlined text-[48px]">
                      {product.icon}
                    </span>
                  </div>
                  <h2 className="headline-small mb-2">{product.title}</h2>
                  <p className="body-small opacity-90">{product.tagline}</p>
                </div>
                <div className="p-6">
                  <p className="body-medium text-text-medium mb-6">
                    {product.description}
                  </p>
                  <div className="flex items-center gap-2 label-medium text-primary">
                    <span>Details ansehen</span>
                    <span className="material-symbols-outlined text-[18px] group-hover:translate-x-1 transition-transform">
                      arrow_forward
                    </span>
                  </div>
                </div>
              </Link>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
