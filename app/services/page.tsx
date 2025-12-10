import Link from 'next/link';

const services = [
  {
    title: 'Digitalisierungs-Strategie',
    slug: 'digitalisierungsstrategie',
    icon: 'rocket_launch',
    description: 'Strategische Beratung für digitale Transformation in Forstbetrieben',
    features: [
      'Analyse der aktuellen Prozesse',
      'Entwicklung einer Digitalisierungs-Roadmap',
      'Technologie-Auswahl und Bewertung',
      'Change Management Begleitung',
    ],
  },
  {
    title: 'Prozessoptimierung & Automatisierung',
    slug: 'prozessoptimierung-automatisierung',
    icon: 'settings_suggest',
    description: 'Effizienzsteigerung durch intelligente Automatisierung',
    features: [
      'Prozessanalyse und Optimierung',
      'Workflow-Automatisierung',
      'Integration bestehender Systeme',
      'KI-gestützte Lösungen',
    ],
  },
  {
    title: 'Change Management',
    slug: 'change-management',
    icon: 'groups',
    description: 'Erfolgreiche Einführung neuer Technologien im Team',
    features: [
      'Schulungen und Workshops',
      'Stakeholder Management',
      'Begleitung der Transformation',
      'Kontinuierliche Verbesserung',
    ],
  },
  {
    title: 'Prototyping & MVP',
    slug: 'prototyping-mvp',
    icon: 'science',
    description: 'Schnelle Entwicklung von Prototypen und Minimal Viable Products',
    features: [
      'Rapid Prototyping',
      'User Testing',
      'Iterative Entwicklung',
      'Product-Market Fit',
    ],
  },
];

export default function ServicesPage() {
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
          {services.map((service) => (
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

              <ul className="space-y-3">
                {service.features.map((feature, index) => (
                  <li key={index} className="body-medium text-text-medium flex items-start gap-3">
                    <span className="text-green-600 mt-0.5">✓</span>
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>

              <div className="mt-6 flex items-center gap-2 label-large text-primary">
                <span>Mehr erfahren</span>
                <span className="material-symbols-outlined text-[20px] group-hover:translate-x-1 transition-transform">
                  arrow_forward
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
