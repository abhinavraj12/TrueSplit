import React from 'react';
import { SelectDropdown, SelectOption } from '@/shared/_components/molecules/SelectDropdown';
import styles from '../page.module.css';

export interface PaidBySectionProps {
  /** Selected user ID */
  value: string;
  /** Options for the dropdown */
  options: SelectOption[];
  /** Callback when selection changes */
  onChange: (value: string) => void;
  /** Validation error message (if any) */
  error?: string | null;
  /** Additional CSS class for the container */
  className?: string;
}

export const PaidBySection: React.FC<PaidBySectionProps> = ({
  value,
  options,
  onChange,
  error,
  className = '',
}) => {
  return (
    <div className={`${styles.fieldGroup} ${className}`}>
      <label className={styles.label}>
        Paid by <span className={styles.required}>*</span>
      </label>
      <SelectDropdown
        value={value}
        onChange={onChange}
        options={options}
        size="md"
        className={styles.paidBySelect}
      />
      {error && <div className={styles.fieldError}>{error}</div>}
    </div>
  );
};

export default PaidBySection;