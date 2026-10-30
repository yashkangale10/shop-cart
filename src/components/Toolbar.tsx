import CartBadge from './CartBadge';
import { useSetAtom } from 'jotai';
import { toggleCartDrawerAtom } from '../atoms/CartAtoms';

export default function Toolbar() {

  const toggleCartDrawer = useSetAtom(toggleCartDrawerAtom);

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
