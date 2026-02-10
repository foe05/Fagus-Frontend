'use client';

import Script from 'next/script';

interface JsonLdProps {
  data: Record<string, any> | Record<string, any>[];
}

export default function JsonLd({ data }: JsonLdProps) {
  if (!data) return null;

  return (
    <Script
      id={`json-ld-${JSON.stringify(data).substring(0, 20)}`}
      type="application/ld+json"
      strategy="afterInteractive"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(data),
      }}
    />
  );
}
