import React, { useState } from 'react';
import { UtensilsCrossed } from 'lucide-react';

interface SafeImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  fallbackIconClassName?: string;
  fallbackContainerClassName?: string;
  fallbackClassName?: string;
  containerClassName?: string;
  priority?: boolean;
}

/**
 * SafeImage ensures that broken URLs or network image failures never expose
 * raw browser broken-image icons or ugly ALT text in cards and modals.
 * Instead, it renders a controlled, elegant culinary placeholder surface.
 */
export const SafeImage: React.FC<SafeImageProps> = ({
  src,
  alt = '',
  className = '',
  fallbackIconClassName = 'w-5 h-5 text-neutral-600',
  fallbackContainerClassName = '',
  fallbackClassName = '',
  containerClassName = '',
  priority = false,
  onError,
  loading,
  fetchPriority,
  ...rest
}) => {
  const [hasError, setHasError] = useState(!src);
  const extraFallbackClasses = [fallbackContainerClassName, fallbackClassName, containerClassName]
    .filter(Boolean)
    .join(' ');

  if (hasError || !src) {
    return (
      <div
        className={`w-full h-full bg-neutral-900/90 flex flex-col items-center justify-center relative overflow-hidden select-none ${extraFallbackClasses} ${className}`}
        role="img"
        aria-label={alt || 'تصویر محصول'}
      >
        <div className="absolute inset-0 bg-gradient-to-tr from-black/40 via-transparent to-white/5 pointer-events-none" />
        <UtensilsCrossed className={`${fallbackIconClassName} shrink-0 opacity-60`} />
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      className={className}
      referrerPolicy="no-referrer"
      loading={priority ? 'eager' : loading || 'lazy'}
      fetchPriority={priority ? 'high' : (fetchPriority as 'high' | 'low' | 'auto' | undefined)}
      onError={(e) => {
        setHasError(true);
        onError?.(e);
      }}
      {...rest}
    />
  );
};
