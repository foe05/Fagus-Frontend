'use client';

import { Suspense, useEffect, useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { unsubscribeFromNewsletter } from '@/app/actions/newsletter';

function AbmeldenContent() {
  const searchParams = useSearchParams();
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<{
    type: 'idle' | 'loading' | 'success' | 'error';
    message?: string;
  }>({ type: 'idle' });

  useEffect(() => {
    const emailParam = searchParams.get('email');
    const tokenParam = searchParams.get('token');

    if (emailParam) {
      setEmail(decodeURIComponent(emailParam));
    } else if (tokenParam) {
      // Token provided for testing/verification
      setEmail('');
    }
  }, [searchParams]);

  const handleUnsubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus({ type: 'loading' });

    try {
      const result = await unsubscribeFromNewsletter(email);

      if (result.success) {
        setStatus({
          type: 'success',
          message: result.message,
        });
        // Nach 10 Sekunden Status zurücksetzen
        setTimeout(() => setStatus({ type: 'idle' }), 10000);
      } else {
        setStatus({
          type: 'error',
          message: result.error,
        });
        // Nach 8 Sekunden Status zurücksetzen
        setTimeout(() => setStatus({ type: 'idle' }), 8000);
      }
    } catch (error) {
      setStatus({
        type: 'error',
        message: 'Ein unerwarteter Fehler ist aufgetreten. Bitte versuchen Sie es später erneut.',
      });
      setTimeout(() => setStatus({ type: 'idle' }), 8000);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

  return (
    <div className="pt-[70px] min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary to-primary-light text-white py-20">
        <div className="container-custom">
          <div className="max-w-3xl">
            <h1 className="display-medium mb-6">Newsletter abmelden</h1>
            <p className="headline-small font-normal opacity-90">
              Schade, dass Sie gehen möchten
            </p>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="py-20 bg-white">
        <div className="container-custom max-w-2xl">
          <div className="text-center mb-12">
            <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6">
              <span className="material-symbols-outlined text-primary text-5xl">unsubscribe</span>
            </div>
            <h2 className="headline-large text-text-dark mb-4">
              Newsletter-Abmeldung
            </h2>
            <p className="body-large text-text-medium">
              Wir bedauern, dass Sie unseren Newsletter nicht mehr erhalten möchten.
              Bestätigen Sie Ihre E-Mail-Adresse, um sich abzumelden.
            </p>
          </div>

          <div className="max-w-md mx-auto">
            <form onSubmit={handleUnsubscribe} className="space-y-6">
              <div>
                <label htmlFor="email" className="label-large text-text-dark block mb-2">
                  E-Mail-Adresse
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  required
                  value={email}
                  onChange={handleChange}
                  disabled={status.type === 'loading' || status.type === 'success'}
                  placeholder="ihre.email@beispiel.de"
                  className="w-full px-4 py-3 border border-border-light rounded-lg body-large focus:outline-none focus:border-primary transition-colors disabled:bg-gray-100 disabled:cursor-not-allowed"
                />
              </div>

              <button
                type="submit"
                disabled={status.type === 'loading' || status.type === 'success'}
                className="w-full flex items-center justify-center gap-2 px-8 py-4 bg-red-600 text-white rounded-full label-large hover:bg-red-700 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 disabled:bg-gray-400 disabled:cursor-not-allowed disabled:transform-none"
              >
                {status.type === 'loading' ? (
                  <>
                    <span className="material-symbols-outlined animate-spin">refresh</span>
                    <span>Wird abgemeldet...</span>
                  </>
                ) : (
                  <>
                    <span className="material-symbols-outlined">unsubscribe</span>
                    <span>Vom Newsletter abmelden</span>
                  </>
                )}
              </button>

              {/* Status Messages */}
              {status.type === 'success' && (
                <div className="p-4 bg-green-50 border border-green-200 rounded-lg animate-fade-in">
                  <p className="body-medium text-green-800 flex items-start gap-2">
                    <span className="material-symbols-outlined text-green-600">check_circle</span>
                    <span>{status.message}</span>
                  </p>
                </div>
              )}

              {status.type === 'error' && (
                <div className="p-4 bg-red-50 border border-red-200 rounded-lg animate-fade-in">
                  <p className="body-medium text-red-800 flex items-start gap-2">
                    <span className="material-symbols-outlined text-red-600">error</span>
                    <span>{status.message}</span>
                  </p>
                </div>
              )}
            </form>

            {/* Additional Info */}
            {status.type !== 'success' && (
              <div className="mt-8 p-6 bg-bg-light rounded-lg">
                <h3 className="title-medium text-text-dark mb-2">
                  Möchten Sie stattdessen Ihre Präferenzen anpassen?
                </h3>
                <p className="body-medium text-text-medium mb-4">
                  Falls Sie nur bestimmte Themen nicht mehr erhalten möchten, können Sie auch Ihre Newsletter-Einstellungen anpassen.
                </p>
                <Link
                  href="/newsletter"
                  className="inline-flex items-center gap-2 text-primary hover:underline label-medium"
                >
                  <span className="material-symbols-outlined">settings</span>
                  <span>Newsletter-Einstellungen</span>
                </Link>
              </div>
            )}

            {status.type === 'success' && (
              <div className="mt-8 p-6 bg-primary/5 rounded-lg text-center">
                <p className="body-medium text-text-medium mb-4">
                  Sie können sich jederzeit wieder anmelden.
                </p>
                <Link
                  href="/newsletter"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-full label-medium hover:bg-primary-light transition-colors"
                >
                  <span className="material-symbols-outlined">mail</span>
                  <span>Zurück zur Newsletter-Anmeldung</span>
                </Link>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}

export default function AbmeldenPage() {
  return (
    <Suspense
      fallback={(
        <div className="pt-[70px] min-h-screen flex items-center justify-center">
          <span className="material-symbols-outlined animate-spin text-primary text-[32px]">
            progress_activity
          </span>
        </div>
      )}
    >
      <AbmeldenContent />
    </Suspense>
  );
}
