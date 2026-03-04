import { ProductTable } from '@/components/ProductTable';
import { AddProductForm } from '@/components/AddProductForm';
import { useProducts } from '@/hooks/useProducts';
import styles from '@/App.module.scss';

/** Root layout: header, add form, and product table (loading/error handled inside table). */
export default function App() {
  const { products, loading, error, refetch, addProduct } = useProducts();

  return (
    <div className={styles['app']}>
      <header className={styles['app__header']}>
        <h1 className={styles['app__title']}>Products</h1>
        <p className={styles['app__subtitle']}>DummyJSON products with search &amp; pagination</p>
      </header>

      <AddProductForm onSubmit={addProduct} />

      <ProductTable
        products={products}
        loading={loading}
        error={error}
        onRetry={refetch}
      />
    </div>
  );
}
