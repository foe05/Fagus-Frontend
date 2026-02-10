'use client';

import { useEffect, useRef, useState } from 'react';
import { useCookieConsentContext } from './CookieConsentProvider';
import { COOKIE_CONSENT_TEXT } from '@/lib/constants';

interface CookieConsentSettingsProps {
  onClose: () => void;
}

/**
 * Cookie Consent Settings Modal Komponente
 * Modal-Dialog für detaillierte Cookie-Einstellungen mit Toggle-Switches
 * Folgt dem Popup.tsx Pattern für Focus Trap und Accessibility
 */
export default function CookieConsentSettings({ onClose }: CookieConsentSettingsProps) {
  const { preferences, saveCustomized } = useCookieConsentContext();
  const [analyticsEnabled, setAnalyticsEnabled] = useState(preferences.analytics);

  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);
  const previouslyFocusedElement = useRef<Element | null>(null);

  useEffect(() => {
    previouslyFocusedElement.current = document.activeElement;

    // Close on ESC key
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    // Focus trap
    const handleTab = (e: KeyboardEvent) => {
      if (e.key !== 'Tab' || !dialogRef.current) return;
      const focusable = dialogRef.current.querySelectorAll<HTMLElement>(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      if (focusable.length === 0) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };

    // Prevent body scroll
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', handleEsc);
    window.addEventListener('keydown', handleTab);
    closeButtonRef.current?.focus();

    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleEsc);
      window.removeEventListener('keydown', handleTab);
      if (previouslyFocusedElement.current instanceof HTMLElement) {
        previouslyFocusedElement.current.focus();
      }
    };
  }, [onClose]);

  const handleSave = () => {
    saveCustomized(analyticsEnabled);
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-[300] flex items-center justify-center p-4"
      onClick={onClose}
      style={{
        background: 'rgba(0, 0, 0, 0.75)',
        backdropFilter: 'blur(10px)',
        animation: 'fadeIn 0.3s ease-out',
      }}
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="cookie-settings-title"
        className="relative bg-white rounded-3xl max-w-lg w-full p-8 shadow-[0_30px_80px_rgba(0,0,0,0.4)]"
        onClick={(e) => e.stopPropagation()}
        style={{
          animation: 'slideUp 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
        }}
      >
        {/* Close Button */}
        <button
          ref={closeButtonRef}
          onClick={onClose}
          className="absolute top-4 right-4 w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors group"
          aria-label="Schließen"
        >
          <span className="material-symbols-outlined text-text-medium group-hover:text-text-dark text-[24px]">
            close
          </span>
        </button>

        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <div
            className="w-16 h-16 rounded-full flex items-center justify-center"
            style={{ background: 'var(--primary)' }}
          >
            <span className="material-symbols-outlined text-white text-[32px]">
              cookie
            </span>
          </div>
          <h2 id="cookie-settings-title" className="headline-small text-text-dark">
            {COOKIE_CONSENT_TEXT.title}
          </h2>
        </div>

        {/* Description */}
        <p className="body-medium text-text-medium mb-6">
          {COOKIE_CONSENT_TEXT.description}
        </p>

        {/* Cookie Categories */}
        <div className="space-y-4 mb-8">
          {/* Necessary Cookies - Always enabled */}
          <div className="p-4 bg-bg-light rounded-2xl border border-border-light">
            <div className="flex items-center justify-between mb-2">
              <span className="label-large text-text-dark">
                {COOKIE_CONSENT_TEXT.necessaryLabel}
              </span>
              <button
                type="button"
                role="switch"
                aria-checked="true"
                disabled
                className="relative inline-flex h-7 w-12 items-center rounded-full bg-primary cursor-not-allowed opacity-75"
                aria-label={`${COOKIE_CONSENT_TEXT.necessaryLabel} - Immer aktiv`}
              >
                <span className="sr-only">Notwendige Cookies sind immer aktiv</span>
                <span
                  className="inline-block h-5 w-5 transform rounded-full bg-white shadow-sm transition translate-x-6"
                />
              </button>
            </div>
            <p className="body-small text-text-medium">
              {COOKIE_CONSENT_TEXT.necessaryDescription}
            </p>
          </div>

          {/* Analytics Cookies - Toggleable */}
          <div className="p-4 bg-bg-light rounded-2xl border border-border-light">
            <div className="flex items-center justify-between mb-2">
              <span className="label-large text-text-dark">
                {COOKIE_CONSENT_TEXT.analyticsLabel}
              </span>
              <button
                type="button"
                role="switch"
                aria-checked={analyticsEnabled}
                onClick={() => setAnalyticsEnabled(!analyticsEnabled)}
                className={`relative inline-flex h-7 w-12 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 ${
                  analyticsEnabled ? 'bg-primary' : 'bg-gray-300'
                }`}
                aria-label={`${COOKIE_CONSENT_TEXT.analyticsLabel} ${analyticsEnabled ? 'deaktivieren' : 'aktivieren'}`}
              >
                <span className="sr-only">
                  {analyticsEnabled ? 'Analyse Cookies deaktivieren' : 'Analyse Cookies aktivieren'}
                </span>
                <span
                  className={`inline-block h-5 w-5 transform rounded-full bg-white shadow-sm transition ${
                    analyticsEnabled ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
            <p className="body-small text-text-medium">
              {COOKIE_CONSENT_TEXT.analyticsDescription}
            </p>
          </div>
        </div>

        {/* Save Button */}
        <button
          onClick={handleSave}
          className="flex items-center justify-center gap-2 w-full py-4 px-6 rounded-full label-large text-white transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5"
          style={{ background: 'var(--primary)' }}
        >
          <span className="material-symbols-outlined text-[20px]">check</span>
          <span>{COOKIE_CONSENT_TEXT.save}</span>
        </button>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}
