import { useAtomValue } from 'jotai';
import { totalItemCountAtom } from '../atoms/CartAtoms';

export default function CartBadge() {
  const totalQty = useAtomValue(totalItemCountAtom);

  if (totalQty === 0) return null;

  return (
    <span className="cart-badge">
      {totalQty}
    </span>
  );
}
