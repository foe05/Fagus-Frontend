import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { CARDS, getCardBySlug } from '@/lib/cards';
import ContactCardView from '@/components/card/ContactCardView';

// 5-Min-ISR wie im restlichen Projekt.
export const revalidate = 300;

const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || 'https://broetzens.de').replace(
  /\/+$/,
  '',
);

export function generateStaticParams() {
  return CARDS.map((card) => ({ slug: card.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const card = getCardBySlug(slug);
  if (!card) return {};

  const title = `${card.fullName} – Kontakt`;
  const description = card.org
    ? `Digitale Kontaktkarte von ${card.fullName}, ${card.org}.`
    : `Digitale Kontaktkarte von ${card.fullName}.`;

  return {
    title,
    description,
    // Persönliche Kontaktseiten gehören nicht in den Suchindex.
    robots: { index: false, follow: false },
    openGraph: { title, description, type: 'profile', locale: 'de_DE' },
  };
}

export default async function ContactCardPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const card = getCardBySlug(slug);
  if (!card) notFound();

  const cardUrl = `${SITE_URL}/c/${card.slug}`;

  return (
    <div className="min-h-screen bg-bg-light px-4 py-10 sm:py-16">
      <div className="mx-auto w-full max-w-md">
        <ContactCardView card={card} cardUrl={cardUrl} />
      </div>
    </div>
  );
}
