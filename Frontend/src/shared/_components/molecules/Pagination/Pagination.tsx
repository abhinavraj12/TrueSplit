'use client';

import React, { useCallback, useMemo } from 'react';
import clsx from 'clsx';
import {
  FaChevronLeft,
  FaChevronRight,
  FaAngleDoubleLeft,
  FaAngleDoubleRight,
} from 'react-icons/fa';
import styles from './Pagination.module.css';

export interface PaginationProps {
  /** Current active page (1‑based) */
  currentPage: number;
  /** Total number of pages */
  totalPages: number;
  /** Callback when page changes */
  onPageChange: (page: number) => void;
  /** Number of sibling pages to show around current page */
  siblingCount?: number;
  /** If true, shows First / Last buttons */
  showFirstLast?: boolean;
  /** If true, shows Previous / Next buttons */
  showPrevNext?: boolean;
  /** Size variant */
  size?: 'sm' | 'md' | 'lg';
  /** Additional CSS class */
  className?: string;
  /** Custom aria-label for the navigation */
  ariaLabel?: string;
}

/**
 * Generate the list of page numbers and ellipsis markers.
 * Returns an array where -1 represents an ellipsis.
 */
const generatePages = (
  current: number,
  total: number,
  sibling: number,
): (number | -1)[] => {
  if (total <= 1) return [];

  const pages: (number | -1)[] = [];
  const left = Math.max(current - sibling, 1);
  const right = Math.min(current + sibling, total);

  if (left > 1) {
    pages.push(1);
    if (left > 2) pages.push(-1);
  }

  for (let i = left; i <= right; i++) {
    pages.push(i);
  }

  if (right < total) {
    if (right < total - 1) pages.push(-1);
    pages.push(total);
  }

  return pages;
};

/**
 * Pagination component – clean, modern navigation for lists.
 */
export const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
  siblingCount = 1,
  showFirstLast = true,
  showPrevNext = true,
  size = 'md',
  className,
  ariaLabel = 'Pagination',
}) => {
  // Defensive clamping: ensure currentPage is within valid range
  const safePage = Math.max(1, Math.min(currentPage, totalPages));

  const pages = useMemo(
    () => generatePages(safePage, totalPages, siblingCount),
    [safePage, totalPages, siblingCount],
  );

  const handlePageClick = useCallback(
    (page: number) => {
      if (page !== safePage) onPageChange(page);
    },
    [safePage, onPageChange],
  );

  const handlePrev = useCallback(() => {
    if (safePage > 1) onPageChange(safePage - 1);
  }, [safePage, onPageChange]);

  const handleNext = useCallback(() => {
    if (safePage < totalPages) onPageChange(safePage + 1);
  }, [safePage, totalPages, onPageChange]);

  const handleFirst = useCallback(() => onPageChange(1), [onPageChange]);
  const handleLast = useCallback(() => onPageChange(totalPages), [onPageChange, totalPages]);

  // Single click handler with data attribute to avoid inline functions
  const handlePageButtonClick = useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      const page = Number(e.currentTarget.dataset.page);
      if (!isNaN(page)) {
        handlePageClick(page);
      }
    },
    [handlePageClick],
  );

  if (totalPages <= 1) return null;

  const buttonSizeClass = styles[size];

  return (
    <nav className={clsx(styles.pagination, className)} aria-label={ariaLabel}>
      <ul className={styles.list}>
        {showFirstLast && (
          <li>
            <button
              type="button"
              onClick={handleFirst}
              disabled={safePage === 1}
              className={clsx(styles.button, buttonSizeClass, styles.firstLast)}
              aria-label="Go to first page"
            >
              <FaAngleDoubleLeft />
            </button>
          </li>
        )}
        {showPrevNext && (
          <li>
            <button
              type="button"
              onClick={handlePrev}
              disabled={safePage === 1}
              className={clsx(styles.button, buttonSizeClass, styles.prevNext)}
              aria-label="Go to previous page"
            >
              <FaChevronLeft />
            </button>
          </li>
        )}
        {pages.map((page, index) =>
          page === -1 ? (
            <li key={`ellipsis-${index}`}>
              <span className={clsx(styles.ellipsis, buttonSizeClass)} aria-hidden="true">
                …
              </span>
            </li>
          ) : (
            <li key={page}>
              {page === safePage ? (
                <span
                  className={clsx(
                    styles.button,
                    buttonSizeClass,
                    styles.pageButton,
                    styles.active,
                  )}
                  aria-current="page"
                >
                  {page}
                </span>
              ) : (
                <button
                  type="button"
                  data-page={page}
                  onClick={handlePageButtonClick}
                  className={clsx(
                    styles.button,
                    buttonSizeClass,
                    styles.pageButton,
                  )}
                  aria-label={`Go to page ${page}`}
                >
                  {page}
                </button>
              )}
            </li>
          ),
        )}
        {showPrevNext && (
          <li>
            <button
              type="button"
              onClick={handleNext}
              disabled={safePage === totalPages}
              className={clsx(styles.button, buttonSizeClass, styles.prevNext)}
              aria-label="Go to next page"
            >
              <FaChevronRight />
            </button>
          </li>
        )}
        {showFirstLast && (
          <li>
            <button
              type="button"
              onClick={handleLast}
              disabled={safePage === totalPages}
              className={clsx(styles.button, buttonSizeClass, styles.firstLast)}
              aria-label="Go to last page"
            >
              <FaAngleDoubleRight />
            </button>
          </li>
        )}
      </ul>
    </nav>
  );
};

Pagination.displayName = 'Pagination';

export default React.memo(Pagination);