import React, { forwardRef, useId, useCallback } from 'react';
import clsx from 'clsx';
import styles from './Radio.module.css';

export type RadioSize = 'sm' | 'md' | 'lg';

export interface RadioProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type' | 'checked' | 'onChange' | 'size' | 'value'> {
  /**
   * Whether the radio is checked (selected).
   * @default false
   */
  checked?: boolean;
  /**
   * Callback fired when the radio is selected.
   * Receives the value of the radio.
   */
  onChange?: (value: string) => void;
  /**
   * The value of the radio input.
   */
  value: string;
  /**
   * Name attribute for grouping radio buttons.
   */
  name?: string;
  /**
   * Label displayed next to the radio.
   */
  label?: React.ReactNode;
  /**
   * Size variant.
   * @default 'md'
   */
  size?: RadioSize;
  /**
   * If true, disables the radio.
   * @default false
   */
  disabled?: boolean;
  /**
   * If true (or a string), applies error styling.
   * @default false
   */
  error?: boolean | string;
  /**
   * ID of an element that describes the error (used for aria-describedby).
   * Only relevant when error is a truthy string.
   */
  errorMessageId?: string;
  /**
   * Additional CSS class for the container.
   */
  className?: string;
}

/**
 * A reusable, accessible radio button following the TrueSplit design system.
 * Supports checked, disabled, error states, and keyboard navigation.
 */
export const Radio = forwardRef<HTMLInputElement, RadioProps>(
  (
    {
      checked = false,
      onChange,
      value,
      name,
      label,
      size = 'md',
      disabled = false,
      error = false,
      errorMessageId,
      id,
      className,
      ...restProps
    },
    forwardedRef,
  ) => {
    const generatedId = useId();
    const radioId = id || generatedId;
    const isError = Boolean(error);
    const errorMessage = typeof error === 'string' ? error : undefined;

    const handleChange = useCallback(
      (e: React.ChangeEvent<HTMLInputElement>) => {
        if (disabled) return;
        onChange?.(e.target.value);
      },
      [disabled, onChange],
    );

    const ariaDescribedBy = errorMessage && errorMessageId ? errorMessageId : undefined;

    return (
      <label
        className={clsx(
          styles.radioContainer,
          styles[size],
          {
            [styles.disabled]: disabled,
            [styles.error]: isError,
          },
          className,
        )}
        htmlFor={radioId}
      >
        <input
          type="radio"
          id={radioId}
          name={name}
          value={value}
          checked={checked}
          onChange={handleChange}
          disabled={disabled}
          className={styles.radioInput}
          ref={forwardedRef}
          aria-checked={checked}
          aria-disabled={disabled}
          aria-describedby={ariaDescribedBy}
          {...restProps}
        />
        <span
          className={clsx(styles.radioControl, {
            [styles.checked]: checked,
          })}
          aria-hidden="true"
        >
          {checked && <span className={styles.radioDot} />}
        </span>
        {label && <span className={styles.radioLabel}>{label}</span>}
      </label>
    );
  },
);

Radio.displayName = 'Radio';