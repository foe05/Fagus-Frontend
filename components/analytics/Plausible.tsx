'use client';

import Script from 'next/script';
import { useCookieConsentContext } from '@/components/cookie-consent/CookieConsentProvider';

interface PlausibleProps {
  domain: string;
}

export default function Plausible({ domain }: PlausibleProps) {
  const { preferences, isLoaded } = useCookieConsentContext();

  // Don't render if no domain, consent not loaded, or analytics not consented
  if (!domain || !isLoaded || !preferences.analytics) {
    return null;
  }

  return (
    <Script
      defer
      data-domain={domain}
      src="https://plausible.io/js/script.js"
      strategy="afterInteractive"
    />
  );
}
