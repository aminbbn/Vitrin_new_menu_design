import { useState, useEffect } from 'react';

/**
 * useEntranceInit
 * 
 * Synchronizes browser paint & font readiness before initiating entrance animations.
 * Ensures:
 * 1. Layout has settled enough to avoid visible font/layout jumps.
 * 2. Uses double requestAnimationFrame paint synchronization.
 * 3. Never blocks the page indefinitely (bounded fallback).
 * 4. Content remains visible and usable under all conditions.
 * 5. Respects prefers-reduced-motion.
 */
export function useEntranceInit(): { isReady: boolean; prefersReducedMotion: boolean } {
  const [isReady, setIsReady] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    // 1. Check prefers-reduced-motion
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);

    const handleMediaChange = (e: MediaQueryListEvent) => {
      setPrefersReducedMotion(e.matches);
    };

    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener('change', handleMediaChange);
    } else {
      mediaQuery.addListener(handleMediaChange);
    }

    // If reduced motion is requested, become ready immediately without wait
    if (mediaQuery.matches) {
      setIsReady(true);
      return;
    }

    let isCancelled = false;
    let rAF1: number | null = null;
    let rAF2: number | null = null;

    const startPaintSync = () => {
      if (isCancelled) return;
      rAF1 = requestAnimationFrame(() => {
        if (isCancelled) return;
        rAF2 = requestAnimationFrame(() => {
          if (!isCancelled) {
            setIsReady(true);
          }
        });
      });
    };

    // 2. Font readiness + Double requestAnimationFrame synchronization
    if (typeof document !== 'undefined' && 'fonts' in document && document.fonts.ready) {
      // Bounded fallback so we never block beyond 60ms
      const timeoutId = setTimeout(() => {
        startPaintSync();
      }, 60);

      document.fonts.ready
        .then(() => {
          clearTimeout(timeoutId);
          startPaintSync();
        })
        .catch(() => {
          clearTimeout(timeoutId);
          startPaintSync();
        });
    } else {
      startPaintSync();
    }

    return () => {
      isCancelled = true;
      if (rAF1 !== null) cancelAnimationFrame(rAF1);
      if (rAF2 !== null) cancelAnimationFrame(rAF2);
      if (mediaQuery.removeEventListener) {
        mediaQuery.removeEventListener('change', handleMediaChange);
      } else {
        mediaQuery.removeListener(handleMediaChange);
      }
    };
  }, []);

  return { isReady, prefersReducedMotion };
}
