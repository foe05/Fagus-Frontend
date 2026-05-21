'use client';

import dynamic from 'next/dynamic';
import { usePathname } from 'next/navigation';
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
});

interface LazyFooterProps {
  footerColumns?: FooterColumn[];
}

const STANDALONE_ROUTES = ['/rostock'];

export default function LazyFooter({ footerColumns }: LazyFooterProps) {
  const pathname = usePathname();
  if (pathname && STANDALONE_ROUTES.includes(pathname)) return null;
  return <FooterComponent footerColumns={footerColumns} />;
}
