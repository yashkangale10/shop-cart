export type Product = {
  id: string;
  name: string;
  price: number;
};

export type CartItem = Product & { quantity: number };

export type CheckoutResult = {
  id: string | number;
  items: CartItem[];
  total: number;
  outcome: 'success' | 'fail';
};

