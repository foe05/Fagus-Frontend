'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { HOTSPOTS } from '@/lib/constants';
import type { Hotspot as HotspotType } from '@/lib/types';
import Hotspot from './Hotspot';
import Popup from './Popup';

export default function TreeContainer() {
  const [selectedHotspot, setSelectedHotspot] = useState<HotspotType | null>(null);
  const [imageLoaded, setImageLoaded] = useState(false);
  const previouslyFocusedElement = useRef<Element | null>(null);

  const handleHotspotClick = (hotspot: HotspotType) => {
    // Store the currently focused element before opening popup
    previouslyFocusedElement.current = document.activeElement;
    setSelectedHotspot(hotspot);
  };

  const handleClosePopup = () => {
    setSelectedHotspot(null);
  };

  // Coordinate focus restoration when popup closes
  useEffect(() => {
    if (!selectedHotspot && previouslyFocusedElement.current instanceof HTMLElement) {
      // Small delay to ensure popup has fully unmounted
      const timeoutId = setTimeout(() => {
        if (previouslyFocusedElement.current instanceof HTMLElement) {
          previouslyFocusedElement.current.focus();
        }
      }, 0);

      return () => clearTimeout(timeoutId);
    }
  }, [selectedHotspot]);

  return (
    <div className="relative w-full min-h-screen">
      {/* Tree Image */}
      <div className="relative w-full h-screen bg-gray-200">
        {!imageLoaded && (
          <div className="absolute inset-0 bg-gradient-to-br from-gray-200 via-gray-100 to-gray-200 animate-pulse" />
        )}
        <Image
          src="/baum.webp"
          alt="Majestätische Rotbuche mit sichtbaren Wurzeln"
          fill
          className={`object-cover transition-opacity duration-700 ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
          priority
          quality={85}
          onLoad={() => setImageLoaded(true)}
        />

        {/* Hotspots */}
        <div className="absolute inset-0 pointer-events-none">
          {HOTSPOTS.map((hotspot, index) => (
            <Hotspot
              key={hotspot.id}
              hotspot={hotspot}
              onClick={handleHotspotClick}
              index={index}
            />
          ))}
        </div>
      </div>

      {/* Scroll Indicator */}
      <ScrollIndicator />

      {/* Popup */}
      {selectedHotspot && (
        <Popup hotspot={selectedHotspot} onClose={handleClosePopup} />
      )}
    </div>
  );
}

function ScrollIndicator() {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const handleScroll = () => {
      setVisible(window.scrollY < 100);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (!visible) return null;

  return (
    <div
      className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 flex flex-col items-center gap-3"
      style={{
        animation: 'bounce 2s infinite',
      }}
    >
      <div className="w-8 h-12 border-2 border-text-light rounded-full flex items-start justify-center p-2">
        <div
          className="w-1.5 h-2 bg-text-light rounded-full"
          style={{
            animation: 'scrollDown 2s infinite',
          }}
        />
      </div>
      <p className="label-large text-text-medium">Scroll nach unten</p>

      <style jsx>{`
        @keyframes scrollDown {
          0%, 100% {
            transform: translateY(0);
            opacity: 0;
          }
          50% {
            transform: translateY(8px);
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
}
