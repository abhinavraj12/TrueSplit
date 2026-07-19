import React from 'react';
import { Textarea } from '@/shared/_components/atoms/Textarea';
import styles from '../page.module.css';

export interface DescriptionSectionProps {
  /** Current description value */
  description: string;
  /** Callback when description changes */
  onChange: (value: string) => void;
  /** Whether the description section is expanded */
  isExpanded: boolean;
  /** Callback to toggle expansion */
  onToggle: () => void;
  /** Maximum length (default: 500) */
  maxLength?: number;
  /** Placeholder text */
  placeholder?: string;
  /** Number of rows (default: 3) */
  rows?: number;
  /** Whether to show character count (default: true) */
  showCount?: boolean;
  /** Additional CSS class for the container */
  className?: string;
}

export const DescriptionSection: React.FC<DescriptionSectionProps> = ({
  description,
  onChange,
  isExpanded,
  onToggle,
  maxLength = 500,
  placeholder = 'Add any details...',
  rows = 3,
  showCount = true,
  className = '',
}) => {
  return (
    <div className={`${styles.fieldGroup} ${className}`}>
      <button className={styles.expander} onClick={onToggle}>
        <span>{isExpanded ? '−' : '+'}</span>
        <span>Add description (optional)</span>
      </button>
      {isExpanded && (
        <div className={styles.expanderContent}>
          <Textarea
            value={description}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            maxLength={maxLength}
            showCount={showCount}
            rows={rows}
          />
        </div>
      )}
    </div>
  );
};

export default DescriptionSection;