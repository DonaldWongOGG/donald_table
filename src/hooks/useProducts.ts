import { useState, useEffect, useCallback, useRef } from 'react';
import { fetchProducts } from '@/api/products';
import { DEFAULT_FETCH_LIMIT } from '@/constants';
import type { Product, ProductCreate } from '@/types/product';

/**
 * Central state and actions for the products list.
 * - Fetches products on mount; supports refetch on error.
 * - Add product is mock-only: appends to local state with generated id/sku.
 */
export function useProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const abortRef = useRef<AbortController | null>(null);

  const load = useCallback(async () => {
    abortRef.current?.abort();
    abortRef.current = new AbortController();
    const signal = abortRef.current.signal;
    setLoading(true);
    setError(null);
    try {
      const data = await fetchProducts(DEFAULT_FETCH_LIMIT, signal);
      setProducts(data.products);
    } catch (e) {
      if ((e as Error).name === 'AbortError') return;
      setError(e instanceof Error ? e : new Error('Failed to load products'));
    } finally {
      setLoading(false);
      abortRef.current = null;
    }
  }, []);

  useEffect(() => {
    load();
    return () => {
      abortRef.current?.abort();
    };
  }, [load]);

  const addProduct = useCallback((product: ProductCreate) => {
    setProducts((prev) => {
      const nextId = Math.max(0, ...prev.map((p) => p.id)) + 1;
      return [
        {
          ...product,
          id: nextId,
          discountPercentage: 0,
          rating: product.rating ?? 0,
          stock: product.stock ?? 0,
          tags: [],
          sku: `MOCK-${nextId}`,
          thumbnail: product.thumbnail ?? product.images?.[0] ?? '',
          images: product.images ?? [],
          availabilityStatus: 'In Stock',
        } as Product,
        ...prev,
      ];
    });
  }, []);

  return { products, loading, error, refetch: load, addProduct };
}
