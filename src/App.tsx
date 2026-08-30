import React, { useState } from 'react';
import { ThemeId, MenuThemeConfig } from './types/menu';
import { mockRestaurantData, themeConfigs } from './data/mockMenuData';
import { ThemeRenderer } from './components/ThemeRenderer';
import { ShowcaseToolbar, ViewportSize } from './components/showcase/ShowcaseToolbar';
import { ThemeCustomizer } from './components/showcase/ThemeCustomizer';
import { motion, AnimatePresence } from 'framer-motion';
import { Smartphone, Eye, Sparkles } from 'lucide-react';

export default function App() {
  const [currentTheme, setCurrentTheme] = useState<ThemeId>('immersive');
  const [currentState, setCurrentState] = useState<'hero' | 'menu'>('hero');
  const [viewportSize, setViewportSize] = useState<ViewportSize>('390');
  const [isDashboardMode, setIsDashboardMode] = useState(false);
  const [isCustomizerOpen, setIsCustomizerOpen] = useState(false);

  // Dynamic config with custom overrides
  const [configs, setConfigs] = useState<Record<string, MenuThemeConfig>>({
    immersive: { ...themeConfigs.immersive },
    modern: { ...themeConfigs.modern },
    minimal: { ...themeConfigs.minimal },
  });

  const activeConfig = configs[currentTheme];

  const handleConfigChange = (updated: MenuThemeConfig) => {
    setConfigs((prev) => ({
      ...prev,
      [currentTheme]: updated,
    }));
  };

  const handleResetConfig = () => {
    setConfigs((prev) => ({
      ...prev,
      [currentTheme]: { ...themeConfigs[currentTheme] },
    }));
  };

  const handleResetTransition = () => {
    setCurrentState('hero');
  };

  // Viewport style calculations
  const getViewportWidthClass = () => {
    if (isDashboardMode) return 'w-[390px] h-[844px]';
    switch (viewportSize) {
      case '360':
        return 'w-[360px] min-h-[740px]';
      case '390':
        return 'w-[390px] min-h-[844px]';
      case '430':
        return 'w-[430px] min-h-[932px]';
      case 'responsive':
      default:
        return 'w-full min-h-screen max-w-2xl';
    }
  };

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 flex flex-col font-sans selection:bg-amber-500/20">
      {/* 1. Interactive Prototype Controller Header */}
      <ShowcaseToolbar
        currentTheme={currentTheme}
        onThemeChange={(theme) => {
          setCurrentTheme(theme);
          setCurrentState('hero'); // fresh start on theme change
        }}
        currentState={currentState}
        onStateChange={setCurrentState}
        viewportSize={viewportSize}
        onViewportChange={setViewportSize}
        isDashboardMode={isDashboardMode}
        onToggleDashboardMode={() => setIsDashboardMode(!isDashboardMode)}
        onResetTransition={handleResetTransition}
        isCustomizerOpen={isCustomizerOpen}
        onToggleCustomizer={() => setIsCustomizerOpen(!isCustomizerOpen)}
      />

      {/* 2. Main Stage / Preview Environment */}
      <div className="flex-1 flex items-center justify-center p-0 sm:p-4 md:p-6 bg-gradient-to-b from-neutral-950 via-neutral-900 to-neutral-950 overflow-x-hidden">
        {isDashboardMode ? (
          /* ---------------------------------------------------- */
          /* Vitrin Dashboard Experience Designer Mode            */
          /* ---------------------------------------------------- */
          <div className="w-full max-w-6xl mx-auto flex flex-col lg:flex-row gap-6 items-start justify-center p-2 sm:p-4">
            {/* Left/Sidebar: Vitrin Theme Experience Customizer */}
            <div className="w-full lg:w-96 flex-shrink-0">
              <ThemeCustomizer
                config={activeConfig}
                onChange={handleConfigChange}
                onReset={handleResetConfig}
              />
            </div>

            {/* Right: Live Interactive Phone Viewport */}
            <div className="flex-1 flex flex-col items-center justify-center">
              <div className="mb-2 text-xs text-neutral-400 flex items-center gap-2">
                <Smartphone className="w-4 h-4 text-amber-400" />
                <span>پیش‌نمایش زنده در نمای موبایل (۳۹۰ × ۸۴۴)</span>
              </div>

              {/* Phone Mockup Frame */}
              <div className="w-[390px] h-[844px] bg-black rounded-[48px] p-3 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.9)] border-[6px] border-neutral-800 relative overflow-hidden flex flex-col">
                {/* Dynamic Island / Speaker notch */}
                <div className="absolute top-4 left-1/2 -translate-x-1/2 w-28 h-5 bg-neutral-900 rounded-full z-50 pointer-events-none" />

                {/* Inner Screen Container */}
                <div className="w-full h-full rounded-[38px] overflow-y-auto no-scrollbar relative bg-neutral-950">
                  <ThemeRenderer
                    key={`${currentTheme}-${currentState}`}
                    themeId={currentTheme}
                    restaurant={mockRestaurantData}
                    config={activeConfig}
                    initialState={currentState}
                    onStateChange={setCurrentState}
                    isDashboardPreview={true}
                  />
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* ---------------------------------------------------- */
          /* Customer Web View (Direct Responsive or Frame)       */
          /* ---------------------------------------------------- */
          <div className="w-full flex justify-center items-start">
            {viewportSize === 'responsive' ? (
              <div className="w-full min-h-screen">
                <ThemeRenderer
                  key={`${currentTheme}-${currentState}`}
                  themeId={currentTheme}
                  restaurant={mockRestaurantData}
                  config={activeConfig}
                  initialState={currentState}
                  onStateChange={setCurrentState}
                  isDashboardPreview={false}
                />
              </div>
            ) : (
              <div className="flex flex-col items-center">
                {/* Visual Frame Container */}
                <div
                  className={`${getViewportWidthClass()} transition-all duration-300 rounded-3xl overflow-hidden border border-neutral-800 shadow-2xl bg-neutral-950 my-2`}
                >
                  <ThemeRenderer
                    key={`${currentTheme}-${currentState}`}
                    themeId={currentTheme}
                    restaurant={mockRestaurantData}
                    config={activeConfig}
                    initialState={currentState}
                    onStateChange={setCurrentState}
                    isDashboardPreview={false}
                  />
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
