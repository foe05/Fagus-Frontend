'use client';

import { useState } from 'react';
import { COMPANY_INFO } from '@/lib/constants';
import { sendContactEmail, type ContactFormData } from '@/app/actions/sendEmail';

export default function KontaktPage() {
  const [formState, setFormState] = useState<ContactFormData>({
    name: '',
    email: '',
    company: '',
    message: '',
  });
  const [status, setStatus] = useState<{
    type: 'idle' | 'loading' | 'success' | 'error';
    message?: string;
  }>({ type: 'idle' });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus({ type: 'loading' });

    try {
      const result = await sendContactEmail(formState);

      if (result.success) {
        setStatus({
          type: 'success',
          message: result.message,
        });
        // Formular zurücksetzen
        setFormState({
          name: '',
          email: '',
          company: '',
          message: '',
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormState({
      ...formState,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="pt-[70px] min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary to-primary-light text-white py-20">
        <div className="container-custom">
          <div className="max-w-3xl">
            <h1 className="display-medium mb-6">Kontakt</h1>
            <p className="headline-small font-normal opacity-90">
              Lassen Sie uns über Ihr Projekt sprechen
            </p>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="py-20 bg-white">
        <div className="container-custom max-w-6xl">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <div>
              <h2 className="headline-large text-text-dark mb-6">
                Schreiben Sie uns
              </h2>
              <p className="body-large text-text-medium mb-8">
                Füllen Sie das Formular aus und wir melden uns innerhalb von 24 Stunden bei Ihnen.
              </p>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="name" className="label-large text-text-dark block mb-2">
                    Name *
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    required
                    value={formState.name}
                    onChange={handleChange}
                    disabled={status.type === 'loading'}
                    className="w-full px-4 py-3 border border-border-light rounded-lg body-large focus:outline-none focus:border-primary transition-colors disabled:bg-gray-100 disabled:cursor-not-allowed"
                  />
                </div>

                <div>
                  <label htmlFor="email" className="label-large text-text-dark block mb-2">
                    E-Mail *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    required
                    value={formState.email}
                    onChange={handleChange}
                    disabled={status.type === 'loading'}
                    className="w-full px-4 py-3 border border-border-light rounded-lg body-large focus:outline-none focus:border-primary transition-colors disabled:bg-gray-100 disabled:cursor-not-allowed"
                  />
                </div>

                <div>
                  <label htmlFor="company" className="label-large text-text-dark block mb-2">
                    Unternehmen / Forstbetrieb
                  </label>
                  <input
                    type="text"
                    id="company"
                    name="company"
                    value={formState.company}
                    onChange={handleChange}
                    disabled={status.type === 'loading'}
                    className="w-full px-4 py-3 border border-border-light rounded-lg body-large focus:outline-none focus:border-primary transition-colors disabled:bg-gray-100 disabled:cursor-not-allowed"
                  />
                </div>

                <div>
                  <label htmlFor="message" className="label-large text-text-dark block mb-2">
                    Nachricht *
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    required
                    rows={6}
                    value={formState.message}
                    onChange={handleChange}
                    disabled={status.type === 'loading'}
                    className="w-full px-4 py-3 border border-border-light rounded-lg body-large focus:outline-none focus:border-primary transition-colors resize-none disabled:bg-gray-100 disabled:cursor-not-allowed"
                  />
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
                      <span className="material-symbols-outlined">send</span>
                      <span>Nachricht senden</span>
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
            </div>

            {/* Contact Info */}
            <div>
              <h2 className="headline-large text-text-dark mb-6">
                Kontaktinformationen
              </h2>

              <div className="space-y-8">
                {/* Phone */}
                <div className="flex gap-4">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <span className="material-symbols-outlined text-primary">call</span>
                  </div>
                  <div>
                    <h3 className="title-medium text-text-dark mb-1">Telefon</h3>
                    <a
                      href={`tel:${COMPANY_INFO.phone}`}
                      className="body-large text-primary hover:underline"
                    >
                      {COMPANY_INFO.phone}
                    </a>
                  </div>
                </div>

                {/* Email */}
                <div className="flex gap-4">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <span className="material-symbols-outlined text-primary">email</span>
                  </div>
                  <div>
                    <h3 className="title-medium text-text-dark mb-1">E-Mail</h3>
                    <a
                      href={`mailto:${COMPANY_INFO.email}`}
                      className="body-large text-primary hover:underline"
                    >
                      {COMPANY_INFO.email}
                    </a>
                  </div>
                </div>

                {/* Address */}
                <div className="flex gap-4">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <span className="material-symbols-outlined text-primary">location_on</span>
                  </div>
                  <div>
                    <h3 className="title-medium text-text-dark mb-1">Adresse</h3>
                    <p className="body-large text-text-medium">
                      {COMPANY_INFO.address.street}<br />
                      {COMPANY_INFO.address.zip} {COMPANY_INFO.address.city}<br />
                      {COMPANY_INFO.address.country}
                    </p>
                  </div>
                </div>
              </div>

              {/* CTA Box */}
              <div className="mt-12 p-8 bg-bg-light rounded-2xl" id="termin">
                <h3 className="headline-small text-text-dark mb-4">
                  Erstgespräch vereinbaren
                </h3>
                <p className="body-medium text-text-medium mb-6">
                  Buchen Sie direkt einen Termin für ein kostenloses 30-minütiges Beratungsgespräch.
                </p>
                <a
                  href="https://calendly.com/broetzens"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-white border-2 border-primary text-primary rounded-full label-large hover:bg-primary hover:text-white transition-all duration-300"
                >
                  <span className="material-symbols-outlined">calendar_month</span>
                  <span>Termin buchen</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
