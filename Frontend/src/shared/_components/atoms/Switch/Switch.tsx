import React, { forwardRef, useId, useCallback } from 'react';
import clsx from 'clsx';
import styles from './Switch.module.css';

export type SwitchSize = 'sm' | 'md' | 'lg';

export interface SwitchProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type' | 'checked' | 'onChange' | 'size'> {
  /**
   * Whether the switch is checked (on).
   * @default false
   */
  checked?: boolean;
  /**
   * Callback fired when the switch is toggled.
   */
  onChange?: (checked: boolean) => void;
  /**
   * Label displayed next to the switch.
   */
  label?: React.ReactNode;
  /**
   * Size variant.
   * @default 'md'
   */
  size?: SwitchSize;
  /**
   * If true, disables the switch.
   * @default false
   */
  disabled?: boolean;
  /**
   * If true (or a string), applies error styling.
   * @default false
   */
  error?: boolean | string;
  /**
   * Additional CSS class for the container.
   */
  className?: string;
}

/**
 * A reusable, accessible toggle switch following the TrueSplit design system.
 * Supports checked, disabled, error states, and keyboard navigation.
 */
export const Switch = forwardRef<HTMLInputElement, SwitchProps>(
  (
    {
      checked = false,
      onChange,
      label,
      size = 'md',
      disabled = false,
      error = false,
      id,
      name,
      className,
      ...restProps
    },
    forwardedRef,
  ) => {
    const generatedId = useId();
    const switchId = id || generatedId;
    const isError = Boolean(error);

    const handleChange = useCallback(
      (e: React.ChangeEvent<HTMLInputElement>) => {
        if (disabled) return;
        onChange?.(e.target.checked);
      },
      [disabled, onChange],
    );

    return (
      <div
        className={clsx(
          styles.switchContainer,
          styles[size],
          {
            [styles.disabled]: disabled,
            [styles.error]: isError,
          },
          className,
        )}
      >
        <input
          type="checkbox"
          id={switchId}
          name={name}
          checked={checked}
          onChange={handleChange}
          disabled={disabled}
          className={styles.switchInput}
          ref={forwardedRef}
          role="switch"
          aria-checked={checked}
          aria-disabled={disabled}
          aria-invalid={isError}
          {...restProps}
        />
        <label htmlFor={switchId} className={styles.switchTrack}>
          <span className={styles.switchThumb} />
        </label>
        {label && (
          <label htmlFor={switchId} className={styles.switchLabel}>
            {label}
          </label>
        )}
      </div>
    );
  },
);

Switch.displayName = 'Switch';