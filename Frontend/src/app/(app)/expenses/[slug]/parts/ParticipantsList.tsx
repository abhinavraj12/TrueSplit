'use client';

import { ExpenseResponse } from '@/features/expenses';
import { getCurrencySymbol } from '@/features/expenses/utils/expense-utils';
import { Avatar } from '@/shared/_components/atoms/Avatar';
import { Badge } from '@/shared/_components/atoms/Badge';
import { Button } from '@/shared/_components/atoms/Button';
import styles from './ParticipantsList.module.css';

interface ParticipantsListProps {
  expense: ExpenseResponse;
  currentUserId: string;
  onRequestPayment?: (userId: string) => void;
  onApprovePayment?: (userId: string) => void;
  onRejectPayment?: (userId: string) => void;
  isLoading?: boolean;
}

const STATUS_VARIANT_MAP: Record<string, 'warning' | 'info' | 'success' | 'error' | 'default'> = {
  PENDING: 'warning',
  ACCEPTED: 'info',
  REJECTED: 'error',
  PAYMENT_REQUESTED: 'warning',
  SETTLED: 'success',
  CANCELLED: 'error',
};

const STATUS_LABEL_MAP: Record<string, string> = {
  PENDING: 'Pending',
  ACCEPTED: 'Accepted',
  REJECTED: 'Rejected',
  PAYMENT_REQUESTED: 'Waiting for approval',
  SETTLED: 'Settled',
  CANCELLED: 'Cancelled',
};

export function ParticipantsList({
  expense,
  currentUserId,
  onRequestPayment,
  onApprovePayment,
  onRejectPayment,
  isLoading = false
}: ParticipantsListProps) {
  const currencySymbol = getCurrencySymbol(expense.currency || 'INR');
  const isPayer = expense.paidBy.id === currentUserId;

  // Build a map of user ID -> share amount
  const shareMap = new Map<string, number>();
  if (expense.manualSplits) {
    expense.manualSplits.forEach((split) => {
      shareMap.set(split.userId, parseFloat(split.amount));
    });
  }

  // Build a map of user ID -> status (from participantSettlement)
  const statusMap = new Map<string, string>();
  if (expense.participantSettlement) {
    expense.participantSettlement.forEach((ps) => {
      statusMap.set(ps.userId, ps.status || 'PENDING');
    });
  }

  // Sort participants: current user first, then by name
  const sortedParticipants = [...expense.participants].sort((a, b) => {
    if (a.id === currentUserId) return -1;
    if (b.id === currentUserId) return 1;
    return a.name.localeCompare(b.name);
  });

  const handleRequestPayment = (userId: string) => {
    if (onRequestPayment) {
      onRequestPayment(userId);
    }
  };

  const handleApprovePayment = (userId: string) => {
    if (onApprovePayment) {
      onApprovePayment(userId);
    }
  };

  const handleRejectPayment = (userId: string) => {
    if (onRejectPayment) {
      onRejectPayment(userId);
    }
  };

  // Check if there are any pending participants (for waiting indicator)
  const hasPendingOthers = expense.participantSettlement?.some(
    (ps) => ps.userId !== currentUserId && ps.status === 'PENDING'
  ) ?? false;

  return (
    <div className={styles.section}>
      <h3 className={styles.title}>Participants</h3>
      <div className={styles.list}>
        {sortedParticipants.map((participant) => {
          const share = shareMap.get(participant.id) || 0;
          const isCurrentUser = participant.id === currentUserId;
          const isPayerUser = participant.id === expense.paidBy.id;

          // Get status from participantSettlement
          let status = statusMap.get(participant.id) || 'PENDING';

          // If expense is SETTLED, all participants are SETTLED
          if (expense.status === 'SETTLED') {
            status = 'SETTLED';
          }
          // If expense is CANCELLED, all participants are CANCELLED
          if (expense.status === 'CANCELLED') {
            status = 'CANCELLED';
          }

          const statusVariant = STATUS_VARIANT_MAP[status] || 'default';
          const statusLabel = STATUS_LABEL_MAP[status] || status;

          // Show waiting indicator if participant has accepted but expense is still PENDING
          const showWaitingIndicator = status === 'ACCEPTED' && expense.status === 'PENDING' && hasPendingOthers;

          // Determine which actions to show
          let actions: React.ReactNode = null;

          // Payer view: show approve/reject for PAYMENT_REQUESTED participants
          if (isPayer && status === 'PAYMENT_REQUESTED') {
            actions = (
              <div className={styles.actions}>
                <Button
                  variant="success"
                  size="sm"
                  onClick={() => handleApprovePayment(participant.id)}
                  loading={isLoading}
                  disabled={isLoading}
                >
                  Approve
                </Button>
                <Button
                  variant="danger"
                  size="sm"
                  onClick={() => handleRejectPayment(participant.id)}
                  loading={isLoading}
                  disabled={isLoading}
                >
                  Reject
                </Button>
              </div>
            );
          }
          // Participant view: show "Mark as Paid" if status is ACCEPTED and expense is ACTIVE
          else if (isCurrentUser && !isPayerUser && status === 'ACCEPTED' && expense.status === 'ACTIVE') {
            actions = (
              <div className={styles.actions}>
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => handleRequestPayment(participant.id)}
                  loading={isLoading}
                  disabled={isLoading}
                >
                  Mark as Paid
                </Button>
              </div>
            );
          }
          // If status is PAYMENT_REQUESTED and current user is the participant, show waiting message
          else if (isCurrentUser && status === 'PAYMENT_REQUESTED') {
            actions = (
              <div className={styles.waitingMessage}>
                ⏳ Waiting for approval
              </div>
            );
          }
          // If status is SETTLED, show settled with checkmark
          else if (status === 'SETTLED') {
            actions = (
              <div className={styles.settledMessage}>
                ✅ Paid
              </div>
            );
          }

          return (
            <div
              key={participant.id}
              className={`${styles.row} ${isCurrentUser ? styles.currentUser : ''}`}
            >
              <div className={styles.avatarWrapper}>
                <Avatar
                  size="sm"
                  src={participant.avatar || undefined}
                  name={isCurrentUser ? 'You' : participant.name}
                />
              </div>
              <div className={styles.info}>
                <div className={styles.nameRow}>
                  <span className={styles.name}>
                    {isCurrentUser ? 'You' : participant.name}
                  </span>
                  {isPayerUser && (
                    <span className={styles.payerBadge}>Payer</span>
                  )}
                  {isCurrentUser && !isPayerUser && (
                    <span className={styles.youBadge}>You</span>
                  )}
                  {showWaitingIndicator && (
                    <span className={styles.waitingIndicator}>(Waiting for others)</span>
                  )}
                </div>
                <div className={styles.shareRow}>
                  <span className={styles.share}>
                    {currencySymbol} {share.toFixed(2)}
                  </span>
                  <Badge variant={statusVariant} size="sm">
                    {statusLabel}
                  </Badge>
                </div>
                {actions && (
                  <div className={styles.actionRow}>
                    {actions}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default ParticipantsList;