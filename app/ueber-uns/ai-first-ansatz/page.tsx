import { getPageBySlug } from '@/lib/wordpress';
import WordPressPageComponent from '@/components/WordPressPage';
import { PageHero, Section, FinalCTA, ContentContainer } from '@/components/ui';

export const revalidate = 300;

export async function generateMetadata() {
  const wpPage = await getPageBySlug('ai-first-ansatz');

  if (wpPage) {
    const title = wpPage.title.rendered.replace(/<[^>]*>/g, '');
    const description = wpPage.excerpt.rendered.replace(/<[^>]*>/g, '').trim();
    return {
      title: `${title} - Broetzens IT`,
      ...(description && { description }),
    };
  }

  return {
    title: 'AI-First Ansatz - Broetzens IT',
    description:
      'KI ist kein Werkzeug, sondern eine andere Art zu arbeiten. Wie wir KI und menschliches Urteil bei Broetzens IT verbinden.',
  };
}

export default async function AiFirstAnsatzPage() {
  const wpPage = await getPageBySlug('ai-first-ansatz');

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

  return (
    <div className="pt-[70px] min-h-screen">
      <PageHero
        title="KI ist kein Werkzeug. Sie ist eine andere Art zu arbeiten."
        subtitle="Künstliche Intelligenz ist keine Mode. Sie ist gekommen, um zu bleiben — so selbstverständlich wie E-Mail oder GPS."
        backHref="/ueber-uns"
        backLabel="Zurück zu Über uns"
      />

      {/* Intro */}
      <Section tone="default">
        <ContentContainer size="sm">
          <p className="body-large text-text-medium mb-6">
            Die Frage ist nicht mehr, ob sie unsere Arbeit verändert, sondern wie wir
            damit umgehen.
          </p>
          <p className="body-large text-text-medium">
            Viele Beratungen behandeln KI wie ein zusätzliches Tool: ChatGPT hier, ein
            Agent da, ansonsten weiter wie bisher. Wir halten das für einen Denkfehler.
            KI ist keine neue Werkbank in der alten Werkstatt. Sie ist eine andere Art
            zu arbeiten.
          </p>
        </ContentContainer>
      </Section>

      {/* Was das bei uns heißt */}
      <Section tone="light">
        <ContentContainer size="sm">
          <h2 className="headline-large text-text-dark mb-6">Was das bei uns heißt</h2>
          <p className="body-large text-text-medium mb-6">
            In unserem Büro arbeitet ein Team aus KI-Agenten mit. Sie recherchieren,
            strukturieren Daten, bereiten Entwürfe vor, beobachten Fachpublikationen,
            unterstützen GIS-Analysen. Das ist kein Experiment am Rand — das ist der
            Alltag. Dadurch können wir als Beratung Dinge leisten, die eine klassische
            Einzelkanzlei nicht leisten könnte: in Tempo, Tiefe und Breite.
          </p>
          <p className="body-large text-text-medium">
            Parallel bauen wir das Team mit Menschen auf. Die erste Einstellung steht
            bevor.
          </p>
        </ContentContainer>
      </Section>

      {/* Je mächtiger die KI */}
      <Section tone="default">
        <ContentContainer size="sm">
          <h2 className="headline-large text-text-dark mb-6">
            Je mächtiger die KI, desto wichtiger der Mensch
          </h2>
          <p className="body-large text-text-medium mb-6">
            Das klingt paradox. Ist es aber nicht. Wenn Maschinen schneller
            recherchieren, besser zusammenfassen und günstiger produzieren, verschiebt
            sich der Wert menschlicher Arbeit. Er liegt dann nicht mehr im Abarbeiten,
            sondern im Urteilen.
          </p>
          <p className="body-large text-text-medium mb-10">
            Ein KI-Agent kann einen Digitalisierungsplan für einen 2.000-Hektar-Forstbetrieb
            entwerfen. Aber er kann nicht mit dem Revierleiter in der Einschlagsfläche
            stehen, die Unsicherheit im Gesicht lesen und entscheiden, welches Tempo
            die Mannschaft mitträgt. Er kann Datenflüsse modellieren. Aber er kennt
            nicht den Druck eines Waldbesitzers, der seit drei Generationen dasselbe
            Familienunternehmen führt.
          </p>

          {/* Highlight: Leitsatz */}
          <blockquote className="border-l-4 border-primary bg-primary/5 p-8 rounded-r-xl">
            <p className="headline-small text-text-dark mb-3">
              Deshalb gilt in jedem Projekt bei uns:
            </p>
            <p className="headline-medium text-primary font-medium">
              Die KI macht die Vorarbeit. Der Mensch macht den Abschluss.
            </p>
          </blockquote>

          <p className="body-large text-text-medium mt-10">
            Jede Empfehlung, jedes Konzept, jede Kommunikation mit dir geht durch
            unsere Köpfe — unsere und die unserer Kolleginnen und Kollegen.
            Nichts verlässt das Haus, was nicht fachlich und persönlich verantwortet
            wurde.
          </p>
        </ContentContainer>
      </Section>

      {/* Was du davon hast */}
      <Section tone="light">
        <ContentContainer size="sm">
          <h2 className="headline-large text-text-dark mb-6">Was du davon hast</h2>
          <p className="body-large text-text-medium mb-6">
            Du bekommst die Geschwindigkeit eines größeren Beratungshauses — zu den
            Preisen und mit der Nähe einer Boutique. Keine generierten Textbausteine.
            Keine austauschbaren Konzepte. Stattdessen Analysen, die deine Situation
            ernst nehmen, und Entscheidungen, die ein Mensch gegenüber einem anderen
            Menschen begründen kann.
          </p>
          <p className="body-large text-text-medium">
            Das ist aus unserer Sicht die einzige Art, wie man heute verantwortlich
            digitalisiert: mit der vollen Leistung der Maschinen und der vollen
            Verantwortung von Menschen.
          </p>
        </ContentContainer>
      </Section>

      <FinalCTA
        title="Reden wir darüber"
        description="Wenn du wissen willst, was dieser Ansatz konkret für deinen Betrieb bedeuten könnte, lade uns zu einem Gespräch ein. Keine Verkaufspräsentation, keine Pitch-Schleife. Eine halbe Stunde, in der wir gemeinsam schauen, ob es passt."
        primaryCta={{ label: 'Gesprächstermin vereinbaren', href: '/kontakt' }}
      />
    </div>
  );
}
