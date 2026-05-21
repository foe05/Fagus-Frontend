'use client';

import { useState } from 'react';
import { sendContactEmail } from '@/app/actions/sendEmail';
import { usePlausible } from '@/hooks/usePlausible';
import styles from './rostock.module.css';

type FormStatus =
  | { type: 'idle' }
  | { type: 'loading' }
  | { type: 'success'; message: string }
  | { type: 'error'; message: string };

export default function RostockForm() {
  const [problem, setProblem] = useState('');
  const [email, setEmail] = useState('');
  const [betrieb, setBetrieb] = useState('');
  const [status, setStatus] = useState<FormStatus>({ type: 'idle' });
  const { trackEvent } = usePlausible();

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!problem.trim()) return;

    setStatus({ type: 'loading' });

    const result = await sendContactEmail({
      name: '',
      email: email.trim(),
      company: betrieb.trim(),
      message: problem.trim(),
      source: 'rostock-postkarte',
    });

    if (result.success) {
      trackEvent('Rostock Form Submitted', {
        with_email: email.trim() ? 'yes' : 'no',
      });
      setStatus({
        type: 'success',
        message:
          'Danke. Ich habe deine Nachricht. Wenn du eine E‑Mail hinterlegt hast, antworte ich innerhalb von 48 Stunden – persönlich, nicht automatisiert.',
      });
    } else {
      setStatus({
        type: 'error',
        message:
          result.error ??
          'Hmm, da ist was schiefgelaufen. Schreib mir einfach direkt an hallo@broetzens.de.',
      });
    }
  };

  if (status.type === 'success') {
    return (
      <section className={styles.formSection}>
        <div className={styles.successBox}>{status.message}</div>
      </section>
    );
  }

  const submitting = status.type === 'loading';

  return (
    <section className={styles.formSection}>
      <div className={styles.formTitle}>
        Schick mir dein nervigstes Bürokratie‑Beispiel.
      </div>
      <div className={styles.formSubtitle}>
        Ich lese alles, was reinkommt, und antworte persönlich mit einer
        Einschätzung. Kein Newsletter, kein Lead‑Funnel.
      </div>

      <form onSubmit={handleSubmit} noValidate>
        <div className={styles.formGroup}>
          <label htmlFor="rostock-problem" className={styles.label}>
            Worum geht&apos;s?{' '}
            <span className={styles.labelOptional}>
              – schreib einfach drauflos
            </span>
          </label>
          <textarea
            id="rostock-problem"
            name="problem"
            required
            value={problem}
            onChange={(e) => setProblem(e.target.value)}
            disabled={submitting}
            className={styles.textarea}
            placeholder={
              'Beispiel: "Wir tippen jede Holzliste dreimal ab – einmal in ProForst, einmal in die FoGIS-Maske, einmal in Excel für den Käufer."'
            }
          />
          <div className={styles.helper}>
            Anonym ok. Wenn du eine Antwort willst, brauche ich aber unten eine
            E‑Mail.
          </div>
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="rostock-email" className={styles.label}>
            E‑Mail{' '}
            <span className={styles.labelOptional}>
              – freiwillig, nur für meine Antwort
            </span>
          </label>
          <input
            id="rostock-email"
            type="email"
            name="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={submitting}
            className={styles.input}
            placeholder="forst@example.de"
            autoComplete="email"
          />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="rostock-betrieb" className={styles.label}>
            Forstbetrieb / Region{' '}
            <span className={styles.labelOptional}>– freiwillig</span>
          </label>
          <input
            id="rostock-betrieb"
            type="text"
            name="betrieb"
            value={betrieb}
            onChange={(e) => setBetrieb(e.target.value)}
            disabled={submitting}
            className={styles.input}
            placeholder="z. B. Privatwald 600 ha, Mittelhessen"
          />
        </div>

        <button
          type="submit"
          className={styles.submit}
          disabled={submitting || !problem.trim()}
        >
          {submitting ? 'Wird gesendet …' : 'Absenden'}
        </button>

        {status.type === 'error' && (
          <div className={styles.errorBox} role="alert">
            {status.message}
          </div>
        )}

        <div className={styles.trustRow}>
          <span>Keine Weitergabe an Dritte</span>
          <span>Kein Newsletter</span>
          <span>Persönliche Antwort</span>
        </div>
      </form>
    </section>
  );
}
