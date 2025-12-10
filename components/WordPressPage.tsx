import Image from 'next/image';
import Link from 'next/link';
import type { WordPressPage } from '@/lib/types';
import { formatPostDate, getFeaturedImage } from '@/lib/wordpress';

interface WordPressPageProps {
  page: WordPressPage;
  showBackButton?: boolean;
  backButtonText?: string;
  backButtonHref?: string;
}

export default function WordPressPageComponent({
  page,
  showBackButton = false,
  backButtonText = 'Zurück',
  backButtonHref = '/',
}: WordPressPageProps) {
  const featuredImage = getFeaturedImage(page);

  return (
    <div className="pt-[70px] min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary to-primary-light text-white py-20">
        <div className="container-custom max-w-4xl">
          {/* Back Button */}
          {showBackButton && (
            <Link
              href={backButtonHref}
              className="inline-flex items-center gap-2 label-large mb-8 opacity-90 hover:opacity-100 transition-opacity"
            >
              <span className="material-symbols-outlined text-[20px]">arrow_back</span>
              <span>{backButtonText}</span>
            </Link>
          )}

          {/* Title */}
          <h1
            className="display-medium mb-6"
            dangerouslySetInnerHTML={{ __html: page.title.rendered }}
          />

          {/* Meta */}
          <div className="flex items-center gap-6 opacity-90">
            <time className="flex items-center gap-2 label-large">
              <span className="material-symbols-outlined text-[20px]">update</span>
              <span>Zuletzt aktualisiert: {formatPostDate(page.modified)}</span>
            </time>
          </div>
        </div>
      </section>

      {/* Featured Image */}
      {featuredImage && (
        <div className="relative w-full h-[400px] bg-gray-200">
          <Image
            src={featuredImage}
            alt={page.title.rendered}
            fill
            className="object-cover"
            priority
          />
        </div>
      )}

      {/* Content */}
      <article className="py-20 bg-white">
        <div className="container-custom max-w-4xl">
          <div
            className="prose prose-lg max-w-none
              prose-headings:text-text-dark
              prose-h1:headline-large
              prose-h2:headline-medium
              prose-h3:headline-small
              prose-h4:title-large
              prose-p:text-text-medium prose-p:body-large
              prose-a:text-primary prose-a:no-underline hover:prose-a:underline
              prose-strong:text-text-dark
              prose-ul:text-text-medium
              prose-ol:text-text-medium
              prose-li:body-medium
              prose-img:rounded-xl
              prose-img:shadow-lg
              prose-blockquote:border-l-primary
              prose-blockquote:bg-bg-light
              prose-blockquote:py-4
              prose-blockquote:px-6
              prose-blockquote:rounded-r-xl
              prose-blockquote:not-italic
              prose-code:bg-bg-light
              prose-code:px-2
              prose-code:py-1
              prose-code:rounded
              prose-code:text-primary
              prose-code:font-normal
              prose-pre:bg-primary
              prose-pre:text-white"
            dangerouslySetInnerHTML={{ __html: page.content.rendered }}
          />

          {/* CTA */}
          <div className="mt-16 p-8 bg-bg-light rounded-2xl text-center">
            <h3 className="headline-small text-text-dark mb-4">
              Haben Sie Fragen?
            </h3>
            <p className="body-large text-text-medium mb-6">
              Wir beraten Sie gerne zu Digitalisierung und modernen Lösungen
              für Ihren Forstbetrieb.
            </p>
            <Link
              href="/kontakt"
              className="inline-flex items-center gap-2 px-8 py-4 bg-primary text-white rounded-full label-large hover:bg-primary-light hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300"
            >
              <span className="material-symbols-outlined">call</span>
              <span>Kontakt aufnehmen</span>
            </Link>
          </div>
        </div>
      </article>
    </div>
  );
}
