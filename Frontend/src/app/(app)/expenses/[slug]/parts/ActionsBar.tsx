'use client';

import { useMemo } from 'react';
import { ExpenseResponse } from '@/features/expenses';
import { getCurrencySymbol } from '@/features/expenses/utils/expense-utils';
import { Button } from '@/shared/_components/atoms/Button';
import styles from './ActionsBar.module.css';

interface ActionsBarProps {
  expense: ExpenseResponse;
  currentUserId: string;
  onAction?: (action: 'ACCEPT' | 'REJECT' | 'SETTLE' | 'CANCEL') => void;
  onApprovePayment?: (userId: string) => void;
  onRejectPayment?: (userId: string) => void;
  onApproveAll?: () => void;
  isLoading?: boolean;
}

export function ActionsBar({
  expense,
  currentUserId,
  onAction,
  onApprovePayment,
  onRejectPayment,
  onApproveAll,
  isLoading = false
}: ActionsBarProps) {
  const isPayer = expense.paidBy.id === currentUserId;
  const isParticipant = expense.participants.some((p) => p.id === currentUserId);
  const isSettled = expense.status === 'SETTLED';
  const isCancelled = expense.status === 'CANCELLED';
  const isActive = expense.status === 'ACTIVE';
  const isPending = expense.status === 'PENDING';
  const currencySymbol = getCurrencySymbol(expense.currency || 'INR');

  let userStatus: string | null = null;
  if (expense.participantSettlement) {
    const settlement = expense.participantSettlement.find((s) => s.userId === currentUserId);
    if (settlement) {
      userStatus = settlement.status;
    }
  }

  const hasPendingRequests = useMemo(() => {
    return expense.participantSettlement?.some(
      (ps) => ps.userId !== expense.paidBy.id && ps.status === 'PAYMENT_REQUESTED'
    ) ?? false;
  }, [expense]);

  const allNonPayerSettled = useMemo(() => {
    const nonPayers = expense.participantSettlement?.filter(
      (ps) => ps.userId !== expense.paidBy.id
    ) ?? [];
    return nonPayers.length > 0 && nonPayers.every((ps) => ps.status === 'SETTLED');
  }, [expense]);

  const pendingRequests = useMemo(() => {
    if (!expense.participantSettlement) return [];
    return expense.participantSettlement
      .filter((ps) => ps.userId !== expense.paidBy.id && ps.status === 'PAYMENT_REQUESTED')
      .map((ps) => {
        const participant = expense.participants.find((p) => p.id === ps.userId);
        const share = expense.manualSplits?.find((s) => s.userId === ps.userId);
        return {
          userId: ps.userId,
          name: participant?.name || 'Unknown',
          share: share ? parseFloat(share.amount) : 0,
        };
      });
  }, [expense]);

  const hasPendingOthers = expense.participantSettlement?.some(
    (ps) => ps.userId !== currentUserId && ps.status === 'PENDING'
  ) ?? false;

  // --- IF SETTLED OR CANCELLED ---
  if (isSettled) {
    return (
      <div className={styles.section}>
        <h3 className={styles.title}>Payment Status</h3>
        <div className={styles.statusMessage}>
          <span className={styles.statusIcon}>✅</span>
          <span>This expense has been settled.</span>
        </div>
      </div>
    );
  }

  if (isCancelled) {
    return (
      <div className={styles.section}>
        <h3 className={styles.title}>Status</h3>
        <div className={styles.statusMessage}>
          <span className={styles.statusIcon}>❌</span>
          <span>This expense has been cancelled.</span>
        </div>
      </div>
    );
  }

  // --- PAYER VIEW (ACTIVE or PENDING) ---
  if (isPayer) {
    if (isPending) {
      return (
        <div className={styles.section}>
          <h3 className={styles.title}>Actions</h3>
          <div className={styles.buttonGroup}>
            <Button
              variant="success"
              size="md"
              fullWidth
              onClick={() => onAction?.('SETTLE')}
              loading={isLoading}
              disabled={isLoading}
            >
              Mark as Settled
            </Button>
            <Button
              variant="danger"
              size="md"
              fullWidth
              onClick={() => onAction?.('CANCEL')}
              loading={isLoading}
              disabled={isLoading}
            >
              Cancel Expense
            </Button>
          </div>
        </div>
      );
    }

    if (isActive) {
      if (hasPendingRequests) {
        return (
          <div className={styles.section}>
            <h3 className={styles.title}>Pending Payment Approvals</h3>
            <div className={styles.pendingList}>
              {pendingRequests.map((request) => (
                <div key={request.userId} className={styles.pendingItem}>
                  <span className={styles.pendingName}>{request.name}</span>
                  <span className={styles.pendingAmount}>
                    {currencySymbol} {request.share.toFixed(2)}
                  </span>
                  <div className={styles.pendingActions}>
                    <Button
                      variant="success"
                      size="sm"
                      onClick={() => onApprovePayment?.(request.userId)}
                      loading={isLoading}
                      disabled={isLoading}
                    >
                      Approve
                    </Button>
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() => onRejectPayment?.(request.userId)}
                      loading={isLoading}
                      disabled={isLoading}
                    >
                      Reject
                    </Button>
                  </div>
                </div>
              ))}
            </div>
            {onApproveAll && (
              <div className={styles.approveAllContainer}>
                <Button
                  variant="success"
                  size="md"
                  fullWidth
                  onClick={onApproveAll}
                  loading={isLoading}
                  disabled={isLoading}
                >
                  Approve All
                </Button>
              </div>
            )}
          </div>
        );
      }

      if (allNonPayerSettled) {
        return (
          <div className={styles.section}>
            <h3 className={styles.title}>Payment Status</h3>
            <div className={styles.statusMessage}>
              <span className={styles.statusIcon}>✅</span>
              <span>All participants have settled their shares. You can now mark this expense as settled.</span>
            </div>
            <div className={styles.buttonGroup}>
              <Button
                variant="success"
                size="md"
                fullWidth
                onClick={() => onAction?.('SETTLE')}
                loading={isLoading}
                disabled={isLoading}
              >
                Mark as Settled
              </Button>
            </div>
          </div>
        );
      }

      return (
        <div className={styles.section}>
          <h3 className={styles.title}>Payment Status</h3>
          <div className={styles.statusMessage}>
            <span className={styles.statusIcon}>⏳</span>
            <span>Waiting for participants to settle their shares.</span>
          </div>
        </div>
      );
    }
  }

  // --- PARTICIPANT VIEW (non-payer) ---
  if (isParticipant && !isPayer) {
    // Participant on PENDING expense
    if (isPending) {
      // If user already accepted, show status message
      if (userStatus === 'ACCEPTED') {
        return (
          <div className={styles.section}>
            <h3 className={styles.title}>Your Status</h3>
            <div className={styles.statusMessage}>
              <span className={styles.statusIcon}>✅</span>
              <span>You have accepted this bill.</span>
            </div>
            {hasPendingOthers && (
              <div className={styles.statusMessage}>
                <span className={styles.statusIcon}>⏳</span>
                <span>Waiting for other participants to accept.</span>
              </div>
            )}
          </div>
        );
      }

      if (userStatus === 'SETTLED') {
        return (
          <div className={styles.section}>
            <h3 className={styles.title}>Your Status</h3>
            <div className={styles.statusMessage}>
              <span className={styles.statusIcon}>✅</span>
              <span>You have already settled this expense.</span>
            </div>
          </div>
        );
      }

      // User is PENDING – show Accept/Reject buttons
      return (
        <div className={styles.section}>
          <h3 className={styles.title}>Actions</h3>
          <div className={styles.buttonGroup}>
            <Button
              variant="primary"
              size="md"
              fullWidth
              onClick={() => onAction?.('ACCEPT')}
              loading={isLoading}
              disabled={isLoading}
            >
              Accept the Bill
            </Button>
            <Button
              variant="danger"
              size="md"
              fullWidth
              onClick={() => onAction?.('REJECT')}
              loading={isLoading}
              disabled={isLoading}
            >
              Reject
            </Button>
          </div>
        </div>
      );
    }

    // Participant on ACTIVE expense
    if (isActive) {
      if (userStatus === 'SETTLED') {
        return (
          <div className={styles.section}>
            <h3 className={styles.title}>Payment Status</h3>
            <div className={styles.statusMessage}>
              <span className={styles.statusIcon}>✅</span>
              <span>You have already settled this expense.</span>
            </div>
          </div>
        );
      }

      if (userStatus === 'PAYMENT_REQUESTED') {
        return (
          <div className={styles.section}>
            <h3 className={styles.title}>Payment Status</h3>
            <div className={styles.statusMessage}>
              <span className={styles.statusIcon}>⏳</span>
              <span>Your payment request is awaiting approval from the payer.</span>
            </div>
          </div>
        );
      }

      return (
        <div className={styles.section}>
          <h3 className={styles.title}>Payment Status</h3>
          <div className={styles.statusMessage}>
            <span className={styles.statusIcon}>⏳</span>
            <span>Waiting for the payer to settle this expense.</span>
          </div>
        </div>
      );
    }
  }

  // --- FALLBACK ---
  return (
    <div className={styles.section}>
      <h3 className={styles.title}>Status</h3>
      <div className={styles.statusMessage}>
        <span className={styles.statusIcon}>ℹ️</span>
        <span>No actions available for this expense.</span>
      </div>
    </div>
  );
}

export default ActionsBar;