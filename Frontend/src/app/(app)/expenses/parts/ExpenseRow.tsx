'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import type { ExpenseResponse, ExpenseStatus } from '@/features/expenses';
import { relativeTime } from '@/shared/lib/utils/date-utils';
import styles from './ExpenseRow.module.css';

interface ExpenseRowProps {
  expense: ExpenseResponse;
  currentUserId: string;
  onAction?: (expenseId: string, action: 'ACCEPT' | 'SETTLE') => void;
}

function getStatusDotClass(status: ExpenseStatus): string {
  const map: Record<ExpenseStatus, string> = {
    PENDING: styles.dotPending,
    ACTIVE: styles.dotActive,
    SETTLED: styles.dotSettled,
    CANCELLED: styles.dotCancelled,
    PAYMENT_REQUESTED: styles.dotPending,
  };
  return map[status] || styles.dotActive;
}

function getStatusDotAriaLabel(status: ExpenseStatus): string {
  const map: Record<ExpenseStatus, string> = {
    PENDING: 'Pending action',
    ACTIVE: 'Active',
    SETTLED: 'Settled',
    CANCELLED: 'Cancelled',
    PAYMENT_REQUESTED: 'Waiting for approval',
  };
  return map[status] || 'Unknown status';
}

function getUserShare(expense: ExpenseResponse, userId: string): number {
  // Safely check if manualSplits exists and is an array
  if (expense.manualSplits && expense.manualSplits.length > 0) {
    const split = expense.manualSplits.find((s) => s.userId === userId);
    if (split) {
      return parseFloat(split.amount) || 0;
    }
  }

  const total = parseFloat(expense.totalAmount) || 0;
  // Safely access participants array
  const count = expense.participants?.length ?? 0;
  if (count === 0) return 0;
  return Math.round((total / count) * 100) / 100;
}

function getActionState(
  expense: ExpenseResponse,
  userId: string
): {
  label: string;
  action: 'ACCEPT' | 'SETTLE' | null;
  interactive: boolean;
  color?: string;
} {
  const status = expense.status;
  const isPayer = expense.paidBy?.id === userId;
  const isParticipant = expense.participants?.some((p) => p.id === userId) ?? false;

  if (!isParticipant) {
    return { label: '', action: null, interactive: false };
  }

  if (status === 'SETTLED') {
    return { label: 'Settled', action: null, interactive: false, color: '#5cb88a' };
  }

  if (status === 'CANCELLED') {
    return { label: 'Cancelled', action: null, interactive: false };
  }

  if (isPayer) {
    if (status === 'ACTIVE' || status === 'PENDING') {
      return { label: 'Settle', action: 'SETTLE', interactive: true };
    }
    return { label: '', action: null, interactive: false };
  }

  // Participant (not payer)
  if (status === 'PENDING') {
    const share = getUserShare(expense, userId);
    const currencySymbol = expense.currency === 'INR' ? '₹' : expense.currency === 'USD' ? '$' : expense.currency || '';
    return {
      label: `Accept ${currencySymbol}${share.toFixed(2)}`,
      action: 'ACCEPT',
      interactive: true,
    };
  }

  if (status === 'ACTIVE') {
    return { label: 'Waiting', action: null, interactive: false };
  }

  return { label: '', action: null, interactive: false };
}

function getParticipantDisplay(expense: ExpenseResponse, currentUserId: string): string {
  // Ensure participants is an array
  const participants = expense.participants ?? [];
  const names = participants.map((p) => {
    if (p.id === currentUserId) return 'You';
    return p.name || 'Unknown';
  });

  let result = names.join(', ');
  if (result.length > 40) {
    result = result.slice(0, 37) + '…';
  }
  return result;
}

export function ExpenseRow({ expense, currentUserId, onAction }: ExpenseRowProps) {
  const router = useRouter();

  // If expense is completely missing, render nothing (optional safety)
  if (!expense) return null;

  const statusDotClass = getStatusDotClass(expense.status);
  const statusAriaLabel = getStatusDotAriaLabel(expense.status);
  const participantNames = getParticipantDisplay(expense, currentUserId);
  const paidByName = expense.paidBy?.name ?? 'Unknown';
  const timeAgo = expense.expenseDateTime ? relativeTime(expense.expenseDateTime) : 'Just now';
  const totalAmount = parseFloat(expense.totalAmount) || 0;
  const currencySymbol = expense.currency === 'INR' ? '₹' : expense.currency === 'USD' ? '$' : expense.currency || '';

  const actionState = getActionState(expense, currentUserId);

  const detailPath = expense.titleSlug
    ? `/expenses/${expense.titleSlug}`
    : `/expenses/${expense.id}`;

  const handleRowClick = () => {
    router.push(detailPath);
  };

  const handleActionClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (actionState.action && onAction) {
      onAction(expense.id, actionState.action);
    }
  };

  const maxAvatars = 3;
  // Safely get participants
  const participants = expense.participants ?? [];
  const visibleParticipants = participants.slice(0, maxAvatars);
  const extraCount = participants.length - maxAvatars;

  return (
    <div className={styles.row} onClick={handleRowClick} role="button" tabIndex={0}>
      <div className={styles.statusDotWrapper}>
        <span className={`${styles.statusDot} ${statusDotClass}`} aria-label={statusAriaLabel} />
      </div>

      <div className={styles.content}>
        <div className={styles.topLine}>
          <Link href={detailPath} className={styles.title}>
            {expense.title || 'Untitled Expense'}
          </Link>
          <div className={styles.avatarStack}>
            {visibleParticipants.map((participant) => (
              <div key={participant.id} className={styles.avatarItem}>
                {participant.avatar ? (
                  <img src={participant.avatar} alt={participant.name || 'Participant'} />
                ) : (
                  (participant.name?.charAt(0) || '?').toUpperCase()
                )}
              </div>
            ))}
            {extraCount > 0 && (
              <div className={`${styles.avatarItem} ${styles.overflow}`}>
                +{extraCount}
              </div>
            )}
          </div>
          <span className={styles.participantNames}>· {participantNames}</span>
        </div>
        <div className={styles.meta}>
          <span className={styles.paidBy}>Paid by {paidByName}</span>
          <span className={styles.time}>· {timeAgo}</span>
        </div>
      </div>

      <div className={styles.rightCol}>
        <span className={styles.amount}>
          {currencySymbol} {totalAmount.toFixed(2)}
        </span>
        {actionState.label && (
          <button
            className={`${styles.actionLink} ${!actionState.interactive ? styles.actionLinkStatic : ''}`}
            style={actionState.color ? { color: actionState.color } : undefined}
            onClick={handleActionClick}
            disabled={!actionState.interactive}
            aria-disabled={!actionState.interactive}
          >
            {actionState.label}
          </button>
        )}
      </div>
    </div>
  );
}

export default ExpenseRow;