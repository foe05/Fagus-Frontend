'use client';

import { useState } from 'react';
import Link from 'next/link';
import { NEWSLETTER_TOPICS } from '@/lib/constants';
import { subscribeToNewsletter, type NewsletterSubscriptionData } from '@/app/actions/newsletter';

interface NewsletterFormProps {
  variant?: 'full' | 'compact';
  className?: string;
}

export default function NewsletterForm({ variant = 'full', className = '' }: NewsletterFormProps) {
  const [formState, setFormState] = useState<NewsletterSubscriptionData>({
    email: '',
    topics: [],
    gdprConsent: false,
  });
  const [status, setStatus] = useState<{
    type: 'idle' | 'loading' | 'success' | 'error';
    message?: string;
  }>({ type: 'idle' });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus({ type: 'loading' });

    try {
      const result = await subscribeToNewsletter(formState);

      if (result.success) {
        setStatus({
          type: 'success',
          message: result.message,
        });
        // Formular zurücksetzen
        setFormState({
          email: '',
          topics: [],
          gdprConsent: false,
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

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormState({
      ...formState,
      email: e.target.value,
    });
  };

  const handleTopicToggle = (topicId: string) => {
    setFormState({
      ...formState,
      topics: formState.topics.includes(topicId)
        ? formState.topics.filter((t) => t !== topicId)
        : [...formState.topics, topicId],
    });
  };

  const handleGdprChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormState({
      ...formState,
      gdprConsent: e.target.checked,
    });
  };

  // Compact variant for footer
  if (variant === 'compact') {
    return (
      <div className={className}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="newsletter-email-compact" className="label-medium text-text-dark block mb-2">
              E-Mail-Adresse
            </label>
            <input
              type="email"
              id="newsletter-email-compact"
              name="email"
              required
              value={formState.email}
              onChange={handleEmailChange}
              disabled={status.type === 'loading'}
              placeholder="ihre@email.de"
              className="w-full px-4 py-2 border border-border-light rounded-lg body-medium focus:outline-none focus:border-primary transition-colors disabled:bg-gray-100 disabled:cursor-not-allowed"
            />
          </div>

          <div className="flex items-start gap-2">
            <input
              type="checkbox"
              id="gdpr-compact"
              checked={formState.gdprConsent}
              onChange={handleGdprChange}
              disabled={status.type === 'loading'}
              required
              className="mt-1 w-4 h-4 text-primary border-border-light rounded focus:ring-primary disabled:cursor-not-allowed"
            />
            <label htmlFor="gdpr-compact" className="body-small text-text-medium">
              Ich stimme der{' '}
              <Link href="/datenschutz" className="text-primary hover:underline">
                Datenschutzerklärung
              </Link>{' '}
              zu und möchte den Newsletter erhalten. *
            </label>
          </div>

          <button
            type="submit"
            disabled={status.type === 'loading'}
            className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-primary text-white rounded-full label-medium hover:bg-primary-light hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 disabled:bg-gray-400 disabled:cursor-not-allowed disabled:transform-none"
          >
            {status.type === 'loading' ? (
              <>
                <span className="material-symbols-outlined animate-spin">refresh</span>
                <span>Wird gesendet...</span>
              </>
            ) : (
              <>
                <span className="material-symbols-outlined">mail</span>
                <span>Abonnieren</span>
              </>
            )}
          </button>

          {/* Status Messages */}
          {status.type === 'success' && (
            <div className="p-3 bg-green-50 border border-green-200 rounded-lg animate-fade-in">
              <p className="body-small text-green-800 flex items-start gap-2">
                <span className="material-symbols-outlined text-green-600">check_circle</span>
                <span>{status.message}</span>
              </p>
            </div>
          )}

          {status.type === 'error' && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg animate-fade-in">
              <p className="body-small text-red-800 flex items-start gap-2">
                <span className="material-symbols-outlined text-red-600">error</span>
                <span>{status.message}</span>
              </p>
            </div>
          )}

          <p className="body-small text-text-medium">
            <Link href="/newsletter/abonnieren" className="text-primary hover:underline">
              Themenauswahl und mehr Details →
            </Link>
          </p>
        </form>
      </div>
    );
  }

  // Full variant for dedicated page
  return (
    <div className={className}>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="newsletter-email" className="label-large text-text-dark block mb-2">
            E-Mail-Adresse *
          </label>
          <input
            type="email"
            id="newsletter-email"
            name="email"
            required
            value={formState.email}
            onChange={handleEmailChange}
            disabled={status.type === 'loading'}
            placeholder="ihre@email.de"
            className="w-full px-4 py-3 border border-border-light rounded-lg body-large focus:outline-none focus:border-primary transition-colors disabled:bg-gray-100 disabled:cursor-not-allowed"
          />
        </div>

        <div>
          <label className="label-large text-text-dark block mb-3">
            Interessengebiete (optional)
          </label>
          <p className="body-medium text-text-medium mb-4">
            Wählen Sie die Themen aus, über die Sie informiert werden möchten:
          </p>
          <div className="space-y-3">
            {NEWSLETTER_TOPICS.map((topic) => (
              <div key={topic.id} className="flex items-start gap-3">
                <input
                  type="checkbox"
                  id={`topic-${topic.id}`}
                  checked={formState.topics.includes(topic.id)}
                  onChange={() => handleTopicToggle(topic.id)}
                  disabled={status.type === 'loading'}
                  className="mt-1 w-5 h-5 text-primary border-border-light rounded focus:ring-primary disabled:cursor-not-allowed"
                />
                <label htmlFor={`topic-${topic.id}`} className="flex-1 cursor-pointer">
                  <div className="label-medium text-text-dark">{topic.label}</div>
                  <div className="body-small text-text-medium">{topic.description}</div>
                </label>
              </div>
            ))}
          </div>
        </div>

        <div className="flex items-start gap-3 p-4 bg-gray-50 border border-border-light rounded-lg">
          <input
            type="checkbox"
            id="gdpr"
            checked={formState.gdprConsent}
            onChange={handleGdprChange}
            disabled={status.type === 'loading'}
            required
            className="mt-1 w-5 h-5 text-primary border-border-light rounded focus:ring-primary disabled:cursor-not-allowed"
          />
          <label htmlFor="gdpr" className="body-medium text-text-dark">
            Ich stimme der{' '}
            <Link href="/datenschutz" className="text-primary hover:underline">
              Datenschutzerklärung
            </Link>{' '}
            zu und möchte den Newsletter mit Informationen zu Digitalisierung, KI und Produkten
            erhalten. Ich kann mich jederzeit über den Link in jeder E-Mail abmelden. *
          </label>
        </div>

        <button
          type="submit"
          disabled={status.type === 'loading'}
          className="w-full flex items-center justify-center gap-2 px-8 py-4 bg-primary text-white rounded-full label-large hover:bg-primary-light hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 disabled:bg-gray-400 disabled:cursor-not-allowed disabled:transform-none"
        >
          {status.type === 'loading' ? (
            <>
              <span className="material-symbols-outlined animate-spin">refresh</span>
              <span>Wird gesendet...</span>
            </>
          ) : (
            <>
              <span className="material-symbols-outlined">mail</span>
              <span>Newsletter abonnieren</span>
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

        <p className="body-small text-text-medium text-center">
          * Pflichtfelder
        </p>
      </form>
    </div>
  );
}
