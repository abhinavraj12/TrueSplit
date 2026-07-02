import React, { forwardRef, useRef, useEffect, useCallback, memo } from 'react';
import clsx from 'clsx';
import styles from './Textarea.module.css';

export type TextareaSize = 'sm' | 'md' | 'lg';

export interface TextareaProps
  extends Omit<React.TextareaHTMLAttributes<HTMLTextAreaElement>, 'size'> {
  /**
   * Size variant.
   * @default 'md'
   */
  textareaSize?: TextareaSize;
  /**
   * If true (or a string), applies error styling.
   * The string is displayed as an error message.
   * @default false
   */
  error?: boolean | string;
  /**
   * If true, applies success styling.
   * @default false
   */
  success?: boolean;
  /**
   * If true, takes full width.
   * @default false
   */
  fullWidth?: boolean;
  /**
   * Number of visible rows.
   * @default 3
   */
  rows?: number;
  /**
   * If true, auto‑adjusts height based on content.
   * @default false
   */
  autoResize?: boolean;
  /**
   * Maximum height when autoResize is true.
   */
  maxHeight?: number | string;
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
   * Helper text displayed below the textarea.
   */
  helperText?: React.ReactNode;
  /**
   * Accessible label for the textarea (overrides aria-label).
   */
  ariaLabel?: string;
  /**
   * If true, shows character count when maxLength is set.
   * @default false
   */
  showCount?: boolean;
  /**
   * Additional CSS classes.
   */
  className?: string;
  /**
   * HTML id attribute (required for label association).
   */
  id?: string;
}

const buildClassName = (
  textareaSize: TextareaSize,
  error: boolean,
  success: boolean,
  fullWidth: boolean,
  className?: string,
): string => {
  return clsx(
    styles.textarea,
    styles[`size-${textareaSize}`],
    error && styles.error,
    success && styles.success,
    fullWidth && styles.fullWidth,
    className,
  );
};

const TextareaComponent = forwardRef<HTMLTextAreaElement, TextareaProps>(
  (
    {
      textareaSize = 'md',
      error = false,
      success = false,
      fullWidth = false,
      rows = 3,
      autoResize = false,
      maxHeight,
      required = false,
      errorMessageId,
      helperText,
      ariaLabel,
      showCount = false,
      className,
      id,
      disabled,
      onChange,
      value,
      defaultValue,
      maxLength,
      style,
      ...restProps
    },
    forwardedRef,
  ) => {
    // Generate a stable ID for this instance (unconditional hook)
    const idRef = useRef<string>(Math.random().toString(36).slice(2, 9));
    const generatedId = id || `textarea-${idRef.current}`;

    const internalRef = useRef<HTMLTextAreaElement>(null);
    const isError = Boolean(error);
    const errorMessage = typeof error === 'string' ? error : undefined;

    // Auto-generate error ID if needed
    const errorId = errorMessageId || (errorMessage ? `error-${generatedId}` : undefined);
    const helperId = helperText ? `helper-${generatedId}` : undefined;

    // Combine refs
    const setRefs = useCallback(
      (node: HTMLTextAreaElement | null) => {
        internalRef.current = node;
        if (typeof forwardedRef === 'function') {
          forwardedRef(node);
        } else if (forwardedRef) {
          forwardedRef.current = node;
        }
      },
      [forwardedRef],
    );

    // Resize handler
    const handleResize = useCallback(() => {
      if (!internalRef.current || !autoResize) return;
      const textarea = internalRef.current;
      textarea.style.height = 'auto';
      const newHeight = Math.min(
        textarea.scrollHeight,
        typeof maxHeight === 'number' ? maxHeight : Infinity,
      );
      textarea.style.height = `${newHeight}px`;
    }, [autoResize, maxHeight]);

    // Handle change with auto-resize
    const handleChange = useCallback(
      (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        onChange?.(e);
        handleResize();
      },
      [onChange, handleResize],
    );

    // Resize on mount, when value changes (controlled), or when defaultValue changes (uncontrolled)
    useEffect(() => {
      handleResize();
    }, [handleResize, value, defaultValue]);

    // Also resize on window resize if autoResize (e.g., mobile keyboard changes viewport)
    useEffect(() => {
      if (!autoResize) return;
      window.addEventListener('resize', handleResize);
      return () => window.removeEventListener('resize', handleResize);
    }, [autoResize, handleResize]);

    const classNames = buildClassName(
      textareaSize,
      isError,
      success,
      fullWidth,
      className,
    );

    const textareaStyle: React.CSSProperties = {
      ...style,
      ...(autoResize && { overflow: 'hidden' }),
      ...(maxHeight && autoResize && {
        maxHeight: typeof maxHeight === 'number' ? `${maxHeight}px` : maxHeight,
      }),
      ...(autoResize && { transition: 'height 0.15s ease' }),
    };

    const ariaDescribedBy = clsx(
      isError && errorId,
      helperText && helperId,
    ) || undefined;

    const showCharCount = showCount && maxLength && maxLength > 0;
    const currentValue = (value ?? defaultValue ?? '') as string;
    const charCount = currentValue.length;

    return (
      <div className={styles.textareaWrapper}>
        <textarea
          ref={setRefs}
          id={generatedId}
          rows={rows}
          disabled={disabled}
          required={required}
          aria-invalid={isError}
          aria-describedby={ariaDescribedBy}
          aria-required={required}
          aria-label={ariaLabel}
          className={classNames}
          style={textareaStyle}
          onChange={handleChange}
          value={value}
          defaultValue={defaultValue}
          maxLength={maxLength}
          {...restProps}
        />
        {showCharCount && (
          <div className={styles.charCount}>
            {charCount} / {maxLength}
          </div>
        )}
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

TextareaComponent.displayName = 'Textarea';

export const Textarea = memo(TextareaComponent);
export default Textarea;