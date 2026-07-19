import React from 'react';
import { DatePicker } from '@/shared/_components/molecules/DatePicker';
import styles from '../page.module.css';

export interface DateTimeSectionProps {
  /** Current selected date */
  value: Date | null;
  /** Callback when date changes */
  onChange: (date: Date | null) => void;
  /** Validation error message (if any) */
  error?: string | null;
  /** Display format for the date */
  format?: string;
  /** Whether the picker is clearable (default: false) */
  clearable?: boolean;
  /** Additional CSS class for the container */
  className?: string;
}

export const DateTimeSection: React.FC<DateTimeSectionProps> = ({
  value,
  onChange,
  error,
  format = 'MMM d, yyyy, h:mm a',
  clearable = false,
  className = '',
}) => {
  return (
    <div className={`${styles.fieldGroup} ${className}`}>
      <label className={styles.label}>
        Date & Time <span className={styles.required}>*</span>
      </label>
      <DatePicker
        value={value}
        onChange={onChange}
        format={format}
        clearable={clearable}
      />
      {error && <div className={styles.fieldError}>{error}</div>}
    </div>
  );
};

export default DateTimeSection;