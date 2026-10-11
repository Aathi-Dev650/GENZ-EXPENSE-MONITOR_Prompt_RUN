import React from 'react';

interface MascotBadgeProps {
  size?: 'sm' | 'md' | 'lg';
  withCoins?: boolean;
  className?: string;
}

export const MascotBadge: React.FC<MascotBadgeProps> = ({
  size = 'md',
  withCoins = false,
  className = '',
}) => {
  const pixelSize =
    size === 'sm' ? 'w-8 h-8' : size === 'lg' ? 'w-16 h-16' : 'w-12 h-12';

  return (
    <div className={`relative inline-flex items-center justify-center ${className}`}>
      {/* SVG Retro Pixel Character with sunglasses */}
      <svg
        className={`${pixelSize} drop-shadow-[0_4px_12px_rgba(0,245,155,0.4)]`}
        viewBox="0 0 48 48"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Face shape */}
        <rect x="8" y="10" width="32" height="28" rx="8" fill="#00F59B" />
        <rect x="10" y="8" width="28" height="32" rx="6" fill="#10B981" />
        <rect x="12" y="10" width="24" height="26" rx="6" fill="#22C55E" />

        {/* Highlight sheen */}
        <rect x="14" y="12" width="6" height="3" rx="1.5" fill="#A7F3D0" />

        {/* Cool Sunglasses frame */}
        <path
          d="M10 18H38V24C38 25.1 37.1 26 36 26H28C26.9 26 26 25.1 26 24V22H22V24C22 25.1 21.1 26 20 26H12C10.9 26 10 25.1 10 24V18Z"
          fill="#0B0F17"
        />
        {/* Sunglasses purple / magenta reflection */}
        <path d="M12 20H18L16 24H12V20Z" fill="#D946EF" opacity="0.8" />
        <path d="M28 20H34L32 24H28V20Z" fill="#8B5CF6" opacity="0.8" />
        <rect x="14" y="20" width="3" height="1" fill="#FFFFFF" />
        <rect x="30" y="20" width="3" height="1" fill="#FFFFFF" />

        {/* Smug smile */}
        <path
          d="M18 30C19.5 32.5 24 33.5 28 31.5"
          stroke="#064E3B"
          strokeWidth="2.5"
          strokeLinecap="round"
        />
        {/* Blush dots */}
        <circle cx="13" cy="28" r="2" fill="#F43F5E" opacity="0.6" />
        <circle cx="35" cy="28" r="2" fill="#F43F5E" opacity="0.6" />
      </svg>

      {/* Optional floating coin badge */}
      {withCoins && (
        <div className="absolute -bottom-1 -right-1 bg-amber-400 text-amber-950 font-black text-[10px] w-5 h-5 rounded-full flex items-center justify-center border-2 border-[#0b0f17] shadow-sm animate-bounce">
          ₹
        </div>
      )}
    </div>
  );
};
