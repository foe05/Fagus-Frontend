import { getPageBySlug } from '@/lib/wordpress';
import WordPressPageComponent from '@/components/WordPressPage';
import Link from 'next/link';

export const revalidate = 300; // Revalidate every 5 minutes

export default async function TeamWertePage() {
  // Versuche, die Seite von WordPress zu laden
  const wpPage = await getPageBySlug('team-werte');

  // Wenn WordPress-Seite existiert, zeige sie an
  if (wpPage) {
    return (
      <WordPressPageComponent
        page={wpPage}
        showBackButton={true}
        backButtonText="Zurück zu Über uns"
        backButtonHref="/ueber-uns"
      />
    );
  }

  // Fallback: Statische Next.js Seite
  return (
    <div className="pt-[70px] min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary to-primary-light text-white py-20">
        <div className="container-custom">
          <div className="max-w-3xl">
            <Link
              href="/ueber-uns"
              className="inline-flex items-center gap-2 label-large mb-8 opacity-90 hover:opacity-100 transition-opacity"
            >
              <span className="material-symbols-outlined text-[20px]">arrow_back</span>
              <span>Zurück zu Über uns</span>
            </Link>

            <h1 className="display-medium mb-6">Team & Werte</h1>
            <p className="headline-small font-normal opacity-90">
              Die Menschen hinter Broetzens IT Cattles & Cows
            </p>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="py-20 bg-white">
        <div className="container-custom max-w-4xl">
          <h2 className="headline-large text-text-dark mb-6">Unser Team</h2>
          <p className="body-large text-text-medium mb-12">
            Wir sind ein interdisziplinäres Team aus Förstern, Software-Entwicklern und
            Digitalisierungs-Experten. Was uns vereint: Die Leidenschaft für Wald und
            Technologie.
          </p>

          <div className="grid md:grid-cols-2 gap-8 mb-16">
            <div className="p-8 bg-bg-light rounded-2xl">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <span className="material-symbols-outlined text-primary text-[32px]">
                  forest
                </span>
              </div>
              <h3 className="title-large text-text-dark mb-3">Forst-Expertise</h3>
              <p className="body-medium text-text-medium">
                Jahrelange Erfahrung in der Forstwirtschaft bildet die Grundlage für
                praxisnahe Lösungen, die wirklich funktionieren.
              </p>
            </div>

            <div className="p-8 bg-bg-light rounded-2xl">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <span className="material-symbols-outlined text-primary text-[32px]">
                  code
                </span>
              </div>
              <h3 className="title-large text-text-dark mb-3">Tech-Know-how</h3>
              <p className="body-medium text-text-medium">
                Modernste Entwicklungs-Methoden und AI-First Ansatz für
                zukunftssichere Software.
              </p>
            </div>
          </div>

          <h2 className="headline-large text-text-dark mb-6">Unsere Werte</h2>
          <div className="space-y-8">
            {[
              {
                icon: 'eco',
                title: 'Nachhaltigkeit',
                description:
                  'Wir denken langfristig – sowohl in der Technologie als auch im Geschäftsmodell. Unsere Lösungen sollen Generationen überdauern.',
              },
              {
                icon: 'visibility',
                title: 'Transparenz',
                description:
                  'Offene Kommunikation auf Augenhöhe. Wir erklären, was wir tun und warum wir es tun.',
              },
              {
                icon: 'handshake',
                title: 'Partnerschaft',
                description:
                  'Wir sind keine Dienstleister, sondern langfristige Partner. Ihr Erfolg ist unser Erfolg.',
              },
              {
                icon: 'health_and_safety',
                title: 'Verantwortung',
                description:
                  'Wir übernehmen Verantwortung für Wald, Gesellschaft und die nächste Generation.',
              },
            ].map((value) => (
              <div key={value.title} className="flex gap-6">
                <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <span className="material-symbols-outlined text-primary text-[28px]">
                    {value.icon}
                  </span>
                </div>
                <div>
                  <h3 className="title-large text-text-dark mb-2">{value.title}</h3>
                  <p className="body-large text-text-medium">{value.description}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Hinweis für WordPress-Integration */}
          <div className="mt-16 p-6 bg-blue-50 border-l-4 border-blue-500 rounded-r-xl">
            <div className="flex items-start gap-3">
              <span className="material-symbols-outlined text-blue-600 text-[24px] mt-0.5">
                info
              </span>
              <div>
                <h4 className="title-medium text-blue-900 mb-2">
                  WordPress Integration verfügbar
                </h4>
                <p className="body-medium text-blue-800">
                  Diese Seite kann auch aus WordPress geladen werden. Erstelle einfach eine
                  Seite mit dem Slug <code className="bg-blue-100 px-2 py-0.5 rounded">team-werte</code> in
                  WordPress, und der Inhalt wird automatisch hier angezeigt.
                </p>
              </div>
            </div>
          </div>

          {/* CTA */}
          <div className="mt-16 p-8 bg-bg-light rounded-2xl text-center">
            <h3 className="headline-small text-text-dark mb-4">
              Möchten Sie unser Team kennenlernen?
            </h3>
            <p className="body-large text-text-medium mb-6">
              Vereinbaren Sie ein kostenloses Erstgespräch und lernen Sie uns persönlich kennen.
            </p>
            <Link
              href="/kontakt"
              className="inline-flex items-center gap-2 px-8 py-4 bg-primary text-white rounded-full label-large hover:bg-primary-light hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300"
            >
              <span className="material-symbols-outlined">calendar_month</span>
              <span>Termin vereinbaren</span>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
