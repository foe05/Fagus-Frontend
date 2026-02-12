import dynamic from 'next/dynamic';
import type { FooterColumn } from '@/lib/types';

const FooterComponent = dynamic(() => import('./Footer'), {
  loading: () => (
    <footer role="contentinfo" className="bg-primary text-white pt-16 pb-8">
      <div className="container-custom">
        <div className="h-64 flex items-center justify-center">
          <div className="animate-pulse text-white/60">Loading...</div>
        </div>
      </div>
    </footer>
  ),
  ssr: true,
});

interface LazyFooterProps {
  footerColumns?: FooterColumn[];
}

export default function LazyFooter({ footerColumns }: LazyFooterProps) {
  return <FooterComponent footerColumns={footerColumns} />;
}
