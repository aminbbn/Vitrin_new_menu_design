/**
 * Entrance Motion System Configuration
 * 
 * Strict specifications:
 * - Animation duration: 300ms
 * - Easing: cubic-bezier(.16, 1, .3, 1)
 * - Animation properties: opacity and transform (translate3d) only
 * - Initial transform: translate3d(0, 24px, 0)
 * - Final transform: translate3d(0, 0, 0)
 * - Inter-item waiting gap: 0ms
 * - Next-item start time: duration / 3 = 100ms
 * - Overlap: 2/3 duration overlap between consecutive items
 */

export const ENTRANCE_DURATION = 0.3; // 300ms
export const ENTRANCE_EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];
export const ENTRANCE_CSS_EASE = 'cubic-bezier(0.16, 1, 0.3, 1)';
export const ENTRANCE_STAGGER = 0.1; // 100ms (duration / 3)
export const ENTRANCE_OFFSET_Y = 24; // 24px translate3d(0, 24px, 0)

export const entranceItemVariants = {
  hidden: {
    opacity: 0,
    y: ENTRANCE_OFFSET_Y,
  },
  visible: (customIndex: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: ENTRANCE_DURATION,
      ease: ENTRANCE_EASE,
      delay: customIndex * ENTRANCE_STAGGER,
    },
  }),
};

export const entranceContainerVariants = {
  hidden: { opacity: 1 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: ENTRANCE_STAGGER,
      delayChildren: 0,
    },
  },
};

/**
 * Return transition object for index-based staggered animations
 */
export function getEntranceTransition(index: number = 0, additionalDelay: number = 0) {
  return {
    duration: ENTRANCE_DURATION,
    ease: ENTRANCE_EASE,
    delay: additionalDelay + index * ENTRANCE_STAGGER,
  };
}
