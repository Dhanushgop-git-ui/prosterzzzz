
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { CartItem, Poster } from '@/types';

interface CartStore {
  items: CartItem[];
  addToCart: (poster: Poster, size: 'A3' | 'A4', quantity?: number) => void;
  removeFromCart: (itemId: string, size: 'A3' | 'A4') => void;
  updateQuantity: (itemId: string, size: 'A3' | 'A4', quantity: number) => void;
  clearCart: () => void;
  getTotalItems: () => number;
  getTotalPrice: () => number;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      
      addToCart: (poster, size, quantity = 1) => {
        const { items } = get();
        const existingItemIndex = items.findIndex(
          (item) => item.poster.id === poster.id && item.size === size
        );

        if (existingItemIndex >= 0) {
          const updatedItems = [...items];
          updatedItems[existingItemIndex].quantity += quantity;
          set({ items: updatedItems });
        } else {
          set({ items: [...items, { poster, size, quantity }] });
        }
      },
      
      removeFromCart: (itemId, size) => {
        const { items } = get();
        set({
          items: items.filter(
            (item) => !(item.poster.id === itemId && item.size === size)
          ),
        });
      },
      
      updateQuantity: (itemId, size, quantity) => {
        const { items } = get();
        const updatedItems = items.map((item) => {
          if (item.poster.id === itemId && item.size === size) {
            return { ...item, quantity: Math.max(1, quantity) };
          }
          return item;
        });
        set({ items: updatedItems });
      },
      
      clearCart: () => set({ items: [] }),
      
      getTotalItems: () => {
        const { items } = get();
        return items.reduce((total, item) => total + item.quantity, 0);
      },
      
      getTotalPrice: () => {
        const { items } = get();
        return items.reduce((total, item) => {
          const price = item.size === 'A3' ? item.poster.priceA3 : item.poster.priceA4;
          return total + price * item.quantity;
        }, 0);
      },
    }),
    {
      name: 'cart-storage',
    }
  )
);
