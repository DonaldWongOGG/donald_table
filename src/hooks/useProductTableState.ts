import { useState, useMemo, useCallback } from 'react';
import type { Product } from '@/types/product';
import { PAGE_SIZE } from '@/constants';

const SEARCHABLE_PRODUCT_FIELDS: (keyof Product)[] = [
  'title',
  'description',
  'category',
  'brand',
];

function productMatchesSearchQuery(product: Product, searchQuery: string): boolean {
  if (!searchQuery.trim()) return true;
  const queryLower = searchQuery.toLowerCase();
  return SEARCHABLE_PRODUCT_FIELDS.some((field) => {
    const value = product[field];
    return typeof value === 'string' && value.toLowerCase().includes(queryLower);
  });
}

type SortDirection = 'asc' | 'desc';

type ActiveSort = {
  column: keyof Product | null;
  direction: SortDirection;
};

function compareForSort(
  valueA: unknown,
  valueB: unknown,
  direction: SortDirection
): number {
  const order = direction === 'asc' ? 1 : -1;
  if (typeof valueA === 'number' && typeof valueB === 'number') {
    return order * (valueA - valueB);
  }
  const strA = String(valueA ?? '');
  const strB = String(valueB ?? '');
  return order * strA.localeCompare(strB, undefined, { numeric: true });
}

export function useProductTableState(products: Product[], pageSize = PAGE_SIZE) {
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPageIndex, setCurrentPageIndex] = useState(0);
  const [activeSort, setActiveSort] = useState<ActiveSort>({
    column: null,
    direction: 'asc',
  });

  const productsMatchingSearch = useMemo(
    () => products.filter((p) => productMatchesSearchQuery(p, searchQuery)),
    [products, searchQuery]
  );

  const productsAfterSort = useMemo(() => {
    const { column, direction } = activeSort;
    if (!column) return productsMatchingSearch;
    return [...productsMatchingSearch].sort((a, b) =>
      compareForSort(a[column], b[column], direction)
    );
  }, [productsMatchingSearch, activeSort]);

  const totalPageCount = Math.max(1, Math.ceil(productsAfterSort.length / pageSize));
  const clampedPageIndex = Math.min(
    currentPageIndex,
    Math.max(0, totalPageCount - 1)
  );
  const sliceStart = clampedPageIndex * pageSize;

  const productsOnCurrentPage = useMemo(
    () => productsAfterSort.slice(sliceStart, sliceStart + pageSize),
    [productsAfterSort, sliceStart, pageSize]
  );

  const handleSearchChange = useCallback((newSearchQuery: string) => {
    setSearchQuery(newSearchQuery);
    setCurrentPageIndex(0);
    setActiveSort({ column: null, direction: 'asc' });
  }, []);

  const handleSortByColumn = useCallback((clickedColumn: keyof Product) => {
    setActiveSort((prev) => {
      const isSameColumn = prev.column === clickedColumn;
      const nextDirection: SortDirection =
        isSameColumn && prev.direction === 'asc' ? 'desc' : 'asc';
      if (isSameColumn) {
        return { ...prev, direction: nextDirection };
      }
      setCurrentPageIndex(0);
      return { column: clickedColumn, direction: 'asc' };
    });
  }, []);

  return {
    searchQuery,
    handleSearchChange,
    setCurrentPageIndex,
    productsAfterSort,
    totalPageCount,
    clampedPageIndex,
    productsOnCurrentPage,
    activeSortColumn: activeSort.column,
    activeSortDirection: activeSort.direction,
    handleSortByColumn,
  };
}
