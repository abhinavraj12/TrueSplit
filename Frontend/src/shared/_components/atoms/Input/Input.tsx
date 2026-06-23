import React from 'react';
import styles from './Input.module.css';

export type InputSize = 'sm' | 'md' | 'lg';

export interface InputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> {
  /**
   * Size variant of the input
   * @default 'md'
   */
  inputSize?: InputSize;
  /**
   * If true, shows error state styling
   * @default false
   */
  error?: boolean;
  /**
   * If true, shows success state styling
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
  const classes = [
    styles.input,
    styles[`size-${inputSize}`],
    error && styles.error,
    success && styles.success,
    fullWidth && styles.fullWidth,
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return classes;
};

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
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

    const inputElement = (
      <input
        ref={ref}
        className={classNames}
        disabled={disabled}
        data-error={error}
        data-success={success}
        data-size={inputSize}
        {...restProps}
      />
    );

    // If there are adornments, wrap in a container
    if (leftAdornment || rightAdornment) {
      return (
        <div
          className={styles.wrapper}
          data-disabled={disabled}
          data-error={error}
          data-success={success}
          data-size={inputSize}
          data-full-width={fullWidth}
        >
          {leftAdornment && (
            <span className={styles.leftAdornment}>{leftAdornment}</span>
          )}
          {inputElement}
          {rightAdornment && (
            <span className={styles.rightAdornment}>{rightAdornment}</span>
          )}
        </div>
      );
    }

    return inputElement;
  },
);

Input.displayName = 'Input';