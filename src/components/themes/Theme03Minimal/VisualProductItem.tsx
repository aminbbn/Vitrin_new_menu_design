import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';
import { MenuItem } from '../../../types/menu';
import { formatToman, toPersianDigits } from '../../../utils/formatters';
import { getContrastForeground } from '../../../utils/themeColors';
import { SafeImage } from '../../common/SafeImage';
import { useMenuSelection } from '../../../context/MenuSelectionContext';

interface VisualProductItemProps {
  item: MenuItem;
  accentColor?: string;
  primaryColor?: string;
  secondaryColor?: string;
  onSelect: (item: MenuItem) => void;
  index: number;
}

export const VisualProductItem: React.FC<VisualProductItemProps> = ({
  item,
  accentColor = '#38bdf8',
  primaryColor,
  secondaryColor,
  onSelect,
}) => {
  const { getItemQuantity } = useMenuSelection();
  const currentQty = getItemQuantity(item.id);
  const isSoldOut = item.availability === 'sold_out';
  const isLowStock = item.availability === 'low_stock';
  const prim = primaryColor || accentColor;
  const primFg = getContrastForeground(prim);

  // Primary badge label
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
      {/* 1. PHOTOGRAPHIC IMAGE CANVAS (Square 1:1 Aspect Ratio) */}
      <div
        className={`relative w-full aspect-square overflow-hidden rounded-2xl bg-neutral-900 border border-white/10 shadow-md group-hover:border-white/20 transition-all duration-300 ${
          isSoldOut ? 'opacity-65 grayscale-[40%]' : ''
        }`}
      >
        <SafeImage
          src={item.image}
          alt={item.name}
          className="w-full h-full object-cover object-center group-hover:scale-104 transition-transform duration-500 ease-out"
          fallbackContainerClassName="w-full h-full bg-neutral-900 flex items-center justify-center"
          fallbackIconClassName="w-10 h-10 text-neutral-700"
          loading="lazy"
        />

        {/* Natural subtle gradient vignette for badges */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/25 pointer-events-none" />

        {/* Top Badges & Statuses */}
        <div className="absolute top-3 inset-x-3 flex items-center justify-between gap-2 pointer-events-none z-10">
          {/* Right (RTL): Primary Badge or Availability */}
          <div className="flex items-center gap-1.5 flex-wrap">
            {primaryBadge && !isSoldOut && (
              <span
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-medium backdrop-blur-md shadow-xs border border-white/20"
                style={{ backgroundColor: `${prim}e6`, color: primFg }}
              >
                <Sparkles className="w-3 h-3" style={{ fill: primFg }} />
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

          {/* Left (RTL): Selected Quantity Badge */}
          {currentQty > 0 && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-black/80 text-white backdrop-blur-md border border-white/25 shadow-md">
              <span
                className="w-2 h-2 rounded-full inline-block"
                style={{ backgroundColor: prim }}
              />
              <span>{toPersianDigits(currentQty)} انتخاب شده</span>
            </span>
          )}
        </div>
      </div>

      {/* 2. CAPTION HIERARCHY: Title -> Description -> Price */}
      <div className="pt-3 space-y-1.5 text-right">
        {/* Level 1: Product Title */}
        <h3 className="font-bold text-sm sm:text-base text-white tracking-tight leading-snug group-hover:text-amber-200/90 transition-colors">
          {item.name}
        </h3>

        {/* Level 2: Description */}
        {item.description && (
          <p className="text-xs text-neutral-400 font-light line-clamp-2 leading-relaxed">
            {item.description}
          </p>
        )}

        {/* Level 3: Price */}
        <div className="pt-0.5">
          <span className="text-xs sm:text-sm font-semibold text-neutral-200 tracking-tight">
            {formatToman(item.price)}
          </span>
        </div>
      </div>

      {/* 3. Subtle Clean Divider */}
      <div className="pt-5 pb-1">
        <div className="w-full h-px bg-white/5" />
      </div>
    </motion.article>
  );
};
