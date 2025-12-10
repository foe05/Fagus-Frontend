import { getPosts } from '@/lib/wordpress';
import BlogCard from '@/components/blog/BlogCard';

export const revalidate = 300; // Revalidate every 5 minutes

export default async function BlogWissenPage() {
  const posts = await getPosts(12);

  return (
    <div className="pt-[70px] min-h-screen bg-bg-light">
      <div className="container-custom py-20">
        {/* Header */}
        <div className="max-w-3xl mb-16">
          <h1 className="display-medium text-text-dark mb-6">
            Blog & Wissen
          </h1>
          <p className="body-large text-text-medium">
            Aktuelle Artikel, Insights und Best Practices zur Digitalisierung
            in der Forstwirtschaft.
          </p>
        </div>

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
              Derzeit sind keine Blog-Posts verfügbar.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
