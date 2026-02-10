'use client';

import { useEffect, useState, useCallback } from 'react';
import { CookieConsentPreferences, CookieConsentStatus } from '@/lib/types';

const STORAGE_KEY = 'cookie-consent-preferences';

const DEFAULT_PREFERENCES: CookieConsentPreferences = {
  analytics: false,
  status: 'pending',
};

/**
 * Custom Hook für Cookie-Consent-Verwaltung
 * Verwaltet Benutzereinstellungen für Cookies mit localStorage-Persistenz
 */
export function useCookieConsent() {
  const [preferences, setPreferences] = useState<CookieConsentPreferences>(DEFAULT_PREFERENCES);
  const [isLoaded, setIsLoaded] = useState(false);

  // Read preferences from localStorage on mount (client-side only)
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored) as CookieConsentPreferences;
        setPreferences(parsed);
      }
    } catch {
      // localStorage not available or corrupted data - use defaults
    }
    setIsLoaded(true);
  }, []);

  // Check if user has made a consent decision
  const hasConsented = preferences.status !== 'pending';

  // Update preferences and persist to localStorage
  const updatePreferences = useCallback((newPreferences: Partial<CookieConsentPreferences>) => {
    setPreferences((prev) => {
      const updated: CookieConsentPreferences = {
        ...prev,
        ...newPreferences,
        timestamp: new Date().toISOString(),
      };

      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      } catch {
        // localStorage not available - preferences will only persist in memory
      }

      return updated;
    });
  }, []);

  // Accept all cookies
  const acceptAll = useCallback(() => {
    updatePreferences({
      analytics: true,
      status: 'accepted' as CookieConsentStatus,
    });
  }, [updatePreferences]);

  // Reject all optional cookies
  const rejectAll = useCallback(() => {
    updatePreferences({
      analytics: false,
      status: 'rejected' as CookieConsentStatus,
    });
  }, [updatePreferences]);

  // Save customized preferences
  const saveCustomized = useCallback((analytics: boolean) => {
    updatePreferences({
      analytics,
      status: 'customized' as CookieConsentStatus,
    });
  }, [updatePreferences]);

  // Reset consent (for testing or when user wants to reconsider)
  const resetConsent = useCallback(() => {
    setPreferences(DEFAULT_PREFERENCES);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      // localStorage not available
    }
  }, []);

  return {
    preferences,
    hasConsented,
    isLoaded,
    acceptAll,
    rejectAll,
    saveCustomized,
    updatePreferences,
    resetConsent,
  };
}
