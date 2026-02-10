'use client';

import Link from 'next/link';
import { useCookieConsentContext } from './CookieConsentProvider';
import CookieConsentSettings from './CookieConsentSettings';
import { COOKIE_CONSENT_TEXT } from '@/lib/constants';

/**
 * Cookie Consent Banner Komponente
 * Zeigt GDPR/TTDSG-konforme Cookie-Banner am unteren Bildschirmrand
 * Erscheint nur wenn der Benutzer noch keine Einwilligung gegeben hat
 * Rendert auch das Settings-Modal wenn geöffnet
 */
export default function CookieConsentBanner() {
  const {
    hasConsented,
    isLoaded,
    acceptAll,
    rejectAll,
    openSettings,
    isSettingsOpen,
    closeSettings,
  } = useCookieConsentContext();

  // Determine if banner should be visible
  const showBanner = isLoaded && !hasConsented;

  // Don't render anything during SSR or if neither banner nor modal should show
  if (!isLoaded && !isSettingsOpen) {
    return null;
  }

  return (
    <>
      {/* Cookie Settings Modal - can be opened from banner or footer */}
      {isSettingsOpen && <CookieConsentSettings onClose={closeSettings} />}

      {/* Banner - only shown when user hasn't consented yet */}
      {showBanner && (
    <div
      role="dialog"
      aria-modal="false"
      aria-labelledby="cookie-banner-title"
      aria-describedby="cookie-banner-description"
      className="fixed bottom-0 left-0 right-0 z-[200] bg-white border-t border-border-light shadow-[0_-4px_20px_rgba(0,0,0,0.1)]"
    >
      <div className="container-custom py-6">
        <div className="flex flex-col lg:flex-row lg:items-center gap-4 lg:gap-8">
          {/* Content */}
          <div className="flex-1">
            <h2
              id="cookie-banner-title"
              className="title-medium text-text-dark mb-2"
            >
              {COOKIE_CONSENT_TEXT.title}
            </h2>
            <p
              id="cookie-banner-description"
              className="body-small text-text-medium mb-2"
            >
              {COOKIE_CONSENT_TEXT.description}
            </p>
            <Link
              href={COOKIE_CONSENT_TEXT.privacyPolicyLink}
              className="body-small text-primary hover:text-primary-light transition-colors inline-flex items-center gap-1"
            >
              <span className="material-symbols-outlined text-[16px]">
                info
              </span>
              {COOKIE_CONSENT_TEXT.privacyPolicyText}
            </Link>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-3 lg:flex-shrink-0">
            {/* Accept All - Primary Button */}
            <button
              onClick={acceptAll}
              className="flex items-center justify-center gap-2 px-6 py-3 bg-primary text-white rounded-full label-large hover:bg-primary-light hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300"
            >
              <span className="material-symbols-outlined text-[20px]">
                check_circle
              </span>
              {COOKIE_CONSENT_TEXT.acceptAll}
            </button>

            {/* Reject All - Secondary Button */}
            <button
              onClick={rejectAll}
              className="flex items-center justify-center gap-2 px-6 py-3 bg-bg-light text-text-dark border border-border-light rounded-full label-large hover:bg-bg-dark hover:border-border-dark transition-all duration-300"
            >
              <span className="material-symbols-outlined text-[20px]">
                block
              </span>
              {COOKIE_CONSENT_TEXT.rejectAll}
            </button>

            {/* Customize - Link Style Button */}
            <button
              onClick={openSettings}
              className="flex items-center justify-center gap-2 px-6 py-3 text-text-medium hover:text-primary label-large transition-colors"
            >
              <span className="material-symbols-outlined text-[20px]">
                settings
              </span>
              {COOKIE_CONSENT_TEXT.customize}
            </button>
          </div>
        </div>
      </div>
    </div>
      )}
    </>
  );
}
