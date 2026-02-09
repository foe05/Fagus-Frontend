import Link from 'next/link';
import Image from 'next/image';
import { getChildPages, stripHtml, getFeaturedImage } from '@/lib/wordpress';

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

export default async function ServicesPage() {
  const wpChildren = await getChildPages('services');

  return (
    <div className="pt-[70px] min-h-screen bg-bg-light">
      <div className="container-custom py-20">
        {/* Header */}
        <div className="max-w-3xl mb-16">
          <h1 className="display-medium text-text-dark mb-6">
            Unsere Services
          </h1>
          <p className="body-large text-text-medium">
            AI-First Beratung und Entwicklung für Forstbetriebe. Wir begleiten Sie
            von der Strategie bis zur erfolgreichen Umsetzung.
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid md:grid-cols-2 gap-8">
          {wpChildren.length > 0 ? (
            wpChildren.map((page) => {
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
            })
          ) : (
            fallbackServices.map((service) => (
              <Link
                key={service.slug}
                href={`/services/${service.slug}`}
                className="group bg-white rounded-2xl p-8 hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
              >
                <div className="flex items-start gap-4 mb-6">
                  <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 group-hover:bg-primary/20 transition-colors">
                    <span className="material-symbols-outlined text-primary text-[28px]">
                      {service.icon}
                    </span>
                  </div>
                  <h2 className="headline-small text-text-dark group-hover:text-primary transition-colors">
                    {service.title}
                  </h2>
                </div>
                <p className="body-large text-text-medium mb-6">
                  {service.description}
                </p>
                <div className="mt-6 flex items-center gap-2 label-large text-primary">
                  <span>Mehr erfahren</span>
                  <span className="material-symbols-outlined text-[20px] group-hover:translate-x-1 transition-transform">
                    arrow_forward
                  </span>
                </div>
              </Link>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
