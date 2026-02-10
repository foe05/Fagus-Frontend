'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { confirmSubscription } from '@/app/actions/newsletter';

function ConfirmationContent() {
  const searchParams = useSearchParams();
  const [status, setStatus] = useState<{
    type: 'loading' | 'success' | 'error';
    message?: string;
  }>({ type: 'loading' });

  useEffect(() => {
    const token = searchParams.get('token');

    if (!token) {
      setStatus({
        type: 'error',
        message: 'Kein Bestätigungstoken gefunden. Bitte verwenden Sie den Link aus Ihrer Bestätigungs-E-Mail.',
      });
      return;
    }

    // Bestätigung durchführen
    const performConfirmation = async () => {
      try {
        const result = await confirmSubscription(token);

        if (result.success) {
          setStatus({
            type: 'success',
            message: result.message,
          });
        } else {
          setStatus({
            type: 'error',
            message: result.error || 'Ein Fehler ist aufgetreten.',
          });
        }
      } catch (error) {
        setStatus({
          type: 'error',
          message: 'Ein unerwarteter Fehler ist aufgetreten. Bitte versuchen Sie es später erneut.',
        });
      }
    };

    performConfirmation();
  }, [searchParams]);

  return (
    <>
      {/* Content */}
      <section className="py-20 bg-white">
        <div className="container-custom max-w-4xl">
          {/* Loading State */}
          {status.type === 'loading' && (
            <div className="text-center py-12">
              <div className="inline-block mb-6">
                <span className="material-symbols-outlined text-6xl text-primary animate-spin">
                  refresh
                </span>
              </div>
              <h2 className="headline-large text-text-dark mb-4">
                Bestätigung wird verarbeitet...
              </h2>
              <p className="body-large text-text-medium">
                Bitte warten Sie einen Moment.
              </p>
            </div>
          )}

          {/* Success State */}
          {status.type === 'success' && (
            <div className="text-center py-12 animate-fade-in">
              <div className="inline-block mb-6 p-6 bg-green-50 rounded-full">
                <span className="material-symbols-outlined text-6xl text-green-600">
                  check_circle
                </span>
              </div>
              <h2 className="headline-large text-text-dark mb-4">
                Herzlich willkommen!
              </h2>
              <p className="body-large text-text-medium mb-8">
                {status.message}
              </p>

              <div className="bg-surface p-8 rounded-lg mb-8 text-left">
                <h3 className="headline-medium text-text-dark mb-4">
                  Was passiert jetzt?
                </h3>
                <ul className="space-y-4">
                  <li className="flex items-start gap-3">
                    <span className="material-symbols-outlined text-primary mt-1">
                      mail
                    </span>
                    <div>
                      <strong className="label-large text-text-dark block">Willkommens-E-Mail</strong>
                      <p className="body-medium text-text-medium">
                        Sie erhalten in Kürze eine Willkommens-E-Mail mit weiteren Informationen.
                      </p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="material-symbols-outlined text-primary mt-1">
                      event
                    </span>
                    <div>
                      <strong className="label-large text-text-dark block">Regelmäßige Updates</strong>
                      <p className="body-medium text-text-medium">
                        Ab sofort erhalten Sie regelmäßig wertvolle Insights zu Ihren gewählten Themen.
                      </p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="material-symbols-outlined text-primary mt-1">
                      unsubscribe
                    </span>
                    <div>
                      <strong className="label-large text-text-dark block">Jederzeit abmelden</strong>
                      <p className="body-medium text-text-medium">
                        Sie können sich jederzeit über den Link in jeder E-Mail wieder abmelden.
                      </p>
                    </div>
                  </li>
                </ul>
              </div>

              <div className="flex flex-wrap justify-center gap-4">
                <Link
                  href="/"
                  className="flex items-center gap-2 px-8 py-4 bg-primary text-white rounded-full label-large hover:bg-primary-light hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300"
                >
                  <span className="material-symbols-outlined">home</span>
                  <span>Zur Startseite</span>
                </Link>
                <Link
                  href="/ueber-uns/blog-wissen"
                  className="flex items-center gap-2 px-8 py-4 bg-white text-primary border-2 border-primary rounded-full label-large hover:bg-surface hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300"
                >
                  <span className="material-symbols-outlined">article</span>
                  <span>Blog & Wissen</span>
                </Link>
              </div>
            </div>
          )}

          {/* Error State */}
          {status.type === 'error' && (
            <div className="text-center py-12 animate-fade-in">
              <div className="inline-block mb-6 p-6 bg-red-50 rounded-full">
                <span className="material-symbols-outlined text-6xl text-red-600">
                  error
                </span>
              </div>
              <h2 className="headline-large text-text-dark mb-4">
                Bestätigung fehlgeschlagen
              </h2>
              <p className="body-large text-text-medium mb-8">
                {status.message}
              </p>

              <div className="bg-surface p-8 rounded-lg mb-8 text-left max-w-2xl mx-auto">
                <h3 className="headline-medium text-text-dark mb-4">
                  Mögliche Ursachen
                </h3>
                <ul className="space-y-3 body-medium text-text-medium">
                  <li className="flex items-start gap-2">
                    <span className="material-symbols-outlined text-text-light mt-0.5">
                      chevron_right
                    </span>
                    <span>Der Bestätigungslink ist bereits abgelaufen (gültig für 24 Stunden)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="material-symbols-outlined text-text-light mt-0.5">
                      chevron_right
                    </span>
                    <span>Die Anmeldung wurde bereits bestätigt</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="material-symbols-outlined text-text-light mt-0.5">
                      chevron_right
                    </span>
                    <span>Der Link ist ungültig oder beschädigt</span>
                  </li>
                </ul>
              </div>

              <div className="flex flex-wrap justify-center gap-4">
                <Link
                  href="/newsletter/abonnieren"
                  className="flex items-center gap-2 px-8 py-4 bg-primary text-white rounded-full label-large hover:bg-primary-light hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300"
                >
                  <span className="material-symbols-outlined">refresh</span>
                  <span>Erneut anmelden</span>
                </Link>
                <Link
                  href="/kontakt"
                  className="flex items-center gap-2 px-8 py-4 bg-white text-primary border-2 border-primary rounded-full label-large hover:bg-surface hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300"
                >
                  <span className="material-symbols-outlined">support_agent</span>
                  <span>Support kontaktieren</span>
                </Link>
              </div>
            </div>
          )}
        </div>
      </section>
    </>
  );
}

export default function NewsletterBestaetigung() {
  return (
    <div className="pt-[70px] min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary to-primary-light text-white py-20">
        <div className="container-custom">
          <div className="max-w-3xl">
            <h1 className="display-medium mb-6">Newsletter-Bestätigung</h1>
            <p className="headline-small font-normal opacity-90">
              Aktivierung Ihrer Newsletter-Anmeldung
            </p>
          </div>
        </div>
      </section>

      {/* Suspense Boundary for Client Component */}
      <Suspense
        fallback={
          <section className="py-20 bg-white">
            <div className="container-custom max-w-4xl">
              <div className="text-center py-12">
                <div className="inline-block mb-6">
                  <span className="material-symbols-outlined text-6xl text-primary animate-spin">
                    refresh
                  </span>
                </div>
                <h2 className="headline-large text-text-dark mb-4">
                  Seite wird geladen...
                </h2>
              </div>
            </div>
          </section>
        }
      >
        <ConfirmationContent />
      </Suspense>
    </div>
  );
}
