import Link from 'next/link';
import { getChildPages, getPageBySlug, stripHtml } from '@/lib/wordpress';
import { PageHero, Section, CardGrid, FeatureCard, ContentContainer } from '@/components/ui';

export const revalidate = 300;

const fallbackLinks = [
  {
    title: 'Team & Werte',
    href: '/ueber-uns/team-werte',
    icon: 'group',
    description: 'Lern unser Team kennen',
  },
  {
    title: 'AI-First Ansatz',
    href: '/ueber-uns/ai-first-ansatz',
    icon: 'psychology',
    description: 'Wie wir KI einsetzen',
  },
  {
    title: 'Blog & Wissen',
    href: '/ueber-uns/blog-wissen',
    icon: 'menu_book',
    description: 'Aktuelle Artikel',
  },
];

export async function generateMetadata() {
  const wpPage = await getPageBySlug('ueber-uns');

  if (wpPage) {
    const title = wpPage.title.rendered.replace(/<[^>]*>/g, '');
    const description = stripHtml(wpPage.excerpt.rendered).trim();
    return {
      title: `${title} - Broetzens IT`,
      ...(description && { description }),
    };
  }

  return {
    title: 'Über uns - Broetzens IT',
    description: 'Verwurzelt in Tradition, gewachsen durch Innovation. AI-First IT-Beratung für Forstbetriebe.',
  };
}

export default async function UeberUnsPage() {
  const [wpPage, wpChildren] = await Promise.all([
    getPageBySlug('ueber-uns'),
    getChildPages('ueber-uns'),
  ]);

  const hasWpContent = wpPage && wpPage.content.rendered.replace(/<[^>]*>/g, '').trim().length > 0;

  // Build link cards: WordPress children or fallback.
  // 'referenzen' is reachable via direct URL only — never surfaced in navigation.
  const visibleChildren = wpChildren.filter((page) => page.slug !== 'referenzen');
  const linkCards = visibleChildren.length > 0
    ? visibleChildren.map((page) => ({
        title: page.title.rendered,
        href: `/ueber-uns/${page.slug}`,
        description: stripHtml(page.excerpt.rendered).trim() || '',
      }))
    : fallbackLinks;

  // Determine grid columns (2, 3, or 4)
  const gridColumns: 2 | 3 | 4 = linkCards.length >= 4 ? 4 : (linkCards.length === 2 ? 2 : 3);

  const titleText = wpPage ? wpPage.title.rendered.replace(/<[^>]*>/g, '') : 'Über uns';

  return (
    <div className="pt-[70px] min-h-screen">
      <PageHero
        title={titleText}
        subtitle={!hasWpContent ? 'Verwurzelt in Tradition, gewachsen durch Innovation' : undefined}
      />

      {/* WordPress Page Content (replaces hardcoded story when available) */}
      {hasWpContent ? (
        <article className="py-20 bg-white">
          <div className="container-custom max-w-4xl">
            <div
              className="prose prose-lg max-w-none
                prose-headings:text-text-dark
                prose-h2:headline-medium
                prose-h3:headline-small
                prose-p:text-text-medium prose-p:body-large
                prose-a:text-primary prose-a:no-underline hover:prose-a:underline
                prose-strong:text-text-dark
                prose-ul:text-text-medium
                prose-ol:text-text-medium
                prose-li:body-medium
                prose-img:rounded-xl
                prose-img:shadow-lg"
              dangerouslySetInnerHTML={{ __html: wpPage!.content.rendered }}
            />
          </div>
        </article>
      ) : (
        <Section tone="default">
          <ContentContainer size="md">
            <h2 className="headline-large text-text-dark mb-6">Unsere Geschichte</h2>
            <p className="body-large text-text-medium mb-6">
              Broetzens IT Cattles & Cows entstand aus der Erkenntnis, dass die Forstwirtschaft
              enormes Potenzial in der Digitalisierung hat – aber oft die richtigen Partner fehlen,
              die sowohl Forst als auch IT verstehen.
            </p>
            <p className="body-large text-text-medium mb-12">
              Unser Team vereint jahrelange Erfahrung in der Forstwirtschaft mit modernster
              Software-Entwicklung. Wir sprechen beide Sprachen und übersetzen zwischen
              traditionellem Handwerk und digitaler Innovation.
            </p>

            <div className="grid md:grid-cols-3 gap-8 mb-16">
              {[
                {
                  icon: 'eco',
                  title: 'Forst-Expertise',
                  description: 'Tiefes Verständnis für die Herausforderungen der Branche',
                },
                {
                  icon: 'code',
                  title: 'Technologie',
                  description: 'Moderne AI-First Entwicklung für zukunftssichere Lösungen',
                },
                {
                  icon: 'handshake',
                  title: 'Partnerschaft',
                  description: 'Langfristige Begleitung auf Augenhöhe',
                },
              ].map((value) => (
                <div key={value.title} className="text-center">
                  <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                    <span className="material-symbols-outlined text-primary text-[32px]">
                      {value.icon}
                    </span>
                  </div>
                  <h3 className="title-large text-text-dark mb-2">{value.title}</h3>
                  <p className="body-medium text-text-medium">{value.description}</p>
                </div>
              ))}
            </div>
          </ContentContainer>
        </Section>
      )}

      {/* Quick Links - dynamic from WordPress or fallback */}
      <Section tone="light">
        <div className="text-center mb-12">
          <h2 className="headline-large text-text-dark">
            Mehr über uns erfahren
          </h2>
        </div>
        {visibleChildren.length > 0 ? (
          // WordPress children: preserve HTML rendering of titles
          <div className={`grid grid-cols-1 md:grid-cols-2 ${gridColumns === 4 ? 'lg:grid-cols-4' : gridColumns === 3 ? 'lg:grid-cols-3' : 'lg:grid-cols-2'} gap-6 max-w-6xl mx-auto`}>
            {linkCards.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="group bg-white rounded-2xl p-6 hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
              >
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                  <span className="material-symbols-outlined text-primary text-[28px]">
                    {'icon' in link ? (link as { icon: string }).icon : 'article'}
                  </span>
                </div>
                <h3
                  className="title-large text-text-dark mb-2 group-hover:text-primary transition-colors"
                  dangerouslySetInnerHTML={{ __html: link.title }}
                />
                {link.description && (
                  <p className="body-medium text-text-medium">{link.description}</p>
                )}
              </Link>
            ))}
          </div>
        ) : (
          <CardGrid columns={gridColumns} gap="md">
            {fallbackLinks.map((link) => (
              <FeatureCard
                key={link.href}
                title={link.title}
                description={link.description}
                icon={link.icon}
                href={link.href}
              />
            ))}
          </CardGrid>
        )}

        {/* Newsletter- & Blog-Hinweis */}
        <div className="max-w-6xl mx-auto mt-12">
          <div className="bg-primary text-white rounded-2xl p-8 md:p-10 flex flex-col gap-8 md:flex-row md:items-center">
            <div className="w-14 h-14 rounded-full bg-white/10 flex items-center justify-center flex-shrink-0">
              <span className="material-symbols-outlined text-[32px]" aria-hidden="true">
                rss_feed
              </span>
            </div>
            <div className="flex-1">
              <h3 className="title-large mb-2">Themen abonnieren statt suchen</h3>
              <p className="body-medium text-white/85">
                In{' '}
                <Link
                  href="/ueber-uns/blog-wissen"
                  className="underline underline-offset-2 hover:text-white"
                >
                  Blog &amp; Wissen
                </Link>{' '}
                teilen wir regelmäßig Praxiswissen rund um Digitalisierung und KI in
                der Forstwirtschaft. Mit unserem Newsletter erhältst du neue Beiträge
                zu deinen Wunschthemen automatisch ins Postfach.
              </p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row md:flex-col lg:flex-row flex-shrink-0">
              <Link
                href="/ueber-uns/blog-wissen"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 border-2 border-white/40 text-white rounded-full label-medium whitespace-nowrap hover:bg-white/10 transition-all duration-300"
              >
                <span className="material-symbols-outlined text-[20px]" aria-hidden="true">
                  menu_book
                </span>
                <span>Zum Blog</span>
              </Link>
              <Link
                href="/newsletter/abonnieren"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-white text-primary rounded-full label-medium whitespace-nowrap hover:bg-white/90 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300"
              >
                <span className="material-symbols-outlined text-[20px]" aria-hidden="true">
                  mail
                </span>
                <span>Newsletter abonnieren</span>
              </Link>
            </div>
          </div>
        </div>
      </Section>
    </div>
  );
}
