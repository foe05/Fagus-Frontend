'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { NAVIGATION_ITEMS } from '@/lib/constants';

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-300 ${
        scrolled
          ? 'bg-white/98 backdrop-blur-md shadow-[0_2px_20px_rgba(0,0,0,0.08)]'
          : 'bg-transparent'
      }`}
      style={{ height: '70px' }}
    >
      <div className="container-custom h-full flex items-center justify-between">
        {/* Logo & Company Name */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="relative w-[45px] h-[45px]">
            <Image
              src="/logo-color.png"
              alt="Broetzens IT Cattles & Cows"
              fill
              className="object-contain transition-transform duration-300 group-hover:scale-110"
              priority
            />
          </div>
          <span className="title-medium text-text-dark group-hover:text-primary transition-colors hidden md:inline-block">
            Broetzens IT Cattles & Cows
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-8">
          {NAVIGATION_ITEMS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center gap-2 label-large text-text-medium hover:text-primary transition-colors group"
            >
              <span className="material-symbols-outlined text-[20px] group-hover:scale-110 transition-transform">
                {item.icon}
              </span>
              <span>{item.label}</span>
            </Link>
          ))}
        </nav>

        {/* CTA Button */}
        <div className="flex items-center gap-4">
          <Link
            href="/kontakt"
            className="flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-full label-large hover:bg-primary-light hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300"
          >
            <span className="material-symbols-outlined text-[20px]">call</span>
            <span className="hidden sm:inline">Ruf an!</span>
          </Link>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-text-dark hover:text-primary transition-colors"
            aria-label="Menü öffnen"
          >
            <span className="material-symbols-outlined text-[28px]">
              {mobileMenuOpen ? 'close' : 'menu'}
            </span>
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden absolute top-[70px] left-0 right-0 bg-white border-t border-border-light shadow-lg">
          <nav className="container-custom py-4 flex flex-col gap-4">
            {NAVIGATION_ITEMS.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-3 label-large text-text-medium hover:text-primary transition-colors py-2"
              >
                <span className="material-symbols-outlined text-[20px]">
                  {item.icon}
                </span>
                <span>{item.label}</span>
              </Link>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
}
