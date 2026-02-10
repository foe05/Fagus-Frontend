'use client';

import { useEffect, useState } from 'react';

export type Theme = 'light' | 'dark';

export interface ThemeHook {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
}

const STORAGE_KEY = 'theme-preference';

/**
 * Custom Hook für Theme-Management
 * Verwaltet Dark/Light Mode mit localStorage-Persistenz und System-Präferenz-Erkennung
 */
export function useTheme(): ThemeHook {
  const [theme, setThemeState] = useState<Theme>(() => {
    // SSR-safe: Initial state ohne localStorage-Zugriff
    if (typeof window === 'undefined') {
      return 'light';
    }

    // Gespeicherte Präferenz prüfen
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored === 'light' || stored === 'dark') {
      return stored;
    }

    // System-Präferenz als Fallback
    if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
      return 'dark';
    }

    return 'light';
  });

  useEffect(() => {
    // Theme bei Änderung persistieren
    localStorage.setItem(STORAGE_KEY, theme);

    // HTML-Element Klasse für Tailwind dark mode aktualisieren
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [theme]);

  useEffect(() => {
    // System-Präferenz-Änderungen überwachen
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

    const handleChange = (e: MediaQueryListEvent) => {
      // Nur ändern wenn keine gespeicherte Präferenz existiert
      const stored = localStorage.getItem(STORAGE_KEY);
      if (!stored) {
        setThemeState(e.matches ? 'dark' : 'light');
      }
    };

    // Modern API mit addEventListener
    mediaQuery.addEventListener('change', handleChange);

    return () => {
      mediaQuery.removeEventListener('change', handleChange);
    };
  }, []);

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
  };

  const toggleTheme = () => {
    setThemeState((current) => (current === 'light' ? 'dark' : 'light'));
  };

  return {
    theme,
    setTheme,
    toggleTheme,
  };
}
