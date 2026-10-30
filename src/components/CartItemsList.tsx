import { useAtomValue, useSetAtom } from 'jotai';
import { cartItemsAtom, totalCartPriceAtom, removeItemAtom } from '../atoms/CartAtoms';

export default function CartItemsList() {

  const items = useAtomValue(cartItemsAtom);
  const total = useAtomValue(totalCartPriceAtom);
  const removeItem = useSetAtom(removeItemAtom);

  if (items.length === 0) {
    return <p className="cart-empty">Your cart is empty.</p>;
  }

  return (
    <div className="cart-items-list">
      <ul>
        {items.map((item) => (
          <li key={item.id} className="cart-item">
            <div className="cart-item-info">
              <span className="cart-item-name">{item.name}</span>
              <span className="cart-item-meta">
                ${item.price.toFixed(2)} × {item.quantity} ={' '}
                <strong>${(item.price * item.quantity).toFixed(2)}</strong>
              </span>
            </div>
            <button
              className="btn btn-remove"
              onClick={() => removeItem(item.id)}
            >
              Remove
            </button>
          </li>
        ))}
      </ul>
      <div className="cart-total">
        <strong>Total: ${total.toFixed(2)}</strong>
      </div>
    </div>
  );
}
