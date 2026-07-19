import React from 'react';
import { Input } from '@/shared/_components/atoms/Input';
import styles from '../page.module.css';

export interface TitleSectionProps {
  /** Current title value */
  title: string;
  /** Callback when title changes */
  onChange: (value: string) => void;
  /** Validation error message (if any) */
  error?: string | null;
  /** Maximum length (default: 100) */
  maxLength?: number;
  /** Placeholder text */
  placeholder?: string;
  /** Whether to show character count */
  showCount?: boolean;
  /** Additional CSS class for the container */
  className?: string;
}

export const TitleSection: React.FC<TitleSectionProps> = ({
  title,
  onChange,
  error,
  maxLength = 100,
  placeholder = 'e.g., Dinner at Saravana Bhavan',
  showCount = true,
  className = '',
}) => {
  return (
    <div className={`${styles.fieldGroup} ${className}`}>
      <label className={styles.label}>
        Title <span className={styles.required}>*</span>
      </label>
      <Input
        value={title}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        maxLength={maxLength}
        showCount={showCount}
      />
      {error && <div className={styles.fieldError}>{error}</div>}
    </div>
  );
};

export default TitleSection;