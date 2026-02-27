'use client';

import { useCallback } from 'react';

// Extend Window to include the Plausible global
declare global {
  interface Window {
    plausible?: (
      eventName: string,
      options?: { props?: Record<string, string | number | boolean> }
    ) => void;
  }
}

/**
 * Hook for sending custom events to Plausible Analytics.
 * Safe to call during SSR and in dev (no-ops silently if plausible is not loaded).
 */
export function usePlausible() {
  const trackEvent = useCallback(
    (eventName: string, props?: Record<string, string | number | boolean>) => {
      if (typeof window !== 'undefined' && typeof window.plausible === 'function') {
        window.plausible(eventName, props ? { props } : undefined);
      }
    },
    []
  );

  return { trackEvent };
}
