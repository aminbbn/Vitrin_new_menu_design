import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sparkles,
  ChevronDown,
  Search,
  Plus,
  Minus,
  Trash2,
  RotateCcw,
  Info,
  Clock,
  MapPin,
  Layers,
} from 'lucide-react';
import { RestaurantData, MenuThemeConfig, MenuItem } from '../../../types/menu';
import { formatToman, toPersianDigits } from '../../../utils/formatters';
import { ProductDetailModal } from '../../common/ProductDetailModal';
import { RestaurantInfoModal } from '../../common/RestaurantInfoModal';
import { CategoryBottomSheet } from '../../common/CategoryBottomSheet';
import { MenuSelectionBar } from '../../common/MenuSelectionBar';
import { MenuSelectionSheet } from '../../common/MenuSelectionSheet';
import { AmbientBackground } from '../../common/AmbientBackground';
import { ScrollToTopButton } from '../../common/ScrollToTopButton';
import { useMenuSelection } from '../../../context/MenuSelectionContext';
import { useMenuViewport } from '../../../context/MenuViewportContext';
import { useHeroTransition } from '../../../hooks/useHeroTransition';
import { EntranceSection, EntranceItem } from '../../../motion';
import { HeroInfoPills } from '../../common/HeroInfoPills';
import { SafeImage } from '../../common/SafeImage';

interface ImmersiveThemeProps {
  restaurant: RestaurantData;
  config: MenuThemeConfig;
  initialState?: 'hero' | 'menu';
  onStateChange?: (state: 'hero' | 'menu') => void;
  isDashboardPreview?: boolean;
}

export const ImmersiveTheme: React.FC<ImmersiveThemeProps> = ({
  restaurant,
  config,
  initialState = 'hero',
  onStateChange,
  isDashboardPreview = false,
}) => {
  const transitionDuration = (config.hero?.transitionDurationMs || 750) / 1000;
  const { viewState, isMenuMode, enterMenu, returnToHero } = useHeroTransition({
    initialState,
    onStateChange,
    transitionDurationMs: config.hero?.transitionDurationMs || 750,
  });

  const { getScrollContainer, scrollToElement, viewportWidth } = useMenuViewport();
  const isWideLayout = viewportWidth > 0 ? viewportWidth >= 768 : false;

  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);
  const [isInfoOpen, setIsInfoOpen] = useState(false);
  const [isCategorySheetOpen, setIsCategorySheetOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState<string>(restaurant.categories[0]?.id || '');
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearch, setShowSearch] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);

  // Category Intersection Observer for scroll tracking
  useEffect(() => {
    if (!isMenuMode) return;

    const observerCallback: IntersectionObserverCallback = (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const categoryId = entry.target.getAttribute('data-category-id');
          if (categoryId) {
            setActiveCategory(categoryId);
          }
        }
      });
    };

    const container = getScrollContainer();
    const observer = new IntersectionObserver(observerCallback, {
      root: container === window ? null : (container as HTMLElement),
      rootMargin: '-80px 0px -60% 0px',
      threshold: 0.1,
    });

    restaurant.categories.forEach((cat) => {
      const el = document.getElementById(`cat-section-${cat.id}`);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [isMenuMode, restaurant.categories, getScrollContainer]);

  const handleCategoryClick = (catId: string) => {
    setActiveCategory(catId);
    scrollToElement(`cat-section-${catId}`, 75);
  };

  const filteredItems = restaurant.items.filter((item) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      item.name.toLowerCase().includes(q) ||
      (item.nameEn && item.nameEn.toLowerCase().includes(q)) ||
      item.description.toLowerCase().includes(q)
    );
  });

  const featuredItems = restaurant.items.filter((item) => item.isFeatured);
  const activeCategoryObj = restaurant.categories.find((c) => c.id === activeCategory);

  return (
    <div
      ref={containerRef}
      dir="rtl"
      className="min-h-screen bg-[#070b0e] text-neutral-100 font-sans relative selection:bg-amber-500/20"
      style={{
        backgroundColor: config.bgColor || '#070b0e',
        color: config.textColor,
      }}
    >
      {/* Ambient Animated Atmospheric Glow Layer */}
      <AmbientBackground theme="immersive" accentColor={config.accentColor} />

      {/* ------------------------------------------------------------------ */}
      {/* 1. CONTINUOUS HERO SURFACE (Moves upward like a curtain/shutter)    */}
      {/* ------------------------------------------------------------------ */}
      <motion.div
        layout
        initial={false}
        animate={{
          height: isMenuMode ? '250px' : 'var(--menu-viewport-height, 100dvh)',
        }}
        transition={{
          duration: transitionDuration,
          ease: [0.22, 1, 0.36, 1], // Smooth weighted physical easing
        }}
        className="relative z-10 w-full overflow-hidden flex flex-col justify-between"
      >
        {/* Continuous Photographic Background Layer (Always the same image, cropped smoothly) */}
        <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
          <img
            src={restaurant.heroImage}
            alt={restaurant.name}
            className="w-full h-full object-cover object-center filter brightness-[0.75] transition-all duration-700"
          />
          {/* Rich cinematic vignette gradients */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#090d12] via-[#090d12]/50 to-black/40" />
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-[#090d12]" />
        </div>

        {/* Top Hero Brand Header (Anchored identity in both full and short hero) */}
        <EntranceItem index={0} className="relative z-10 w-full px-4 sm:px-6 pt-4 sm:pt-5 max-w-2xl mx-auto flex items-center justify-between">
          {/* Restaurant Identity */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl overflow-hidden p-0.5 border border-amber-500/40 bg-black/60 backdrop-blur-md shadow-xl flex-shrink-0">
              <img
                src={restaurant.logo}
                alt={restaurant.name}
                className="w-full h-full object-cover rounded-xl"
              />
            </div>

            <div>
              <h1 className="font-bold text-amber-300 tracking-tight text-base sm:text-lg whitespace-nowrap">
                {restaurant.name}
              </h1>
              <p className="text-[11px] sm:text-xs text-neutral-300 font-light whitespace-nowrap">
                {restaurant.cuisine}
              </p>
            </div>
          </div>

          {/* Top Actions: Info icon button */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsInfoOpen(true)}
              id="hero-info-btn"
              className="w-9 h-9 rounded-full bg-black/60 backdrop-blur-md border border-white/15 text-neutral-200 flex items-center justify-center hover:bg-white/10 active:scale-95 transition-all cursor-pointer shadow-lg shrink-0"
              aria-label="اطلاعات رستوران"
            >
              <Info className="w-4 h-4 text-amber-300" />
            </button>
          </div>
        </EntranceItem>

        {/* Center Intro Editorial Content (Independently Centered at 50% of Hero Viewport) */}
        <AnimatePresence>
          {!isMenuMode && (
            <motion.div
              key="hero-center-content"
              initial={{ opacity: 1, y: 0 }}
              exit={{
                opacity: 0,
                y: -40,
                transition: { duration: 0.35, ease: [0.22, 1, 0.36, 1] },
              }}
              transition={{ duration: 0.45 }}
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-lg px-5 z-10 flex flex-col items-center text-center space-y-3.5 pointer-events-auto"
            >
              {/* Gold Ornament Divider */}
              <EntranceItem index={1} className="flex items-center gap-2 text-amber-400 text-xs tracking-widest">
                <span className="w-6 h-[1px] bg-amber-400/40" />
                <span className="inline-flex items-center gap-1.5 font-semibold">
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  منوی دیجیتال
                </span>
                <span className="w-6 h-[1px] bg-amber-400/40" />
              </EntranceItem>

              {/* Main Headline with intentional line layout */}
              <EntranceItem index={2} as="h2" className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white leading-snug tracking-tight max-w-sm sm:max-w-md">
                {config.hero.headline}
              </EntranceItem>

              {/* Sub-headline */}
              <EntranceItem index={3} as="p" className="text-xs sm:text-sm text-neutral-300 max-w-xs sm:max-w-sm leading-relaxed font-light">
                {config.hero.subheadline}
              </EntranceItem>

              {/* Interactive Expandable Information Pills (Equal default frames, click to expand full line) */}
              <EntranceItem index={4} className="w-full pt-1">
                <HeroInfoPills
                  workingHours={restaurant.workingHours}
                  location={restaurant.neighborhood}
                  themeId="immersive"
                />
              </EntranceItem>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Lower CTA Button Container (Independently Anchored Near Bottom Portion) */}
        <AnimatePresence>
          {!isMenuMode && (
            <motion.div
              key="hero-bottom-cta"
              initial={{ opacity: 1, y: 0 }}
              exit={{
                opacity: 0,
                y: 30,
                transition: { duration: 0.3, ease: [0.22, 1, 0.36, 1] },
              }}
              transition={{ duration: 0.45 }}
              className="absolute bottom-6 sm:bottom-9 left-1/2 -translate-x-1/2 w-full max-w-xs px-4 z-10 flex flex-col items-center pointer-events-auto"
            >
              <EntranceItem index={5} className="w-full">
                <motion.button
                  whileTap={{ scale: 0.97 }}
                  onClick={() => enterMenu('cta')}
                  id="enter-menu-hero-btn"
                  className="w-full min-h-[48px] py-3.5 px-6 rounded-2xl bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 hover:from-amber-400 hover:to-amber-300 text-neutral-950 font-bold text-sm sm:text-base shadow-[0_12px_32px_rgba(212,175,55,0.35)] active:scale-[0.98] transition-all flex items-center justify-center gap-2 group cursor-pointer whitespace-nowrap"
                >
                  <span className="whitespace-nowrap">{config.hero.ctaText}</span>
                  <ChevronDown className="w-4 h-4 group-hover:translate-y-0.5 transition-transform" />
                </motion.button>
              </EntranceItem>

              {/* Hint */}
              <EntranceItem index={6} className="text-neutral-400 text-[11px] font-light mt-2.5 whitespace-nowrap">
                جهت مرور خوراک‌ها و ثبت انتخاب دکمه را لمس یا به پایین اسکرول کنید
              </EntranceItem>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Bottom Bar in Collapsed Short Hero State (Balanced Grid, No 2-line wraps) */}
        {isMenuMode && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.4 }}
            className="relative z-10 w-full px-4 sm:px-6 pb-3.5 max-w-2xl mx-auto grid grid-cols-[minmax(0,1fr)_auto] gap-2 items-center text-xs text-neutral-300 border-t border-white/10 pt-2"
          >
            <div className="flex items-center gap-2 font-medium min-w-0">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shrink-0" />
              <span className="truncate whitespace-nowrap">پذیرایی حضوری • {toPersianDigits(restaurant.workingHours)}</span>
            </div>
            <div className="text-amber-300/90 font-medium shrink-0 whitespace-nowrap">
              {toPersianDigits(restaurant.categories.length)} دسته‌بندی
            </div>
          </motion.div>
        )}
      </motion.div>

      {/* ------------------------------------------------------------------ */}
      {/* 2. STICKY CATEGORY NAVIGATOR & SEARCH (Directly below short hero)  */}
      {/* ------------------------------------------------------------------ */}
      <div className="sticky top-0 z-30 bg-[#090d12]/95 backdrop-blur-xl border-y border-neutral-800/80 shadow-xl transition-all">
        <div className="max-w-2xl mx-auto px-4 py-2.5 flex items-center justify-between gap-3">
          {/* Compact Category Trigger */}
          <button
            onClick={() => setIsCategorySheetOpen(true)}
            id="immersive-category-capsule-btn"
            className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-bold bg-amber-500/15 text-amber-300 border border-amber-500/30 hover:bg-amber-500/25 active:scale-95 transition-all cursor-pointer shadow-sm"
          >
            <Layers className="w-3.5 h-3.5 text-amber-400" />
            <span>دسته‌بندی: {activeCategoryObj?.name || 'همه دسته‌ها'}</span>
            <ChevronDown className="w-3.5 h-3.5" />
          </button>

          {/* Search Toggle */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowSearch(!showSearch)}
              className={`w-8 h-8 rounded-xl flex items-center justify-center transition-colors cursor-pointer ${
                showSearch ? 'bg-amber-500 text-black' : 'bg-neutral-900 border border-neutral-800 text-neutral-300 hover:text-white'
              }`}
              aria-label="جستجو در منو"
            >
              <Search className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Expandable Search Input */}
        <AnimatePresence>
          {showSearch && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="px-4 pb-3 max-w-2xl mx-auto w-full"
            >
              <div className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="جستجوی نام غذا، نوشیدنی، ترکیبات..."
                  className="w-full bg-neutral-900 border border-neutral-700 rounded-xl px-4 py-2.5 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-amber-500"
                  autoFocus
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute left-3 top-2.5 text-xs text-neutral-400 hover:text-white"
                  >
                    پاک کردن
                  </button>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ------------------------------------------------------------------ */}
      {/* 3. MENU CONTENT STREAM (Revealed from underneath in document flow) */}
      {/* ------------------------------------------------------------------ */}
      <main className="max-w-2xl mx-auto w-full px-4 pt-6 space-y-10 pb-28">
        {/* If search query is active */}
        {searchQuery ? (
          <EntranceSection className="space-y-4">
            <EntranceItem index={0} as="h2" className="text-sm font-semibold text-neutral-400">
              نتایج جستجو برای «{searchQuery}» ({toPersianDigits(filteredItems.length)} مورد)
            </EntranceItem>
            {filteredItems.length === 0 ? (
              <EntranceItem index={1} className="text-center py-12 bg-neutral-900/50 rounded-2xl border border-neutral-800 p-6">
                <p className="text-sm text-neutral-400">موردی با این مشخصات در منو یافت نشد.</p>
              </EntranceItem>
            ) : (
              <div className="grid grid-cols-1 gap-3.5">
                {filteredItems.map((item, idx) => (
                  <EntranceItem key={item.id} index={idx + 1}>
                    <EditorialItemCard
                      item={item}
                      onSelect={setSelectedItem}
                      accentColor={config.accentColor}
                    />
                  </EntranceItem>
                ))}
              </div>
            )}
          </EntranceSection>
        ) : (
          <>
            {/* Featured / Signature Section */}
            {featuredItems.length > 0 && (
              <EntranceSection className="space-y-3.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span
                      style={{ backgroundColor: config.accentColor }}
                      className="w-2 h-5 rounded-full inline-block"
                    />
                    <h2 className="text-lg font-bold text-white tracking-tight">
                      پیشنهاد سرآشپز و برگزیده‌ها
                    </h2>
                  </div>
                  <span className="text-xs text-amber-400 font-medium">امضای بونو</span>
                </div>

                {/* Featured Items Grid: 1 per row on mobile, 2 on wide viewports */}
                <div className={`grid gap-4 ${isWideLayout ? 'grid-cols-2' : 'grid-cols-1'}`}>
                  {featuredItems.slice(0, 2).map((item, idx) => (
                    <EntranceItem key={item.id} index={idx}>
                      <FeaturedEditorialCard
                        item={item}
                        onSelect={setSelectedItem}
                        accentColor={config.accentColor}
                      />
                    </EntranceItem>
                  ))}
                </div>
              </EntranceSection>
            )}

            {/* Standard Category Sections */}
            {restaurant.categories.map((category) => {
              const categoryItems = restaurant.items.filter(
                (item) => item.categoryId === category.id
              );
              if (categoryItems.length === 0) return null;

              return (
                <EntranceSection
                  key={category.id}
                  id={`cat-section-${category.id}`}
                  dataCategoryId={category.id}
                  className="space-y-4 pt-4 scroll-mt-20"
                >
                  {/* Section Header: Static, directly visible, NOT wrapped in EntranceItem */}
                  <div className="border-b border-neutral-800/80 pb-2.5 flex items-end justify-between">
                    <div>
                      <h3 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
                        <span>{category.name}</span>
                        <span className="text-xs text-neutral-400 font-light">
                          ({toPersianDigits(categoryItems.length)})
                        </span>
                      </h3>
                      {category.nameEn && (
                        <p className="text-[11px] text-neutral-400 font-sans tracking-wider" dir="ltr">
                          {category.nameEn}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* List of items with continuous 300ms entrance animation */}
                  <div className="grid grid-cols-1 gap-3.5">
                    {categoryItems.map((item, idx) => (
                      <EntranceItem key={item.id} index={idx}>
                        <EditorialItemCard
                          item={item}
                          onSelect={setSelectedItem}
                          accentColor={config.accentColor}
                        />
                      </EntranceItem>
                    ))}
                  </div>
                </EntranceSection>
              );
            })}
          </>
        )}

        {/* Brand Footer */}
        <EntranceSection as="footer" className="pt-10 pb-16 text-center space-y-3 border-t border-neutral-800/60 mt-12">
          <EntranceItem index={0} className="w-10 h-10 mx-auto rounded-xl overflow-hidden p-0.5 border border-amber-500/20 bg-black/40">
            <img src={restaurant.logo} alt={restaurant.name} className="w-full h-full object-cover rounded-lg" />
          </EntranceItem>
          <EntranceItem index={1} as="h4" className="text-sm font-bold text-white">{restaurant.name}</EntranceItem>
          <EntranceItem index={2} as="p" className="text-xs text-neutral-400 max-w-xs mx-auto leading-relaxed">{restaurant.tagline}</EntranceItem>
          <EntranceItem index={3} className="text-[11px] text-neutral-400 pt-3">
            منوی دیجیتال طراحی شده با ویترین
          </EntranceItem>
        </EntranceSection>
      </main>

      {/* Floating Bottom-Docked Scroll To Top Button (Accounting for Selection Bar) */}
      <ScrollToTopButton accentColor={config.accentColor} themeId="immersive" />

      {/* Sticky Customer Selection Summary Bar */}
      <MenuSelectionBar accentColor={config.accentColor} themeId="immersive" />

      {/* Selections Bottom Sheet Modal */}
      <MenuSelectionSheet accentColor={config.accentColor} />

      {/* All Categories Bottom Sheet Grid */}
      <CategoryBottomSheet
        isOpen={isCategorySheetOpen}
        onClose={() => setIsCategorySheetOpen(false)}
        categories={restaurant.categories}
        items={restaurant.items}
        activeCategoryId={activeCategory}
        onSelectCategory={handleCategoryClick}
        accentColor={config.accentColor}
      />

      {/* Product Detail Modal */}
      <ProductDetailModal
        item={selectedItem}
        onClose={() => setSelectedItem(null)}
        accentColor={config.accentColor}
      />

      {/* Restaurant Information Modal */}
      <RestaurantInfoModal
        restaurant={restaurant}
        isOpen={isInfoOpen}
        onClose={() => setIsInfoOpen(false)}
        accentColor={config.accentColor}
      />
    </div>
  );
};

/* -------------------------------------------------------------------------- */
/* Subcomponent: Featured Editorial Card (Theme 01: Discover First)           */
/* -------------------------------------------------------------------------- */
interface ItemCardProps {
  item: MenuItem;
  onSelect: (item: MenuItem) => void;
  accentColor: string;
}

const FeaturedEditorialCard: React.FC<ItemCardProps> = ({ item, onSelect, accentColor }) => {
  const { getItemQuantity } = useMenuSelection();
  const quantity = getItemQuantity(item.id);
  const isSoldOut = item.availability === 'sold_out';

  return (
    <motion.div
      whileHover={{ y: -2 }}
      whileTap={{ scale: 0.99 }}
      onClick={() => onSelect(item)}
      id={`item-featured-${item.id}`}
      className={`relative bg-[#0d141f]/90 hover:bg-[#111a28]/95 backdrop-blur-md rounded-2xl overflow-hidden border transition-all duration-300 shadow-xl cursor-pointer flex flex-row items-stretch h-[132px] group ${
        quantity > 0
          ? 'border-amber-500/50 shadow-[0_8px_30px_rgba(212,175,55,0.14)] ring-1 ring-amber-500/20'
          : 'border-neutral-800/80 hover:border-neutral-700/80'
      } ${isSoldOut ? 'opacity-65' : ''}`}
    >
      {/* Content Side (Right in RTL) */}
      <div className="flex-1 min-w-0 p-3.5 sm:p-4 flex flex-col justify-between h-full text-right">
        {/* Row 1: Title (Primary element) */}
        <div className="min-w-0">
          <h4 className="font-semibold text-sm sm:text-base text-neutral-100 group-hover:text-amber-300 transition-colors tracking-tight truncate">
            {item.name}
          </h4>
        </div>

        {/* Row 2: Strict Single-Line Description */}
        <div className="min-w-0 py-0.5">
          <p className="text-xs text-neutral-400 font-light truncate leading-normal">
            {item.description}
          </p>
        </div>

        {/* Row 3: Refined Price & Status */}
        <div className="mt-auto pt-1.5 border-t border-neutral-800/50 flex items-center justify-between">
          <span className="text-xs sm:text-sm font-normal text-amber-300/90 tracking-tight whitespace-nowrap">
            {formatToman(item.price)}
          </span>

          {quantity > 0 ? (
            <span
              style={{ backgroundColor: `${accentColor}18`, borderColor: `${accentColor}40`, color: accentColor }}
              className="text-[10px] font-medium px-2 py-0.5 rounded-full border whitespace-nowrap"
            >
              {toPersianDigits(quantity)} انتخاب شده
            </span>
          ) : (
            <span className="text-[11px] text-neutral-500 group-hover:text-neutral-300 transition-colors font-light whitespace-nowrap">
              مشاهده جزئیات
            </span>
          )}
        </div>
      </div>

      {/* Food Photography Side (Left in RTL, ~36% width) */}
      <div className="w-[36%] shrink-0 relative overflow-hidden bg-neutral-950">
        <SafeImage
          src={item.image}
          alt={item.name}
          className={`w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out ${
            isSoldOut ? 'grayscale contrast-75' : ''
          }`}
          fallbackIconClassName="w-6 h-6 text-neutral-600"
        />
        <div className="absolute inset-0 bg-gradient-to-l from-[#0d141f]/70 via-transparent to-transparent" />

        {/* Sold Out Overlay */}
        {isSoldOut && (
          <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px] flex items-center justify-center">
            <span className="bg-neutral-900/90 text-neutral-300 text-[10px] font-medium px-2 py-0.5 rounded-full border border-neutral-700 shadow-xl whitespace-nowrap">
              ناموجود
            </span>
          </div>
        )}
      </div>
    </motion.div>
  );
};

/* -------------------------------------------------------------------------- */
/* Subcomponent: Standard Editorial Item Card (Theme 01)                       */
/* -------------------------------------------------------------------------- */
const EditorialItemCard: React.FC<ItemCardProps> = ({ item, onSelect, accentColor }) => {
  const { getItemQuantity } = useMenuSelection();
  const quantity = getItemQuantity(item.id);
  const isSoldOut = item.availability === 'sold_out';

  return (
    <motion.div
      whileTap={{ scale: 0.99 }}
      whileHover={{ y: -1 }}
      onClick={() => onSelect(item)}
      id={`item-card-${item.id}`}
      className={`relative bg-[#0d141f]/85 hover:bg-[#111b2a]/90 backdrop-blur-sm border rounded-2xl p-3 sm:p-3.5 transition-all duration-200 cursor-pointer flex gap-3.5 items-center justify-between group shadow-md h-[100px] ${
        quantity > 0
          ? 'border-amber-500/45 shadow-[0_4px_20px_rgba(212,175,55,0.12)] ring-1 ring-amber-500/20'
          : 'border-neutral-800/80 hover:border-neutral-700/80'
      } ${isSoldOut ? 'opacity-65' : ''}`}
    >
      {/* Content Side */}
      <div className="flex-1 min-w-0 h-full flex flex-col justify-between py-0.5 text-right">
        {/* Row 1: Title (Primary anchor) */}
        <div className="min-w-0">
          <h4 className="font-semibold text-sm text-neutral-100 group-hover:text-amber-300 transition-colors truncate">
            {item.name}
          </h4>
        </div>

        {/* Row 2: Strict Single Line Description */}
        <div className="min-w-0">
          <p className="text-xs text-neutral-400 font-light truncate leading-normal">
            {item.description}
          </p>
        </div>

        {/* Row 3: Price and Indication */}
        <div className="flex items-center justify-between pt-1 border-t border-neutral-800/40">
          <span className="text-xs sm:text-sm font-normal text-amber-300/90 tracking-tight whitespace-nowrap">
            {formatToman(item.price)}
          </span>

          {quantity > 0 ? (
            <span
              style={{ backgroundColor: `${accentColor}18`, borderColor: `${accentColor}35`, color: accentColor }}
              className="text-[9px] font-medium px-2 py-0.5 rounded-full border whitespace-nowrap"
            >
              {toPersianDigits(quantity)} انتخاب شده
            </span>
          ) : (
            <span className="text-[10px] text-neutral-500 group-hover:text-neutral-300 transition-colors font-light whitespace-nowrap">
              جزئیات
            </span>
          )}
        </div>
      </div>

      {/* Image Thumbnail with SafeImage Fallback */}
      <div className="relative w-20 h-20 rounded-xl overflow-hidden shrink-0 bg-neutral-950 border border-neutral-800">
        <SafeImage
          src={item.image}
          alt={item.name}
          className={`w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 ${
            isSoldOut ? 'grayscale contrast-75' : ''
          }`}
          fallbackIconClassName="w-5 h-5 text-neutral-600"
        />

        {/* Sold Out Overlay */}
        {isSoldOut && (
          <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px] flex items-center justify-center">
            <span className="bg-neutral-900/90 text-neutral-300 text-[9px] font-medium px-1.5 py-0.5 rounded-full border border-neutral-700 shadow whitespace-nowrap">
              ناموجود
            </span>
          </div>
        )}
      </div>
    </motion.div>
  );
};
