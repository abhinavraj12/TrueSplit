import React, { useRef, useEffect, forwardRef, useId, useCallback, memo } from 'react';
import clsx from 'clsx';
import { FaCheck } from 'react-icons/fa';
import styles from './Checkbox.module.css';

export type CheckboxSize = 'sm' | 'md' | 'lg';

export interface CheckboxProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type' | 'checked' | 'onChange' | 'size'> {
  /**
   * Whether the checkbox is checked.
   * @default false
   */
  checked?: boolean;
  /**
   * Default checked value (for uncontrolled usage).
   */
  defaultChecked?: boolean;
  /**
   * Callback fired when the checked state changes.
   */
  onChange?: (checked: boolean) => void;
  /**
   * If true, the checkbox will be in an indeterminate state.
   * @default false
   */
  indeterminate?: boolean;
  /**
   * Label text or element displayed next to the checkbox.
   */
  label?: React.ReactNode;
  /**
   * If true (or a string), applies error styling.
   * The string can be used as an error message (parent displays it).
   * @default false
   */
  error?: boolean | string;
  /**
   * Helper text displayed below the checkbox (replaces error text when no error).
   */
  helperText?: React.ReactNode;
  /**
   * If true, marks the field as required (adds asterisk and aria-required).
   * @default false
   */
  required?: boolean;
  /**
   * ID of an element that describes the error (used for aria-describedby).
   * If not provided and error is a string, an ID is auto-generated.
   */
  errorMessageId?: string;
  /**
   * Size variant
   * @default 'md'
   */
  size?: CheckboxSize;
  /**
   * Additional CSS class for the container.
   */
  className?: string;
}

const CheckboxComponent = forwardRef<HTMLInputElement, CheckboxProps>(
  (
    {
      checked,
      defaultChecked,
      onChange,
      indeterminate = false,
      label,
      error = false,
      helperText,
      required = false,
      errorMessageId,
      disabled = false,
      size = 'md',
      id,
      name,
      className,
      ...restProps
    },
    forwardedRef,
  ) => {
    const internalRef = useRef<HTMLInputElement>(null);
    const generatedId = useId();
    const checkboxId = id || generatedId;

    // Auto-generate error ID if needed
    const errorId = errorMessageId || (typeof error === 'string' ? `error-${checkboxId}` : undefined);
    const helperId = helperText ? `helper-${checkboxId}` : undefined;

    // Combine refs
    const setRefs = useCallback(
      (node: HTMLInputElement | null) => {
        internalRef.current = node;
        if (typeof forwardedRef === 'function') {
          forwardedRef(node);
        } else if (forwardedRef) {
          forwardedRef.current = node;
        }
      },
      [forwardedRef],
    );

    // Handle indeterminate prop
    useEffect(() => {
      if (internalRef.current) {
        internalRef.current.indeterminate = indeterminate;
      }
    }, [indeterminate]);

    const handleChange = useCallback(
      (e: React.ChangeEvent<HTMLInputElement>) => {
        if (disabled) return;
        onChange?.(e.target.checked);
      },
      [disabled, onChange],
    );

    const isError = Boolean(error);
    const errorMessage = typeof error === 'string' ? error : undefined;

    const ariaInvalid = isError ? true : undefined;
    const ariaDescribedBy = clsx(
      isError && errorId,
      helperText && helperId,
    ) || undefined;

    return (
      <div className={clsx(styles.checkboxWrapper, className)}>
        <label
          className={clsx(
            styles.checkboxContainer,
            styles[size],
            {
              [styles.disabled]: disabled,
              [styles.error]: isError,
              [styles.required]: required,
            },
          )}
          htmlFor={checkboxId}
        >
          <input
            type="checkbox"
            id={checkboxId}
            name={name}
            checked={checked}
            defaultChecked={defaultChecked}
            onChange={handleChange}
            disabled={disabled}
            className={styles.checkboxInput}
            ref={setRefs}
            aria-checked={indeterminate ? 'mixed' : checked}
            aria-disabled={disabled}
            aria-invalid={ariaInvalid}
            aria-describedby={ariaDescribedBy}
            aria-required={required}
            {...restProps}
          />
          <span
            className={clsx(styles.checkboxControl, {
              [styles.checked]: checked && !indeterminate,
              [styles.indeterminate]: indeterminate,
            })}
            aria-hidden="true"
          >
            {checked && !indeterminate && <FaCheck className={styles.checkIcon} />}
            {indeterminate && <span className={styles.indeterminateDash} />}
          </span>
          {label && <span className={styles.checkboxLabel}>{label}</span>}
          {required && <span className={styles.requiredStar} aria-hidden="true">*</span>}
        </label>

        {/* Error and helper text rendered inside component */}
        {isError && errorMessage && (
          <div id={errorId} className={styles.errorText} role="alert">
            {errorMessage}
          </div>
        )}
        {helperText && !isError && (
          <div id={helperId} className={styles.helperText}>
            {helperText}
          </div>
        )}
      </div>
    );
  },
);

CheckboxComponent.displayName = 'Checkbox';

export const Checkbox = memo(CheckboxComponent);
export default Checkbox;