import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Layers, Check } from 'lucide-react';
import { MenuCategory, MenuItem } from '../../types/menu';
import { toPersianDigits } from '../../utils/formatters';
import { useMenuViewport } from '../../context/MenuViewportContext';
import { OverlayPortal } from './OverlayPortal';

interface CategoryBottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
  categories: MenuCategory[];
  items: MenuItem[];
  activeCategoryId: string;
  onSelectCategory: (categoryId: string) => void;
  accentColor?: string;
}

export const CategoryBottomSheet: React.FC<CategoryBottomSheetProps> = ({
  isOpen,
  onClose,
  categories,
  items,
  activeCategoryId,
  onSelectCategory,
  accentColor = '#d4af37',
}) => {
  return (
    <OverlayPortal>
      <AnimatePresence mode="wait">
        {isOpen && (
          <CategoryBottomSheetContent
            categories={categories}
            items={items}
            activeCategoryId={activeCategoryId}
            onSelectCategory={onSelectCategory}
            onClose={onClose}
            accentColor={accentColor}
          />
        )}
      </AnimatePresence>
    </OverlayPortal>
  );
};

interface CategoryBottomSheetContentProps {
  categories: MenuCategory[];
  items: MenuItem[];
  activeCategoryId: string;
  onSelectCategory: (categoryId: string) => void;
  onClose: () => void;
  accentColor: string;
}

const CategoryBottomSheetContent: React.FC<CategoryBottomSheetContentProps> = ({
  categories,
  items,
  activeCategoryId,
  onSelectCategory,
  onClose,
  accentColor,
}) => {
  const { isSimulated, overlayPresentation, registerOverlay } = useMenuViewport();

  useEffect(() => {
    return registerOverlay('category-bottom-sheet');
  }, [registerOverlay]);

  const isDesktop = overlayPresentation === 'desktop-modal';

  return (
    <div
      className={`${
        isSimulated ? 'absolute' : 'fixed'
      } inset-0 z-50 flex ${isDesktop ? 'items-center justify-center p-6' : 'items-end justify-center'} pointer-events-auto overflow-hidden`}
      dir="rtl"
      onWheel={(e) => e.stopPropagation()}
    >
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        onClick={onClose}
        className="absolute inset-0 bg-black/80 backdrop-blur-sm pointer-events-auto"
      />

      {/* Sheet / Modal Container */}
      <motion.div
        initial={isDesktop ? { opacity: 0, scale: 0.95 } : { y: '100%' }}
        animate={isDesktop ? { opacity: 1, scale: 1 } : { y: 0 }}
        exit={isDesktop ? { opacity: 0, scale: 0.95 } : { y: '100%' }}
        transition={isDesktop ? { duration: 0.2 } : { type: 'spring', damping: 28, stiffness: 320 }}
        className={`relative w-full max-w-lg bg-neutral-900 border border-neutral-800 ${
          isDesktop ? 'rounded-3xl max-h-[85%]' : 'rounded-t-3xl rounded-b-none border-b-0 max-h-[85%]'
        } p-5 overflow-y-auto overscroll-contain no-scrollbar shadow-2xl z-10 text-neutral-100 flex flex-col pointer-events-auto`}
      >
        {/* Pull Handle for mobile */}
        {!isDesktop && (
          <div className="w-12 h-1.5 bg-neutral-700 rounded-full mx-auto mb-3 flex-shrink-0" />
        )}

        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-neutral-800 flex-shrink-0">
          <div className="flex items-center gap-2">
            <div
              className="w-8 h-8 rounded-xl flex items-center justify-center text-neutral-950 font-bold"
              style={{ backgroundColor: accentColor }}
            >
              <Layers className="w-4 h-4 text-neutral-950" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">دسته‌بندی‌های منو</h3>
              <p className="text-xs text-neutral-400 font-light">
                {toPersianDigits(categories.length)} بخش مختلف برای کاوش
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-neutral-800 hover:bg-neutral-700 text-neutral-300 flex items-center justify-center transition-colors active:scale-95 cursor-pointer"
            aria-label="بستن"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Categories Grid (2 Columns Mobile Friendly) */}
        <div className="grid grid-cols-2 gap-2.5 pt-4 pb-2">
          {categories.map((category) => {
            const catItemsCount = items.filter((i) => i.categoryId === category.id).length;
            const isActive = activeCategoryId === category.id;

            return (
              <motion.button
                key={category.id}
                whileTap={{ scale: 0.97 }}
                onClick={() => {
                  onSelectCategory(category.id);
                  onClose();
                }}
                id={`cat-sheet-item-${category.id}`}
                className={`p-3.5 rounded-2xl text-right transition-all flex flex-col justify-between border cursor-pointer ${
                  isActive
                    ? 'bg-neutral-800 border-white/30 shadow-lg'
                    : 'bg-neutral-950/60 hover:bg-neutral-800/80 border-neutral-800 text-neutral-300'
                }`}
                style={{
                  borderColor: isActive ? accentColor : undefined,
                }}
              >
                <div className="flex items-start justify-between gap-1 w-full">
                  <span
                    className={`text-sm font-bold leading-tight ${
                      isActive ? 'text-white' : 'text-neutral-200'
                    }`}
                    style={{ color: isActive ? accentColor : undefined }}
                  >
                    {category.name}
                  </span>

                  {isActive && (
                    <span
                      className="w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0"
                      style={{ backgroundColor: accentColor, color: '#000' }}
                    >
                      <Check className="w-2.5 h-2.5 stroke-[3]" />
                    </span>
                  )}
                </div>

                <div className="flex items-center justify-between w-full pt-2 mt-1 border-t border-neutral-800/60 text-[11px] text-neutral-400">
                  <span>{toPersianDigits(catItemsCount)} آیتم</span>
                  {category.nameEn && (
                    <span className="text-[10px] text-neutral-500 font-sans tracking-wide truncate max-w-[80px]" dir="ltr">
                      {category.nameEn}
                    </span>
                  )}
                </div>
              </motion.button>
            );
          })}
        </div>

        {/* Quick Info / All items count */}
        <div className="mt-3 pt-3 border-t border-neutral-800 text-center flex-shrink-0">
          <p className="text-xs text-neutral-400">
            مجموع کل خوراک و نوشیدنی‌ها: <strong className="text-neutral-200">{toPersianDigits(items.length)} عنوان</strong>
          </p>
        </div>
      </motion.div>
    </div>
  );
};
