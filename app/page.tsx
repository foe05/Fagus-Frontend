import dynamic from 'next/dynamic';
import { generateOrganizationSchema, generateWebSiteSchema } from '@/lib/seo/structured-data';

const TreeContainer = dynamic(() => import('@/components/Tree/TreeContainer'), {
  loading: () => (
    <div className="pt-[70px] relative w-full h-screen bg-gradient-to-br from-gray-200 via-gray-100 to-gray-200 flex items-center justify-center">
      <div className="animate-pulse text-gray-500">Loading...</div>
    </div>
  ),
  ssr: true,
});

export default function HomePage() {
  const orgSchema = generateOrganizationSchema('https://broetzens.de/logo-color.webp');
  const siteSchema = generateWebSiteSchema();

  return (
    <div className="pt-[70px]">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify([orgSchema, siteSchema]) }}
      />
      <TreeContainer />
    </div>
  );
}
