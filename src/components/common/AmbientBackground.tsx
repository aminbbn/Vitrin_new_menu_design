import React from 'react';

export type AmbientThemeType = 'immersive' | 'modern' | 'minimal';

interface AmbientBackgroundProps {
  theme: AmbientThemeType;
  accentColor?: string;
}

export const AmbientBackground: React.FC<AmbientBackgroundProps> = ({
  theme,
  accentColor,
}) => {
  return (
    <div
      className="absolute inset-0 pointer-events-none overflow-hidden z-0"
      aria-hidden="true"
    >
      {/* -------------------------------------------------------------------- */}
      {/* Theme 01: Immersive / Editorial - Cinematic Emerald & Warm Amber Glow */}
      {/* -------------------------------------------------------------------- */}
      {theme === 'immersive' && (
        <div className="absolute inset-0">
          {/* Base deep background */}
          <div className="absolute inset-0 bg-[#070b0e]" />

          {/* Primary Emerald/Teal Glow Field (Upper Right / Center) */}
          <div
            className="ambient-glow-animated absolute top-[-10%] right-[-15%] w-[450px] sm:w-[600px] h-[450px] sm:h-[600px] rounded-full opacity-20 filter blur-[100px] sm:blur-[130px] mix-blend-screen pointer-events-none"
            style={{
              backgroundColor: '#0d9488',
              animation: 'ambientDrift1 20s ease-in-out infinite alternate',
              willChange: 'transform',
            }}
          />

          {/* Secondary Warm Amber/Gold Glow Field (Lower Left) */}
          <div
            className="ambient-glow-animated absolute top-[40%] left-[-20%] w-[400px] sm:w-[520px] h-[400px] sm:h-[520px] rounded-full opacity-15 filter blur-[110px] sm:blur-[140px] mix-blend-screen pointer-events-none"
            style={{
              backgroundColor: accentColor || '#d4af37',
              animation: 'ambientDrift2 24s ease-in-out infinite alternate',
              willChange: 'transform',
            }}
          />

          {/* Tertiary Subtle Diffuse Cyan Glow (Lower Section) */}
          <div
            className="ambient-glow-animated absolute bottom-[-10%] right-[10%] w-[380px] sm:w-[500px] h-[380px] sm:h-[500px] rounded-full opacity-12 filter blur-[120px] mix-blend-screen pointer-events-none"
            style={{
              backgroundColor: '#0f766e',
              animation: 'ambientDrift3 22s ease-in-out infinite alternate',
              willChange: 'transform',
            }}
          />

          {/* Micro Texture / Paper Grain Overlay */}
          <div
            className="absolute inset-0 opacity-[0.025] mix-blend-overlay pointer-events-none"
            style={{
              backgroundImage: `radial-gradient(circle at 1px 1px, rgba(255,255,255,0.4) 1px, transparent 0)`,
              backgroundSize: '24px 24px',
            }}
          />
        </div>
      )}

      {/* -------------------------------------------------------------------- */}
      {/* Theme 02: Modern / Food-First - Warm Energetic Charcoal & Orange Glow */}
      {/* -------------------------------------------------------------------- */}
      {theme === 'modern' && (
        <div className="absolute inset-0">
          {/* Base charcoal canvas */}
          <div className="absolute inset-0 bg-[#0d1017]" />

          {/* Primary Warm Orange Glow Field (Upper Left / Center) */}
          <div
            className="ambient-glow-animated absolute top-[-5%] left-[-15%] w-[420px] sm:w-[550px] h-[420px] sm:h-[550px] rounded-full opacity-18 filter blur-[100px] sm:blur-[120px] mix-blend-screen pointer-events-none"
            style={{
              backgroundColor: '#ea580c',
              animation: 'ambientDrift1 18s ease-in-out infinite alternate',
              willChange: 'transform',
            }}
          />

          {/* Secondary Crimson / Deep Amber Glow Field (Mid-Right) */}
          <div
            className="ambient-glow-animated absolute top-[45%] right-[-20%] w-[380px] sm:w-[500px] h-[380px] sm:h-[500px] rounded-full opacity-14 filter blur-[110px] sm:blur-[130px] mix-blend-screen pointer-events-none"
            style={{
              backgroundColor: '#c2410c',
              animation: 'ambientDrift2 22s ease-in-out infinite alternate',
              willChange: 'transform',
            }}
          />

          {/* Subtle Warm Grounding Light (Bottom) */}
          <div
            className="ambient-glow-animated absolute bottom-[-15%] left-[10%] w-[400px] sm:w-[500px] h-[400px] sm:h-[500px] rounded-full opacity-10 filter blur-[130px] mix-blend-screen pointer-events-none"
            style={{
              backgroundColor: '#f97316',
              animation: 'ambientDrift3 20s ease-in-out infinite alternate',
              willChange: 'transform',
            }}
          />
        </div>
      )}

      {/* -------------------------------------------------------------------- */}
      {/* Theme 03: Minimal / Architectural - Quiet Graphite & Cool Light Depth*/}
      {/* -------------------------------------------------------------------- */}
      {theme === 'minimal' && (
        <div className="absolute inset-0">
          {/* Base deep graphite canvas */}
          <div className="absolute inset-0 bg-[#0c0e10]" />

          {/* Single Quiet Monochromatic Cool Teal / Slate Light Field */}
          <div
            className="ambient-glow-animated absolute top-[5%] right-[-10%] w-[450px] sm:w-[600px] h-[450px] sm:h-[600px] rounded-full opacity-10 filter blur-[130px] sm:blur-[160px] mix-blend-screen pointer-events-none"
            style={{
              backgroundColor: '#0d9488',
              animation: 'ambientDrift1 26s ease-in-out infinite alternate',
              willChange: 'transform',
            }}
          />

          {/* Subtle Slate Diffuse Light Field (Lower Center) */}
          <div
            className="ambient-glow-animated absolute bottom-[10%] left-[-15%] w-[400px] sm:w-[500px] h-[400px] sm:h-[500px] rounded-full opacity-[0.06] filter blur-[140px] mix-blend-screen pointer-events-none"
            style={{
              backgroundColor: '#475569',
              animation: 'ambientDrift2 28s ease-in-out infinite alternate',
              willChange: 'transform',
            }}
          />

          {/* Minimal Grid Line Guide (Barely perceptible) */}
          <div
            className="absolute inset-0 opacity-[0.015] pointer-events-none"
            style={{
              backgroundImage: `linear-gradient(to right, rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.1) 1px, transparent 1px)`,
              backgroundSize: '48px 48px',
            }}
          />
        </div>
      )}
    </div>
  );
};
