import React, { useRef, useEffect, forwardRef, useId, useCallback } from 'react';
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
   * ID of an element that describes the error (used for aria-describedby).
   * Only relevant when error is a truthy string.
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

/**
 * A reusable, accessible checkbox component following the TrueSplit design system.
 * Supports checked, indeterminate, disabled, error states, and keyboard navigation.
 */
const CheckboxComponent = forwardRef<HTMLInputElement, CheckboxProps>(
  (
    {
      checked = false,
      onChange,
      indeterminate = false,
      label,
      error = false,
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
    const ariaDescribedBy = errorMessage && errorMessageId ? errorMessageId : undefined;

    return (
      <label
        className={clsx(
          styles.checkboxContainer,
          styles[size],
          {
            [styles.disabled]: disabled,
            [styles.error]: isError,
          },
          className,
        )}
        htmlFor={checkboxId}
      >
        <input
          type="checkbox"
          id={checkboxId}
          name={name}
          checked={checked}
          onChange={handleChange}
          disabled={disabled}
          className={styles.checkboxInput}
          ref={setRefs}
          aria-checked={indeterminate ? 'mixed' : checked}
          aria-disabled={disabled}
          aria-invalid={ariaInvalid}
          aria-describedby={ariaDescribedBy}
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
      </label>
    );
  },
);

CheckboxComponent.displayName = 'Checkbox';

// Export the component as both named and default
export const Checkbox = CheckboxComponent;
export default CheckboxComponent;