import Link from 'next/link';

const products = [
  {
    title: 'Hegegemeinschaft Management',
    slug: 'hegegemeinschaft-management',
    icon: 'pets',
    tagline: '60+ aktive Nutzer',
    description: 'Digitale Lösung für revierübergreifendes Wildtiermanagement',
    features: [
      'Automatische Abschussplanung nach gesetzlichen Vorgaben',
      'Mobile App für Jäger im Revier',
      'Echtzeit-Datenerfassung und Auswertung',
      'Rechtskonforme Dokumentation',
    ],
    status: 'live',
  },
  {
    title: 'Erdmassenberechnung',
    slug: 'erdmassenberechnung',
    icon: 'terrain',
    tagline: 'Forststraßenbau optimiert',
    description: 'Präzise Berechnung von Erdmassen für Forststraßenprojekte',
    features: [
      'Digitale Geländemodellierung',
      'Automatische Volumenberechnung',
      'Kostenplanung und Optimierung',
      'Integration mit GIS-Systemen',
    ],
    status: 'live',
  },
  {
    title: 'Hosting & Support',
    slug: 'hosting',
    icon: 'cloud',
    tagline: 'Sicher und zuverlässig',
    description: 'Professionelles Hosting für Forst-Anwendungen',
    features: [
      'Hochverfügbare Infrastruktur',
      'Automatische Backups',
      '24/7 Monitoring',
      'DSGVO-konformes Hosting in Deutschland',
    ],
    status: 'live',
  },
];

export default function ProduktePage() {
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
          {products.map((product) => (
            <Link
              key={product.slug}
              href={`/produkte/${product.slug}`}
              className="group bg-white rounded-2xl overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
            >
              {/* Header */}
              <div className="bg-gradient-to-br from-primary to-primary-light p-6 text-white">
                <div className="flex items-start justify-between mb-4">
                  <span className="material-symbols-outlined text-[48px]">
                    {product.icon}
                  </span>
                  {product.status === 'live' && (
                    <span className="px-3 py-1 bg-green-500 text-white rounded-full label-small">
                      LIVE
                    </span>
                  )}
                </div>
                <h2 className="headline-small mb-2">{product.title}</h2>
                <p className="body-small opacity-90">{product.tagline}</p>
              </div>

              {/* Content */}
              <div className="p-6">
                <p className="body-medium text-text-medium mb-6">
                  {product.description}
                </p>

                <ul className="space-y-3 mb-6">
                  {product.features.map((feature, index) => (
                    <li key={index} className="body-small text-text-medium flex items-start gap-2">
                      <span className="text-green-600 mt-0.5">✓</span>
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>

                <div className="flex items-center gap-2 label-medium text-primary">
                  <span>Details ansehen</span>
                  <span className="material-symbols-outlined text-[18px] group-hover:translate-x-1 transition-transform">
                    arrow_forward
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
