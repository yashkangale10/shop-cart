import { atom, type PrimitiveAtom } from 'jotai';
import type { Product, CartItem } from '../types';

// ── Status Types
export type CheckoutStatus = 'idle' | 'submitting' | 'error' | 'success';
export type FetchStatus = 'idle' | 'fetching' | 'error' | 'success';

// ── Cart State (Base Atoms)
export const cartItemsAtom: PrimitiveAtom<CartItem[]> = atom<CartItem[]>([]);
export const checkoutStatusAtom: PrimitiveAtom<CheckoutStatus> = atom<CheckoutStatus>('idle');
export const cartErrorAtom: PrimitiveAtom<string | null> = atom<string | null>(null);

// ── Derived Atoms (Read-Only)
export const totalItemCountAtom = atom((get) =>
  get(cartItemsAtom).reduce((sum, item) => sum + item.quantity, 0),
);

export const totalCartPriceAtom = atom((get) =>
  get(cartItemsAtom).reduce((sum, item) => sum + item.price * item.quantity, 0),
);

// ── Cart Action Atoms (Write-Only)
export const addItemAtom = atom(null, (get, set, product: Product) => {
  const items = get(cartItemsAtom);
  const existing = items.find((i) => i.id === product.id);
  const nextItems = existing
    ? items.map((i) =>
      i.id === product.id ? { ...i, quantity: i.quantity + 1 } : i,
    )
    : [...items, { ...product, quantity: 1 }];

  set(cartItemsAtom, nextItems);
  set(checkoutStatusAtom, 'idle');
  set(cartErrorAtom, null);
});

export const removeItemAtom = atom(null, (_get, set, id: string) => {
  set(cartItemsAtom, (prev) => prev.filter((i) => i.id !== id));
});

export const clearCartAtom = atom(null, (_get, set) => {
  set(cartItemsAtom, []);
});

export const checkoutAtom = atom(null, async (get, set) => {
  const items = get(cartItemsAtom);
  if (items.length === 0) return;

  set(checkoutStatusAtom, 'submitting');
  set(cartErrorAtom, null);

  try {
    const total = items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0,
    );
    const res = await fetch('/api/orders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ items, total, outcome: 'success' }),
    });
    if (!res.ok) {
      throw new Error(`Checkout failed with status: ${res.status}`);
    }
    set(cartItemsAtom, []);
    set(checkoutStatusAtom, 'success');
  } catch (err) {
    set(checkoutStatusAtom, 'error');
    set(cartErrorAtom, err instanceof Error ? err.message : 'Checkout failed');
  }
});

// ── Catalog/Product State (Base Atoms)
export const productsAtom: PrimitiveAtom<Product[]> = atom<Product[]>([]);
export const fetchStatusAtom: PrimitiveAtom<FetchStatus> = atom<FetchStatus>('idle');
export const productErrorAtom: PrimitiveAtom<string | null> = atom<string | null>(null);

// ── Product Action Atoms (Write-Only)
export const fetchProductsAtom = atom(null, async (_get, set) => {
  set(fetchStatusAtom, 'fetching');
  set(productErrorAtom, null);

  try {
    const res = await fetch('/api/products');
    if (!res.ok) {
      throw new Error(`Fetch failed with status: ${res.status}`);
    }
    const products: Product[] = await res.json();
    set(productsAtom, products);
    set(fetchStatusAtom, 'success');
  } catch (err) {
    set(fetchStatusAtom, 'error');
    set(
      productErrorAtom,
      err instanceof Error ? err.message : 'Failed to load products',
    );
  }
});

// ── UI State & Actions
export const cartOpenAtom: PrimitiveAtom<boolean> = atom<boolean>(false);

export const toggleCartDrawerAtom = atom(null, (_get, set) => {
  set(cartOpenAtom, (prev) => !prev);
});