import React from 'react';
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

  if (totalCount === 0) return null;

  return (
    <OverlayPortal>
      <AnimatePresence>
        <motion.div
          initial={{ y: 80, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 80, opacity: 0 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className={`${
            isSimulated ? 'absolute' : 'fixed'
          } bottom-3 sm:bottom-4 left-3 right-3 sm:left-1/2 sm:-translate-x-1/2 sm:w-[420px] sm:max-w-md z-40 pointer-events-auto`}
          dir="rtl"
        >
          <div
            onClick={() => setIsSelectionSheetOpen(true)}
            id="menu-selection-sticky-bar"
            className="relative bg-neutral-950/95 backdrop-blur-xl border border-neutral-700/80 rounded-2xl p-3 sm:p-3.5 shadow-[0_12px_36px_rgba(0,0,0,0.85)] flex items-center justify-between cursor-pointer active:scale-[0.99] transition-all group overflow-hidden"
            style={{
              borderColor: `${accentColor}50`,
            }}
          >
            {/* Subtle Glow Accent */}
            <div
              className="absolute top-0 right-0 w-32 h-full opacity-15 pointer-events-none blur-xl"
              style={{ backgroundColor: accentColor }}
            />

            {/* Left / Info Side */}
            <div className="flex items-center gap-3">
              {/* Badge Count */}
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm shadow-md text-neutral-950 shrink-0"
                style={{ backgroundColor: accentColor }}
              >
                <span className="leading-none">{toPersianDigits(totalCount)}</span>
              </div>

              <div>
                <div className="flex items-center gap-1.5">
                  <span className="text-xs text-neutral-300 font-medium">انتخاب‌های من</span>
                  <span className="text-[11px] text-neutral-400">
                    ({toPersianDigits(totalCount)} مورد)
                  </span>
                </div>
                <div className="text-sm sm:text-base font-semibold text-white tracking-tight">
                  {formatToman(totalPrice)}
                </div>
              </div>
            </div>

            {/* Right Action Button */}
            <div className="flex items-center gap-1.5 pl-1">
              <span
                className="text-xs font-bold px-3.5 py-2 rounded-xl text-neutral-950 shadow-sm flex items-center gap-1 group-hover:brightness-110 transition-all"
                style={{ backgroundColor: accentColor }}
              >
                <span>مشاهده انتخاب‌ها</span>
                <ChevronLeft className="w-4 h-4 -mr-0.5" />
              </span>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    </OverlayPortal>
  );
};
