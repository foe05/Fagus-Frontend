import Link from 'next/link';

export default function HegegemeinschaftManagementPage() {
  return (
    <div className="pt-[70px] min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary to-primary-light text-white py-20">
        <div className="container-custom">
          <div className="max-w-3xl">
            <div className="flex items-center gap-3 mb-6">
              <span className="material-symbols-outlined text-[48px]">pets</span>
              <h1 className="display-medium">Hegegemeinschaft Management</h1>
            </div>
            <p className="headline-small font-normal opacity-90 mb-6">
              Digitale Lösung für revierübergreifendes Wildtiermanagement
            </p>
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined">check_circle</span>
                <span className="label-large">60+ aktive Nutzer</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined">verified</span>
                <span className="label-large">Seit 2022 im Einsatz</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="py-20 bg-white">
        <div className="container-custom max-w-4xl">
          <h2 className="headline-large text-text-dark mb-6">
            Die Herausforderung
          </h2>
          <p className="body-large text-text-medium mb-12">
            Hegegemeinschaften müssen komplexe gesetzliche Vorgaben zur Wildtierbewirtschaftung
            erfüllen. Die manuelle Planung und Dokumentation von Abschussplänen ist zeitaufwändig
            und fehleranfällig. Unsere Lösung automatisiert diese Prozesse und ermöglicht eine
            revierübergreifende, transparente Wildtierverwaltung.
          </p>

          <h2 className="headline-large text-text-dark mb-6">
            Kernfunktionen
          </h2>
          <div className="grid md:grid-cols-2 gap-6 mb-12">
            {[
              {
                icon: 'calculate',
                title: 'Automatische Abschussplanung',
                description: 'Berechnung nach gesetzlichen Vorgaben für alle Wildarten',
              },
              {
                icon: 'phone_iphone',
                title: 'Mobile App',
                description: 'Erlegungen direkt im Revier erfassen und synchronisieren',
              },
              {
                icon: 'sync',
                title: 'Echtzeit-Synchronisation',
                description: 'Alle Daten sind sofort für alle Beteiligten verfügbar',
              },
              {
                icon: 'description',
                title: 'Rechtskonforme Dokumentation',
                description: 'Automatische Generierung aller erforderlichen Nachweise',
              },
              {
                icon: 'analytics',
                title: 'Statistiken & Auswertungen',
                description: 'Detaillierte Analysen zur Wildtierentwicklung',
              },
              {
                icon: 'people',
                title: 'Rechteverwaltung',
                description: 'Flexible Rollen und Zugriffsrechte für alle Nutzer',
              },
            ].map((feature) => (
              <div key={feature.title} className="flex gap-4 p-6 bg-bg-light rounded-xl">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <span className="material-symbols-outlined text-primary">
                    {feature.icon}
                  </span>
                </div>
                <div>
                  <h3 className="title-large text-text-dark mb-2">{feature.title}</h3>
                  <p className="body-medium text-text-medium">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>

          <h2 className="headline-large text-text-dark mb-6">
            Technologie
          </h2>
          <p className="body-large text-text-medium mb-6">
            Die Plattform wurde mit modernen Web-Technologien entwickelt und nutzt
            AI-gestützte Algorithmen für die Abschussplanung. Die mobile App funktioniert
            auch offline und synchronisiert Daten, sobald eine Internetverbindung besteht.
          </p>
          <ul className="space-y-3 mb-12">
            {[
              'Progressive Web App (PWA) für alle Endgeräte',
              'Cloud-basierte Infrastruktur für hohe Verfügbarkeit',
              'DSGVO-konformes Hosting in Deutschland',
              'Automatische Backups und Versionierung',
            ].map((tech, index) => (
              <li key={index} className="body-large text-text-medium flex items-start gap-3">
                <span className="text-green-600 mt-1">✓</span>
                <span>{tech}</span>
              </li>
            ))}
          </ul>

          {/* Testimonial */}
          <div className="bg-primary/5 border-l-4 border-primary p-8 rounded-r-xl mb-12">
            <p className="body-large text-text-dark italic mb-4">
              &ldquo;Die Software hat unsere Verwaltung revolutioniert. Was früher Tage gedauert hat,
              erledigen wir jetzt in Minuten. Und die Datenqualität ist deutlich besser.&rdquo;
            </p>
            <p className="label-large text-text-medium">
              — Hegegemeinschaftsleiter, 12 Reviere
            </p>
          </div>

          {/* CTA */}
          <div className="mt-16 p-8 bg-bg-light rounded-2xl text-center">
            <h3 className="headline-small text-text-dark mb-4">
              Interesse an Hegegemeinschaft Management?
            </h3>
            <p className="body-large text-text-medium mb-6">
              Vereinbaren Sie eine kostenlose Demo und erleben Sie die Software in Aktion.
            </p>
            <Link
              href="/kontakt"
              className="inline-flex items-center gap-2 px-8 py-4 bg-primary text-white rounded-full label-large hover:bg-primary-light hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300"
            >
              <span className="material-symbols-outlined">calendar_month</span>
              <span>Demo vereinbaren</span>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
