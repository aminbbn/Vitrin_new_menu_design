import React from 'react';
import { motion } from 'framer-motion';
import { MenuCategory, MenuItem } from '../../../types/menu';
import { SafeImage } from '../../common/SafeImage';
import { getCategoryDisplayImage } from './categoryImageUtils';

interface CategoryGalleryCardProps {
  category: MenuCategory;
  items: MenuItem[];
  restaurantHeroImage?: string;
  accentColor: string;
  gradientStrength?: 'subtle' | 'balanced' | 'strong';
  onSelect: (categoryId: string) => void;
  index: number;
}

export const CategoryGalleryCard: React.FC<CategoryGalleryCardProps> = ({
  category,
  items,
  restaurantHeroImage,
  accentColor,
  gradientStrength = 'balanced',
  onSelect,
}) => {
  const imageUrl = getCategoryDisplayImage(category, items, restaurantHeroImage);

  const gradientClass =
    gradientStrength === 'subtle'
      ? 'from-black/70 via-black/25 to-transparent'
      : gradientStrength === 'strong'
      ? 'from-black/95 via-black/55 to-transparent'
      : 'from-black/85 via-black/40 to-transparent';

  return (
    <motion.button
      type="button"
      id={`visual-category-card-${category.id}`}
      onClick={() => onSelect(category.id)}
      whileTap={{ scale: 0.97 }}
      transition={{ duration: 0.15, ease: 'easeOut' }}
      className="group relative w-full aspect-square rounded-2xl overflow-hidden cursor-pointer select-none text-right border border-white/10 shadow-md hover:shadow-xl hover:border-white/25 transition-all duration-300 block bg-neutral-950 focus:outline-hidden focus-visible:ring-2 focus-visible:ring-white/50"
      dir="rtl"
      aria-label={`دسته‌بندی ${category.name}`}
    >
      {/* 1. Edge-to-Edge Photographic Image */}
      <div className="absolute inset-0 w-full h-full overflow-hidden">
        <SafeImage
          src={imageUrl}
          alt={category.name}
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500 ease-out"
          fallbackContainerClassName="w-full h-full bg-neutral-900"
          fallbackIconClassName="w-8 h-8 text-neutral-600"
          loading="lazy"
        />
      </div>

      {/* 2. Natural Readability Gradient: Concentrated scrim behind category title */}
      <div className={`absolute inset-0 bg-gradient-to-t ${gradientClass} pointer-events-none transition-opacity duration-300`} />

      {/* 3. Micro Ambient Accent Glow on Hover */}
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-300 pointer-events-none"
        style={{ backgroundColor: accentColor }}
      />

      {/* 4. Pure Category Name Label (No count, no arrow - clean photographic gallery card) */}
      <div className="absolute inset-x-0 bottom-0 p-3.5 sm:p-4 z-10 pointer-events-none flex flex-col justify-end">
        <h3 className="font-bold text-sm sm:text-base md:text-lg text-white tracking-tight drop-shadow-md truncate leading-snug">
          {category.name}
        </h3>
        {category.nameEn && (
          <p className="text-[11px] text-neutral-300/80 font-light tracking-wide truncate mt-0.5">
            {category.nameEn}
          </p>
        )}
      </div>
    </motion.button>
  );
};
