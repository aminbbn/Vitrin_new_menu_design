import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowRight,
  Layers,
  Search,
  X,
  Sparkles,
  Utensils,
  MapPin,
  Clock,
  Phone,
  Info,
  ChevronLeft,
} from 'lucide-react';
import { RestaurantData, MenuThemeConfig, MenuCategory, MenuItem } from '../../../types/menu';
import { toPersianDigits } from '../../../utils/formatters';
import { useMenuViewport } from '../../../context/MenuViewportContext';
import { getContrastForeground } from '../../../utils/themeColors';
import { SafeImage } from '../../common/SafeImage';
import { EntranceSection, EntranceItem } from '../../../motion';
import { CategoryGalleryCard } from './CategoryGalleryCard';
import { VisualProductItem } from './VisualProductItem';
import { getCategoryDisplayImage } from './categoryImageUtils';
import { ScrollToTopButton } from '../../common/ScrollToTopButton';
import { RestaurantInfoModal } from '../../common/RestaurantInfoModal';
import { ProductDetailModal } from '../../common/ProductDetailModal';
import { MenuSelectionBar } from '../../common/MenuSelectionBar';
import { MenuSelectionSheet } from '../../common/MenuSelectionSheet';

interface MinimalThemeProps {
  restaurant: RestaurantData;
  config: MenuThemeConfig;
  initialState?: 'hero' | 'menu';
  onStateChange?: (state: 'hero' | 'menu') => void;
  isDashboardPreview?: boolean;
}

export const MinimalTheme: React.FC<MinimalThemeProps> = ({
  restaurant,
  config,
  initialState = 'hero',
  onStateChange,
  isDashboardPreview = false,
}) => {
  const { scrollToTop } = useMenuViewport();
  const primaryColor = config.primaryColor || config.accentColor || '#38bdf8';
  const secondaryColor = config.secondaryColor || '#f59e0b';
  const primaryFg = getContrastForeground(primaryColor);
  const accentColor = primaryColor;

  // Navigation state: 'gallery' (visual category explorer landing) vs 'category' (image-led product feed)
  const [viewState, setViewState] = useState<'gallery' | 'category'>(
    initialState === 'menu' ? 'category' : 'gallery'
  );

  const [selectedCategoryId, setSelectedCategoryId] = useState<string>(
    restaurant.categories[0]?.id || ''
  );

  // Modal / Overlay states
  const [selectedProduct, setSelectedProduct] = useState<MenuItem | null>(null);
  const [isInfoModalOpen, setIsInfoModalOpen] = useState(false);

  // Search state within category view
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  // Sync external state changes
  useEffect(() => {
    if (initialState === 'menu' && viewState !== 'category') {
      setViewState('category');
    } else if (initialState === 'hero' && viewState !== 'gallery') {
      setViewState('gallery');
    }
  }, [initialState]);

  const handleSelectCategory = (categoryId: string) => {
    setSelectedCategoryId(categoryId);
    setViewState('category');
    setSearchQuery('');
    setIsSearchOpen(false);
    onStateChange?.('menu');
    scrollToTop(false);
  };

  const handleReturnToGallery = () => {
    setViewState('gallery');
    setSearchQuery('');
    setIsSearchOpen(false);
    onStateChange?.('hero');
    scrollToTop(false);
  };

  const handleOpenProductDetail = (item: MenuItem) => {
    setSelectedProduct(item);
  };

  const handleCloseProductDetail = () => {
    setSelectedProduct(null);
  };

  const activeCategory: MenuCategory =
    restaurant.categories.find((c) => c.id === selectedCategoryId) ||
    restaurant.categories[0] || {
      id: 'default',
      name: 'منوی رستوران',
    };

  const categoryItems: MenuItem[] = useMemo(() => {
    return restaurant.items.filter((item) => item.categoryId === activeCategory.id);
  }, [restaurant.items, activeCategory.id]);

  // Filter items if searching
  const displayItems: MenuItem[] = useMemo(() => {
    if (!searchQuery.trim()) {
      return categoryItems;
    }
    const query = searchQuery.trim().toLowerCase();
    // Search within current category first, or fallback to all items matching query
    const matchingInCategory = categoryItems.filter(
      (item) =>
        item.name.toLowerCase().includes(query) ||
        (item.nameEn && item.nameEn.toLowerCase().includes(query)) ||
        (item.description && item.description.toLowerCase().includes(query))
    );
    if (matchingInCategory.length > 0) {
      return matchingInCategory;
    }
    // If no matches in current category, search across all restaurant items
    return restaurant.items.filter(
      (item) =>
        item.name.toLowerCase().includes(query) ||
        (item.nameEn && item.nameEn.toLowerCase().includes(query)) ||
        (item.description && item.description.toLowerCase().includes(query))
    );
  }, [categoryItems, restaurant.items, searchQuery]);

  const isGlobalSearchResult =
    searchQuery.trim().length > 0 &&
    displayItems.length > 0 &&
    displayItems.some((item) => item.categoryId !== activeCategory.id);

  const activeCategoryHeaderImage = getCategoryDisplayImage(
    activeCategory,
    restaurant.items,
    restaurant.heroImage
  );

  return (
    <div
      id="vitrin-style-03-visual-explorer"
      className="relative min-h-full w-full bg-[#0d0f12] text-neutral-100 flex flex-col selection:bg-white/20 selection:text-white"
      dir="rtl"
    >
      <AnimatePresence mode="wait" initial={false}>
        {viewState === 'gallery' ? (
          /* ================================================================ */
          /* 1. VISUAL CATEGORY EXPLORER (LANDING VIEW)                       */
          /* ================================================================ */
          <motion.div
            key="visual-gallery-landing"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="w-full flex-1 flex flex-col"
          >
            {/* 1.1 Top Restaurant Hero (Target ~30-36% Viewport Height) */}
            <header className="relative w-full h-[32vh] min-h-[220px] max-h-[340px] sm:h-[36vh] sm:max-h-[380px] overflow-hidden bg-neutral-950">
              <SafeImage
                src={restaurant.heroImage}
                alt={restaurant.name}
                className={`w-full h-full object-cover ${
                  config.minimalSettings?.focalPosition === 'top'
                    ? 'object-top'
                    : config.minimalSettings?.focalPosition === 'bottom'
                    ? 'object-bottom'
                    : 'object-center'
                }`}
                fallbackContainerClassName="w-full h-full bg-neutral-900"
                fallbackIconClassName="w-12 h-12 text-neutral-600"
                priority
              />

              {/* Natural Photography Treatment: Gentle Vignette & Bottom Wash */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#0d0f12] via-black/25 to-black/30 pointer-events-none" />

              {/* Top Quick Actions (Info Trigger) */}
              <div className="absolute top-4 left-4 sm:top-5 sm:left-5 z-20">
                <button
                  type="button"
                  id="gallery-info-modal-btn"
                  onClick={() => setIsInfoModalOpen(true)}
                  className="w-9 h-9 rounded-full bg-black/40 hover:bg-black/60 active:scale-95 backdrop-blur-md border border-white/20 text-white flex items-center justify-center transition-all cursor-pointer shadow-lg"
                  aria-label="اطلاعات رستوران"
                  title="اطلاعات و تماس"
                >
                  <Info className="w-4 h-4" />
                </button>
              </div>
            </header>

            {/* 1.2 Restaurant Identity Section (Horizontal Alignment on Mobile & Desktop) */}
            <EntranceSection className="w-full max-w-4xl mx-auto px-4 sm:px-6 -mt-8 sm:-mt-10 relative z-10 space-y-4">
              <EntranceItem index={0}>
                <div className="flex items-center gap-2.5 sm:gap-3.5 pb-2">
                  {/* Logo Container (60-68px at mobile) */}
                  <div className="w-[60px] h-[60px] sm:w-[68px] sm:h-[68px] md:w-20 md:h-20 rounded-2xl p-1.5 bg-[#16181d] border border-white/15 shadow-xl shrink-0 flex items-center justify-center overflow-hidden">
                    <SafeImage
                      src={restaurant.logo}
                      alt={restaurant.name}
                      className="max-h-full max-w-full object-contain"
                      fallbackContainerClassName="w-full h-full flex items-center justify-center bg-neutral-800"
                      fallbackIconClassName="w-6 h-6 text-neutral-500"
                    />
                  </div>

                  {/* Name & Single Tagline Description (No truncation, fluid single-line font scaling, no cuisine chip) */}
                  <div className="min-w-0 flex-1 space-y-1 text-right">
                    <h1
                      className="font-bold text-white tracking-tight leading-snug whitespace-nowrap"
                      style={{
                        fontSize: 'clamp(15px, 4.2vw, 24px)',
                      }}
                    >
                      {restaurant.name}
                    </h1>

                    {restaurant.tagline && (
                      <p className="text-[11px] sm:text-xs md:text-sm text-neutral-400 font-light leading-relaxed max-w-xl line-clamp-2">
                        {restaurant.tagline}
                      </p>
                    )}
                  </div>
                </div>
              </EntranceItem>

              {/* 1.3 Photographic Category Gallery (Clean 2-col on Mobile = 3x2 Grid for 6 categories) */}
              <div className="pt-2 pb-16 space-y-3 sm:space-y-4">
                <div className="flex items-center justify-start pb-1 text-right">
                  <div className="flex items-center gap-2">
                    <span
                      className="w-2 h-2 rounded-full shrink-0"
                      style={{ backgroundColor: primaryColor }}
                    />
                    <h2 className="font-bold text-sm sm:text-base text-neutral-200 tracking-tight">
                      دسته‌بندی‌های منو
                    </h2>
                  </div>
                </div>

                {/* Strict 2-column grid: flows naturally into as many rows as needed */}
                <div className="grid grid-cols-2 gap-2.5 sm:gap-3.5">
                  {restaurant.categories.map((category, index) => (
                    <EntranceItem key={category.id} index={index + 1}>
                      <CategoryGalleryCard
                        category={category}
                        items={restaurant.items}
                        restaurantHeroImage={restaurant.heroImage}
                        accentColor={primaryColor}
                        primaryColor={primaryColor}
                        secondaryColor={secondaryColor}
                        gradientStrength={config.minimalSettings?.gradientStrength}
                        onSelect={handleSelectCategory}
                        index={index}
                      />
                    </EntranceItem>
                  ))}
                </div>

                {/* Footer Brand Note */}
                <div className="pt-10 pb-6 text-center space-y-2 border-t border-white/5">
                  <p className="text-xs text-neutral-400 font-light">
                    {restaurant.name} — کاوشگر تصویری منو
                  </p>
                  {restaurant.address && (
                    <p className="text-[11px] text-neutral-500 max-w-md mx-auto truncate">
                      {restaurant.address}
                    </p>
                  )}
                </div>
              </div>
            </EntranceSection>
          </motion.div>
        ) : (
          /* ================================================================ */
          /* 2. IMAGE-LED CATEGORY PAGE (PROMPT 2 PRODUCT BROWSING)           */
          /* ================================================================ */
          <motion.div
            key={`category-page-${activeCategory.id}`}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="w-full flex-1 flex flex-col"
          >
            {/* 2.1 Top Sticky Navigation Bar */}
            <header className="sticky top-0 z-30 w-full bg-[#0d0f12]/95 backdrop-blur-md border-b border-white/10 px-4 py-3">
              <div className="max-w-4xl mx-auto flex items-center justify-between gap-3">
                {/* Right (RTL): Restaurant Identity & Category Indicator */}
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="w-8 h-8 rounded-xl bg-neutral-900 border border-white/10 p-1 flex items-center justify-center shrink-0 overflow-hidden">
                    <SafeImage
                      src={restaurant.logo}
                      alt={restaurant.name}
                      className="max-h-full max-w-full object-contain"
                      fallbackContainerClassName="w-full h-full bg-neutral-800"
                      fallbackIconClassName="w-3.5 h-3.5 text-neutral-500"
                    />
                  </div>
                  <div className="min-w-0">
                    <h2 className="font-bold text-xs sm:text-sm text-white truncate">
                      {restaurant.name}
                    </h2>
                    <p className="text-[10px] text-neutral-400 truncate">
                      {activeCategory.name}
                    </p>
                  </div>
                </div>

                {/* Left (RTL): Quick Actions (Search, Return to Gallery) */}
                <div className="flex items-center gap-2 shrink-0">
                  {/* Search Toggle */}
                  <button
                    type="button"
                    id="toggle-search-btn"
                    onClick={() => setIsSearchOpen((prev) => !prev)}
                    className={`w-8 h-8 rounded-xl flex items-center justify-center transition-all cursor-pointer ${
                      isSearchOpen || searchQuery
                        ? 'bg-white/20 text-white border border-white/30'
                        : 'bg-white/5 hover:bg-white/10 text-neutral-300 border border-white/10'
                    }`}
                    aria-label="جستجو در منو"
                    title="جستجو"
                  >
                    <Search className="w-4 h-4" />
                  </button>

                  {/* Return to Gallery Button */}
                  <button
                    type="button"
                    id="return-to-visual-gallery-btn"
                    onClick={handleReturnToGallery}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/15 active:bg-white/20 border border-white/15 text-xs font-semibold text-white shadow-xs active:scale-95 transition-all cursor-pointer"
                  >
                    <ArrowRight className="w-3.5 h-3.5 text-neutral-300" />
                    <span>گالری</span>
                  </button>
                </div>
              </div>

              {/* Expandable Search Input Bar */}
              <AnimatePresence>
                {(isSearchOpen || searchQuery) && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.2 }}
                    className="max-w-4xl mx-auto pt-2.5 overflow-hidden"
                  >
                    <div className="relative flex items-center">
                      <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder={`جستجو در خوراک‌های ${restaurant.name}...`}
                        className="w-full bg-[#16191f] border border-white/15 rounded-xl px-9 py-2 text-xs text-white placeholder-neutral-500 focus:outline-hidden focus:border-white/30 transition-all text-right"
                        dir="rtl"
                        autoFocus={isSearchOpen && !searchQuery}
                      />
                      <Search className="w-4 h-4 text-neutral-500 absolute right-3 pointer-events-none" />
                      {searchQuery && (
                        <button
                          type="button"
                          onClick={() => setSearchQuery('')}
                          className="w-5 h-5 rounded-full bg-white/10 hover:bg-white/20 text-neutral-300 flex items-center justify-center absolute left-3 cursor-pointer"
                          aria-label="پاک کردن جستجو"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </header>

            {/* 2.2 Category Visual Header (Compact ~180-220px Height) */}
            <div className="relative w-full h-44 sm:h-52 md:h-60 overflow-hidden bg-neutral-950">
              <SafeImage
                src={activeCategoryHeaderImage}
                alt={activeCategory.name}
                className="w-full h-full object-cover object-center"
                fallbackContainerClassName="w-full h-full bg-neutral-900"
                fallbackIconClassName="w-10 h-10 text-neutral-600"
                priority
              />

              {/* Natural Scrim Gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#0d0f12] via-black/40 to-transparent pointer-events-none" />

              {/* Category Title & Info Overlay */}
              <div className="absolute inset-x-0 bottom-0 max-w-4xl mx-auto p-4 sm:p-6 flex items-end justify-between gap-3 z-10">
                <div className="space-y-1 text-right">
                  <h1 className="font-bold text-xl sm:text-2xl md:text-3xl text-white tracking-tight drop-shadow-sm">
                    {activeCategory.name}
                  </h1>

                  {activeCategory.description ? (
                    <p className="text-xs sm:text-sm text-neutral-300/90 font-light max-w-lg leading-relaxed">
                      {activeCategory.description}
                    </p>
                  ) : activeCategory.nameEn ? (
                    <p className="text-xs text-neutral-300/80 font-normal tracking-wide">
                      {activeCategory.nameEn}
                    </p>
                  ) : null}
                </div>

                <span className="shrink-0 px-3 py-1 rounded-full text-xs font-medium bg-black/60 text-white/90 backdrop-blur-md border border-white/15">
                  {toPersianDigits(categoryItems.length)} خوراک
                </span>
              </div>
            </div>

            {/* 2.3 Image-Led Product Feed (Main Content) */}
            <main
              className="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-6 pt-6 pb-24 space-y-6"
              style={{
                paddingBottom: 'calc(80px + var(--vitrin-selection-bar-height, 0px) + env(safe-area-inset-bottom, 0px))',
              }}
            >
              {/* Search Result Subtitle (If searching) */}
              {searchQuery.trim() && (
                <div className="flex items-center justify-between pb-2 border-b border-white/10 text-xs">
                  <span className="text-neutral-400">
                    نتایج جستجو برای «<strong className="text-white">{searchQuery}</strong>»
                    {isGlobalSearchResult && ' (در تمام منو)'}
                  </span>
                  <span className="text-neutral-500">
                    {toPersianDigits(displayItems.length)} مورد
                  </span>
                </div>
              )}

              {/* Product Feed Grid */}
              {displayItems.length === 0 ? (
                <div className="py-16 text-center space-y-3 bg-[#14171c] rounded-2xl border border-white/10 p-6">
                  <div className="w-12 h-12 rounded-2xl mx-auto flex items-center justify-center bg-white/5 text-neutral-400">
                    <Utensils className="w-6 h-6" />
                  </div>
                  <h3 className="font-semibold text-sm sm:text-base text-white">
                    موردی یافت نشد
                  </h3>
                  <p className="text-xs text-neutral-400 max-w-xs mx-auto">
                    {searchQuery
                      ? 'خوراکی با این عنوان در این بخش یافت نشد.'
                      : 'در حال حاضر خوراکی در این دسته‌بندی تعریف نشده است.'}
                  </p>
                  {searchQuery && (
                    <button
                      type="button"
                      onClick={() => setSearchQuery('')}
                      className="px-4 py-1.5 rounded-xl bg-white/10 hover:bg-white/15 text-xs text-white border border-white/15 cursor-pointer"
                    >
                      پاک کردن جستجو
                    </button>
                  )}
                </div>
              ) : (
                <EntranceSection className="w-full">
                  {/* Editorial Layout: 1 col on mobile, 2 cols on tablet/desktop */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
                    {displayItems.map((item, index) => (
                      <EntranceItem key={item.id} index={index}>
                        <VisualProductItem
                          item={item}
                          accentColor={primaryColor}
                          primaryColor={primaryColor}
                          secondaryColor={secondaryColor}
                          onSelect={handleOpenProductDetail}
                          index={index}
                        />
                      </EntranceItem>
                    ))}
                  </div>
                </EntranceSection>
              )}

              {/* Category Quick Navigation & Footer Navigation */}
              <div className="pt-8 pb-4 space-y-6">
                {/* Horizontal Category Switcher Pills */}
                <div className="space-y-2 text-right">
                  <span className="text-xs text-neutral-400 font-light">
                    کاوش سایر بخش‌ها:
                  </span>
                  <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
                    {restaurant.categories.map((cat) => {
                      const isCurrent = cat.id === activeCategory.id;
                      return (
                        <button
                          key={cat.id}
                          type="button"
                          onClick={() => handleSelectCategory(cat.id)}
                          className={`shrink-0 px-3.5 py-1.5 rounded-xl text-xs font-medium border transition-all cursor-pointer whitespace-nowrap active:scale-95 ${
                            isCurrent
                              ? 'shadow-xs font-semibold'
                              : 'bg-[#16191f] text-neutral-300 hover:text-white border-white/10 hover:bg-white/10'
                          }`}
                          style={
                            isCurrent
                              ? {
                                  backgroundColor: primaryColor,
                                  borderColor: primaryColor,
                                  color: primaryFg,
                                }
                              : undefined
                          }
                        >
                          {cat.name}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Return to Full Category Gallery CTA */}
                <div className="pt-4 flex justify-center">
                  <button
                    type="button"
                    onClick={handleReturnToGallery}
                    className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-white/10 hover:bg-white/15 active:bg-white/20 border border-white/15 text-xs sm:text-sm font-semibold text-white shadow-md active:scale-98 transition-all cursor-pointer"
                  >
                    <Layers className="w-4 h-4 text-neutral-300" />
                    <span>مشاهده تمام دسته‌بندی‌ها در گالری</span>
                  </button>
                </div>

                {/* Footer Brand & Restaurant Info */}
                <div className="pt-8 text-center space-y-2 border-t border-white/5">
                  <p className="text-xs text-neutral-400 font-light">
                    {restaurant.name} — منوی دیجیتال
                  </p>
                  {restaurant.address && (
                    <p className="text-[11px] text-neutral-500 max-w-md mx-auto truncate">
                      {restaurant.address}
                    </p>
                  )}
                </div>
              </div>
            </main>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Menu Selection Bar (Style 3) */}
      <MenuSelectionBar
        accentColor={primaryColor}
        primaryColor={primaryColor}
        secondaryColor={secondaryColor}
        themeId="minimal"
      />

      {/* Menu Selection Bottom Sheet (Style 3) */}
      <MenuSelectionSheet
        accentColor={primaryColor}
        primaryColor={primaryColor}
        secondaryColor={secondaryColor}
        themeId="minimal"
      />

      {/* Floating Scroll to Top Button */}
      <ScrollToTopButton
        accentColor={primaryColor}
        primaryColor={primaryColor}
        secondaryColor={secondaryColor}
        themeId="minimal"
      />

      {/* Product Detail Modal / Sheet */}
      <ProductDetailModal
        item={selectedProduct}
        onClose={handleCloseProductDetail}
        accentColor={primaryColor}
        primaryColor={primaryColor}
        secondaryColor={secondaryColor}
        themeId="minimal"
      />

      {/* Restaurant Info Modal */}
      <RestaurantInfoModal
        isOpen={isInfoModalOpen}
        onClose={() => setIsInfoModalOpen(false)}
        restaurant={restaurant}
        accentColor={primaryColor}
      />
    </div>
  );
};
