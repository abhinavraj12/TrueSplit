import React from 'react';
import { AmountInput } from '@/shared/_components/molecules/AmountInput';
import { CurrencySelector } from '@/shared/_components/molecules/CurrencySelector';
import { getCurrencySymbol } from '@/features/expenses';
import styles from '../page.module.css';

export interface AmountSectionProps {
  totalAmount: number | null;
  onAmountChange: (value: number | null) => void;
  currency: string;
  onCurrencyChange: (currency: string) => void;
  error?: string | null;
  autoFocus?: boolean;
  className?: string;
}

export const AmountSection: React.FC<AmountSectionProps> = ({
  totalAmount,
  onAmountChange,
  currency,
  onCurrencyChange,
  error,
  autoFocus = false,
  className = '',
}) => {
  const currencySymbol = getCurrencySymbol(currency);

  return (
    <div className={`${styles.fieldGroup} ${className}`}>
      <div className={styles.amountRow}>
        <div className={styles.amountWrapper}>
          <label className={styles.label}>
            Amount <span className={styles.required}>*</span>
          </label>
          <AmountInput
            value={totalAmount}
            onChange={onAmountChange}
            currencySymbol={currencySymbol}
            currencyCode={currency}
            placeholder="0.00"
            autoFocus={autoFocus}
            size="lg"
            className={styles.amountInput}
          />
        </div>
        <div className={styles.currencyWrapper}>
          <label className={styles.label}>
            Currency <span className={styles.required}>*</span>
          </label>
          <CurrencySelector
            value={currency}
            onChange={onCurrencyChange}
            size="md"
            showFullName={false}
            className={styles.currencySelector}
          />
        </div>
      </div>
      {error && <div className={styles.fieldError}>{error}</div>}
    </div>
  );
};

export default AmountSection;