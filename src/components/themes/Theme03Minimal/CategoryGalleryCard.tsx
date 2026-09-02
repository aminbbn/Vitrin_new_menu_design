import React from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft } from 'lucide-react';
import { MenuCategory, MenuItem } from '../../../types/menu';
import { SafeImage } from '../../common/SafeImage';
import { toPersianDigits } from '../../../utils/formatters';
import { getCategoryDisplayImage } from './categoryImageUtils';

interface CategoryGalleryCardProps {
  category: MenuCategory;
  items: MenuItem[];
  restaurantHeroImage?: string;
  accentColor: string;
  onSelect: (categoryId: string) => void;
  index: number;
}

export const CategoryGalleryCard: React.FC<CategoryGalleryCardProps> = ({
  category,
  items,
  restaurantHeroImage,
  accentColor,
  onSelect,
}) => {
  const imageUrl = getCategoryDisplayImage(category, items, restaurantHeroImage);
  const categoryItemsCount = items.filter((item) => item.categoryId === category.id).length;

  return (
    <motion.button
      type="button"
      id={`visual-category-card-${category.id}`}
      onClick={() => onSelect(category.id)}
      whileTap={{ scale: 0.98 }}
      transition={{ duration: 0.15, ease: 'easeOut' }}
      className="group relative w-full h-36 sm:h-40 md:h-44 rounded-2xl overflow-hidden cursor-pointer select-none text-right border border-white/10 shadow-md hover:shadow-xl hover:border-white/20 transition-all duration-300 block bg-neutral-900 focus:outline-hidden focus-visible:ring-2 focus-visible:ring-white/50"
      dir="rtl"
      aria-label={`دسته‌بندی ${category.name}`}
    >
      {/* 1. Edge-to-Edge Photographic Image */}
      <div className="absolute inset-0 w-full h-full overflow-hidden">
        <SafeImage
          src={imageUrl}
          alt={category.name}
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500 ease-out"
          fallbackContainerClassName="w-full h-full bg-neutral-800"
          fallbackIconClassName="w-8 h-8 text-neutral-600"
          loading="lazy"
        />
      </div>

      {/* 2. Natural Readability Gradient: Subtle gradient concentrated behind text */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-transparent pointer-events-none" />

      {/* 3. Micro Ambient Highlight on Hover */}
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-300 pointer-events-none"
        style={{ backgroundColor: accentColor }}
      />

      {/* 4. Text & Metadata Over Image (Bottom Aligned) */}
      <div className="absolute inset-x-0 bottom-0 p-4 sm:p-5 flex items-end justify-between gap-3 z-10 pointer-events-none">
        <div className="min-w-0 flex-1 space-y-1 text-right">
          {/* Persian Category Name */}
          <h3 className="font-bold text-base sm:text-lg md:text-xl text-white tracking-tight drop-shadow-sm truncate leading-snug">
            {category.name}
          </h3>

          {/* Subtitle / English Name / Description */}
          {category.description ? (
            <p className="text-xs sm:text-[13px] text-neutral-300/90 font-light truncate max-w-md">
              {category.description}
            </p>
          ) : category.nameEn ? (
            <p className="text-xs text-neutral-300/80 font-normal tracking-wide truncate">
              {category.nameEn}
            </p>
          ) : null}
        </div>

        {/* Action Cue + Items Count Pill */}
        <div className="shrink-0 flex items-center gap-2">
          {categoryItemsCount > 0 && (
            <span className="px-2.5 py-1 rounded-full text-[11px] font-medium bg-black/50 text-white/90 backdrop-blur-md border border-white/15">
              {toPersianDigits(categoryItemsCount)} خوراک
            </span>
          )}

          <div
            className="w-8 h-8 rounded-full flex items-center justify-center bg-white/15 backdrop-blur-md text-white border border-white/20 group-hover:bg-white/25 transition-colors"
          >
            <ChevronLeft className="w-4 h-4 stroke-[2.5]" />
          </div>
        </div>
      </div>
    </motion.button>
  );
};
