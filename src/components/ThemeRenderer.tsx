import React, { useMemo } from 'react';
import { ThemeId, RestaurantData, MenuThemeConfig } from '../types/menu';
import { ImmersiveTheme } from './themes/Theme01Immersive/ImmersiveTheme';
import { ModernTheme } from './themes/Theme02Modern/ModernTheme';
import { MinimalTheme } from './themes/Theme03Minimal/MinimalTheme';
import { MenuSelectionProvider } from '../context/MenuSelectionContext';
import { resolveThemeColors, getThemeCssVariables } from '../utils/themeColors';

interface ThemeRendererProps {
  themeId: ThemeId;
  restaurant: RestaurantData;
  config: MenuThemeConfig;
  initialState?: 'hero' | 'menu';
  onStateChange?: (state: 'hero' | 'menu') => void;
  isDashboardPreview?: boolean;
}

export const ThemeRenderer: React.FC<ThemeRendererProps> = ({
  themeId,
  restaurant,
  config,
  initialState = 'hero',
  onStateChange,
  isDashboardPreview = false,
}) => {
  const colors = useMemo(() => resolveThemeColors(config, themeId), [config, themeId]);
  const cssVars = useMemo(
    () => getThemeCssVariables(colors.primary, colors.secondary),
    [colors.primary, colors.secondary]
  );

  const resolvedConfig: MenuThemeConfig = useMemo(
    () => ({
      ...config,
      primaryColor: colors.primary,
      secondaryColor: colors.secondary,
      accentColor: colors.primary,
      accentColorLight: colors.secondary,
    }),
    [config, colors]
  );

  const renderTheme = () => {
    switch (themeId) {
      case 'immersive':
        return (
          <ImmersiveTheme
            restaurant={restaurant}
            config={resolvedConfig}
            initialState={initialState}
            onStateChange={onStateChange}
            isDashboardPreview={isDashboardPreview}
          />
        );
      case 'modern':
        return (
          <ModernTheme
            restaurant={restaurant}
            config={resolvedConfig}
            initialState={initialState}
            onStateChange={onStateChange}
            isDashboardPreview={isDashboardPreview}
          />
        );
      case 'minimal':
        return (
          <MinimalTheme
            restaurant={restaurant}
            config={resolvedConfig}
            initialState={initialState}
            onStateChange={onStateChange}
            isDashboardPreview={isDashboardPreview}
          />
        );
      default:
        return (
          <ImmersiveTheme
            restaurant={restaurant}
            config={resolvedConfig}
            initialState={initialState}
            onStateChange={onStateChange}
            isDashboardPreview={isDashboardPreview}
          />
        );
    }
  };

  return (
    <div className="w-full h-full relative" style={cssVars as React.CSSProperties}>
      <MenuSelectionProvider items={restaurant.items}>
        {renderTheme()}
      </MenuSelectionProvider>
    </div>
  );
};

