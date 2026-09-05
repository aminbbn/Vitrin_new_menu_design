import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowUp } from 'lucide-react';
import { useMenuSelection } from '../../context/MenuSelectionContext';
import { useMenuViewport } from '../../context/MenuViewportContext';
import { OverlayPortal } from './OverlayPortal';

interface ScrollToTopButtonProps {
  accentColor?: string;
  themeId?: 'immersive' | 'modern' | 'minimal';
}

export const ScrollToTopButton: React.FC<ScrollToTopButtonProps> = ({
  accentColor = '#d4af37',
  themeId = 'immersive',
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const { totalCount } = useMenuSelection();
  const { getScrollContainer, isSimulated } = useMenuViewport();

  useEffect(() => {
    const handleScroll = () => {
      let scrollY = 0;
      const container = getScrollContainer();

      if (container && container !== window) {
        scrollY = (container as HTMLElement).scrollTop;
      } else {
        const viewport = document.getElementById('device-screen-viewport');
        if (viewport) {
          scrollY = viewport.scrollTop;
        } else if (typeof window !== 'undefined') {
          scrollY = window.scrollY || document.documentElement.scrollTop;
        }
      }

      setIsVisible((prev) => {
        const next = scrollY > 220;
        return prev !== next ? next : prev;
      });
    };

    const container = getScrollContainer();
    const targetElement = (container && container !== window)
      ? (container as HTMLElement)
      : (typeof window !== 'undefined' ? window : null);

    if (targetElement) {
      targetElement.addEventListener('scroll', handleScroll, { passive: true });
    }

    // Also attach to device viewport if simulated
    const deviceViewport = document.getElementById('device-screen-viewport');
    if (deviceViewport && deviceViewport !== targetElement) {
      deviceViewport.addEventListener('scroll', handleScroll, { passive: true });
    }

    // Initial check
    handleScroll();

    return () => {
      if (targetElement) {
        targetElement.removeEventListener('scroll', handleScroll);
      }
      if (deviceViewport && deviceViewport !== targetElement) {
        deviceViewport.removeEventListener('scroll', handleScroll);
      }
    };
  }, [getScrollContainer]);

  const scrollToTop = () => {
    const container = getScrollContainer();
    if (container && container !== window) {
      (container as HTMLElement).scrollTo({ top: 0, behavior: 'smooth' });
    }
    const viewport = document.getElementById('device-screen-viewport');
    if (viewport) {
      viewport.scrollTo({ top: 0, behavior: 'smooth' });
    }
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const isSelectionActive = totalCount > 0;

  return (
    <OverlayPortal>
      <AnimatePresence>
        {isVisible && (
          <motion.button
            key="scroll-to-top"
            initial={{ opacity: 0, scale: 0.8, y: 12 }}
            animate={{
              opacity: 1,
              scale: 1,
              y: 0,
            }}
            exit={{ opacity: 0, scale: 0.8, y: 12 }}
            transition={{
              type: 'spring',
              damping: 24,
              stiffness: 300,
              mass: 0.8,
            }}
            onClick={scrollToTop}
            id="scroll-to-top-btn"
            style={{
              bottom: isSelectionActive
                ? 'calc(var(--vitrin-selection-bar-height, 68px) + 26px)'
                : '20px',
            }}
            className={`${
              isSimulated ? 'absolute' : 'fixed'
            } left-4 sm:left-6 z-40 w-10 h-10 rounded-full flex items-center justify-center shadow-2xl active:scale-95 transition-all cursor-pointer border backdrop-blur-md pointer-events-auto ${
              themeId === 'modern'
                ? 'bg-[#FAF8F5]/95 hover:bg-stone-100 border-stone-300 text-stone-800 shadow-[0_4px_20px_rgba(0,0,0,0.12)]'
                : themeId === 'minimal'
                ? 'bg-[#14171c]/95 hover:bg-neutral-800 border-white/15 text-white shadow-[0_4px_20px_rgba(0,0,0,0.6)]'
                : 'bg-neutral-900/95 hover:bg-neutral-800 border-neutral-700 text-amber-300 shadow-[0_4px_20px_rgba(0,0,0,0.6)]'
            }`}
            aria-label="بازگشت به بالای منو"
            title="بازگشت به بالا"
          >
            <ArrowUp className="w-4 h-4 stroke-[2.2]" />
          </motion.button>
        )}
      </AnimatePresence>
    </OverlayPortal>
  );
};
