import React, { createContext, useContext, useState, useMemo } from 'react';
import { MenuItem, SelectedProduct } from '../types/menu';

interface MenuSelectionContextType {
  quantities: Record<string, number>;
  selectedItems: SelectedProduct[];
  totalCount: number;
  totalPrice: number;
  getItemQuantity: (productId: string) => number;
  addItem: (productId: string) => void;
  decreaseItem: (productId: string) => void;
  removeItem: (productId: string) => void;
  clearSelections: () => void;
  isSelectionSheetOpen: boolean;
  setIsSelectionSheetOpen: (open: boolean) => void;
}

const MenuSelectionContext = createContext<MenuSelectionContextType | undefined>(undefined);

interface MenuSelectionProviderProps {
  items: MenuItem[];
  children: React.ReactNode;
}

export const MenuSelectionProvider: React.FC<MenuSelectionProviderProps> = ({
  items,
  children,
}) => {
  const [quantities, setQuantities] = useState<Record<string, number>>({});
  const [isSelectionSheetOpen, setIsSelectionSheetOpen] = useState(false);

  const getItemQuantity = (productId: string) => quantities[productId] || 0;

  const addItem = (productId: string) => {
    setQuantities((prev) => {
      const current = prev[productId] || 0;
      return { ...prev, [productId]: current + 1 };
    });
  };

  const decreaseItem = (productId: string) => {
    setQuantities((prev) => {
      const current = prev[productId] || 0;
      if (current <= 1) {
        const next = { ...prev };
        delete next[productId];
        return next;
      }
      return { ...prev, [productId]: current - 1 };
    });
  };

  const removeItem = (productId: string) => {
    setQuantities((prev) => {
      const next = { ...prev };
      delete next[productId];
      return next;
    });
  };

  const clearSelections = () => {
    setQuantities({});
  };

  // Map to full products with line totals
  const selectedItems: SelectedProduct[] = useMemo(() => {
    const itemsMap = new Map<string, MenuItem>(items.map((i) => [i.id, i]));
    return (Object.entries(quantities) as [string, number][])
      .filter(([_, qty]) => Number(qty) > 0)
      .map(([productId, qty]): SelectedProduct | null => {
        const item = itemsMap.get(productId);
        if (!item) return null;
        return {
          item,
          quantity: Number(qty),
          lineTotal: item.price * Number(qty),
        };
      })
      .filter((sp): sp is SelectedProduct => sp !== null);
  }, [quantities, items]);

  const totalCount = useMemo(() => {
    return Object.values(quantities).reduce((sum: number, qty: number) => sum + Number(qty), 0);
  }, [quantities]);

  const totalPrice = useMemo(() => {
    return selectedItems.reduce((sum: number, sp: SelectedProduct) => sum + sp.lineTotal, 0);
  }, [selectedItems]);

  return (
    <MenuSelectionContext.Provider
      value={{
        quantities,
        selectedItems,
        totalCount,
        totalPrice,
        getItemQuantity,
        addItem,
        decreaseItem,
        removeItem,
        clearSelections,
        isSelectionSheetOpen,
        setIsSelectionSheetOpen,
      }}
    >
      {children}
    </MenuSelectionContext.Provider>
  );
};

export const useMenuSelection = () => {
  const context = useContext(MenuSelectionContext);
  if (!context) {
    throw new Error('useMenuSelection must be used within a MenuSelectionProvider');
  }
  return context;
};
