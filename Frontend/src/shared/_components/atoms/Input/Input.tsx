import React, { forwardRef, memo } from 'react';
import clsx from 'clsx';
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
}

/**
 * Build the class name string for the input
 */
const buildClassName = (
  inputSize: InputSize,
  error: boolean,
  success: boolean,
  fullWidth: boolean,
  className?: string,
): string => {
  // If both error and success are true, error takes precedence
  const isError = error;
  const isSuccess = success && !error;

  return clsx(
    styles.input,
    styles[`size-${inputSize}`],
    isError && styles.error,
    isSuccess && styles.success,
    fullWidth && styles.fullWidth,
    className,
  );
};

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
      ...restProps
    },
    ref,
  ) => {
    const classNames = buildClassName(
      inputSize,
      error,
      success,
      fullWidth,
      className,
    );

    const isError = error;
    const isSuccess = success && !error;

    // Compute aria attributes
    const ariaInvalid = isError ? true : undefined;
    const ariaDescribedBy = isError && errorMessageId ? errorMessageId : undefined;

    // Compute character count display
    const currentValue = (value ?? defaultValue ?? '') as string;
    const charCount = currentValue.length;
    const showCharCount = showCount && maxLength && maxLength > 0;

    // Handle clear
    const handleClear = () => {
      if (onClear) {
        onClear();
      } else {
        // If no onClear provided, we need to simulate clearing via onChange
        // We'll trigger a change event with empty string
        if (onChange) {
          const event = {
            target: { value: '' },
          } as React.ChangeEvent<HTMLInputElement>;
          onChange(event);
        }
      }
    };

    const inputElement = (
      <input
        ref={ref}
        className={classNames}
        disabled={disabled}
        required={required}
        aria-invalid={ariaInvalid}
        aria-describedby={ariaDescribedBy}
        aria-required={required}
        aria-label={ariaLabel}
        inputMode={inputMode}
        maxLength={maxLength}
        value={value}
        defaultValue={defaultValue}
        onChange={onChange}
        {...restProps}
      />
    );

    // If there are adornments or clear button, wrap in a container
    if (leftAdornment || rightAdornment || clearable || showCharCount) {
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
            {leftAdornment && (
              <span className={styles.leftAdornment}>{leftAdornment}</span>
            )}
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
            {rightAdornment && (
              <span className={styles.rightAdornment}>{rightAdornment}</span>
            )}
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