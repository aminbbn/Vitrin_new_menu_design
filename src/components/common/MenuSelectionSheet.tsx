import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Plus, Minus, Trash2, ShoppingBag, Info, RotateCcw } from 'lucide-react';
import { useMenuSelection } from '../../context/MenuSelectionContext';
import { formatToman, toPersianDigits } from '../../utils/formatters';

interface MenuSelectionSheetProps {
  accentColor?: string;
}

export const MenuSelectionSheet: React.FC<MenuSelectionSheetProps> = ({
  accentColor = '#d4af37',
}) => {
  const {
    selectedItems,
    totalCount,
    totalPrice,
    addItem,
    decreaseItem,
    removeItem,
    clearSelections,
    isSelectionSheetOpen,
    setIsSelectionSheetOpen,
  } = useMenuSelection();

  if (!isSelectionSheetOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-end justify-center pointer-events-auto" dir="rtl">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          onClick={() => setIsSelectionSheetOpen(false)}
          className="fixed inset-0 bg-black/80 backdrop-blur-sm"
        />

        {/* Bottom Sheet Container */}
        <motion.div
          initial={{ y: '100%' }}
          animate={{ y: 0 }}
          exit={{ y: '100%' }}
          transition={{ type: 'spring', damping: 28, stiffness: 320 }}
          className="relative w-full max-w-lg bg-neutral-900 border-t border-neutral-800 rounded-t-3xl max-h-[88vh] overflow-hidden shadow-2xl z-10 text-neutral-100 flex flex-col"
        >
          {/* Top Handle */}
          <div className="w-12 h-1.5 bg-neutral-700 rounded-full mx-auto mt-3 mb-1" />

          {/* Header */}
          <div className="p-4 sm:p-5 flex items-center justify-between border-b border-neutral-800">
            <div className="flex items-center gap-2.5">
              <div
                className="w-9 h-9 rounded-xl flex items-center justify-center text-neutral-950 font-bold"
                style={{ backgroundColor: accentColor }}
              >
                <ShoppingBag className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">انتخاب‌های من</h3>
                <span className="text-xs text-neutral-400 font-light">
                  {toPersianDigits(totalCount)} مورد انتخاب شده
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {selectedItems.length > 0 && (
                <button
                  onClick={clearSelections}
                  className="text-xs text-neutral-400 hover:text-rose-400 px-2.5 py-1 rounded-lg border border-neutral-800 transition-colors flex items-center gap-1"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>پاک کردن</span>
                </button>
              )}

              <button
                onClick={() => setIsSelectionSheetOpen(false)}
                className="w-8 h-8 rounded-full bg-neutral-800 hover:bg-neutral-700 text-neutral-300 flex items-center justify-center transition-colors"
                aria-label="بستن"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Body: List of Selected Items */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-3.5 no-scrollbar">
            {selectedItems.length === 0 ? (
              <div className="py-12 text-center space-y-3">
                <div className="w-12 h-12 rounded-full bg-neutral-800 mx-auto flex items-center justify-center text-neutral-400">
                  <ShoppingBag className="w-6 h-6" />
                </div>
                <p className="text-sm font-semibold text-neutral-300">لیست انتخاب‌های شما خالی است</p>
                <p className="text-xs text-neutral-400 max-w-xs mx-auto leading-relaxed">
                  با زدن دکمه «+» در کنار هر غذا، می‌توانید آن را به این لیست اضافه کنید.
                </p>
              </div>
            ) : (
              selectedItems.map(({ item, quantity, lineTotal }) => (
                <div
                  key={item.id}
                  className="p-3 sm:p-3.5 rounded-2xl bg-neutral-950/70 border border-neutral-800 flex items-center justify-between gap-3 group"
                >
                  {/* Thumbnail Image */}
                  <div className="w-16 h-16 rounded-xl overflow-hidden bg-neutral-900 flex-shrink-0 border border-neutral-800">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Title & Unit Price */}
                  <div className="flex-1 min-w-0 space-y-1">
                    <h4 className="text-sm font-bold text-white truncate">{item.name}</h4>
                    <div className="flex items-center gap-2 text-xs text-neutral-400">
                      <span>{formatToman(item.price)}</span>
                      <span>×</span>
                      <span className="text-neutral-200 font-semibold">{toPersianDigits(quantity)}</span>
                    </div>
                    <div className="text-xs font-bold text-amber-300" style={{ color: accentColor }}>
                      {formatToman(lineTotal)}
                    </div>
                  </div>

                  {/* Quantity Stepper */}
                  <div className="flex items-center gap-1.5 bg-neutral-900 border border-neutral-700/60 rounded-xl p-1">
                    <button
                      onClick={() => decreaseItem(item.id)}
                      className="w-7 h-7 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-200 flex items-center justify-center active:scale-95 transition-all"
                      aria-label="کاهش تعداد"
                    >
                      {quantity === 1 ? (
                        <Trash2 className="w-3.5 h-3.5 text-rose-400" />
                      ) : (
                        <Minus className="w-3.5 h-3.5" />
                      )}
                    </button>

                    <span className="w-6 text-center text-xs font-bold text-white">
                      {toPersianDigits(quantity)}
                    </span>

                    <button
                      onClick={() => addItem(item.id)}
                      className="w-7 h-7 rounded-lg text-neutral-950 flex items-center justify-center active:scale-95 transition-all font-bold"
                      style={{ backgroundColor: accentColor }}
                      aria-label="افزایش تعداد"
                    >
                      <Plus className="w-3.5 h-3.5 text-neutral-950" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer: Summary & Calculation */}
          {selectedItems.length > 0 && (
            <div className="p-4 sm:p-5 border-t border-neutral-800 bg-neutral-950/90 space-y-3.5">
              {/* Total Calculation Row */}
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xs text-neutral-400 block">جمع کل انتخاب‌ها</span>
                  <span className="text-[11px] text-neutral-300">
                    مجموع {toPersianDigits(totalCount)} آیتم خوراک و نوشیدنی
                  </span>
                </div>
                <div className="text-lg sm:text-xl font-extrabold text-white tracking-tight">
                  {formatToman(totalPrice)}
                </div>
              </div>

              {/* Informative Note */}
              <div className="p-2.5 rounded-xl bg-neutral-900 border border-neutral-800/80 flex items-start gap-2 text-xs text-neutral-300">
                <Info className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
                <p className="leading-relaxed">
                  این لیست صرفاً جهت انتخاب و محاسبه هزینه غذاهای مورد علاقه شماست و به صورت سفارش آنلاین ارسال نمی‌شود.
                </p>
              </div>

              {/* Return to Menu Button */}
              <button
                onClick={() => setIsSelectionSheetOpen(false)}
                className="w-full py-3.5 rounded-xl font-bold text-sm text-neutral-950 active:scale-[0.99] transition-all flex items-center justify-center gap-1.5 shadow-lg"
                style={{ backgroundColor: accentColor }}
              >
                <span>بازگشت و ادامه مرور منو</span>
              </button>
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
