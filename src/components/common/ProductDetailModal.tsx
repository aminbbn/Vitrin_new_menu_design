import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Clock, Flame, Sparkles, AlertCircle, CheckCircle2, XCircle, Leaf, ShieldAlert, Plus, Minus, Check } from 'lucide-react';
import { MenuItem } from '../../types/menu';
import { formatToman, toPersianDigits } from '../../utils/formatters';
import { useMenuSelection } from '../../context/MenuSelectionContext';
import { useMenuViewport } from '../../context/MenuViewportContext';

interface ProductDetailModalProps {
  item: MenuItem | null;
  onClose: () => void;
  accentColor?: string;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  item,
  onClose,
  accentColor = '#d4af37',
}) => {
  const { getItemQuantity, addItem, decreaseItem } = useMenuSelection();
  const { registerOverlay } = useMenuViewport();

  useEffect(() => {
    if (!item) return;
    return registerOverlay(`product-modal-${item.id}`);
  }, [item, registerOverlay]);

  if (!item) return null;

  const currentQty = getItemQuantity(item.id);
  const isSoldOut = item.availability === 'sold_out';

  return (
    <AnimatePresence>
      <div
        className="fixed inset-0 z-50 flex items-end sm:items-center justify-center pointer-events-auto"
        dir="rtl"
        onWheel={(e) => e.stopPropagation()}
        onTouchMove={(e) => e.stopPropagation()}
      >
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/80 backdrop-blur-sm"
        />

        {/* Modal/Sheet Container */}
        <motion.div
          initial={{ y: '100%', opacity: 0.5 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: '100%', opacity: 0 }}
          transition={{ type: 'spring', damping: 28, stiffness: 300 }}
          className="relative w-full max-w-lg bg-neutral-900 border border-neutral-800 rounded-t-3xl sm:rounded-3xl max-h-[90vh] overflow-y-auto overscroll-contain no-scrollbar shadow-2xl z-10 text-neutral-100 flex flex-col"
        >
          {/* Header Image */}
          <div className="relative w-full h-72 sm:h-80 bg-neutral-950 flex-shrink-0">
            <img
              src={item.image}
              alt={item.name}
              className="w-full h-full object-cover"
            />
            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-neutral-900 via-neutral-900/30 to-black/50" />

            {/* Close Button */}
            <button
              onClick={onClose}
              id="close-product-modal-btn"
              className="absolute top-4 left-4 w-10 h-10 rounded-full bg-black/60 backdrop-blur-md text-white flex items-center justify-center hover:bg-black/90 active:scale-95 transition-all border border-white/10"
              aria-label="بستن پنجره"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Status badges */}
            <div className="absolute top-4 right-4 flex flex-col gap-1.5 items-end">
              {item.badge && (
                <span
                  style={{ backgroundColor: accentColor, color: '#000' }}
                  className="text-xs font-bold px-3 py-1 rounded-full shadow-lg flex items-center gap-1"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  {item.badge}
                </span>
              )}
              {item.isVegetarian && (
                <span className="bg-emerald-600/90 backdrop-blur-sm text-white text-xs font-semibold px-2.5 py-1 rounded-full flex items-center gap-1 border border-emerald-400/30">
                  <Leaf className="w-3.5 h-3.5" />
                  وجترین
                </span>
              )}
            </div>

            {/* Price tag on image base */}
            <div className="absolute bottom-4 right-4 left-4 flex items-end justify-between">
              <div>
                <h2 className="text-2xl font-bold text-white tracking-tight">{item.name}</h2>
                {item.nameEn && (
                  <p className="text-xs text-neutral-400 font-sans tracking-wide mt-0.5" dir="ltr">
                    {item.nameEn}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Modal Body */}
          <div className="p-5 sm:p-6 space-y-5">
            {/* Price & Availability Banner */}
            <div className="flex items-center justify-between p-3.5 rounded-2xl bg-neutral-800/70 border border-neutral-700/50">
              <div className="flex items-center gap-2">
                <span className="text-xs text-neutral-400">قیمت:</span>
                <span className="text-xl font-bold text-white tracking-tight">
                  {formatToman(item.price)}
                </span>
              </div>

              {/* Availability badge */}
              <div>
                {item.availability === 'available' && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-medium border border-emerald-500/20">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    موجود جهت سرو
                  </span>
                )}
                {item.availability === 'low_stock' && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-500/10 text-amber-400 text-xs font-medium border border-amber-500/20">
                    <AlertCircle className="w-3.5 h-3.5" />
                    تعداد محدود
                  </span>
                )}
                {item.availability === 'sold_out' && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-rose-500/10 text-rose-400 text-xs font-medium border border-rose-500/20">
                    <XCircle className="w-3.5 h-3.5" />
                    اتمام موجودی امروز
                  </span>
                )}
              </div>
            </div>

            {/* Selection Action Bar inside Modal */}
            {!isSoldOut && (
              <div className="p-3 rounded-2xl bg-neutral-950/80 border border-neutral-800 flex items-center justify-between gap-3">
                <span className="text-xs text-neutral-300 font-medium">افزودن به انتخاب‌های من:</span>

                {currentQty === 0 ? (
                  <button
                    onClick={() => addItem(item.id)}
                    className="px-4 py-2 rounded-xl text-xs font-bold text-neutral-950 flex items-center gap-1.5 active:scale-95 transition-all shadow"
                    style={{ backgroundColor: accentColor }}
                  >
                    <Plus className="w-4 h-4" />
                    <span>افزودن به انتخاب‌ها</span>
                  </button>
                ) : (
                  <div className="flex items-center gap-2 bg-neutral-900 border border-neutral-700/60 rounded-xl p-1">
                    <button
                      onClick={() => decreaseItem(item.id)}
                      className="w-8 h-8 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-200 flex items-center justify-center active:scale-95 transition-all"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="w-6 text-center text-sm font-bold text-white">
                      {toPersianDigits(currentQty)}
                    </span>
                    <button
                      onClick={() => addItem(item.id)}
                      className="w-8 h-8 rounded-lg text-neutral-950 flex items-center justify-center active:scale-95 transition-all font-bold"
                      style={{ backgroundColor: accentColor }}
                    >
                      <Plus className="w-4 h-4 text-neutral-950" />
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Description */}
            <div>
              <h3 className="text-xs font-semibold text-neutral-400 mb-1.5 uppercase tracking-wider">
                توضیحات و رسپی
              </h3>
              <p className="text-neutral-200 text-sm leading-relaxed font-light">
                {item.description}
              </p>
            </div>

            {/* Quick Metrics (Time & Calories) */}
            <div className="grid grid-cols-2 gap-3">
              {item.preparationTime && (
                <div className="flex items-center gap-3 p-3 rounded-xl bg-neutral-800/40 border border-neutral-700/30">
                  <div className="w-8 h-8 rounded-lg bg-neutral-700/50 flex items-center justify-center text-neutral-300">
                    <Clock className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-[11px] text-neutral-400">زمان آماده‌سازی</div>
                    <div className="text-xs font-medium text-neutral-200">{toPersianDigits(item.preparationTime)}</div>
                  </div>
                </div>
              )}

              {item.calories && (
                <div className="flex items-center gap-3 p-3 rounded-xl bg-neutral-800/40 border border-neutral-700/30">
                  <div className="w-8 h-8 rounded-lg bg-neutral-700/50 flex items-center justify-center text-amber-400">
                    <Flame className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-[11px] text-neutral-400">کالری تقریبی</div>
                    <div className="text-xs font-medium text-neutral-200">{toPersianDigits(item.calories)} کیلوکالری</div>
                  </div>
                </div>
              )}
            </div>

            {/* Ingredients */}
            {item.ingredients && item.ingredients.length > 0 && (
              <div>
                <h3 className="text-xs font-semibold text-neutral-400 mb-2">
                  ترکیبات و محتویات:
                </h3>
                <div className="flex flex-wrap gap-2">
                  {item.ingredients.map((ing, idx) => (
                    <span
                      key={idx}
                      className="text-xs px-3 py-1.5 rounded-lg bg-neutral-800 text-neutral-300 border border-neutral-700/50"
                    >
                      {ing}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Allergens warning if any */}
            {item.allergens && item.allergens.length > 0 && (
              <div className="p-3 rounded-xl bg-amber-950/20 border border-amber-800/30 flex items-start gap-2.5 text-amber-200/90 text-xs">
                <ShieldAlert className="w-4 h-4 flex-shrink-0 text-amber-400 mt-0.5" />
                <div>
                  <span className="font-semibold">اطلاعات حساسیت غذایی: </span>
                  شامل {item.allergens.join('، ')}. در صورت داشتن آلرژی خاص به پرسنل سالن اطلاع دهید.
                </div>
              </div>
            )}

            {/* Closing helper note */}
            <div className="pt-2">
              <button
                onClick={onClose}
                className="w-full py-3.5 rounded-xl font-medium text-sm text-center transition-colors bg-neutral-800 hover:bg-neutral-700 text-neutral-200 active:scale-[0.99]"
              >
                بستن و بازگشت به منو
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

