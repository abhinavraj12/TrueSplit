import React from 'react';
import { Button } from '@/shared/_components/atoms/Button';
import styles from '../page.module.css';

export interface FormActionsProps {
  submitError: string | null;
  isSubmitting: boolean;
  isUploading: boolean;
  isFormValid: boolean;
  onSubmit: () => void;
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
    <div className={`${styles.formActions} ${className}`}>
      {submitError && <div className={styles.formError}>{submitError}</div>}
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
  );
};

export default FormActions;