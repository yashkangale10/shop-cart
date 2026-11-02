import { useEffect } from 'react';
import { useCartStore } from '../store/CartStore';
import { CheckoutActorContext } from '../machines/CheckoutActorContext';

/**
 * Headless bridge component: Machine → Store.
 *
 * Listens to the checkout machine's terminal success state.  When
 * reached it:
 *   1. Immediately clears the active Zustand cart store.
 *   2. After a brief delay (so the user sees the success confirmation),
 *      sends RESET to return the machine to the reviewing state.
 *
 * This keeps store mutations outside the machine definition — the
 * machine only models the workflow; the bridge handles side-effects.
 */
export default function OrderCompletionBridge() {
  const actorRef = CheckoutActorContext.useActorRef();
  const isSuccess = CheckoutActorContext.useSelector((state) =>
    state.matches('success'),
  );
  const clearCart = useCartStore((state) => state.clearCart);

  useEffect(() => {
    if (!isSuccess) return;

    // Clear the Zustand store immediately
    clearCart();

    // Give the user time to see the success message before resetting
    const timer = setTimeout(() => {
      actorRef.send({ type: 'RESET' });
    }, 3000);

    return () => clearTimeout(timer);
  }, [isSuccess, clearCart, actorRef]);

  return null; // headless — renders nothing
}

