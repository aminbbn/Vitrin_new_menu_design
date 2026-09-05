import React from 'react';
import { ThemeId, BackgroundIntensity } from '../../types/menu';
import { hexToRgba, normalizeHex } from '../../utils/themeColors';

interface MenuThemeBackgroundProps {
  themeId: ThemeId;
  primaryColor: string;
  secondaryColor: string;
  intensity?: BackgroundIntensity;
  className?: string;
}

// Lightweight static SVG noise data-URI for subtle organic texture
const SVG_NOISE_URI = `data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E`;

export const MenuThemeBackground: React.FC<MenuThemeBackgroundProps> = ({
  themeId,
  primaryColor,
  secondaryColor,
  intensity = 'balanced',
  className = '',
}) => {
  const normPrimary = normalizeHex(primaryColor) || '#D4AF37';
  const normSecondary = normalizeHex(secondaryColor) || '#B76E79';

  // Intensity multipliers (purely static opacity modulation)
  const multiplier = intensity === 'soft' ? 0.65 : intensity === 'strong' ? 1.4 : 1.0;

  return (
    <div
      className={`absolute inset-0 pointer-events-none overflow-hidden z-0 select-none ${className}`}
      aria-hidden="true"
    >
      {/* ------------------------------------------------------------------ */}
      {/* Style 1: Obsidian Atmosphere                                       */}
      {/* ------------------------------------------------------------------ */}
      {themeId === 'immersive' && (
        <div className="absolute inset-0">
          {/* Neutral Obsidian Base */}
          <div className="absolute inset-0 bg-[#070b0e]" />

          {/* Primary Atmospheric Light Field (Upper Right / Center) - 6-8% opacity */}
          <div
            className="absolute -top-[10%] -right-[15%] w-[550px] sm:w-[700px] h-[550px] sm:h-[700px] rounded-full filter blur-[120px] sm:blur-[160px] pointer-events-none"
            style={{
              backgroundColor: normPrimary,
              opacity: Math.min(0.18, 0.075 * multiplier),
              mixBlendMode: 'screen',
            }}
          />

          {/* Secondary Atmospheric Light Field (Lower Left) - 4-5% opacity */}
          <div
            className="absolute top-[45%] -left-[20%] w-[450px] sm:w-[600px] h-[450px] sm:h-[600px] rounded-full filter blur-[130px] sm:blur-[170px] pointer-events-none"
            style={{
              backgroundColor: normSecondary,
              opacity: Math.min(0.14, 0.05 * multiplier),
              mixBlendMode: 'screen',
            }}
          />

          {/* Very soft edge vignette */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background: 'radial-gradient(ellipse at 50% 30%, transparent 35%, rgba(4,6,8,0.7) 100%)',
            }}
          />

          {/* Ultra-subtle mineral grain texture */}
          <div
            className="absolute inset-0 pointer-events-none mix-blend-overlay"
            style={{
              backgroundImage: `url("${SVG_NOISE_URI}")`,
              backgroundSize: '160px 160px',
              opacity: 0.028,
            }}
          />
        </div>
      )}

      {/* ------------------------------------------------------------------ */}
      {/* Style 2: Premium Paper / Linen Background                          */}
      {/* ------------------------------------------------------------------ */}
      {themeId === 'modern' && (
        <div className="absolute inset-0">
          {/* Warm Ivory / Cream Base */}
          <div className="absolute inset-0 bg-[#FAF8F5]" />

          {/* Subtle Tonal Depth / Soft Warm Perimeter Vignette */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background: 'radial-gradient(ellipse at 50% 15%, #FAF8F5 50%, #F3EFEA 100%)',
            }}
          />

          {/* Soft Primary Brand Tint (Upper-Center / Left) - 2.5-3.5% opacity */}
          <div
            className="absolute -top-[5%] -left-[10%] w-[500px] sm:w-[650px] h-[500px] sm:h-[650px] rounded-full filter blur-[140px] pointer-events-none"
            style={{
              backgroundColor: normPrimary,
              opacity: Math.min(0.08, 0.03 * multiplier),
              mixBlendMode: 'multiply',
            }}
          />

          {/* Soft Secondary Brand Tint (Mid-Right / Lower) - 2-3% opacity */}
          <div
            className="absolute top-[40%] -right-[15%] w-[450px] sm:w-[600px] h-[450px] sm:h-[600px] rounded-full filter blur-[140px] pointer-events-none"
            style={{
              backgroundColor: normSecondary,
              opacity: Math.min(0.07, 0.025 * multiplier),
              mixBlendMode: 'multiply',
            }}
          />

          {/* Refined tactile paper grain (barely perceptible, warm fiber look) */}
          <div
            className="absolute inset-0 pointer-events-none mix-blend-multiply"
            style={{
              backgroundImage: `url("${SVG_NOISE_URI}")`,
              backgroundSize: '180px 180px',
              opacity: 0.022,
            }}
          />
        </div>
      )}

      {/* ------------------------------------------------------------------ */}
      {/* Style 3: Gallery Spotlight                                         */}
      {/* ------------------------------------------------------------------ */}
      {themeId === 'minimal' && (
        <div className="absolute inset-0">
          {/* Deep Photographic Charcoal Base */}
          <div className="absolute inset-0 bg-[#0D0F12]" />

          {/* Subtle Brighter Center Neutral Glow behind gallery content */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background: 'radial-gradient(ellipse at 50% 25%, rgba(26,29,35,0.75) 0%, #0D0F12 75%)',
            }}
          />

          {/* Primary Gallery Spotlight (Upper Right) - 4-6% opacity */}
          <div
            className="absolute -top-[8%] right-[5%] w-[450px] sm:w-[600px] h-[450px] sm:h-[600px] rounded-full filter blur-[150px] pointer-events-none"
            style={{
              backgroundColor: normPrimary,
              opacity: Math.min(0.12, 0.05 * multiplier),
              mixBlendMode: 'screen',
            }}
          />

          {/* Secondary Gallery Spotlight (Lower Left) - 3-4.5% opacity */}
          <div
            className="absolute top-[50%] -left-[10%] w-[400px] sm:w-[550px] h-[400px] sm:h-[550px] rounded-full filter blur-[150px] pointer-events-none"
            style={{
              backgroundColor: normSecondary,
              opacity: Math.min(0.1, 0.038 * multiplier),
              mixBlendMode: 'screen',
            }}
          />

          {/* Fine Photographic Gallery Grain */}
          <div
            className="absolute inset-0 pointer-events-none mix-blend-overlay"
            style={{
              backgroundImage: `url("${SVG_NOISE_URI}")`,
              backgroundSize: '140px 140px',
              opacity: 0.024,
            }}
          />

          {/* Soft Edge Perimeter Vignette */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background: 'radial-gradient(circle at 50% 50%, transparent 50%, rgba(5,6,8,0.65) 100%)',
            }}
          />
        </div>
      )}
    </div>
  );
};
