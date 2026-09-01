import React, { createContext, useContext } from 'react';
import { motion } from 'framer-motion';
import { useScrollEntrance } from './useScrollEntrance';
import { useEntranceInit } from './useEntranceInit';
import {
  ENTRANCE_DURATION,
  ENTRANCE_EASE,
  ENTRANCE_STAGGER,
  ENTRANCE_OFFSET_Y,
} from './entranceConfig';

interface EntranceSectionContextType {
  hasEntered: boolean;
  prefersReducedMotion: boolean;
}

const EntranceSectionContext = createContext<EntranceSectionContextType>({
  hasEntered: true,
  prefersReducedMotion: false,
});

export const useEntranceSectionContext = () => useContext(EntranceSectionContext);

interface EntranceSectionProps {
  id?: string;
  className?: string;
  children: React.ReactNode;
  threshold?: number;
  rootMargin?: string;
  dataCategoryId?: string;
  as?: 'section' | 'div' | 'main' | 'footer' | 'header';
}

/**
 * EntranceSection
 * 
 * Scroll-triggered section that activates when entering the viewport/scroll container.
 * - Progressive enhancement: Content is visible if JS is disabled.
 * - IntersectionObserver with once: true semantics.
 * - Sequentially reveals child items in DOM order.
 */
export const EntranceSection: React.FC<EntranceSectionProps> = ({
  id,
  className = '',
  children,
  threshold = 0.08,
  rootMargin = '0px 0px -40px 0px',
  dataCategoryId,
  as = 'section',
}) => {
  const { isReady, prefersReducedMotion } = useEntranceInit();
  const { elementRef, hasEntered } = useScrollEntrance({
    threshold,
    rootMargin,
    enabled: isReady,
  });

  const shouldShow = hasEntered || prefersReducedMotion || !isReady;

  const Component = motion[as] as any;

  return (
    <EntranceSectionContext.Provider
      value={{
        hasEntered: shouldShow,
        prefersReducedMotion,
      }}
    >
      <Component
        ref={elementRef}
        id={id}
        data-category-id={dataCategoryId}
        className={className}
        initial={false}
      >
        {children}
      </Component>
    </EntranceSectionContext.Provider>
  );
};
