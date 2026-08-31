import { useState, useEffect, useRef, useCallback } from 'react';
import { useMenuViewport } from '../context/MenuViewportContext';

interface UseHeroTransitionProps {
  initialState?: 'hero' | 'menu' | string;
  onStateChange?: (state: 'hero' | 'menu') => void;
  transitionDurationMs?: number;
}

export const useHeroTransition = ({
  initialState = 'hero',
  onStateChange,
  transitionDurationMs = 750,
}: UseHeroTransitionProps) => {
  const normalizedInitial = initialState === 'menu' ? 'menu' : 'hero';
  const [viewState, setViewState] = useState<'hero' | 'menu'>(normalizedInitial);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const isTransitioningRef = useRef(false);
  const { getScrollContainer, getScrollTop, scrollToTop, isOverlayOpen } = useMenuViewport();

  const touchStartYRef = useRef<number | null>(null);

  // Sync external state changes (e.g. from toolbar buttons)
  useEffect(() => {
    const targetState = initialState === 'menu' ? 'menu' : 'hero';
    if (targetState !== viewState && !isTransitioningRef.current) {
      setViewState(targetState);
    }
  }, [initialState, viewState]);

  const enterMenu = useCallback(
    (source: 'cta' | 'wheel' | 'touch' | 'keyboard' | 'toolbar' = 'cta') => {
      if (isTransitioningRef.current || viewState === 'menu' || isOverlayOpen) return;

      isTransitioningRef.current = true;
      setIsTransitioning(true);
      setViewState('menu');
      onStateChange?.('menu');

      // Keep guard active throughout the transition duration to avoid multi-triggers
      setTimeout(() => {
        isTransitioningRef.current = false;
        setIsTransitioning(false);
      }, transitionDurationMs + 100);
    },
    [viewState, isOverlayOpen, onStateChange, transitionDurationMs]
  );

  const returnToHero = useCallback(async () => {
    if (isTransitioningRef.current || viewState === 'hero' || isOverlayOpen) return;

    isTransitioningRef.current = true;
    setIsTransitioning(true);

    // If currently scrolled, scroll to top first
    const currentScroll = getScrollTop();
    if (currentScroll > 5) {
      await scrollToTop(true);
    }

    setViewState('hero');
    onStateChange?.('hero');

    setTimeout(() => {
      isTransitioningRef.current = false;
      setIsTransitioning(false);
    }, transitionDurationMs + 100);
  }, [viewState, isOverlayOpen, getScrollTop, scrollToTop, onStateChange, transitionDurationMs]);

  // Scroll intent listener for Wheel, Touch, and Key events while in Hero view
  useEffect(() => {
    if (viewState !== 'hero') return;

    const container = getScrollContainer();
    const targetElement = container === window ? document : (container as HTMLElement);

    if (!targetElement) return;

    // 1. Wheel / Trackpad listener
    const handleWheel = (e: Event) => {
      const wheelEvent = e as WheelEvent;
      if (isTransitioningRef.current || isOverlayOpen) return;

      if (wheelEvent.deltaY > 2) {
        if (wheelEvent.cancelable) {
          wheelEvent.preventDefault();
        }
        enterMenu('wheel');
      }
    };

    // 2. Touch listener (for mobile & touch devices)
    const handleTouchStart = (e: Event) => {
      const touchEvent = e as TouchEvent;
      if (touchEvent.touches && touchEvent.touches.length > 0) {
        touchStartYRef.current = touchEvent.touches[0].clientY;
      }
    };

    const handleTouchMove = (e: Event) => {
      const touchEvent = e as TouchEvent;
      if (isTransitioningRef.current || isOverlayOpen || touchStartYRef.current === null) return;

      if (touchEvent.touches && touchEvent.touches.length > 0) {
        const currentY = touchEvent.touches[0].clientY;
        const deltaY = touchStartYRef.current - currentY; // Positive when swiping up (intending to scroll down)

        if (deltaY >= 3) {
          if (touchEvent.cancelable) {
            touchEvent.preventDefault();
          }
          touchStartYRef.current = null;
          enterMenu('touch');
        }
      }
    };

    const handleTouchEnd = () => {
      touchStartYRef.current = null;
    };

    // 3. Keyboard navigation listener (ArrowDown, PageDown, Space)
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isTransitioningRef.current || isOverlayOpen) return;

      const activeTag = document.activeElement?.tagName?.toLowerCase();
      if (activeTag === 'input' || activeTag === 'textarea' || activeTag === 'select') return;

      if (e.key === 'ArrowDown' || e.key === 'PageDown' || e.key === ' ') {
        e.preventDefault();
        enterMenu('keyboard');
      }
    };

    // Add non-passive event listeners to enable preventDefault
    targetElement.addEventListener('wheel', handleWheel, { passive: false });
    targetElement.addEventListener('touchstart', handleTouchStart, { passive: true });
    targetElement.addEventListener('touchmove', handleTouchMove, { passive: false });
    targetElement.addEventListener('touchend', handleTouchEnd, { passive: true });
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      targetElement.removeEventListener('wheel', handleWheel);
      targetElement.removeEventListener('touchstart', handleTouchStart);
      targetElement.removeEventListener('touchmove', handleTouchMove);
      targetElement.removeEventListener('touchend', handleTouchEnd);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [viewState, isOverlayOpen, getScrollContainer, enterMenu]);

  return {
    viewState,
    isMenuMode: viewState === 'menu',
    isTransitioning,
    enterMenu,
    returnToHero,
  };
};
