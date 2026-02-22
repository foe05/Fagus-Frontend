import Link from 'next/link';
import { getPosts, getPostsByTag, getTags } from '@/lib/wordpress';
import BlogCard from '@/components/blog/BlogCard';

export const revalidate = 300;

export default async function BlogWissenPage({
  searchParams,
}: {
  searchParams: Promise<{ tag?: string }>;
}) {
  const { tag } = await searchParams;
  const posts = tag ? await getPostsByTag(tag, 12) : await getPosts(12);
  const allTags = await getTags(50);
  const topTags = allTags.sort((a, b) => b.count - a.count).slice(0, 12);

  return (
    <div className="pt-[70px] min-h-screen bg-bg-light">
      <div className="container-custom py-20">
        {/* Header */}
        <div className="max-w-3xl mb-10">
          <h1 className="display-medium text-text-dark mb-6">
            Blog & Wissen
          </h1>
          <p className="body-large text-text-medium">
            Aktuelle Artikel, Insights und Best Practices zur Digitalisierung
            in der Forstwirtschaft.
          </p>
        </div>

        {/* Tag Filter */}
        {topTags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-10">
            <Link
              href="/ueber-uns/blog-wissen"
              className={`px-4 py-2 rounded-full label-medium transition-colors ${
                !tag
                  ? 'bg-primary text-white'
                  : 'bg-white text-text-medium hover:bg-primary/10'
              }`}
            >
              Alle
            </Link>
            {topTags.map((t) => (
              <Link
                key={t.id}
                href={`/ueber-uns/blog-wissen?tag=${t.slug}`}
                className={`px-4 py-2 rounded-full label-medium transition-colors ${
                  tag === t.slug
                    ? 'bg-primary text-white'
                    : 'bg-white text-text-medium hover:bg-primary/10'
                }`}
              >
                {t.name}
              </Link>
            ))}
          </div>
        )}

        {/* Blog Grid */}
        {posts.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.map((post) => (
              <BlogCard key={post.id} post={post} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <span className="material-symbols-outlined text-[64px] text-text-light mb-4">
              article
            </span>
            <p className="body-large text-text-medium">
              {tag
                ? `Keine Artikel zu diesem Thema gefunden.`
                : 'Derzeit sind keine Blog-Posts verfügbar.'}
            </p>
            {tag && (
              <Link
                href="/ueber-uns/blog-wissen"
                className="mt-6 inline-flex items-center gap-2 text-primary label-large"
              >
                <span className="material-symbols-outlined">arrow_back</span>
                Alle Artikel anzeigen
              </Link>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
