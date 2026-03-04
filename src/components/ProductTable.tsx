import { useState, useEffect } from 'react';
import type { Product } from '@/types/product';
import { useProductTableState } from '@/hooks/useProductTableState';
import { useDebouncedCallback } from '@/hooks/useDebouncedCallback';
import { SEARCH_DEBOUNCE_MS } from '@/constants';
import { Pagination } from '@/components/Pagination';
import styles from '@/components/ProductTable.module.scss';

const PLACEHOLDER_IMAGE =
  'data:image/svg+xml,' +
  encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 48 48"><rect width="48" height="48" fill="#333"/><text x="24" y="26" text-anchor="middle" fill="#888" font-size="10">No image</text></svg>'
  );

/**
 * Displays products in a table with client-side search and pagination.
 * Handles loading state (spinner), error state (message + retry), and empty state (no results).
 */

interface ProductTableProps {
  products: Product[];
  loading: boolean;
  error: Error | null;
  onRetry: () => void;
}

interface ProductTableHeadProps {
  headers: { label: string; sortKey?: keyof Product }[];
  activeSortColumn: keyof Product | null;
  activeSortDirection: 'asc' | 'desc';
  onSortByColumn: (column: keyof Product) => void;
  styles: Record<string, string>;
}

const ProductTableHeader: { label: string; sortKey?: keyof Product }[] = [
  { label: 'Image' },
  { label: 'Title', sortKey: 'title' },
  { label: 'Category', sortKey: 'category' },
  { label: 'Brand', sortKey: 'brand' },
  { label: 'Price', sortKey: 'price' },
  { label: 'Rating', sortKey: 'rating' },
  { label: 'Stock', sortKey: 'stock' },
];

function LoadingState() {
  return (
    <div
      className={styles['product-table__state']}
      role="status"
      aria-live="polite"
      aria-busy="true"
    >
      <div className={styles['product-table__spinner']} aria-hidden />
      <p>Loading products…</p>
    </div>
  );
}

function ErrorState({ error, onRetry }: { error: Error; onRetry: () => void }) {
  return (
    <div
      className={styles['product-table__state']}
      role="alert"
      aria-live="assertive"
    >
      <p className={styles['product-table__error-text']}>{error.message}</p>
      <button type="button" onClick={onRetry}>
        Retry
      </button>
    </div>
  );
}


function ProductTableHead({
  headers,
  activeSortColumn,
  activeSortDirection,
  onSortByColumn,
  styles,
}: ProductTableHeadProps) {
  return (
    <thead>
      <tr>
        {headers.map((header) => (
          <th key={header.label}>
            {header.sortKey != null ? (
              <button
                type="button"
                className={styles['product-table__sort']}
                onClick={() => onSortByColumn(header.sortKey as keyof Product)}
              >
                {header.label}
                {activeSortColumn === header.sortKey && (
                  <span aria-hidden>
                    {activeSortDirection === 'asc' ? ' \u25B2' : ' \u25BC'}
                  </span>
                )}
              </button>
            ) : (
              header.label
            )}
          </th>
        ))}
      </tr>
    </thead>
  );
}

export function ProductTable({
  products,
  loading,
  error,
  onRetry,
}: ProductTableProps) {

  const {
    searchQuery,
    handleSearchChange,
    setCurrentPageIndex,
    productsAfterSort,
    totalPageCount,
    clampedPageIndex,
    productsOnCurrentPage,
    activeSortColumn,
    activeSortDirection,
    handleSortByColumn,
  } = useProductTableState(products);

  const [inputValue, setInputValue] = useState(searchQuery);
  const debouncedHandleSearchChange = useDebouncedCallback(handleSearchChange, SEARCH_DEBOUNCE_MS);

  useEffect(() => {
    setInputValue(searchQuery);
  }, [searchQuery]);

  if (loading) return <LoadingState />;
  if (error) return <ErrorState error={error} onRetry={onRetry} />;


  return (
    <section className={styles['product-table']}>
      <div className={styles['product-table__toolbar']}>
        <input
          type="search"
          placeholder="Search by title, category, brand…"
          value={inputValue}
          onChange={(e) => {
            const v = e.target.value;
            setInputValue(v);
            debouncedHandleSearchChange(v);
          }}
          className={styles['product-table__search']}
          aria-label="Search products"
        />
        <span className={styles['product-table__count']}>
          {productsAfterSort.length} product{productsAfterSort.length !== 1 ? 's' : ''}
        </span>
      </div>

      <div className={styles['product-table__table-wrap']}>
        <table className={styles['product-table__table']}>
          <ProductTableHead
            headers={ProductTableHeader}
            activeSortColumn={activeSortColumn}
            activeSortDirection={activeSortDirection}
            onSortByColumn={handleSortByColumn}
            styles={styles}
          />
          <tbody>
            {productsOnCurrentPage.length === 0 ? (
              <tr>
                <td
                  colSpan={ProductTableHeader.length}
                  className={styles['product-table__empty']}
                  role="status"
                >
                  No products match your search.
                </td>
              </tr>
            ) : (
              productsOnCurrentPage.map((product: Product) => (
                <tr key={product.id}>
                  <td className={styles['product-table__image']} data-label="Image">
                    <img
                      src={product.thumbnail || product.images?.[0]}
                      alt=""
                      className={styles['product-table__thumb']}
                      loading="lazy"
                      onError={(e) => {
                        const el = e.currentTarget;
                        el.onerror = null;
                        el.src = PLACEHOLDER_IMAGE;
                      }}
                    />
                  </td>
                  <td className={styles['product-table__title']} data-label="Title">
                    <strong>{product.title}</strong>
                  </td>
                  <td className={styles['product-table__category']} data-label="Category">{product.category}</td>
                  <td className={styles['product-table__brand']} data-label="Brand">{product.brand ?? '—'}</td>
                  <td className={styles['product-table__price']} data-label="Price">${product.price.toFixed(2)}</td>
                  <td className={styles['product-table__rating']} data-label="Rating">{product.rating}</td>
                  <td className={styles['product-table__stock']} data-label="Stock">{product.stock}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {totalPageCount > 1 && (
        <Pagination
          currentPage={clampedPageIndex}
          totalPages={totalPageCount}
          setPage={setCurrentPageIndex}
        />
      )}
    </section>
  );
}
