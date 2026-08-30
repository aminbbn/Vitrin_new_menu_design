import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ChevronDown,
  Info,
  RotateCcw,
  Search,
  Flame,
  Clock,
  Sparkles,
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
import { useMenuSelection } from '../../../context/MenuSelectionContext';

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
  const [viewState, setViewState] = useState<'hero' | 'menu'>(initialState);
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);
  const [isInfoOpen, setIsInfoOpen] = useState(false);
  const [isCategorySheetOpen, setIsCategorySheetOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState<string>(restaurant.categories[0]?.id || '');
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearch, setShowSearch] = useState(false);
  const [favorites, setFavorites] = useState<Set<string>>(new Set());

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

  // Intersection Observer for scroll tracking
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
      { rootMargin: '-100px 0px -65% 0px', threshold: 0.1 }
    );

    restaurant.categories.forEach((cat) => {
      const el = document.getElementById(`modern-cat-${cat.id}`);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [viewState, restaurant.categories]);

  const handleCategoryClick = (catId: string) => {
    setActiveCategory(catId);
    const target = document.getElementById(`modern-cat-${catId}`);
    if (target) {
      const navHeight = 90;
      const top = target.getBoundingClientRect().top + window.pageYOffset - navHeight;
      window.scrollTo({ top, behavior: 'smooth' });
    }
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
  const transitionDuration = (config.hero?.transitionDurationMs || 650) / 1000;

  return (
    <div
      ref={containerRef}
      dir="rtl"
      className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-orange-500/20"
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
            ? 'min-h-screen flex flex-col justify-between overflow-hidden'
            : 'sticky top-0 bg-slate-950/95 backdrop-blur-md border-b border-slate-800 shadow-xl'
        }`}
      >
        {/* Background Visual Layer */}
        <motion.div
          layout
          className={`absolute inset-0 z-0 overflow-hidden pointer-events-none transition-opacity duration-700 ${
            viewState === 'hero' ? 'opacity-100' : 'opacity-20'
          }`}
        >
          <img
            src={restaurant.secondaryHeroImage || restaurant.heroImage}
            alt={restaurant.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-slate-950/40" />
        </motion.div>

        {/* Top Header Bar (Shared elements) */}
        <div className="relative z-10 w-full px-4 sm:px-6 py-3 max-w-2xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2.5 sm:gap-3">
            <motion.div
              layoutId="modern-brand-logo"
              transition={{ duration: transitionDuration, ease: [0.25, 1, 0.5, 1] }}
              className={`rounded-2xl overflow-hidden bg-slate-900 p-0.5 border border-orange-500/40 shadow-xl flex-shrink-0 transition-all ${
                viewState === 'hero' ? 'w-12 h-12 sm:w-14 sm:h-14' : 'w-9 h-9 sm:w-10 sm:h-10'
              }`}
            >
              <img
                src={restaurant.logo}
                alt={restaurant.name}
                className="w-full h-full object-cover rounded-xl"
              />
            </motion.div>

            <motion.div
              layoutId="modern-brand-text"
              transition={{ duration: transitionDuration, ease: [0.25, 1, 0.5, 1] }}
            >
              <h1 className={`font-bold text-white tracking-tight transition-all ${
                viewState === 'hero' ? 'text-base sm:text-lg' : 'text-sm sm:text-base'
              }`}>
                {restaurant.name}
              </h1>
              <p className="text-[10px] sm:text-xs text-orange-400 font-medium">
                {restaurant.cuisine} • {restaurant.neighborhood}
              </p>
            </motion.div>
          </div>

          <div className="flex items-center gap-1.5 sm:gap-2">
            {/* Search Toggle in Menu */}
            {viewState === 'menu' && (
              <motion.button
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                onClick={() => setShowSearch(!showSearch)}
                className={`w-8 h-8 sm:w-9 sm:h-9 rounded-full flex items-center justify-center transition-colors cursor-pointer ${
                  showSearch ? 'bg-orange-500 text-white' : 'bg-slate-900 border border-slate-800 text-slate-300 hover:text-white'
                }`}
                aria-label="جستجو در منو"
              >
                <Search className="w-4 h-4" />
              </motion.button>
            )}

            {/* Info button */}
            <button
              onClick={() => setIsInfoOpen(true)}
              id="modern-header-info-btn"
              className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-slate-900/90 border border-slate-800 flex items-center justify-center text-slate-300 hover:text-white active:scale-95 transition-all cursor-pointer"
              aria-label="اطلاعات رستوران"
            >
              <Info className="w-4 h-4 text-orange-400" />
            </button>

            {/* Return to Hero CTA in Menu State */}
            {viewState === 'menu' && (
              <motion.button
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                onClick={handleResetToHero}
                id="modern-reset-btn"
                className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-orange-500/10 text-orange-400 border border-orange-500/30 text-xs font-semibold hover:bg-orange-500/20 active:scale-95 cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span className="text-[11px]">هیرو</span>
              </motion.button>
            )}
          </div>
        </div>

        {/* Hero Body Content */}
        <AnimatePresence>
          {viewState === 'hero' && (
            <motion.div
              key="modern-hero-body"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -30, transition: { duration: 0.3 } }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="relative z-10 px-6 py-8 max-w-lg mx-auto w-full flex flex-col justify-between space-y-6 flex-1"
            >
              <div className="space-y-4 text-center sm:text-right my-auto">
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

              {/* Main Entry Button */}
              <div className="pt-2 pb-6">
                <button
                  onClick={handleEnterMenu}
                  id="modern-enter-menu-btn"
                  className="w-full py-4 px-6 rounded-2xl bg-orange-500 hover:bg-orange-400 text-white font-extrabold text-base shadow-[0_10px_25px_rgba(249,115,22,0.35)] active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer"
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

        {/* Compact Category Indicator & Trigger in Menu View */}
        {viewState === 'menu' && (
          <div className="w-full py-2 px-4 border-t border-slate-900 bg-slate-900/90">
            <div className="max-w-2xl mx-auto flex items-center justify-between gap-3">
              <button
                onClick={() => setIsCategorySheetOpen(true)}
                id="modern-all-cats-btn"
                className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-bold bg-orange-500 text-white shadow-md shadow-orange-500/25 active:scale-95 transition-all cursor-pointer"
              >
                <Layers className="w-3.5 h-3.5" />
                <span>دسته‌ها: {activeCategoryObj?.name || 'همه'}</span>
                <ChevronDown className="w-3.5 h-3.5" />
              </button>

              <div className="text-[11px] text-slate-400 font-medium">
                {toPersianDigits(restaurant.items.length)} آیتم منو
              </div>
            </div>
          </div>
        )}
      </motion.div>

      {/* ------------------------------------------------------------------ */}
      {/* ACTUAL MENU STATE FEED                                             */}
      {/* ------------------------------------------------------------------ */}
      {viewState === 'menu' && (
        <motion.div
          key="modern-menu-body"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, ease: 'easeOut', delay: 0.15 }}
          className="w-full min-h-screen pb-28"
        >
          <main className="max-w-2xl mx-auto px-4 pt-4 space-y-8">
            {restaurant.categories.map((category) => {
              const items = filteredItems.filter((i) => i.categoryId === category.id);
              if (items.length === 0) return null;

              return (
                <section
                  key={category.id}
                  id={`modern-cat-${category.id}`}
                  data-category-id={category.id}
                  className="space-y-3.5 scroll-mt-28"
                >
                  <div className="flex items-center justify-between pb-1 border-b border-slate-800">
                    <h3 className="font-extrabold text-base text-white flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-orange-500" />
                      {category.name}
                    </h3>
                    <span className="text-xs text-slate-400 font-medium">
                      {toPersianDigits(items.length)} آیتم
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {items.map((item) => {
                      const isFav = favorites.has(item.id);
                      return (
                        <ModernItemCard
                          key={item.id}
                          item={item}
                          isFavorite={isFav}
                          onToggleFavorite={(e) => toggleFavorite(e, item.id)}
                          onSelect={setSelectedItem}
                          accentColor={config.accentColor}
                        />
                      );
                    })}
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
            id="modern-floating-category-btn"
            className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-slate-900/95 backdrop-blur-md border border-orange-500/40 text-orange-400 shadow-2xl active:scale-95 transition-all text-xs font-bold cursor-pointer"
          >
            <Layers className="w-4 h-4 text-orange-400" />
            <span>دسته‌ها</span>
          </button>
        </motion.div>
      )}

      {/* Floating Back to Top Button */}
      {viewState === 'menu' && (
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="fixed bottom-20 left-4 z-30 w-10 h-10 rounded-full bg-slate-900/90 backdrop-blur-md border border-slate-700 text-slate-300 flex items-center justify-center hover:bg-slate-800 active:scale-95 shadow-xl transition-all"
          aria-label="بازگشت به بالای منو"
        >
          <ArrowUp className="w-4 h-4" />
        </button>
      )}

      {/* Selection Components */}
      <MenuSelectionBar accentColor={config.accentColor} themeId="modern" />
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
/* Subcomponent: Modern Card Design                                           */
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
      className={`relative bg-slate-900/90 hover:bg-slate-900 border border-slate-800/80 rounded-2xl p-3 sm:p-3.5 transition-all flex flex-col justify-between cursor-pointer group shadow-sm hover:shadow-md ${
        isSoldOut ? 'opacity-65' : ''
      }`}
    >
      <div className="flex gap-3 items-start">
        {/* Thumbnail Image */}
        <div className="relative w-20 h-20 sm:w-22 sm:h-22 rounded-xl overflow-hidden bg-slate-950 flex-shrink-0 border border-slate-800">
          <img
            src={item.image}
            alt={item.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            loading="lazy"
          />
          {item.badge && (
            <span className="absolute top-1 right-1 bg-orange-500 text-white text-[9px] font-bold px-1.5 py-0.5 rounded shadow">
              {item.badge}
            </span>
          )}
        </div>

        {/* Content Side */}
        <div className="flex-1 min-w-0 space-y-1">
          <div className="flex items-start justify-between gap-1">
            <h4 className="font-bold text-sm text-white group-hover:text-orange-400 transition-colors truncate">
              {item.name}
            </h4>

            {/* Favorite button */}
            <button
              onClick={onToggleFavorite}
              className="text-slate-500 hover:text-rose-500 transition-colors p-0.5"
              aria-label="نشان کردن"
            >
              <Heart
                className={`w-3.5 h-3.5 ${
                  isFavorite ? 'fill-rose-500 text-rose-500' : 'text-slate-500'
                }`}
              />
            </button>
          </div>

          <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed font-light">
            {item.description}
          </p>
        </div>
      </div>

      {/* Footer Price & Add Button */}
      <div className="flex items-center justify-between pt-2.5 mt-2 border-t border-slate-800/60">
        <span className="text-sm font-bold text-orange-400 tracking-tight">
          {formatToman(item.price)}
        </span>

        {/* Quick Stepper or Add Button */}
        {!isSoldOut && (
          <div
            onClick={(e) => e.stopPropagation()}
            className="flex items-center"
          >
            {quantity === 0 ? (
              <button
                onClick={() => addItem(item.id)}
                className="px-3 py-1.5 rounded-xl text-xs font-bold bg-orange-500 hover:bg-orange-400 text-white flex items-center gap-1 active:scale-95 transition-all shadow-sm cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>افزودن</span>
              </button>
            ) : (
              <div className="flex items-center gap-1 bg-slate-950 border border-slate-700 rounded-xl p-0.5 shadow">
                <button
                  onClick={() => decreaseItem(item.id)}
                  className="w-6 h-6 rounded-lg bg-slate-800 text-white flex items-center justify-center active:scale-95"
                >
                  {quantity === 1 ? <Trash2 className="w-3 h-3 text-rose-400" /> : <Minus className="w-3 h-3" />}
                </button>
                <span className="w-5 text-center text-xs font-bold text-white">
                  {toPersianDigits(quantity)}
                </span>
                <button
                  onClick={() => addItem(item.id)}
                  className="w-6 h-6 rounded-lg bg-orange-500 text-white font-bold flex items-center justify-center active:scale-95"
                >
                  <Plus className="w-3 h-3" />
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
