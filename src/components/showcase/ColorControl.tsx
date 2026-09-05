import React, { useState, useEffect, useRef } from 'react';
import { RotateCcw } from 'lucide-react';
import { normalizeHex, getContrastForeground } from '../../utils/themeColors';

interface ColorControlProps {
  label: string;
  sublabel?: string;
  value: string;
  defaultValue: string;
  onChange: (colorHex: string) => void;
  id?: string;
}

export const ColorControl: React.FC<ColorControlProps> = ({
  label,
  sublabel,
  value,
  defaultValue,
  onChange,
  id,
}) => {
  const normalizedValue = normalizeHex(value) || defaultValue;
  const [hexInput, setHexInput] = useState(normalizedValue);
  const colorInputRef = useRef<HTMLInputElement>(null);

  // Synchronize local input state when value prop changes externally
  useEffect(() => {
    setHexInput(normalizedValue);
  }, [normalizedValue]);

  const handleTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let text = e.target.value;
    if (!text.startsWith('#')) {
      text = '#' + text;
    }
    setHexInput(text);

    // If it's a valid 6-character or 3-character hex, notify parent live
    const valid = normalizeHex(text);
    if (valid) {
      onChange(valid);
    }
  };

  const handleBlur = () => {
    const valid = normalizeHex(hexInput);
    if (valid) {
      setHexInput(valid);
      onChange(valid);
    } else {
      // Revert to valid current prop value if invalid text on blur
      setHexInput(normalizedValue);
    }
  };

  const handleNativeColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const next = e.target.value.toUpperCase();
    setHexInput(next);
    onChange(next);
  };

  const handleReset = () => {
    setHexInput(defaultValue.toUpperCase());
    onChange(defaultValue.toUpperCase());
  };

  const isAtDefault = normalizedValue.toUpperCase() === defaultValue.toUpperCase();
  const contrastFg = getContrastForeground(normalizedValue);

  return (
    <div className="space-y-1.5" id={id}>
      <div className="flex items-center justify-between">
        <div className="flex items-baseline gap-1.5">
          <span className="text-[11px] font-semibold text-neutral-200">{label}</span>
          {sublabel && <span className="text-[10px] text-neutral-400 font-normal">({sublabel})</span>}
        </div>
        {!isAtDefault && (
          <button
            type="button"
            onClick={handleReset}
            className="text-[10px] text-neutral-400 hover:text-white flex items-center gap-1 transition-colors px-1.5 py-0.5 rounded hover:bg-neutral-800"
            title="بازنشانی به رنگ پیش‌فرض پوسته"
            aria-label={`بازنشانی ${label} به پیش‌فرض`}
          >
            <RotateCcw className="w-2.5 h-2.5" />
            <span>پیش‌فرض</span>
          </button>
        )}
      </div>

      <div className="flex items-center gap-2">
        {/* Color Swatch / Trigger */}
        <div className="relative shrink-0">
          <button
            type="button"
            onClick={() => colorInputRef.current?.click()}
            className="w-9 h-9 rounded-xl border border-neutral-700/80 shadow-inner flex items-center justify-center cursor-pointer transition-transform active:scale-95 focus:outline-hidden focus:ring-2 focus:ring-white/40 overflow-hidden relative"
            style={{ backgroundColor: normalizedValue }}
            title="انتخاب رنگ از پالت"
            aria-label={`انتخاب رنگ ${label}`}
          >
            {/* Visual dot indicator inside swatch showing foreground contrast tone */}
            <span
              className="w-2.5 h-2.5 rounded-full opacity-60 border border-black/20 pointer-events-none"
              style={{ backgroundColor: contrastFg }}
            />
          </button>
          {/* Hidden native color input */}
          <input
            ref={colorInputRef}
            type="color"
            value={normalizedValue}
            onChange={handleNativeColorChange}
            className="absolute inset-0 opacity-0 w-0 h-0 pointer-events-none"
            tabIndex={-1}
            aria-hidden="true"
          />
        </div>

        {/* HEX Input Field */}
        <div className="flex-1 relative">
          <input
            type="text"
            value={hexInput}
            onChange={handleTextChange}
            onBlur={handleBlur}
            maxLength={7}
            placeholder="#000000"
            dir="ltr"
            className="w-full bg-neutral-950 border border-neutral-800 focus:border-neutral-500 rounded-xl px-3 py-2 text-xs font-mono text-white focus:outline-hidden transition-colors uppercase tracking-wider"
            aria-label={`کد هگزادسیمال ${label}`}
          />
        </div>
      </div>
    </div>
  );
};
