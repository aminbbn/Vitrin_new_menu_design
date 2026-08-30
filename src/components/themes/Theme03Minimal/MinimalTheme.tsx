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
import { useMenuSelection } from '../../../context/MenuSelectionContext';

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
  const [viewState, setViewState] = useState<'hero' | 'menu'>(initialState);
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);
  const [isInfoOpen, setIsInfoOpen] = useState(false);
  const [isCategorySheetOpen, setIsCategorySheetOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState<string>(restaurant.categories[0]?.id || '');
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearch, setShowSearch] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (initialState !== viewState) {
      setViewState(initialState);
    }
  }, [initialState]);

  const handleEnterMenu = () => {
    setViewState('menu');
    onStateChange?.('menu');
  };

  const handleResetToHero = () => {
    setViewState('hero');
    onStateChange?.('hero');
    if (containerRef.current) {
      containerRef.current.scrollTo({ top: 0, behavior: 'smooth' });
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Category Intersection Observer
  useEffect(() => {
    if (viewState !== 'menu') return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const catId = entry.target.getAttribute('data-category-id');
            if (catId) setActiveCategory(catId);
          }
        });
      },
      { rootMargin: '-100px 0px -70% 0px', threshold: 0.1 }
    );

    restaurant.categories.forEach((cat) => {
      const el = document.getElementById(`minimal-cat-${cat.id}`);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [viewState, restaurant.categories]);

  const handleCategoryClick = (catId: string) => {
    setActiveCategory(catId);
    const target = document.getElementById(`minimal-cat-${catId}`);
    if (target) {
      const navHeight = 85;
      const top = target.getBoundingClientRect().top + window.pageYOffset - navHeight;
      window.scrollTo({ top, behavior: 'smooth' });
    }
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
  const transitionDuration = (config.hero?.transitionDurationMs || 600) / 1000;

  return (
    <div
      ref={containerRef}
      dir="rtl"
      className="min-h-screen bg-[#0d1317] text-neutral-200 font-sans selection:bg-teal-500/20"
      style={{
        backgroundColor: config.bgColor,
        color: config.textColor,
      }}
    >
      {/* ------------------------------------------------------------------ */}
      {/* UNIFIED MORPHING HERO → COMPACT HEADER CONTAINER                   */}
      {/* ------------------------------------------------------------------ */}
      <motion.div
        layout
        transition={{
          duration: transitionDuration,
          ease: [0.25, 1, 0.5, 1],
        }}
        className={`relative w-full z-40 transition-colors ${
          viewState === 'hero'
            ? 'min-h-[92vh] sm:min-h-screen flex flex-col justify-between overflow-hidden'
            : 'sticky top-0 bg-[#0d1317]/95 backdrop-blur-md border-b border-neutral-800 shadow-md'
        }`}
      >
        {/* Subtle Ambient Glow Layer */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Top Header Bar (Shared elements) */}
        <div className="relative z-10 w-full px-4 sm:px-6 py-3.5 max-w-xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <motion.div
              layoutId="minimal-brand-logo"
              transition={{ duration: transitionDuration, ease: [0.25, 1, 0.5, 1] }}
              className={`rounded-xl overflow-hidden bg-neutral-900 border border-teal-500/30 flex-shrink-0 transition-all ${
                viewState === 'hero' ? 'w-11 h-11 sm:w-13 sm:h-13' : 'w-8 h-8 sm:w-9 sm:h-9'
              }`}
            >
              <img
                src={restaurant.logo}
                alt={restaurant.name}
                className="w-full h-full object-cover"
              />
            </motion.div>

            <motion.div
              layoutId="minimal-brand-text"
              transition={{ duration: transitionDuration, ease: [0.25, 1, 0.5, 1] }}
            >
              <h1 className={`font-bold tracking-tight text-white transition-all ${
                viewState === 'hero' ? 'text-base sm:text-lg' : 'text-sm sm:text-base'
              }`}>
                {restaurant.name}
              </h1>
              <p className="text-[10px] text-teal-400 font-medium">
                {restaurant.cuisine}
              </p>
            </motion.div>
          </div>

          <div className="flex items-center gap-2">
            {/* Search in Menu */}
            {viewState === 'menu' && (
              <motion.button
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                onClick={() => setShowSearch(!showSearch)}
                className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors cursor-pointer ${
                  showSearch ? 'bg-teal-400 text-black' : 'bg-neutral-900 border border-neutral-800 text-neutral-300 hover:text-white'
                }`}
                aria-label="جستجو در منو"
              >
                <Search className="w-4 h-4" />
              </motion.button>
            )}

            {/* Info Trigger */}
            <button
              onClick={() => setIsInfoOpen(true)}
              id="minimal-header-info-btn"
              className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-neutral-900 border border-neutral-800 flex items-center justify-center text-neutral-300 hover:text-white active:scale-95 transition-all cursor-pointer"
              aria-label="اطلاعات رستوران"
            >
              <Info className="w-4 h-4 text-teal-300" />
            </button>

            {/* Return to Hero CTA in Menu State */}
            {viewState === 'menu' && (
              <motion.button
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                onClick={handleResetToHero}
                id="minimal-reset-btn"
                className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-neutral-900 border border-teal-500/30 text-teal-300 text-xs font-semibold hover:bg-neutral-800 active:scale-95 cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span className="text-[11px]">معرفی</span>
              </motion.button>
            )}
          </div>
        </div>

        {/* Hero Architectural Layout */}
        <AnimatePresence>
          {viewState === 'hero' && (
            <motion.div
              key="minimal-hero-body"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -30, transition: { duration: 0.3 } }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="relative z-10 px-6 py-8 sm:py-12 max-w-xl mx-auto w-full flex flex-col justify-between space-y-8 flex-1"
            >
              {/* Minimal Hero Card with Clean Typography */}
              <div className="space-y-6 my-auto text-right">
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

              {/* Minimalist Action Button */}
              <div className="pt-4 pb-4">
                <button
                  onClick={handleEnterMenu}
                  id="minimal-enter-menu-btn"
                  className="w-full py-4 px-6 rounded-xl bg-teal-400 hover:bg-teal-300 text-neutral-950 font-extrabold text-base active:scale-[0.98] transition-all flex items-center justify-between cursor-pointer shadow-lg shadow-teal-950/40"
                >
                  <span>{config.hero.ctaText}</span>
                  <ChevronDown className="w-5 h-5" />
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Search Bar in Menu View */}
        {viewState === 'menu' && showSearch && (
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

        {/* Compact Category Indicator in Menu View */}
        {viewState === 'menu' && (
          <div className="w-full py-2 px-4 border-t border-neutral-800 bg-neutral-900/70">
            <div className="max-w-xl mx-auto flex items-center justify-between gap-3">
              <button
                onClick={() => setIsCategorySheetOpen(true)}
                id="minimal-all-cats-btn"
                className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold bg-neutral-800 text-teal-300 border border-neutral-700 active:scale-95 transition-all cursor-pointer"
              >
                <Layers className="w-3.5 h-3.5" />
                <span>دسته‌ها: {activeCategoryObj?.name || 'همه'}</span>
                <ChevronDown className="w-3.5 h-3.5" />
              </button>

              <div className="text-[11px] text-neutral-400 font-medium">
                {toPersianDigits(restaurant.items.length)} آیتم
              </div>
            </div>
          </div>
        )}
      </motion.div>

      {/* ------------------------------------------------------------------ */}
      {/* ACTUAL MENU STATE (Clean Line-Item Architectural List)             */}
      {/* ------------------------------------------------------------------ */}
      {viewState === 'menu' && (
        <motion.div
          key="minimal-menu-body"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, ease: 'easeOut', delay: 0.15 }}
          className="w-full min-h-screen pb-28"
        >
          <main className="max-w-xl mx-auto px-4 pt-6 space-y-10">
            {restaurant.categories.map((category) => {
              const items = filteredItems.filter((i) => i.categoryId === category.id);
              if (items.length === 0) return null;

              return (
                <section
                  key={category.id}
                  id={`minimal-cat-${category.id}`}
                  data-category-id={category.id}
                  className="space-y-4 scroll-mt-24"
                >
                  <div className="flex items-baseline justify-between border-b border-neutral-800 pb-2">
                    <h3 className="font-bold text-base text-white tracking-tight">
                      {category.name}
                    </h3>
                    <span className="text-[11px] text-neutral-500 font-light">
                      {toPersianDigits(items.length)}
                    </span>
                  </div>

                  <div className="divide-y divide-neutral-900">
                    {items.map((item) => (
                      <MinimalItemRow
                        key={item.id}
                        item={item}
                        onSelect={setSelectedItem}
                        accentColor={config.accentColor}
                      />
                    ))}
                  </div>
                </section>
              );
            })}
          </main>
        </motion.div>
      )}

      {/* Floating Category Navigation Capsule Button */}
      {viewState === 'menu' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="fixed bottom-20 right-4 z-30"
        >
          <button
            onClick={() => setIsCategorySheetOpen(true)}
            id="minimal-floating-category-btn"
            className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-neutral-900/95 backdrop-blur-md border border-teal-500/40 text-teal-300 shadow-2xl active:scale-95 transition-all text-xs font-bold cursor-pointer"
          >
            <Layers className="w-4 h-4 text-teal-400" />
            <span>دسته‌ها</span>
          </button>
        </motion.div>
      )}

      {/* Floating Back to Top Button */}
      {viewState === 'menu' && (
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="fixed bottom-20 left-4 z-30 w-10 h-10 rounded-full bg-neutral-900/90 backdrop-blur-md border border-neutral-800 text-neutral-400 flex items-center justify-center hover:bg-neutral-800 active:scale-95 shadow-xl transition-all"
          aria-label="بازگشت به بالای منو"
        >
          <ArrowUp className="w-4 h-4" />
        </button>
      )}

      {/* Selection Components */}
      <MenuSelectionBar accentColor={config.accentColor} themeId="minimal" />
      <MenuSelectionSheet accentColor={config.accentColor} />

      {/* Category Bottom Sheet */}
      <CategoryBottomSheet
        isOpen={isCategorySheetOpen}
        onClose={() => setIsCategorySheetOpen(false)}
        categories={restaurant.categories}
        items={restaurant.items}
        activeCategoryId={activeCategory}
        onSelectCategory={handleCategoryClick}
        accentColor={config.accentColor}
      />

      {/* Modals */}
      <ProductDetailModal
        item={selectedItem}
        onClose={() => setSelectedItem(null)}
        accentColor={config.accentColor}
      />

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
/* Subcomponent: Minimal Architectural Row Item                               */
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
      className={`py-3.5 flex items-center justify-between gap-4 cursor-pointer group hover:bg-neutral-900/40 rounded-xl px-2 transition-colors ${
        isSoldOut ? 'opacity-55' : ''
      }`}
    >
      <div className="flex-1 min-w-0 space-y-1">
        <div className="flex items-center gap-2">
          <h4 className="font-semibold text-sm text-white group-hover:text-teal-300 transition-colors truncate">
            {item.name}
          </h4>
          {item.badge && (
            <span className="text-[10px] text-teal-400 bg-teal-950/60 px-1.5 py-0.5 rounded border border-teal-800/40">
              {item.badge}
            </span>
          )}
        </div>

        <p className="text-xs text-neutral-400 line-clamp-1 font-light">
          {item.description}
        </p>

        <div className="text-xs font-bold text-teal-400 pt-0.5">
          {formatToman(item.price)}
        </div>
      </div>

      {/* Selection Control */}
      {!isSoldOut && (
        <div onClick={(e) => e.stopPropagation()} className="flex items-center">
          {quantity === 0 ? (
            <button
              onClick={() => addItem(item.id)}
              className="w-8 h-8 rounded-lg bg-neutral-900 border border-neutral-700 hover:border-teal-400 text-neutral-300 hover:text-teal-300 flex items-center justify-center active:scale-95 transition-all cursor-pointer"
              title="افزودن به انتخاب‌ها"
            >
              <Plus className="w-4 h-4" />
            </button>
          ) : (
            <div className="flex items-center gap-1 bg-neutral-900 border border-neutral-700 rounded-lg p-0.5">
              <button
                onClick={() => decreaseItem(item.id)}
                className="w-6 h-6 rounded bg-neutral-800 text-white flex items-center justify-center active:scale-95"
              >
                {quantity === 1 ? <Trash2 className="w-3 h-3 text-rose-400" /> : <Minus className="w-3 h-3" />}
              </button>
              <span className="w-5 text-center text-xs font-bold text-white">
                {toPersianDigits(quantity)}
              </span>
              <button
                onClick={() => addItem(item.id)}
                className="w-6 h-6 rounded bg-teal-400 text-black font-bold flex items-center justify-center active:scale-95"
              >
                <Plus className="w-3 h-3" />
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
