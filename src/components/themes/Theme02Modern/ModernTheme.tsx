import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ChevronDown,
  Info,
  RotateCcw,
  Search,
  Clock,
  MapPin,
  Heart,
  ArrowUp,
  Layers,
  Plus,
  Minus,
  Trash2,
} from 'lucide-react';
import { RestaurantData, MenuThemeConfig, MenuItem } from '../../../types/menu';
import { formatToman, toPersianDigits } from '../../../utils/formatters';
import { ProductDetailModal } from '../../common/ProductDetailModal';
import { RestaurantInfoModal } from '../../common/RestaurantInfoModal';
import { CategoryBottomSheet } from '../../common/CategoryBottomSheet';
import { MenuSelectionBar } from '../../common/MenuSelectionBar';
import { MenuSelectionSheet } from '../../common/MenuSelectionSheet';
import { ScrollToTopButton } from '../../common/ScrollToTopButton';
import { AmbientBackground } from '../../common/AmbientBackground';
import { useMenuSelection } from '../../../context/MenuSelectionContext';
import { useMenuViewport } from '../../../context/MenuViewportContext';
import { useHeroTransition } from '../../../hooks/useHeroTransition';
import { EntranceSection, EntranceItem } from '../../../motion';


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
  const transitionDuration = (config.hero?.transitionDurationMs || 700) / 1000;
  const { viewState, isMenuMode, enterMenu, returnToHero } = useHeroTransition({
    initialState,
    onStateChange,
    transitionDurationMs: config.hero?.transitionDurationMs || 700,
  });

  const { getScrollContainer, scrollToElement, viewportWidth } = useMenuViewport();
  const isWideLayout = viewportWidth > 0 ? viewportWidth >= 768 : false;

  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);
  const [isInfoOpen, setIsInfoOpen] = useState(false);
  const [isCategorySheetOpen, setIsCategorySheetOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState<string>(restaurant.categories[0]?.id || '');
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearch, setShowSearch] = useState(false);
  const [favorites, setFavorites] = useState<Set<string>>(new Set());

  const containerRef = useRef<HTMLDivElement>(null);

  // Intersection Observer for scroll tracking
  useEffect(() => {
    if (!isMenuMode) return;

    const container = getScrollContainer();
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const catId = entry.target.getAttribute('data-category-id');
            if (catId) setActiveCategory(catId);
          }
        });
      },
      {
        root: container === window ? null : (container as HTMLElement),
        rootMargin: '-80px 0px -65% 0px',
        threshold: 0.1,
      }
    );

    restaurant.categories.forEach((cat) => {
      const el = document.getElementById(`modern-cat-${cat.id}`);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [isMenuMode, restaurant.categories, getScrollContainer]);

  const handleCategoryClick = (catId: string) => {
    setActiveCategory(catId);
    scrollToElement(`modern-cat-${catId}`, 75);
  };

  const toggleFavorite = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    setFavorites((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
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

  const activeCategoryObj = restaurant.categories.find((c) => c.id === activeCategory);

  return (
    <div
      ref={containerRef}
      dir="rtl"
      className="min-h-screen bg-[#0a0d14] text-slate-100 font-sans relative selection:bg-orange-500/20"
      style={{
        backgroundColor: config.bgColor || '#0a0d14',
        color: config.textColor,
      }}
    >
      {/* Ambient Animated Atmospheric Glow Layer */}
      <AmbientBackground theme="modern" accentColor={config.accentColor || '#f97316'} />

      {/* ------------------------------------------------------------------ */}
      {/* 1. CONTINUOUS HERO CONTAINER (Moves upward like a curtain/shutter) */}
      {/* ------------------------------------------------------------------ */}
      <motion.div
        layout
        initial={false}
        animate={{
          height: isMenuMode ? '240px' : 'var(--menu-viewport-height, 100dvh)',
        }}
        transition={{
          duration: transitionDuration,
          ease: [0.22, 1, 0.36, 1],
        }}
        className="relative z-10 w-full overflow-hidden flex flex-col justify-between"
      >
        {/* Continuous Background Visual Layer */}
        <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
          <img
            src={restaurant.secondaryHeroImage || restaurant.heroImage}
            alt={restaurant.name}
            className="w-full h-full object-cover object-center filter brightness-[0.75]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/50 to-slate-950/40" />
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-slate-950" />
        </div>

        {/* Top Header Bar Area */}
        <EntranceItem index={0} className="relative z-10 w-full px-4 sm:px-6 pt-4 max-w-2xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl overflow-hidden bg-slate-900 p-0.5 border border-orange-500/40 shadow-xl flex-shrink-0">
              <img
                src={restaurant.logo}
                alt={restaurant.name}
                className="w-full h-full object-cover rounded-xl"
              />
            </div>

            <div>
              <h1 className="font-bold text-white tracking-tight text-base sm:text-lg whitespace-nowrap">
                {restaurant.name}
              </h1>
              <p className="text-[11px] sm:text-xs text-orange-400 font-medium whitespace-nowrap">
                {restaurant.cuisine}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsInfoOpen(true)}
              id="modern-header-info-btn"
              className="w-9 h-9 rounded-full bg-slate-900/80 border border-slate-700/80 flex items-center justify-center text-slate-300 hover:text-white active:scale-95 transition-all cursor-pointer shadow shrink-0"
              aria-label="اطلاعات رستوران"
            >
              <Info className="w-4 h-4 text-orange-400" />
            </button>
          </div>
        </EntranceItem>

        {/* Hero Intro Body Content (Vertically Centered in Hero Viewport) */}
        <AnimatePresence>
          {!isMenuMode && (
            <motion.div
              key="modern-hero-body"
              initial={{ opacity: 1, y: 0 }}
              exit={{
                opacity: 0,
                y: -60,
                transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] },
              }}
              transition={{ duration: 0.5 }}
              className="relative z-10 px-5 py-4 max-w-lg mx-auto w-full flex-1 flex flex-col items-center justify-center text-center my-auto"
            >
              {/* Main Centered Content */}
              <div className="flex flex-col items-center space-y-3.5 w-full">
                <EntranceItem index={1} className="inline-flex items-center gap-2 bg-black/40 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-white/10 text-xs font-medium text-white shadow-sm">
                  <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span>پذیرایی حضوری و سفارش آنلاین</span>
                </EntranceItem>

                <EntranceItem index={2} as="h2" className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white leading-snug tracking-tight max-w-sm sm:max-w-md">
                  {config.hero.headline}
                </EntranceItem>

                <EntranceItem index={3} as="p" className="text-xs sm:text-sm text-slate-300 leading-relaxed font-light max-w-xs sm:max-w-sm">
                  {config.hero.subheadline}
                </EntranceItem>

                {/* Information Pills (Identical dimensions & weight) */}
                <EntranceItem index={4} className="w-full max-w-sm mx-auto pt-1">
                  <div className="grid grid-cols-2 gap-2.5 w-full">
                    <div className="h-9 px-3 flex items-center justify-center gap-1.5 bg-slate-900/80 backdrop-blur-md rounded-full border border-slate-700/80 text-slate-200 text-xs font-medium overflow-hidden shadow-sm">
                      <Clock className="w-3.5 h-3.5 text-orange-400 shrink-0" />
                      <span className="truncate max-w-[120px] sm:max-w-[140px] text-[11px] sm:text-xs">
                        {toPersianDigits(restaurant.workingHours)}
                      </span>
                    </div>
                    <div className="h-9 px-3 flex items-center justify-center gap-1.5 bg-slate-900/80 backdrop-blur-md rounded-full border border-slate-700/80 text-slate-200 text-xs font-medium overflow-hidden shadow-sm">
                      <MapPin className="w-3.5 h-3.5 text-orange-400 shrink-0" />
                      <span className="truncate max-w-[120px] sm:max-w-[140px] text-[11px] sm:text-xs">
                        {restaurant.neighborhood}
                      </span>
                    </div>
                  </div>
                </EntranceItem>
              </div>

              {/* Lower CTA Button Container */}
              <div className="w-full flex flex-col items-center mt-7 sm:mt-9">
                <EntranceItem index={5} className="w-full max-w-xs">
                  <motion.button
                    whileTap={{ scale: 0.97 }}
                    onClick={() => enterMenu('cta')}
                    id="modern-enter-menu-btn"
                    className="w-full min-h-[48px] py-3.5 px-6 rounded-2xl bg-orange-500 hover:bg-orange-400 text-white font-bold text-sm sm:text-base shadow-[0_10px_25px_rgba(249,115,22,0.35)] active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer whitespace-nowrap"
                  >
                    <span className="whitespace-nowrap">{config.hero.ctaText}</span>
                    <ChevronDown className="w-4 h-4" />
                  </motion.button>
                </EntranceItem>

                <EntranceItem index={6} className="text-slate-400 text-[11px] font-light text-center mt-2.5">
                  جهت مرور خوراک‌ها و ثبت انتخاب دکمه را لمس یا به پایین اسکرول کنید
                </EntranceItem>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Collapsed Short Hero Status Bar */}
        {isMenuMode && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.4 }}
            className="relative z-10 w-full px-4 sm:px-6 pb-3 max-w-2xl mx-auto flex items-center justify-between text-xs text-slate-300 border-t border-white/10 pt-2"
          >
            <div className="flex items-center gap-2 font-medium">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>پذیرایی حضوری • {toPersianDigits(restaurant.workingHours)}</span>
            </div>
            <div className="text-orange-400 font-medium">
              {toPersianDigits(restaurant.items.length)} آیتم منو
            </div>
          </motion.div>
        )}
      </motion.div>

      {/* ------------------------------------------------------------------ */}
      {/* 2. STICKY CATEGORY NAVIGATOR & SEARCH                              */}
      {/* ------------------------------------------------------------------ */}
      <div className="sticky top-0 z-30 bg-slate-950/95 backdrop-blur-md border-y border-slate-800 shadow-md">
        <div className="max-w-2xl mx-auto px-4 py-2.5 flex items-center justify-between gap-3">
          <button
            onClick={() => setIsCategorySheetOpen(true)}
            id="modern-all-cats-btn"
            className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-bold bg-orange-500 text-white shadow-md shadow-orange-500/25 active:scale-95 transition-all cursor-pointer"
          >
            <Layers className="w-3.5 h-3.5" />
            <span>دسته‌بندی: {activeCategoryObj?.name || 'همه دسته‌ها'}</span>
            <ChevronDown className="w-3.5 h-3.5" />
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowSearch(!showSearch)}
              className={`w-8 h-8 rounded-xl flex items-center justify-center transition-colors cursor-pointer ${
                showSearch ? 'bg-orange-500 text-white' : 'bg-slate-900 border border-slate-800 text-slate-300 hover:text-white'
              }`}
              aria-label="جستجو در منو"
            >
              <Search className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Search Bar */}
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
                  placeholder="جستجو در بین غذاها و نوشیدنی‌ها..."
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-orange-500"
                  autoFocus
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute left-3 top-2.5 text-xs text-slate-400 hover:text-white"
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
      {/* 3. MENU STREAM CONTENT (Food-First Fast Scan Layout)               */}
      {/* ------------------------------------------------------------------ */}
      <main className="max-w-2xl mx-auto px-4 pt-6 space-y-9 pb-28 relative z-10">
        {restaurant.categories.map((category) => {
          const items = filteredItems.filter((i) => i.categoryId === category.id);
          if (items.length === 0) return null;

          const featuredItem = items.find((i) => i.badge || i.isVegetarian) || (items.length > 3 ? items[0] : null);
          const standardItems = featuredItem ? items.filter((i) => i.id !== featuredItem.id) : items;

          return (
            <EntranceSection
              key={category.id}
              id={`modern-cat-${category.id}`}
              dataCategoryId={category.id}
              className="space-y-4 scroll-mt-20"
            >
              {/* Category Functional Header */}
              <EntranceItem index={0} className="flex items-center justify-between pb-2 border-b border-slate-800/80">
                <div className="flex items-center gap-2.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-orange-500 shadow-[0_0_8px_rgba(249,115,22,0.6)]" />
                  <h3 className="font-black text-base sm:text-lg text-white">
                    {category.name}
                  </h3>
                </div>
                <span className="text-xs text-orange-400/90 font-bold bg-orange-500/10 border border-orange-500/20 px-2.5 py-0.5 rounded-full">
                  {toPersianDigits(items.length)} خوراک
                </span>
              </EntranceItem>

              {/* Optional Featured Lead Card for Section Rhythm */}
              {featuredItem && !searchQuery && (
                <EntranceItem index={1} className="mb-3">
                  <ModernFeaturedCard
                    item={featuredItem}
                    isFavorite={favorites.has(featuredItem.id)}
                    onToggleFavorite={(e) => toggleFavorite(e, featuredItem.id)}
                    onSelect={setSelectedItem}
                    accentColor={config.accentColor || '#f97316'}
                  />
                </EntranceItem>
              )}

              {/* High-Density Horizontal Scanning Cards */}
              <div className={`grid gap-3 ${isWideLayout ? 'grid-cols-2' : 'grid-cols-1'}`}>
                {standardItems.map((item, idx) => {
                  const isFav = favorites.has(item.id);
                  const itemIndex = (featuredItem && !searchQuery) ? idx + 2 : idx + 1;
                  return (
                    <EntranceItem key={item.id} index={itemIndex}>
                      <ModernItemCard
                        item={item}
                        isFavorite={isFav}
                        onToggleFavorite={(e) => toggleFavorite(e, item.id)}
                        onSelect={setSelectedItem}
                        accentColor={config.accentColor || '#f97316'}
                      />
                    </EntranceItem>
                  );
                })}
              </div>
            </EntranceSection>
          );
        })}
      </main>

      {/* Floating Bottom-Docked Scroll To Top Button (Accounting for Selection Bar) */}
      <ScrollToTopButton accentColor={config.accentColor || '#f97316'} themeId="modern" />

      {/* Selection Components */}
      <MenuSelectionBar accentColor={config.accentColor || '#f97316'} themeId="modern" />
      <MenuSelectionSheet accentColor={config.accentColor || '#f97316'} />

      {/* Category Bottom Sheet */}
      <CategoryBottomSheet
        isOpen={isCategorySheetOpen}
        onClose={() => setIsCategorySheetOpen(false)}
        categories={restaurant.categories}
        items={restaurant.items}
        activeCategoryId={activeCategory}
        onSelectCategory={handleCategoryClick}
        accentColor={config.accentColor || '#f97316'}
      />

      {/* Modals */}
      <ProductDetailModal
        item={selectedItem}
        onClose={() => setSelectedItem(null)}
        accentColor={config.accentColor || '#f97316'}
      />

      <RestaurantInfoModal
        restaurant={restaurant}
        isOpen={isInfoOpen}
        onClose={() => setIsInfoOpen(false)}
        accentColor={config.accentColor || '#f97316'}
      />
    </div>
  );
};

/* -------------------------------------------------------------------------- */
/* Card Props Definition                                                      */
/* -------------------------------------------------------------------------- */
interface ModernCardProps {
  item: MenuItem;
  isFavorite: boolean;
  onToggleFavorite: (e: React.MouseEvent) => void;
  onSelect: (item: MenuItem) => void;
  accentColor: string;
}

/* -------------------------------------------------------------------------- */
/* Subcomponent: Modern Featured Lead Card (Theme 02: Rhythm & Highlight)     */
/* -------------------------------------------------------------------------- */
const ModernFeaturedCard: React.FC<ModernCardProps> = ({
  item,
  isFavorite,
  onToggleFavorite,
  onSelect,
  accentColor,
}) => {
  const { getItemQuantity } = useMenuSelection();
  const quantity = getItemQuantity(item.id);
  const isSoldOut = item.availability === 'sold_out';

  return (
    <div
      onClick={() => onSelect(item)}
      id={`modern-featured-${item.id}`}
      className={`relative bg-[#0e131d]/90 hover:bg-[#121824]/95 border rounded-2xl overflow-hidden transition-all duration-200 cursor-pointer group shadow-lg flex flex-row items-stretch h-[132px] ${
        quantity > 0
          ? 'border-orange-500/50 shadow-[0_4px_25px_rgba(249,115,22,0.15)] ring-1 ring-orange-500/20'
          : 'border-slate-800/80 hover:border-slate-700/80'
      } ${isSoldOut ? 'opacity-65' : ''}`}
    >
      {/* Content Side (Right in RTL) */}
      <div className="flex-1 min-w-0 p-3.5 sm:p-4 flex flex-col justify-between h-full text-right">
        {/* Row 1: Title (Primary element) */}
        <div className="flex items-center justify-between gap-1.5 min-w-0">
          <h4 className="font-semibold text-sm sm:text-base text-neutral-100 group-hover:text-orange-400 transition-colors tracking-tight truncate">
            {item.name}
          </h4>
          <button
            onClick={onToggleFavorite}
            className="w-6 h-6 rounded-full bg-slate-900/80 border border-slate-800 flex items-center justify-center text-slate-400 hover:text-rose-500 transition-colors shrink-0 cursor-pointer"
            aria-label="نشان کردن"
          >
            <Heart
              className={`w-3.5 h-3.5 ${
                isFavorite ? 'fill-rose-500 text-rose-500' : 'text-slate-400'
              }`}
            />
          </button>
        </div>

        {/* Row 2: Strict Single-Line Description */}
        <div className="min-w-0 py-0.5">
          <p className="text-xs text-slate-400 font-light truncate leading-normal">
            {item.description}
          </p>
        </div>

        {/* Row 3: Refined Price & Status */}
        <div className="mt-auto pt-1.5 border-t border-slate-800/50 flex items-center justify-between">
          <span className="text-xs sm:text-sm font-normal text-orange-400/90 tracking-tight whitespace-nowrap">
            {formatToman(item.price)}
          </span>

          {quantity > 0 ? (
            <span className="text-[10px] font-medium text-orange-400 bg-orange-950/60 border border-orange-500/30 px-2 py-0.5 rounded-full whitespace-nowrap">
              {toPersianDigits(quantity)} انتخاب شده
            </span>
          ) : (
            <span className="text-[11px] text-slate-500 group-hover:text-slate-300 transition-colors font-light whitespace-nowrap">
              مشاهده جزئیات
            </span>
          )}
        </div>
      </div>

      {/* Food Photography Side (Left in RTL, ~36% width) */}
      <div className="w-[36%] shrink-0 relative overflow-hidden bg-slate-950">
        <img
          src={item.image}
          alt={item.name}
          className={`w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out ${
            isSoldOut ? 'grayscale contrast-75' : ''
          }`}
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-l from-[#0e131d]/70 via-transparent to-transparent" />

        {isSoldOut && (
          <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px] flex items-center justify-center">
            <span className="bg-slate-900/90 text-slate-300 text-[10px] font-medium px-2 py-0.5 rounded-full border border-slate-700 whitespace-nowrap">
              ناموجود
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

/* -------------------------------------------------------------------------- */
/* Subcomponent: Modern Compact Horizontal Card (Theme 02: Scan First)        */
/* -------------------------------------------------------------------------- */
const ModernItemCard: React.FC<ModernCardProps> = ({
  item,
  isFavorite,
  onToggleFavorite,
  onSelect,
  accentColor,
}) => {
  const { getItemQuantity } = useMenuSelection();
  const quantity = getItemQuantity(item.id);
  const isSoldOut = item.availability === 'sold_out';

  return (
    <div
      onClick={() => onSelect(item)}
      id={`modern-item-${item.id}`}
      className={`relative bg-[#0e131d]/80 hover:bg-[#121824]/90 border rounded-2xl p-3 transition-all duration-200 flex items-center justify-between gap-3 cursor-pointer group shadow-sm h-[100px] ${
        quantity > 0
          ? 'border-orange-500/50 shadow-[0_2px_15px_rgba(249,115,22,0.12)] ring-1 ring-orange-500/20'
          : 'border-slate-800/80 hover:border-slate-700/80'
      } ${isSoldOut ? 'opacity-65' : ''}`}
    >
      {/* Content Side */}
      <div className="flex-1 min-w-0 h-full flex flex-col justify-between py-0.5 text-right">
        {/* Row 1: Title + Favorite */}
        <div className="flex items-center justify-between gap-1 min-w-0">
          <h4 className="font-semibold text-sm text-neutral-100 group-hover:text-orange-400 transition-colors truncate">
            {item.name}
          </h4>

          <button
            onClick={onToggleFavorite}
            className="text-slate-500 hover:text-rose-500 transition-colors p-0.5 shrink-0 cursor-pointer"
            aria-label="نشان کردن"
          >
            <Heart
              className={`w-3.5 h-3.5 ${
                isFavorite ? 'fill-rose-500 text-rose-500' : 'text-slate-600'
              }`}
            />
          </button>
        </div>

        {/* Row 2: Strict Single-Line Description */}
        <div className="min-w-0">
          <p className="text-xs text-slate-400 font-light truncate leading-normal">
            {item.description}
          </p>
        </div>

        {/* Row 3: Refined Price & Status */}
        <div className="flex items-center justify-between pt-1 border-t border-slate-800/40">
          <span className="text-xs sm:text-sm font-normal text-orange-400/90 tracking-tight whitespace-nowrap">
            {formatToman(item.price)}
          </span>

          {quantity > 0 ? (
            <span className="text-[9px] font-medium text-orange-400 bg-orange-950/50 border border-orange-500/30 px-2 py-0.5 rounded-full whitespace-nowrap">
              {toPersianDigits(quantity)} انتخاب شده
            </span>
          ) : (
            <span className="text-[10px] text-slate-500 group-hover:text-slate-300 transition-colors font-light whitespace-nowrap">
              جزئیات
            </span>
          )}
        </div>
      </div>

      {/* Product Image on Left side (RTL) */}
      <div className="relative w-20 h-20 rounded-xl overflow-hidden bg-slate-950 shrink-0 border border-slate-800">
        <img
          src={item.image}
          alt={item.name}
          className={`w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 ${
            isSoldOut ? 'grayscale contrast-75' : ''
          }`}
          loading="lazy"
        />

        {isSoldOut && (
          <div className="absolute inset-0 bg-black/60 backdrop-blur-[1px] flex items-center justify-center">
            <span className="text-[9px] font-medium text-slate-300 text-center px-1 whitespace-nowrap">ناموجود</span>
          </div>
        )}
      </div>
    </div>
  );
};
