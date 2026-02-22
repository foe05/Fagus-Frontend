'use client';

import { useEffect, useRef } from 'react';
import Link from 'next/link';
import type { Hotspot } from '@/lib/types';

interface PopupProps {
  hotspot: Hotspot;
  onClose: () => void;
  returnFocusRef?: React.RefObject<HTMLElement>;
}

export default function Popup({ hotspot, onClose, returnFocusRef }: PopupProps) {
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);
  const previouslyFocusedElement = useRef<Element | null>(null);

  useEffect(() => {
    previouslyFocusedElement.current = document.activeElement;
    const initialReturnFocus = returnFocusRef?.current ?? null;

    // Close on ESC key
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    // Focus trap
    const handleTab = (e: KeyboardEvent) => {
      if (e.key !== 'Tab' || !dialogRef.current) return;
      const focusable = dialogRef.current.querySelectorAll<HTMLElement>(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      if (focusable.length === 0) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };

    // Prevent body scroll
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', handleEsc);
    window.addEventListener('keydown', handleTab);
    closeButtonRef.current?.focus();

    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleEsc);
      window.removeEventListener('keydown', handleTab);
      // Prioritize returnFocusRef over previouslyFocusedElement
      if (initialReturnFocus) {
        initialReturnFocus.focus();
      } else if (previouslyFocusedElement.current instanceof HTMLElement) {
        previouslyFocusedElement.current.focus();
      }
    };
  }, [onClose, returnFocusRef]);

  return (
    <div
      className="fixed inset-0 z-[200] flex items-center justify-center p-4"
      onClick={onClose}
      style={{
        background: 'rgba(0, 0, 0, 0.75)',
        backdropFilter: 'blur(10px)',
        animation: 'fadeIn 0.3s ease-out',
      }}
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="popup-title"
        className="relative bg-white rounded-3xl max-w-lg w-full p-8 shadow-[0_30px_80px_rgba(0,0,0,0.4)]"
        onClick={(e) => e.stopPropagation()}
        style={{
          animation: 'slideUp 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
        }}
      >
        {/* Close Button */}
        <button
          ref={closeButtonRef}
          onClick={onClose}
          className="absolute top-4 right-4 w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors group"
          aria-label="Schließen"
        >
          <span className="material-symbols-outlined text-text-medium group-hover:text-text-dark text-[24px]">
            close
          </span>
        </button>

        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <div
            className={`w-16 h-16 rounded-full flex items-center justify-center popup-icon-${hotspot.type}`}
            style={{
              background: getTypeColor(hotspot.type),
            }}
          >
            <span className="material-symbols-outlined text-white text-[32px]">
              {hotspot.icon}
            </span>
          </div>
          <h2 id="popup-title" className="headline-small text-text-dark">
            {hotspot.title}
          </h2>
        </div>

        {/* Description */}
        <p className="body-large text-text-medium mb-6">
          {hotspot.description}
        </p>

        {/* Features List */}
        {hotspot.features && hotspot.features.length > 0 && (
          <ul className="space-y-3 mb-8">
            {hotspot.features.map((feature, index) => (
              <li key={index} className="body-medium text-text-medium flex items-start gap-3">
                <span className="text-green-600 mt-0.5">✓</span>
                <span>{feature}</span>
              </li>
            ))}
          </ul>
        )}

        {/* CTA Button */}
        <Link
          href={hotspot.link}
          className="flex items-center justify-center gap-2 w-full py-4 px-6 rounded-full label-large text-white transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5"
          style={{
            background: getTypeColor(hotspot.type),
          }}
        >
          <span>Mehr erfahren</span>
          <span className="material-symbols-outlined text-[20px]">arrow_forward</span>
        </Link>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}

function getTypeColor(type: Hotspot['type']): string {
  const colors = {
    produkte: 'var(--primary)',
    services: 'var(--primary-light)',
    blog: 'var(--secondary)',
    referenzen: 'var(--accent)',
    team: 'var(--accent)',
    werte: 'var(--primary)',
    themen: 'var(--secondary)',
  };
  return colors[type];
}
