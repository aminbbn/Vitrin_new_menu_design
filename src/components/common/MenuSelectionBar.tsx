import React, { useRef, useLayoutEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft } from 'lucide-react';
import { useMenuSelection } from '../../context/MenuSelectionContext';
import { useMenuViewport } from '../../context/MenuViewportContext';
import { formatToman, toPersianDigits } from '../../utils/formatters';
import { OverlayPortal } from './OverlayPortal';

interface MenuSelectionBarProps {
  accentColor?: string;
  themeId?: 'immersive' | 'modern' | 'minimal';
}

export const MenuSelectionBar: React.FC<MenuSelectionBarProps> = ({
  accentColor = '#d4af37',
  themeId = 'immersive',
}) => {
  const { totalCount, totalPrice, setIsSelectionSheetOpen } = useMenuSelection();
  const { isSimulated } = useMenuViewport();
  const barRef = useRef<HTMLDivElement>(null);

  // Dynamically broadcast the actual selection bar height via CSS variable to coordinate with ScrollToTopButton
  useLayoutEffect(() => {
    const rootEl = isSimulated
      ? document.getElementById('device-screen-viewport') || document.documentElement
      : document.documentElement;

    if (totalCount > 0 && barRef.current) {
      const updateHeight = () => {
        if (barRef.current) {
          const height = barRef.current.offsetHeight;
          rootEl.style.setProperty('--vitrin-selection-bar-height', `${height}px`);
        }
      };

      updateHeight();
      const ro = new ResizeObserver(updateHeight);
      ro.observe(barRef.current);

      return () => {
        ro.disconnect();
        rootEl.style.setProperty('--vitrin-selection-bar-height', '0px');
      };
    } else {
      rootEl.style.setProperty('--vitrin-selection-bar-height', '0px');
    }
  }, [totalCount, isSimulated]);

  const isModernTheme = themeId === 'modern';

  return (
    <OverlayPortal>
      <AnimatePresence>
        {totalCount > 0 && (
          <motion.div
            initial={{ y: 80, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 80, opacity: 0 }}
            transition={{ type: 'spring', damping: 26, stiffness: 320 }}
            className={`${
              isSimulated ? 'absolute' : 'fixed'
            } bottom-3 sm:bottom-4 inset-x-0 mx-auto w-[calc(100%-1.5rem)] max-w-md z-40 pointer-events-auto flex justify-center`}
            dir="rtl"
          >
            <div
              ref={barRef}
              onClick={() => setIsSelectionSheetOpen(true)}
              id="menu-selection-sticky-bar"
              className={`w-full relative backdrop-blur-xl rounded-2xl p-3 flex items-center justify-between cursor-pointer active:scale-[0.99] transition-all group overflow-hidden select-none border ${
                isModernTheme
                  ? 'bg-[#FAF8F5]/98 border-stone-300 shadow-[0_12px_36px_rgba(0,0,0,0.14)] text-stone-900'
                  : 'bg-neutral-950/95 border-neutral-700/80 shadow-[0_12px_36px_rgba(0,0,0,0.85)] text-white'
              }`}
              style={{
                borderColor: isModernTheme ? `${accentColor}40` : `${accentColor}50`,
              }}
            >
              {/* Subtle Radiance Accent */}
              <div
                className="absolute top-0 right-0 w-32 h-full opacity-10 pointer-events-none blur-xl"
                style={{ backgroundColor: accentColor }}
              />

              {/* Info Side (Right in RTL) */}
              <div className="flex items-center gap-2.5 min-w-0 flex-1 pl-2">
                {/* Badge Count */}
                <div
                  className="w-9 h-9 rounded-xl flex items-center justify-center font-bold text-xs shadow-xs text-white shrink-0"
                  style={{ backgroundColor: accentColor }}
                >
                  <span className="leading-none">{toPersianDigits(totalCount)}</span>
                </div>

                {/* Text Block: Strictly Single Line */}
                <div className="min-w-0 flex-1">
                  <div
                    className={`flex items-center gap-1 text-xs font-medium whitespace-nowrap truncate ${
                      isModernTheme ? 'text-stone-600' : 'text-neutral-300'
                    }`}
                  >
                    <span>انتخاب‌های من</span>
                    <span
                      className={`text-[11px] font-light shrink-0 ${
                        isModernTheme ? 'text-stone-400' : 'text-neutral-400'
                      }`}
                    >
                      ({toPersianDigits(totalCount)} مورد)
                    </span>
                  </div>
                  <div
                    className={`text-xs sm:text-sm font-semibold tracking-tight whitespace-nowrap truncate ${
                      isModernTheme ? 'text-stone-900' : 'text-white'
                    }`}
                  >
                    {formatToman(totalPrice)}
                  </div>
                </div>
              </div>

              {/* Action Button: Compact, Single-line, Shrink-0 */}
              <div className="shrink-0 flex items-center">
                <span
                  className="text-xs font-semibold px-3 py-2 rounded-xl text-white shadow-xs flex items-center gap-1 group-hover:brightness-105 active:scale-95 transition-all whitespace-nowrap"
                  style={{ backgroundColor: accentColor }}
                >
                  <span>مشاهده</span>
                  <ChevronLeft className="w-3.5 h-3.5 -mr-0.5" />
                </span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </OverlayPortal>
  );
};
