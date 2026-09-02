import React, { useRef, useState } from 'react';
import { Upload, Link as LinkIcon, Image as ImageIcon, X, RefreshCw } from 'lucide-react';
import { SafeImage } from '../common/SafeImage';

interface ImageInputProps {
  label: string;
  value: string;
  onChange: (newValue: string) => void;
  placeholder?: string;
  defaultFallback?: string;
}

export const ImageInput: React.FC<ImageInputProps> = ({
  label,
  value,
  onChange,
  placeholder = 'https://...',
  defaultFallback,
}) => {
  const [mode, setMode] = useState<'url' | 'file'>('url');
  const [urlInput, setUrlInput] = useState(value);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleUrlBlur = () => {
    if (urlInput !== value) {
      onChange(urlInput);
    }
  };

  const handleUrlKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      onChange(urlInput);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('لطفاً یک فایل تصویری معتبر انتخاب کنید.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      if (dataUrl) {
        setUrlInput(dataUrl);
        onChange(dataUrl);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleResetToDefault = () => {
    if (defaultFallback) {
      setUrlInput(defaultFallback);
      onChange(defaultFallback);
    }
  };

  return (
    <div className="space-y-1.5 text-xs text-right" dir="rtl">
      <div className="flex items-center justify-between">
        <span className="font-semibold text-neutral-300 text-[11px]">{label}</span>
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => setMode('url')}
            className={`px-1.5 py-0.5 rounded text-[10px] transition-colors ${
              mode === 'url'
                ? 'bg-neutral-800 text-amber-400 font-medium'
                : 'text-neutral-500 hover:text-neutral-300'
            }`}
          >
            آدرس (URL)
          </button>
          <span className="text-neutral-700">|</span>
          <button
            type="button"
            onClick={() => {
              setMode('file');
              fileInputRef.current?.click();
            }}
            className={`px-1.5 py-0.5 rounded text-[10px] transition-colors ${
              mode === 'file'
                ? 'bg-neutral-800 text-amber-400 font-medium'
                : 'text-neutral-500 hover:text-neutral-300'
            }`}
          >
            آپلود فایل
          </button>
          {defaultFallback && value !== defaultFallback && (
            <button
              type="button"
              onClick={handleResetToDefault}
              className="text-neutral-500 hover:text-amber-400 text-[10px] mr-1"
              title="بازنشانی تصویر پیش‌فرض"
            >
              <RefreshCw className="w-2.5 h-2.5" />
            </button>
          )}
        </div>
      </div>

      <div className="flex items-center gap-2">
        {/* Thumbnail Preview */}
        <div className="w-10 h-10 rounded-lg overflow-hidden bg-neutral-950 border border-neutral-800 shrink-0 relative flex items-center justify-center">
          <SafeImage
            src={value}
            alt="پیش‌نمایش"
            className="w-full h-full object-cover"
            fallbackContainerClassName="w-full h-full bg-neutral-900 flex items-center justify-center"
            fallbackIconClassName="w-4 h-4 text-neutral-600"
          />
        </div>

        {/* Input Control */}
        <div className="flex-1 min-w-0">
          {mode === 'url' ? (
            <div className="relative">
              <input
                type="text"
                value={urlInput}
                onChange={(e) => setUrlInput(e.target.value)}
                onBlur={handleUrlBlur}
                onKeyDown={handleUrlKeyDown}
                placeholder={placeholder}
                className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-2.5 py-1.5 text-[11px] text-neutral-200 placeholder-neutral-600 focus:outline-hidden focus:border-amber-500"
                dir="ltr"
              />
            </div>
          ) : (
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="w-full bg-neutral-950 hover:bg-neutral-900 border border-neutral-800 border-dashed rounded-lg px-2.5 py-1.5 text-[11px] text-neutral-400 flex items-center justify-center gap-1.5 transition-colors"
            >
              <Upload className="w-3 h-3 text-amber-400" />
              <span>انتخاب فایل از سیستم...</span>
            </button>
          )}
        </div>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
      />
    </div>
  );
};
