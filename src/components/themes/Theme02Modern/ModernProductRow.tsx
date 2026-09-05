import React from 'react';
import { Plus, Minus, Flame, Sparkles, Leaf } from 'lucide-react';
import { MenuItem } from '../../../types/menu';
import { formatToman, toPersianDigits } from '../../../utils/formatters';
import { getContrastForeground } from '../../../utils/themeColors';
import { SafeImage } from '../../common/SafeImage';
import { useMenuSelection } from '../../../context/MenuSelectionContext';

interface ModernProductRowProps {
  item: MenuItem;
  accentColor?: string;
  primaryColor?: string;
  secondaryColor?: string;
  onOpenDetail: (item: MenuItem) => void;
}

export const ModernProductRow: React.FC<ModernProductRowProps> = ({
  item,
  accentColor = '#0f766e',
  primaryColor,
  secondaryColor,
  onOpenDetail,
}) => {
  const { getItemQuantity, addItem, decreaseItem } = useMenuSelection();
  const quantity = getItemQuantity(item.id);
  const prim = primaryColor || accentColor;
  const primFg = getContrastForeground(prim);

  const getPrimaryBadge = () => {
    if (item.isPopular) {
      return {
        label: 'محبوب مشتریان',
        icon: <Sparkles className="w-3 h-3 text-amber-600" />,
        className: 'bg-amber-50 text-amber-800 border-amber-200/80',
      };
    }
    if (item.isSpicy) {
      return {
        label: 'تند',
        icon: <Flame className="w-3 h-3 text-rose-600" />,
        className: 'bg-rose-50 text-rose-800 border-rose-200/80',
      };
    }
    if (item.isVegetarian) {
      return {
        label: 'گیاهی',
        icon: <Leaf className="w-3 h-3 text-emerald-600" />,
        className: 'bg-emerald-50 text-emerald-800 border-emerald-200/80',
      };
    }
    return null;
  };

  const badge = getPrimaryBadge();

  return (
    <div
      onClick={() => onOpenDetail(item)}
      id={`modern-product-row-${item.id}`}
      className={`group relative w-full bg-white rounded-2xl p-3 sm:p-3.5 border transition-all duration-200 flex items-center gap-3.5 cursor-pointer select-none text-right ${
        quantity > 0
          ? 'border-stone-400 shadow-sm ring-1 ring-stone-300'
          : 'border-stone-200/90 shadow-xs hover:border-stone-300 hover:shadow-sm'
      }`}
      dir="rtl"
    >
      {/* 1. Thumbnail Image */}
      <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-xl overflow-hidden bg-stone-100 border border-stone-200/80 shrink-0 relative">
        <SafeImage
          src={item.image}
          alt={item.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          fallbackIconClassName="w-5 h-5 text-stone-400"
        />

        {/* Selected quantity tag over image */}
        {quantity > 0 && (
          <div
            className="absolute top-1.5 right-1.5 min-w-[20px] h-5 px-1.5 rounded-md text-[10px] font-bold flex items-center justify-center shadow-xs"
            style={{ backgroundColor: prim, color: primFg }}
          >
            {toPersianDigits(quantity)}
          </div>
        )}
      </div>

      {/* 2. Text Content & Price */}
      <div className="min-w-0 flex-1 flex flex-col justify-between self-stretch py-0.5">
        <div>
          {/* Title and Single Restrained Badge */}
          <div className="flex items-center gap-2 justify-between">
            <h3 className="font-bold text-stone-900 text-xs sm:text-sm tracking-tight truncate leading-tight">
              {item.name}
            </h3>

            {badge && (
              <span
                className={`hidden xs:inline-flex items-center gap-1 text-[10px] font-medium px-2 py-0.5 rounded-full border shrink-0 ${badge.className}`}
              >
                {badge.icon}
                <span>{badge.label}</span>
              </span>
            )}
          </div>

          {/* Description: Light & Editorial */}
          {item.description && (
            <p className="text-[11px] sm:text-xs text-stone-500 font-light mt-1 line-clamp-2 leading-relaxed">
              {item.description}
            </p>
          )}
        </div>

        {/* Price & Selection Control */}
        <div className="flex items-center justify-between pt-2 mt-auto border-t border-stone-100">
          <div className="flex items-center gap-1.5">
            <span className="font-bold text-stone-900 text-xs sm:text-sm">
              {formatToman(item.price)}
            </span>
          </div>

          {/* Interactive Stepper or Select CTA */}
          <div
            className="shrink-0 flex items-center"
            onClick={(e) => e.stopPropagation()}
          >
            {quantity === 0 ? (
              <button
                type="button"
                onClick={() => addItem(item.id)}
                className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-stone-100 hover:bg-stone-200/80 active:bg-stone-300 text-stone-700 flex items-center justify-center transition-all active:scale-95 border border-stone-200 cursor-pointer shadow-2xs"
                aria-label="افزودن به انتخاب‌ها"
                title="افزودن به انتخاب‌ها"
              >
                <Plus className="w-3.5 h-3.5 text-stone-800 stroke-[2.5]" />
              </button>
            ) : (
              <div className="flex items-center gap-1.5 bg-stone-100 rounded-xl p-0.5 border border-stone-200">
                <button
                  type="button"
                  onClick={() => decreaseItem(item.id)}
                  className="w-6 h-6 sm:w-7 sm:h-7 rounded-lg bg-white hover:bg-stone-50 text-stone-700 flex items-center justify-center active:scale-95 transition-all cursor-pointer shadow-2xs"
                  aria-label="کاهش تعداد"
                >
                  <Minus className="w-3 h-3 text-stone-700 stroke-[2.5]" />
                </button>

                <span className="w-5 text-center text-xs font-bold text-stone-900 select-none">
                  {toPersianDigits(quantity)}
                </span>

                <button
                  type="button"
                  onClick={() => addItem(item.id)}
                  className="w-6 h-6 sm:w-7 sm:h-7 rounded-lg flex items-center justify-center active:scale-95 transition-all cursor-pointer shadow-2xs"
                  style={{ backgroundColor: prim, color: primFg }}
                  aria-label="افزایش تعداد"
                >
                  <Plus className="w-3 h-3 stroke-[2.5]" style={{ color: primFg }} />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
