import { CheckoutActorContext } from '../machines/CheckoutActorContext';

/**
 * Subscribes specifically to the machine's error context slice
 * to display alert messages. Only re-renders when the error value changes.
 */
export default function CartErrorBanner() {
  const error = CheckoutActorContext.useSelector(
    (state) => state.context.error,
  );

  if (!error) return null;

  return (
    <div className="cart-checkout-status">
      <p className="cart-checkout-error">Error occurred: {error}</p>
    </div>
  );
}

