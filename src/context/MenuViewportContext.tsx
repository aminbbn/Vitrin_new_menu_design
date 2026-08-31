import React, { createContext, useContext, useRef, useState, useEffect, useCallback } from 'react';

export type OverlayPresentation = 'mobile-sheet' | 'tablet-sheet' | 'desktop-modal';

export function getOverlayPresentation(viewportWidth: number): OverlayPresentation {
  const width = viewportWidth > 0 ? viewportWidth : (typeof window !== 'undefined' ? window.innerWidth : 390);
  if (width < 640) return 'mobile-sheet';
  if (width < 1024) return 'tablet-sheet';
  return 'desktop-modal';
}

interface MenuViewportContextType {
  scrollContainerRef: React.RefObject<HTMLDivElement | null>;
  getScrollContainer: () => HTMLElement | Window | null;
  getScrollTop: () => number;
  scrollToTop: (smooth?: boolean) => Promise<void>;
  scrollToElement: (elementId: string, offset?: number) => void;
  viewportWidth: number;
  viewportHeight: number;
  isSimulated: boolean;
  isOverlayOpen: boolean;
  registerOverlay: (id: string) => () => void;
  overlayRootRef?: React.RefObject<HTMLDivElement | null>;
  getOverlayRoot: () => HTMLElement | null;
  overlayPresentation: OverlayPresentation;
}

const MenuViewportContext = createContext<MenuViewportContextType | null>(null);

export interface MenuViewportProviderProps {
  children: React.ReactNode;
  viewportWidth?: number;
  viewportHeight?: number;
  isSimulated?: boolean;
  containerRef?: React.RefObject<HTMLDivElement | null>;
  overlayRootRef?: React.RefObject<HTMLDivElement | null>;
}

export const MenuViewportProvider: React.FC<MenuViewportProviderProps> = ({
  children,
  viewportWidth = 0,
  viewportHeight = 0,
  isSimulated = false,
  containerRef: externalContainerRef,
  overlayRootRef: externalOverlayRootRef,
}) => {
  const internalContainerRef = useRef<HTMLDivElement | null>(null);
  const activeContainerRef = externalContainerRef || internalContainerRef;
  const [activeOverlays, setActiveOverlays] = useState<Set<string>>(new Set());
  const savedScrollPosRef = useRef<number>(0);

  const overlayPresentation = getOverlayPresentation(viewportWidth);

  const getOverlayRoot = useCallback((): HTMLElement | null => {
    if (isSimulated && externalOverlayRootRef?.current) {
      return externalOverlayRootRef.current;
    }
    const el = document.getElementById('device-overlay-root');
    if (el && isSimulated) {
      return el;
    }
    return typeof document !== 'undefined' ? document.body : null;
  }, [isSimulated, externalOverlayRootRef]);

  const getScrollContainer = useCallback((): HTMLElement | Window | null => {
    if (isSimulated && activeContainerRef.current) {
      return activeContainerRef.current;
    }
    // Check if there is an explicit viewport container in the DOM
    const el = activeContainerRef.current || document.getElementById('device-screen-viewport');
    if (el && isSimulated) {
      return el;
    }
    return typeof window !== 'undefined' ? window : null;
  }, [isSimulated, activeContainerRef]);

  const getScrollTop = useCallback((): number => {
    const container = getScrollContainer();
    if (!container) return 0;
    if (container === window) {
      return window.scrollY || document.documentElement.scrollTop || 0;
    }
    return (container as HTMLElement).scrollTop || 0;
  }, [getScrollContainer]);

  const scrollToTop = useCallback(
    (smooth = true): Promise<void> => {
      return new Promise((resolve) => {
        const container = getScrollContainer();
        if (!container) {
          resolve();
          return;
        }

        const behavior: ScrollBehavior = smooth ? 'smooth' : 'auto';

        if (container === window) {
          window.scrollTo({ top: 0, behavior });
        } else {
          (container as HTMLElement).scrollTo({ top: 0, behavior });
        }

        if (!smooth) {
          resolve();
          return;
        }

        // Wait for smooth scroll to finish or max 350ms
        let checkCount = 0;
        const checkInterval = setInterval(() => {
          checkCount++;
          if (getScrollTop() <= 2 || checkCount > 18) {
            clearInterval(checkInterval);
            resolve();
          }
        }, 20);
      });
    },
    [getScrollContainer, getScrollTop]
  );

  const scrollToElement = useCallback(
    (elementId: string, offset = 80) => {
      const target = document.getElementById(elementId);
      if (!target) return;

      const container = getScrollContainer();
      if (!container || container === window) {
        const rect = target.getBoundingClientRect();
        const top = rect.top + window.scrollY - offset;
        window.scrollTo({ top: Math.max(0, top), behavior: 'smooth' });
      } else {
        const containerEl = container as HTMLElement;
        const containerRect = containerEl.getBoundingClientRect();
        const targetRect = target.getBoundingClientRect();
        const currentScroll = containerEl.scrollTop;
        const relativeTop = targetRect.top - containerRect.top + currentScroll - offset;
        containerEl.scrollTo({ top: Math.max(0, relativeTop), behavior: 'smooth' });
      }
    },
    [getScrollContainer]
  );

  // Overlay registration & scroll locking
  const registerOverlay = useCallback(
    (id: string) => {
      setActiveOverlays((prev) => {
        const next = new Set(prev);
        if (next.size === 0) {
          // First overlay opened - capture scroll position
          savedScrollPosRef.current = getScrollTop();
        }
        next.add(id);
        return next;
      });

      return () => {
        setActiveOverlays((prev) => {
          const next = new Set(prev);
          next.delete(id);
          return next;
        });
      };
    },
    [getScrollTop]
  );

  // Apply scroll lock when overlays are open
  useEffect(() => {
    const isLocked = activeOverlays.size > 0;
    const container = getScrollContainer();

    if (!container) return;

    if (isLocked) {
      if (container === window) {
        const currentY = savedScrollPosRef.current;
        document.body.style.position = 'fixed';
        document.body.style.top = `-${currentY}px`;
        document.body.style.left = '0';
        document.body.style.right = '0';
        document.body.style.overflow = 'hidden';
      } else {
        const el = container as HTMLElement;
        el.style.overflow = 'hidden';
        el.style.touchAction = 'none';
      }
    } else {
      if (container === window) {
        const scrollY = document.body.style.top;
        document.body.style.position = '';
        document.body.style.top = '';
        document.body.style.left = '';
        document.body.style.right = '';
        document.body.style.overflow = '';
        if (scrollY) {
          window.scrollTo(0, parseInt(scrollY || '0', 10) * -1);
        }
      } else {
        const el = container as HTMLElement;
        el.style.overflow = '';
        el.style.touchAction = '';
        if (savedScrollPosRef.current > 0) {
          el.scrollTop = savedScrollPosRef.current;
        }
      }
    }
  }, [activeOverlays.size, getScrollContainer]);

  return (
    <MenuViewportContext.Provider
      value={{
        scrollContainerRef: activeContainerRef,
        getScrollContainer,
        getScrollTop,
        scrollToTop,
        scrollToElement,
        viewportWidth,
        viewportHeight,
        isSimulated,
        isOverlayOpen: activeOverlays.size > 0,
        registerOverlay,
        overlayRootRef: externalOverlayRootRef,
        getOverlayRoot,
        overlayPresentation,
      }}
    >
      {children}
    </MenuViewportContext.Provider>
  );
};

export const useMenuViewport = () => {
  const context = useContext(MenuViewportContext);
  if (!context) {
    // Fallback if not wrapped in provider
    const fallbackWidth = typeof window !== 'undefined' ? window.innerWidth : 390;
    return {
      scrollContainerRef: { current: null },
      getScrollContainer: () => (typeof window !== 'undefined' ? window : null),
      getScrollTop: () => (typeof window !== 'undefined' ? window.scrollY : 0),
      scrollToTop: async (smooth = true) => {
        if (typeof window !== 'undefined') window.scrollTo({ top: 0, behavior: smooth ? 'smooth' : 'auto' });
      },
      scrollToElement: (id: string, offset = 80) => {
        const target = document.getElementById(id);
        if (target) {
          const top = target.getBoundingClientRect().top + window.scrollY - offset;
          window.scrollTo({ top: Math.max(0, top), behavior: 'smooth' });
        }
      },
      viewportWidth: fallbackWidth,
      viewportHeight: typeof window !== 'undefined' ? window.innerHeight : 844,
      isSimulated: false,
      isOverlayOpen: false,
      registerOverlay: () => () => {},
      overlayRootRef: { current: null },
      getOverlayRoot: () => (typeof document !== 'undefined' ? document.body : null),
      overlayPresentation: getOverlayPresentation(fallbackWidth),
    };
  }
  return context;
};
