import CartBadge from './CartBadge';

type Props = {
  onCartOpen: () => void;
};

export default function Toolbar({ onCartOpen }: Props) {
  return (
    <div className="toolbar">
      <span className="store-name">ShopCart</span>
      <button
        className="btn btn-cart"
        onClick={onCartOpen}

      >
        🛒
        <CartBadge />
      </button>
    </div>
  );
}

