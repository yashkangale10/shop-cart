import { useEffect, useState } from 'react';
import type { Product } from '../types';
import ProductCard from './ProductCard';

export default function Catalog() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function fetchProducts() {
      try {
        const res = await fetch('/api/products');
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data: Product[] = await res.json();
        if (!cancelled) setProducts(data);
      } catch (err) {
        if (!cancelled)
          setError(err instanceof Error ? err.message : 'Failed to load products.');
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    void fetchProducts();
    return () => {
      cancelled = true;
    };
  }, []);

  if (loading)
    return <p className="catalog-status">Loading products…</p>;

  if (error)
    return <p className="catalog-status catalog-error">Error: {error}</p>;

  if (products.length === 0)
    return <p className="catalog-status">No products available.</p>;

  return (
    <section className="catalog">
      <h2 className="catalog-title">Products</h2>
      <div className="product-grid">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
}

