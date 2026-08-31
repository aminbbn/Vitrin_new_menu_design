import React from 'react';
import {
  Smartphone,
  Tablet as TabletIcon,
  Monitor,
  Maximize2,
  Sparkles,
  RotateCcw,
  Settings2,
  Layers,
} from 'lucide-react';
import { ThemeId } from '../../types/menu';
import { PreviewDeviceType, DevicePreset, DEVICE_PRESETS } from './DevicePreviewFrame';

interface ShowcaseToolbarProps {
  currentTheme: ThemeId;
  onThemeChange: (theme: ThemeId) => void;
  currentState: 'hero' | 'menu';
  onStateChange: (state: 'hero' | 'menu') => void;
  deviceType: PreviewDeviceType;
  onDeviceTypeChange: (device: PreviewDeviceType) => void;
  activePreset: DevicePreset;
  onPresetChange: (preset: DevicePreset) => void;
  isDashboardMode: boolean;
  onToggleDashboardMode: () => void;
  onResetTransition: () => void;
}

export const ShowcaseToolbar: React.FC<ShowcaseToolbarProps> = ({
  currentTheme,
  onThemeChange,
  currentState,
  onStateChange,
  deviceType,
  onDeviceTypeChange,
  activePreset,
  onPresetChange,
  isDashboardMode,
  onToggleDashboardMode,
  onResetTransition,
}) => {
  const currentPresets = DEVICE_PRESETS[deviceType] || [];

  return (
    <div className="bg-neutral-900 border-b border-neutral-800 text-neutral-100 sticky top-0 z-50 shadow-xl px-3 sm:px-6 py-2.5">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
        {/* Left: Brand / Title */}
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center text-black font-extrabold text-sm shadow">
            V
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-xs sm:text-sm text-white">ویترین دیجیتال منو</span>
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 font-semibold">
                PROTOTYPE v2.0
              </span>
            </div>
            <p className="text-[10px] text-neutral-400 hidden sm:block">
              پیش‌نمایش تعاملی دستگاه‌ها و پوسته‌ها
            </p>
          </div>
        </div>

        {/* Center: Theme Selector Tabs */}
        <div className="flex items-center gap-1 bg-neutral-950 p-1 rounded-xl border border-neutral-800 text-xs">
          <button
            onClick={() => onThemeChange('immersive')}
            className={`px-2.5 sm:px-3 py-1.5 rounded-lg font-medium transition-all flex items-center gap-1.5 cursor-pointer ${
              currentTheme === 'immersive'
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-sm font-bold'
                : 'text-neutral-400 hover:text-neutral-200'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-amber-400" />
            <span>پوسته ۱: تحریریه‌ای</span>
          </button>

          <button
            onClick={() => onThemeChange('modern')}
            className={`px-2.5 sm:px-3 py-1.5 rounded-lg font-medium transition-all flex items-center gap-1.5 cursor-pointer ${
              currentTheme === 'modern'
                ? 'bg-orange-500/20 text-orange-300 border border-orange-500/40 shadow-sm font-bold'
                : 'text-neutral-400 hover:text-neutral-200'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-orange-500" />
            <span>پوسته ۲: مدرن</span>
          </button>

          <button
            onClick={() => onThemeChange('minimal')}
            className={`px-2.5 sm:px-3 py-1.5 rounded-lg font-medium transition-all flex items-center gap-1.5 cursor-pointer ${
              currentTheme === 'minimal'
                ? 'bg-teal-500/20 text-teal-300 border border-teal-500/40 shadow-sm font-bold'
                : 'text-neutral-400 hover:text-neutral-200'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-teal-400" />
            <span>پوسته ۳: مینیمال</span>
          </button>
        </div>

        {/* Right: Device & State Controls */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Device Type Selector (Mobile, Tablet, Desktop, Responsive) */}
          {!isDashboardMode && (
            <div className="flex items-center bg-neutral-950 p-0.5 rounded-lg border border-neutral-800 text-xs">
              <button
                onClick={() => {
                  onDeviceTypeChange('mobile');
                  onPresetChange(DEVICE_PRESETS.mobile[1]); // default 390x844
                }}
                className={`px-2 py-1 rounded-md transition-all flex items-center gap-1 cursor-pointer ${
                  deviceType === 'mobile'
                    ? 'bg-neutral-800 text-white font-bold'
                    : 'text-neutral-400 hover:text-white'
                }`}
                title="نمای گوشی هوشمند"
              >
                <Smartphone className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">موبایل</span>
              </button>

              <button
                onClick={() => {
                  onDeviceTypeChange('tablet');
                  onPresetChange(DEVICE_PRESETS.tablet[0]); // default 820x1180
                }}
                className={`px-2 py-1 rounded-md transition-all flex items-center gap-1 cursor-pointer ${
                  deviceType === 'tablet'
                    ? 'bg-neutral-800 text-white font-bold'
                    : 'text-neutral-400 hover:text-white'
                }`}
                title="نمای تبلت"
              >
                <TabletIcon className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">تبلت</span>
              </button>

              <button
                onClick={() => {
                  onDeviceTypeChange('desktop');
                  onPresetChange(DEVICE_PRESETS.desktop[1]); // default 1440x900
                }}
                className={`px-2 py-1 rounded-md transition-all flex items-center gap-1 cursor-pointer ${
                  deviceType === 'desktop'
                    ? 'bg-neutral-800 text-white font-bold'
                    : 'text-neutral-400 hover:text-white'
                }`}
                title="نمای دسکتاپ و وب"
              >
                <Monitor className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">دسکتاپ</span>
              </button>

              <button
                onClick={() => {
                  onDeviceTypeChange('responsive');
                  onPresetChange(DEVICE_PRESETS.responsive[0]);
                }}
                className={`px-2 py-1 rounded-md transition-all flex items-center gap-1 cursor-pointer ${
                  deviceType === 'responsive'
                    ? 'bg-neutral-800 text-white font-bold'
                    : 'text-neutral-400 hover:text-white'
                }`}
                title="نمای تمام صفحه مرورگر"
              >
                <Maximize2 className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">تمام‌صفحه</span>
              </button>
            </div>
          )}

          {/* Preset Resolution Selector for the chosen device */}
          {!isDashboardMode && deviceType !== 'responsive' && currentPresets.length > 1 && (
            <div className="hidden lg:flex items-center bg-neutral-950 p-0.5 rounded-lg border border-neutral-800 text-xs">
              {currentPresets.map((preset) => (
                <button
                  key={preset.id}
                  onClick={() => onPresetChange(preset)}
                  className={`px-2 py-1 rounded-md transition-all cursor-pointer ${
                    activePreset.id === preset.id
                      ? 'bg-neutral-800 text-white font-bold'
                      : 'text-neutral-400 hover:text-neutral-200'
                  }`}
                >
                  {preset.width}×{preset.height}
                </button>
              ))}
            </div>
          )}

          {/* State Switcher (Hero / Menu) */}
          <div className="flex items-center bg-neutral-950 p-0.5 rounded-lg border border-neutral-800 text-xs">
            <button
              onClick={() => onStateChange('hero')}
              className={`px-2.5 py-1 rounded-md transition-all cursor-pointer ${
                currentState === 'hero'
                  ? 'bg-neutral-800 text-white font-bold'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              هیرو
            </button>
            <button
              onClick={() => onStateChange('menu')}
              className={`px-2.5 py-1 rounded-md transition-all cursor-pointer ${
                currentState === 'menu'
                  ? 'bg-neutral-800 text-white font-bold'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              منو
            </button>
          </div>

          {/* Replay Transition */}
          <button
            onClick={onResetTransition}
            title="اجرای مجدد ترنزیشن ورود به منو"
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-xs text-neutral-300 border border-neutral-700 active:scale-95 transition-all cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5 text-amber-400" />
            <span className="hidden md:inline">ریست ترنزیشن</span>
          </button>

          {/* Vitrin Dashboard Mode Toggle */}
          <button
            onClick={onToggleDashboardMode}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-all cursor-pointer ${
              isDashboardMode
                ? 'bg-amber-500 text-black border-amber-400 font-bold'
                : 'bg-neutral-800 hover:bg-neutral-700 text-neutral-200 border-neutral-700'
            }`}
          >
            <Settings2 className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">
              {isDashboardMode ? 'خروج از پنل دیزاینر' : 'پنل دیزاینر ویترین'}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};
