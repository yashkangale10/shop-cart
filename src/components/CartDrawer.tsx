import CartItemsList from './CartItemsList';
import { useAtomValue, useSetAtom } from 'jotai';
import { checkoutStatusAtom, cartErrorAtom, totalItemCountAtom, checkoutAtom } from '../atoms/CartAtoms';

type Props = {
  isOpen: boolean;
  onClose: () => void;
};

export default function CartDrawer({ isOpen, onClose }: Props) {
  const checkoutStatus = useAtomValue(checkoutStatusAtom);
  const cartError = useAtomValue(cartErrorAtom);
  const totalItemCount = useAtomValue(totalItemCountAtom);
  const onCheckout = useSetAtom(checkoutAtom);

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

        <div className="cart-checkout-status">
          {checkoutStatus === 'error' && (
            <p className="cart-checkout-error">
              Error occurred: {cartError}
            </p>
          )}
          {checkoutStatus === 'success' && (
            <p className="cart-checkout-success">Checkout successful!</p>
          )}
          {checkoutStatus === 'submitting' && (
            <p className="cart-checkout-submitting">Checking out...</p>
          )}
        </div>

        <div className="cart-drawer-footer">
          <button
            className="btn btn-checkout"
            onClick={() => onCheckout()}
            disabled={checkoutStatus === 'submitting' || totalItemCount === 0}
          >
            {checkoutStatus === 'submitting' ? 'Checking out...' : 'Checkout'}
          </button>
        </div>
      </aside>
    </>
  );
}
