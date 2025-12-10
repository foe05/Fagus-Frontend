import Link from 'next/link';

export default function UeberUnsPage() {
  return (
    <div className="pt-[70px] min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary to-primary-light text-white py-20">
        <div className="container-custom">
          <div className="max-w-3xl">
            <h1 className="display-medium mb-6">Über uns</h1>
            <p className="headline-small font-normal opacity-90">
              Verwurzelt in Tradition, gewachsen durch Innovation
            </p>
          </div>
        </div>
      </section>

      {/* Story */}
      <section className="py-20 bg-white">
        <div className="container-custom max-w-4xl">
          <h2 className="headline-large text-text-dark mb-6">Unsere Geschichte</h2>
          <p className="body-large text-text-medium mb-6">
            Broetzens IT Cattles & Cows entstand aus der Erkenntnis, dass die Forstwirtschaft
            enormes Potenzial in der Digitalisierung hat – aber oft die richtigen Partner fehlen,
            die sowohl Forst als auch IT verstehen.
          </p>
          <p className="body-large text-text-medium mb-12">
            Unser Team vereint jahrelange Erfahrung in der Forstwirtschaft mit modernster
            Software-Entwicklung. Wir sprechen beide Sprachen und übersetzen zwischen
            traditionellem Handwerk und digitaler Innovation.
          </p>

          <div className="grid md:grid-cols-3 gap-8 mb-16">
            {[
              {
                icon: 'eco',
                title: 'Forst-Expertise',
                description: 'Tiefes Verständnis für die Herausforderungen der Branche',
              },
              {
                icon: 'code',
                title: 'Technologie',
                description: 'Moderne AI-First Entwicklung für zukunftssichere Lösungen',
              },
              {
                icon: 'handshake',
                title: 'Partnerschaft',
                description: 'Langfristige Begleitung auf Augenhöhe',
              },
            ].map((value) => (
              <div key={value.title} className="text-center">
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <span className="material-symbols-outlined text-primary text-[32px]">
                    {value.icon}
                  </span>
                </div>
                <h3 className="title-large text-text-dark mb-2">{value.title}</h3>
                <p className="body-medium text-text-medium">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Quick Links */}
      <section className="py-20 bg-bg-light">
        <div className="container-custom">
          <h2 className="headline-large text-text-dark mb-12 text-center">
            Mehr über uns erfahren
          </h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {[
              {
                title: 'Team & Werte',
                href: '/ueber-uns/team-werte',
                icon: 'group',
                description: 'Lernen Sie unser Team kennen',
              },
              {
                title: 'AI-First Ansatz',
                href: '/ueber-uns/ai-first-ansatz',
                icon: 'psychology',
                description: 'Wie wir KI einsetzen',
              },
              {
                title: 'Referenzen',
                href: '/ueber-uns/referenzen',
                icon: 'star',
                description: 'Erfolgreiche Projekte',
              },
              {
                title: 'Blog & Wissen',
                href: '/ueber-uns/blog-wissen',
                icon: 'menu_book',
                description: 'Aktuelle Artikel',
              },
            ].map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="group bg-white rounded-2xl p-6 hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
              >
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                  <span className="material-symbols-outlined text-primary text-[28px]">
                    {link.icon}
                  </span>
                </div>
                <h3 className="title-large text-text-dark mb-2 group-hover:text-primary transition-colors">
                  {link.title}
                </h3>
                <p className="body-medium text-text-medium">{link.description}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
