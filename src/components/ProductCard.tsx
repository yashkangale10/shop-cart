import { useCartStore } from '../store/CartStore';
import type { Product } from '../types';

type Props = { product: Product };

export default function ProductCard({ product }: Props) {

  const addToCart = useCartStore((s) => s.addItem);

  return (
    <article className="product-card">
      <h3 className="product-name">{product.name}</h3>
      <p className="product-price">${product.price.toFixed(2)}</p>
      <button className="btn btn-primary" onClick={() => addToCart(product)}>
        Add to Cart
      </button>
    </article>
  );
}

