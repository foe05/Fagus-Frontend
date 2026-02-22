import Link from 'next/link';
import { getTags } from '@/lib/wordpress';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function ThemenPage() {
  const allTags = await getTags(100);
  const topTags = allTags.sort((a, b) => b.count - a.count).slice(0, 8);

  const fallbackTags = [
    { id: 1, name: 'Digitalisierung', slug: 'digitalisierung', description: '', count: 0 },
    { id: 2, name: 'Wildtiermanagement', slug: 'wildtiermanagement', description: '', count: 0 },
    { id: 3, name: 'Automatisierung', slug: 'automatisierung', description: '', count: 0 },
    { id: 4, name: 'AI-First', slug: 'ai-first', description: '', count: 0 },
    { id: 5, name: 'Forststraßenbau', slug: 'forststrassen', description: '', count: 0 },
    { id: 6, name: 'Mobile Apps', slug: 'mobile-apps', description: '', count: 0 },
    { id: 7, name: 'Change Management', slug: 'change-management', description: '', count: 0 },
    { id: 8, name: 'Prozessoptimierung', slug: 'prozessoptimierung', description: '', count: 0 },
  ];

  const tags = topTags.length > 0 ? topTags : fallbackTags;

  return (
    <div className="pt-[70px] min-h-screen bg-bg-light">
      <div className="container-custom py-20">
        {/* Header */}
        <div className="max-w-3xl mb-16">
          <div className="flex items-center gap-3 mb-6">
            <span className="material-symbols-outlined text-primary text-[48px]">topic</span>
            <h1 className="display-medium text-text-dark">Themen</h1>
          </div>
          <p className="body-large text-text-medium">
            Die häufigsten Schlagworte unseres Blogs – ein Einstieg in die wichtigsten
            Themen rund um Digitalisierung in der Forstwirtschaft.
          </p>
        </div>

        {/* Tags Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {tags.map((tag) => (
            <Link
              key={tag.id}
              href={`/ueber-uns/blog-wissen?tag=${tag.slug}`}
              className="group bg-white rounded-2xl p-8 hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
            >
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                <span className="material-symbols-outlined text-primary text-[24px]">
                  topic
                </span>
              </div>
              <h2 className="headline-small text-text-dark mb-2 group-hover:text-primary transition-colors">
                {tag.name}
              </h2>
              {tag.count > 0 && (
                <p className="body-medium text-text-light">
                  {tag.count} {tag.count === 1 ? 'Artikel' : 'Artikel'}
                </p>
              )}
              <div className="mt-4 flex items-center gap-2 label-medium text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                <span>Artikel lesen</span>
                <span className="material-symbols-outlined text-[18px] group-hover:translate-x-1 transition-transform">
                  arrow_forward
                </span>
              </div>
            </Link>
          ))}
        </div>

        {/* Link to all blog posts */}
        <div className="mt-16 text-center">
          <Link
            href="/ueber-uns/blog-wissen"
            className="inline-flex items-center gap-2 px-8 py-4 bg-primary text-white rounded-full label-large hover:bg-primary/90 transition-colors"
          >
            <span className="material-symbols-outlined">menu_book</span>
            Alle Blog-Artikel anzeigen
          </Link>
        </div>
      </div>
    </div>
  );
}
