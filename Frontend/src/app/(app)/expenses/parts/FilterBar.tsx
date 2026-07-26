'use client';

import type { ExpenseStatus } from '@/features/expenses';
import styles from './FilterBar.module.css';

interface FilterBarProps {
  /** Currently active status filter (null = "All") */
  activeStatus: ExpenseStatus | null;
  /** Callback when a filter is selected */
  onChange: (status: ExpenseStatus | null) => void;
}

const FILTERS: Array<{ label: string; value: ExpenseStatus | null }> = [
  { label: 'All', value: null },
  { label: 'Active', value: 'ACTIVE' },
  { label: 'Pending', value: 'PENDING' },
  { label: 'Settled', value: 'SETTLED' },
];

export function FilterBar({ activeStatus, onChange }: FilterBarProps) {
  return (
    <div className={styles.container} role="tablist" aria-label="Filter expenses by status">
      {FILTERS.map((filter) => {
        const isActive = activeStatus === filter.value;
        return (
          <span
            key={filter.label}
            className={`${styles.filter} ${isActive ? styles.active : ''}`}
            role="tab"
            aria-selected={isActive}
            tabIndex={0}
            onClick={() => onChange(filter.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                onChange(filter.value);
              }
            }}
          >
            {filter.label}
          </span>
        );
      })}
    </div>
  );
}

export default FilterBar;