import { useCartDispatch } from '../context/CartContext';
import type { Product } from '../types';

type Props = { product: Product };

export default function ProductCard({ product }: Props) {
  const dispatch = useCartDispatch();

  function handleAdd() {
    dispatch({ type: 'ADD_PRODUCT', payload: product });
  }

  return (
    <article className="product-card">
      <h3 className="product-name">{product.name}</h3>
      <p className="product-price">${product.price.toFixed(2)}</p>
      <button className="btn btn-primary" onClick={handleAdd}>
        Add to Cart
      </button>
    </article>
  );
}

