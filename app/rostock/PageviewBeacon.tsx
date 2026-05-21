'use client';

import { useEffect, useRef } from 'react';

/**
 * Fires a single 'rostock_pageview' event to the central logging proxy
 * (/api/log) when the page mounts. The page is statically prerendered, so
 * server code does not run per visit — this client beacon is what actually
 * counts a visit. Renders nothing.
 */
export default function PageviewBeacon() {
  const sent = useRef(false);

  useEffect(() => {
    // Guard against double-firing under React Strict Mode in dev.
    if (sent.current) return;
    sent.current = true;

    fetch('/api/log', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ event: 'rostock_pageview' }),
      keepalive: true,
    }).catch(() => {
      // Logging is best-effort — never disrupt the page.
    });
  }, []);

  return null;
}
