import React from 'react';

interface IScanLogoProps {
  className?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg';
  showText?: boolean;
}

export const IScanLogo: React.FC<IScanLogoProps> = ({
  className = '',
  size = 'sm',
  showText = false
}) => {
  // Size mapping for small/medium dimensions
  const sizeClasses = {
    xs: 'h-6 w-6',
    sm: 'h-8 w-8',
    md: 'h-10 w-10',
    lg: 'h-14 w-14'
  }[size];

  return (
    <div className={`inline-flex items-center gap-2.5 select-none ${className}`}>
      {/* Icon Emblem */}
      <div className={`relative shrink-0 ${sizeClasses} rounded-lg overflow-hidden flex items-center justify-center`}>
        <svg
          viewBox="0 0 512 512"
          className="w-full h-full object-contain"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient id="iscanShield" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#22c55e" />
              <stop offset="100%" stopColor="#15803d" />
            </linearGradient>
            <filter id="iscanDrop" x="-10%" y="-10%" width="120%" height="120%">
              <feDropShadow dx="0" dy="2" stdDeviation="4" floodColor="#0b2545" floodOpacity="0.12" />
            </filter>
          </defs>

          {/* Background Squircle Container */}
          <rect x="20" y="20" width="472" height="472" rx="90" fill="#ffffff" stroke="#e2e8f0" strokeWidth="8" filter="url(#iscanDrop)" />

          {/* Outer Phone Outline */}
          <path
            d="M 175 75 C 175 75, 175 87, 185 87 L 327 87 C 337 87, 337 75, 337 75 L 360 75 C 385 75, 400 90, 400 115 L 400 150 M 400 210 L 400 280 M 400 340 L 400 380 C 400 405, 385 420, 360 420 L 152 420 C 127 420, 112 405, 112 380 L 112 340 M 112 280 L 112 210 M 112 150 L 112 115 C 112 90, 127 75, 152 75 Z"
            fill="none"
            stroke="#0b2545"
            strokeWidth="18"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Speaker Notch */}
          <line x1="225" y1="80" x2="287" y2="80" stroke="#0b2545" strokeWidth="7" strokeLinecap="round" />

          {/* Green Laser Scan Reticle Corners */}
          <path d="M 162 138 H 126 C 118 138, 112 144, 112 152 V 188" fill="none" stroke="#16a34a" strokeWidth="15" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M 350 138 H 386 C 394 138, 400 144, 400 152 V 188" fill="none" stroke="#16a34a" strokeWidth="15" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M 112 300 V 336 C 112 344, 118 350, 126 350 H 162" fill="none" stroke="#16a34a" strokeWidth="15" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M 400 300 V 336 C 400 344, 394 350, 386 350 H 350" fill="none" stroke="#16a34a" strokeWidth="15" strokeLinecap="round" strokeLinejoin="round" />

          {/* Horizontal Green Laser Scan Line */}
          <line x1="106" y1="244" x2="406" y2="244" stroke="#16a34a" strokeWidth="11" strokeLinecap="round" />

          {/* 3D Packaged Commodity Box (Navy & Perspective Facets) */}
          <polygon points="178,160 268,135 325,160 235,185" fill="#d0dbe7" stroke="#0b2545" strokeWidth="6" strokeLinejoin="round" />
          <polygon points="305,160 325,160 325,315 305,335" fill="#08182b" stroke="#0b2545" strokeWidth="5" strokeLinejoin="round" />
          <rect x="178" y="160" width="127" height="175" rx="8" fill="#0b2545" stroke="#0b2545" strokeWidth="5" />

          {/* Commodity Details Lines */}
          <rect x="198" y="195" width="58" height="8" rx="4" fill="#ffffff" />
          <rect x="198" y="212" width="42" height="8" rx="4" fill="#ffffff" />

          {/* Barcode Graphic */}
          <g transform="translate(196, 272)">
            <rect x="0" y="0" width="6" height="44" fill="#ffffff" />
            <rect x="9" y="0" width="8" height="44" fill="#ffffff" />
            <rect x="20" y="0" width="4" height="44" fill="#ffffff" />
            <rect x="27" y="0" width="9" height="44" fill="#ffffff" />
            <rect x="39" y="0" width="4" height="44" fill="#ffffff" />
            <rect x="46" y="0" width="9" height="44" fill="#ffffff" />
            <rect x="58" y="0" width="6" height="44" fill="#ffffff" />
            <rect x="67" y="0" width="8" height="44" fill="#ffffff" />
            <rect x="78" y="0" width="5" height="44" fill="#ffffff" />
            <rect x="86" y="0" width="6" height="44" fill="#ffffff" />
          </g>

          {/* Verification Shield with Checkmark */}
          <path
            d="M 320 270 Q 375 255 410 270 Q 415 340 375 375 Q 335 340 320 270 Z"
            fill="url(#iscanShield)"
            stroke="#15803d"
            strokeWidth="3"
          />
          <path
            d="M 345 318 L 366 338 L 400 296"
            fill="none"
            stroke="#ffffff"
            strokeWidth="13"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>

      {/* Optional Branding Text */}
      {showText && (
        <div className="leading-tight">
          <div className="flex items-center">
            <span className="font-black text-emerald-600 text-lg sm:text-xl">i-</span>
            <span className="font-black text-slate-900 text-lg sm:text-xl">Scan</span>
          </div>
          <p className="text-[9px] sm:text-[10px] font-extrabold uppercase tracking-widest text-slate-500">
            SCAN • CHECK • COMPLY
          </p>
        </div>
      )}
    </div>
  );
};
