import { CARDS, getCardBySlug } from '@/lib/cards';
import { buildOwnerVCard } from '@/lib/vcard';

export const revalidate = 300;

export function generateStaticParams() {
  return CARDS.map((card) => ({ slug: card.slug }));
}

// GET /c/<slug>/vcard → Owner-.vcf als Download.
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  const { slug } = await params;
  const card = getCardBySlug(slug);
  if (!card) {
    return new Response('Karte nicht gefunden', { status: 404 });
  }

  const vcard = buildOwnerVCard(card);

  return new Response(vcard, {
    headers: {
      'Content-Type': 'text/vcard; charset=utf-8',
      'Content-Disposition': `attachment; filename="${card.slug}.vcf"`,
      'Cache-Control': 'public, max-age=300',
    },
  });
}
