import React, { useState } from 'react';
import { RestaurantData, MenuThemeConfig, MenuCategory } from '../../types/menu';
import {
  Palette,
  Type,
  Sliders,
  Sparkles,
  Copy,
  Check,
  RefreshCw,
  Store,
  Compass,
  Layers,
  Image as ImageIcon,
  Clock,
  Eye,
  ChevronDown,
  ChevronUp,
  ArrowLeftRight,
  AlertTriangle,
} from 'lucide-react';
import { ImageInput } from './ImageInput';
import { ColorControl } from './ColorControl';
import { mockRestaurantData } from '../../data/mockMenuData';
import {
  resolveThemeColors,
  DEFAULT_THEME_COLORS,
  areColorsTooSimilar,
  getRelativeLuminance,
} from '../../utils/themeColors';

interface ThemeCustomizerProps {
  restaurant: RestaurantData;
  config: MenuThemeConfig;
  onRestaurantChange: (updated: RestaurantData) => void;
  onConfigChange: (updated: MenuThemeConfig) => void;
  onReset: () => void;
}

// Optional curated suggestions as shortcuts (never limits)
const OPTIONAL_PAIR_SUGGESTIONS = [
  { label: 'طلایی و زرشکی', primary: '#D4AF37', secondary: '#B76E79' },
  { label: 'یشمی و آجری', primary: '#0F766E', secondary: '#B7794B' },
  { label: 'فیروزه‌ای و لاجوردی', primary: '#38BDF8', secondary: '#A78BFA' },
  { label: 'زمردی و نارنجی', primary: '#10B981', secondary: '#F97316' },
];

export const ThemeCustomizer: React.FC<ThemeCustomizerProps> = ({
  restaurant,
  config,
  onRestaurantChange,
  onConfigChange,
  onReset,
}) => {
  const [copied, setCopied] = useState(false);
  const [openCategoryIndex, setOpenCategoryIndex] = useState<number | null>(null);

  const currentColors = resolveThemeColors(config, config.id);
  const defaultColors = DEFAULT_THEME_COLORS[config.id] || DEFAULT_THEME_COLORS.immersive;

  const handleSwapColors = () => {
    onConfigChange({
      ...config,
      primaryColor: currentColors.secondary,
      secondaryColor: currentColors.primary,
      accentColor: currentColors.secondary,
      accentColorLight: currentColors.primary,
    });
  };

  const handleSelectPair = (p: string, s: string) => {
    onConfigChange({
      ...config,
      primaryColor: p,
      secondaryColor: s,
      accentColor: p,
      accentColorLight: s,
    });
  };

  // Contrast & similarity check
  const areSimilar = areColorsTooSimilar(currentColors.primary, currentColors.secondary);
  const primLum = getRelativeLuminance(currentColors.primary);
  const isTooExtreme = (config.id === 'modern' && primLum > 0.88) || (config.id !== 'modern' && primLum < 0.08);

  let colorWarning: string | null = null;
  if (areSimilar) {
    colorWarning = 'رنگ اصلی و مکمل شباهت زیادی به یکدیگر دارند؛ پیشنهاد می‌شود برای تفکیک بهتر از رنگ‌های متمایزتر استفاده فرمایید.';
  } else if (isTooExtreme) {
    colorWarning = 'کنتراست این رنگ برای بعضی اجزا ممکن است پایین باشد.';
  }

  const handleCopyJson = () => {
    // Clean export without transient blob URLs
    const exportData = {
      themeConfig: {
        id: config.id,
        primaryColor: currentColors.primary,
        secondaryColor: currentColors.secondary,
        backgroundIntensity: config.backgroundIntensity || 'balanced',
        fontFamily: config.fontFamily,
        borderRadius: config.borderRadius,
        hero: config.hero,
        categoryNavigationVariant: config.categoryNavigationVariant,
        cardLayout: config.cardLayout,
        ...(config.id === 'immersive' && { immersiveSettings: config.immersiveSettings }),
        ...(config.id === 'modern' && { modernSettings: config.modernSettings }),
        ...(config.id === 'minimal' && { minimalSettings: config.minimalSettings }),
      },
      restaurantIdentity: {
        name: restaurant.name,
        tagline: restaurant.tagline,
        workingHours: restaurant.workingHours,
        neighborhood: restaurant.neighborhood,
      },
    };
    navigator.clipboard.writeText(JSON.stringify(exportData, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleCategoryImageChange = (categoryId: string, newImageUrl: string) => {
    const updatedCategories = restaurant.categories.map((cat) => {
      if (cat.id === categoryId) {
        return { ...cat, image: newImageUrl };
      }
      return cat;
    });
    onRestaurantChange({
      ...restaurant,
      categories: updatedCategories,
    });
  };

  return (
    <div className="w-full max-w-sm bg-neutral-900 border border-neutral-800 rounded-2xl p-5 text-neutral-100 space-y-5 text-xs shadow-2xl h-full overflow-y-auto no-scrollbar" dir="rtl">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
        <div className="flex items-center gap-2">
          <Sliders className="w-4 h-4 text-amber-400" />
          <h3 className="font-bold text-sm text-white">شخصی‌سازی و تنظیمات</h3>
        </div>
        <button
          onClick={onReset}
          className="text-neutral-400 hover:text-white flex items-center gap-1 text-[11px] px-2 py-1 rounded-lg hover:bg-neutral-800 transition-colors"
          title="بازنشانی تنظیمات و محتوا به پیش‌فرض"
        >
          <RefreshCw className="w-3 h-3" />
          ریست همه
        </button>
      </div>

      {/* Active Theme Badge & Info */}
      <div className="p-3 rounded-xl bg-neutral-800/40 border border-neutral-800 space-y-1">
        <div className="flex items-center justify-between">
          <span className="text-[11px] text-neutral-400">پوسته فعال:</span>
          <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-neutral-800 text-amber-400 border border-neutral-700">
            {config.id}
          </span>
        </div>
        <div className="font-bold text-amber-400 text-xs">{config.nameFa}</div>
        <p className="text-[11px] text-neutral-400 leading-relaxed">{config.descriptionFa}</p>
      </div>

      {/* ================================================================= */}
      {/* SECTION 1: COMMON RESTAURANT IDENTITY & ASSETS                    */}
      {/* ================================================================= */}
      <div className="space-y-3 pt-1 border-t border-neutral-800/60">
        <div className="flex items-center gap-1.5 text-neutral-200 font-bold text-xs pb-1">
          <Store className="w-3.5 h-3.5 text-amber-400" />
          <span>اطلاعات پایه رستوران (مشترک)</span>
        </div>

        {/* Restaurant Name */}
        <div>
          <span className="text-[10px] text-neutral-400 mb-1 block">نام رستوران:</span>
          <input
            type="text"
            value={restaurant.name}
            onChange={(e) =>
              onRestaurantChange({
                ...restaurant,
                name: e.target.value,
              })
            }
            className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2 text-white focus:outline-hidden focus:border-amber-500 text-xs"
          />
        </div>

        {/* Short Description / Tagline */}
        <div>
          <span className="text-[10px] text-neutral-400 mb-1 block">شعار و معرفی کوتاه:</span>
          <textarea
            rows={2}
            value={restaurant.tagline}
            onChange={(e) =>
              onRestaurantChange({
                ...restaurant,
                tagline: e.target.value,
              })
            }
            className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2 text-white focus:outline-hidden focus:border-amber-500 text-xs"
          />
        </div>

        {/* Restaurant Logo Input */}
        <ImageInput
          label="لوگوی رستوران:"
          value={restaurant.logo}
          onChange={(newLogo) =>
            onRestaurantChange({
              ...restaurant,
              logo: newLogo,
            })
          }
          defaultFallback={mockRestaurantData.logo}
          placeholder="https://..."
        />

        {/* Primary Hero / Cover Image Input */}
        <ImageInput
          label="تصویر هیرو / کاور اصلی:"
          value={restaurant.heroImage}
          onChange={(newHero) =>
            onRestaurantChange({
              ...restaurant,
              heroImage: newHero,
            })
          }
          defaultFallback={mockRestaurantData.heroImage}
          placeholder="https://..."
        />

        {/* Brand Colors System (Primary & Secondary Unrestricted Pickers) */}
        <div className="space-y-3 pt-2 pb-1 border-t border-b border-neutral-800/80">
          <div className="flex items-center justify-between">
            <label className="font-bold text-neutral-200 flex items-center gap-1.5 text-xs">
              <Palette className="w-3.5 h-3.5 text-amber-400" />
              رنگ‌بندی برند منو (Brand Colors)
            </label>
            <button
              type="button"
              onClick={handleSwapColors}
              className="flex items-center gap-1 px-2 py-1 rounded-lg bg-neutral-800 hover:bg-neutral-700 active:bg-neutral-600 text-neutral-300 hover:text-white text-[10px] font-medium transition-all active:scale-95 cursor-pointer"
              title="تعویض جایگاه رنگ اصلی و مکمل"
            >
              <ArrowLeftRight className="w-3 h-3 text-amber-400" />
              <span>تعویض رنگ‌ها</span>
            </button>
          </div>

          {/* Primary Color Control */}
          <ColorControl
            id="primary-color-control"
            label="رنگ اصلی"
            sublabel="Primary Color"
            value={currentColors.primary}
            defaultValue={defaultColors.primary}
            onChange={(newColor) => {
              onConfigChange({
                ...config,
                primaryColor: newColor,
                accentColor: newColor,
              });
            }}
          />

          {/* Secondary Color Control */}
          <ColorControl
            id="secondary-color-control"
            label="رنگ مکمل"
            sublabel="Secondary Color"
            value={currentColors.secondary}
            defaultValue={defaultColors.secondary}
            onChange={(newColor) => {
              onConfigChange({
                ...config,
                secondaryColor: newColor,
                accentColorLight: newColor,
              });
            }}
          />

          {/* Non-blocking contrast / similarity warning */}
          {colorWarning && (
            <div className="flex items-start gap-2 p-2 rounded-xl bg-amber-500/10 border border-amber-500/25 text-amber-300 text-[10px] leading-relaxed">
              <AlertTriangle className="w-3.5 h-3.5 shrink-0 mt-0.5 text-amber-400" />
              <span>{colorWarning}</span>
            </div>
          )}

          {/* Optional Inspiration Shortcuts (never restrictive) */}
          <div className="space-y-1.5 pt-1">
            <span className="text-[10px] text-neutral-400 block">پیشنهادهای الهام‌بخش (اختیاری):</span>
            <div className="grid grid-cols-2 gap-1.5">
              {OPTIONAL_PAIR_SUGGESTIONS.map((item) => {
                const isSelected =
                  currentColors.primary.toUpperCase() === item.primary.toUpperCase() &&
                  currentColors.secondary.toUpperCase() === item.secondary.toUpperCase();
                return (
                  <button
                    key={item.label}
                    type="button"
                    onClick={() => handleSelectPair(item.primary, item.secondary)}
                    className={`p-1.5 rounded-xl border flex items-center gap-2 text-[10px] transition-all cursor-pointer ${
                      isSelected
                        ? 'border-white bg-neutral-800 font-bold text-white shadow-xs'
                        : 'border-neutral-800 bg-neutral-950 text-neutral-400 hover:border-neutral-700'
                    }`}
                  >
                    <div className="flex -space-x-1 shrink-0">
                      <span
                        className="w-3 h-3 rounded-full border border-black/40 shadow-xs"
                        style={{ backgroundColor: item.primary }}
                      />
                      <span
                        className="w-3 h-3 rounded-full border border-black/40 shadow-xs"
                        style={{ backgroundColor: item.secondary }}
                      />
                    </div>
                    <span className="truncate">{item.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Background Atmosphere Intensity */}
          <div className="space-y-1.5 pt-1">
            <span className="text-[10px] text-neutral-400 block">شدت پس‌زمینه (Atmosphere Intensity):</span>
            <div className="grid grid-cols-3 gap-1.5">
              {(['soft', 'balanced', 'strong'] as const).map((lvl) => {
                const currentLvl = config.backgroundIntensity || 'balanced';
                const isSelected = currentLvl === lvl;
                return (
                  <button
                    key={lvl}
                    type="button"
                    onClick={() => onConfigChange({ ...config, backgroundIntensity: lvl })}
                    className={`py-1.5 px-2 rounded-xl border text-[10px] transition-all cursor-pointer ${
                      isSelected
                        ? 'border-amber-400/80 bg-neutral-800 text-white font-bold shadow-xs'
                        : 'border-neutral-800 bg-neutral-950 text-neutral-400 hover:border-neutral-700'
                    }`}
                  >
                    {lvl === 'soft' ? 'ملایم' : lvl === 'balanced' ? 'متعادل' : 'پررنگ'}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Operational Info */}
        <div className="grid grid-cols-2 gap-2 pt-1">
          <div>
            <span className="text-[10px] text-neutral-400 mb-1 block">ساعات کاری:</span>
            <input
              type="text"
              value={restaurant.workingHours}
              onChange={(e) =>
                onRestaurantChange({
                  ...restaurant,
                  workingHours: e.target.value,
                })
              }
              className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-2.5 py-1.5 text-white focus:outline-hidden focus:border-amber-500 text-[11px]"
            />
          </div>
          <div>
            <span className="text-[10px] text-neutral-400 mb-1 block">محدوده / محله:</span>
            <input
              type="text"
              value={restaurant.neighborhood}
              onChange={(e) =>
                onRestaurantChange({
                  ...restaurant,
                  neighborhood: e.target.value,
                })
              }
              className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-2.5 py-1.5 text-white focus:outline-hidden focus:border-amber-500 text-[11px]"
            />
          </div>
        </div>
      </div>

      {/* ================================================================= */}
      {/* SECTION 2: THEME 1 SPECIFIC CONTROLS (IMMERSIVE EDITORIAL)         */}
      {/* ================================================================= */}
      {config.id === 'immersive' && (
        <div className="space-y-3.5 pt-3 border-t border-neutral-800">
          <div className="flex items-center gap-1.5 text-amber-400 font-bold text-xs">
            <Sparkles className="w-3.5 h-3.5" />
            <span>تنظیمات اختصاصی پوسته اول (سینمایی)</span>
          </div>

          {/* Hero Headline */}
          <div>
            <span className="text-[10px] text-neutral-400 mb-1 block">تیتر خوش‌آمدگویی هیرو:</span>
            <input
              type="text"
              value={config.hero.headline}
              onChange={(e) =>
                onConfigChange({
                  ...config,
                  hero: { ...config.hero, headline: e.target.value },
                })
              }
              className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2 text-white focus:outline-hidden focus:border-amber-500 text-xs"
            />
          </div>

          {/* Hero Subheadline */}
          <div>
            <span className="text-[10px] text-neutral-400 mb-1 block">توضیح زیرتیتر هیرو:</span>
            <textarea
              rows={2}
              value={config.hero.subheadline}
              onChange={(e) =>
                onConfigChange({
                  ...config,
                  hero: { ...config.hero, subheadline: e.target.value },
                })
              }
              className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2 text-white focus:outline-hidden focus:border-amber-500 text-xs"
            />
          </div>

          {/* CTA Button Text */}
          <div>
            <span className="text-[10px] text-neutral-400 mb-1 block">متن دکمه ورود به منو:</span>
            <input
              type="text"
              value={config.hero.ctaText}
              onChange={(e) =>
                onConfigChange({
                  ...config,
                  hero: { ...config.hero, ctaText: e.target.value },
                })
              }
              className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2 text-white focus:outline-hidden focus:border-amber-500 text-xs"
            />
          </div>

          {/* Focal Position for Hero Image */}
          <div>
            <span className="text-[10px] text-neutral-400 mb-1.5 block">موقعیت فوکوس تصویر هیرو:</span>
            <div className="grid grid-cols-3 gap-1.5">
              {(['top', 'center', 'bottom'] as const).map((pos) => {
                const currentPos = config.immersiveSettings?.focalPosition || 'center';
                const labelMap = { top: 'بالا (Top)', center: 'مرکز (Center)', bottom: 'پایین (Bottom)' };
                return (
                  <button
                    key={pos}
                    type="button"
                    onClick={() =>
                      onConfigChange({
                        ...config,
                        immersiveSettings: {
                          ...(config.immersiveSettings || {
                            focalPosition: 'center',
                            overlayStrength: 'balanced',
                            showOperationalInfo: true,
                            showFeaturedSection: true,
                          }),
                          focalPosition: pos,
                        },
                      })
                    }
                    className={`py-1.5 px-2 rounded-xl text-[10px] border transition-all ${
                      currentPos === pos
                        ? 'border-amber-500 bg-amber-500/10 text-amber-300 font-semibold'
                        : 'border-neutral-800 bg-neutral-950 text-neutral-400 hover:border-neutral-700'
                    }`}
                  >
                    {labelMap[pos]}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Overlay Strength */}
          <div>
            <span className="text-[10px] text-neutral-400 mb-1.5 block">شدت لایه تیره سینمایی هیرو:</span>
            <div className="grid grid-cols-3 gap-1.5">
              {(['soft', 'balanced', 'strong'] as const).map((strength) => {
                const current = config.immersiveSettings?.overlayStrength || 'balanced';
                const labelMap = { soft: 'ملایم (Soft)', balanced: 'متعادل (Medium)', strong: 'عمیق (Deep)' };
                return (
                  <button
                    key={strength}
                    type="button"
                    onClick={() =>
                      onConfigChange({
                        ...config,
                        immersiveSettings: {
                          ...(config.immersiveSettings || {
                            focalPosition: 'center',
                            overlayStrength: 'balanced',
                            showOperationalInfo: true,
                            showFeaturedSection: true,
                          }),
                          overlayStrength: strength,
                        },
                      })
                    }
                    className={`py-1.5 px-2 rounded-xl text-[10px] border transition-all ${
                      current === strength
                        ? 'border-amber-500 bg-amber-500/10 text-amber-300 font-semibold'
                        : 'border-neutral-800 bg-neutral-950 text-neutral-400 hover:border-neutral-700'
                    }`}
                  >
                    {labelMap[strength]}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Toggles */}
          <div className="space-y-2 pt-1">
            <label className="flex items-center justify-between p-2 rounded-xl bg-neutral-950 border border-neutral-800 cursor-pointer">
              <span className="text-[11px] text-neutral-300">نمایش اطلاعات ساعات کاری و موقعیت در هیرو</span>
              <input
                type="checkbox"
                checked={config.immersiveSettings?.showOperationalInfo ?? true}
                onChange={(e) =>
                  onConfigChange({
                    ...config,
                    immersiveSettings: {
                      ...(config.immersiveSettings || {
                        focalPosition: 'center',
                        overlayStrength: 'balanced',
                        showOperationalInfo: true,
                        showFeaturedSection: true,
                      }),
                      showOperationalInfo: e.target.checked,
                    },
                  })
                }
                className="accent-amber-500 rounded cursor-pointer"
              />
            </label>

            <label className="flex items-center justify-between p-2 rounded-xl bg-neutral-950 border border-neutral-800 cursor-pointer">
              <span className="text-[11px] text-neutral-300">نمایش بخش برگزیده‌ها / پیشنهاد سرآشپز</span>
              <input
                type="checkbox"
                checked={config.immersiveSettings?.showFeaturedSection ?? true}
                onChange={(e) =>
                  onConfigChange({
                    ...config,
                    immersiveSettings: {
                      ...(config.immersiveSettings || {
                        focalPosition: 'center',
                        overlayStrength: 'balanced',
                        showOperationalInfo: true,
                        showFeaturedSection: true,
                      }),
                      showFeaturedSection: e.target.checked,
                    },
                  })
                }
                className="accent-amber-500 rounded cursor-pointer"
              />
            </label>
          </div>

          {/* Transition Duration */}
          <div className="space-y-1.5 pt-1">
            <div className="flex justify-between">
              <span className="text-[11px] text-neutral-300">مدت ترنزیشن کشویی هیرو:</span>
              <span className="font-bold text-amber-400">{config.hero.transitionDurationMs}ms</span>
            </div>
            <input
              type="range"
              min="400"
              max="1200"
              step="50"
              value={config.hero.transitionDurationMs}
              onChange={(e) =>
                onConfigChange({
                  ...config,
                  hero: {
                    ...config.hero,
                    transitionDurationMs: Number(e.target.value),
                  },
                })
              }
              className="w-full accent-amber-500 bg-neutral-800"
            />
          </div>
        </div>
      )}

      {/* ================================================================= */}
      {/* SECTION 3: THEME 2 SPECIFIC CONTROLS (MODERN HOSPITALITY BOOK)    */}
      {/* ================================================================= */}
      {config.id === 'modern' && (
        <div className="space-y-3.5 pt-3 border-t border-neutral-800">
          <div className="flex items-center gap-1.5 text-teal-400 font-bold text-xs">
            <Compass className="w-3.5 h-3.5" />
            <span>تنظیمات اختصاصی پوسته دوم (بوکلت و کاور)</span>
          </div>

          {/* Cover Focal Position */}
          <div>
            <span className="text-[10px] text-neutral-400 mb-1.5 block">موقعیت فوکوس تصویر کاور:</span>
            <div className="grid grid-cols-3 gap-1.5">
              {(['top', 'center', 'bottom'] as const).map((pos) => {
                const currentPos = config.modernSettings?.focalPosition || 'center';
                const labelMap = { top: 'بالا (Top)', center: 'مرکز (Center)', bottom: 'پایین (Bottom)' };
                return (
                  <button
                    key={pos}
                    type="button"
                    onClick={() =>
                      onConfigChange({
                        ...config,
                        modernSettings: {
                          ...(config.modernSettings || {
                            focalPosition: 'center',
                            washStrength: 'balanced',
                            categoryAppearance: 'outline',
                            showItemCounts: true,
                          }),
                          focalPosition: pos,
                        },
                      })
                    }
                    className={`py-1.5 px-2 rounded-xl text-[10px] border transition-all ${
                      currentPos === pos
                        ? 'border-teal-500 bg-teal-500/10 text-teal-300 font-semibold'
                        : 'border-neutral-800 bg-neutral-950 text-neutral-400 hover:border-neutral-700'
                    }`}
                  >
                    {labelMap[pos]}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Cover Wash Strength */}
          <div>
            <span className="text-[10px] text-neutral-400 mb-1.5 block">شدت واش تصویر کاور دیجیتال:</span>
            <div className="grid grid-cols-3 gap-1.5">
              {(['subtle', 'balanced', 'strong'] as const).map((strength) => {
                const current = config.modernSettings?.washStrength || 'balanced';
                const labelMap = { subtle: 'ملایم (Subtle)', balanced: 'متعادل (Balanced)', strong: 'محو و مات (Strong)' };
                return (
                  <button
                    key={strength}
                    type="button"
                    onClick={() =>
                      onConfigChange({
                        ...config,
                        modernSettings: {
                          ...(config.modernSettings || {
                            focalPosition: 'center',
                            washStrength: 'balanced',
                            categoryAppearance: 'outline',
                            showItemCounts: true,
                          }),
                          washStrength: strength,
                        },
                      })
                    }
                    className={`py-1.5 px-2 rounded-xl text-[10px] border transition-all ${
                      current === strength
                        ? 'border-teal-500 bg-teal-500/10 text-teal-300 font-semibold'
                        : 'border-neutral-800 bg-neutral-950 text-neutral-400 hover:border-neutral-700'
                    }`}
                  >
                    {labelMap[strength]}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Category Gateway Appearance */}
          <div>
            <span className="text-[10px] text-neutral-400 mb-1.5 block">استایل کارت‌های دروازه دسته‌بندی:</span>
            <div className="grid grid-cols-2 gap-1.5">
              {(['outline', 'filled'] as const).map((style) => {
                const current = config.modernSettings?.categoryAppearance || 'outline';
                const labelMap = { outline: 'خطی مدرن (Outline)', filled: 'پر و سایه‌دار (Filled)' };
                return (
                  <button
                    key={style}
                    type="button"
                    onClick={() =>
                      onConfigChange({
                        ...config,
                        modernSettings: {
                          ...(config.modernSettings || {
                            focalPosition: 'center',
                            washStrength: 'balanced',
                            categoryAppearance: 'outline',
                            showItemCounts: true,
                          }),
                          categoryAppearance: style,
                        },
                      })
                    }
                    className={`py-1.5 px-2 rounded-xl text-[10px] border transition-all ${
                      current === style
                        ? 'border-teal-500 bg-teal-500/10 text-teal-300 font-semibold'
                        : 'border-neutral-800 bg-neutral-950 text-neutral-400 hover:border-neutral-700'
                    }`}
                  >
                    {labelMap[style]}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Show Category Item Counts Toggle */}
          <div className="pt-1">
            <label className="flex items-center justify-between p-2 rounded-xl bg-neutral-950 border border-neutral-800 cursor-pointer">
              <span className="text-[11px] text-neutral-300">نمایش تعداد آیتم‌ها در کارت‌های دسته‌بندی</span>
              <input
                type="checkbox"
                checked={config.modernSettings?.showItemCounts ?? true}
                onChange={(e) =>
                  onConfigChange({
                    ...config,
                    modernSettings: {
                      ...(config.modernSettings || {
                        focalPosition: 'center',
                        washStrength: 'balanced',
                        categoryAppearance: 'outline',
                        showItemCounts: true,
                      }),
                      showItemCounts: e.target.checked,
                    },
                  })
                }
                className="accent-teal-500 rounded cursor-pointer"
              />
            </label>
          </div>
        </div>
      )}

      {/* ================================================================= */}
      {/* SECTION 4: THEME 3 SPECIFIC CONTROLS (VISUAL EXPLORER)             */}
      {/* ================================================================= */}
      {config.id === 'minimal' && (
        <div className="space-y-3.5 pt-3 border-t border-neutral-800">
          <div className="flex items-center gap-1.5 text-sky-400 font-bold text-xs">
            <Layers className="w-3.5 h-3.5" />
            <span>تنظیمات اختصاصی پوسته سوم (کاوشگر تصویری)</span>
          </div>

          {/* Hero Focal Position */}
          <div>
            <span className="text-[10px] text-neutral-400 mb-1.5 block">موقعیت فوکوس تصویر هیرو:</span>
            <div className="grid grid-cols-3 gap-1.5">
              {(['top', 'center', 'bottom'] as const).map((pos) => {
                const currentPos = config.minimalSettings?.focalPosition || 'center';
                const labelMap = { top: 'بالا (Top)', center: 'مرکز (Center)', bottom: 'پایین (Bottom)' };
                return (
                  <button
                    key={pos}
                    type="button"
                    onClick={() =>
                      onConfigChange({
                        ...config,
                        minimalSettings: {
                          ...(config.minimalSettings || {
                            focalPosition: 'center',
                            gradientStrength: 'balanced',
                          }),
                          focalPosition: pos,
                        },
                      })
                    }
                    className={`py-1.5 px-2 rounded-xl text-[10px] border transition-all ${
                      currentPos === pos
                        ? 'border-sky-500 bg-sky-500/10 text-sky-300 font-semibold'
                        : 'border-neutral-800 bg-neutral-950 text-neutral-400 hover:border-neutral-700'
                    }`}
                  >
                    {labelMap[pos]}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Category Scrim Gradient Strength */}
          <div>
            <span className="text-[10px] text-neutral-400 mb-1.5 block">شدت گرادینت زیر عنوان کارت‌های دسته‌بندی:</span>
            <div className="grid grid-cols-3 gap-1.5">
              {(['subtle', 'balanced', 'strong'] as const).map((strength) => {
                const current = config.minimalSettings?.gradientStrength || 'balanced';
                const labelMap = { subtle: 'ملایم و شفاف', balanced: 'متعادل', strong: 'تیره و خوانا' };
                return (
                  <button
                    key={strength}
                    type="button"
                    onClick={() =>
                      onConfigChange({
                        ...config,
                        minimalSettings: {
                          ...(config.minimalSettings || {
                            focalPosition: 'center',
                            gradientStrength: 'balanced',
                          }),
                          gradientStrength: strength,
                        },
                      })
                    }
                    className={`py-1.5 px-2 rounded-xl text-[10px] border transition-all ${
                      current === strength
                        ? 'border-sky-500 bg-sky-500/10 text-sky-300 font-semibold'
                        : 'border-neutral-800 bg-neutral-950 text-neutral-400 hover:border-neutral-700'
                    }`}
                  >
                    {labelMap[strength]}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Style 3 Category Image Editor for Each Category */}
          <div className="space-y-2 pt-1">
            <span className="font-semibold text-neutral-200 text-[11px] block">
              ویرایش تصاویر دسته‌بندی‌ها (گالری مربعی):
            </span>
            <div className="space-y-1.5">
              {restaurant.categories.map((category, idx) => {
                const isOpen = openCategoryIndex === idx;
                const defaultCat = mockRestaurantData.categories.find((c) => c.id === category.id);
                return (
                  <div
                    key={category.id}
                    className="p-2 rounded-xl bg-neutral-950 border border-neutral-800 space-y-2"
                  >
                    <div
                      className="flex items-center justify-between cursor-pointer select-none"
                      onClick={() => setOpenCategoryIndex(isOpen ? null : idx)}
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        <img
                          src={category.image || restaurant.heroImage}
                          alt={category.name}
                          className="w-7 h-7 rounded-lg object-cover border border-neutral-700 shrink-0"
                        />
                        <span className="text-[11px] font-medium text-neutral-200 truncate">
                          {category.name}
                        </span>
                      </div>
                      <div className="flex items-center gap-1 text-[10px] text-neutral-400">
                        <span>{isOpen ? 'بستن' : 'تغییر تصویر'}</span>
                        {isOpen ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                      </div>
                    </div>

                    {isOpen && (
                      <div className="pt-2 border-t border-neutral-800/80">
                        <ImageInput
                          label={`تصویر دسته‌بندی ${category.name}`}
                          value={category.image || ''}
                          onChange={(newUrl) => handleCategoryImageChange(category.id, newUrl)}
                          defaultFallback={defaultCat?.image}
                          placeholder="https://..."
                        />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* ================================================================= */}
      {/* SECTION 5: JSON SCHEMA EXPORT                                     */}
      {/* ================================================================= */}
      <div className="pt-3 border-t border-neutral-800 space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-neutral-400 font-semibold text-[11px]">خروجی جیسون تنظیمات:</span>
          <button
            onClick={handleCopyJson}
            className="flex items-center gap-1 text-[10px] bg-neutral-800 hover:bg-neutral-700 text-amber-300 px-2.5 py-1 rounded-lg transition-colors cursor-pointer"
          >
            {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
            {copied ? 'کپی شد' : 'کپی کانفیگ'}
          </button>
        </div>
        <pre
          className="bg-neutral-950 p-2.5 rounded-xl border border-neutral-800 text-[10px] text-neutral-400 overflow-x-auto max-h-24 no-scrollbar font-mono"
          dir="ltr"
        >
          {JSON.stringify(
            {
              themeId: config.id,
              primaryColor: currentColors.primary,
              secondaryColor: currentColors.secondary,
              backgroundIntensity: config.backgroundIntensity || 'balanced',
              ...(config.id === 'immersive' && { immersiveSettings: config.immersiveSettings, hero: config.hero }),
              ...(config.id === 'modern' && { modernSettings: config.modernSettings }),
              ...(config.id === 'minimal' && { minimalSettings: config.minimalSettings }),
            },
            null,
            2
          )}
        </pre>
      </div>
    </div>
  );
};
