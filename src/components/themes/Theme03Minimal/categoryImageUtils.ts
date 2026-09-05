import { MenuCategory, MenuItem } from '../../../types/menu';

/**
 * Fallback order for category image:
 * 1. category.image
 * 2. first valid product image inside that category
 * 3. restaurant.heroImage
 * 4. controlled visual placeholder
 */
export const getCategoryDisplayImage = (
  category: MenuCategory,
  items: MenuItem[],
  restaurantHeroImage?: string
): string => {
  if (typeof category.image === 'string' && category.image.trim() !== '') {
    return category.image;
  }
  const firstItemWithImage = items.find(
    (item) => item.categoryId === category.id && typeof item.image === 'string' && item.image.trim() !== ''
  );
  if (firstItemWithImage?.image) {
    return firstItemWithImage.image;
  }
  if (typeof restaurantHeroImage === 'string' && restaurantHeroImage.trim() !== '') {
    return restaurantHeroImage;
  }
  return 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=1200&q=80';
};
