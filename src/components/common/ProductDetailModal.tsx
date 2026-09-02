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
  themeId?: 'immersive' | 'modern' | 'minimal';
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  item,
  onClose,
  accentColor = '#d4af37',
  themeId = 'immersive',
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
            themeId={themeId}
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
  themeId: 'immersive' | 'modern' | 'minimal';
}

const ProductDetailOverlayContent: React.FC<ProductDetailOverlayContentProps> = ({
  item,
  onClose,
  accentColor,
  themeId,
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
  const isModernTheme = themeId === 'modern';

  // Container placement: bottom on mobile/tablet, centered on desktop
  const containerAlignmentClass = isDesktop
    ? 'items-center justify-center p-4 sm:p-6'
    : 'items-end justify-center';

  // Sheet geometry: ~80% (4/5) height on mobile & tablet, centered modal on desktop
  const borderClass = isModernTheme
    ? 'border-stone-200/90 shadow-2xl'
    : 'border-neutral-800 shadow-2xl';

  const panelGeometryClass = isDesktop
    ? `w-full max-w-md rounded-3xl border ${borderClass} max-h-[85vh]`
    : isSimulated
    ? `w-full h-[80%] max-h-[85%] rounded-t-3xl rounded-b-none border-t border-x ${borderClass}`
    : `w-full h-[80vh] max-h-[85vh] rounded-t-3xl rounded-b-none border-t border-x ${borderClass}`;

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
        className="absolute inset-0 bg-black/75 backdrop-blur-sm pointer-events-auto"
      />

      {/* Main Sheet / Modal Panel */}
      <motion.div
        {...panelMotionProps}
        className={`relative ${
          isModernTheme
            ? 'bg-[#FAF8F5] text-stone-900'
            : 'bg-[#11161b] text-neutral-100'
        } z-10 flex flex-col pointer-events-auto overflow-hidden ${panelGeometryClass}`}
      >
        {/* Top Handle / Pull Indicator (Only in mobile/tablet sheet mode) */}
        {!isDesktop && (
          <div
            className={`pt-2.5 pb-1 ${
              isModernTheme ? 'bg-[#FAF8F5]' : 'bg-[#11161b]'
            } flex-shrink-0 flex items-center justify-center`}
          >
            <div
              className={`w-10 h-1 rounded-full ${
                isModernTheme ? 'bg-stone-300' : 'bg-neutral-600/80'
              }`}
            />
          </div>
        )}

        {/* Product Food Header Image */}
        <div
          className={`relative w-full ${
            isModernTheme ? 'bg-stone-200' : 'bg-neutral-950'
          } flex-shrink-0 overflow-hidden ${
            isDesktop ? 'h-48' : 'h-40 sm:h-44'
          }`}
        >
          <SafeImage
            src={item.image}
            alt={item.name}
            className="w-full h-full object-cover"
            fallbackIconClassName={
              isModernTheme ? 'w-8 h-8 text-stone-400' : 'w-8 h-8 text-neutral-500'
            }
          />

          {/* Atmospheric Gradient Scrim */}
          <div
            className={`absolute inset-0 bg-gradient-to-t ${
              isModernTheme
                ? 'from-[#FAF8F5] via-[#FAF8F5]/30 to-black/40'
                : 'from-[#11161b] via-[#11161b]/30 to-black/50'
            }`}
          />

          {/* Top Controls: Close button on Left, Availability on Right */}
          <div className="absolute top-3 left-3 right-3 flex items-center justify-between z-10">
            {/* Availability Badge moved here to never compete with price */}
            <div>
              {item.availability === 'available' && (
                <span
                  className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-medium border shadow whitespace-nowrap backdrop-blur-md ${
                    isModernTheme
                      ? 'bg-emerald-50/90 text-emerald-800 border-emerald-300'
                      : 'bg-emerald-950/85 text-emerald-300 border-emerald-500/30'
                  }`}
                >
                  <CheckCircle2
                    className={`w-3 h-3 ${
                      isModernTheme ? 'text-emerald-600' : 'text-emerald-400'
                    }`}
                  />
                  موجود
                </span>
              )}
              {item.availability === 'low_stock' && (
                <span
                  className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-medium border shadow whitespace-nowrap backdrop-blur-md ${
                    isModernTheme
                      ? 'bg-amber-50/90 text-amber-800 border-amber-300'
                      : 'bg-amber-950/85 text-amber-300 border-amber-500/30'
                  }`}
                >
                  <AlertCircle
                    className={`w-3 h-3 ${
                      isModernTheme ? 'text-amber-600' : 'text-amber-400'
                    }`}
                  />
                  تعداد محدود
                </span>
              )}
              {item.availability === 'sold_out' && (
                <span
                  className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-medium border shadow whitespace-nowrap backdrop-blur-md ${
                    isModernTheme
                      ? 'bg-rose-50/90 text-rose-800 border-rose-300'
                      : 'bg-rose-950/85 text-rose-300 border-rose-500/30'
                  }`}
                >
                  <XCircle
                    className={`w-3 h-3 ${
                      isModernTheme ? 'text-rose-600' : 'text-rose-400'
                    }`}
                  />
                  اتمام موجودی
                </span>
              )}
            </div>

            {/* Close Button */}
            <button
              onClick={onClose}
              id="close-product-modal-btn"
              className={`w-8 h-8 rounded-full flex items-center justify-center active:scale-95 transition-all cursor-pointer shadow-lg backdrop-blur-md ${
                isModernTheme
                  ? 'bg-white/90 hover:bg-white text-stone-800 border border-stone-200'
                  : 'bg-black/60 hover:bg-black/90 text-white border border-white/10'
              }`}
              aria-label="بستن پنجره"
            >
              <X className="w-4 h-4 stroke-[2.5]" />
            </button>
          </div>

          {/* Product Title on Image Baseline (Strict RTL alignment) */}
          <div className="absolute bottom-3 right-4 left-4 text-right">
            <h2
              className={`text-base sm:text-lg font-bold tracking-tight leading-snug ${
                isModernTheme ? 'text-stone-900 drop-shadow-xs' : 'text-white'
              }`}
            >
              {item.name}
            </h2>
            {item.nameEn && (
              <p
                className={`text-[11px] font-sans tracking-wide mt-0.5 text-right ${
                  isModernTheme ? 'text-stone-500' : 'text-neutral-400'
                }`}
                dir="ltr"
                style={{ textAlign: 'right' }}
              >
                {item.nameEn}
              </p>
            )}
          </div>
        </div>

        {/* Scrollable Sheet Body Content */}
        <div className="p-4 sm:p-5 space-y-4 flex-1 overflow-y-auto overscroll-contain no-scrollbar text-right">
          {/* Single Compact Unified Price & Action Container */}
          <div
            className={`flex items-center justify-between p-3 rounded-2xl border shadow-xs ${
              isModernTheme
                ? 'bg-white border-stone-200'
                : 'bg-neutral-900/90 border-neutral-800/90'
            }`}
          >
            <div className="flex items-baseline gap-2">
              <span
                className={`text-xs font-light ${
                  isModernTheme ? 'text-stone-500' : 'text-neutral-400'
                }`}
              >
                قیمت:
              </span>
              <span
                className={`text-sm sm:text-base font-semibold tracking-tight ${
                  isModernTheme ? 'text-stone-900' : 'text-white'
                }`}
              >
                {formatToman(item.price)}
              </span>
            </div>

            {/* Compact Action */}
            <div>
              {isSoldOut ? (
                <span
                  className={`text-xs px-3 py-1.5 rounded-xl border whitespace-nowrap ${
                    isModernTheme
                      ? 'text-stone-500 bg-stone-100 border-stone-200'
                      : 'text-neutral-500 bg-neutral-800/50 border-neutral-700/40'
                  }`}
                >
                  اتمام موجودی
                </span>
              ) : currentQty === 0 ? (
                <button
                  onClick={() => addItem(item.id)}
                  className="px-3.5 py-1.5 rounded-xl text-xs font-semibold text-white flex items-center gap-1.5 active:scale-95 transition-all shadow-xs cursor-pointer whitespace-nowrap"
                  style={{ backgroundColor: accentColor }}
                >
                  <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
                  <span className="whitespace-nowrap">افزودن</span>
                </button>
              ) : (
                <div
                  className={`flex items-center gap-2 border rounded-xl p-1 shrink-0 ${
                    isModernTheme
                      ? 'bg-stone-50 border-stone-200'
                      : 'bg-neutral-950 border-neutral-700/60'
                  }`}
                >
                  <button
                    onClick={() => decreaseItem(item.id)}
                    className={`w-6 h-6 rounded-lg flex items-center justify-center active:scale-95 transition-all cursor-pointer ${
                      isModernTheme
                        ? 'bg-white hover:bg-stone-100 text-stone-700 border border-stone-200 shadow-xs'
                        : 'bg-neutral-800 hover:bg-neutral-700 text-neutral-200'
                    }`}
                    aria-label="کاهش"
                  >
                    <Minus className="w-3 h-3" />
                  </button>
                  <span
                    className={`w-4 text-center text-xs font-bold ${
                      isModernTheme ? 'text-stone-900' : 'text-white'
                    }`}
                  >
                    {toPersianDigits(currentQty)}
                  </span>
                  <button
                    onClick={() => addItem(item.id)}
                    className="w-6 h-6 rounded-lg text-white flex items-center justify-center active:scale-95 transition-all font-bold cursor-pointer shadow-xs"
                    style={{ backgroundColor: accentColor }}
                    aria-label="افزایش"
                  >
                    <Plus className="w-3 h-3 text-white stroke-[2.5]" />
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Description & Recipe */}
          <div className="text-right">
            <h3
              className={`text-[11px] font-medium mb-1 ${
                isModernTheme ? 'text-stone-500' : 'text-neutral-400'
              }`}
            >
              توضیحات
            </h3>
            <p
              className={`text-xs leading-relaxed font-normal text-right ${
                isModernTheme ? 'text-stone-700' : 'text-neutral-300'
              }`}
            >
              {item.description}
            </p>
          </div>

          {/* Quick Metrics (Time & Calories) */}
          {(item.preparationTime || item.calories) && (
            <div className="grid grid-cols-2 gap-2 text-right">
              {item.preparationTime && (
                <div
                  className={`flex items-center gap-2 p-2 rounded-xl border ${
                    isModernTheme
                      ? 'bg-white border-stone-200 shadow-xs'
                      : 'bg-neutral-900/60 border-neutral-800'
                  }`}
                >
                  <div
                    className={`w-6 h-6 rounded-lg flex items-center justify-center flex-shrink-0 ${
                      isModernTheme
                        ? 'bg-stone-100 text-stone-600'
                        : 'bg-neutral-800 text-neutral-300'
                    }`}
                  >
                    <Clock className="w-3 h-3" />
                  </div>
                  <div className="min-w-0 text-right">
                    <div
                      className={`text-[10px] font-light ${
                        isModernTheme ? 'text-stone-500' : 'text-neutral-400'
                      }`}
                    >
                      زمان آماده‌سازی
                    </div>
                    <div
                      className={`text-xs font-normal ${
                        isModernTheme ? 'text-stone-800' : 'text-neutral-200'
                      }`}
                    >
                      {toPersianDigits(item.preparationTime)}
                    </div>
                  </div>
                </div>
              )}

              {item.calories && (
                <div
                  className={`flex items-center gap-2 p-2 rounded-xl border ${
                    isModernTheme
                      ? 'bg-white border-stone-200 shadow-xs'
                      : 'bg-neutral-900/60 border-neutral-800'
                  }`}
                >
                  <div
                    className={`w-6 h-6 rounded-lg flex items-center justify-center flex-shrink-0 ${
                      isModernTheme
                        ? 'bg-amber-100 text-amber-700'
                        : 'bg-neutral-800 text-amber-400'
                    }`}
                  >
                    <Flame className="w-3 h-3" />
                  </div>
                  <div className="min-w-0 text-right">
                    <div
                      className={`text-[10px] font-light ${
                        isModernTheme ? 'text-stone-500' : 'text-neutral-400'
                      }`}
                    >
                      کالری تقریبی
                    </div>
                    <div
                      className={`text-xs font-normal ${
                        isModernTheme ? 'text-stone-800' : 'text-neutral-200'
                      }`}
                    >
                      {toPersianDigits(item.calories)} کیلوکالری
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Ingredients */}
          {item.ingredients && item.ingredients.length > 0 && (
            <div className="text-right">
              <h3
                className={`text-[11px] font-medium mb-1.5 text-right ${
                  isModernTheme ? 'text-stone-500' : 'text-neutral-400'
                }`}
              >
                ترکیبات:
              </h3>
              <div className="flex flex-wrap gap-1.5 justify-start">
                {item.ingredients.map((ing, idx) => (
                  <span
                    key={idx}
                    className={`text-[11px] px-2.5 py-0.5 rounded-lg border whitespace-nowrap ${
                      isModernTheme
                        ? 'bg-white text-stone-700 border-stone-200 shadow-xs'
                        : 'bg-neutral-900 text-neutral-300 border-neutral-800'
                    }`}
                  >
                    {ing}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Allergens warning if any */}
          {item.allergens && item.allergens.length > 0 && (
            <div
              className={`p-2.5 rounded-xl border flex items-start gap-2 text-[11px] text-right ${
                isModernTheme
                  ? 'bg-amber-50/80 border-amber-200 text-amber-900'
                  : 'bg-amber-950/20 border-amber-800/30 text-amber-200/90'
              }`}
            >
              <ShieldAlert
                className={`w-3.5 h-3.5 flex-shrink-0 mt-0.5 ${
                  isModernTheme ? 'text-amber-600' : 'text-amber-400'
                }`}
              />
              <div className="text-right">
                <span className="font-medium">اطلاعات حساسیت غذایی: </span>
                شامل {item.allergens.join('، ')}.
              </div>
            </div>
          )}
        </div>

        {/* Bottom Action Footer: flex-shrink-0, strictly outside overflow-y-auto, anchored at physical bottom */}
        <div
          className={`p-3 sm:p-4 border-t flex-shrink-0 ${
            isModernTheme
              ? 'bg-[#FAF8F5] border-stone-200'
              : 'bg-[#11161b] border-neutral-800/80'
          }`}
        >
          <button
            onClick={onClose}
            id="product-detail-return-btn"
            className={`w-full min-h-[44px] py-2.5 px-4 rounded-xl font-medium text-xs text-center transition-colors active:scale-[0.99] cursor-pointer whitespace-nowrap flex items-center justify-center shadow-sm ${
              isModernTheme
                ? 'bg-stone-200/90 hover:bg-stone-300 text-stone-800'
                : 'bg-neutral-800 hover:bg-neutral-700 text-neutral-200'
            }`}
          >
            بستن و بازگشت به منو
          </button>
        </div>
      </motion.div>
    </div>
  );
};
