import React from 'react';

interface AquaLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  withWordmark?: boolean;
  withTagline?: boolean;
  className?: string;
  animate?: boolean;
}

export const AquaLogo: React.FC<AquaLogoProps> = ({
  size = 'md',
  withWordmark = false,
  withTagline = false,
  className = '',
  animate = true,
}) => {
  const pixelSizes = {
    sm: 32,
    md: 44,
    lg: 64,
    xl: 96,
  };

  const dim = pixelSizes[size];

  return (
    <div className={`inline-flex items-center gap-3 select-none ${className}`}>
      {/* Droplet Graphic */}
      <div
        className={`relative flex items-center justify-center shrink-0 ${
          animate ? 'animate-droplet' : ''
        }`}
        style={{ width: dim, height: dim }}
      >
        {/* Subtle background ambient glow */}
        <div
          className="absolute inset-0 rounded-full bg-gradient-to-tr from-cyan-400/30 to-blue-500/20 blur-md pointer-events-none"
          style={{ transform: 'scale(1.2)' }}
        />

        <svg
          viewBox="0 0 128 128"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full relative z-10 transition-transform duration-300 hover:scale-105"
          aria-label="AquaTrack Logo Droplet"
        >
          <defs>
            <linearGradient id="logoDropGrad" x1="64" y1="12" x2="64" y2="116" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#22D3EE" />
              <stop offset="45%" stopColor="#1677E8" />
              <stop offset="100%" stopColor="#0B408C" />
            </linearGradient>

            <linearGradient id="logoInnerGlow" x1="48" y1="24" x2="80" y2="96" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.85" />
              <stop offset="50%" stopColor="#2DD4BF" stopOpacity="0.35" />
              <stop offset="100%" stopColor="#1677E8" stopOpacity="0" />
            </linearGradient>

            <linearGradient id="logoSpecular" x1="40" y1="20" x2="60" y2="60" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.95" />
              <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0" />
            </linearGradient>
          </defs>

          {/* Ripple rings beneath droplet */}
          <ellipse cx="64" cy="112" rx="42" ry="9" stroke="#22D3EE" strokeOpacity="0.3" strokeWidth="1.5" />
          <ellipse cx="64" cy="112" rx="26" ry="6" stroke="#2DD4BF" strokeOpacity="0.5" strokeWidth="1.5" />

          {/* Symmetrical Water Droplet Silhouette */}
          <path
            d="M64 16 C64 16, 26 64, 26 88 C26 105 40 114 64 114 C88 114 102 105 102 88 C102 64 64 16 64 16 Z"
            fill="url(#logoDropGrad)"
          />

          {/* Internal Flow Ripple */}
          <path
            d="M44 88 C48 96 56 100 64 100 C72 100 80 96 84 88"
            stroke="#2DD4BF"
            strokeWidth="2.5"
            strokeLinecap="round"
            opacity="0.7"
          />

          {/* Inner Light Depth */}
          <path
            d="M64 22 C64 22, 33 66, 33 88 C33 98 43 106 64 106 C85 106 95 98 95 88 C95 66 64 22 64 22 Z"
            fill="url(#logoInnerGlow)"
          />

          {/* Specular glass highlight reflection */}
          <path
            d="M62 25 C62 25, 36 64, 36 82 C36 88 38 92 42 94 C40 88 40 76 50 56 C55 46 62 33 62 25 Z"
            fill="url(#logoSpecular)"
          />

          {/* Shimmer sparkle */}
          <circle cx="76" cy="44" r="2.5" fill="#FFFFFF" opacity="0.8" />
        </svg>
      </div>

      {/* Wordmark and Optional Tagline */}
      {withWordmark && (
        <div className="flex flex-col">
          <div className="flex items-center text-left leading-none tracking-tight">
            <span className="font-display font-bold text-2xl md:text-3xl bg-gradient-to-r from-blue-600 via-cyan-500 to-teal-400 bg-clip-text text-transparent">
              Aqua
            </span>
            <span className="font-display font-semibold text-2xl md:text-3xl text-[#10243A] dark:text-[#F1F7FF]">
              Track
            </span>
          </div>

          {withTagline && (
            <p className="text-[11px] md:text-xs font-medium text-slate-500 dark:text-cyan-300/80 tracking-wide mt-1">
              Track Every Drop. Protect Every Tomorrow.
            </p>
          )}
        </div>
      )}
    </div>
  );
};
