# Products App

React + TypeScript app that fetches products from [DummyJSON](https://dummyjson.com/products), displays them in a searchable, sortable table with pagination, and supports adding new products (mock, client-side only).

## Run

```bash
npm install
npm run dev
```

Build: `npm run build`

## Code structure

```
src/
├── api/
│   └── products.ts           # fetchProducts(limit?, signal?)
├── hooks/
│   ├── useProducts.ts         # Products state, loading, error, refetch, addProduct
│   └── useProductTableState.ts # Search, sort, pagination for table (filter → sort → page)
├── types/
│   └── product.ts             # Product, ProductCreate, ProductsResponse
├── components/
│   ├── ProductTable.tsx       # Table + search + sortable headers + pagination; loading/error/empty
│   ├── ProductTable.module.scss
│   ├── Pagination.tsx        # Page controls
│   ├── Pagination.module.scss
│   ├── AddProductForm.tsx    # Add product form (mock submit)
│   ├── AddProductForm.module.scss
│   ├── FormFields.tsx        # Reusable form field renderer (used by AddProductForm)
│   └── FormFields.module.scss
├── constants/               # PAGE_SIZE, DEFAULT_FETCH_LIMIT, SEARCH_DEBOUNCE_MS, SUCCESS_MESSAGE_MS
│   └── index.ts
├── App.tsx
├── App.module.scss
├── main.tsx
└── index.css
```

- **Path alias**: Imports use `@/` for `src/` (e.g. `@/components/ProductTable`, `@/hooks/useProductTableState`). Configured in `tsconfig.app.json` and `vite.config.ts`.
- **Single responsibility**: API only fetches; `useProducts` owns products state and async; `useProductTableState` owns search/sort/page state; components render and callbacks.
- **Constants** for pagination and fetch limit in one place.
- **BEM + SCSS** for styles; px units; mobile breakpoint at 414px (iPhone SE).

## State management and async

- **useProducts**: Single source of truth for product list — `products`, `loading`, `error`, `refetch`, `addProduct`. Fetch on mount with `useEffect`; **AbortController** cancels in-flight request on unmount or when `refetch` runs; **AbortError** is ignored so we don’t set error state after unmount.
- **useProductTableState**: Table UI state — `searchQuery`, `handleSearchChange`, sort (`activeSortColumn`, `activeSortDirection`, `handleSortByColumn`), pagination (`clampedPageIndex`, `totalPageCount`, `setCurrentPageIndex`). Pipeline: filter by search → sort by column → slice for current page. Changing search resets sort and page; changing sort column resets page.
- **useDebouncedCallback**: Wraps a callback so it runs only after a delay (e.g. `SEARCH_DEBOUNCE_MS`) with no further calls. Used on the search input so filtering runs after the user stops typing; input stays responsive via local state.
- **Add product**: Mock-only; updates local state with new id/sku and prepends to the list; no API call.

## Table behaviour

- **Search**: Filters by title, description, category, brand. Sort applies to the filtered list.
- **Sort**: Click a column header (Title, Category, Brand, Price, Rating, Stock) — first click ascending (▲), second click descending (▼), then toggles. Image column not sortable. Table uses a `ProductTableHead` subcomponent for the sortable thead.
- **Pagination**: Page size from constants; page index clamped when filtered list shrinks so we don’t show a blank page.
