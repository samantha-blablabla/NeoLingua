
import React from 'react';

const GrainOverlay: React.FC = () => {
  return (
    <div className="fixed inset-0 pointer-events-none z-[9999] opacity-[0.04] mix-blend-soft-light">
      <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
        <filter id="noiseFilter">
          <feTurbulence 
            type="fractalNoise" 
            baseFrequency="0.8" 
            numOctaves="4" 
            stitchTiles="stitch" />
        </filter>
        <rect width="100%" height="100%" filter="url(#noiseFilter)" />
      </svg>
    </div>
  );
};

export default GrainOverlay;
