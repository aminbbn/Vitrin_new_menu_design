import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sparkles,
  ChevronDown,
  Info,
  ArrowUp,
  RotateCcw,
  Search,
  MapPin,
  Clock,
  CheckCircle2,
  AlertCircle,
  XCircle,
  Leaf,
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
  const [viewState, setViewState] = useState<'hero' | 'menu'>(initialState);
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);
  const [isInfoOpen, setIsInfoOpen] = useState(false);
  const [isCategorySheetOpen, setIsCategorySheetOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState<string>(restaurant.categories[0]?.id || '');
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearch, setShowSearch] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);

  // Sync state if controlled from outside
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

  // Category Intersection Observer for scroll tracking
  useEffect(() => {
    if (viewState !== 'menu') return;

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

    const observer = new IntersectionObserver(observerCallback, {
      root: null,
      rootMargin: '-100px 0px -60% 0px',
      threshold: 0.1,
    });

    restaurant.categories.forEach((cat) => {
      const el = document.getElementById(`cat-section-${cat.id}`);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [viewState, restaurant.categories]);

  const handleCategoryClick = (catId: string) => {
    setActiveCategory(catId);
    const target = document.getElementById(`cat-section-${catId}`);
    if (target) {
      const navHeight = 90;
      const targetTop = target.getBoundingClientRect().top + window.pageYOffset - navHeight;
      window.scrollTo({ top: targetTop, behavior: 'smooth' });
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

  const featuredItems = restaurant.items.filter((item) => item.isFeatured);
  const activeCategoryObj = restaurant.categories.find((c) => c.id === activeCategory);

  const transitionDuration = (config.hero?.transitionDurationMs || 700) / 1000;

  return (
    <div
      ref={containerRef}
      dir="rtl"
      className="min-h-screen bg-[#090d12] text-neutral-100 font-sans relative selection:bg-amber-500/20"
      style={{
        backgroundColor: config.bgColor,
        color: config.textColor,
      }}
    >
      {/* ------------------------------------------------------------------ */}
      {/* UNIFIED MORPHING HERO → COMPACT HEADER CONTAINER                   */}
      {/* Shared element transition: Height, brand logo, and title morph.    */}
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
            : 'sticky top-0 bg-[#090d12]/95 backdrop-blur-xl border-b border-neutral-800/80 shadow-2xl'
        }`}
      >
        {/* Background Image Layer (Morphs from full photography to subtle header overlay) */}
        <motion.div
          layout
          className={`absolute inset-0 z-0 overflow-hidden pointer-events-none transition-opacity duration-700 ${
            viewState === 'hero' ? 'opacity-100' : 'opacity-25'
          }`}
        >
          <img
            src={restaurant.heroImage}
            alt={restaurant.name}
            className="w-full h-full object-cover object-center filter brightness-[0.7]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#090d12] via-[#090d12]/70 to-[#090d12]/40" />
        </motion.div>

        {/* 1. Header Bar Area (Present in both Hero and Menu state with shared element layout) */}
        <div className="relative z-10 w-full px-4 sm:px-6 py-3 max-w-2xl mx-auto flex items-center justify-between">
          {/* Brand Identity (Logo + Name + Subtitle) */}
          <div className="flex items-center gap-2.5 sm:gap-3">
            <motion.div
              layoutId="restaurant-brand-logo"
              transition={{ duration: transitionDuration, ease: [0.25, 1, 0.5, 1] }}
              className={`rounded-2xl overflow-hidden p-0.5 border border-amber-500/40 bg-black/50 backdrop-blur-md shadow-xl flex-shrink-0 transition-all ${
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
              layoutId="restaurant-brand-text"
              transition={{ duration: transitionDuration, ease: [0.25, 1, 0.5, 1] }}
            >
              <h1 className={`font-bold text-amber-300 tracking-tight transition-all ${
                viewState === 'hero' ? 'text-base sm:text-lg' : 'text-sm sm:text-base text-white'
              }`}>
                {restaurant.name}
              </h1>
              <p className="text-[10px] sm:text-xs text-neutral-300 font-light tracking-wide flex items-center gap-1">
                <span>{restaurant.cuisine}</span>
                <span>•</span>
                <span>{restaurant.neighborhood}</span>
              </p>
            </motion.div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            {/* Search Toggle in Menu State */}
            {viewState === 'menu' && (
              <motion.button
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                onClick={() => setShowSearch(!showSearch)}
                className={`w-8 h-8 sm:w-9 sm:h-9 rounded-full flex items-center justify-center transition-colors cursor-pointer ${
                  showSearch ? 'bg-amber-500 text-black' : 'bg-neutral-800/90 text-neutral-300 hover:bg-neutral-700'
                }`}
                aria-label="جستجو در منو"
              >
                <Search className="w-4 h-4" />
              </motion.button>
            )}

            {/* Restaurant Info Trigger */}
            <button
              onClick={() => setIsInfoOpen(true)}
              id="header-info-btn"
              className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-black/40 sm:bg-neutral-800/90 backdrop-blur-md border border-white/10 text-neutral-200 flex items-center justify-center hover:bg-white/10 active:scale-95 transition-all cursor-pointer"
              aria-label="اطلاعات رستوران"
            >
              <Info className="w-4 h-4 text-amber-300" />
            </button>

            {/* Return to Hero CTA in Menu State */}
            {viewState === 'menu' && (
              <motion.button
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                onClick={handleResetToHero}
                id="return-to-hero-btn"
                className="flex items-center gap-1 px-2.5 sm:px-3 py-1.5 rounded-full bg-neutral-800/90 hover:bg-neutral-700 text-amber-300 text-xs font-semibold border border-amber-500/20 transition-all active:scale-95 cursor-pointer"
                title="بازگشت به صفحه معرفی"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span className="text-[11px]">معرفی</span>
              </motion.button>
            )}
          </div>
        </div>

        {/* 2. Hero Center Editorial Content (Only visible in Hero state) */}
        <AnimatePresence>
          {viewState === 'hero' && (
            <motion.div
              key="hero-editorial-body"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -30, transition: { duration: 0.3 } }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="relative z-10 w-full px-6 py-8 sm:py-12 max-w-xl mx-auto flex flex-col items-center text-center space-y-6"
            >
              {/* Gold Ornament Divider */}
              <div className="flex items-center gap-2 text-amber-400 text-xs tracking-widest">
                <span className="w-6 h-[1px] bg-amber-400/40" />
                <span className="inline-flex items-center gap-1 font-semibold">
                  <Sparkles className="w-3 h-3 text-amber-400" />
                  منوی اختصاصی دیجیتال
                </span>
                <span className="w-6 h-[1px] bg-amber-400/40" />
              </div>

              {/* Main Headline */}
              <h2 className="text-3xl sm:text-4xl font-black text-white leading-tight tracking-tight max-w-md">
                {config.hero.headline}
              </h2>

              {/* Sub-headline */}
              <p className="text-xs sm:text-sm text-neutral-300 max-w-sm leading-relaxed font-light">
                {config.hero.subheadline}
              </p>

              {/* Operational Badges */}
              <div className="flex items-center gap-3 pt-1 text-xs text-neutral-300">
                <div className="flex items-center gap-1.5 bg-black/50 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10 font-medium">
                  <Clock className="w-3.5 h-3.5 text-amber-400" />
                  <span>{toPersianDigits(restaurant.workingHours)}</span>
                </div>
                <div className="flex items-center gap-1.5 bg-black/50 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10 font-medium">
                  <MapPin className="w-3.5 h-3.5 text-amber-400" />
                  <span>{restaurant.neighborhood}</span>
                </div>
              </div>

              {/* Primary Call to Action Button */}
              <div className="w-full max-w-xs pt-4">
                <button
                  onClick={handleEnterMenu}
                  id="enter-menu-hero-btn"
                  className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 hover:from-amber-400 hover:to-amber-300 text-neutral-950 font-black text-base shadow-[0_12px_32px_rgba(212,175,55,0.35)] active:scale-[0.98] transition-all flex items-center justify-center gap-2.5 group cursor-pointer"
                >
                  <span>{config.hero.ctaText}</span>
                  <ChevronDown className="w-5 h-5 group-hover:translate-y-1 transition-transform" />
                </button>
              </div>

              {/* Bottom hint */}
              <div className="pt-2 text-center text-neutral-400 text-xs font-light">
                <span>جهت مرور خوراک‌ها دکمه مشاهده منو را لمس کنید</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* 3. Search Bar Expansion in Menu State */}
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

        {/* 4. Compact Category Indicator & Panel Trigger (NO horizontal scrolling rail) */}
        {viewState === 'menu' && (
          <div className="w-full border-t border-neutral-800/60 bg-[#0c1218]/90 px-4 py-2">
            <div className="max-w-2xl mx-auto flex items-center justify-between gap-3">
              {/* Active Category Display & Open Sheet Button */}
              <button
                onClick={() => setIsCategorySheetOpen(true)}
                id="immersive-category-capsule-btn"
                className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-bold bg-amber-500/15 text-amber-300 border border-amber-500/30 hover:bg-amber-500/25 active:scale-95 transition-all cursor-pointer"
              >
                <Layers className="w-3.5 h-3.5 text-amber-400" />
                <span>دسته‌بندی: {activeCategoryObj?.name || 'همه دسته‌ها'}</span>
                <ChevronDown className="w-3.5 h-3.5" />
              </button>

              <div className="text-[11px] text-neutral-400 font-medium">
                {toPersianDigits(restaurant.categories.length)} دسته • {toPersianDigits(restaurant.items.length)} آیتم
              </div>
            </div>
          </div>
        )}
      </motion.div>

      {/* ------------------------------------------------------------------ */}
      {/* ACTUAL MENU BODY CONTENT (Smooth slide up and staggered reveal)   */}
      {/* ------------------------------------------------------------------ */}
      {viewState === 'menu' && (
        <motion.div
          key="menu-content-stream"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: 'easeOut', delay: 0.15 }}
          className="w-full min-h-screen flex flex-col pb-28"
        >
          <main className="max-w-2xl mx-auto w-full px-4 pt-5 space-y-10">
            {/* If search query is active */}
            {searchQuery ? (
              <div className="space-y-4">
                <h2 className="text-sm font-semibold text-neutral-400">
                  نتایج جستجو برای «{searchQuery}» ({toPersianDigits(filteredItems.length)} مورد)
                </h2>
                {filteredItems.length === 0 ? (
                  <div className="text-center py-12 bg-neutral-900/50 rounded-2xl border border-neutral-800 p-6">
                    <p className="text-sm text-neutral-400">موردی با این مشخصات در منو یافت نشد.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 gap-3.5">
                    {filteredItems.map((item) => (
                      <EditorialItemCard
                        key={item.id}
                        item={item}
                        onSelect={setSelectedItem}
                        accentColor={config.accentColor}
                      />
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <>
                {/* Featured / Signature Section */}
                {featuredItems.length > 0 && (
                  <section className="space-y-3.5">
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

                    {/* Featured Items Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {featuredItems.slice(0, 2).map((item) => (
                        <FeaturedEditorialCard
                          key={item.id}
                          item={item}
                          onSelect={setSelectedItem}
                          accentColor={config.accentColor}
                        />
                      ))}
                    </div>
                  </section>
                )}

                {/* Standard Category Sections */}
                {restaurant.categories.map((category) => {
                  const categoryItems = restaurant.items.filter(
                    (item) => item.categoryId === category.id
                  );
                  if (categoryItems.length === 0) return null;

                  return (
                    <section
                      key={category.id}
                      id={`cat-section-${category.id}`}
                      data-category-id={category.id}
                      className="space-y-4 pt-4 scroll-mt-28"
                    >
                      {/* Section Header */}
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

                      {/* List of items */}
                      <div className="grid grid-cols-1 gap-3.5">
                        {categoryItems.map((item) => (
                          <EditorialItemCard
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
              </>
            )}

            {/* Brand Footer */}
            <footer className="pt-10 pb-16 text-center space-y-3 border-t border-neutral-800/60 mt-12">
              <div className="w-10 h-10 mx-auto rounded-xl overflow-hidden p-0.5 border border-amber-500/20 bg-black/40">
                <img src={restaurant.logo} alt={restaurant.name} className="w-full h-full object-cover rounded-lg" />
              </div>
              <h4 className="text-sm font-bold text-white">{restaurant.name}</h4>
              <p className="text-xs text-neutral-400 max-w-xs mx-auto leading-relaxed">{restaurant.tagline}</p>
              <div className="text-[11px] text-neutral-400 pt-3">
                منوی دیجیتال طراحی شده با ویترین
              </div>
            </footer>
          </main>
        </motion.div>
      )}

      {/* Floating Category Navigation Capsule Button in Menu View */}
      {viewState === 'menu' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="fixed bottom-20 right-4 z-30"
        >
          <button
            onClick={() => setIsCategorySheetOpen(true)}
            id="floating-category-capsule-btn"
            className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-neutral-900/95 backdrop-blur-md border border-amber-500/40 text-amber-300 shadow-2xl active:scale-95 transition-all text-xs font-bold cursor-pointer"
          >
            <Layers className="w-4 h-4 text-amber-400" />
            <span>دسته‌ها</span>
          </button>
        </motion.div>
      )}

      {/* Floating Back to Top Button */}
      {viewState === 'menu' && (
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="fixed bottom-20 left-4 z-30 w-10 h-10 rounded-full bg-neutral-900/90 backdrop-blur-md border border-neutral-700 text-neutral-300 flex items-center justify-center hover:bg-neutral-800 active:scale-95 shadow-xl transition-all"
          aria-label="بازگشت به بالای منو"
        >
          <ArrowUp className="w-4 h-4" />
        </button>
      )}

      {/* Sticky Selection Bar */}
      <MenuSelectionBar accentColor={config.accentColor} themeId="immersive" />

      {/* My Selections Bottom Sheet */}
      <MenuSelectionSheet accentColor={config.accentColor} />

      {/* All Categories Bottom Sheet */}
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
/* Subcomponent: Featured Editorial Card                                      */
/* -------------------------------------------------------------------------- */
interface ItemCardProps {
  item: MenuItem;
  onSelect: (item: MenuItem) => void;
  accentColor: string;
}

const FeaturedEditorialCard: React.FC<ItemCardProps> = ({ item, onSelect, accentColor }) => {
  const { getItemQuantity, addItem, decreaseItem } = useMenuSelection();
  const quantity = getItemQuantity(item.id);
  const isSoldOut = item.availability === 'sold_out';

  return (
    <motion.div
      whileHover={{ y: -3 }}
      whileTap={{ scale: 0.98 }}
      onClick={() => onSelect(item)}
      id={`item-featured-${item.id}`}
      className="relative bg-gradient-to-b from-[#161f2b] to-[#0f1722] rounded-2xl overflow-hidden border border-neutral-800/80 shadow-xl cursor-pointer flex flex-col group"
    >
      <div className="relative w-full h-44 bg-neutral-950 overflow-hidden">
        <img
          src={item.image}
          alt={item.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#161f2b] via-transparent to-black/30" />

        {/* Badge */}
        {item.badge && (
          <span
            style={{ backgroundColor: accentColor, color: '#000' }}
            className="absolute top-3 right-3 text-[10px] font-bold px-2.5 py-0.5 rounded-full shadow-md flex items-center gap-1"
          >
            <Sparkles className="w-3 h-3" />
            {item.badge}
          </span>
        )}

        {isSoldOut && (
          <div className="absolute inset-0 bg-black/70 backdrop-blur-[2px] flex items-center justify-center">
            <span className="bg-rose-900/80 text-rose-200 text-xs font-semibold px-3 py-1 rounded-full border border-rose-700">
              اتمام موجودی امروز
            </span>
          </div>
        )}
      </div>

      <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
        <div>
          <h4 className="font-bold text-base text-white group-hover:text-amber-300 transition-colors">
            {item.name}
          </h4>
          <p className="text-xs text-neutral-400 line-clamp-2 mt-1.5 leading-relaxed font-light">
            {item.description}
          </p>
        </div>

        <div className="flex items-center justify-between pt-2 border-t border-neutral-800/60">
          <span className="text-sm font-bold text-amber-300 tracking-tight">
            {formatToman(item.price)}
          </span>

          {/* Quick Selection Action */}
          {!isSoldOut && (
            <div
              onClick={(e) => e.stopPropagation()}
              className="flex items-center"
            >
              {quantity === 0 ? (
                <button
                  onClick={() => addItem(item.id)}
                  className="px-3 py-1.5 rounded-xl text-xs font-bold text-neutral-950 flex items-center gap-1 active:scale-95 transition-all cursor-pointer shadow"
                  style={{ backgroundColor: accentColor }}
                  title="افزودن به انتخاب‌ها"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>انتخاب</span>
                </button>
              ) : (
                <div className="flex items-center gap-1.5 bg-neutral-900/90 border border-neutral-700 rounded-xl p-0.5 shadow">
                  <button
                    onClick={() => decreaseItem(item.id)}
                    className="w-6 h-6 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-white flex items-center justify-center active:scale-95"
                  >
                    {quantity === 1 ? <Trash2 className="w-3 h-3 text-rose-400" /> : <Minus className="w-3 h-3" />}
                  </button>
                  <span className="w-5 text-center text-xs font-bold text-white">
                    {toPersianDigits(quantity)}
                  </span>
                  <button
                    onClick={() => addItem(item.id)}
                    className="w-6 h-6 rounded-lg text-neutral-950 font-bold flex items-center justify-center active:scale-95"
                    style={{ backgroundColor: accentColor }}
                  >
                    <Plus className="w-3 h-3" />
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

/* -------------------------------------------------------------------------- */
/* Subcomponent: Standard Editorial Item Card                                 */
/* -------------------------------------------------------------------------- */
const EditorialItemCard: React.FC<ItemCardProps> = ({ item, onSelect, accentColor }) => {
  const { getItemQuantity, addItem, decreaseItem } = useMenuSelection();
  const quantity = getItemQuantity(item.id);
  const isSoldOut = item.availability === 'sold_out';

  return (
    <motion.div
      whileTap={{ scale: 0.99 }}
      onClick={() => onSelect(item)}
      id={`item-card-${item.id}`}
      className={`relative bg-[#111822] hover:bg-[#151f2d] border border-neutral-800/70 rounded-2xl p-3 sm:p-4 transition-all cursor-pointer flex gap-3.5 items-center justify-between group ${
        isSoldOut ? 'opacity-65' : ''
      }`}
    >
      {/* Content Side */}
      <div className="flex-1 min-w-0 pr-1 space-y-1.5">
        <div className="flex items-center gap-2 flex-wrap">
          <h4 className="font-bold text-sm sm:text-base text-white group-hover:text-amber-300 transition-colors line-clamp-1">
            {item.name}
          </h4>
          {item.badge && (
            <span
              style={{ backgroundColor: `${accentColor}25`, color: accentColor }}
              className="text-[10px] font-semibold px-2 py-0.5 rounded-full border border-amber-500/30 whitespace-nowrap"
            >
              {item.badge}
            </span>
          )}
          {item.isVegetarian && (
            <span className="text-[10px] text-emerald-400 bg-emerald-950/40 px-1.5 py-0.5 rounded border border-emerald-800/40">
              وجترین
            </span>
          )}
        </div>

        <p className="text-xs text-neutral-400 line-clamp-2 leading-relaxed font-light">
          {item.description}
        </p>

        <div className="flex items-center justify-between pt-1">
          <span className="text-sm font-bold text-amber-300">
            {formatToman(item.price)}
          </span>

          {/* Quick Selection Stepper or Add Button */}
          {!isSoldOut && (
            <div
              onClick={(e) => e.stopPropagation()}
              className="flex items-center"
            >
              {quantity === 0 ? (
                <button
                  onClick={() => addItem(item.id)}
                  className="w-8 h-8 rounded-xl flex items-center justify-center text-neutral-950 font-bold active:scale-95 transition-all shadow cursor-pointer"
                  style={{ backgroundColor: accentColor }}
                  title="افزودن به انتخاب‌ها"
                >
                  <Plus className="w-4 h-4" />
                </button>
              ) : (
                <div className="flex items-center gap-1.5 bg-neutral-900 border border-neutral-700/80 rounded-xl p-0.5 shadow">
                  <button
                    onClick={() => decreaseItem(item.id)}
                    className="w-6 h-6 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-white flex items-center justify-center active:scale-95"
                  >
                    {quantity === 1 ? <Trash2 className="w-3 h-3 text-rose-400" /> : <Minus className="w-3 h-3" />}
                  </button>
                  <span className="w-5 text-center text-xs font-bold text-white">
                    {toPersianDigits(quantity)}
                  </span>
                  <button
                    onClick={() => addItem(item.id)}
                    className="w-6 h-6 rounded-lg text-neutral-950 font-bold flex items-center justify-center active:scale-95"
                    style={{ backgroundColor: accentColor }}
                  >
                    <Plus className="w-3 h-3" />
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Image Thumbnail */}
      <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-xl overflow-hidden flex-shrink-0 bg-neutral-900 border border-neutral-800">
        <img
          src={item.image}
          alt={item.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          loading="lazy"
        />
        {isSoldOut && (
          <div className="absolute inset-0 bg-black/60 backdrop-blur-[1px] flex items-center justify-center">
            <span className="text-[10px] font-bold text-rose-300 text-center px-1">تمام شد</span>
          </div>
        )}
      </div>
    </motion.div>
  );
};
