import React from 'react';
import {
  Smartphone,
  Layers,
  Sparkles,
  Play,
  RotateCcw,
  SlidersHorizontal,
  Maximize2,
  Minimize2,
  Check,
  Eye,
  Settings2,
} from 'lucide-react';
import { ThemeId, MenuThemeConfig } from '../../types/menu';

export type ViewportSize = '360' | '390' | '430' | 'responsive';

interface ShowcaseToolbarProps {
  currentTheme: ThemeId;
  onThemeChange: (theme: ThemeId) => void;
  currentState: 'hero' | 'menu';
  onStateChange: (state: 'hero' | 'menu') => void;
  viewportSize: ViewportSize;
  onViewportChange: (viewport: ViewportSize) => void;
  isDashboardMode: boolean;
  onToggleDashboardMode: () => void;
  onResetTransition: () => void;
  isCustomizerOpen: boolean;
  onToggleCustomizer: () => void;
}

export const ShowcaseToolbar: React.FC<ShowcaseToolbarProps> = ({
  currentTheme,
  onThemeChange,
  currentState,
  onStateChange,
  viewportSize,
  onViewportChange,
  isDashboardMode,
  onToggleDashboardMode,
  onResetTransition,
  isCustomizerOpen,
  onToggleCustomizer,
}) => {
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
                PROTOTYPE v1.0
              </span>
            </div>
            <p className="text-[10px] text-neutral-400 hidden sm:block">
              پیش‌نمایش تعاملی پوسته‌ها و ترنزیشن هیرو به منو
            </p>
          </div>
        </div>

        {/* Center: Theme Selector Tabs */}
        <div className="flex items-center gap-1 bg-neutral-950 p-1 rounded-xl border border-neutral-800 text-xs">
          <button
            onClick={() => onThemeChange('immersive')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-all flex items-center gap-1.5 ${
              currentTheme === 'immersive'
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-sm'
                : 'text-neutral-400 hover:text-neutral-200'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-amber-400" />
            <span>پوسته ۱: تحریریه‌ای (Editorial)</span>
          </button>

          <button
            onClick={() => onThemeChange('modern')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-all flex items-center gap-1.5 ${
              currentTheme === 'modern'
                ? 'bg-orange-500/20 text-orange-300 border border-orange-500/40 shadow-sm'
                : 'text-neutral-400 hover:text-neutral-200'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-orange-500" />
            <span>پوسته ۲: مدرن (Food-First)</span>
          </button>

          <button
            onClick={() => onThemeChange('minimal')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-all flex items-center gap-1.5 ${
              currentTheme === 'minimal'
                ? 'bg-teal-500/20 text-teal-300 border border-teal-500/40 shadow-sm'
                : 'text-neutral-400 hover:text-neutral-200'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-teal-400" />
            <span>پوسته ۳: مینیمال (Architectural)</span>
          </button>
        </div>

        {/* Right: Viewport & State Controls */}
        <div className="flex items-center gap-2">
          {/* State Switcher (Hero / Menu) */}
          <div className="flex items-center bg-neutral-950 p-0.5 rounded-lg border border-neutral-800 text-xs">
            <button
              onClick={() => onStateChange('hero')}
              className={`px-2.5 py-1 rounded-md transition-all ${
                currentState === 'hero'
                  ? 'bg-neutral-800 text-white font-semibold'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              حالت هیرو
            </button>
            <button
              onClick={() => onStateChange('menu')}
              className={`px-2.5 py-1 rounded-md transition-all ${
                currentState === 'menu'
                  ? 'bg-neutral-800 text-white font-semibold'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              حالت منو
            </button>
          </div>

          {/* Replay Transition */}
          <button
            onClick={onResetTransition}
            title="اجرای مجدد ترنزیشن ورود به منو"
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-xs text-neutral-300 border border-neutral-700 active:scale-95 transition-all"
          >
            <RotateCcw className="w-3.5 h-3.5 text-amber-400" />
            <span className="hidden md:inline">ریست ترنزیشن</span>
          </button>

          {/* Viewport Width Controls (Only if not full customer mode) */}
          {!isDashboardMode && (
            <div className="hidden lg:flex items-center bg-neutral-950 p-0.5 rounded-lg border border-neutral-800 text-xs">
              <button
                onClick={() => onViewportChange('360')}
                className={`px-2 py-1 rounded-md ${
                  viewportSize === '360' ? 'bg-neutral-800 text-white font-semibold' : 'text-neutral-400'
                }`}
                title="صفحه ۳۶۰ پیکسل (اندروید استاندارد)"
              >
                360px
              </button>
              <button
                onClick={() => onViewportChange('390')}
                className={`px-2 py-1 rounded-md ${
                  viewportSize === '390' ? 'bg-neutral-800 text-white font-bold' : 'text-neutral-400'
                }`}
                title="صفحه ۳۹۰ پیکسل (آیفون پرو، تارگت اصلی)"
              >
                390px
              </button>
              <button
                onClick={() => onViewportChange('430')}
                className={`px-2 py-1 rounded-md ${
                  viewportSize === '430' ? 'bg-neutral-800 text-white font-semibold' : 'text-neutral-400'
                }`}
                title="صفحه ۴۳۰ پیکسل (آیفون پلاس/مکس)"
              >
                430px
              </button>
              <button
                onClick={() => onViewportChange('responsive')}
                className={`px-2 py-1 rounded-md ${
                  viewportSize === 'responsive' ? 'bg-neutral-800 text-white font-semibold' : 'text-neutral-400'
                }`}
                title="تمام‌صفحه / رسپانسیو وب"
              >
                Full
              </button>
            </div>
          )}

          {/* Vitrin Dashboard Mode Toggle */}
          <button
            onClick={onToggleDashboardMode}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${
              isDashboardMode
                ? 'bg-amber-500 text-black border-amber-400 font-bold'
                : 'bg-neutral-800 hover:bg-neutral-700 text-neutral-200 border-neutral-700'
            }`}
          >
            <Settings2 className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">
              {isDashboardMode ? 'خروج از پنل دیزاینر' : 'حالت پنل مدیریت ویترین'}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};
