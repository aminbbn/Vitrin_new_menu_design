export type ThemeId = 'immersive' | 'modern' | 'minimal';

export type AvailabilityState = 'available' | 'low_stock' | 'sold_out';

export interface MenuItem {
  id: string;
  name: string;
  nameEn?: string;
  description: string;
  price: number; // in Tomans
  originalPrice?: number;
  image: string;
  categoryId: string;
  isFeatured?: boolean;
  isChefSpecial?: boolean;
  isVegetarian?: boolean;
  isSpicy?: boolean;
  availability: AvailabilityState;
  preparationTime?: string; // e.g. "۱۵-۲۰ دقیقه"
  calories?: number;
  ingredients?: string[];
  allergens?: string[];
  badge?: string;
}

export interface MenuCategory {
  id: string;
  name: string;
  nameEn?: string;
  icon?: string;
  image?: string;
  description?: string;
  itemCount?: number;
}

export interface RestaurantSocial {
  instagram?: string;
  telegram?: string;
  website?: string;
  phone?: string;
}

export interface RestaurantData {
  id: string;
  name: string;
  nameEn: string;
  tagline: string;
  cuisine: string;
  logo: string;
  heroImage: string;
  secondaryHeroImage?: string;
  address: string;
  neighborhood: string;
  workingHours: string;
  phone: string;
  socials: RestaurantSocial;
  wifiName?: string;
  wifiPassword?: string;
  categories: MenuCategory[];
  items: MenuItem[];
}

export interface ImmersiveExperienceSettings {
  focalPosition: 'top' | 'center' | 'bottom';
  overlayStrength: 'soft' | 'balanced' | 'strong';
  showOperationalInfo: boolean;
  showFeaturedSection: boolean;
}

export interface ModernExperienceSettings {
  focalPosition: 'top' | 'center' | 'bottom';
  washStrength: 'subtle' | 'balanced' | 'strong';
  categoryAppearance: 'outline' | 'filled';
  showItemCounts: boolean;
}

export interface MinimalExperienceSettings {
  focalPosition: 'top' | 'center' | 'bottom';
  gradientStrength: 'subtle' | 'balanced' | 'strong';
}

export type BackgroundIntensity = 'soft' | 'balanced' | 'strong';

export interface MenuThemeConfig {
  id: ThemeId;
  name: string;
  nameFa: string;
  descriptionFa: string;
  primaryColor: string;
  secondaryColor: string;
  /** @deprecated Legacy accent color - use primaryColor instead */
  accentColor?: string;
  /** @deprecated Legacy accent color light - use secondaryColor instead */
  accentColorLight?: string;
  backgroundIntensity?: BackgroundIntensity;
  bgColor: string;
  cardBgColor: string;
  textColor: string;
  mutedTextColor: string;
  fontFamily: 'editorial' | 'modern' | 'minimal';
  borderRadius: 'none' | 'sm' | 'md' | 'lg' | 'xl' | 'full';
  hero: {
    type: 'full-bleed' | 'split-compact' | 'architectural-split';
    headline: string;
    subheadline: string;
    ctaText: string;
    transitionDurationMs: number;
  };
  categoryNavigationVariant: 'active-category-sheet' | 'primary-shortcuts-sheet';
  cardLayout: 'editorial-card' | 'modern-horizontal-vertical' | 'minimal-asymmetric';
  immersiveSettings?: ImmersiveExperienceSettings;
  modernSettings?: ModernExperienceSettings;
  minimalSettings?: MinimalExperienceSettings;
}

export interface SelectionItem {
  productId: string;
  quantity: number;
}

export interface SelectedProduct {
  item: MenuItem;
  quantity: number;
  lineTotal: number;
}

