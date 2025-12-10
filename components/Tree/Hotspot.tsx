'use client';

import type { Hotspot as HotspotType } from '@/lib/types';

interface HotspotProps {
  hotspot: HotspotType;
  onClick: (hotspot: HotspotType) => void;
  index: number;
}

export default function Hotspot({ hotspot, onClick, index }: HotspotProps) {
  return (
    <div
      className="hotspot group"
      style={{
        position: 'absolute',
        left: hotspot.position.left,
        top: hotspot.position.top,
        transform: 'translate(-50%, -50%)',
        cursor: 'pointer',
        pointerEvents: 'auto',
        opacity: 0,
        animation: `fadeInPop 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards`,
        animationDelay: `${0.3 + index * 0.2}s`,
      }}
      onClick={() => onClick(hotspot)}
    >
      <div className="relative">
        {/* Pulse Ring */}
        <div
          className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full animate-pulse-ring hotspot-${hotspot.type}`}
          style={{
            width: '50px',
            height: '50px',
            animation: 'pulse 2.5s ease-in-out infinite',
          }}
        />

        {/* Circle */}
        <div className="relative w-[50px] h-[50px] rounded-full bg-white/95 border-2 border-text-light flex items-center justify-center transition-all duration-300 group-hover:scale-115 group-hover:bg-white group-hover:shadow-[0_8px_20px_rgba(0,0,0,0.25)]">
          <span className="material-symbols-outlined text-text-medium text-[24px] transition-colors duration-300">
            {hotspot.icon}
          </span>
        </div>

        {/* Label */}
        <div className="absolute top-[60px] left-1/2 -translate-x-1/2 whitespace-nowrap label-medium text-text-dark opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-white px-3 py-1 rounded-full shadow-md">
          {hotspot.label}
        </div>
      </div>

      <style jsx>{`
        .hotspot-produkte .absolute {
          background: var(--primary);
        }
        .group:hover .hotspot-produkte ~ div .material-symbols-outlined {
          color: var(--primary);
        }

        .hotspot-services .absolute {
          background: var(--primary-light);
        }

        .hotspot-blog .absolute {
          background: var(--secondary);
        }

        .hotspot-referenzen .absolute {
          background: var(--accent);
        }

        .hotspot-team .absolute {
          background: var(--accent);
        }

        .hotspot-werte .absolute {
          background: var(--primary);
        }

        @keyframes pulse {
          0%, 100% {
            width: 50px;
            height: 50px;
            opacity: 0.3;
          }
          50% {
            width: 70px;
            height: 70px;
            opacity: 0.6;
          }
        }

        @keyframes fadeInPop {
          0% {
            opacity: 0;
            transform: translate(-50%, -50%) scale(0);
          }
          100% {
            opacity: 1;
            transform: translate(-50%, -50%) scale(1);
          }
        }
      `}</style>
    </div>
  );
}
