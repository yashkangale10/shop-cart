import { createActorContext } from '@xstate/react';
import { checkoutMachine } from './checkoutMachine';

/**
 * Shared checkout actor context.
 *
 * Provides a single XState actor instance to every sibling checkout
 * component (CartDrawer, PaymentPanel, bridge components) without
 * instantiating duplicate actors.
 *
 * Usage:
 *   - Wrap the component tree in <CheckoutActorContext.Provider>
 *   - useActorRef()   → send events to the machine
 *   - useSelector(fn) → subscribe to specific state slices
 */
export const CheckoutActorContext = createActorContext(checkoutMachine);

