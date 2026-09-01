import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Clock, MapPin } from 'lucide-react';
import { toPersianDigits } from '../../utils/formatters';

interface HeroInfoPillsProps {
  workingHours: string;
  location: string;
  themeId?: 'immersive' | 'modern' | 'minimal';
  accentColor?: string;
  className?: string;
}

export const HeroInfoPills: React.FC<HeroInfoPillsProps> = ({
  workingHours,
  location,
  themeId = 'immersive',
  className = '',
}) => {
  const [expandedPill, setExpandedPill] = useState<'hours' | 'location' | null>(null);

  // Theme-specific styling tokens
  const themeStyles = {
    immersive: {
      pillBg: 'bg-black/50 backdrop-blur-md border-white/10 text-neutral-200 hover:border-amber-500/30',
      expandedBorder: 'border-amber-400/40 bg-black/70',
      iconColor: 'text-amber-400',
    },
    modern: {
      pillBg: 'bg-slate-900/80 backdrop-blur-md border-slate-700/80 text-slate-200 hover:border-orange-500/30',
      expandedBorder: 'border-orange-500/40 bg-slate-900/95',
      iconColor: 'text-orange-400',
    },
    minimal: {
      pillBg: 'bg-neutral-900/90 backdrop-blur-md border-neutral-800 text-neutral-200 hover:border-teal-500/30',
      expandedBorder: 'border-teal-500/40 bg-neutral-900',
      iconColor: 'text-teal-400',
    },
  }[themeId];

  const togglePill = (pill: 'hours' | 'location') => {
    setExpandedPill((current) => (current === pill ? null : pill));
  };

  return (
    <div className={`w-full max-w-sm mx-auto ${className}`} dir="rtl">
      <div className="flex items-center gap-2.5 w-full h-9 overflow-hidden">
        {/* Working Hours Pill */}
        <AnimatePresence initial={false}>
          {(expandedPill === null || expandedPill === 'hours') && (
            <motion.button
              layout
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{
                duration: 0.25,
                ease: [0.22, 1, 0.36, 1],
              }}
              onClick={() => togglePill('hours')}
              className={`h-9 px-3 flex items-center justify-center gap-1.5 rounded-full border text-xs font-medium cursor-pointer select-none transition-colors overflow-hidden shadow-sm ${
                expandedPill === 'hours'
                  ? `flex-1 w-full ${themeStyles.expandedBorder}`
                  : `flex-1 w-1/2 ${themeStyles.pillBg}`
              }`}
              title="مشاهده ساعات فعالیت"
              aria-expanded={expandedPill === 'hours'}
            >
              <Clock className={`w-3.5 h-3.5 shrink-0 ${themeStyles.iconColor}`} />
              <span
                className={`truncate ${
                  expandedPill === 'hours'
                    ? 'whitespace-nowrap text-[11px] sm:text-xs text-white'
                    : 'whitespace-nowrap text-[11px] sm:text-xs'
                }`}
              >
                {toPersianDigits(workingHours)}
              </span>
            </motion.button>
          )}
        </AnimatePresence>

        {/* Location Pill */}
        <AnimatePresence initial={false}>
          {(expandedPill === null || expandedPill === 'location') && (
            <motion.button
              layout
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{
                duration: 0.25,
                ease: [0.22, 1, 0.36, 1],
              }}
              onClick={() => togglePill('location')}
              className={`h-9 px-3 flex items-center justify-center gap-1.5 rounded-full border text-xs font-medium cursor-pointer select-none transition-colors overflow-hidden shadow-sm ${
                expandedPill === 'location'
                  ? `flex-1 w-full ${themeStyles.expandedBorder}`
                  : `flex-1 w-1/2 ${themeStyles.pillBg}`
              }`}
              title="مشاهده موقعیت رستوران"
              aria-expanded={expandedPill === 'location'}
            >
              <MapPin className={`w-3.5 h-3.5 shrink-0 ${themeStyles.iconColor}`} />
              <span
                className={`truncate ${
                  expandedPill === 'location'
                    ? 'whitespace-nowrap text-[11px] sm:text-xs text-white'
                    : 'whitespace-nowrap text-[11px] sm:text-xs'
                }`}
              >
                {location}
              </span>
            </motion.button>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
