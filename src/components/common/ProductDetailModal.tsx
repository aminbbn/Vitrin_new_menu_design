import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  Clock,
  Flame,
  Sparkles,
  AlertCircle,
  CheckCircle2,
  XCircle,
  Leaf,
  ShieldAlert,
  Plus,
  Minus,
} from 'lucide-react';
import { MenuItem } from '../../types/menu';
import { formatToman, toPersianDigits } from '../../utils/formatters';
import { useMenuSelection } from '../../context/MenuSelectionContext';
import { useMenuViewport } from '../../context/MenuViewportContext';
import { OverlayPortal } from './OverlayPortal';

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
  return (
    <OverlayPortal>
      <AnimatePresence mode="wait">
        {item && (
          <ProductDetailOverlayContent
            key={item.id}
            item={item}
            onClose={onClose}
            accentColor={accentColor}
          />
        )}
      </AnimatePresence>
    </OverlayPortal>
  );
};

/* -------------------------------------------------------------------------- */
/* Internal Overlay Content Component (Controlled Exit Animation by AnimatePresence) */
/* -------------------------------------------------------------------------- */
interface ProductDetailOverlayContentProps {
  item: MenuItem;
  onClose: () => void;
  accentColor: string;
}

const ProductDetailOverlayContent: React.FC<ProductDetailOverlayContentProps> = ({
  item,
  onClose,
  accentColor,
}) => {
  const { getItemQuantity, addItem, decreaseItem } = useMenuSelection();
  const { isSimulated, overlayPresentation, registerOverlay } = useMenuViewport();

  useEffect(() => {
    return registerOverlay(`product-modal-${item.id}`);
  }, [item.id, registerOverlay]);

  const currentQty = getItemQuantity(item.id);
  const isSoldOut = item.availability === 'sold_out';
  const isMobile = overlayPresentation === 'mobile-sheet';
  const isTablet = overlayPresentation === 'tablet-sheet';
  const isDesktop = overlayPresentation === 'desktop-modal';

  // Container placement
  const containerAlignmentClass = isDesktop
    ? 'items-center justify-center p-4 sm:p-6'
    : 'items-end justify-center';

  // Sheet geometry
  const panelGeometryClass = isMobile
    ? 'w-full rounded-t-3xl rounded-b-none border-t border-x border-neutral-800 max-h-[90%]'
    : isTablet
    ? 'w-full max-w-xl rounded-t-3xl rounded-b-none border-t border-x border-neutral-800 max-h-[86%]'
    : 'w-full max-w-lg rounded-3xl border border-neutral-800 max-h-[85%]';

  // Motion variants based on device presentation
  const panelMotionProps = isDesktop
    ? {
        initial: { opacity: 0, scale: 0.94, y: 16 },
        animate: { opacity: 1, scale: 1, y: 0 },
        exit: { opacity: 0, scale: 0.94, y: 16 },
        transition: { duration: 0.22, ease: [0.16, 1, 0.3, 1] },
      }
    : {
        initial: { y: '100%' },
        animate: { y: 0 },
        exit: { y: '100%' },
        transition: { type: 'spring', stiffness: 340, damping: 33, mass: 0.9 },
      };

  return (
    <div
      className={`${
        isSimulated ? 'absolute' : 'fixed'
      } inset-0 z-50 flex ${containerAlignmentClass} pointer-events-auto overflow-hidden`}
      dir="rtl"
      onWheel={(e) => e.stopPropagation()}
    >
      {/* Backdrop (Fades in over device screen only) */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.22, ease: 'easeOut' }}
        onClick={onClose}
        className="absolute inset-0 bg-black/80 backdrop-blur-sm pointer-events-auto"
      />

      {/* Main Sheet / Modal Panel */}
      <motion.div
        {...panelMotionProps}
        className={`relative bg-[#11161b] shadow-2xl z-10 text-neutral-100 flex flex-col pointer-events-auto overflow-y-auto overscroll-contain no-scrollbar ${panelGeometryClass}`}
      >
        {/* Top Handle / Pull Indicator (Only in sheet modes) */}
        {!isDesktop && (
          <div className="pt-2 pb-1 bg-neutral-950 flex-shrink-0 flex items-center justify-center">
            <div className="w-12 h-1.5 bg-neutral-700/80 rounded-full" />
          </div>
        )}

        {/* Product Food Header Image */}
        <div
          className={`relative w-full bg-neutral-950 flex-shrink-0 overflow-hidden ${
            isMobile ? 'h-52' : isTablet ? 'h-64' : 'h-64'
          }`}
        >
          <img
            src={item.image}
            alt={item.name}
            className="w-full h-full object-cover"
          />

          {/* Atmospheric Gradient Scrim */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#11161b] via-[#11161b]/30 to-black/60" />

          {/* Close Button */}
          <button
            onClick={onClose}
            id="close-product-modal-btn"
            className="absolute top-3.5 left-3.5 w-9 h-9 rounded-full bg-black/60 backdrop-blur-md text-white flex items-center justify-center hover:bg-black/90 active:scale-95 transition-all border border-white/10 cursor-pointer shadow-lg z-10"
            aria-label="بستن پنجره"
          >
            <X className="w-4 h-4 stroke-[2.5]" />
          </button>

          {/* Status Badges */}
          <div className="absolute top-3.5 right-3.5 flex flex-col gap-1.5 items-end z-10">
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

          {/* Product Title on Image Baseline */}
          <div className="absolute bottom-3.5 right-4 left-4 flex items-end justify-between">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight leading-tight">
                {item.name}
              </h2>
              {item.nameEn && (
                <p className="text-xs text-neutral-400 font-sans tracking-wide mt-0.5" dir="ltr">
                  {item.nameEn}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Modal / Sheet Body Content */}
        <div className="p-4 sm:p-5 space-y-4 flex-1">
          {/* Price & Availability Banner */}
          <div className="flex items-center justify-between p-3 rounded-2xl bg-neutral-900/80 border border-neutral-800">
            <div className="flex items-center gap-2">
              <span className="text-xs text-neutral-400">قیمت:</span>
              <span className="text-lg sm:text-xl font-bold text-white tracking-tight" style={{ color: accentColor }}>
                {formatToman(item.price)}
              </span>
            </div>

            {/* Availability Badge */}
            <div>
              {item.availability === 'available' && (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-medium border border-emerald-500/20">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  موجود جهت سفارش
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
            <div className="p-3 rounded-2xl bg-neutral-950 border border-neutral-800 flex items-center justify-between gap-3 shadow-inner">
              <span className="text-xs text-neutral-300 font-medium">انتخاب و افزودن به لیست:</span>

              {currentQty === 0 ? (
                <button
                  onClick={() => addItem(item.id)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-neutral-950 flex items-center gap-1.5 active:scale-95 transition-all shadow cursor-pointer"
                  style={{ backgroundColor: accentColor }}
                >
                  <Plus className="w-4 h-4" />
                  <span>افزودن به انتخاب‌ها</span>
                </button>
              ) : (
                <div className="flex items-center gap-2 bg-neutral-900 border border-neutral-700/60 rounded-xl p-1">
                  <button
                    onClick={() => decreaseItem(item.id)}
                    className="w-8 h-8 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-200 flex items-center justify-center active:scale-95 transition-all cursor-pointer"
                    aria-label="کاهش"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="w-6 text-center text-sm font-bold text-white">
                    {toPersianDigits(currentQty)}
                  </span>
                  <button
                    onClick={() => addItem(item.id)}
                    className="w-8 h-8 rounded-lg text-neutral-950 flex items-center justify-center active:scale-95 transition-all font-bold cursor-pointer"
                    style={{ backgroundColor: accentColor }}
                    aria-label="افزایش"
                  >
                    <Plus className="w-4 h-4 text-neutral-950" />
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Description & Recipe */}
          <div>
            <h3 className="text-xs font-semibold text-neutral-400 mb-1.5 uppercase tracking-wider">
              توضیحات و رسپی
            </h3>
            <p className="text-neutral-200 text-xs sm:text-sm leading-relaxed font-light">
              {item.description}
            </p>
          </div>

          {/* Quick Metrics (Time & Calories) */}
          {(item.preparationTime || item.calories) && (
            <div className="grid grid-cols-2 gap-2.5">
              {item.preparationTime && (
                <div className="flex items-center gap-2.5 p-2.5 rounded-xl bg-neutral-900/60 border border-neutral-800">
                  <div className="w-7 h-7 rounded-lg bg-neutral-800 flex items-center justify-center text-neutral-300 flex-shrink-0">
                    <Clock className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <div className="text-[10px] text-neutral-400">زمان آماده‌سازی</div>
                    <div className="text-xs font-medium text-neutral-200">{toPersianDigits(item.preparationTime)}</div>
                  </div>
                </div>
              )}

              {item.calories && (
                <div className="flex items-center gap-2.5 p-2.5 rounded-xl bg-neutral-900/60 border border-neutral-800">
                  <div className="w-7 h-7 rounded-lg bg-neutral-800 flex items-center justify-center text-amber-400 flex-shrink-0">
                    <Flame className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <div className="text-[10px] text-neutral-400">کالری تقریبی</div>
                    <div className="text-xs font-medium text-neutral-200">{toPersianDigits(item.calories)} کیلوکالری</div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Ingredients */}
          {item.ingredients && item.ingredients.length > 0 && (
            <div>
              <h3 className="text-xs font-semibold text-neutral-400 mb-2">
                ترکیبات و محتویات:
              </h3>
              <div className="flex flex-wrap gap-1.5">
                {item.ingredients.map((ing, idx) => (
                  <span
                    key={idx}
                    className="text-xs px-2.5 py-1 rounded-lg bg-neutral-900 text-neutral-300 border border-neutral-800"
                  >
                    {ing}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Allergens warning if any */}
          {item.allergens && item.allergens.length > 0 && (
            <div className="p-3 rounded-xl bg-amber-950/20 border border-amber-800/30 flex items-start gap-2 text-amber-200/90 text-xs">
              <ShieldAlert className="w-4 h-4 flex-shrink-0 text-amber-400 mt-0.5" />
              <div>
                <span className="font-semibold">اطلاعات حساسیت غذایی: </span>
                شامل {item.allergens.join('، ')}. در صورت داشتن آلرژی خاص به پرسنل سالن اطلاع دهید.
              </div>
            </div>
          )}

          {/* Return button */}
          <div className="pt-2 pb-1">
            <button
              onClick={onClose}
              className="w-full py-3 rounded-xl font-medium text-xs sm:text-sm text-center transition-colors bg-neutral-800 hover:bg-neutral-700 text-neutral-200 active:scale-[0.99] cursor-pointer"
            >
              بستن و بازگشت به منو
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
