import { useEffect } from 'react';
import { useCartStore } from '../store/CartStore';
import { CheckoutActorContext } from '../machines/CheckoutActorContext';

/**
 * Headless bridge component: Store → Machine.
 *
 * Listens to Zustand cart item changes and synchronises them into the
 * running checkout machine via the SYNC_CART event.  This ensures the
 * machine always processes the latest cart items without coupling the
 * Zustand store to the machine definition.
 */
export default function CartSynchronizer() {
  const actorRef = CheckoutActorContext.useActorRef();
  const items = useCartStore((state) => state.items);

  useEffect(() => {
    actorRef.send({ type: 'SYNC_CART', items });
  }, [actorRef, items]);

  return null; // headless — renders nothing
}

