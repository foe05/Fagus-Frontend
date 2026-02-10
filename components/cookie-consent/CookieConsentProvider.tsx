'use client';

import { createContext, useContext, useState, ReactNode } from 'react';
import { useCookieConsent } from '@/hooks/useCookieConsent';
import { CookieConsentPreferences } from '@/lib/types';

/**
 * Context-Typ für Cookie-Consent-Verwaltung
 * Erweitert die Hook-Rückgabewerte um Modal-Steuerung
 */
interface CookieConsentContextType {
  preferences: CookieConsentPreferences;
  hasConsented: boolean;
  isLoaded: boolean;
  acceptAll: () => void;
  rejectAll: () => void;
  saveCustomized: (analytics: boolean) => void;
  updatePreferences: (newPreferences: Partial<CookieConsentPreferences>) => void;
  resetConsent: () => void;
  // Modal-Steuerung für Settings-Dialog
  isSettingsOpen: boolean;
  openSettings: () => void;
  closeSettings: () => void;
}

const CookieConsentContext = createContext<CookieConsentContextType | null>(null);

interface CookieConsentProviderProps {
  children: ReactNode;
}

/**
 * Cookie Consent Provider Komponente
 * Stellt Cookie-Consent-Status und -Funktionen für alle Kindkomponenten bereit
 */
export function CookieConsentProvider({ children }: CookieConsentProviderProps) {
  const cookieConsent = useCookieConsent();
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  const openSettings = () => setIsSettingsOpen(true);
  const closeSettings = () => setIsSettingsOpen(false);

  const contextValue: CookieConsentContextType = {
    ...cookieConsent,
    isSettingsOpen,
    openSettings,
    closeSettings,
  };

  return (
    <CookieConsentContext.Provider value={contextValue}>
      {children}
    </CookieConsentContext.Provider>
  );
}

/**
 * Custom Hook für Zugriff auf Cookie-Consent-Context
 * Muss innerhalb eines CookieConsentProvider verwendet werden
 */
export function useCookieConsentContext(): CookieConsentContextType {
  const context = useContext(CookieConsentContext);

  if (!context) {
    throw new Error(
      'useCookieConsentContext muss innerhalb eines CookieConsentProvider verwendet werden'
    );
  }

  return context;
}
