import { setup, fromPromise, assign } from 'xstate';
import type { CartItem } from '../types';

export type CheckoutContext = {
  items: CartItem[];
  error: string | null;
};

export type CheckoutEvent =
  | { type: 'SYNC_CART'; items: CartItem[] }
  | { type: 'SUBMIT' }
  | { type: 'CANCEL' }
  | { type: 'RESET' };

export const checkoutMachine = setup({
  types: {
    context: {} as CheckoutContext,
    events: {} as CheckoutEvent,
  },
  guards: {
    cartNotEmpty: ({ context }) => context.items.length > 0,
  },
  actors: {
    processPayment: fromPromise(
      async ({
        input,
        signal,
      }: {
        input: { items: CartItem[] };
        signal: AbortSignal;
      }) => {
        const total = input.items.reduce(
          (sum, item) => sum + item.price * item.quantity,
          0,
        );
        const res = await fetch('/api/orders', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            items: input.items,
            total,
            outcome: 'success',
          }),
          signal,
        });
        if (!res.ok) {
          throw new Error(`Payment failed with status: ${res.status}`);
        }
        return res.json();
      },
    ),
  },
}).createMachine({
  id: 'checkout',
  initial: 'reviewing',
  context: {
    items: [],
    error: null,
  },
  states: {
    reviewing: {
      on: {
        SYNC_CART: {
          actions: assign({
            items: ({ event }) => event.items,
          }),
        },
        SUBMIT: {
          target: 'submitting',
          guard: 'cartNotEmpty',
          actions: assign({ error: null }),
        },
      },
    },
    submitting: {
      invoke: {
        id: 'processPayment',
        src: 'processPayment',
        input: ({ context }) => ({ items: context.items }),
        onDone: {
          target: 'success',
        },
        onError: {
          target: 'reviewing',
          actions: assign({
            error: ({ event }) => {
              const err = event.error;
              if (err instanceof Error) {
                return err.message;
              }
              return 'Payment failed';
            },
          }),
        },
      },
      on: {
        CANCEL: {
          target: 'reviewing',
          // Leaving 'submitting' stops the invoked actor,
          // which aborts the AbortSignal passed to processPayment,
          // cancelling the in-flight HTTP request.
        },
        SYNC_CART: {
          actions: assign({
            items: ({ event }) => event.items,
          }),
        },
      },
    },
    success: {
      // Terminal state of the checkout workflow.
      // OrderCompletionBridge listens here to clear the Zustand store,
      // then sends RESET after a brief delay so the user sees the
      // success confirmation before the machine returns to reviewing.
      on: {
        RESET: {
          target: 'reviewing',
          actions: assign({ items: () => [], error: () => null }),
        },
      },
    },
  },
});

