import React from 'react';

interface EqualizerBarsProps {
  isPlaying?: boolean;
  className?: string;
}

export const EqualizerBars: React.FC<EqualizerBarsProps> = ({
  isPlaying = true,
  className = '',
}) => {
  return (
    <div className={`flex items-end gap-1 h-5 ${className}`}>
      <span
        className={`w-1 rounded-full bg-[#00F59B] ${
          isPlaying ? 'animate-eq-1' : 'h-2'
        }`}
      />
      <span
        className={`w-1 rounded-full bg-[#06B6D4] ${
          isPlaying ? 'animate-eq-2' : 'h-3'
        }`}
      />
      <span
        className={`w-1 rounded-full bg-[#A855F7] ${
          isPlaying ? 'animate-eq-3' : 'h-1.5'
        }`}
      />
      <span
        className={`w-1 rounded-full bg-[#EC4899] ${
          isPlaying ? 'animate-eq-4' : 'h-3.5'
        }`}
      />
      <span
        className={`w-1 rounded-full bg-[#FFE600] ${
          isPlaying ? 'animate-eq-2' : 'h-2'
        }`}
      />
    </div>
  );
};
