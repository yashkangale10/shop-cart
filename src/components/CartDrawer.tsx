import CartItemsList from './CartItemsList';
import CartErrorBanner from './CartErrorBanner';
import CheckoutButton from './CheckoutButton';

type Props = {
  isOpen: boolean;
  onClose: () => void;
};

/**
 * CartDrawer is now a pure layout shell.
 *
 * All state subscriptions are pushed to leaf components:
 *   - CartItemsList   → subscribes to machine context.items
 *   - CartErrorBanner → subscribes to machine context.error
 *   - CheckoutButton  → subscribes to machine transition capabilities
 *
 * This prevents the container from re-rendering during state transitions.
 */
export default function CartDrawer({ isOpen, onClose }: Props) {
  return (
    <>
      {isOpen && (
        <div
          className="drawer-backdrop"
          onClick={onClose}
        />
      )}

      <aside
        className={`cart-drawer ${isOpen ? 'cart-drawer--open' : ''}`}
      >
        <div className="cart-drawer-header">
          <h2>Your Cart</h2>
          <button
            className="btn btn-close"
            onClick={onClose}
          >
            ✕
          </button>
        </div>

        <div className="cart-drawer-body">
          <CartItemsList />
        </div>

        <CartErrorBanner />

        <div className="cart-drawer-footer">
          <CheckoutButton />
        </div>
      </aside>
    </>
  );
}
