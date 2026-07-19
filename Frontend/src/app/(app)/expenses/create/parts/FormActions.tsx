import React from 'react';
import { Button } from '@/shared/_components/atoms/Button';
import styles from '../page.module.css';

export interface FormActionsProps {
  /** Error message from submission (if any) */
  submitError: string | null;
  /** Whether the form is currently submitting */
  isSubmitting: boolean;
  /** Whether files are being uploaded */
  isUploading: boolean;
  /** Whether the form is valid and can be submitted */
  isFormValid: boolean;
  /** Callback when the form is submitted */
  onSubmit: () => void;
  /** Additional CSS class */
  className?: string;
}

export const FormActions: React.FC<FormActionsProps> = ({
  submitError,
  isSubmitting,
  isUploading,
  isFormValid,
  onSubmit,
  className = '',
}) => {
  const isLoading = isSubmitting || isUploading;
  const isDisabled = !isFormValid || isLoading;

  return (
    <div className={`${styles.stickyFooter} ${className}`}>
      <div className={styles.footerInner}>
        {submitError && <div className={styles.footerError}>{submitError}</div>}
        <Button
          variant="primary"
          size="lg"
          fullWidth
          loading={isLoading}
          disabled={isDisabled}
          onClick={onSubmit}
          className={styles.createButton}
        >
          {isLoading ? 'Creating...' : 'Create Expense'}
        </Button>
      </div>
    </div>
  );
};

export default FormActions;