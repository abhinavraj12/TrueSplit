import React, { useCallback } from 'react';
import clsx from 'clsx';
import { FaExclamationTriangle, FaCheckCircle } from 'react-icons/fa';
import { ToggleGroup } from '@/shared/_components/molecules/ToggleGroup';
import { AmountInput } from '@/shared/_components/molecules/AmountInput';
import { Avatar } from '@/shared/_components/atoms/Avatar';
import { Badge } from '@/shared/_components/atoms/Badge';
import type { SplitType } from '@/features/expenses';
import { getCurrencySymbol } from '@/features/expenses';
import styles from '../page.module.css';

interface Participant {
  id: string;
  name: string;
  email: string;
  avatar?: string;
}

export interface SplitSectionProps {
  participants: Participant[];
  splitType: SplitType;
  onSplitTypeChange: (splitType: SplitType) => void;
  paidBy: string;
  totalAmount: number | null;
  manualSplits: Record<string, number>;
  onManualSplitsChange: (splits: Record<string, number>) => void;
  equalShare: number;
  manualSum: number;
  remainingAmount: number;
  isFullyAllocated: boolean;
  currentUserId?: string;
  error?: string | null;
  className?: string;
}

const SPLIT_TYPE_OPTIONS = [
  { value: 'EQUAL', label: 'Equal' },
  { value: 'MANUAL', label: 'Manual' },
];

export const SplitSection: React.FC<SplitSectionProps> = ({
  participants,
  splitType,
  onSplitTypeChange,
  paidBy,
  totalAmount,
  manualSplits,
  onManualSplitsChange,
  equalShare,
  manualSum,
  remainingAmount,
  currentUserId,
  className = '',
}) => {
  const currency = 'INR';
  const currencySymbol = getCurrencySymbol(currency);
  const showSplitDetails = totalAmount !== null && totalAmount > 0;

  const handleSplitTypeChange = useCallback((value: string | string[]) => {
    if (typeof value === 'string' && (value === 'EQUAL' || value === 'MANUAL')) {
      onSplitTypeChange(value as SplitType);
    }
  }, [onSplitTypeChange]);

  const handleManualSplitChange = useCallback((participantId: string, amount: number | null) => {
    const newSplits = {
      ...manualSplits,
      [participantId]: amount ?? 0,
    };
    onManualSplitsChange(newSplits);
  }, [manualSplits, onManualSplitsChange]);

  const getPercentage = (share: number) => {
    if (!totalAmount || totalAmount === 0) return 0;
    return (share / totalAmount) * 100;
  };

  const allocationStatus = (() => {
    if (splitType !== 'MANUAL' || !totalAmount || totalAmount === 0) {
      return { type: 'idle' as const, message: '' };
    }
    if (remainingAmount > 0.01) {
      return {
        type: 'remaining' as const,
        message: `Remaining: ${currencySymbol} ${remainingAmount.toFixed(2)} to allocate`,
      };
    }
    if (remainingAmount < -0.01) {
      return {
        type: 'over' as const,
        message: `Over‑allocated by ${currencySymbol} ${(-remainingAmount).toFixed(2)}`,
      };
    }
    return {
      type: 'full' as const,
      message: 'Fully allocated',
    };
  })();

  const progressPercent = totalAmount && totalAmount > 0
    ? Math.min(100, (manualSum / totalAmount) * 100)
    : 0;

  const progressColor = (() => {
    if (splitType !== 'MANUAL' || !totalAmount || totalAmount === 0) {
      return 'var(--color-progress-fill)';
    }
    if (remainingAmount > 0.01) {
      return 'var(--color-warning-text)';
    }
    if (remainingAmount < -0.01) {
      return 'var(--color-error-text)';
    }
    return 'var(--color-success-text)';
  })();

  return (
    <div className={`${styles.fieldGroup} ${className}`}>
      <label className={styles.label}>
        Split type <span className={styles.required}>*</span>
      </label>

      <ToggleGroup
        options={SPLIT_TYPE_OPTIONS}
        value={splitType}
        onChange={handleSplitTypeChange}
        type="single"
        size="md"
        className={styles.splitToggle}
        fullWidth
      />

      {showSplitDetails ? (
        <div className={styles.fieldGroup}>
          <label className={styles.label}>
            {splitType === 'EQUAL' ? 'Shares (equal)' : 'Shares (manual)'}
          </label>

          <div className={styles.splitList}>
            {participants.map((participant) => {
              const isPayer = participant.id === paidBy;
              const share = splitType === 'EQUAL'
                ? equalShare
                : (manualSplits[participant.id] ?? 0);
              const isZeroShare = splitType === 'MANUAL' && share < 0.01;
              const percent = getPercentage(share);

              return (
                <div
                  key={participant.id}
                  className={clsx(styles.splitRow, isZeroShare && styles.splitRowZero)}
                >
                  <div className={styles.splitParticipant}>
                    <Avatar size="sm" name={participant.name} src={participant.avatar} />
                    <span className={styles.splitName}>
                      {participant.name}
                      {isPayer && (
                        <Badge variant="primary" size="sm" className={styles.payerBadge}>
                          Payer
                        </Badge>
                      )}
                      {participant.id === currentUserId && (
                        <Badge variant="default" size="sm" className={styles.youBadge}>
                          You
                        </Badge>
                      )}
                      {isZeroShare && (
                        <span className={styles.zeroShareWarning} title="No share allocated yet">
                          ⚠️
                        </span>
                      )}
                    </span>
                  </div>

                  {splitType === 'EQUAL' ? (
                    <span className={styles.splitAmount}>
                      {currencySymbol} {share.toFixed(2)}
                      <span className={styles.splitPercent}>
                        ({percent.toFixed(0)}%)
                      </span>
                    </span>
                  ) : (
                    <div className={styles.manualSplitRow}>
                      <AmountInput
                        value={manualSplits[participant.id] ?? 0}
                        onChange={(val) => handleManualSplitChange(participant.id, val)}
                        currencySymbol={currencySymbol}
                        currencyCode={currency}
                        size="sm"
                        className={styles.manualSplitInput}
                        placeholder="0.00"
                      />
                      <span className={styles.splitPercent}>
                        ({percent.toFixed(0)}%)
                      </span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {splitType === 'MANUAL' && (
            <div className={styles.manualSplitControls}>
              <div className={styles.manualAllocationStatus}>
                <span className={styles.manualAllocationLabel}>
                  {allocationStatus.type === 'remaining' && (
                    <span className={styles.manualAllocatedRemaining}>
                      <FaExclamationTriangle /> {allocationStatus.message}
                    </span>
                  )}
                  {allocationStatus.type === 'over' && (
                    <span className={styles.manualAllocatedOver}>
                      <FaExclamationTriangle /> {allocationStatus.message}
                    </span>
                  )}
                  {allocationStatus.type === 'full' && (
                    <span className={styles.manualAllocatedFull}>
                      <FaCheckCircle /> {allocationStatus.message}
                    </span>
                  )}
                  {allocationStatus.type === 'idle' && (
                    <span>Enter an amount to start splitting</span>
                  )}
                </span>
                <div className={styles.manualProgressBar}>
                  <div
                    className={styles.manualProgressFill}
                    style={{
                      width: `${progressPercent}%`,
                      background: progressColor,
                    }}
                  />
                </div>
              </div>
            </div>
          )}

          {/* REMOVED: {error && <div className={styles.fieldError}>{error}</div>} */}
        </div>
      ) : (
        <div className={styles.emptySplitState}>
          <span className={styles.emptySplitText}>Enter an amount to start splitting</span>
        </div>
      )}
    </div>
  );
};

export default SplitSection;