import Link from 'next/link';
import Image from 'next/image';
import type { WordPressPost } from '@/lib/types';
import { formatPostDate, getFeaturedImage, stripHtml } from '@/lib/wordpress';

interface BlogCardProps {
  post: WordPressPost;
}

export default function BlogCard({ post }: BlogCardProps) {
  const featuredImage = getFeaturedImage(post);
  const excerpt = stripHtml(post.excerpt.rendered).substring(0, 150) + '...';

  return (
    <Link
      href={`/ueber-uns/blog-wissen/${post.slug}`}
      className="group block bg-white rounded-2xl overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
    >
      {/* Featured Image */}
      {featuredImage && (
        <div className="relative w-full h-48 bg-gray-200">
          <Image
            src={featuredImage}
            alt={post.title.rendered}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />
        </div>
      )}

      {/* Content */}
      <div className="p-6">
        {/* Date */}
        <time className="label-small text-text-light block mb-3">
          {formatPostDate(post.date)}
        </time>

        {/* Title */}
        <h3 className="title-large text-text-dark mb-3 group-hover:text-primary transition-colors line-clamp-2">
          {post.title.rendered}
        </h3>

        {/* Excerpt */}
        <p className="body-medium text-text-medium mb-4 line-clamp-3">
          {excerpt}
        </p>

        {/* Read More */}
        <div className="flex items-center gap-2 label-medium text-primary">
          <span>Weiterlesen</span>
          <span className="material-symbols-outlined text-[18px] group-hover:translate-x-1 transition-transform">
            arrow_forward
          </span>
        </div>
      </div>
    </Link>
  );
}
