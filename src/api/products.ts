import type { ProductsResponse } from '@/types/product';

const API_BASE = 'https://dummyjson.com';

/**
 * Fetches products from the DummyJSON API.
 * @param limit - Max number of products to return (default 100).
 * @param signal - Optional AbortSignal to cancel the request (e.g. on component unmount).
 * @throws Error with status and statusText when the response is not ok.
 */
export async function fetchProducts(
  limit: number = 100,
  signal?: AbortSignal
): Promise<ProductsResponse> {
  const res = await fetch(`${API_BASE}/products?limit=${limit}`, { signal });
  if (!res.ok) {
    const message = res.statusText || `HTTP ${res.status}`;
    throw new Error(`Failed to fetch products: ${message}`);
  }
  return res.json();
}
