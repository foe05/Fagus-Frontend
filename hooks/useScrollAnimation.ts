'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';

export interface ScrollAnimationOptions {
  delay?: number;
  duration?: number;
  y?: number;
  opacity?: number;
  scale?: number;
  stagger?: number;
}

/**
 * Custom Hook für GSAP Scroll-Animationen
 * Animiert Elemente beim Einscrollens
 */
export function useScrollAnimation<T extends HTMLElement>(
  options: ScrollAnimationOptions = {}
) {
  const ref = useRef<T>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const {
      delay = 0,
      duration = 0.8,
      y = 30,
      opacity = 0,
      scale = 1,
      stagger = 0,
    } = options;

    // Initial State
    gsap.set(element, {
      opacity,
      y,
      scale: scale !== 1 ? scale : undefined,
    });

    // Intersection Observer für bessere Performance
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            // Element ist im Viewport - Animation starten
            if (element.children.length > 0 && stagger > 0) {
              // Mit Stagger für Kinder
              gsap.to(element.children, {
                opacity: 1,
                y: 0,
                scale: 1,
                duration,
                delay,
                stagger,
                ease: 'power3.out',
              });
            } else {
              // Einzelnes Element
              gsap.to(element, {
                opacity: 1,
                y: 0,
                scale: 1,
                duration,
                delay,
                ease: 'power3.out',
              });
            }

            // Observer entfernen nach Animation
            observer.unobserve(element);
          }
        });
      },
      {
        threshold: 0.1, // 10% des Elements muss sichtbar sein
        rootMargin: '0px 0px -100px 0px', // Startet etwas früher
      }
    );

    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, [options]);

  return ref;
}
