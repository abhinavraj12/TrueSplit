import React, { isValidElement, cloneElement, useId, memo } from 'react';
import clsx from 'clsx';
import { FaExclamationCircle } from 'react-icons/fa';
import { Icon } from '@/shared/_components/atoms/Icon';
import styles from './FormField.module.css';

export interface FormFieldProps {
  /** Label text for the field */
  label?: React.ReactNode;
  /** Input element (Input, Textarea, Select, etc.) */
  children: React.ReactElement<{ id?: string }>;
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
 * Provides full accessibility support with ARIA attributes.
 */
export const FormField: React.FC<FormFieldProps> = memo(
  ({
    label,
    children,
    error = false,
    helperText,
    required = false,
    className,
    id: externalId,
    labelHidden = false,
  }) => {
    // Generate a unique fallback ID if none provided
    const generatedId = useId();
    const fieldId = externalId || children.props.id || generatedId;

    const isError = Boolean(error);
    const errorMessage = typeof error === 'string' ? error : undefined;

    // IDs for error and helper messages
    const errorId = `error-${fieldId}`;
    const helperId = `helper-${fieldId}`;

    // Build aria-describedby: include errorId if error, helperId if helperText
    const describedBy = clsx(
      isError && errorId,
      helperText && helperId,
    ) || undefined;

    // Validate children
    if (process.env.NODE_ENV === 'development' && !isValidElement(children)) {
      console.warn(
        'FormField: `children` must be a valid React element. Received:',
        children
      );
      return null;
    }

    // Clone the child to add accessibility attributes
    const inputElement = isValidElement(children)
      ? cloneElement(children, {
          id: fieldId,
          'aria-invalid': isError ? true : undefined,
          'aria-describedby': describedBy,
          'aria-required': required ? true : undefined,
        } as {
          id?: string;
          'aria-invalid'?: boolean;
          'aria-describedby'?: string;
          'aria-required'?: boolean;
        })
      : children;

    return (
      <div className={clsx(styles.field, className)}>
        {label && (
          <label
            htmlFor={fieldId}
            className={clsx(styles.label, labelHidden && styles.labelHidden)}
          >
            {label}
            {required && <span className={styles.required}>*</span>}
          </label>
        )}

        <div className={styles.inputWrapper}>{inputElement}</div>

        {isError && errorMessage && (
          <div className={styles.errorText} id={errorId} role="alert">
            <Icon size="sm" color="error" decorative>
              <FaExclamationCircle />
            </Icon>
            <span>{errorMessage}</span>
          </div>
        )}

        {helperText && !isError && (
          <div className={styles.helperText} id={helperId}>
            {helperText}
          </div>
        )}
      </div>
    );
  }
);

FormField.displayName = 'FormField';

export default FormField;