import type { Dispatch, SetStateAction } from 'react';
import styles from '@/components/Pagination.module.scss';

export interface PaginationProps {
  currentPage: number;
  totalPages: number;
  setPage: Dispatch<SetStateAction<number>>;
}

export function Pagination({
  currentPage,
  totalPages,
  setPage,
}: PaginationProps) {
  return (
    <div className={styles.pagination}>
      <button
        type="button"
        onClick={() => setPage((n) => Math.max(0, n - 1))}
        disabled={currentPage === 0}
      >
        Previous
      </button>
      <span>
        Page {currentPage + 1} of {totalPages}
      </span>
      <button
        type="button"
        onClick={() => setPage((n) => Math.min(totalPages - 1, n + 1))}
        disabled={currentPage >= totalPages - 1}
      >
        Next
      </button>
    </div>
  );
}
