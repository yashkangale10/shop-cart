import CartBadge from './CartBadge';
import { useCartStore } from '../store/CartStore';

export default function Toolbar() {

  const toggleCartDrawer = useCartStore((state) => state.toggleCartDrawer)

  return (
    <div className="toolbar">
      <span className="store-name">ShopCart</span>
      <button
        className="btn btn-cart"
        onClick={() => toggleCartDrawer()}
      >
        🛒
        <CartBadge />
      </button>
    </div>
  );
}

