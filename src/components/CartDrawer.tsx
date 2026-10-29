import CartItemsList from './CartItemsList';

type Props = {
  isOpen: boolean;
  onClose: () => void;
};

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

        <div className="cart-drawer-footer">
          <button className="btn btn-checkout">
            Checkout
          </button>
        </div>
      </aside>
    </>
  );
}

