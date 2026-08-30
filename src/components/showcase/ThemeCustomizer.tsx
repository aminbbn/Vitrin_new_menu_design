import React, { useState } from 'react';
import { MenuThemeConfig } from '../../types/menu';
import { Palette, Type, Sliders, Sparkles, Copy, Check, RefreshCw } from 'lucide-react';

interface ThemeCustomizerProps {
  config: MenuThemeConfig;
  onChange: (updated: MenuThemeConfig) => void;
  onReset: () => void;
}

const ACCENT_PRESETS = [
  { label: 'طلایی لوکس (Gold)', value: '#d4af37' },
  { label: 'نارنجی اشتهاآور (Orange)', value: '#f97316' },
  { label: 'سبز زمردی (Emerald)', value: '#10b981' },
  { label: 'فیروزه‌ای مدرن (Teal)', value: '#2dd4bf' },
  { label: 'زرشکی کهنسال (Ruby)', value: '#e11d48' },
  { label: 'آبی یاقوتی (Sapphire)', value: '#38bdf8' },
];

export const ThemeCustomizer: React.FC<ThemeCustomizerProps> = ({
  config,
  onChange,
  onReset,
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopyJson = () => {
    navigator.clipboard.writeText(JSON.stringify(config, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="w-full max-w-sm bg-neutral-900 border border-neutral-800 rounded-2xl p-5 text-neutral-100 space-y-5 text-xs shadow-2xl h-full overflow-y-auto no-scrollbar">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
        <div className="flex items-center gap-2">
          <Sliders className="w-4 h-4 text-amber-400" />
          <h3 className="font-bold text-sm text-white">تنظیمات ویترین اکسپرینس</h3>
        </div>
        <button
          onClick={onReset}
          className="text-neutral-400 hover:text-white flex items-center gap-1 text-[11px]"
          title="بازنشانی تنظیمات به پیش‌فرض"
        >
          <RefreshCw className="w-3 h-3" />
          ریست
        </button>
      </div>

      {/* Theme Info */}
      <div className="p-3 rounded-xl bg-neutral-800/40 border border-neutral-800">
        <div className="text-[11px] text-neutral-400">پوسته فعال:</div>
        <div className="font-bold text-amber-400 mt-0.5">{config.nameFa}</div>
        <div className="text-[11px] text-neutral-400 mt-1 leading-relaxed">{config.descriptionFa}</div>
      </div>

      {/* Accent Color Picker */}
      <div className="space-y-2">
        <label className="font-semibold text-neutral-300 flex items-center gap-1.5">
          <Palette className="w-3.5 h-3.5 text-amber-400" />
          رنگ شاخص برند (Accent Color)
        </label>
        <div className="grid grid-cols-3 gap-1.5">
          {ACCENT_PRESETS.map((preset) => (
            <button
              key={preset.value}
              onClick={() => onChange({ ...config, accentColor: preset.value })}
              className={`p-2 rounded-xl border flex flex-col items-center gap-1 text-[10px] transition-all ${
                config.accentColor === preset.value
                  ? 'border-white bg-neutral-800 font-bold text-white'
                  : 'border-neutral-800 bg-neutral-950 text-neutral-400 hover:border-neutral-700'
              }`}
            >
              <span
                className="w-4 h-4 rounded-full shadow-sm"
                style={{ backgroundColor: preset.value }}
              />
              <span className="truncate w-full text-center">{preset.label.split(' ')[0]}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Hero Headline & Subheadline */}
      <div className="space-y-3">
        <label className="font-semibold text-neutral-300 flex items-center gap-1.5">
          <Type className="w-3.5 h-3.5 text-amber-400" />
          متن تیتر و خوش‌آمدگویی هیرو
        </label>

        <div>
          <span className="text-[10px] text-neutral-400 mb-1 block">تیتر اصلی:</span>
          <input
            type="text"
            value={config.hero.headline}
            onChange={(e) =>
              onChange({
                ...config,
                hero: { ...config.hero, headline: e.target.value },
              })
            }
            className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-amber-500 text-xs"
          />
        </div>

        <div>
          <span className="text-[10px] text-neutral-400 mb-1 block">زیرتیتر توضیحی:</span>
          <textarea
            rows={2}
            value={config.hero.subheadline}
            onChange={(e) =>
              onChange({
                ...config,
                hero: { ...config.hero, subheadline: e.target.value },
              })
            }
            className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-amber-500 text-xs"
          />
        </div>

        <div>
          <span className="text-[10px] text-neutral-400 mb-1 block">متن دکمه CTA:</span>
          <input
            type="text"
            value={config.hero.ctaText}
            onChange={(e) =>
              onChange({
                ...config,
                hero: { ...config.hero, ctaText: e.target.value },
              })
            }
            className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-amber-500 text-xs"
          />
        </div>
      </div>

      {/* Transition Speed */}
      <div className="space-y-2">
        <div className="flex justify-between">
          <span className="font-semibold text-neutral-300">سرعت ترنزیشن هیرو:</span>
          <span className="font-bold text-amber-400">{config.hero.transitionDurationMs} میلی‌ثانیه</span>
        </div>
        <input
          type="range"
          min="400"
          max="1200"
          step="50"
          value={config.hero.transitionDurationMs}
          onChange={(e) =>
            onChange({
              ...config,
              hero: {
                ...config.hero,
                transitionDurationMs: Number(e.target.value),
              },
            })
          }
          className="w-full accent-amber-500 bg-neutral-800"
        />
        <div className="flex justify-between text-[10px] text-neutral-500 font-medium">
          <span>۴۰۰ms (سریع)</span>
          <span>۱۲۰۰ms (سینمایی)</span>
        </div>
      </div>

      {/* JSON Schema Export for Vitrin integration */}
      <div className="pt-3 border-t border-neutral-800 space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-neutral-400 font-semibold text-[11px]">کانفیگ جیسون پوسته:</span>
          <button
            onClick={handleCopyJson}
            className="flex items-center gap-1 text-[10px] bg-neutral-800 hover:bg-neutral-700 text-amber-300 px-2.5 py-1 rounded-lg transition-colors"
          >
            {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
            {copied ? 'کپی شد' : 'کپی کانفیگ'}
          </button>
        </div>
        <pre className="bg-neutral-950 p-2.5 rounded-xl border border-neutral-800 text-[10px] text-neutral-400 overflow-x-auto max-h-28 no-scrollbar" dir="ltr">
          {JSON.stringify(config, null, 2)}
        </pre>
      </div>
    </div>
  );
};
