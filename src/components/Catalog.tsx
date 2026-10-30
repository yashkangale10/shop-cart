import ProductCard from './ProductCard';
import { useAtomValue, useSetAtom } from 'jotai';
import { productsAtom, fetchStatusAtom, fetchProductsAtom } from '../atoms/CartAtoms';
import { useEffect } from 'react';

export default function Catalog() {
  const products = useAtomValue(productsAtom);
  const status = useAtomValue(fetchStatusAtom);
  const fetchProducts = useSetAtom(fetchProductsAtom);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  if (status === 'fetching')
    return <p className="catalog-status">Loading products…</p>;

  if (status === 'error')
    return <p className="catalog-status catalog-error">Something went wrong....</p>;

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
