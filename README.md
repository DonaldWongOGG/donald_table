# Products App

React + TypeScript app that fetches products from [DummyJSON](https://dummyjson.com/products), displays them in a searchable, sortable table with pagination, and supports adding new products (mock, client-side only).

---

## Setup instructions

**Prerequisites:** Node.js 18+ (or use the project’s preferred version if you use nvm/Volta).

1. **Clone and enter the repo**
   ```bash
   git clone <repo-url>
   cd my-app
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Run the dev server**
   ```bash
   npm run dev
   ```
   Open the URL shown (e.g. `http://localhost:5173`).

4. **Optional**
   - Build: `npm run build`
   - Preview production build: `npm run preview`
   - Lint: `npm run lint`

---

## Folder structure explanation

```
src/
├── api/
│   └── products.ts              # DummyJSON fetch; AbortSignal support
├── hooks/
│   ├── useProducts.ts            # Products list state, loading, error, refetch, addProduct (mock)
│   ├── useProductTableState.ts   # Search, sort, pagination (filter → sort → page)
│   └── useDebouncedCallback.ts   # Debounced callback for search input
├── types/
│   └── product.ts               # Product, ProductCreate, ProductsResponse
├── components/
│   ├── ProductTable.tsx         # Table + search + sortable headers + pagination; loading/error/empty
│   ├── ProductTable.module.scss
│   ├── Pagination.tsx           # Page controls
│   ├── Pagination.module.scss
│   ├── AddProductForm.tsx       # Add product form (mock submit)
│   ├── AddProductForm.module.scss
│   ├── FormFields.tsx           # Reusable form field renderer
│   └── FormFields.module.scss
├── constants/
│   └── index.ts                 # PAGE_SIZE, DEFAULT_FETCH_LIMIT, SEARCH_DEBOUNCE_MS, etc.
├── App.tsx
├── App.module.scss
├── main.tsx
└── index.css                    # Global styles, CSS variables
```

- **api/** — Network layer only; no React. Single `fetchProducts(limit?, signal?)` function.
- **hooks/** — `useProducts` = server state (fetch, refetch, add mock). `useProductTableState` = UI state (search, sort, page). `useDebouncedCallback` = generic debounce for search.
- **types/** — Shared TypeScript types for API and forms.
- **components/** — Presentational + wiring; each feature has its component + `.module.scss` (BEM, px, 414px breakpoint).
- **constants/** — Pagination size, fetch limit, debounce delay, success toast duration; single place to tune behaviour.
- Imports use the **`@/`** path alias for `src/` (see `tsconfig.app.json` and `vite.config.ts`).

---

## Key technical decisions

| Area | Decision | Rationale |
|------|----------|-----------|
| **Data fetching** | `useEffect` + `AbortController` in `useProducts` | Cancel in-flight request on unmount or refetch; ignore `AbortError` so unmount doesn’t set error state. |
| **Add product** | Mock-only, prepend to local state with generated id/sku | No backend; keeps demo self-contained and fast. |
| **Table state** | Dedicated hook `useProductTableState`: filter → sort → slice | Search/sort/page live in one place; search reset clears sort and page; sort column change resets page. |
| **Search UX** | `useDebouncedCallback` on search input | Filter runs after user stops typing; input stays responsive via local state. |
| **Styling** | BEM + SCSS modules, px, 414px mobile breakpoint | Scoped styles, predictable class names, simple responsive behaviour. |
| **Path alias** | `@/` → `src/` | Shorter, stable imports when moving files. |
| **Constants** | Single `constants/index.ts` | One place for PAGE_SIZE, DEFAULT_FETCH_LIMIT, SEARCH_DEBOUNCE_MS, SUCCESS_MESSAGE_MS. |

**Table behaviour:** Search filters by title, description, category, brand. Sort applies to the filtered list. Column headers (Title, Category, Brand, Price, Rating, Stock) toggle asc/desc; Image not sortable. Pagination clamps page index when the filtered list shrinks so we never show a blank page.

---

## What would be improved with more time

- **Full CRUD** — Implement Update (edit product) and Delete (remove product) with real API endpoints and UI (e.g. edit row/modal, delete confirmation); Read is already covered by fetch, Create by add-product.
- **Virtualisation** — For very large lists, use a virtualised table (e.g. `react-window` / `tanstack-virtual`) to keep DOM and scroll performance good.
- **Form validation** — Explicit schema (e.g. Zod) and clearer error messages on add-product form; optional client-side validation before submit.

---

## Quick reference

- **Run:** `npm run dev`
- **Build:** `npm run build`
- **Lint:** `npm run lint`
