import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Plus, Minus, Trash2, ShoppingBag, Info, RotateCcw } from 'lucide-react';
import { useMenuSelection } from '../../context/MenuSelectionContext';
import { formatToman, toPersianDigits } from '../../utils/formatters';
import { getContrastForeground } from '../../utils/colorUtils';
import { useMenuViewport } from '../../context/MenuViewportContext';
import { OverlayPortal } from './OverlayPortal';
import { SafeImage } from './SafeImage';

interface MenuSelectionSheetProps {
  primaryColor?: string;
  secondaryColor?: string;
  accentColor?: string;
  themeId?: 'immersive' | 'modern' | 'minimal';
}

export const MenuSelectionSheet: React.FC<MenuSelectionSheetProps> = ({
  primaryColor,
  secondaryColor,
  accentColor = '#d4af37',
  themeId = 'immersive',
}) => {
  const { isSelectionSheetOpen } = useMenuSelection();
  const prim = primaryColor || accentColor || 'var(--menu-primary, #D4AF37)';
  const sec = secondaryColor || 'var(--menu-secondary, #B76E79)';

  return (
    <OverlayPortal>
      <AnimatePresence mode="wait">
        {isSelectionSheetOpen && (
          <MenuSelectionSheetContent
            accentColor={accentColor}
            primaryColor={prim}
            secondaryColor={sec}
            themeId={themeId}
          />
        )}
      </AnimatePresence>
    </OverlayPortal>
  );
};

interface MenuSelectionSheetContentProps {
  accentColor: string;
  primaryColor: string;
  secondaryColor: string;
  themeId: 'immersive' | 'modern' | 'minimal';
}

const MenuSelectionSheetContent: React.FC<MenuSelectionSheetContentProps> = ({
  accentColor,
  primaryColor,
  secondaryColor,
  themeId,
}) => {
  const {
    selectedItems,
    totalCount,
    totalPrice,
    addItem,
    decreaseItem,
    clearSelections,
    setIsSelectionSheetOpen,
  } = useMenuSelection();

  const { isSimulated, overlayPresentation, registerOverlay } = useMenuViewport();

  const prim = primaryColor || accentColor;
  const primaryFg = getContrastForeground(prim);

  useEffect(() => {
    return registerOverlay('menu-selection-sheet');
  }, [registerOverlay]);

  const isDesktop = overlayPresentation === 'desktop-modal';
  const isModernTheme = themeId === 'modern';

  return (
    <div
      className={`${
        isSimulated ? 'absolute' : 'fixed'
      } inset-0 z-50 flex ${isDesktop ? 'items-center justify-center p-4 sm:p-6' : 'items-end justify-center'} pointer-events-auto overflow-hidden`}
      dir="rtl"
      onWheel={(e) => e.stopPropagation()}
    >
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        onClick={() => setIsSelectionSheetOpen(false)}
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
            : 'bg-[#11161b] border-neutral-800 text-neutral-100'
        } border ${
          isDesktop ? 'rounded-3xl max-h-[85%]' : 'rounded-t-3xl rounded-b-none border-b-0 max-h-[85%]'
        } overflow-hidden shadow-2xl z-10 flex flex-col pointer-events-auto`}
      >
        {/* Top Handle for mobile */}
        {!isDesktop && (
          <div
            className={`w-12 h-1 rounded-full mx-auto mt-3 mb-1 flex-shrink-0 ${
              isModernTheme ? 'bg-stone-300' : 'bg-neutral-600/80'
            }`}
          />
        )}

        {/* Header */}
        <div
          className={`p-4 sm:p-5 flex items-center justify-between border-b flex-shrink-0 ${
            isModernTheme ? 'border-stone-200' : 'border-neutral-800/80'
          }`}
        >
          <div className="flex items-center gap-2.5">
            <div
              className="w-9 h-9 rounded-xl flex items-center justify-center text-white font-bold shrink-0 shadow-xs"
              style={{ backgroundColor: accentColor }}
            >
              <ShoppingBag className="w-4 h-4" />
            </div>
            <div>
              <h3
                className={`text-base font-bold leading-tight ${
                  isModernTheme ? 'text-stone-900' : 'text-white'
                }`}
              >
                انتخاب‌های من
              </h3>
              <span
                className={`text-xs font-light ${
                  isModernTheme ? 'text-stone-500' : 'text-neutral-400'
                }`}
              >
                {toPersianDigits(totalCount)} مورد انتخاب شده
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {selectedItems.length > 0 && (
              <button
                onClick={clearSelections}
                className={`text-xs px-2.5 py-1 rounded-lg border transition-colors flex items-center gap-1 cursor-pointer whitespace-nowrap ${
                  isModernTheme
                    ? 'text-stone-500 hover:text-rose-600 border-stone-200 bg-white'
                    : 'text-neutral-400 hover:text-rose-400 border-neutral-800 bg-neutral-900'
                }`}
              >
                <RotateCcw className="w-3 h-3" />
                <span>پاک کردن</span>
              </button>
            )}

            <button
              onClick={() => setIsSelectionSheetOpen(false)}
              className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors cursor-pointer ${
                isModernTheme
                  ? 'bg-stone-200/80 hover:bg-stone-300 text-stone-700'
                  : 'bg-neutral-800/80 hover:bg-neutral-700 text-neutral-300'
              }`}
              aria-label="بستن"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Body: List of Selected Items in Clean 3-Zone Cards */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-3 no-scrollbar overscroll-contain">
          {selectedItems.length === 0 ? (
            <div className="py-12 text-center space-y-3">
              <div
                className={`w-12 h-12 rounded-full mx-auto flex items-center justify-center ${
                  isModernTheme
                    ? 'bg-stone-200 text-stone-400'
                    : 'bg-neutral-800/60 text-neutral-400'
                }`}
              >
                <ShoppingBag className="w-6 h-6" />
              </div>
              <p
                className={`text-sm font-semibold ${
                  isModernTheme ? 'text-stone-700' : 'text-neutral-300'
                }`}
              >
                لیست انتخاب‌های شما خالی است
              </p>
              <p
                className={`text-xs max-w-xs mx-auto leading-relaxed ${
                  isModernTheme ? 'text-stone-500' : 'text-neutral-400'
                }`}
              >
                با انتخاب هر غذا در منو، می‌توانید آن را به این لیست اضافه کنید.
              </p>
            </div>
          ) : (
            selectedItems.map(({ item, quantity, lineTotal }) => (
              <div
                key={item.id}
                className={`p-3 rounded-2xl flex items-center gap-3.5 border shadow-xs ${
                  isModernTheme
                    ? 'bg-white border-stone-200'
                    : 'bg-neutral-950/80 border-neutral-800/90'
                }`}
                dir="rtl"
              >
                {/* Zone 1: Thumbnail Image with SafeImage Fallback */}
                <div
                  className={`w-14 h-14 rounded-xl overflow-hidden border shrink-0 ${
                    isModernTheme ? 'bg-stone-100 border-stone-200' : 'bg-neutral-900 border-neutral-800'
                  }`}
                >
                  <SafeImage
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-cover"
                    fallbackIconClassName={
                      isModernTheme ? 'w-4 h-4 text-stone-400' : 'w-4 h-4 text-neutral-500'
                    }
                  />
                </div>

                {/* Zone 2: Product Info (Max horizontal width, single-line title, clean line price) */}
                <div className="min-w-0 flex-1 flex flex-col justify-center space-y-1 text-right">
                  <h4
                    className={`text-xs sm:text-sm font-semibold truncate leading-tight text-right ${
                      isModernTheme ? 'text-stone-900' : 'text-white'
                    }`}
                    dir="rtl"
                  >
                    {item.name}
                  </h4>
                  <div className="flex items-center gap-1.5 text-[11px] whitespace-nowrap text-right">
                    <span
                      className={`font-medium ${
                        isModernTheme ? 'text-stone-800' : 'text-white/90'
                      }`}
                    >
                      {formatToman(lineTotal)}
                    </span>
                    {quantity > 1 && (
                      <span
                        className={`text-[10px] font-light ${
                          isModernTheme ? 'text-stone-400' : 'text-neutral-500'
                        }`}
                      >
                        ({formatToman(item.price)} فی)
                      </span>
                    )}
                  </div>
                </div>

                {/* Zone 3: Vertical Quantity Control (Amount to the RIGHT of vertical +/- buttons in RTL) */}
                <div className="flex items-center gap-2 shrink-0">
                  {/* Amount Number (Renders on the Right side in RTL) */}
                  <span
                    className={`w-6 text-center text-xs sm:text-sm font-bold select-none ${
                      isModernTheme ? 'text-stone-900' : 'text-white'
                    }`}
                  >
                    {toPersianDigits(quantity)}
                  </span>

                  {/* Vertical Buttons Stack (Plus on top, Minus/Trash on bottom) */}
                  <div className="flex flex-col gap-1 shrink-0">
                    {/* Plus Button */}
                    <button
                      onClick={() => addItem(item.id)}
                      className="w-7 h-7 rounded-lg flex items-center justify-center active:scale-95 transition-all font-bold cursor-pointer shadow-xs"
                      style={{
                        backgroundColor: prim,
                        color: primaryFg,
                      }}
                      aria-label="افزایش تعداد"
                    >
                      <Plus className="w-3.5 h-3.5 stroke-[2.5]" style={{ stroke: primaryFg }} />
                    </button>

                    {/* Minus or Trash Button */}
                    <button
                      onClick={() => decreaseItem(item.id)}
                      className={`w-7 h-7 rounded-lg flex items-center justify-center active:scale-95 transition-all cursor-pointer border ${
                        isModernTheme
                          ? 'bg-stone-100 hover:bg-stone-200 text-stone-700 border-stone-200'
                          : 'bg-neutral-800 hover:bg-neutral-700 text-neutral-200 border-neutral-700/50'
                      }`}
                      aria-label={quantity === 1 ? 'حذف آیتم' : 'کاهش تعداد'}
                    >
                      {quantity === 1 ? (
                        <Trash2 className="w-3.5 h-3.5 text-rose-500" />
                      ) : (
                        <Minus className="w-3.5 h-3.5 stroke-[2.5]" />
                      )}
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer: Summary & Calculation */}
        {selectedItems.length > 0 && (
          <div
            className={`p-4 sm:p-5 border-t space-y-3 flex-shrink-0 ${
              isModernTheme
                ? 'bg-stone-100/90 border-stone-200'
                : 'bg-[#0d1217]/95 border-neutral-800/90'
            }`}
          >
            {/* Total Calculation Row */}
            <div className="flex items-center justify-between">
              <div>
                <span
                  className={`text-xs block font-light ${
                    isModernTheme ? 'text-stone-500' : 'text-neutral-400'
                  }`}
                >
                  جمع کل انتخاب‌ها
                </span>
                <span
                  className={`text-[11px] font-medium ${
                    isModernTheme ? 'text-stone-700' : 'text-neutral-300'
                  }`}
                >
                  {toPersianDigits(totalCount)} آیتم خوراک و نوشیدنی
                </span>
              </div>
              <div
                className={`text-base sm:text-lg font-bold tracking-tight ${
                  isModernTheme ? 'text-stone-900' : 'text-white'
                }`}
              >
                {formatToman(totalPrice)}
              </div>
            </div>

            {/* Informative Note */}
            <div
              className={`p-2.5 rounded-xl border flex items-start gap-2 text-[11px] ${
                isModernTheme
                  ? 'bg-white border-stone-200 text-stone-600'
                  : 'bg-neutral-900/90 border-neutral-800 text-neutral-300'
              }`}
            >
              <Info
                className={`w-3.5 h-3.5 flex-shrink-0 mt-0.5 ${
                  isModernTheme ? 'text-amber-600' : 'text-amber-400'
                }`}
              />
              <p className="leading-relaxed">
                این لیست صرفاً جهت انتخاب و محاسبه هزینه غذاهای مورد علاقه شماست.
              </p>
            </div>

            {/* Return to Menu Button */}
            <button
              onClick={() => setIsSelectionSheetOpen(false)}
              className="w-full py-3 rounded-xl font-bold text-xs sm:text-sm active:scale-[0.99] transition-all flex items-center justify-center gap-1.5 shadow-sm cursor-pointer whitespace-nowrap"
              style={{
                backgroundColor: prim,
                color: primaryFg,
              }}
            >
              <span>بازگشت و ادامه مرور منو</span>
            </button>
          </div>
        )}
      </motion.div>
    </div>
  );
};
