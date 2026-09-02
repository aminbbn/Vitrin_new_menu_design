import React, { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Layers, Check, ChevronLeft } from 'lucide-react';
import { MenuCategory, MenuItem } from '../../types/menu';
import { toPersianDigits } from '../../utils/formatters';
import { useMenuViewport } from '../../context/MenuViewportContext';
import { OverlayPortal } from './OverlayPortal';
import { SafeImage } from './SafeImage';
import { getCategoryDisplayImage } from '../themes/Theme03Minimal/categoryImageUtils';

interface CategoryBottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
  categories: MenuCategory[];
  items: MenuItem[];
  activeCategoryId: string;
  onSelectCategory: (categoryId: string) => void;
  accentColor?: string;
  themeId?: 'immersive' | 'modern' | 'minimal';
}

export const CategoryBottomSheet: React.FC<CategoryBottomSheetProps> = ({
  isOpen,
  onClose,
  categories,
  items,
  activeCategoryId,
  onSelectCategory,
  accentColor = '#d4af37',
  themeId = 'immersive',
}) => {
  const pendingCategoryRef = useRef<string | null>(null);

  const handleSelect = (categoryId: string) => {
    pendingCategoryRef.current = categoryId;
    onClose();
  };

  const handleExitComplete = () => {
    if (pendingCategoryRef.current) {
      const catId = pendingCategoryRef.current;
      pendingCategoryRef.current = null;
      // Wait for the next microtask/frame after overlay is unmounted and scroll-lock is fully released
      requestAnimationFrame(() => {
        onSelectCategory(catId);
      });
    }
  };

  return (
    <OverlayPortal>
      <AnimatePresence mode="wait" onExitComplete={handleExitComplete}>
        {isOpen && (
          <CategoryBottomSheetContent
            categories={categories}
            items={items}
            activeCategoryId={activeCategoryId}
            onSelectCategory={handleSelect}
            onClose={onClose}
            accentColor={accentColor}
            themeId={themeId}
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
  themeId: 'immersive' | 'modern' | 'minimal';
}

const CategoryBottomSheetContent: React.FC<CategoryBottomSheetContentProps> = ({
  categories,
  items,
  activeCategoryId,
  onSelectCategory,
  onClose,
  accentColor,
  themeId,
}) => {
  const { isSimulated, overlayPresentation, registerOverlay } = useMenuViewport();

  useEffect(() => {
    return registerOverlay('category-bottom-sheet');
  }, [registerOverlay]);

  const isDesktop = overlayPresentation === 'desktop-modal';
  const isModernTheme = themeId === 'modern';
  const isMinimalTheme = themeId === 'minimal';

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
        className="absolute inset-0 bg-black/75 backdrop-blur-sm pointer-events-auto"
      />

      {/* Sheet / Modal Container */}
      <motion.div
        initial={isDesktop ? { opacity: 0, scale: 0.95 } : { y: '100%' }}
        animate={isDesktop ? { opacity: 1, scale: 1 } : { y: 0 }}
        exit={isDesktop ? { opacity: 0, scale: 0.95 } : { y: '100%' }}
        transition={isDesktop ? { duration: 0.2 } : { type: 'spring', damping: 28, stiffness: 320 }}
        className={`relative w-full max-w-lg ${
          isModernTheme
            ? 'bg-[#FAF8F5] border-stone-200 text-stone-900'
            : isMinimalTheme
            ? 'bg-[#12151a] border-white/10 text-neutral-100'
            : 'bg-neutral-900 border-neutral-800 text-neutral-100'
        } border ${
          isDesktop ? 'rounded-3xl max-h-[85%]' : 'rounded-t-3xl rounded-b-none border-b-0 max-h-[85%]'
        } p-5 overflow-y-auto overscroll-contain no-scrollbar shadow-2xl z-10 flex flex-col pointer-events-auto`}
      >
        {/* Pull Handle for mobile */}
        {!isDesktop && (
          <div
            className={`w-12 h-1.5 rounded-full mx-auto mb-3 flex-shrink-0 ${
              isModernTheme ? 'bg-stone-300' : isMinimalTheme ? 'bg-neutral-700/80' : 'bg-neutral-700'
            }`}
          />
        )}

        {/* Header */}
        <div
          className={`flex items-center justify-between pb-4 border-b flex-shrink-0 ${
            isModernTheme ? 'border-stone-200' : isMinimalTheme ? 'border-white/10' : 'border-neutral-800'
          }`}
        >
          <div className="flex items-center gap-2.5">
            <div
              className="w-8 h-8 rounded-xl flex items-center justify-center text-white font-bold shadow-xs shrink-0"
              style={{ backgroundColor: accentColor }}
            >
              <Layers className="w-4 h-4 text-white" />
            </div>
            <div>
              <h3
                className={`text-base font-bold ${
                  isModernTheme ? 'text-stone-900' : 'text-white'
                }`}
              >
                دسته‌بندی‌های منو
              </h3>
              <p
                className={`text-xs font-light ${
                  isModernTheme ? 'text-stone-500' : 'text-neutral-400'
                }`}
              >
                {toPersianDigits(categories.length)} بخش مختلف برای کاوش
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors active:scale-95 cursor-pointer ${
              isModernTheme
                ? 'bg-stone-200/80 hover:bg-stone-300 text-stone-700'
                : isMinimalTheme
                ? 'bg-neutral-800/80 hover:bg-neutral-700 text-neutral-300 border border-white/10'
                : 'bg-neutral-800 hover:bg-neutral-700 text-neutral-300'
            }`}
            aria-label="بستن"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Categories List: Style 3 (Photographic rows) vs Style 1/2 (Grid) */}
        {isMinimalTheme ? (
          <div className="flex flex-col gap-2 pt-4 pb-2">
            {categories.map((category) => {
              const catItemsCount = items.filter((i) => i.categoryId === category.id).length;
              const isActive = activeCategoryId === category.id;
              const categoryImg = getCategoryDisplayImage(category, items);

              return (
                <motion.button
                  key={category.id}
                  whileTap={{ scale: 0.985 }}
                  onClick={() => onSelectCategory(category.id)}
                  id={`cat-sheet-item-${category.id}`}
                  className={`p-2.5 rounded-2xl text-right transition-all flex items-center justify-between gap-3 border cursor-pointer ${
                    isActive
                      ? 'bg-white/10 border-white/30 shadow-md'
                      : 'bg-neutral-900/60 hover:bg-neutral-800/70 border-white/5 text-neutral-300'
                  }`}
                  style={{
                    borderColor: isActive ? accentColor : undefined,
                  }}
                >
                  <div className="flex items-center gap-3 min-w-0 flex-1">
                    {/* Thumbnail */}
                    <div className="w-12 h-12 rounded-xl overflow-hidden bg-neutral-950 border border-white/10 shrink-0">
                      <SafeImage
                        src={categoryImg}
                        alt={category.name}
                        className="w-full h-full object-cover"
                        fallbackContainerClassName="w-full h-full bg-neutral-900"
                        fallbackIconClassName="w-4 h-4 text-neutral-600"
                      />
                    </div>

                    <div className="min-w-0 flex-1 text-right">
                      <div className="flex items-center gap-2">
                        <span
                          className={`text-sm font-bold truncate ${
                            isActive ? 'text-white' : 'text-neutral-200'
                          }`}
                          style={{ color: isActive ? accentColor : undefined }}
                        >
                          {category.name}
                        </span>
                      </div>
                      {category.description ? (
                        <p className="text-xs text-neutral-400 font-light truncate mt-0.5">
                          {category.description}
                        </p>
                      ) : category.nameEn ? (
                        <p className="text-[11px] text-neutral-400 font-sans tracking-wide truncate mt-0.5" dir="ltr" style={{ textAlign: 'right' }}>
                          {category.nameEn}
                        </p>
                      ) : null}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <span className="text-[11px] px-2 py-0.5 rounded-full bg-white/5 border border-white/10 text-neutral-400">
                      {toPersianDigits(catItemsCount)} خوراک
                    </span>

                    {isActive && (
                      <span
                        className="w-5 h-5 rounded-full flex items-center justify-center shrink-0"
                        style={{ backgroundColor: accentColor, color: '#fff' }}
                      >
                        <Check className="w-3 h-3 stroke-[3] text-white" />
                      </span>
                    )}
                  </div>
                </motion.button>
              );
            })}
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-2.5 pt-4 pb-2">
            {categories.map((category) => {
              const catItemsCount = items.filter((i) => i.categoryId === category.id).length;
              const isActive = activeCategoryId === category.id;

              return (
                <motion.button
                  key={category.id}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => onSelectCategory(category.id)}
                  id={`cat-sheet-item-${category.id}`}
                  className={`p-3.5 rounded-2xl text-right transition-all flex flex-col justify-between border cursor-pointer ${
                    isModernTheme
                      ? isActive
                        ? 'bg-white border-stone-400 shadow-sm'
                        : 'bg-white/80 hover:bg-white border-stone-200 text-stone-700'
                      : isActive
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
                        isModernTheme
                          ? isActive
                            ? 'text-stone-900'
                            : 'text-stone-800'
                          : isActive
                          ? 'text-white'
                          : 'text-neutral-200'
                      }`}
                      style={{ color: isActive ? accentColor : undefined }}
                    >
                      {category.name}
                    </span>

                    {isActive && (
                      <span
                        className="w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0"
                        style={{ backgroundColor: accentColor, color: '#fff' }}
                      >
                        <Check className="w-2.5 h-2.5 stroke-[3] text-white" />
                      </span>
                    )}
                  </div>

                  <div
                    className={`flex items-center justify-between w-full pt-2 mt-1 border-t text-[11px] ${
                      isModernTheme
                        ? 'border-stone-100 text-stone-500'
                        : 'border-neutral-800/60 text-neutral-400'
                    }`}
                  >
                    <span>{toPersianDigits(catItemsCount)} آیتم</span>
                    {category.nameEn && (
                      <span
                        className={`text-[10px] font-sans tracking-wide truncate max-w-[80px] ${
                          isModernTheme ? 'text-stone-400' : 'text-neutral-500'
                        }`}
                        dir="ltr"
                      >
                        {category.nameEn}
                      </span>
                    )}
                  </div>
                </motion.button>
              );
            })}
          </div>
        )}

        {/* Quick Info / All items count */}
        <div
          className={`mt-3 pt-3 border-t text-center flex-shrink-0 ${
            isModernTheme ? 'border-stone-200' : isMinimalTheme ? 'border-white/10' : 'border-neutral-800'
          }`}
        >
          <p
            className={`text-xs ${
              isModernTheme ? 'text-stone-600' : 'text-neutral-400'
            }`}
          >
            مجموع کل خوراک و نوشیدنی‌ها:{' '}
            <strong
              className={isModernTheme ? 'text-stone-900' : 'text-neutral-200'}
            >
              {toPersianDigits(items.length)} عنوان
            </strong>
          </p>
        </div>
      </motion.div>
    </div>
  );
};
