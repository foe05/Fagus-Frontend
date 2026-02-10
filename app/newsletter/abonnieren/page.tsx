import Link from 'next/link';
import NewsletterForm from '@/components/NewsletterForm';

export default function NewsletterAbonnierenPage() {
  return (
    <div className="pt-[70px] min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary to-primary-light text-white py-20">
        <div className="container-custom">
          <div className="max-w-3xl">
            <h1 className="display-medium mb-6">Newsletter abonnieren</h1>
            <p className="headline-small font-normal opacity-90">
              Bleiben Sie auf dem Laufenden über Digitalisierung in der Forstwirtschaft
            </p>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="py-20 bg-white">
        <div className="container-custom max-w-6xl">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Newsletter Form */}
            <div>
              <h2 className="headline-large text-text-dark mb-6">
                Jetzt anmelden
              </h2>
              <p className="body-large text-text-medium mb-8">
                Melden Sie sich für unseren Newsletter an und erhalten Sie regelmäßig
                Informationen zu Digitalisierung, KI-Trends und Produktneuigkeiten in der
                Forstwirtschaft.
              </p>

              {/* Double Opt-in Process Explanation */}
              <div className="mb-8 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="flex items-start gap-3">
                  <span className="material-symbols-outlined text-primary">info</span>
                  <div>
                    <h3 className="label-large text-text-dark mb-2">
                      Double-Opt-in Verfahren
                    </h3>
                    <p className="body-small text-text-medium">
                      Nach Ihrer Anmeldung erhalten Sie eine Bestätigungs-E-Mail.
                      Bitte klicken Sie auf den Link in dieser E-Mail, um Ihre Anmeldung
                      abzuschließen. Erst dann erhalten Sie unseren Newsletter.
                    </p>
                  </div>
                </div>
              </div>

              <NewsletterForm variant="full" />
            </div>

            {/* Benefits */}
            <div>
              <h2 className="headline-large text-text-dark mb-6">
                Das erwartet Sie
              </h2>

              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                    <span className="material-symbols-outlined text-primary">
                      tips_and_updates
                    </span>
                  </div>
                  <div>
                    <h3 className="label-large text-text-dark mb-2">
                      Digitalisierung in der Forstwirtschaft
                    </h3>
                    <p className="body-medium text-text-medium">
                      Praktische Tipps und Best Practices für die Digitalisierung
                      Ihres Forstbetriebs.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                    <span className="material-symbols-outlined text-primary">
                      psychology
                    </span>
                  </div>
                  <div>
                    <h3 className="label-large text-text-dark mb-2">
                      KI-Trends und Innovation
                    </h3>
                    <p className="body-medium text-text-medium">
                      Erfahren Sie, wie künstliche Intelligenz die Forstwirtschaft
                      revolutioniert und welche Möglichkeiten sich bieten.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                    <span className="material-symbols-outlined text-primary">
                      new_releases
                    </span>
                  </div>
                  <div>
                    <h3 className="label-large text-text-dark mb-2">
                      Produktneuigkeiten
                    </h3>
                    <p className="body-medium text-text-medium">
                      Seien Sie die Ersten, die von neuen Features, Updates und
                      Verbesserungen erfahren.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                    <span className="material-symbols-outlined text-primary">
                      schedule
                    </span>
                  </div>
                  <div>
                    <h3 className="label-large text-text-dark mb-2">
                      Ihre Zeit ist wertvoll
                    </h3>
                    <p className="body-medium text-text-medium">
                      Kompakte, relevante Informationen ohne Spam. Sie können sich
                      jederzeit mit einem Klick abmelden.
                    </p>
                  </div>
                </div>
              </div>

              {/* Privacy & GDPR Info */}
              <div className="mt-8 p-4 bg-gray-50 border border-border-light rounded-lg">
                <h3 className="label-large text-text-dark mb-2 flex items-center gap-2">
                  <span className="material-symbols-outlined">shield</span>
                  Datenschutz
                </h3>
                <p className="body-small text-text-medium">
                  Ihre Daten werden vertraulich behandelt und nicht an Dritte weitergegeben.
                  Sie können den Newsletter jederzeit über den Abmeldelink in jeder E-Mail
                  kündigen. Weitere Informationen finden Sie in unserer{' '}
                  <Link href="/datenschutz" className="text-primary hover:underline">
                    Datenschutzerklärung
                  </Link>
                  .
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
