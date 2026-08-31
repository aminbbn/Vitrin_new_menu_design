import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import {
  Smartphone,
  Tablet as TabletIcon,
  Monitor,
  Maximize2,
  Minimize2,
  ZoomIn,
  ZoomOut,
  RotateCw,
} from 'lucide-react';
import { MenuViewportProvider } from '../../context/MenuViewportContext';

export type PreviewDeviceType = 'mobile' | 'tablet' | 'desktop' | 'responsive';

export interface DevicePreset {
  id: string;
  name: string;
  width: number;
  height: number;
  deviceType: PreviewDeviceType;
}

export const DEVICE_PRESETS: Record<PreviewDeviceType, DevicePreset[]> = {
  mobile: [
    { id: 'mobile-360', name: '360 × 800 (اندروید فشرده)', width: 360, height: 800, deviceType: 'mobile' },
    { id: 'mobile-390', name: '390 × 844 (آیفون استاندارد)', width: 390, height: 844, deviceType: 'mobile' },
    { id: 'mobile-430', name: '430 × 932 (آیفون پرو مکس)', width: 430, height: 932, deviceType: 'mobile' },
  ],
  tablet: [
    { id: 'tablet-820', name: '820 × 1180 (آیپد ایر)', width: 820, height: 1180, deviceType: 'tablet' },
    { id: 'tablet-834', name: '834 × 1194 (آیپد پرو ۱۱)', width: 834, height: 1194, deviceType: 'tablet' },
  ],
  desktop: [
    { id: 'desktop-1280', name: '1280 × 800 (لپ‌تاپ فشرده)', width: 1280, height: 800, deviceType: 'desktop' },
    { id: 'desktop-1440', name: '1440 × 900 (دسکتاپ استاندارد)', width: 1440, height: 900, deviceType: 'desktop' },
    { id: 'desktop-1920', name: '1920 × 1080 (فول اچ‌دی)', width: 1920, height: 1080, deviceType: 'desktop' },
  ],
  responsive: [
    { id: 'responsive-full', name: 'تمام صفحه (Full Stage)', width: 0, height: 0, deviceType: 'responsive' },
  ],
};

interface DevicePreviewFrameProps {
  deviceType: PreviewDeviceType;
  preset: DevicePreset;
  children: React.ReactNode;
  showDecorations?: boolean;
}

export const DevicePreviewFrame: React.FC<DevicePreviewFrameProps> = ({
  deviceType,
  preset,
  children,
  showDecorations = true,
}) => {
  const stageRef = useRef<HTMLDivElement>(null);
  const viewportScrollRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState<number>(1);
  const [autoFit, setAutoFit] = useState<boolean>(true);

  // Auto-fit calculation based on available stage width & height
  useEffect(() => {
    if (deviceType === 'responsive' || !autoFit) {
      if (!autoFit) return;
      setScale(1);
      return;
    }

    const updateScale = () => {
      if (!stageRef.current) return;
      const stage = stageRef.current;
      const availableWidth = stage.clientWidth - 48; // padding margin
      const availableHeight = stage.clientHeight - 64; // padding margin for device label & toolbar

      const targetWidth = preset.width + (deviceType === 'mobile' ? 24 : deviceType === 'tablet' ? 32 : 16);
      const targetHeight = preset.height + (deviceType === 'mobile' ? 24 : deviceType === 'tablet' ? 32 : 48);

      if (targetWidth <= 0 || targetHeight <= 0 || availableWidth <= 0 || availableHeight <= 0) return;

      const scaleX = availableWidth / targetWidth;
      const scaleY = availableHeight / targetHeight;
      const fitScale = Math.min(scaleX, scaleY, 1); // Never scale up beyond 100%

      setScale(Math.max(0.35, fitScale));
    };

    updateScale();

    const resizeObserver = new ResizeObserver(() => {
      updateScale();
    });

    if (stageRef.current) {
      resizeObserver.observe(stageRef.current);
    }

    window.addEventListener('resize', updateScale);
    return () => {
      resizeObserver.disconnect();
      window.removeEventListener('resize', updateScale);
    };
  }, [deviceType, preset, autoFit]);

  // Full / Responsive Viewport without Device Frame
  if (deviceType === 'responsive') {
    return (
      <MenuViewportProvider
        isSimulated={false}
        viewportWidth={typeof window !== 'undefined' ? window.innerWidth : 1280}
        viewportHeight={typeof window !== 'undefined' ? window.innerHeight : 844}
      >
        <div
          className="w-full min-h-full flex flex-col items-center justify-start"
          style={{ '--menu-viewport-height': '100dvh', '--menu-viewport-width': '100vw' } as React.CSSProperties}
        >
          <div className="w-full min-h-screen">
            {children}
          </div>
        </div>
      </MenuViewportProvider>
    );
  }

  const { width: targetWidth, height: targetHeight } = preset;

  return (
    <MenuViewportProvider
      isSimulated={true}
      containerRef={viewportScrollRef}
      viewportWidth={targetWidth}
      viewportHeight={targetHeight}
    >
      <div
        ref={stageRef}
        className="w-full h-full min-h-[88vh] flex flex-col items-center justify-center p-2 sm:p-4 overflow-hidden relative"
      >
        {/* Informational Device Pill & Zoom Controls (Outside Simulated Page) */}
        <div className="mb-3 flex items-center gap-3 z-20 text-xs text-neutral-400 bg-neutral-900/90 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-neutral-800 shadow-md">
          <div className="flex items-center gap-1.5 font-medium text-neutral-200">
            {deviceType === 'mobile' && <Smartphone className="w-3.5 h-3.5 text-amber-400" />}
            {deviceType === 'tablet' && <TabletIcon className="w-3.5 h-3.5 text-orange-400" />}
            {deviceType === 'desktop' && <Monitor className="w-3.5 h-3.5 text-teal-400" />}
            <span>{preset.name}</span>
          </div>

          <span className="text-neutral-600">•</span>

          <div className="flex items-center gap-1.5">
            <span className="text-[11px] text-neutral-400">
              مقیاس: {Math.round(scale * 100)}%
            </span>
            <button
              onClick={() => setAutoFit(!autoFit)}
              className={`px-1.5 py-0.5 rounded text-[10px] font-semibold transition-colors cursor-pointer ${
                autoFit ? 'bg-amber-500/20 text-amber-300' : 'bg-neutral-800 text-neutral-400 hover:text-white'
              }`}
              title="انطباق خودکار با کادر صفحه"
            >
              Auto-Fit
            </button>
            {!autoFit && (
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setScale((s) => Math.max(0.35, s - 0.1))}
                  className="w-5 h-5 rounded bg-neutral-800 hover:bg-neutral-700 flex items-center justify-center text-white text-xs cursor-pointer"
                >
                  -
                </button>
                <button
                  onClick={() => setScale((s) => Math.min(1.2, s + 0.1))}
                  className="w-5 h-5 rounded bg-neutral-800 hover:bg-neutral-700 flex items-center justify-center text-white text-xs cursor-pointer"
                >
                  +
                </button>
                <button
                  onClick={() => setScale(1)}
                  className="text-[10px] px-1 text-neutral-400 hover:text-white cursor-pointer"
                >
                  100%
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Visual Scaler Box (Maintains Exact Logical Dimensions Inside) */}
        <div
          className="flex items-center justify-center transition-transform duration-200 origin-center"
          style={{
            width: targetWidth,
            height: targetHeight + (deviceType === 'desktop' ? 36 : 0),
            transform: `scale(${scale})`,
          }}
        >
          {/* ================================================================ */}
          {/* 1. MOBILE DEVICE FRAME                                           */}
          {/* ================================================================ */}
          {deviceType === 'mobile' && (
            <div
              className="bg-neutral-950 rounded-[48px] p-2.5 shadow-[0_25px_70px_-15px_rgba(0,0,0,0.9)] border-[6px] border-neutral-800 relative overflow-hidden flex flex-col"
              style={{
                width: targetWidth,
                height: targetHeight,
              }}
            >
              {/* Dynamic Island / Speaker Decoration */}
              {showDecorations && (
                <div className="absolute top-3.5 left-1/2 -translate-x-1/2 w-24 h-4 bg-neutral-900 rounded-full z-40 pointer-events-none shadow-sm flex items-center justify-end px-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-[#111] border border-neutral-800" />
                </div>
              )}

              {/* Internal Screen Viewport */}
              <div
                ref={viewportScrollRef}
                id="device-screen-viewport"
                className="w-full h-full rounded-[38px] overflow-y-auto overflow-x-hidden no-scrollbar relative bg-neutral-950"
                style={{
                  transform: 'translateZ(0)',
                  '--menu-viewport-height': `${targetHeight}px`,
                  '--menu-viewport-width': `${targetWidth}px`,
                } as React.CSSProperties}
              >
                {children}
              </div>
            </div>
          )}

          {/* ================================================================ */}
          {/* 2. TABLET DEVICE FRAME                                           */}
          {/* ================================================================ */}
          {deviceType === 'tablet' && (
            <div
              className="bg-neutral-950 rounded-[36px] p-3.5 shadow-[0_30px_80px_-20px_rgba(0,0,0,0.95)] border-[8px] border-neutral-800 relative overflow-hidden flex flex-col"
              style={{
                width: targetWidth,
                height: targetHeight,
              }}
            >
              {/* Subtle Camera Dot */}
              {showDecorations && (
                <div className="absolute top-2.5 left-1/2 -translate-x-1/2 w-2.5 h-2.5 bg-neutral-800 rounded-full z-40 pointer-events-none" />
              )}

              {/* Internal Screen Viewport */}
              <div
                ref={viewportScrollRef}
                id="device-screen-viewport"
                className="w-full h-full rounded-[24px] overflow-y-auto overflow-x-hidden no-scrollbar relative bg-neutral-950"
                style={{
                  transform: 'translateZ(0)',
                  '--menu-viewport-height': `${targetHeight}px`,
                  '--menu-viewport-width': `${targetWidth}px`,
                } as React.CSSProperties}
              >
                {children}
              </div>
            </div>
          )}

          {/* ================================================================ */}
          {/* 3. DESKTOP BROWSER FRAME                                         */}
          {/* ================================================================ */}
          {deviceType === 'desktop' && (
            <div
              className="bg-neutral-900 rounded-2xl shadow-[0_30px_90px_-20px_rgba(0,0,0,0.95)] border border-neutral-800 relative overflow-hidden flex flex-col"
              style={{
                width: targetWidth,
                height: targetHeight + 36,
              }}
            >
              {/* Browser Top Window Bar (Chrome) */}
              <div className="h-9 bg-neutral-950 px-4 flex items-center justify-between border-b border-neutral-800 flex-shrink-0 select-none">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-rose-500/80" />
                  <div className="w-3 h-3 rounded-full bg-amber-500/80" />
                  <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
                </div>

                {/* Fake URL Bar */}
                <div className="w-72 max-w-sm bg-neutral-900/80 border border-neutral-800/80 rounded-lg px-3 py-0.5 text-[11px] text-neutral-400 font-sans text-center truncate">
                  https://menu.vitrin.app/bono-tehran
                </div>

                <div className="w-12 text-[10px] text-neutral-500 font-sans text-right">
                  {targetWidth}px
                </div>
              </div>

              {/* Internal Screen Viewport */}
              <div
                ref={viewportScrollRef}
                id="device-screen-viewport"
                className="w-full overflow-y-auto overflow-x-hidden no-scrollbar relative bg-neutral-950 flex-1"
                style={{
                  height: targetHeight,
                  transform: 'translateZ(0)',
                  '--menu-viewport-height': `${targetHeight}px`,
                  '--menu-viewport-width': `${targetWidth}px`,
                } as React.CSSProperties}
              >
                {children}
              </div>
            </div>
          )}
        </div>
      </div>
    </MenuViewportProvider>
  );
};

