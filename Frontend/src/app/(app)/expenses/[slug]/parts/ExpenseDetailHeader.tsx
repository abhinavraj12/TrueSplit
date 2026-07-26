'use client';

import { ExpenseResponse } from '@/features/expenses';
import { Badge } from '@/shared/_components/atoms/Badge';
import { Typography } from '@/shared/_components/atoms/Typography';
import { getCurrencySymbol } from '@/features/expenses/utils/expense-utils';
import styles from './ExpenseDetailHeader.module.css';

interface ExpenseDetailHeaderProps {
  expense: ExpenseResponse;
  currentUserId: string;
}

const STATUS_VARIANT_MAP: Record<string, 'warning' | 'info' | 'success' | 'error'> = {
  PENDING: 'warning',
  ACTIVE: 'info',
  SETTLED: 'success',
  CANCELLED: 'error',
};

const STATUS_LABEL_MAP: Record<string, string> = {
  PENDING: 'Pending',
  ACTIVE: 'Active',
  SETTLED: 'Settled',
  CANCELLED: 'Cancelled',
};

export function ExpenseDetailHeader({ expense, currentUserId }: ExpenseDetailHeaderProps) {
  const currencySymbol = getCurrencySymbol(expense.currency || 'INR');
  const totalAmount = parseFloat(expense.totalAmount);
  const statusVariant = STATUS_VARIANT_MAP[expense.status] || 'info';
  const statusLabel = STATUS_LABEL_MAP[expense.status] || expense.status;
  const isPayer = expense.paidBy.id === currentUserId;
  const paidByLabel = isPayer ? 'You' : expense.paidBy.name;
  const participantCount = expense.participants.length;
  const createdDate = new Date(expense.createdAt);
  const formattedDate = createdDate.toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });

  return (
    <div className={styles.header}>
      <div className={styles.topRow}>
        <h1 className={styles.title}># {expense.title}</h1>
        <Badge variant={statusVariant} size="md" rounded>
          {statusLabel}
        </Badge>
      </div>

      <div className={styles.amountRow}>
        <span className={styles.amount}>
          {currencySymbol} {totalAmount.toFixed(2)}
        </span>
        <span className={styles.paidBy}>
          Paid by {paidByLabel}
        </span>
      </div>

      <div className={styles.metaRow}>
        <span>{formattedDate}</span>
        <span className={styles.metaSeparator}>·</span>
        <span>{participantCount} participant{participantCount !== 1 ? 's' : ''}</span>
      </div>
    </div>
  );
}

export default ExpenseDetailHeader;