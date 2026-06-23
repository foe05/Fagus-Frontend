'use client';

// Formular "Meine Daten teilen" (Besucher → Owner).
// Spec docs/Contact.md, Abschnitte 7-9: mehrzeilige Messagebox, Consent-
// Checkbox mit Link auf /datenschutz, Honeypot + Hidden-Timestamp gegen Bots.

import { useEffect, useId, useRef, useState } from 'react';

interface ExchangeFormProps {
  slug: string;
  /** Name/Org des Owners — für die freundliche Einleitung. */
  ownerLabel: string;
}

type FormStatus =
  | { type: 'idle' }
  | { type: 'loading' }
  | { type: 'success'; message: string }
  | { type: 'error'; message: string };

const inputClass =
  'w-full rounded-xl border border-border-light bg-white px-4 py-3 text-text-dark outline-none transition-colors placeholder:text-text-light focus:border-primary focus-visible:border-primary disabled:opacity-60';

export default function ExchangeForm({ slug, ownerLabel }: ExchangeFormProps) {
  const [vorname, setVorname] = useState('');
  const [nachname, setNachname] = useState('');
  const [email, setEmail] = useState('');
  const [telefon, setTelefon] = useState('');
  const [firma, setFirma] = useState('');
  const [position, setPosition] = useState('');
  const [nachricht, setNachricht] = useState('');
  const [website, setWebsite] = useState(''); // Honeypot
  const [consent, setConsent] = useState(false);
  const [status, setStatus] = useState<FormStatus>({ type: 'idle' });

  // Hidden-Timestamp: gesetzt beim Mount, gegen Timing-Trap im Backend.
  const loadedAt = useRef<number>(0);
  useEffect(() => {
    loadedAt.current = Date.now();
  }, []);

  const fieldPrefix = useId();

  const valid =
    vorname.trim() !== '' &&
    nachname.trim() !== '' &&
    (email.trim() !== '' || telefon.trim() !== '') &&
    consent;

  const submitting = status.type === 'loading';

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!valid || submitting) return;

    setStatus({ type: 'loading' });

    try {
      const response = await fetch('/api/exchange', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          slug,
          vorname: vorname.trim(),
          nachname: nachname.trim(),
          email: email.trim(),
          telefon: telefon.trim(),
          firma: firma.trim(),
          position: position.trim(),
          nachricht: nachricht.trim(),
          consent,
          website,
          ts: loadedAt.current,
        }),
      });
      const result = await response.json();

      if (result.success) {
        setStatus({ type: 'success', message: result.message });
      } else {
        setStatus({
          type: 'error',
          message:
            result.error ??
            'Da ist etwas schiefgelaufen. Bitte versuche es später erneut.',
        });
      }
    } catch {
      setStatus({
        type: 'error',
        message:
          'Verbindung fehlgeschlagen. Bitte versuche es später erneut oder schreib direkt an hallo@broetzens.de.',
      });
    }
  };

  if (status.type === 'success') {
    return (
      <div className="rounded-2xl bg-primary/5 px-6 py-8 text-center ring-1 ring-primary/15">
        <span
          className="material-symbols-outlined mb-2 text-[40px] text-primary"
          aria-hidden="true"
        >
          mark_email_read
        </span>
        <p className="body-medium text-text-dark">{status.message}</p>
      </div>
    );
  }

  const id = (name: string) => `${fieldPrefix}-${name}`;

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-4">
      <div>
        <h2 className="title-large text-text-dark">Deine Daten teilen</h2>
        <p className="body-medium mt-1 text-text-medium">
          Trag deine Kontaktdaten ein – sie gehen direkt an {ownerLabel}. Mit
          E-Mail bekommst du als Bestätigung die Karte zurück.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor={id('vorname')} className="label-large mb-1.5 block text-text-dark">
            Vorname *
          </label>
          <input
            id={id('vorname')}
            type="text"
            autoComplete="given-name"
            required
            value={vorname}
            onChange={(e) => setVorname(e.target.value)}
            disabled={submitting}
            className={inputClass}
          />
        </div>
        <div>
          <label htmlFor={id('nachname')} className="label-large mb-1.5 block text-text-dark">
            Nachname *
          </label>
          <input
            id={id('nachname')}
            type="text"
            autoComplete="family-name"
            required
            value={nachname}
            onChange={(e) => setNachname(e.target.value)}
            disabled={submitting}
            className={inputClass}
          />
        </div>
      </div>

      <div>
        <label htmlFor={id('email')} className="label-large mb-1.5 block text-text-dark">
          E-Mail{' '}
          <span className="text-text-light">– E-Mail oder Telefon nötig</span>
        </label>
        <input
          id={id('email')}
          type="email"
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={submitting}
          className={inputClass}
          placeholder="name@example.de"
        />
      </div>

      <div>
        <label htmlFor={id('telefon')} className="label-large mb-1.5 block text-text-dark">
          Telefon <span className="text-text-light">– optional</span>
        </label>
        <input
          id={id('telefon')}
          type="tel"
          autoComplete="tel"
          value={telefon}
          onChange={(e) => setTelefon(e.target.value)}
          disabled={submitting}
          className={inputClass}
          placeholder="+49 …"
        />
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor={id('firma')} className="label-large mb-1.5 block text-text-dark">
            Firma <span className="text-text-light">– optional</span>
          </label>
          <input
            id={id('firma')}
            type="text"
            autoComplete="organization"
            value={firma}
            onChange={(e) => setFirma(e.target.value)}
            disabled={submitting}
            className={inputClass}
          />
        </div>
        <div>
          <label htmlFor={id('position')} className="label-large mb-1.5 block text-text-dark">
            Position <span className="text-text-light">– optional</span>
          </label>
          <input
            id={id('position')}
            type="text"
            autoComplete="organization-title"
            value={position}
            onChange={(e) => setPosition(e.target.value)}
            disabled={submitting}
            className={inputClass}
          />
        </div>
      </div>

      <div>
        <label htmlFor={id('nachricht')} className="label-large mb-1.5 block text-text-dark">
          Nachricht <span className="text-text-light">– optional</span>
        </label>
        <textarea
          id={id('nachricht')}
          rows={4}
          value={nachricht}
          onChange={(e) => setNachricht(e.target.value)}
          disabled={submitting}
          className={`${inputClass} resize-y`}
          placeholder="Worum geht's? Woher kennen wir uns?"
        />
      </div>

      {/* Honeypot — für echte Nutzer unsichtbar, nur Bots füllen es aus. */}
      <div aria-hidden="true" className="absolute left-[-9999px] h-0 w-0 overflow-hidden">
        <label htmlFor={id('website')}>Website (bitte leer lassen)</label>
        <input
          id={id('website')}
          type="text"
          tabIndex={-1}
          autoComplete="off"
          value={website}
          onChange={(e) => setWebsite(e.target.value)}
        />
      </div>

      <label className="flex items-start gap-3">
        <input
          type="checkbox"
          checked={consent}
          onChange={(e) => setConsent(e.target.checked)}
          disabled={submitting}
          className="mt-1 h-5 w-5 shrink-0 accent-[var(--primary)]"
        />
        <span className="body-small text-text-medium">
          Ich stimme der Verarbeitung meiner Daten zur Kontaktaufnahme gemäß der{' '}
          <a
            href="/datenschutz"
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary underline"
          >
            Datenschutzerklärung
          </a>{' '}
          zu.
        </span>
      </label>

      <button
        type="submit"
        disabled={!valid || submitting}
        className="flex w-full items-center justify-center gap-2 rounded-full bg-primary px-6 py-3.5 text-white transition-colors hover:bg-primary-light focus-visible:bg-primary-light disabled:cursor-not-allowed disabled:opacity-50"
      >
        {submitting ? (
          <>
            <span className="material-symbols-outlined animate-spin text-[20px]" aria-hidden="true">
              progress_activity
            </span>
            <span className="label-large">Wird gesendet …</span>
          </>
        ) : (
          <>
            <span className="material-symbols-outlined text-[20px]" aria-hidden="true">
              send
            </span>
            <span className="label-large">Daten senden</span>
          </>
        )}
      </button>

      {status.type === 'error' && (
        <div
          role="alert"
          className="body-small rounded-xl bg-red-50 px-4 py-3 text-red-700 ring-1 ring-red-200"
        >
          {status.message}
        </div>
      )}
    </form>
  );
}
