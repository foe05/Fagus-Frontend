import Link from 'next/link';

export default function DigitalisierungsStrategiePage() {
  return (
    <div className="pt-[70px] min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary to-primary-light text-white py-20">
        <div className="container-custom">
          <div className="max-w-3xl">
            <div className="flex items-center gap-3 mb-6">
              <span className="material-symbols-outlined text-[48px]">rocket_launch</span>
              <h1 className="display-medium">Digitalisierungs-Strategie</h1>
            </div>
            <p className="headline-small font-normal opacity-90">
              Strategische Beratung für digitale Transformation in Forstbetrieben
            </p>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="py-20 bg-white">
        <div className="container-custom max-w-4xl">
          <div className="prose prose-lg max-w-none">
            <h2 className="headline-large text-text-dark mb-6">
              Warum Digitalisierung im Forstbetrieb?
            </h2>
            <p className="body-large text-text-medium mb-8">
              Die Digitalisierung verändert die Forstwirtschaft grundlegend. Von der
              Waldbewirtschaftung über die Holzernte bis zur Vermarktung – digitale
              Werkzeuge ermöglichen effizientere Prozesse, bessere Entscheidungen und
              nachhaltigeres Handeln.
            </p>

            <h3 className="headline-medium text-text-dark mb-4 mt-12">
              Unser Ansatz
            </h3>
            <div className="grid md:grid-cols-2 gap-8 mb-12">
              {[
                {
                  title: '1. Analyse',
                  description: 'Wir analysieren Ihre aktuellen Prozesse und identifizieren Optimierungspotenziale.',
                  icon: 'analytics',
                },
                {
                  title: '2. Strategie',
                  description: 'Gemeinsam entwickeln wir eine maßgeschneiderte Digitalisierungs-Roadmap.',
                  icon: 'map',
                },
                {
                  title: '3. Umsetzung',
                  description: 'Wir begleiten Sie bei der Implementierung und Integration neuer Technologien.',
                  icon: 'build',
                },
                {
                  title: '4. Optimierung',
                  description: 'Kontinuierliche Verbesserung und Anpassung an neue Anforderungen.',
                  icon: 'tune',
                },
              ].map((step) => (
                <div key={step.title} className="flex gap-4">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <span className="material-symbols-outlined text-primary">
                      {step.icon}
                    </span>
                  </div>
                  <div>
                    <h4 className="title-large text-text-dark mb-2">{step.title}</h4>
                    <p className="body-medium text-text-medium">{step.description}</p>
                  </div>
                </div>
              ))}
            </div>

            <h3 className="headline-medium text-text-dark mb-4 mt-12">
              Ihre Vorteile
            </h3>
            <ul className="space-y-3 mb-12">
              {[
                'Langfristige Strategie statt Ad-hoc Lösungen',
                'Praxisorientierte Beratung von Experten mit Forst-Know-how',
                'AI-First Ansatz für moderne, zukunftssichere Lösungen',
                'Begleitung von der Planung bis zur erfolgreichen Umsetzung',
                'Schulung und Befähigung Ihrer Mitarbeiter',
              ].map((benefit, index) => (
                <li key={index} className="body-large text-text-medium flex items-start gap-3">
                  <span className="text-green-600 mt-1">✓</span>
                  <span>{benefit}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* CTA */}
          <div className="mt-16 p-8 bg-bg-light rounded-2xl text-center">
            <h3 className="headline-small text-text-dark mb-4">
              Bereit für die digitale Transformation?
            </h3>
            <p className="body-large text-text-medium mb-6">
              Vereinbaren Sie ein kostenloses Erstgespräch und erfahren Sie,
              wie wir Ihren Forstbetrieb digitalisieren können.
            </p>
            <Link
              href="/kontakt"
              className="inline-flex items-center gap-2 px-8 py-4 bg-primary text-white rounded-full label-large hover:bg-primary-light hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300"
            >
              <span className="material-symbols-outlined">call</span>
              <span>Jetzt Kontakt aufnehmen</span>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
