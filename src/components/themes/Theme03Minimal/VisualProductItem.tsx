import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Check } from 'lucide-react';
import { MenuItem } from '../../../types/menu';
import { formatToman, toPersianDigits } from '../../../utils/formatters';
import { SafeImage } from '../../common/SafeImage';
import { useMenuSelection } from '../../../context/MenuSelectionContext';

interface VisualProductItemProps {
  item: MenuItem;
  accentColor: string;
  onSelect: (item: MenuItem) => void;
  index: number;
}

export const VisualProductItem: React.FC<VisualProductItemProps> = ({
  item,
  accentColor,
  onSelect,
}) => {
  const { getItemQuantity } = useMenuSelection();
  const currentQty = getItemQuantity(item.id);
  const isSoldOut = item.availability === 'sold_out';
  const isLowStock = item.availability === 'low_stock';
  const isFeatured = Boolean(item.isSpecial || item.isFeatured);

  // Derive a single primary badge if applicable
  const primaryBadge = item.isSpecial
    ? 'پیشنهاد سرآشپز'
    : item.isFeatured
    ? 'محبوب مشتریان'
    : null;

  return (
    <motion.article
      id={`visual-product-${item.id}`}
      onClick={() => onSelect(item)}
      whileTap={{ scale: 0.985 }}
      transition={{ duration: 0.15, ease: 'easeOut' }}
      className="group w-full cursor-pointer select-none text-right focus:outline-hidden"
      dir="rtl"
      aria-label={`مشاهده مشخصات ${item.name}`}
    >
      {/* 1. PHOTOGRAPHIC IMAGE CANVAS (Full width, stable 16:10 aspect ratio) */}
      <div
        className={`relative w-full overflow-hidden rounded-2xl bg-neutral-900 border border-white/10 shadow-md group-hover:border-white/20 transition-all duration-300 ${
          isFeatured ? 'aspect-[16/11] sm:aspect-[16/10]' : 'aspect-[16/10]'
        } ${isSoldOut ? 'opacity-65 grayscale-[40%]' : ''}`}
      >
        <SafeImage
          src={item.image}
          alt={item.name}
          className="w-full h-full object-cover object-center group-hover:scale-103 transition-transform duration-500 ease-out"
          fallbackContainerClassName="w-full h-full bg-neutral-900 flex items-center justify-center"
          fallbackIconClassName="w-10 h-10 text-neutral-700"
          loading="lazy"
        />

        {/* Natural gradient vignette for overlays */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20 pointer-events-none" />

        {/* Top Badges & Statuses */}
        <div className="absolute top-3 inset-x-3 flex items-center justify-between gap-2 pointer-events-none z-10">
          {/* Right (RTL): Primary Badge or Availability */}
          <div className="flex items-center gap-1.5 flex-wrap">
            {primaryBadge && !isSoldOut && (
              <span
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-medium text-white backdrop-blur-md shadow-xs border border-white/20"
                style={{ backgroundColor: `${accentColor}cc` }}
              >
                <Sparkles className="w-3 h-3 fill-white/80" />
                <span>{primaryBadge}</span>
              </span>
            )}

            {isSoldOut && (
              <span className="px-2.5 py-1 rounded-full text-[11px] font-medium bg-rose-950/90 text-rose-200 border border-rose-500/30 backdrop-blur-md">
                اتمام موجودی
              </span>
            )}

            {isLowStock && !isSoldOut && (
              <span className="px-2.5 py-1 rounded-full text-[11px] font-medium bg-amber-950/80 text-amber-200 border border-amber-500/30 backdrop-blur-md">
                تعداد محدود
              </span>
            )}
          </div>

          {/* Left (RTL): Subtle Selection Pill (Only if selected > 0) */}
          {currentQty > 0 && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-black/75 text-white backdrop-blur-md border border-white/25 shadow-md">
              <span
                className="w-2 h-2 rounded-full inline-block"
                style={{ backgroundColor: accentColor }}
              />
              <span>{toPersianDigits(currentQty)} انتخاب شده</span>
            </span>
          )}
        </div>
      </div>

      {/* 2. CLEAN CAPTION AREA (Immediately below image) */}
      <div className="pt-2.5 sm:pt-3 space-y-1 text-right">
        {/* Row 1: Title + Price */}
        <div className="flex items-baseline justify-between gap-3">
          <h3 className="font-semibold text-sm sm:text-base text-white tracking-tight truncate flex-1 group-hover:text-neutral-100 transition-colors">
            {item.name}
          </h3>

          <span className="shrink-0 text-xs sm:text-[13px] font-normal text-neutral-300 tracking-tight whitespace-nowrap">
            {formatToman(item.price)}
          </span>
        </div>

        {/* Row 2: Short Description */}
        {item.description && (
          <p className="text-xs text-neutral-400 font-light truncate leading-relaxed max-w-xl">
            {item.description}
          </p>
        )}
      </div>

      {/* 3. Subtle Rhythmic Divider */}
      <div className="pt-5 sm:pt-6 pb-1">
        <div className="w-full h-px bg-white/5" />
      </div>
    </motion.article>
  );
};
