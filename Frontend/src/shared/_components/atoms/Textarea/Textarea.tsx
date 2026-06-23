import React, { forwardRef, useRef, useEffect, useCallback } from 'react';
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
   * Additional CSS classes.
   */
  className?: string;
}

/**
 * Build the class name string for the textarea.
 */
const buildClassName = (
  textareaSize: TextareaSize,
  error: boolean,
  success: boolean,
  fullWidth: boolean,
  className?: string,
): string => {
  const classes = [
    styles.textarea,
    styles[`size-${textareaSize}`],
    error && styles.error,
    success && styles.success,
    fullWidth && styles.fullWidth,
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return classes;
};

/**
 * A reusable, accessible textarea component.
 * Supports sizes, error/success states, auto-resize, and theme tokens.
 */
export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  (
    {
      textareaSize = 'md',
      error = false,
      success = false,
      fullWidth = false,
      rows = 3,
      autoResize = false,
      maxHeight,
      className,
      disabled,
      onChange,
      style,
      ...restProps
    },
    forwardedRef,
  ) => {
    const internalRef = useRef<HTMLTextAreaElement>(null);
    const isError = Boolean(error);

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

    // Auto-resize handler
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

    // Initial resize on mount and when value changes programmatically
    useEffect(() => {
      handleResize();
    }, [handleResize, restProps.value]);

    const classNames = buildClassName(
      textareaSize,
      isError,
      success,
      fullWidth,
      className,
    );

    const textareaStyle = {
      ...style,
      ...(autoResize && { overflow: 'hidden' }),
      ...(maxHeight && autoResize && { maxHeight: typeof maxHeight === 'number' ? `${maxHeight}px` : maxHeight }),
    };

    return (
      <textarea
        ref={setRefs}
        rows={rows}
        disabled={disabled}
        className={classNames}
        onChange={handleChange}
        style={textareaStyle}
        aria-invalid={isError}
        aria-disabled={disabled}
        data-error={isError}
        data-success={success}
        data-size={textareaSize}
        {...restProps}
      />
    );
  },
);

Textarea.displayName = 'Textarea';