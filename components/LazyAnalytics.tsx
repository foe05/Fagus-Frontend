'use client';

import dynamic from 'next/dynamic';

const GoogleAnalytics = dynamic(() => import('./analytics/GoogleAnalytics'), {
  ssr: false,
});

const Plausible = dynamic(() => import('./analytics/Plausible'), {
  ssr: false,
});

interface LazyAnalyticsProps {
  gaId?: string;
  plausibleDomain?: string;
}

export default function LazyAnalytics({ gaId, plausibleDomain }: LazyAnalyticsProps) {
  return (
    <>
      {gaId && <GoogleAnalytics gaId={gaId} />}
      {plausibleDomain && <Plausible domain={plausibleDomain} />}
    </>
  );
}
