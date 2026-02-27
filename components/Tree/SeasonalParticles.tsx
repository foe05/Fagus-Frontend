'use client';

import { useEffect, useState, useMemo } from 'react';
import Particles, { initParticlesEngine } from '@tsparticles/react';
import { loadSlim } from '@tsparticles/slim';
import type { ISourceOptions } from '@tsparticles/engine';
import type { Season } from '@/lib/seasons';

// Particle configs per season — contained to parent via CSS
function getParticleOptions(season: Season): ISourceOptions {
  const base: Partial<ISourceOptions> = {
    fullScreen: { enable: false },
    fpsLimit: 60,
    detectRetina: true,
  };

  switch (season) {
    case 'spring':
      return {
        ...base,
        particles: {
          number: { value: 25, density: { enable: true } },
          color: { value: ['#FFB7C5', '#FFC0CB', '#FFFFFF', '#FFD1DC'] },
          shape: { type: 'circle' },
          opacity: { value: { min: 0.4, max: 0.8 } },
          size: { value: { min: 3, max: 7 } },
          move: {
            enable: true,
            speed: { min: 0.5, max: 1.5 },
            direction: 'bottom',
            straight: false,
            outModes: { default: 'out', top: 'out' },
            drift: { min: -0.5, max: 0.5 },
          },
        },
      } as ISourceOptions;

    case 'summer':
      return {
        ...base,
        particles: {
          number: { value: 15, density: { enable: true } },
          color: { value: ['#FFD700', '#FFF8DC', '#FFFACD'] },
          shape: { type: 'circle' },
          opacity: { value: { min: 0.1, max: 0.3 } },
          size: { value: { min: 2, max: 5 } },
          move: {
            enable: true,
            speed: { min: 0.2, max: 0.6 },
            direction: 'none',
            straight: false,
            outModes: { default: 'out' },
            drift: { min: -0.3, max: 0.3 },
          },
        },
      } as ISourceOptions;

    case 'autumn':
      return {
        ...base,
        particles: {
          number: { value: 20, density: { enable: true } },
          color: { value: ['#D2691E', '#CD853F', '#DAA520', '#B8860B', '#8B4513'] },
          shape: { type: 'circle' },
          opacity: { value: { min: 0.5, max: 0.9 } },
          size: { value: { min: 4, max: 10 } },
          move: {
            enable: true,
            speed: { min: 0.8, max: 2 },
            direction: 'bottom',
            straight: false,
            outModes: { default: 'out', top: 'out' },
            drift: { min: -1, max: 1 },
          },
          rotate: {
            value: { min: 0, max: 360 },
            direction: 'random',
            animation: { enable: true, speed: 5 },
          },
        },
      } as ISourceOptions;

    case 'winter':
      return {
        ...base,
        particles: {
          number: { value: 35, density: { enable: true } },
          color: { value: '#FFFFFF' },
          shape: { type: 'circle' },
          opacity: { value: { min: 0.3, max: 0.9 } },
          size: { value: { min: 1, max: 5 } },
          move: {
            enable: true,
            speed: { min: 0.5, max: 2 },
            direction: 'bottom',
            straight: false,
            outModes: { default: 'out', top: 'out' },
            drift: { min: -0.5, max: 0.5 },
          },
        },
      } as ISourceOptions;
  }
}

interface SeasonalParticlesProps {
  season: Season;
}

export default function SeasonalParticles({ season }: SeasonalParticlesProps) {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    initParticlesEngine(async (engine) => {
      await loadSlim(engine);
    }).then(() => setReady(true));
  }, []);

  const options = useMemo(() => getParticleOptions(season), [season]);

  if (!ready) return null;

  return (
    <Particles
      id="seasonal-particles"
      options={options}
      className="absolute inset-0 pointer-events-none"
    />
  );
}
