import React from 'react';
import { MenuThemeBackground } from './MenuThemeBackground';
import { BackgroundIntensity, ThemeId } from '../../types/menu';
import { resolveThemeColors } from '../../utils/themeColors';

export type AmbientThemeType = 'immersive' | 'modern' | 'minimal';

export interface AmbientBackgroundProps {
  theme: AmbientThemeType;
  primaryColor?: string;
  secondaryColor?: string;
  accentColor?: string;
  intensity?: BackgroundIntensity;
  className?: string;
}

export const AmbientBackground: React.FC<AmbientBackgroundProps> = ({
  theme,
  primaryColor,
  secondaryColor,
  accentColor,
  intensity = 'balanced',
  className = '',
}) => {
  const resolved = resolveThemeColors(
    {
      primaryColor: primaryColor || accentColor || '',
      secondaryColor: secondaryColor || '',
      accentColor: accentColor || primaryColor || '',
    },
    theme as ThemeId
  );

  return (
    <MenuThemeBackground
      themeId={theme as ThemeId}
      primaryColor={resolved.primary}
      secondaryColor={resolved.secondary}
      intensity={intensity}
      className={className}
    />
  );
};

