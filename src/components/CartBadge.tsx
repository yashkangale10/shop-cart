import { useCartStore } from "../store/CartStore";

export default function CartBadge() {
  const items = useCartStore((state) => state.items);
  const totalQty = items.reduce((sum, item) => sum + (item.quantity || 0), 0);

  if (totalQty === 0) return null;

  return (
    <span className="cart-badge">
      {totalQty}
    </span>
  );
}
