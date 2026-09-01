import { useState, useEffect, useRef } from 'react';
import { useMenuViewport } from '../context/MenuViewportContext';

interface UseScrollEntranceOptions {
  threshold?: number;
  rootMargin?: string;
  enabled?: boolean;
}

/**
 * useScrollEntrance
 * 
 * IntersectionObserver hook supporting both Window scroll and Simulated Device scroll containers.
 * - Triggers once when section becomes visible.
 * - Permanently stops observing once triggered.
 * - Never replays animation.
 */
export function useScrollEntrance({
  threshold = 0,
  rootMargin = '150px 0px 0px 0px',
  enabled = true,
}: UseScrollEntranceOptions = {}) {
  const elementRef = useRef<HTMLDivElement | null>(null);
  const [hasEntered, setHasEntered] = useState(false);
  const viewport = useMenuViewport();

  useEffect(() => {
    if (!enabled || hasEntered) return;
    const target = elementRef.current;
    if (!target) return;

    // Fast check if element or viewport exists
    const scrollContainer = viewport?.getScrollContainer?.();
    const root = scrollContainer instanceof HTMLElement ? scrollContainer : null;

    const rect = target.getBoundingClientRect();
    const viewportHeight = root ? root.clientHeight : window.innerHeight;
    if (rect.top < viewportHeight + 150 && rect.bottom > -50) {
      setHasEntered(true);
      return;
    }

    if (typeof IntersectionObserver === 'undefined') {
      setHasEntered(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting || entry.intersectionRatio > 0) {
          setHasEntered(true);
          observer.unobserve(target);
          observer.disconnect();
        }
      },
      {
        root,
        threshold,
        rootMargin,
      }
    );

    observer.observe(target);

    return () => {
      observer.disconnect();
    };
  }, [enabled, hasEntered, threshold, rootMargin, viewport]);

  return { elementRef, hasEntered: hasEntered || !enabled };
}
