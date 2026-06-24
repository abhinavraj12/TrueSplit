import React, { ReactElement, cloneElement, isValidElement } from 'react';
import clsx from 'clsx';
import styles from './FormField.module.css';

export interface FormFieldProps {
  /** Label text for the field */
  label?: React.ReactNode;
  /** Input element (Input, Textarea, Select, etc.) */
  children: ReactElement<{ id?: string }>;
  /** Error message or boolean indicating error state */
  error?: boolean | string;
  /** Helper text displayed below the field */
  helperText?: React.ReactNode;
  /** If true, shows a required indicator (*) */
  required?: boolean;
  /** Additional CSS class for the container */
  className?: string;
  /** ID for the input (used for label `htmlFor` and error `aria-describedby`) */
  id?: string;
  /** If true, the label is visually hidden but accessible */
  labelHidden?: boolean;
}

/**
 * FormField component that wraps an input with label, error, and helper text.
 * Clean, minimal design without decorative borders.
 */
export const FormField: React.FC<FormFieldProps> = ({
  label,
  children,
  error = false,
  helperText,
  required = false,
  className,
  id,
  labelHidden = false,
}) => {
  const isError = Boolean(error);
  const errorMessage = typeof error === 'string' ? error : undefined;

  // Generate a unique ID for the error message if not provided
  const errorId = `error-${id || children.props.id || 'field'}`;
  const helperId = `helper-${id || children.props.id || 'field'}`;

  // Clone the child to add accessibility attributes
  const inputElement = isValidElement(children)
    ? cloneElement(children, {
        id: id || children.props.id,
        'aria-invalid': isError ? true : undefined,
        'aria-describedby': clsx(
          isError && errorId,
          helperText && helperId,
        ),
      } as { id?: string; 'aria-invalid'?: boolean; 'aria-describedby'?: string; })
    : children;

  return (
    <div className={clsx(styles.field, className)}>
      {label && (
        <label
          htmlFor={id || children.props.id}
          className={clsx(styles.label, labelHidden && styles.labelHidden)}
        >
          {label}
          {required && <span className={styles.required}>*</span>}
        </label>
      )}

      <div className={styles.inputWrapper}>
        {inputElement}
      </div>

      {isError && errorMessage && (
        <div
          className={styles.errorText}
          id={errorId}
          role="alert"
        >
          {errorMessage}
        </div>
      )}

      {helperText && !isError && (
        <div
          className={styles.helperText}
          id={helperId}
        >
          {helperText}
        </div>
      )}
    </div>
  );
};

FormField.displayName = 'FormField';

export default FormField;