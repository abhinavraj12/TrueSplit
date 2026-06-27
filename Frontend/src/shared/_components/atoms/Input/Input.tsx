import React, { forwardRef, memo, useState } from 'react';
import clsx from 'clsx';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { Icon } from '@/shared/_components/atoms/Icon';
import { Button } from '@/shared/_components/atoms/Button';
import styles from './Input.module.css';

export type InputSize = 'sm' | 'md' | 'lg';

export interface InputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> {
  /**
   * Size variant
   * @default 'md'
   */
  inputSize?: InputSize;
  /**
   * If true, shows error state styling
   * @default false
   */
  error?: boolean;
  /**
   * If true, shows success state styling (overridden by error if both true)
   * @default false
   */
  success?: boolean;
  /**
   * If true, input takes full width of its container
   * @default false
   */
  fullWidth?: boolean;
  /**
   * Left adornment (icon, text, or component)
   */
  leftAdornment?: React.ReactNode;
  /**
   * Right adornment (icon, text, or component)
   */
  rightAdornment?: React.ReactNode;
  /**
   * If true, marks the input as required
   * @default false
   */
  required?: boolean;
  /**
   * ID of an element that describes the error (used for aria-describedby)
   */
  errorMessageId?: string;
  /**
   * Accessible label (if not provided via label or aria-label)
   */
  ariaLabel?: string;
  /**
   * Input mode for mobile keyboards (e.g., "numeric", "decimal", "email")
   */
  inputMode?: React.HTMLAttributes<HTMLInputElement>['inputMode'];
  /**
   * If true, shows character count when maxLength is set
   * @default false
   */
  showCount?: boolean;
  /**
   * If true, shows a clear button when the input has a value
   * @default false
   */
  clearable?: boolean;
  /**
   * Callback when clear button is clicked
   */
  onClear?: () => void;
  /**
   * If true, shows a password visibility toggle (only for type="password")
   * @default true
   */
  showPasswordToggle?: boolean;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      inputSize = 'md',
      error = false,
      success = false,
      fullWidth = false,
      leftAdornment,
      rightAdornment,
      className,
      disabled,
      required = false,
      errorMessageId,
      ariaLabel,
      inputMode,
      showCount = false,
      clearable = false,
      onClear,
      maxLength,
      value,
      defaultValue,
      onChange,
      type = 'text',
      showPasswordToggle = true,
      ...restProps
    },
    ref,
  ) => {
    const [passwordVisible, setPasswordVisible] = useState(false);
    const isPassword = type === 'password';
    const showToggle = isPassword && showPasswordToggle && !disabled;

    // Determine actual input type
    const inputType = isPassword && passwordVisible ? 'text' : type;

    const isError = error;
    const isSuccess = success && !error;

    // Compute current value length for clear button and char count
    const currentValue = (value ?? defaultValue ?? '') as string;
    const charCount = currentValue.length;
    const showCharCount = showCount && maxLength && maxLength > 0;

    const handleClear = () => {
      if (onClear) {
        onClear();
      } else if (onChange) {
        const event = {
          target: { value: '' },
        } as React.ChangeEvent<HTMLInputElement>;
        onChange(event);
      }
    };

    const handleTogglePassword = () => {
      setPasswordVisible((prev) => !prev);
    };

    const classNames = clsx(
      styles.input,
      styles[`size-${inputSize}`],
      isError && styles.error,
      isSuccess && styles.success,
      fullWidth && styles.fullWidth,
      className,
    );

    const inputElement = (
      <input
        ref={ref}
        className={classNames}
        disabled={disabled}
        required={required}
        aria-invalid={isError ? true : undefined}
        aria-describedby={isError && errorMessageId ? errorMessageId : undefined}
        aria-required={required ? true : undefined}
        aria-label={ariaLabel}
        inputMode={inputMode}
        maxLength={maxLength}
        value={value}
        defaultValue={defaultValue}
        onChange={onChange}
        type={inputType}
        {...restProps}
      />
    );

    // Build the content inside the wrapper
    const wrapperContent = (
      <>
        {leftAdornment && <span className={styles.leftAdornment}>{leftAdornment}</span>}
        {inputElement}
        {clearable && currentValue.length > 0 && !disabled && (
          <button
            type="button"
            className={styles.clearButton}
            onClick={handleClear}
            aria-label="Clear input"
          >
            ×
          </button>
        )}
        {showToggle && (
          <Button
            iconOnly
            variant="ghost"
            size={inputSize === 'sm' ? 'sm' : 'md'}
            onClick={handleTogglePassword}
            className={styles.passwordToggle}
            aria-label={passwordVisible ? 'Hide password' : 'Show password'}
            tabIndex={0}
          >
            <Icon size="sm" color="muted" decorative>
              {passwordVisible ? <FaEyeSlash /> : <FaEye />}
            </Icon>
          </Button>
        )}
        {rightAdornment && <span className={styles.rightAdornment}>{rightAdornment}</span>}
      </>
    );

    // Wrap in container if adornments, clear button, or password toggle are present
    if (leftAdornment || rightAdornment || clearable || showToggle || showCharCount) {
      return (
        <div className={styles.wrapperContainer}>
          <div
            className={styles.wrapper}
            data-disabled={disabled}
            data-error={isError}
            data-success={isSuccess}
            data-size={inputSize}
            data-full-width={fullWidth}
          >
            {wrapperContent}
          </div>
          {showCharCount && (
            <div className={styles.charCount}>
              {charCount} / {maxLength}
            </div>
          )}
        </div>
      );
    }

    return inputElement;
  },
);

Input.displayName = 'Input';

export default memo(Input);