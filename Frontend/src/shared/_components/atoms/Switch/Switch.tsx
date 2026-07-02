import React, { forwardRef, useId, useCallback, memo } from 'react';
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
   * Default checked state for uncontrolled usage.
   */
  defaultChecked?: boolean;
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
   * Helper text displayed below the switch.
   */
  helperText?: React.ReactNode;
  /**
   * If true, marks the field as required.
   * @default false
   */
  required?: boolean;
  /**
   * ID of an element that describes the error (used for aria-describedby).
   * If not provided and error is a string, an ID is auto-generated.
   */
  errorMessageId?: string;
  /**
   * Accessible label for the switch (overrides label for a11y).
   */
  ariaLabel?: string;
  /**
   * Additional CSS class for the container.
   */
  className?: string;
}

const SwitchComponent = forwardRef<HTMLInputElement, SwitchProps>(
  (
    {
      checked,
      defaultChecked,
      onChange,
      label,
      size = 'md',
      disabled = false,
      error = false,
      helperText,
      required = false,
      errorMessageId,
      ariaLabel,
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
    const errorMessage = typeof error === 'string' ? error : undefined;

    // Auto-generate error ID if needed
    const errorId = errorMessageId || (errorMessage ? `error-${switchId}` : undefined);
    const helperId = helperText ? `helper-${switchId}` : undefined;

    const handleChange = useCallback(
      (e: React.ChangeEvent<HTMLInputElement>) => {
        if (disabled) return;
        onChange?.(e.target.checked);
      },
      [disabled, onChange],
    );

    const ariaDescribedBy = clsx(
      isError && errorId,
      helperText && helperId,
    ) || undefined;

    return (
      <div className={clsx(styles.switchWrapper, className)}>
        <label
          className={clsx(
            styles.switchContainer,
            styles[`size-${size}`],
            {
              [styles.disabled]: disabled,
              [styles.error]: isError,
              [styles.required]: required,
            },
          )}
          htmlFor={switchId}
        >
          <input
            type="checkbox"
            id={switchId}
            name={name}
            checked={checked}
            defaultChecked={defaultChecked}
            onChange={handleChange}
            disabled={disabled}
            className={styles.switchInput}
            ref={forwardedRef}
            role="switch"
            aria-checked={checked}
            aria-disabled={disabled}
            aria-invalid={isError}
            aria-describedby={ariaDescribedBy}
            aria-required={required}
            aria-label={ariaLabel}
            {...restProps}
          />
          <span className={styles.switchTrack}>
            <span className={styles.switchThumb} />
          </span>
          <span className={styles.switchLabel}>{label}</span>
          {required && <span className={styles.requiredStar} aria-hidden="true">*</span>}
        </label>

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

SwitchComponent.displayName = 'Switch';

export const Switch = memo(SwitchComponent);
export default Switch;