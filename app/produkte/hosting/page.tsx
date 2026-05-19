import { getPageBySlug } from '@/lib/wordpress';
import WordPressPageComponent from '@/components/WordPressPage';
import {
  PageHero,
  Section,
  CardGrid,
  FeatureCard,
  FinalCTA,
  ContentContainer,
} from '@/components/ui';

export const revalidate = 300;

export async function generateMetadata() {
  const wpPage = await getPageBySlug('hosting');

  if (wpPage) {
    const title = wpPage.title.rendered.replace(/<[^>]*>/g, '');
    const description = wpPage.excerpt.rendered.replace(/<[^>]*>/g, '').trim();
    return {
      title: `${title} - Produkte - Broetzens IT`,
      ...(description && { description }),
    };
  }

  return {
    title: 'Hosting - Produkte - Broetzens IT',
    description:
      'Individuell gestaltetes Hosting für Webseiten, Mailserver und Microservices. Server in Deutschland und der EU, DSGVO-konform, mit festem Ansprechpartner.',
  };
}

export default async function HostingPage() {
  const wpPage = await getPageBySlug('hosting');

  if (wpPage) {
    return (
      <WordPressPageComponent
        page={wpPage}
        showBackButton={true}
        backButtonText="Zurück zu Produkte"
        backButtonHref="/produkte"
      />
    );
  }

  const hostingCategories = [
    {
      icon: 'language',
      title: 'Webseiten',
      description:
        'Von WordPress und statischen Sites bis zu Headless-Setups mit modernem Frontend. Ob einfache Visitenkartenseite oder Portal mit Mitgliederbereich und individuellen Funktionen.',
    },
    {
      icon: 'mail',
      title: 'Mailserver',
      description:
        'Eigene E-Mail-Infrastruktur unter deiner Domain. Mit sauber eingerichtetem SPF, DKIM und DMARC, Spam- und Virenschutz, optional Kalender- und Kontaktsynchronisation.',
    },
    {
      icon: 'apps',
      title: 'Microservices',
      description:
        'Selbst gehostete Tools wie Nextcloud, Paperless-ngx, ERPNext, n8n oder individuelle Anwendungen. Auch für geodatenbezogene Aufgaben (QGIS-Server, GIS-Backends, Forstdatenbanken).',
    },
  ];

  const perspectives = [
    {
      icon: 'forest',
      title: 'Branchenwissen aus der Praxis',
      description:
        'Wir sind Förster von Haus aus und haben über Jahre an Forst- und GIS-Software mitentwickelt. Hegegemeinschaften, Forstverwaltungen, Landnutzer — deren Prozesse, Daten und Anforderungen sind uns vertraut. Für KMU außerhalb der Branche gilt dasselbe Prinzip: Wir nehmen uns die Zeit, dein Geschäft zu verstehen, bevor wir Technik vorschlagen.',
    },
    {
      icon: 'architecture',
      title: 'Passgenaue Architektur',
      description:
        'Hosting ist mehr als ein Server. Es ist die Frage, welche Dienste zusammenspielen, wie sie skalieren, wo Schnittstellen sitzen und was automatisiert werden kann. Unsere Empfehlungen beruhen auf Erfahrung mit realen Projekten, nicht auf Produktkatalogen.',
    },
    {
      icon: 'verified_user',
      title: 'DSGVO und Datensouveränität',
      description:
        'Unsere Server stehen in Deutschland und der EU. Wir klären Auftragsverarbeitung sauber, dokumentieren die Verarbeitungsschritte und achten darauf, dass Dienste DSGVO-konform eingerichtet sind — gerade, wenn öffentliche Verwaltungen oder sensible Daten im Spiel sind.',
    },
  ];

  const deliverables = [
    'Eine Bestandsaufnahme deiner aktuellen Situation',
    'Einen Lösungsvorschlag mit Architektur, Kostenrahmen und Umsetzungsplan',
    'Einrichtung und Betrieb inklusive Updates, Monitoring und Backup',
    'Einen festen Ansprechpartner, der deine Umgebung kennt',
  ];

  return (
    <div className="pt-[70px] min-h-screen">
      <PageHero
        title="Hosting"
        subtitle="Ein Hosting-Angebot, das mit einer Frage beginnt: Was soll das Ganze eigentlich tun?"
        backHref="/produkte"
        backLabel="Zurück zu Produkte"
        icon="dns"
      />

      {/* Hero-Badges */}
      <section className="bg-primary text-white py-6 border-t border-white/10">
        <div className="container-custom">
          <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-3">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined">public</span>
              <span className="label-large">Server in Deutschland & EU</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined">verified</span>
              <span className="label-large">DSGVO-konform</span>
            </div>
          </div>
        </div>
      </section>

      {/* Intro */}
      <Section tone="default">
        <ContentContainer size="sm">
          <p className="body-large text-text-medium">
            Bevor ein Server konfiguriert, eine Domain aufgesetzt oder ein Mailserver
            eingerichtet wird, steht bei uns das Gespräch. Welche Prozesse stehen
            dahinter? Wer arbeitet damit? Welche Daten fließen wohin, und wer darf was
            sehen? Aus diesen Antworten entsteht ein Hosting-Setup, das zu deinem
            Betrieb passt — nicht zum Standardprodukt eines Anbieters.
          </p>
        </ContentContainer>
      </Section>

      {/* Was wir hosten */}
      <Section tone="light">
        <div className="text-center mb-12">
          <h2 className="headline-large text-text-dark">
            Was wir hosten
          </h2>
        </div>
        <CardGrid columns={3} gap="md">
          {hostingCategories.map((cat) => (
            <FeatureCard
              key={cat.title}
              title={cat.title}
              description={cat.description}
              icon={cat.icon}
            />
          ))}
        </CardGrid>
      </Section>

      {/* Beraterkompetenz */}
      <Section tone="default">
        <ContentContainer size="md">
          <h2 className="headline-large text-text-dark mb-4">
            Beraterkompetenz: Drei Perspektiven, die zusammengehören
          </h2>
          <div className="space-y-8 mt-10">
            {perspectives.map((item) => (
              <div key={item.title} className="flex gap-6">
                <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <span className="material-symbols-outlined text-primary text-[28px]">
                    {item.icon}
                  </span>
                </div>
                <div>
                  <h3 className="title-large text-text-dark mb-2">{item.title}</h3>
                  <p className="body-large text-text-medium">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </ContentContainer>
      </Section>

      {/* Was du konkret bekommst */}
      <Section tone="light">
        <ContentContainer size="sm">
          <h2 className="headline-large text-text-dark mb-8">
            Was du konkret bekommst
          </h2>
          <ul className="space-y-4">
            {deliverables.map((item, i) => (
              <li key={i} className="flex items-start gap-4 p-5 bg-white rounded-xl">
                <span className="material-symbols-outlined text-primary flex-shrink-0 mt-0.5">
                  check_circle
                </span>
                <span className="body-large text-text-dark">{item}</span>
              </li>
            ))}
          </ul>
        </ContentContainer>
      </Section>

      {/* Ehrlich gesagt — custom callout */}
      <Section tone="default">
        <ContentContainer size="sm">
          <div className="border-l-4 border-primary bg-primary/5 p-8 rounded-r-xl">
            <div className="flex items-center gap-3 mb-4">
              <span className="material-symbols-outlined text-primary text-[28px]">
                waving_hand
              </span>
              <h2 className="headline-small text-text-dark m-0">Ehrlich gesagt</h2>
            </div>
            <p className="body-large text-text-medium">
              Wir sind ein kleines Team, keine Hosting-Firma mit 24/7-Callcenter. Das
              hat Vor- und Nachteile. Der Vorteil: Du bekommst direkten Kontakt und
              individuelle Lösungen. Der Nachteil: Bei einem Notfall um drei Uhr
              nachts erreichst du uns vermutlich nicht sofort. Für die allermeisten
              Anwendungsfälle kleiner und mittlerer Betriebe reicht das aus — wenn
              nicht, sagen wir das rechtzeitig im Vorgespräch.
            </p>
          </div>
        </ContentContainer>
      </Section>

      <FinalCTA
        title="Lass uns sprechen"
        description="Beschreib uns kurz, worum es geht — wir melden uns innerhalb von zwei Werktagen zurück."
        primaryCta={{ label: 'Zum Kontaktformular', href: '/kontakt' }}
      />
    </div>
  );
}
