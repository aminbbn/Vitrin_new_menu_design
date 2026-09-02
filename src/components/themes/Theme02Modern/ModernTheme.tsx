import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ChevronLeft,
  ArrowRight,
  Sparkles,
  Layers,
  MapPin,
  Clock,
  Utensils,
  ChevronDown,
  LayoutGrid,
} from 'lucide-react';
import { RestaurantData, MenuThemeConfig, MenuCategory, MenuItem } from '../../../types/menu';
import { toPersianDigits } from '../../../utils/formatters';
import { SafeImage } from '../../common/SafeImage';
import { useMenuViewport } from '../../../context/MenuViewportContext';
import {
  EntranceSection,
  EntranceItem,
  ENTRANCE_DURATION,
  ENTRANCE_EASE,
} from '../../../motion';
import { ModernProductRow } from './ModernProductRow';
import { ProductDetailModal } from '../../common/ProductDetailModal';
import { MenuSelectionBar } from '../../common/MenuSelectionBar';
import { MenuSelectionSheet } from '../../common/MenuSelectionSheet';
import { CategoryBottomSheet } from '../../common/CategoryBottomSheet';
import { ScrollToTopButton } from '../../common/ScrollToTopButton';

interface ModernThemeProps {
  restaurant: RestaurantData;
  config: MenuThemeConfig;
  initialState?: 'hero' | 'menu';
  onStateChange?: (state: 'hero' | 'menu') => void;
  isDashboardPreview?: boolean;
}

export const ModernTheme: React.FC<ModernThemeProps> = ({
  restaurant,
  config,
  initialState = 'hero',
  onStateChange,
  isDashboardPreview = false,
}) => {
  const { scrollToTop } = useMenuViewport();

  // Mode: 'cover' (Menu Booklet Cover & Category Gateway) | 'category' (Category Page Shell)
  const [viewMode, setViewMode] = useState<'cover' | 'category'>(
    initialState === 'menu' ? 'category' : 'cover'
  );

  const [activeCategoryId, setActiveCategoryId] = useState<string>(
    restaurant.categories[0]?.id || ''
  );

  const [selectedPressedId, setSelectedPressedId] = useState<string | null>(null);
  const [selectedProductForDetail, setSelectedProductForDetail] = useState<MenuItem | null>(null);
  const [isCategorySheetOpen, setIsCategorySheetOpen] = useState<boolean>(false);

  // Sync with external state changes (e.g. from toolbar / showcase controls)
  useEffect(() => {
    if (initialState === 'menu' && viewMode !== 'category') {
      setViewMode('category');
    } else if (initialState === 'hero' && viewMode !== 'cover') {
      setViewMode('cover');
    }
  }, [initialState]);

  const activeCategory =
    restaurant.categories.find((c) => c.id === activeCategoryId) ||
    restaurant.categories[0];

  const categoryItems = restaurant.items.filter(
    (item) => item.categoryId === activeCategoryId
  );

  const handleSelectCategory = (categoryId: string) => {
    setSelectedPressedId(categoryId);
    setActiveCategoryId(categoryId);

    // Smooth state transition to category page
    setTimeout(() => {
      setSelectedPressedId(null);
      setViewMode('category');
      onStateChange?.('menu');
      scrollToTop(false);
    }, 120);
  };

  const handleReturnToCover = () => {
    setViewMode('cover');
    onStateChange?.('hero');
    scrollToTop(false);
  };

  const accentColor = config.accentColor || '#0f766e';
  const paperBgColor = config.bgColor || '#FAF8F5';
  const textColor = config.textColor || '#1C1917';

  // Helper to count items per category
  const getCategoryItemCount = (catId: string) => {
    return restaurant.items.filter((item) => item.categoryId === catId).length;
  };

  return (
    <div
      dir="rtl"
      className="min-h-screen w-full relative overflow-x-hidden font-sans selection:bg-stone-200"
      style={{
        backgroundColor: paperBgColor,
        color: textColor,
      }}
    >
      <AnimatePresence mode="wait">
        {viewMode === 'cover' ? (
          /* ================================================================ */
          /* 1. FULL-SCREEN DIGITAL MENU COVER & CATEGORY GATEWAY              */
          /* ================================================================ */
          <motion.div
            key="style2-menu-cover"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{
              opacity: 0,
              y: -12,
              transition: { duration: 0.28, ease: ENTRANCE_EASE },
            }}
            transition={{ duration: 0.3, ease: ENTRANCE_EASE }}
            className="w-full relative flex flex-col justify-between overflow-hidden"
            style={{
              minHeight: 'var(--menu-viewport-height, 100dvh)',
              height: 'var(--menu-viewport-height, 100dvh)',
            }}
          >
            {/* Owner-Uploaded Background Image with Restrained Editorial Wash */}
            <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
              <SafeImage
                src={restaurant.heroImage}
                alt={restaurant.name}
                className="w-full h-full object-cover object-center scale-105"
                fallbackContainerClassName="w-full h-full bg-stone-200"
                fallbackIconClassName="w-12 h-12 text-stone-400"
              />

              {/* Refined Tonal Overlay: Warm Ivory Paper Wash with Gentle Contrast Protection */}
              <div
                className="absolute inset-0"
                style={{
                  background:
                    'linear-gradient(180deg, rgba(250, 248, 245, 0.88) 0%, rgba(245, 240, 230, 0.92) 40%, rgba(250, 248, 245, 0.96) 100%)',
                }}
              />

              {/* Delicate Accent Color Radiance */}
              <div
                className="absolute inset-0 pointer-events-none opacity-20"
                style={{
                  background: `radial-gradient(circle at 50% 20%, ${accentColor} 0%, transparent 70%)`,
                }}
              />
            </div>

            {/* Content Container (Mobile-first, Centered Max-Width Panel on Tablet/Desktop) */}
            <div className="relative z-10 w-full max-w-md md:max-w-lg mx-auto h-full flex flex-col justify-between px-5 py-6 sm:py-8">
              {/* ------------------------------------------------------------ */}
              {/* TOP: RESTAURANT IDENTITY AREA                                */}
              {/* ------------------------------------------------------------ */}
              <EntranceSection className="flex flex-col items-center text-center pt-2 sm:pt-4">
                {/* 1. Robust Logo Container (Handles Square, Circle, Horizontal, Transparent PNG) */}
                <EntranceItem index={0} className="mb-3">
                  <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-white/90 backdrop-blur-md border border-stone-200/90 shadow-sm p-2 flex items-center justify-center mx-auto overflow-hidden">
                    <SafeImage
                      src={restaurant.logo}
                      alt={restaurant.name}
                      className="max-h-full max-w-full object-contain"
                      fallbackContainerClassName="w-full h-full flex items-center justify-center bg-stone-100"
                      fallbackIconClassName="w-6 h-6 text-stone-400"
                    />
                  </div>
                </EntranceItem>

                {/* 2. Restaurant Name & Tagline */}
                <EntranceItem index={1} className="space-y-1.5 px-2">
                  <h1 className="font-bold text-xl sm:text-2xl text-stone-900 tracking-tight leading-tight">
                    {restaurant.name}
                  </h1>

                  {restaurant.tagline && (
                    <p className="text-xs sm:text-sm text-stone-600 font-normal max-w-xs mx-auto line-clamp-2 leading-relaxed">
                      {restaurant.tagline}
                    </p>
                  )}

                  {/* Elegant Editorial Accent Rule */}
                  <div className="pt-2 flex items-center justify-center gap-1.5">
                    <span className="w-6 h-px bg-stone-300" />
                    <span
                      className="w-1.5 h-1.5 rounded-full"
                      style={{ backgroundColor: accentColor }}
                    />
                    <span className="w-6 h-px bg-stone-300" />
                  </div>
                </EntranceItem>
              </EntranceSection>

              {/* ------------------------------------------------------------ */}
              {/* CENTER: CATEGORY GATEWAY (Stacked Vertical Category Rows)    */}
              {/* ------------------------------------------------------------ */}
              <div className="my-auto py-4 w-full flex flex-col">
                <div className="flex items-center justify-between px-1 pb-2.5 mb-1 border-b border-stone-300/60">
                  <span className="text-xs font-semibold text-stone-700 tracking-tight flex items-center gap-1.5">
                    <Layers className="w-3.5 h-3.5" style={{ color: accentColor }} />
                    فهرست دسته‌بندی‌های منو
                  </span>
                  <span className="text-[11px] text-stone-500 font-medium">
                    {toPersianDigits(restaurant.categories.length)} بخش
                  </span>
                </div>

                {/* Vertical Category Stack with Controlled Internal Scroll for Many Categories */}
                <div
                  className="space-y-2.5 overflow-y-auto no-scrollbar max-h-[46vh] sm:max-h-[50vh] py-1 px-0.5"
                  style={{
                    WebkitOverflowScrolling: 'touch',
                  }}
                >
                  <EntranceSection className="space-y-2.5">
                    {restaurant.categories.map((category, idx) => {
                      const itemCount = getCategoryItemCount(category.id);
                      const isPressed = selectedPressedId === category.id;

                      return (
                        <EntranceItem key={category.id} index={2 + idx}>
                          <button
                            type="button"
                            onClick={() => handleSelectCategory(category.id)}
                            className={`w-full min-h-[48px] sm:min-h-[52px] px-4 py-3 rounded-2xl bg-white/92 hover:bg-white active:bg-stone-50 border transition-all duration-150 flex items-center justify-between gap-3 text-right cursor-pointer group shadow-[0_2px_8px_-2px_rgba(0,0,0,0.05)] ${
                              isPressed
                                ? 'scale-[0.985] border-stone-400 bg-stone-100 shadow-inner'
                                : 'border-stone-200/90 hover:border-stone-300'
                            }`}
                            style={{
                              borderColor: isPressed ? accentColor : undefined,
                            }}
                          >
                            {/* Right (RTL): Category Persian Name */}
                            <div className="flex items-center gap-2.5 min-w-0">
                              <span
                                className="w-1.5 h-1.5 rounded-full shrink-0 group-hover:scale-125 transition-transform"
                                style={{ backgroundColor: accentColor }}
                              />
                              <span className="font-semibold text-sm sm:text-base text-stone-800 group-hover:text-stone-950 truncate">
                                {category.name}
                              </span>
                            </div>

                            {/* Left (RTL): Count Indicator & Clean Directional Arrow */}
                            <div className="flex items-center gap-2 shrink-0">
                              <span className="text-xs text-stone-400 group-hover:text-stone-600 font-normal transition-colors whitespace-nowrap">
                                {toPersianDigits(itemCount)} خوراک
                              </span>
                              <div
                                className="w-6 h-6 rounded-full flex items-center justify-center transition-transform group-hover:translate-x-[-3px]"
                                style={{
                                  backgroundColor: `${accentColor}12`,
                                }}
                              >
                                <ChevronLeft
                                  className="w-3.5 h-3.5"
                                  style={{ color: accentColor }}
                                />
                              </div>
                            </div>
                          </button>
                        </EntranceItem>
                      );
                    })}
                  </EntranceSection>
                </div>
              </div>

              {/* ------------------------------------------------------------ */}
              {/* BOTTOM: RESTAURANT INFORMATION & SAFE AREA                   */}
              {/* ------------------------------------------------------------ */}
              <div
                className="pt-2 flex flex-col items-center justify-center text-center"
                style={{
                  paddingBottom: 'max(0.75rem, env(safe-area-inset-bottom, 0px))',
                }}
              >
                <div className="flex items-center gap-3 text-[11px] text-stone-500 font-medium">
                  {restaurant.neighborhood && (
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-stone-400" />
                      {restaurant.neighborhood}
                    </span>
                  )}
                  {restaurant.neighborhood && <span>•</span>}
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3 text-stone-400" />
                    {restaurant.workingHours.split('از')[0] || 'سرویس‌دهی روزانه'}
                  </span>
                </div>
              </div>
            </div>
          </motion.div>
        ) : (
          /* ================================================================ */
          /* 2. STYLE 2 CATEGORY PAGE SHELL (Prompt 1 Scope)                  */
          /* ================================================================ */
          <motion.div
            key="style2-category-page"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{
              opacity: 0,
              y: 12,
              transition: { duration: 0.25, ease: ENTRANCE_EASE },
            }}
            transition={{ duration: 0.3, ease: ENTRANCE_EASE }}
            className="w-full min-h-screen flex flex-col"
          >
            {/* ------------------------------------------------------------ */}
            {/* COMPACT STYLE 2 RESTAURANT HEADER                            */}
            {/* ------------------------------------------------------------ */}
            <header className="sticky top-0 z-30 bg-[#FAF8F5]/95 backdrop-blur-md border-b border-stone-200/90 shadow-sm">
              <div className="max-w-2xl mx-auto px-4 h-14 sm:h-16 flex items-center justify-between gap-3">
                {/* Right (RTL): Restaurant Identity */}
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="w-8 h-8 rounded-xl bg-white border border-stone-200 p-1 flex items-center justify-center shrink-0 shadow-xs">
                    <SafeImage
                      src={restaurant.logo}
                      alt={restaurant.name}
                      className="max-h-full max-w-full object-contain"
                      fallbackContainerClassName="w-full h-full flex items-center justify-center bg-stone-100"
                      fallbackIconClassName="w-4 h-4 text-stone-400"
                    />
                  </div>
                  <div className="min-w-0">
                    <h2 className="font-bold text-xs sm:text-sm text-stone-900 truncate">
                      {restaurant.name}
                    </h2>
                    <p className="text-[10px] text-stone-500 truncate">
                      {restaurant.cuisine.split('،')[0]}
                    </p>
                  </div>
                </div>

                {/* Left (RTL): Header Actions (Categories Sheet Button & Return to Cover) */}
                <div className="flex items-center gap-2 shrink-0">
                  <button
                    type="button"
                    onClick={() => setIsCategorySheetOpen(true)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white hover:bg-stone-100 active:bg-stone-200 border border-stone-200/90 text-xs font-semibold text-stone-700 hover:text-stone-900 shadow-2xs active:scale-95 transition-all cursor-pointer"
                    title="فهرست دسته‌بندی‌ها"
                  >
                    <LayoutGrid className="w-3.5 h-3.5 text-stone-600" />
                    <span className="hidden sm:inline">دسته‌ها</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleReturnToCover}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white hover:bg-stone-100 active:bg-stone-200 border border-stone-200/90 text-xs font-semibold text-stone-700 hover:text-stone-900 shadow-2xs active:scale-95 transition-all cursor-pointer"
                  >
                    <ArrowRight className="w-3.5 h-3.5 text-stone-600" />
                    <span>کاور منو</span>
                  </button>
                </div>
              </div>

              {/* Quick Horizontal Category Switcher Strip */}
              <div className="border-t border-stone-200/60 bg-stone-100/60 overflow-x-auto no-scrollbar py-2 px-4">
                <div className="max-w-2xl mx-auto flex items-center gap-2">
                  {restaurant.categories.map((category) => {
                    const isActive = category.id === activeCategoryId;
                    return (
                      <button
                        key={category.id}
                        type="button"
                        onClick={() => {
                          setActiveCategoryId(category.id);
                          scrollToTop(true);
                        }}
                        className={`px-3.5 py-1 rounded-full text-xs font-medium whitespace-nowrap transition-all cursor-pointer ${
                          isActive
                            ? 'text-white shadow-xs font-semibold'
                            : 'bg-white text-stone-600 hover:text-stone-900 border border-stone-200/80 hover:border-stone-300'
                        }`}
                        style={{
                          backgroundColor: isActive ? accentColor : undefined,
                        }}
                      >
                        {category.name}
                      </button>
                    );
                  })}
                </div>
              </div>
            </header>

            {/* ------------------------------------------------------------ */}
            {/* CATEGORY PAGE CONTENT & EDITORIAL PRODUCT LIST               */}
            {/* ------------------------------------------------------------ */}
            <main
              className="flex-1 max-w-2xl w-full mx-auto px-4 pt-5 pb-24 space-y-4"
              style={{
                paddingBottom: 'calc(96px + env(safe-area-inset-bottom, 0px))',
              }}
            >
              {/* Category Heading & Editorial Header */}
              <div className="border-b border-stone-200/80 pb-3 text-right">
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <span
                      className="w-2.5 h-2.5 rounded-full shrink-0"
                      style={{ backgroundColor: accentColor }}
                    />
                    <h2 className="font-bold text-base sm:text-xl text-stone-900 tracking-tight">
                      {activeCategory.name}
                    </h2>
                  </div>

                  <span
                    className="text-xs px-2.5 py-0.5 rounded-full font-medium whitespace-nowrap"
                    style={{
                      backgroundColor: `${accentColor}15`,
                      color: accentColor,
                    }}
                  >
                    {toPersianDigits(categoryItems.length)} خوراک
                  </span>
                </div>

                {activeCategory.nameEn && (
                  <p
                    className="text-xs text-stone-400 font-sans tracking-wide mt-1 text-right"
                    dir="ltr"
                    style={{ textAlign: 'right' }}
                  >
                    {activeCategory.nameEn}
                  </p>
                )}

                {activeCategory.description && (
                  <p className="text-xs text-stone-600 mt-2 leading-relaxed">
                    {activeCategory.description}
                  </p>
                )}
              </div>

              {/* ------------------------------------------------------------ */}
              {/* PRODUCT ROWS LIST (Style 2 Editorial Menu Presentation)       */}
              {/* ------------------------------------------------------------ */}
              <EntranceSection className="space-y-3 pt-1">
                {categoryItems.map((item) => (
                  <EntranceItem key={item.id}>
                    <ModernProductRow
                      item={item}
                      accentColor={accentColor}
                      onOpenDetail={(product) => setSelectedProductForDetail(product)}
                    />
                  </EntranceItem>
                ))}
              </EntranceSection>

              {/* Bottom Navigation to all categories */}
              <div className="pt-6 pb-4 flex flex-col items-center justify-center gap-3 border-t border-stone-200/80">
                <button
                  type="button"
                  onClick={() => setIsCategorySheetOpen(true)}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-white hover:bg-stone-50 active:bg-stone-100 border border-stone-200 text-xs font-semibold text-stone-700 shadow-2xs cursor-pointer transition-all active:scale-98"
                >
                  <Layers className="w-4 h-4 text-stone-600" />
                  <span>مشاهده همه دسته‌بندی‌های منو</span>
                </button>

                <p className="text-[11px] text-stone-400">
                  {restaurant.name} — ارائه منوی دیجیتال
                </p>
              </div>
            </main>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ================================================================== */}
      {/* SHARED OVERLAYS & MODALS (Style 2 Editorial Look)                 */}
      {/* ================================================================== */}

      {/* 1. Product Detail Modal */}
      <ProductDetailModal
        isOpen={!!selectedProductForDetail}
        onClose={() => setSelectedProductForDetail(null)}
        item={selectedProductForDetail}
        accentColor={accentColor}
        themeId="modern"
      />

      {/* 2. Category Switcher Bottom Sheet */}
      <CategoryBottomSheet
        isOpen={isCategorySheetOpen}
        onClose={() => setIsCategorySheetOpen(false)}
        categories={restaurant.categories}
        items={restaurant.items}
        activeCategoryId={activeCategoryId}
        onSelectCategory={(catId) => {
          setActiveCategoryId(catId);
          scrollToTop(true);
        }}
        accentColor={accentColor}
        themeId="modern"
      />

      {/* 3. Floating Selection Sticky Bar */}
      <MenuSelectionBar
        accentColor={accentColor}
        themeId="modern"
      />

      {/* 4. Selection Items Drawer / Sheet */}
      <MenuSelectionSheet
        accentColor={accentColor}
        themeId="modern"
      />

      {/* 5. Scroll to Top Floating Button */}
      <ScrollToTopButton
        accentColor={accentColor}
        themeId="modern"
      />
    </div>
  );
};
