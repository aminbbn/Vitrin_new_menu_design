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
        <div className="relative z-10 w-full px-4 sm:px-6 pt-4 max-w-2xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 sm:w-13 sm:h-13 rounded-2xl overflow-hidden bg-slate-900 p-0.5 border border-orange-500/40 shadow-xl flex-shrink-0">
              <img
                src={restaurant.logo}
                alt={restaurant.name}
                className="w-full h-full object-cover rounded-xl"
              />
            </div>

            <div>
              <h1 className="font-bold text-white tracking-tight text-base sm:text-lg">
                {restaurant.name}
              </h1>
              <p className="text-[11px] sm:text-xs text-orange-400 font-medium">
                {restaurant.cuisine} • {restaurant.neighborhood}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {isMenuMode && (
              <motion.button
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                onClick={returnToHero}
                id="modern-reset-btn"
                className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-slate-900/80 text-orange-400 border border-orange-500/30 text-xs font-semibold hover:bg-slate-800 active:scale-95 cursor-pointer shadow"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span className="text-[11px]">معرفی</span>
              </motion.button>
            )}

            <button
              onClick={() => setIsInfoOpen(true)}
              id="modern-header-info-btn"
              className="w-9 h-9 rounded-full bg-slate-900/80 border border-slate-700/80 flex items-center justify-center text-slate-300 hover:text-white active:scale-95 transition-all cursor-pointer shadow"
              aria-label="اطلاعات رستوران"
            >
              <Info className="w-4 h-4 text-orange-400" />
            </button>
          </div>
        </div>

        {/* Hero Intro Body Content */}
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
              className="relative z-10 px-6 py-6 max-w-lg mx-auto w-full flex flex-col justify-between space-y-6 my-auto"
            >
              <div className="space-y-4 text-center sm:text-right">
                <div className="inline-flex items-center gap-2 bg-black/40 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-white/10 text-xs font-medium text-white">
                  <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span>پذیرایی حضوری و منوی زنده فعال</span>
                </div>

                <h2 className="text-2xl sm:text-3xl font-black text-white leading-tight">
                  {config.hero.headline}
                </h2>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-light">
                  {config.hero.subheadline}
                </p>

                {/* Categories Teaser Chips */}
                <div className="pt-2">
                  <div className="text-[11px] text-slate-400 font-semibold mb-2">دسته‌بندی‌های موجود در منو:</div>
                  <div className="flex flex-wrap gap-2 justify-center sm:justify-start">
                    {restaurant.categories.slice(0, 4).map((c) => (
                      <span
                        key={c.id}
                        className="text-xs px-3 py-1 rounded-xl bg-slate-900/90 text-slate-200 border border-slate-800 font-medium"
                      >
                        {c.name}
                      </span>
                    ))}
                    <span className="text-xs px-2.5 py-1 rounded-xl bg-slate-900/40 text-orange-400 border border-orange-500/20 font-medium">
                      +{toPersianDigits(restaurant.categories.length - 4)} بخش دیگر
                    </span>
                  </div>
                </div>
              </div>

              {/* Main Entry Button with Tactile Feedback */}
              <div className="pt-2">
                <motion.button
                  whileTap={{ scale: 0.97 }}
                  onClick={() => enterMenu('cta')}
                  id="modern-enter-menu-btn"
                  className="w-full py-4 px-6 rounded-2xl bg-orange-500 hover:bg-orange-400 text-white font-extrabold text-base shadow-[0_10px_25px_rgba(249,115,22,0.35)] active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>{config.hero.ctaText}</span>
                  <ChevronDown className="w-5 h-5" />
                </motion.button>
              </div>

              <div className="text-slate-400 text-xs font-light text-center">
                جهت مرور خوراک‌ها و ثبت انتخاب دکمه را لمس یا به پایین اسکرول کنید
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
            <section
              key={category.id}
              id={`modern-cat-${category.id}`}
              data-category-id={category.id}
              className="space-y-4 scroll-mt-20"
            >
              {/* Category Functional Header */}
              <div className="flex items-center justify-between pb-2 border-b border-slate-800/80">
                <div className="flex items-center gap-2.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-orange-500 shadow-[0_0_8px_rgba(249,115,22,0.6)]" />
                  <h3 className="font-black text-base sm:text-lg text-white">
                    {category.name}
                  </h3>
                </div>
                <span className="text-xs text-orange-400/90 font-bold bg-orange-500/10 border border-orange-500/20 px-2.5 py-0.5 rounded-full">
                  {toPersianDigits(items.length)} خوراک
                </span>
              </div>

              {/* Optional Featured Lead Card for Section Rhythm */}
              {featuredItem && !searchQuery && (
                <div className="mb-3">
                  <ModernFeaturedCard
                    item={featuredItem}
                    isFavorite={favorites.has(featuredItem.id)}
                    onToggleFavorite={(e) => toggleFavorite(e, featuredItem.id)}
                    onSelect={setSelectedItem}
                    accentColor={config.accentColor || '#f97316'}
                  />
                </div>
              )}

              {/* High-Density Horizontal Scanning Cards */}
              <div className={`grid gap-3 ${isWideLayout ? 'grid-cols-2' : 'grid-cols-1'}`}>
                {standardItems.map((item) => {
                  const isFav = favorites.has(item.id);
                  return (
                    <ModernItemCard
                      key={item.id}
                      item={item}
                      isFavorite={isFav}
                      onToggleFavorite={(e) => toggleFavorite(e, item.id)}
                      onSelect={setSelectedItem}
                      accentColor={config.accentColor || '#f97316'}
                    />
                  );
                })}
              </div>
            </section>
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
/* Subcomponent: Modern Featured Lead Card (Theme 02: Rhythm & Highlight)     */
/* -------------------------------------------------------------------------- */
const ModernFeaturedCard: React.FC<ModernCardProps> = ({
  item,
  isFavorite,
  onToggleFavorite,
  onSelect,
  accentColor,
}) => {
  const { getItemQuantity, addItem, decreaseItem } = useMenuSelection();
  const quantity = getItemQuantity(item.id);
  const isSoldOut = item.availability === 'sold_out';

  return (
    <div
      onClick={() => onSelect(item)}
      id={`modern-featured-${item.id}`}
      className={`relative bg-[#0e131d]/90 hover:bg-[#121824]/95 border rounded-2xl overflow-hidden transition-all duration-200 cursor-pointer group shadow-lg flex flex-row items-stretch h-[160px] ${
        quantity > 0
          ? 'border-orange-500/50 shadow-[0_4px_25px_rgba(249,115,22,0.15)]'
          : 'border-slate-800/80 hover:border-slate-700/80'
      } ${isSoldOut ? 'opacity-70' : ''}`}
    >
      {/* Content Side (Right in RTL) */}
      <div className="flex-1 min-w-0 p-3.5 flex flex-col justify-between h-full">
        {/* Row 1: Title & Favorite Button */}
        <div className="flex items-center justify-between gap-1.5 min-w-0">
          <h4 className="font-black text-sm sm:text-base text-white group-hover:text-orange-400 transition-colors truncate">
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

        {/* Row 2: Badges & Metadata */}
        <div className="flex items-center gap-1.5 min-w-0 overflow-hidden py-0.5">
          {item.badge && (
            <span className="bg-orange-500 text-white text-[10px] font-black px-2 py-0.5 rounded-full shadow-sm whitespace-nowrap shrink-0">
              {item.badge}
            </span>
          )}
          {item.isVegetarian && (
            <span className="bg-emerald-950/80 text-emerald-300 text-[10px] font-bold px-2 py-0.5 rounded-full border border-emerald-500/30 whitespace-nowrap shrink-0">
              وجترین
            </span>
          )}
          {item.calories && (
            <span className="text-[10px] text-slate-400 font-light whitespace-nowrap shrink-0">
              {toPersianDigits(item.calories)} کالری
            </span>
          )}
        </div>

        {/* Row 3: Strict Single-Line Description */}
        <div className="min-w-0">
          <p className="text-xs text-slate-400 font-light truncate leading-normal">
            {item.description}
          </p>
        </div>

        {/* Row 4: Anchored Action & Price Row */}
        <div className="mt-auto pt-2 border-t border-slate-800/60 flex items-center justify-between">
          <span className="text-sm sm:text-base font-extrabold text-orange-400 tracking-tight whitespace-nowrap">
            {formatToman(item.price)}
          </span>

          {!isSoldOut && (
            <div
              onClick={(e) => e.stopPropagation()}
              className="flex items-center"
            >
              {quantity === 0 ? (
                <button
                  onClick={() => addItem(item.id)}
                  className="px-3 py-1.5 rounded-xl text-xs font-bold bg-orange-500 hover:bg-orange-400 text-white flex items-center gap-1 active:scale-95 transition-all shadow cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
                  <span>افزودن</span>
                </button>
              ) : (
                <div className="flex items-center gap-1 bg-slate-950 border border-orange-500/40 rounded-xl p-0.5 shadow">
                  <button
                    onClick={() => decreaseItem(item.id)}
                    className="w-6 h-6 rounded-lg bg-slate-800 text-white flex items-center justify-center active:scale-95"
                  >
                    {quantity === 1 ? <Trash2 className="w-3 h-3 text-rose-400" /> : <Minus className="w-3 h-3" />}
                  </button>
                  <span className="w-5 text-center text-xs font-black text-orange-400">
                    {toPersianDigits(quantity)}
                  </span>
                  <button
                    onClick={() => addItem(item.id)}
                    className="w-6 h-6 rounded-lg bg-orange-500 text-white font-bold flex items-center justify-center active:scale-95"
                  >
                    <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Dominant Food Photography Side (Left in RTL, ~38% width) */}
      <div className="w-[38%] shrink-0 relative overflow-hidden bg-slate-950">
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
            <span className="bg-slate-900/90 text-slate-300 text-[10px] font-bold px-2 py-1 rounded-full border border-slate-700">
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
interface ModernCardProps {
  item: MenuItem;
  isFavorite: boolean;
  onToggleFavorite: (e: React.MouseEvent) => void;
  onSelect: (item: MenuItem) => void;
  accentColor: string;
}

const ModernItemCard: React.FC<ModernCardProps> = ({
  item,
  isFavorite,
  onToggleFavorite,
  onSelect,
  accentColor,
}) => {
  const { getItemQuantity, addItem, decreaseItem } = useMenuSelection();
  const quantity = getItemQuantity(item.id);
  const isSoldOut = item.availability === 'sold_out';

  return (
    <div
      onClick={() => onSelect(item)}
      id={`modern-item-${item.id}`}
      className={`relative bg-[#0e131d]/80 hover:bg-[#121824]/90 border rounded-2xl p-3 transition-all duration-200 flex items-center justify-between gap-3 cursor-pointer group shadow-sm h-[112px] ${
        quantity > 0
          ? 'border-orange-500/50 shadow-[0_2px_15px_rgba(249,115,22,0.12)]'
          : 'border-slate-800/80 hover:border-slate-700/80'
      } ${isSoldOut ? 'opacity-65' : ''}`}
    >
      {/* Content Side */}
      <div className="flex-1 min-w-0 h-full flex flex-col justify-between py-0.5">
        {/* Row 1: Title + Badges + Favorite */}
        <div className="flex items-center justify-between gap-1 min-w-0">
          <div className="flex items-center gap-1.5 min-w-0">
            <h4 className="font-black text-sm text-white group-hover:text-orange-400 transition-colors truncate">
              {item.name}
            </h4>
            {item.badge && (
              <span className="bg-orange-500/20 border border-orange-500/30 text-orange-400 text-[9px] font-bold px-1.5 py-0.5 rounded-md whitespace-nowrap shrink-0">
                {item.badge}
              </span>
            )}
            {item.isVegetarian && (
              <span className="text-[9px] text-emerald-400 bg-emerald-950/40 px-1.5 py-0.5 rounded border border-emerald-800/30 whitespace-nowrap shrink-0">
                وجترین
              </span>
            )}
          </div>

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
        <p className="text-xs text-slate-400 font-light truncate leading-normal">
          {item.description}
        </p>

        {/* Row 3: Price & Selection Control Row */}
        <div className="flex items-center justify-between pt-1 border-t border-slate-800/40">
          <span className="text-sm font-black text-orange-400 tracking-tight whitespace-nowrap">
            {formatToman(item.price)}
          </span>

          {!isSoldOut && (
            <div
              onClick={(e) => e.stopPropagation()}
              className="flex items-center"
            >
              {quantity === 0 ? (
                <button
                  onClick={() => addItem(item.id)}
                  className="px-2.5 py-1 rounded-xl text-xs font-black bg-orange-500 hover:bg-orange-400 text-white flex items-center gap-1 active:scale-95 transition-all shadow-sm cursor-pointer"
                  aria-label={`افزودن ${item.name}`}
                >
                  <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
                  <span>افزودن</span>
                </button>
              ) : (
                <div className="flex items-center gap-1 bg-slate-950 border border-orange-500/40 rounded-xl p-0.5 shadow">
                  <button
                    onClick={() => decreaseItem(item.id)}
                    className="w-6 h-6 rounded-lg bg-slate-800 text-white flex items-center justify-center active:scale-95 cursor-pointer"
                    aria-label="کاهش"
                  >
                    {quantity === 1 ? <Trash2 className="w-3 h-3 text-rose-400" /> : <Minus className="w-3 h-3" />}
                  </button>
                  <span className="w-5 text-center text-xs font-black text-orange-400">
                    {toPersianDigits(quantity)}
                  </span>
                  <button
                    onClick={() => addItem(item.id)}
                    className="w-6 h-6 rounded-lg bg-orange-500 text-white font-bold flex items-center justify-center active:scale-95 cursor-pointer"
                    aria-label="افزایش"
                  >
                    <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Product Image on Left side (RTL) */}
      <div className="relative w-24 h-24 rounded-xl overflow-hidden bg-slate-950 shrink-0 border border-slate-800">
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
            <span className="text-[10px] font-bold text-slate-300 text-center px-1">ناموجود</span>
          </div>
        )}
      </div>
    </div>
  );
};
