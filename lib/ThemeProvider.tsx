'use client';

import { createContext, useContext, ReactNode } from 'react';
import { useTheme, Theme, ThemeHook } from '@/hooks/useTheme';

interface ThemeContextValue extends ThemeHook {}

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

interface ThemeProviderProps {
  children: ReactNode;
}

/**
 * ThemeProvider Komponente
 * Stellt Theme-Kontext für alle Child-Komponenten bereit
 * Verwendet den useTheme-Hook für SSR-sichere Theme-Verwaltung
 */
export function ThemeProvider({ children }: ThemeProviderProps) {
  const themeValue = useTheme();

  return (
    <ThemeContext.Provider value={themeValue}>
      {children}
    </ThemeContext.Provider>
  );
}

/**
 * Hook zum Zugriff auf den Theme-Kontext
 * Muss innerhalb eines ThemeProvider verwendet werden
 */
export function useThemeContext(): ThemeContextValue {
  const context = useContext(ThemeContext);

  if (context === undefined) {
    throw new Error('useThemeContext must be used within a ThemeProvider');
  }

  return context;
}

export type { Theme, ThemeHook };
