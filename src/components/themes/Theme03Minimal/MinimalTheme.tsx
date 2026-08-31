import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ChevronDown,
  Info,
  RotateCcw,
  Search,
  ArrowUp,
  MapPin,
  Clock,
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
  const transitionDuration = (config.hero?.transitionDurationMs || 650) / 1000;
  const { viewState, isMenuMode, enterMenu, returnToHero } = useHeroTransition({
    initialState,
    onStateChange,
    transitionDurationMs: config.hero?.transitionDurationMs || 650,
  });

  const { getScrollContainer, scrollToElement } = useMenuViewport();

  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);
  const [isInfoOpen, setIsInfoOpen] = useState(false);
  const [isCategorySheetOpen, setIsCategorySheetOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState<string>(restaurant.categories[0]?.id || '');
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearch, setShowSearch] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);

  // Category Intersection Observer
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
        rootMargin: '-80px 0px -70% 0px',
        threshold: 0.1,
      }
    );

    restaurant.categories.forEach((cat) => {
      const el = document.getElementById(`minimal-cat-${cat.id}`);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [isMenuMode, restaurant.categories, getScrollContainer]);

  const handleCategoryClick = (catId: string) => {
    setActiveCategory(catId);
    scrollToElement(`minimal-cat-${catId}`, 75);
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
      className="min-h-screen bg-[#0a0f12] text-neutral-200 font-sans relative selection:bg-teal-500/20"
      style={{
        backgroundColor: config.bgColor || '#0a0f12',
        color: config.textColor,
      }}
    >
      {/* Ambient Animated Atmospheric Glow Layer */}
      <AmbientBackground theme="minimal" accentColor={config.accentColor || '#2dd4bf'} />

      {/* ------------------------------------------------------------------ */}
      {/* 1. CONTINUOUS HERO CONTAINER (Moves upward like a curtain/shutter) */}
      {/* ------------------------------------------------------------------ */}
      <motion.div
        layout
        initial={false}
        animate={{
          height: isMenuMode ? '230px' : 'var(--menu-viewport-height, 100dvh)',
        }}
        transition={{
          duration: transitionDuration,
          ease: [0.22, 1, 0.36, 1],
        }}
        className="relative z-10 w-full overflow-hidden flex flex-col justify-between"
      >
        {/* Ambient Glow / Background Layer */}
        <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
          <img
            src={restaurant.heroImage}
            alt={restaurant.name}
            className="w-full h-full object-cover object-center filter brightness-[0.7]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0d1317] via-[#0d1317]/60 to-black/50" />
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />
        </div>

        {/* Top Header Bar Area */}
        <div className="relative z-10 w-full px-4 sm:px-6 pt-4 max-w-xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl overflow-hidden bg-neutral-900 border border-teal-500/30 flex-shrink-0">
              <img
                src={restaurant.logo}
                alt={restaurant.name}
                className="w-full h-full object-cover"
              />
            </div>

            <div>
              <h1 className="font-bold tracking-tight text-white text-base sm:text-lg">
                {restaurant.name}
              </h1>
              <p className="text-[11px] text-teal-400 font-medium">
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
                id="minimal-reset-btn"
                className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-neutral-900 border border-teal-500/30 text-teal-300 text-xs font-semibold hover:bg-neutral-800 active:scale-95 cursor-pointer shadow"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span className="text-[11px]">معرفی</span>
              </motion.button>
            )}

            <button
              onClick={() => setIsInfoOpen(true)}
              id="minimal-header-info-btn"
              className="w-9 h-9 rounded-full bg-neutral-900 border border-neutral-700/80 flex items-center justify-center text-neutral-300 hover:text-white active:scale-95 transition-all cursor-pointer shadow"
              aria-label="اطلاعات رستوران"
            >
              <Info className="w-4 h-4 text-teal-300" />
            </button>
          </div>
        </div>

        {/* Hero Architectural Layout */}
        <AnimatePresence>
          {!isMenuMode && (
            <motion.div
              key="minimal-hero-body"
              initial={{ opacity: 1, y: 0 }}
              exit={{
                opacity: 0,
                y: -60,
                transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] },
              }}
              transition={{ duration: 0.5 }}
              className="relative z-10 px-6 py-6 max-w-xl mx-auto w-full flex flex-col justify-between space-y-6 my-auto"
            >
              <div className="space-y-4 text-right">
                <div className="inline-block px-3 py-1 rounded-full bg-teal-950/60 border border-teal-800/40 text-teal-300 text-[11px] font-medium">
                  منوی رستوران و کافه
                </div>

                <h2 className="text-3xl sm:text-4xl font-extrabold text-white leading-tight tracking-tight">
                  {config.hero.headline}
                </h2>

                <p className="text-xs sm:text-sm text-neutral-400 leading-relaxed font-light">
                  {config.hero.subheadline}
                </p>

                {/* Minimal Meta Items */}
                <div className="pt-2 border-t border-neutral-800/80 grid grid-cols-2 gap-4 text-xs">
                  <div>
                    <span className="text-neutral-500 block text-[10px] mb-0.5">ساعات فعالیت</span>
                    <span className="font-semibold text-neutral-200">{toPersianDigits(restaurant.workingHours)}</span>
                  </div>
                  <div>
                    <span className="text-neutral-500 block text-[10px] mb-0.5">موقعیت</span>
                    <span className="font-semibold text-neutral-200">{restaurant.neighborhood}</span>
                  </div>
                </div>
              </div>

              {/* Minimalist Action Button with Tactile Feedback */}
              <div className="pt-2">
                <motion.button
                  whileTap={{ scale: 0.97 }}
                  onClick={() => enterMenu('cta')}
                  id="minimal-enter-menu-btn"
                  className="w-full py-4 px-6 rounded-xl bg-teal-400 hover:bg-teal-300 text-neutral-950 font-extrabold text-base active:scale-[0.98] transition-all flex items-center justify-between cursor-pointer shadow-lg shadow-teal-950/40"
                >
                  <span>{config.hero.ctaText}</span>
                  <ChevronDown className="w-5 h-5" />
                </motion.button>
              </div>

              <div className="text-neutral-400 text-xs font-light text-center">
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
            className="relative z-10 w-full px-4 sm:px-6 pb-3 max-w-xl mx-auto flex items-center justify-between text-xs text-neutral-300 border-t border-white/10 pt-2"
          >
            <div className="flex items-center gap-2 font-medium">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>پذیرایی حضوری • {toPersianDigits(restaurant.workingHours)}</span>
            </div>
            <div className="text-teal-300 font-medium">
              {toPersianDigits(restaurant.items.length)} آیتم
            </div>
          </motion.div>
        )}
      </motion.div>

      {/* ------------------------------------------------------------------ */}
      {/* 2. STICKY CATEGORY NAVIGATOR & SEARCH                              */}
      {/* ------------------------------------------------------------------ */}
      <div className="sticky top-0 z-30 bg-[#0d1317]/95 backdrop-blur-md border-y border-neutral-800 shadow-md">
        <div className="max-w-xl mx-auto px-4 py-2.5 flex items-center justify-between gap-3">
          <button
            onClick={() => setIsCategorySheetOpen(true)}
            id="minimal-all-cats-btn"
            className="flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-bold bg-neutral-800 text-teal-300 border border-neutral-700 active:scale-95 transition-all cursor-pointer"
          >
            <Layers className="w-3.5 h-3.5" />
            <span>دسته‌بندی: {activeCategoryObj?.name || 'همه دسته‌ها'}</span>
            <ChevronDown className="w-3.5 h-3.5" />
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowSearch(!showSearch)}
              className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors cursor-pointer ${
                showSearch ? 'bg-teal-400 text-black' : 'bg-neutral-900 border border-neutral-800 text-neutral-300 hover:text-white'
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
              className="px-4 pb-3 max-w-xl mx-auto w-full"
            >
              <div className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="جستجوی عنوان یا ترکیبات غذا..."
                  className="w-full bg-neutral-900 border border-neutral-700 rounded-xl px-4 py-2 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-teal-400"
                  autoFocus
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute left-3 top-2 text-xs text-neutral-400 hover:text-white"
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
      {/* 3. MENU STREAM CONTENT (Architectural Minimalist Reading)          */}
      {/* ------------------------------------------------------------------ */}
      <main className="max-w-xl mx-auto px-4 pt-6 space-y-10 pb-28 relative z-10">
        {restaurant.categories.map((category) => {
          const items = filteredItems.filter((i) => i.categoryId === category.id);
          if (items.length === 0) return null;

          return (
            <section
              key={category.id}
              id={`minimal-cat-${category.id}`}
              data-category-id={category.id}
              className="space-y-3 scroll-mt-20"
            >
              {/* Architectural Category Header */}
              <div className="flex items-baseline justify-between border-b border-neutral-800/80 pb-2">
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-teal-400" />
                  <h3 className="font-bold text-base text-white tracking-tight">
                    {category.name}
                  </h3>
                </div>
                <span className="text-[11px] text-teal-400/80 font-medium">
                  {toPersianDigits(items.length)} عنوان
                </span>
              </div>

              {/* Borderless Typographic Rows */}
              <div className="divide-y divide-neutral-900/80">
                {items.map((item) => (
                  <MinimalItemRow
                    key={item.id}
                    item={item}
                    onSelect={setSelectedItem}
                    accentColor={config.accentColor || '#2dd4bf'}
                  />
                ))}
              </div>
            </section>
          );
        })}
      </main>

      {/* Floating Bottom-Docked Scroll To Top Button (Accounting for Selection Bar) */}
      <ScrollToTopButton accentColor={config.accentColor || '#2dd4bf'} themeId="minimal" />

      {/* Selection Components */}
      <MenuSelectionBar accentColor={config.accentColor || '#2dd4bf'} themeId="minimal" />
      <MenuSelectionSheet accentColor={config.accentColor || '#2dd4bf'} />

      {/* Category Bottom Sheet */}
      <CategoryBottomSheet
        isOpen={isCategorySheetOpen}
        onClose={() => setIsCategorySheetOpen(false)}
        categories={restaurant.categories}
        items={restaurant.items}
        activeCategoryId={activeCategory}
        onSelectCategory={handleCategoryClick}
        accentColor={config.accentColor || '#2dd4bf'}
      />

      {/* Modals */}
      <ProductDetailModal
        item={selectedItem}
        onClose={() => setSelectedItem(null)}
        accentColor={config.accentColor || '#2dd4bf'}
      />

      <RestaurantInfoModal
        restaurant={restaurant}
        isOpen={isInfoOpen}
        onClose={() => setIsInfoOpen(false)}
        accentColor={config.accentColor || '#2dd4bf'}
      />
    </div>
  );
};

/* -------------------------------------------------------------------------- */
/* Subcomponent: Minimal Architectural Row Item (Theme 03: Read The Menu)     */
/* -------------------------------------------------------------------------- */
interface MinimalItemProps {
  item: MenuItem;
  onSelect: (item: MenuItem) => void;
  accentColor: string;
}

const MinimalItemRow: React.FC<MinimalItemProps> = ({ item, onSelect, accentColor }) => {
  const { getItemQuantity, addItem, decreaseItem } = useMenuSelection();
  const quantity = getItemQuantity(item.id);
  const isSoldOut = item.availability === 'sold_out';

  return (
    <div
      onClick={() => onSelect(item)}
      id={`minimal-item-${item.id}`}
      className={`py-3 px-2.5 rounded-xl transition-all duration-200 flex items-center justify-between gap-3.5 cursor-pointer group ${
        quantity > 0
          ? 'bg-teal-950/20 border-r-2 border-teal-400/90 pl-3'
          : 'hover:bg-neutral-900/50'
      } ${isSoldOut ? 'opacity-55' : ''}`}
    >
      {/* Content Side */}
      <div className="flex-1 min-w-0 space-y-1">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-1.5 min-w-0">
            <h4 className="font-semibold text-sm sm:text-base text-white group-hover:text-teal-300 transition-colors truncate">
              {item.name}
            </h4>
            {item.badge && (
              <span className="text-[10px] text-teal-300 bg-teal-950/70 px-1.5 py-0.5 rounded border border-teal-700/40 whitespace-nowrap shrink-0">
                {item.badge}
              </span>
            )}
            {item.isVegetarian && (
              <span className="text-[10px] text-emerald-400 bg-emerald-950/40 px-1.5 py-0.5 rounded border border-emerald-800/40 whitespace-nowrap shrink-0">
                وجترین
              </span>
            )}
          </div>

          <div className="text-xs sm:text-sm font-bold text-teal-300 shrink-0 tracking-tight whitespace-nowrap">
            {formatToman(item.price)}
          </div>
        </div>

        {/* Strict Single-Line Description */}
        <p className="text-xs text-neutral-400 font-light truncate leading-normal">
          {item.description}
        </p>
      </div>

      {/* Clean Architectural Thumbnail */}
      <div className="relative w-14 h-14 sm:w-16 sm:h-16 rounded-lg overflow-hidden bg-neutral-950 shrink-0 border border-neutral-800">
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
            <span className="text-[9px] font-bold text-neutral-300">ناموجود</span>
          </div>
        )}
      </div>

      {/* Selection Control (Zero layout shift) */}
      {!isSoldOut && (
        <div onClick={(e) => e.stopPropagation()} className="flex items-center shrink-0">
          {quantity === 0 ? (
            <button
              onClick={() => addItem(item.id)}
              className="w-8 h-8 rounded-lg bg-neutral-900/90 border border-neutral-700 hover:border-teal-400 text-neutral-300 hover:text-teal-300 flex items-center justify-center active:scale-95 transition-all cursor-pointer shadow-sm"
              title="افزودن به انتخاب‌ها"
              aria-label={`افزودن ${item.name}`}
            >
              <Plus className="w-4 h-4 stroke-[2]" />
            </button>
          ) : (
            <div className="flex items-center gap-1 bg-[#090d10] border border-teal-500/40 rounded-lg p-0.5 shadow">
              <button
                onClick={() => decreaseItem(item.id)}
                className="w-6 h-6 rounded bg-neutral-800 hover:bg-neutral-700 text-white flex items-center justify-center active:scale-95 cursor-pointer"
                aria-label="کاهش"
              >
                {quantity === 1 ? <Trash2 className="w-3 h-3 text-rose-400" /> : <Minus className="w-3 h-3" />}
              </button>
              <span className="w-5 text-center text-xs font-bold text-teal-300">
                {toPersianDigits(quantity)}
              </span>
              <button
                onClick={() => addItem(item.id)}
                className="w-6 h-6 rounded bg-teal-400 text-neutral-950 font-bold flex items-center justify-center active:scale-95 cursor-pointer"
                aria-label="افزایش"
              >
                <Plus className="w-3 h-3 stroke-[2.5]" />
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
