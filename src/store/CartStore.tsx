import { create, type StateCreator } from "zustand";
import type { Product, CartItem } from "../types";

type CartSlice = {
  items: CartItem[];
  addItem: (product: Product) => void;
  removeItem: (id: string) => void;
  clearCart: () => void;
};

type ProductSlice = {
  products: Product[];
  fetchProducts: () => Promise<void>;
  fetchStatus: 'idle' | 'fetching' | 'error' | 'success';
  productError: string | null;
};

type UiSlice = {
  cartOpen: boolean;
  toggleCartDrawer: () => void;
};

type Store = CartSlice & ProductSlice & UiSlice;

const createCartSlice: StateCreator<Store, [], [], CartSlice> = (set) => ({
  items: [],
  addItem: (product) =>
    set((state) => {
      const existing = state.items.find((i) => i.id === product.id);
      const items = existing
        ? state.items.map((i) =>
            i.id === product.id ? { ...i, quantity: i.quantity + 1 } : i,
          )
        : [...state.items, { ...product, quantity: 1 }];

      return { items };
    }),
  removeItem: (id) =>
    set((state) => ({ items: state.items.filter((i) => i.id !== id) })),
  clearCart: () => set({ items: [] }),
});

const createProductSlice: StateCreator<Store, [], [], ProductSlice> = (set) => ({
  products: [],
  fetchStatus: 'idle',
  productError: null,
  fetchProducts: async () => {
    set({ fetchStatus: 'fetching', productError: null });
    try {
      const res = await fetch('/api/products');
      if (!res.ok) {
        throw new Error(`Fetch failed with status: ${res.status}`);
      }
      const products: Product[] = await res.json();
      set({ products, fetchStatus: 'success' });
    } catch (err) {
      set({
        fetchStatus: 'error',
        productError: err instanceof Error ? err.message : 'Failed to load products',
      });
    }
  },
});

const createUiSlice: StateCreator<Store, [], [], UiSlice> = (set) => ({
  cartOpen: false,
  toggleCartDrawer: () => set((state) => ({ cartOpen: !state.cartOpen })),
});

export const useCartStore = create<Store>((...a) => ({
  ...createCartSlice(...a),
  ...createProductSlice(...a),
  ...createUiSlice(...a),
}));
