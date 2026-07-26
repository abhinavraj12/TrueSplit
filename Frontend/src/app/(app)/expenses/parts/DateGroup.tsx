'use client';

import type { ExpenseResponse } from '@/features/expenses';
import { ExpenseRow } from './ExpenseRow';
import styles from './DateGroup.module.css';

interface DateGroupProps {
  /** The date label (e.g., "Today · Jul 26") */
  label: string;
  /** List of expenses belonging to this date */
  expenses: ExpenseResponse[];
  /** The ID of the currently authenticated user */
  currentUserId: string;
  /** Callback when an expense action is triggered (accept/reject/settle) */
  onAction?: (expenseId: string, action: 'ACCEPT' | 'REJECT' | 'SETTLE') => void;
}

export function DateGroup({ label, expenses, currentUserId, onAction }: DateGroupProps) {
  return (
    <div className={styles.group}>
      <div className={styles.header}>
        <span className={styles.label}>{label}</span>
        <span className={styles.line} />
      </div>
      <div className={styles.list}>
        {expenses.map((expense) => (
          <ExpenseRow
            key={expense.id}
            expense={expense}
            currentUserId={currentUserId}
            onAction={onAction}
          />
        ))}
      </div>
    </div>
  );
}

export default DateGroup;