import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  Clock,
  Flame,
  AlertCircle,
  CheckCircle2,
  XCircle,
  ShieldAlert,
  Plus,
  Minus,
} from 'lucide-react';
import { MenuItem } from '../../types/menu';
import { formatToman, toPersianDigits } from '../../utils/formatters';
import { useMenuSelection } from '../../context/MenuSelectionContext';
import { useMenuViewport } from '../../context/MenuViewportContext';
import { OverlayPortal } from './OverlayPortal';
import { SafeImage } from './SafeImage';

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

  // Container placement: bottom on mobile/tablet, centered on desktop
  const containerAlignmentClass = isDesktop
    ? 'items-center justify-center p-4 sm:p-6'
    : 'items-end justify-center';

  // Sheet geometry: ~80% (4/5) height on mobile & tablet, centered modal on desktop
  const panelGeometryClass = isDesktop
    ? 'w-full max-w-md rounded-3xl border border-neutral-800 max-h-[85vh]'
    : isSimulated
    ? 'w-full h-[80%] max-h-[85%] rounded-t-3xl rounded-b-none border-t border-x border-neutral-800'
    : 'w-full h-[80vh] max-h-[85vh] rounded-t-3xl rounded-b-none border-t border-x border-neutral-800';

  // Motion variants based on device presentation
  const panelMotionProps = isDesktop
    ? {
        initial: { opacity: 0, scale: 0.95, y: 12 },
        animate: { opacity: 1, scale: 1, y: 0 },
        exit: { opacity: 0, scale: 0.95, y: 12 },
        transition: { duration: 0.2, ease: [0.16, 1, 0.3, 1] },
      }
    : {
        initial: { y: '100%' },
        animate: { y: 0 },
        exit: { y: '100%' },
        transition: { type: 'spring', stiffness: 350, damping: 35, mass: 0.9 },
      };

  return (
    <div
      className={`${
        isSimulated ? 'absolute' : 'fixed'
      } inset-0 z-50 flex ${containerAlignmentClass} pointer-events-auto overflow-hidden`}
      dir="rtl"
      onWheel={(e) => e.stopPropagation()}
    >
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2, ease: 'easeOut' }}
        onClick={onClose}
        className="absolute inset-0 bg-black/80 backdrop-blur-sm pointer-events-auto"
      />

      {/* Main Sheet / Modal Panel */}
      <motion.div
        {...panelMotionProps}
        className={`relative bg-[#11161b] shadow-2xl z-10 text-neutral-100 flex flex-col pointer-events-auto overflow-hidden ${panelGeometryClass}`}
      >
        {/* Top Handle / Pull Indicator (Only in mobile/tablet sheet mode) */}
        {!isDesktop && (
          <div className="pt-2.5 pb-1 bg-[#11161b] flex-shrink-0 flex items-center justify-center">
            <div className="w-10 h-1 bg-neutral-600/80 rounded-full" />
          </div>
        )}

        {/* Product Food Header Image */}
        <div
          className={`relative w-full bg-neutral-950 flex-shrink-0 overflow-hidden ${
            isDesktop ? 'h-48' : 'h-40 sm:h-44'
          }`}
        >
          <SafeImage
            src={item.image}
            alt={item.name}
            className="w-full h-full object-cover"
            fallbackIconClassName="w-8 h-8 text-neutral-500"
          />

          {/* Atmospheric Gradient Scrim */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#11161b] via-[#11161b]/30 to-black/50" />

          {/* Top Controls: Close button on Left, Availability on Right */}
          <div className="absolute top-3 left-3 right-3 flex items-center justify-between z-10">
            {/* Availability Badge moved here to never compete with price */}
            <div>
              {item.availability === 'available' && (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-950/85 backdrop-blur-md text-emerald-300 text-[11px] font-medium border border-emerald-500/30 shadow whitespace-nowrap">
                  <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                  موجود
                </span>
              )}
              {item.availability === 'low_stock' && (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-950/85 backdrop-blur-md text-amber-300 text-[11px] font-medium border border-amber-500/30 shadow whitespace-nowrap">
                  <AlertCircle className="w-3 h-3 text-amber-400" />
                  تعداد محدود
                </span>
              )}
              {item.availability === 'sold_out' && (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-rose-950/85 backdrop-blur-md text-rose-300 text-[11px] font-medium border border-rose-500/30 shadow whitespace-nowrap">
                  <XCircle className="w-3 h-3 text-rose-400" />
                  اتمام موجودی
                </span>
              )}
            </div>

            {/* Close Button */}
            <button
              onClick={onClose}
              id="close-product-modal-btn"
              className="w-8 h-8 rounded-full bg-black/60 backdrop-blur-md text-white flex items-center justify-center hover:bg-black/90 active:scale-95 transition-all border border-white/10 cursor-pointer shadow-lg"
              aria-label="بستن پنجره"
            >
              <X className="w-4 h-4 stroke-[2.5]" />
            </button>
          </div>

          {/* Product Title on Image Baseline (Strict RTL alignment) */}
          <div className="absolute bottom-3 right-4 left-4 text-right">
            <h2 className="text-base sm:text-lg font-bold text-white tracking-tight leading-snug">
              {item.name}
            </h2>
            {item.nameEn && (
              <p className="text-[11px] text-neutral-400 font-sans tracking-wide mt-0.5 text-right">
                {item.nameEn}
              </p>
            )}
          </div>
        </div>

        {/* Scrollable Sheet Body Content */}
        <div className="p-4 sm:p-5 space-y-4 flex-1 overflow-y-auto overscroll-contain no-scrollbar text-right">
          {/* Single Compact Unified Price & Action Container */}
          <div className="flex items-center justify-between p-3 rounded-2xl bg-neutral-900/90 border border-neutral-800/90 shadow-sm">
            <div className="flex items-baseline gap-2">
              <span className="text-xs text-neutral-400 font-light">قیمت:</span>
              <span className="text-sm sm:text-base font-semibold text-white tracking-tight">
                {formatToman(item.price)}
              </span>
            </div>

            {/* Compact Action */}
            <div>
              {isSoldOut ? (
                <span className="text-xs text-neutral-500 px-3 py-1.5 rounded-xl bg-neutral-800/50 border border-neutral-700/40 whitespace-nowrap">
                  اتمام موجودی
                </span>
              ) : currentQty === 0 ? (
                <button
                  onClick={() => addItem(item.id)}
                  className="px-3.5 py-1.5 rounded-xl text-xs font-bold text-neutral-950 flex items-center gap-1.5 active:scale-95 transition-all shadow cursor-pointer whitespace-nowrap"
                  style={{ backgroundColor: accentColor }}
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span className="whitespace-nowrap">افزودن</span>
                </button>
              ) : (
                <div className="flex items-center gap-2 bg-neutral-950 border border-neutral-700/60 rounded-xl p-1 shrink-0">
                  <button
                    onClick={() => decreaseItem(item.id)}
                    className="w-6 h-6 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-200 flex items-center justify-center active:scale-95 transition-all cursor-pointer"
                    aria-label="کاهش"
                  >
                    <Minus className="w-3 h-3" />
                  </button>
                  <span className="w-4 text-center text-xs font-bold text-white">
                    {toPersianDigits(currentQty)}
                  </span>
                  <button
                    onClick={() => addItem(item.id)}
                    className="w-6 h-6 rounded-lg text-neutral-950 flex items-center justify-center active:scale-95 transition-all font-bold cursor-pointer"
                    style={{ backgroundColor: accentColor }}
                    aria-label="افزایش"
                  >
                    <Plus className="w-3 h-3 text-neutral-950" />
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Description & Recipe */}
          <div className="text-right">
            <h3 className="text-[11px] font-medium text-neutral-400 mb-1">
              توضیحات
            </h3>
            <p className="text-neutral-300 text-xs leading-relaxed font-light text-right">
              {item.description}
            </p>
          </div>

          {/* Quick Metrics (Time & Calories) */}
          {(item.preparationTime || item.calories) && (
            <div className="grid grid-cols-2 gap-2 text-right">
              {item.preparationTime && (
                <div className="flex items-center gap-2 p-2 rounded-xl bg-neutral-900/60 border border-neutral-800">
                  <div className="w-6 h-6 rounded-lg bg-neutral-800 flex items-center justify-center text-neutral-300 flex-shrink-0">
                    <Clock className="w-3 h-3" />
                  </div>
                  <div className="min-w-0 text-right">
                    <div className="text-[10px] text-neutral-400 font-light">زمان آماده‌سازی</div>
                    <div className="text-xs font-normal text-neutral-200">{toPersianDigits(item.preparationTime)}</div>
                  </div>
                </div>
              )}

              {item.calories && (
                <div className="flex items-center gap-2 p-2 rounded-xl bg-neutral-900/60 border border-neutral-800">
                  <div className="w-6 h-6 rounded-lg bg-neutral-800 flex items-center justify-center text-amber-400 flex-shrink-0">
                    <Flame className="w-3 h-3" />
                  </div>
                  <div className="min-w-0 text-right">
                    <div className="text-[10px] text-neutral-400 font-light">کالری تقریبی</div>
                    <div className="text-xs font-normal text-neutral-200">{toPersianDigits(item.calories)} کیلوکالری</div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Ingredients */}
          {item.ingredients && item.ingredients.length > 0 && (
            <div className="text-right">
              <h3 className="text-[11px] font-medium text-neutral-400 mb-1.5 text-right">
                ترکیبات:
              </h3>
              <div className="flex flex-wrap gap-1.5 justify-start">
                {item.ingredients.map((ing, idx) => (
                  <span
                    key={idx}
                    className="text-[11px] px-2.5 py-0.5 rounded-lg bg-neutral-900 text-neutral-300 border border-neutral-800 whitespace-nowrap"
                  >
                    {ing}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Allergens warning if any */}
          {item.allergens && item.allergens.length > 0 && (
            <div className="p-2.5 rounded-xl bg-amber-950/20 border border-amber-800/30 flex items-start gap-2 text-amber-200/90 text-[11px] text-right">
              <ShieldAlert className="w-3.5 h-3.5 flex-shrink-0 text-amber-400 mt-0.5" />
              <div className="text-right">
                <span className="font-medium">اطلاعات حساسیت غذایی: </span>
                شامل {item.allergens.join('، ')}.
              </div>
            </div>
          )}

          {/* Return button */}
          <div className="pt-2 pb-1">
            <button
              onClick={onClose}
              className="w-full min-h-[44px] py-2.5 px-4 rounded-xl font-medium text-xs text-center transition-colors bg-neutral-800 hover:bg-neutral-700 text-neutral-200 active:scale-[0.99] cursor-pointer whitespace-nowrap flex items-center justify-center"
            >
              بستن و بازگشت به منو
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
