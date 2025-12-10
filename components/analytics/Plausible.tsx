'use client';

import Script from 'next/script';

interface PlausibleProps {
  domain: string;
}

export default function Plausible({ domain }: PlausibleProps) {
  if (!domain) return null;

  return (
    <Script
      defer
      data-domain={domain}
      src="https://plausible.io/js/script.js"
      strategy="afterInteractive"
    />
  );
}
