import { PageHero, Section, CardGrid, FeatureCard, FinalCTA, ContentContainer } from '@/components/ui';

export default function DigitalisierungsStrategiePage() {
  return (
    <div className="pt-[70px] min-h-screen">
      <PageHero
        title="Digitalisierungs-Strategie"
        subtitle="Strategische Beratung für digitale Transformation in Forstbetrieben"
        backHref="/services"
        backLabel="Zurück zu Services"
        icon="rocket_launch"
      />

      <Section tone="default">
        <ContentContainer size="md">
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
            <div className="mb-12">
              <CardGrid columns={2} gap="lg">
                {[
                  {
                    title: '1. Analyse',
                    description: 'Wir analysieren deine aktuellen Prozesse und identifizieren Optimierungspotenziale.',
                    icon: 'analytics',
                  },
                  {
                    title: '2. Strategie',
                    description: 'Gemeinsam entwickeln wir eine maßgeschneiderte Digitalisierungs-Roadmap.',
                    icon: 'map',
                  },
                  {
                    title: '3. Umsetzung',
                    description: 'Wir begleiten dich bei der Implementierung und Integration neuer Technologien.',
                    icon: 'build',
                  },
                  {
                    title: '4. Optimierung',
                    description: 'Kontinuierliche Verbesserung und Anpassung an neue Anforderungen.',
                    icon: 'tune',
                  },
                ].map((step) => (
                  <FeatureCard
                    key={step.title}
                    title={step.title}
                    description={step.description}
                    icon={step.icon}
                  />
                ))}
              </CardGrid>
            </div>

            <h3 className="headline-medium text-text-dark mb-4 mt-12">
              Deine Vorteile
            </h3>
            <ul className="space-y-3 mb-12">
              {[
                'Langfristige Strategie statt Ad-hoc Lösungen',
                'Praxisorientierte Beratung von Experten mit Forst-Know-how',
                'AI-First Ansatz für moderne, zukunftssichere Lösungen',
                'Begleitung von der Planung bis zur erfolgreichen Umsetzung',
                'Schulung und Befähigung deiner Mitarbeiter',
              ].map((benefit, index) => (
                <li key={index} className="body-large text-text-medium flex items-start gap-3">
                  <span className="text-green-600 mt-1">✓</span>
                  <span>{benefit}</span>
                </li>
              ))}
            </ul>
          </div>
        </ContentContainer>
      </Section>

      <FinalCTA
        title="Bereit für die digitale Transformation?"
        description="Vereinbare ein kostenloses Erstgespräch und erfahre, wie wir deinen Forstbetrieb digitalisieren können."
        primaryCta={{ label: 'Jetzt Kontakt aufnehmen', href: '/kontakt' }}
      />
    </div>
  );
}
