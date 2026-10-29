import {
  createContext,
  useContext,
  useReducer,
  type ReactNode,
  type Dispatch,
} from 'react';
import type { CartItem, Product } from '../types';

// State shape
export type CartState = {
  items: CartItem[];
};

const initialState: CartState = { items: [] };

// Actions
type AddProductAction = { type: 'ADD_PRODUCT'; payload: Product };
type RemoveProductAction = { type: 'REMOVE_PRODUCT'; payload: { id: string } };

export type CartAction = AddProductAction | RemoveProductAction;

// Reducer
function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case 'ADD_PRODUCT': {
      const existing = state.items.find((item) => item.id === action.payload.id);
      if (existing) {
        return {
          ...state,
          items: state.items.map((item) =>
            item.id === action.payload.id
              ? { ...item, quantity: item.quantity + 1 }
              : item,
          ),
        };
      }
      return {
        ...state,
        items: [...state.items, { ...action.payload, quantity: 1 }],
      };
    }
    case 'REMOVE_PRODUCT': {
      return {
        ...state,
        items: state.items.filter((item) => item.id !== action.payload.id),
      };
    }
    default: {
      return state;
    }
  }
}

// Contexts — state and dispatch are kept separate so that dispatch-only
// consumers do not re-render when cart state changes.
const CartStateContext = createContext<CartState | undefined>(undefined);
const CartDispatchContext = createContext<Dispatch<CartAction> | undefined>(undefined);

// Provider
export function CartProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, initialState);

  return (
    <CartStateContext.Provider value={state}>
      <CartDispatchContext.Provider value={dispatch}>
        {children}
      </CartDispatchContext.Provider>
    </CartStateContext.Provider>
  );
}

// Custom hooks
export function useCartState(): CartState {
  const ctx = useContext(CartStateContext);
  if (ctx === undefined) {
    throw new Error('useCartState must be used inside a <CartProvider>.');
  }
  return ctx;
}

export function useCartDispatch(): Dispatch<CartAction> {
  const ctx = useContext(CartDispatchContext);
  if (ctx === undefined) {
    throw new Error('useCartDispatch must be used inside a <CartProvider>.');
  }
  return ctx;
}

