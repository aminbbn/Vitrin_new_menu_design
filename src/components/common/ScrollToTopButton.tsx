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

      setIsVisible(scrollY > 220);
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

  // Dynamic bottom offset: sits close to bottom (16px) when no selection bar,
  // or raised to 78px when the sticky selection bar is visible.
  const bottomPosition = isSelectionActive ? 78 : 16;

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
              bottom: isSelectionActive ? 84 : 18,
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
            className={`${
              isSimulated ? 'absolute' : 'fixed'
            } left-4 sm:left-6 z-40 w-10 h-10 rounded-full flex items-center justify-center shadow-2xl active:scale-95 transition-colors cursor-pointer border backdrop-blur-md pointer-events-auto ${
              themeId === 'modern'
                ? 'bg-slate-900/95 hover:bg-slate-800 border-slate-700 text-slate-200 shadow-[0_4px_20px_rgba(0,0,0,0.6)]'
                : themeId === 'minimal'
                ? 'bg-[#0d1317]/95 hover:bg-neutral-800 border-neutral-700 text-teal-300 shadow-[0_4px_20px_rgba(0,0,0,0.6)]'
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
