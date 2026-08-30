import React from 'react';
import { ThemeId, RestaurantData, MenuThemeConfig } from '../types/menu';
import { ImmersiveTheme } from './themes/Theme01Immersive/ImmersiveTheme';
import { ModernTheme } from './themes/Theme02Modern/ModernTheme';
import { MinimalTheme } from './themes/Theme03Minimal/MinimalTheme';
import { MenuSelectionProvider } from '../context/MenuSelectionContext';

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
  const renderTheme = () => {
    switch (themeId) {
      case 'immersive':
        return (
          <ImmersiveTheme
            restaurant={restaurant}
            config={config}
            initialState={initialState}
            onStateChange={onStateChange}
            isDashboardPreview={isDashboardPreview}
          />
        );
      case 'modern':
        return (
          <ModernTheme
            restaurant={restaurant}
            config={config}
            initialState={initialState}
            onStateChange={onStateChange}
            isDashboardPreview={isDashboardPreview}
          />
        );
      case 'minimal':
        return (
          <MinimalTheme
            restaurant={restaurant}
            config={config}
            initialState={initialState}
            onStateChange={onStateChange}
            isDashboardPreview={isDashboardPreview}
          />
        );
      default:
        return (
          <ImmersiveTheme
            restaurant={restaurant}
            config={config}
            initialState={initialState}
            onStateChange={onStateChange}
            isDashboardPreview={isDashboardPreview}
          />
        );
    }
  };

  return (
    <MenuSelectionProvider items={restaurant.items}>
      {renderTheme()}
    </MenuSelectionProvider>
  );
};
