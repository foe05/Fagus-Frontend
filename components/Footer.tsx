import Link from 'next/link';
import Image from 'next/image';
import { FOOTER_COLUMNS, SOCIAL_LINKS, COMPANY_INFO } from '@/lib/constants';

export default function Footer() {
  return (
    <footer className="bg-primary text-white pt-16 pb-8">
      <div className="container-custom">
        {/* Main Footer Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 mb-12">
          {/* Column 1: About Us */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-3 mb-4">
              <div className="relative w-[40px] h-[40px]">
                <Image
                  src="/logo-white.png"
                  alt="Logo"
                  fill
                  className="object-contain"
                />
              </div>
              <div className="title-medium">
                Broetzens IT<br />Cattles & Cows
              </div>
            </div>

            <p className="body-small text-white/80 mb-6 leading-relaxed">
              {COMPANY_INFO.tagline}
              <br />
              <br />
              {COMPANY_INFO.description}
            </p>

            {/* Social Links */}
            <div className="flex gap-4">
              {SOCIAL_LINKS.map((social) => (
                <a
                  key={social.platform}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.ariaLabel}
                  className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-all duration-300 hover:scale-110"
                >
                  <span className="material-symbols-outlined text-[20px]">
                    {social.icon}
                  </span>
                </a>
              ))}
            </div>
          </div>

          {/* Columns 2-5: Footer Links */}
          {FOOTER_COLUMNS.map((column) => (
            <div key={column.title}>
              <h3 className="label-small mb-4 text-white/60">
                {column.title}
              </h3>
              <ul className="space-y-3">
                {column.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="body-small text-white/80 hover:text-white transition-colors inline-block"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Footer Bottom */}
        <div className="pt-8 border-t border-white/20 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="body-small text-white/60 text-center md:text-left">
            © {new Date().getFullYear()} {COMPANY_INFO.name}. Alle Rechte vorbehalten.
          </p>

          <div className="flex gap-6">
            <Link
              href="/impressum"
              className="body-small text-white/60 hover:text-white transition-colors"
            >
              Impressum
            </Link>
            <Link
              href="/datenschutz"
              className="body-small text-white/60 hover:text-white transition-colors"
            >
              Datenschutz
            </Link>
            <Link
              href="/agb"
              className="body-small text-white/60 hover:text-white transition-colors"
            >
              AGB
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
