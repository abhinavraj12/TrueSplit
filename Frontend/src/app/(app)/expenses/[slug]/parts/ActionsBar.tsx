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
  isLoading?: boolean;
}

export function ActionsBar({ 
  expense, 
  currentUserId, 
  onAction, 
  onApprovePayment, 
  onRejectPayment,
  isLoading = false 
}: ActionsBarProps) {
  const isPayer = expense.paidBy.id === currentUserId;
  const isParticipant = expense.participants.some((p) => p.id === currentUserId);
  const isSettled = expense.status === 'SETTLED';
  const isCancelled = expense.status === 'CANCELLED';
  const isActive = expense.status === 'ACTIVE';
  const isPending = expense.status === 'PENDING';
  const currencySymbol = getCurrencySymbol(expense.currency || 'INR');

  // Get current user's status
  let userStatus: string | null = null;
  if (expense.participantSettlement) {
    const settlement = expense.participantSettlement.find((s) => s.userId === currentUserId);
    if (settlement) {
      userStatus = settlement.status;
    }
  }

  // Check if there are any PAYMENT_REQUESTED participants
  const hasPendingRequests = useMemo(() => {
    return expense.participantSettlement?.some(
      (ps) => ps.userId !== expense.paidBy.id && ps.status === 'PAYMENT_REQUESTED'
    ) ?? false;
  }, [expense]);

  // Check if all non-payer participants are SETTLED
  const allNonPayerSettled = useMemo(() => {
    const nonPayers = expense.participantSettlement?.filter(
      (ps) => ps.userId !== expense.paidBy.id
    ) ?? [];
    return nonPayers.length > 0 && nonPayers.every((ps) => ps.status === 'SETTLED');
  }, [expense]);

  // Get pending requests list (for payer)
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
    // Payer on PENDING expense: show Settle and Cancel
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

    // Payer on ACTIVE expense
    if (isActive) {
      // If there are pending requests → show approvals
      if (hasPendingRequests) {
        return (
          <div className={styles.section}>
            <h3 className={styles.title}>Pending Approvals</h3>
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
          </div>
        );
      }

      // No pending requests – check if all non-payers have settled
      if (allNonPayerSettled) {
        // All participants have paid, payer can settle
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

      // Otherwise, waiting for participants
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
    // Participant on PENDING expense: show Accept / Reject
    if (isPending) {
      const hasAccepted = userStatus === 'SETTLED';
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
              disabled={isLoading || hasAccepted}
            >
              {hasAccepted ? 'Already Accepted' : 'Accept'}
            </Button>
            <Button
              variant="danger"
              size="md"
              fullWidth
              onClick={() => onAction?.('REJECT')}
              loading={isLoading}
              disabled={isLoading || hasAccepted}
            >
              {hasAccepted ? 'Already Accepted' : 'Reject'}
            </Button>
          </div>
          {hasAccepted && (
            <div className={styles.statusMessage}>
              <span className={styles.statusIcon}>✅</span>
              <span>You have already accepted this expense.</span>
            </div>
          )}
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

      // User has accepted but not settled
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