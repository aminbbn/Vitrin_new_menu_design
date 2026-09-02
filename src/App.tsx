import React, { useState } from 'react';
import { ThemeId, MenuThemeConfig, RestaurantData } from './types/menu';
import { mockRestaurantData, themeConfigs } from './data/mockMenuData';
import { ThemeRenderer } from './components/ThemeRenderer';
import { ShowcaseToolbar } from './components/showcase/ShowcaseToolbar';
import { ThemeCustomizer } from './components/showcase/ThemeCustomizer';
import {
  DevicePreviewFrame,
  PreviewDeviceType,
  DevicePreset,
  DEVICE_PRESETS,
} from './components/showcase/DevicePreviewFrame';

export default function App() {
  const [currentTheme, setCurrentTheme] = useState<ThemeId>('immersive');
  const [currentState, setCurrentState] = useState<'hero' | 'menu'>('hero');
  const [deviceType, setDeviceType] = useState<PreviewDeviceType>('mobile');
  const [activePreset, setActivePreset] = useState<DevicePreset>(DEVICE_PRESETS.mobile[1]); // Default 390x844
  const [isDashboardMode, setIsDashboardMode] = useState(false);

  // Editable Restaurant Data state
  const [restaurant, setRestaurant] = useState<RestaurantData>(() =>
    structuredClone(mockRestaurantData)
  );

  // Dynamic config with custom overrides
  const [configs, setConfigs] = useState<Record<string, MenuThemeConfig>>(() =>
    structuredClone(themeConfigs)
  );

  const activeConfig = configs[currentTheme];

  const handleConfigChange = (updated: MenuThemeConfig) => {
    setConfigs((prev) => ({
      ...prev,
      [currentTheme]: updated,
    }));
  };

  const handleReset = () => {
    setRestaurant(structuredClone(mockRestaurantData));
    setConfigs((prev) => ({
      ...prev,
      [currentTheme]: structuredClone(themeConfigs[currentTheme]),
    }));
  };

  const handleResetTransition = () => {
    setCurrentState('hero');
  };

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 flex flex-col font-sans selection:bg-amber-500/20 overflow-x-hidden">
      {/* 1. Interactive Showcase Toolbar */}
      <ShowcaseToolbar
        currentTheme={currentTheme}
        onThemeChange={(theme) => {
          setCurrentTheme(theme);
          setCurrentState('hero');
        }}
        currentState={currentState}
        onStateChange={setCurrentState}
        deviceType={deviceType}
        onDeviceTypeChange={setDeviceType}
        activePreset={activePreset}
        onPresetChange={setActivePreset}
        isDashboardMode={isDashboardMode}
        onToggleDashboardMode={() => setIsDashboardMode(!isDashboardMode)}
        onResetTransition={handleResetTransition}
      />

      {/* 2. Main Stage / Preview Environment */}
      <div className="flex-1 flex items-center justify-center p-0 bg-gradient-to-b from-neutral-950 via-neutral-900 to-neutral-950 overflow-hidden relative">
        {isDashboardMode ? (
          /* ---------------------------------------------------- */
          /* Vitrin Dashboard Experience Designer Mode            */
          /* ---------------------------------------------------- */
          <div className="w-full max-w-7xl mx-auto flex flex-col lg:flex-row gap-6 items-center justify-center p-3 sm:p-6 my-auto">
            {/* Left/Sidebar: Vitrin Theme Experience Customizer */}
            <div className="w-full lg:w-96 flex-shrink-0 max-h-[85vh] overflow-y-auto no-scrollbar">
              <ThemeCustomizer
                restaurant={restaurant}
                config={activeConfig}
                onRestaurantChange={setRestaurant}
                onConfigChange={handleConfigChange}
                onReset={handleReset}
              />
            </div>

            {/* Right: Live Interactive Phone Viewport (Using Canonical 390x844 Frame) */}
            <div className="flex-1 flex flex-col items-center justify-center">
              <DevicePreviewFrame
                deviceType="mobile"
                preset={DEVICE_PRESETS.mobile[1]}
                showDecorations={true}
              >
                <ThemeRenderer
                  key={currentTheme}
                  themeId={currentTheme}
                  restaurant={restaurant}
                  config={activeConfig}
                  initialState={currentState}
                  onStateChange={setCurrentState}
                  isDashboardPreview={true}
                />
              </DevicePreviewFrame>
            </div>
          </div>
        ) : (
          /* ---------------------------------------------------- */
          /* Customer Web View (Direct Responsive or Device Frame)*/
          /* ---------------------------------------------------- */
          <div className="w-full h-full flex flex-col items-center justify-center">
            <DevicePreviewFrame
              deviceType={deviceType}
              preset={activePreset}
              showDecorations={true}
            >
              <ThemeRenderer
                key={currentTheme}
                themeId={currentTheme}
                restaurant={restaurant}
                config={activeConfig}
                initialState={currentState}
                onStateChange={setCurrentState}
                isDashboardPreview={false}
              />
            </DevicePreviewFrame>
          </div>
        )}
      </div>
    </div>
  );
}
