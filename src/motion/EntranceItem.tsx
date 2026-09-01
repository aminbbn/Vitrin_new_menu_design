import React from 'react';
import { motion, MotionProps } from 'framer-motion';
import { useEntranceSectionContext } from './EntranceSection';
import {
  ENTRANCE_DURATION,
  ENTRANCE_EASE,
  ENTRANCE_STAGGER,
  ENTRANCE_OFFSET_Y,
} from './entranceConfig';

interface EntranceItemProps extends MotionProps {
  index?: number;
  className?: string;
  children: React.ReactNode;
  id?: string;
  as?: 'div' | 'li' | 'article' | 'span' | 'button' | 'header' | 'footer' | 'section';
  onClick?: (e: React.MouseEvent) => void;
  style?: React.CSSProperties;
  'data-testid'?: string;
  role?: string;
  'aria-label'?: string;
}

/**
 * EntranceItem
 * 
 * Individual element participating in the continuous 300ms / 100ms stagger sequence.
 * 
 * Strict specifications:
 * - Animation duration: 300ms
 * - Easing: cubic-bezier(.16, 1, .3, 1)
 * - Initial: opacity: 0, transform: translate3d(0, 24px, 0)
 * - Final: opacity: 1, transform: translate3d(0, 0, 0)
 * - Start time: index * (duration / 3) = index * 100ms
 * - Next item starts after 100ms (overlapping by 200ms)
 * - Prefers-reduced-motion: duration 0, immediate reveal
 */
export const EntranceItem: React.FC<EntranceItemProps> = ({
  index = 0,
  className = '',
  children,
  id,
  as = 'div',
  onClick,
  style,
  ...rest
}) => {
  const { hasEntered, prefersReducedMotion } = useEntranceSectionContext();

  const Component = motion[as] as any;

  if (prefersReducedMotion) {
    return (
      <Component
        id={id}
        className={className}
        onClick={onClick}
        style={style}
        initial={{ opacity: 1, y: 0 }}
        animate={{ opacity: 1, y: 0 }}
        {...rest}
      >
        {children}
      </Component>
    );
  }

  return (
    <Component
      id={id}
      className={className}
      onClick={onClick}
      style={style}
      initial={{ opacity: 0, y: ENTRANCE_OFFSET_Y }}
      animate={
        hasEntered
          ? { opacity: 1, y: 0 }
          : { opacity: 0, y: ENTRANCE_OFFSET_Y }
      }
      transition={{
        duration: ENTRANCE_DURATION,
        ease: ENTRANCE_EASE,
        delay: index * ENTRANCE_STAGGER,
      }}
      {...rest}
    >
      {children}
    </Component>
  );
};
