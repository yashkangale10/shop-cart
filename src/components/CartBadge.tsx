import { useCartState } from '../context/CartContext';

export default function CartBadge() {
  const { items } = useCartState();
  const totalQty = items.reduce((sum, item) => sum + item.quantity, 0);

  if (totalQty === 0) return null;

  return (
    <span className="cart-badge">
      {totalQty}
    </span>
  );
}

