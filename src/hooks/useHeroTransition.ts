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
    async (source: 'cta' | 'wheel' | 'touch' | 'keyboard' | 'toolbar' = 'cta') => {
      if (isTransitioningRef.current || viewState === 'menu' || isOverlayOpen) return;

      isTransitioningRef.current = true;
      setIsTransitioning(true);

      // Lock scroll anchor strictly at top
      await scrollToTop(false);

      setViewState('menu');
      onStateChange?.('menu');

      // Keep guard active throughout the transition duration to consume any momentum
      setTimeout(async () => {
        await scrollToTop(false);
        isTransitioningRef.current = false;
        setIsTransitioning(false);
      }, transitionDurationMs + 100);
    },
    [viewState, isOverlayOpen, scrollToTop, onStateChange, transitionDurationMs]
  );

  const returnToHero = useCallback(async () => {
    if (isTransitioningRef.current || viewState === 'hero' || isOverlayOpen) return;

    isTransitioningRef.current = true;
    setIsTransitioning(true);

    // Scroll to top immediately to ensure seamless reverse animation
    await scrollToTop(false);

    setViewState('hero');
    onStateChange?.('hero');

    setTimeout(async () => {
      await scrollToTop(false);
      isTransitioningRef.current = false;
      setIsTransitioning(false);
    }, transitionDurationMs + 100);
  }, [viewState, isOverlayOpen, scrollToTop, onStateChange, transitionDurationMs]);

  // Global scroll listener for Menu Mode & Transition momentum consumption
  useEffect(() => {
    const container = getScrollContainer();
    const targetElement = container === window ? document : (container as HTMLElement);

    if (!targetElement) return;

    let touchMenuStartY: number | null = null;

    // Wheel listener: handles both Hero transition momentum locking & Menu mode upward return
    const handleWheel = (e: Event) => {
      const wheelEvent = e as WheelEvent;

      // 1. While transitioning: CONSUME ALL SCROLL MOMENTUM to prevent trackpad inertia from moving the page
      if (isTransitioningRef.current) {
        if (wheelEvent.cancelable) {
          wheelEvent.preventDefault();
        }
        return;
      }

      if (isOverlayOpen) return;

      // 2. In Hero mode: downward scroll intent triggers enterMenu
      if (viewState === 'hero') {
        if (wheelEvent.deltaY > 2) {
          if (wheelEvent.cancelable) {
            wheelEvent.preventDefault();
          }
          enterMenu('wheel');
        }
        return;
      }

      // 3. In Menu mode: small upward scroll intent at top (deltaY <= -2) triggers returnToHero
      if (viewState === 'menu') {
        const currentScroll = getScrollTop();
        if (currentScroll <= 1 && wheelEvent.deltaY <= -2) {
          if (wheelEvent.cancelable) {
            wheelEvent.preventDefault();
          }
          returnToHero();
        }
      }
    };

    // Touch listeners: handles Hero transition touch locking, Hero enter, and Menu reverse
    const handleTouchStart = (e: Event) => {
      const touchEvent = e as TouchEvent;
      if (touchEvent.touches && touchEvent.touches.length > 0) {
        touchStartYRef.current = touchEvent.touches[0].clientY;
        touchMenuStartY = touchEvent.touches[0].clientY;
      }
    };

    const handleTouchMove = (e: Event) => {
      const touchEvent = e as TouchEvent;

      // While transitioning: prevent touch scrolling
      if (isTransitioningRef.current) {
        if (touchEvent.cancelable) {
          touchEvent.preventDefault();
        }
        return;
      }

      if (isOverlayOpen || !touchEvent.touches || touchEvent.touches.length === 0) return;

      const currentY = touchEvent.touches[0].clientY;

      // Hero mode: swipe up (delta >= 4px) enters menu
      if (viewState === 'hero' && touchStartYRef.current !== null) {
        const deltaY = touchStartYRef.current - currentY;
        if (deltaY >= 4) {
          if (touchEvent.cancelable) {
            touchEvent.preventDefault();
          }
          touchStartYRef.current = null;
          enterMenu('touch');
        }
        return;
      }

      // Menu mode: pull down at top of page (delta >= 5px) returns to hero
      if (viewState === 'menu' && touchMenuStartY !== null) {
        const currentScroll = getScrollTop();
        const deltaY = currentY - touchMenuStartY; // Positive when pulling down
        if (currentScroll <= 1 && deltaY >= 5) {
          if (touchEvent.cancelable) {
            touchEvent.preventDefault();
          }
          touchMenuStartY = null;
          returnToHero();
        }
      }
    };

    const handleTouchEnd = () => {
      touchStartYRef.current = null;
      touchMenuStartY = null;
    };

    // Keyboard navigation listener (ArrowDown, PageDown, Space)
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isTransitioningRef.current) {
        e.preventDefault();
        return;
      }

      if (isOverlayOpen) return;

      const activeTag = document.activeElement?.tagName?.toLowerCase();
      if (activeTag === 'input' || activeTag === 'textarea' || activeTag === 'select') return;

      if (viewState === 'hero' && (e.key === 'ArrowDown' || e.key === 'PageDown' || e.key === ' ')) {
        e.preventDefault();
        enterMenu('keyboard');
      }
    };

    // Attach listeners with non-passive options to allow preventDefault
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
  }, [viewState, isOverlayOpen, getScrollContainer, getScrollTop, enterMenu, returnToHero]);

  return {
    viewState,
    isMenuMode: viewState === 'menu',
    isTransitioning,
    enterMenu,
    returnToHero,
  };
};
