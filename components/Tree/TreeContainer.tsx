'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import Image from 'next/image';
import gsap from 'gsap';
import { HOTSPOTS } from '@/lib/constants';
import type { Hotspot as HotspotType } from '@/lib/types';
import { getCurrentSeason, SEASON_IMAGES, FALLBACK_IMAGE } from '@/lib/seasons';
import { usePlausible } from '@/hooks/usePlausible';
import Hotspot from './Hotspot';
import Popup from './Popup';

export default function TreeContainer() {
  const [selectedHotspot, setSelectedHotspot] = useState<HotspotType | null>(null);
  const [fallbackLoaded, setFallbackLoaded] = useState(false);
  const { trackEvent } = usePlausible();

  const season = getCurrentSeason();
  const seasonalSrc = SEASON_IMAGES[season];

  const fallbackRef = useRef<HTMLDivElement>(null);
  const seasonalRef = useRef<HTMLDivElement>(null);

  // Hotspot ref management
  const hotspotRefs = useRef<Map<string, HTMLButtonElement>>(new Map());
  const returnFocusRef = useRef<HTMLButtonElement | null>(null);

  const setHotspotRef = useCallback(
    (id: string) => (el: HTMLButtonElement | null) => {
      if (el) hotspotRefs.current.set(id, el);
      else hotspotRefs.current.delete(id);
    },
    []
  );

  // GSAP crossfade: once the seasonal image loads, fade it in over the fallback
  const handleSeasonalLoad = useCallback(() => {
    const seasonal = seasonalRef.current;
    const fallback = fallbackRef.current;
    if (!seasonal || !fallback) return;

    // Crossfade: seasonal fades in while fallback fades out (~0.8s)
    const tl = gsap.timeline();
    tl.to(seasonal, { opacity: 1, duration: 0.8, ease: 'power2.inOut' });
    tl.to(fallback, { opacity: 0, duration: 0.8, ease: 'power2.inOut' }, '<');

    return () => { tl.kill(); };
  }, []);

  // If seasonal image fails to load, keep the fallback visible
  const handleSeasonalError = useCallback(() => {
    if (seasonalRef.current) seasonalRef.current.style.display = 'none';
  }, []);

  const handleHotspotClick = (hotspot: HotspotType) => {
    trackEvent('Tree Hotspot Clicked', { hotspot: hotspot.id });
    returnFocusRef.current = hotspotRefs.current.get(hotspot.id) || null;
    setSelectedHotspot(hotspot);
  };

  const handleClosePopup = () => {
    setSelectedHotspot(null);
  };

  return (
    <div className="relative w-full min-h-screen">
      {/* Tree Image Container */}
      <div className="relative w-full h-screen bg-gray-200 overflow-hidden">
        {/* Loading skeleton */}
        {!fallbackLoaded && (
          <div className="absolute inset-0 bg-gradient-to-br from-gray-200 via-gray-100 to-gray-200 animate-pulse" />
        )}

        {/* Fallback image (always loads first, visible immediately) */}
        <div ref={fallbackRef} className="absolute inset-0">
          <Image
            src={FALLBACK_IMAGE}
            alt="Majestätische Rotbuche mit sichtbaren Wurzeln"
            fill
            className={`object-cover transition-opacity duration-700 ${fallbackLoaded ? 'opacity-100' : 'opacity-0'}`}
            priority
            quality={85}
            onLoad={() => setFallbackLoaded(true)}
          />
        </div>

        {/* Seasonal image (fades in over fallback via GSAP) */}
        <div ref={seasonalRef} className="absolute inset-0" style={{ opacity: 0 }}>
          <Image
            src={seasonalSrc}
            alt={`Rotbuche im ${season === 'spring' ? 'Frühling' : season === 'summer' ? 'Sommer' : season === 'autumn' ? 'Herbst' : 'Winter'}`}
            fill
            className="object-cover"
            quality={85}
            onLoad={handleSeasonalLoad}
            onError={handleSeasonalError}
          />
        </div>

        {/* Hotspots */}
        <div className="absolute inset-0 pointer-events-none">
          {HOTSPOTS.map((hotspot, index) => (
            <Hotspot
              key={hotspot.id}
              ref={setHotspotRef(hotspot.id)}
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
        <Popup
          hotspot={selectedHotspot}
          onClose={handleClosePopup}
          returnFocusRef={returnFocusRef.current ? { current: returnFocusRef.current } : undefined}
        />
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
