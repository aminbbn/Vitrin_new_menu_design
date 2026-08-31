import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { useMenuViewport } from '../../context/MenuViewportContext';

interface OverlayPortalProps {
  children: React.ReactNode;
}

export const OverlayPortal: React.FC<OverlayPortalProps> = ({ children }) => {
  const { getOverlayRoot } = useMenuViewport();
  const [mountTarget, setMountTarget] = useState<HTMLElement | null>(null);

  useEffect(() => {
    const root = getOverlayRoot();
    if (root) {
      setMountTarget(root);
    } else if (typeof document !== 'undefined') {
      setMountTarget(document.body);
    }
  }, [getOverlayRoot]);

  // If running in browser and target is resolved
  if (!mountTarget) {
    if (typeof document !== 'undefined') {
      return createPortal(children, document.body);
    }
    return null;
  }

  return createPortal(children, mountTarget);
};
