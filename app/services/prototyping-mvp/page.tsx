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
  const wpPage = await getPageBySlug('prototyping-mvp');

  if (wpPage) {
    const title = wpPage.title.rendered.replace(/<[^>]*>/g, '');
    const description = wpPage.excerpt.rendered.replace(/<[^>]*>/g, '').trim();
    return {
      title: `${title} - Services - Broetzens IT`,
      ...(description && { description }),
    };
  }

  return {
    title: 'Prototyping & MVP - Services - Broetzens IT',
    description:
      'Vom Problem zur testbaren Lösung — ein funktionierender Prototyp oder MVP, bevor du in ein großes Entwicklungsbudget investierst. Design Thinking trifft Lean Startup.',
  };
}

export default async function PrototypingMvpPage() {
  const wpPage = await getPageBySlug('prototyping-mvp');

  if (wpPage) {
    return (
      <WordPressPageComponent
        page={wpPage}
        showBackButton={true}
        backButtonText="Zurück zu Services"
        backButtonHref="/services"
      />
    );
  }

  const approach = [
    {
      icon: 'psychology',
      title: 'Verstehen statt vermuten',
      description:
        'Gespräche mit den Menschen, die später mit der Lösung arbeiten – im Wald, im Büro, auf der Fläche.',
    },
    {
      icon: 'visibility',
      title: 'Schnell sichtbar machen',
      description:
        'Skizzen, Klickdummys oder funktionale Prototypen – je nachdem, was in deiner Situation tragfähig ist.',
    },
    {
      icon: 'analytics',
      title: 'Messbar lernen',
      description:
        'Jede Iteration hat eine Hypothese und ein Kriterium, an dem sich erkennen lässt, ob sie stimmt.',
    },
    {
      icon: 'handshake',
      title: 'Gemeinsam entscheiden',
      description:
        'Nach jedem Zyklus steht fest, ob weitergebaut, umgeschwenkt oder gestoppt wird.',
    },
  ];

  const steps = [
    {
      number: '1',
      title: 'Problem-Framing',
      description:
        '1–2 Workshops: Wo drückt der Schuh wirklich? Was ist Symptom, was Ursache?',
    },
    {
      number: '2',
      title: 'Nutzer- und Kontextrecherche',
      description: 'Feldgespräche, Blick in bestehende Daten und Prozesse.',
    },
    {
      number: '3',
      title: 'Ideenfindung und Auswahl',
      description: 'Mehrere Ansätze werden geprüft, einer wird durchgespielt.',
    },
    {
      number: '4',
      title: 'Prototyp bauen',
      description:
        'Vom Papier-Mockup über Figma bis zum lauffähigen MVP – so viel wie nötig, so wenig wie möglich.',
    },
    {
      number: '5',
      title: 'Testen und Entscheidung',
      description:
        'Realer Einsatz, Feedback, klare Entscheidung über die nächsten Schritte.',
    },
  ];

  const whenWorthwhile = [
    'Du überlegst, ein Fachverfahren zu digitalisieren und willst das Risiko reduzieren.',
    'Du hast eine Prozessidee, weißt aber noch nicht, ob sie im Alltag funktioniert.',
    'Du möchtest für einen Förderantrag (z. B. DISTR@L, Digital Jetzt) etwas Belastbares vorlegen.',
    'Du hast eine fachliche Anforderung und brauchst jemanden, der Forst-, GIS- oder Flächenwissen mitbringt und trotzdem Code schreiben kann.',
  ];

  const deliverables = [
    'Ein getesteter Prototyp oder MVP, den du Kunden, Gremien oder dem Team zeigen kannst',
    'Eine dokumentierte Entscheidungsgrundlage: Was hat funktioniert, was nicht, wie geht es weiter',
    'Klarheit über Aufwand und Machbarkeit der nächsten Ausbaustufe',
  ];

  const cases = [
    {
      title: 'Windpark-Erdmassen-Rechner',
      subtitle: 'QGIS-Plugin für die Windenergie-Planung',
      starting:
        'Bei der Planung von Zuwegungen und Kranstellflächen für Windenergieanlagen müssen Erdbewegungen geschätzt werden. In frühen Planungsphasen ist diese Abschätzung oft aufwendig und greift auf grobe Pauschalen zurück.',
      approach:
        'In kurzen Iterationen entstand ein QGIS-Plugin, das auf Basis von Polygongeometrien und Geländemodellen automatisch Querschnittsprofile erzeugt und Massenbilanzen berechnet. Nach jeder Ausbaustufe – erst nur Volumenberechnung, dann Profilvisualisierung, dann HTML-Report – wurde gemeinsam entschieden, was als Nächstes sinnvoll ist.',
      result:
        'Ein Werkzeug, das belastbare Zahlen für Machbarkeitsprüfung und Ausschreibung liefert, ohne dass vorab ein vollständiges Lastenheft formuliert werden musste.',
    },
    {
      title: 'Hegegemeinschaftsmanagement',
      subtitle: 'WordPress-Plugin für Jagdverbände',
      starting:
        'Hegegemeinschaften verwalten Mitglieder, Reviere und die jährliche Meldung an Behörden häufig in gewachsenen Excel-Dateien. Das funktioniert, skaliert aber schlecht und ist fehleranfällig.',
      approach:
        'Statt direkt ein vollständiges System zu bauen, wurde mit einem einzelnen Pilotkunden ein WordPress-Plugin in klar abgegrenzten Ausbaustufen entwickelt. Jede Stufe wurde im echten Betrieb eingesetzt, bevor die nächste geplant wurde – inklusive schnellem Nachsteuern, als sich beim CSV-Export ein Fehler im Feldeinsatz zeigte.',
      result:
        'Ein laufend genutztes Plugin, das heute über mehrere Hegegemeinschaften im Einsatz ist und durch die iterative Entwicklung tatsächlich zu den Arbeitsabläufen der Nutzenden passt.',
    },
  ];

  return (
    <div className="pt-[70px] min-h-screen">
      <PageHero
        title="Prototyping & MVP"
        subtitle="Vom Problem zur testbaren Lösung — bevor du in ein großes Entwicklungsbudget investierst."
        backHref="/services"
        backLabel="Zurück zu Services"
        icon="science"
      />

      {/* Hero-Badges */}
      <section className="bg-primary text-white py-6 border-t border-white/10">
        <div className="container-custom">
          <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-3">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined">psychology_alt</span>
              <span className="label-large">Design Thinking + Lean Startup</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined">rocket_launch</span>
              <span className="label-large">Erste Ergebnisse in wenigen Wochen</span>
            </div>
          </div>
        </div>
      </section>

      {/* Intro */}
      <Section tone="default">
        <ContentContainer size="sm">
          <p className="body-large text-text-medium">
            Gemeinsam mit dir entsteht ein funktionierender Prototyp oder ein MVP.
            So weißt du früh, ob deine Idee trägt – ohne Monate in die falsche
            Richtung zu laufen.
          </p>
        </ContentContainer>
      </Section>

      {/* Warum ein Prototyp am Anfang steht */}
      <Section tone="light">
        <ContentContainer size="sm">
          <h2 className="headline-large text-text-dark mb-6">
            Warum ein Prototyp am Anfang steht
          </h2>
          <p className="body-large text-text-medium">
            Viele Vorhaben zur Digitalisierung in der Forstwirtschaft und
            angrenzenden Branchen scheitern nicht an der Technik, sondern daran,
            dass zu früh zu viel gebaut wurde. Ein Prototyp oder Minimum Viable
            Product (MVP) dreht diese Logik um: Wir starten mit der
            kleinstmöglichen Lösung, die dein Problem tatsächlich adressiert, und
            prüfen sie an echten Nutzerinnen und Nutzern – bevor ein vollständiges
            Lastenheft geschrieben ist.
          </p>
        </ContentContainer>
      </Section>

      {/* Der Ansatz */}
      <Section tone="default">
        <div className="text-center mb-12">
          <h2 className="headline-large text-text-dark mb-4">
            Der Ansatz: Design Thinking trifft Lean Startup
          </h2>
        </div>
        <CardGrid columns={2} gap="md">
          {approach.map((item) => (
            <FeatureCard
              key={item.title}
              title={item.title}
              description={item.description}
              icon={item.icon}
            />
          ))}
        </CardGrid>
      </Section>

      {/* Projektablauf — custom timeline, keep inline */}
      <Section tone="light">
        <ContentContainer size="md">
          <h2 className="headline-large text-text-dark mb-12">
            So läuft ein Projekt typischerweise ab
          </h2>
          <div className="space-y-6">
            {steps.map((step) => (
              <div
                key={step.number}
                className="flex gap-6 p-6 bg-white rounded-2xl"
              >
                <div className="w-12 h-12 rounded-full bg-primary text-white flex items-center justify-center flex-shrink-0 title-medium">
                  {step.number}
                </div>
                <div>
                  <h3 className="title-large text-text-dark mb-2">{step.title}</h3>
                  <p className="body-medium text-text-medium">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </ContentContainer>
      </Section>

      {/* Wann sich das lohnt */}
      <Section tone="default">
        <ContentContainer size="sm">
          <h2 className="headline-large text-text-dark mb-8">Wann sich das lohnt</h2>
          <ul className="space-y-4">
            {whenWorthwhile.map((item, i) => (
              <li
                key={i}
                className="flex items-start gap-4 p-5 bg-bg-light rounded-xl"
              >
                <span className="material-symbols-outlined text-primary flex-shrink-0 mt-0.5">
                  check_circle
                </span>
                <span className="body-large text-text-dark">{item}</span>
              </li>
            ))}
          </ul>
        </ContentContainer>
      </Section>

      {/* Was am Ende in deinen Händen liegt */}
      <Section tone="light">
        <ContentContainer size="sm">
          <h2 className="headline-large text-text-dark mb-8">
            Was am Ende in deinen Händen liegt
          </h2>
          <ul className="space-y-4">
            {deliverables.map((item, i) => (
              <li
                key={i}
                className="flex items-start gap-4 p-5 bg-white rounded-xl"
              >
                <span className="material-symbols-outlined text-primary flex-shrink-0 mt-0.5">
                  inventory_2
                </span>
                <span className="body-large text-text-dark">{item}</span>
              </li>
            ))}
          </ul>
        </ContentContainer>
      </Section>

      {/* Aus der Praxis — custom case-study cards, keep inline */}
      <Section tone="default">
        <ContentContainer size="md">
          <h2 className="headline-large text-text-dark mb-4">Aus der Praxis</h2>
          <p className="body-large text-text-medium mb-12">
            Zwei Projekte, die genau so entstanden sind — Schritt für Schritt.
          </p>
          <div className="space-y-8">
            {cases.map((c) => (
              <div key={c.title} className="p-8 bg-bg-light rounded-2xl">
                <h3 className="headline-small text-text-dark mb-1">{c.title}</h3>
                <p className="label-large text-primary mb-6">{c.subtitle}</p>
                <div className="space-y-4">
                  <div>
                    <p className="title-small text-text-dark mb-1">Ausgangspunkt</p>
                    <p className="body-medium text-text-medium">{c.starting}</p>
                  </div>
                  <div>
                    <p className="title-small text-text-dark mb-1">Ansatz</p>
                    <p className="body-medium text-text-medium">{c.approach}</p>
                  </div>
                  <div>
                    <p className="title-small text-text-dark mb-1">Ergebnis</p>
                    <p className="body-medium text-text-medium">{c.result}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </ContentContainer>
      </Section>

      {/* Was dich bei uns erwartet — custom callout, keep inline */}
      <Section tone="light">
        <ContentContainer size="sm">
          <div className="border-l-4 border-primary bg-primary/5 p-8 rounded-r-xl">
            <div className="flex items-center gap-3 mb-4">
              <span className="material-symbols-outlined text-primary text-[28px]">
                waving_hand
              </span>
              <h2 className="headline-small text-text-dark m-0">
                Was dich bei uns erwartet
              </h2>
            </div>
            <p className="body-large text-text-medium mb-4">
              Wir kommen aus der Forstwirtschaft und haben uns Softwareentwicklung
              selbst beigebracht. In der Praxis heißt das: Wir verstehen deine
              Fachdomäne – Forst, Jagd, Flächenmanagement, Windenergie – und können
              gleichzeitig mit modernen Werkzeugen, inklusive KI-gestützter
              Entwicklung, zügig Ergebnisse liefern. Kein Übersetzer zwischen Fach
              und IT nötig.
            </p>
            <p className="body-large text-text-medium mb-4">
              Gearbeitet wird remote oder vor Ort, in überschaubaren Sprints, mit
              klaren Zwischenständen. Du bist jederzeit im Bilde, was gerade
              passiert.
            </p>
            <p className="body-large text-text-medium">
              Die MVP-Entwicklung im Forst- und Flächenkontext ist dabei kein
              Buzzword, sondern der pragmatische Weg, aus einer Idee in wenigen
              Wochen etwas Greifbares zu machen.
            </p>
          </div>
        </ContentContainer>
      </Section>

      <FinalCTA
        title="Lass uns über deine Idee sprechen"
        description="Beschreib uns kurz, worum es geht — wir melden uns innerhalb von zwei Werktagen zurück."
        primaryCta={{ label: 'Idee besprechen', href: '/kontakt' }}
      />
    </div>
  );
}
