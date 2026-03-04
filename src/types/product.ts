/**
 * Product and API types for the products app.
 * Matches DummyJSON products API shape; ProductCreate is the subset used for the add form.
 */

export interface ProductReview {
  rating: number;
  comment: string;
  date: string;
  reviewerName: string;
  reviewerEmail: string;
}

export interface Product {
  id: number;
  title: string;
  description: string;
  category: string;
  price: number;
  discountPercentage: number;
  rating: number;
  stock: number;
  tags: string[];
  brand?: string;
  sku: string;
  thumbnail: string;
  images: string[];
  availabilityStatus: string;
  [key: string]: unknown;
}

export interface ProductsResponse {
  products: Product[];
  total: number;
  skip: number;
  limit: number;
}

export type ProductCreate = Pick<
  Product,
  'title' | 'description' | 'category' | 'price' | 'rating' | 'stock' | 'brand'
> & {
  brand?: string;
  images?: string[];
  thumbnail?: string;
};
