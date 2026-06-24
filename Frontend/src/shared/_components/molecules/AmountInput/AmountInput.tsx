import React, { forwardRef, useState, useCallback, useRef, useEffect, useId } from 'react';
import clsx from 'clsx';
import { Input } from '@/shared/_components/atoms/Input';
import { Typography } from '@/shared/_components/atoms/Typography';
import styles from './AmountInput.module.css';

export type AmountInputSize = 'sm' | 'md' | 'lg';

export interface AmountInputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size' | 'onChange' | 'value' | 'defaultValue'> {
  /** Label for the input */
  label?: React.ReactNode;
  /** Current value (controlled) */
  value?: number | string;
  /** Default value (uncontrolled) */
  defaultValue?: number | string;
  /** Callback when value changes */
  onChange?: (value: number | string) => void;
  /** Currency symbol (e.g., '$', '€', '₹') */
  currencySymbol?: string;
  /** Currency code (e.g., 'USD', 'EUR', 'INR') */
  currencyCode?: string;
  /** Number of decimal places (default: 2) */
  decimals?: number;
  /** If true, allows negative values */
  allowNegative?: boolean;
  /** If true, shows currency code as suffix */
  showCurrencyCode?: boolean;
  /** Size variant */
  size?: AmountInputSize;
  /** Placeholder text */
  placeholder?: string;
  /** Error state */
  error?: boolean | string;
  /** Success state */
  success?: boolean;
  /** Helper text */
  helperText?: React.ReactNode;
  /** Additional CSS class */
  className?: string;
  /** If true, full width */
  fullWidth?: boolean;
  /** If true, auto-focus */
  autoFocus?: boolean;
  /** Disabled state */
  disabled?: boolean;
  /** If true, label is visually hidden but accessible */
  labelHidden?: boolean;
}

/**
 * Format a number to a currency string with proper decimal places
 */
const formatCurrency = (
  value: number | string,
  decimals: number = 2
): string => {
  if (value === '' || value === undefined || value === null) return '';

  const num = typeof value === 'string' ? parseFloat(value) : value;

  if (isNaN(num)) return '';

  return num.toFixed(decimals);
};

/**
 * Parse a currency string back to a number
 */
const parseCurrency = (
  value: string,
  decimals: number = 2
): number => {
  if (!value) return 0;

  // Remove currency symbol and non-numeric characters (keep . and -)
  const cleaned = value.replace(/[^0-9.\-]/g, '');

  const num = parseFloat(cleaned);

  if (isNaN(num)) return 0;

  return Math.round(num * Math.pow(10, decimals)) / Math.pow(10, decimals);
};

/**
 * AmountInput component - Currency input with formatting.
 * Clean, modern design without decorative borders.
 */
export const AmountInput = forwardRef<HTMLInputElement, AmountInputProps>(
  (
    {
      label,
      value: controlledValue,
      defaultValue = '',
      onChange,
      currencySymbol = '₹',
      currencyCode = 'INR',
      decimals = 2,
      allowNegative = false,
      showCurrencyCode = false,
      size = 'md',
      placeholder = '0.00',
      error = false,
      success = false,
      helperText,
      className,
      fullWidth = false,
      autoFocus = false,
      disabled = false,
      labelHidden = false,
      onFocus,
      onBlur,
      ...restProps
    },
    forwardedRef,
  ) => {
    const [internalValue, setInternalValue] = useState<string>(
      defaultValue ? formatCurrency(defaultValue, decimals) : ''
    );
    const [isFocused, setIsFocused] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);
    const isControlled = controlledValue !== undefined;

    // Generate unique ID for label association
    const generatedId = useId();
    const inputId = `amount-input-${generatedId}`;

    // Combine refs
    const setRefs = useCallback(
      (node: HTMLInputElement | null) => {
        inputRef.current = node;
        if (typeof forwardedRef === 'function') {
          forwardedRef(node);
        } else if (forwardedRef) {
          forwardedRef.current = node;
        }
      },
      [forwardedRef],
    );

    // Get current display value
    const getDisplayValue = useCallback(() => {
      if (isControlled) {
        if (controlledValue === '' || controlledValue === undefined || controlledValue === null) {
          return '';
        }
        return formatCurrency(controlledValue, decimals);
      }
      return internalValue;
    }, [isControlled, controlledValue, internalValue, decimals]);

    const currentDisplayValue = getDisplayValue();

    // Handle change
    const handleChange = useCallback(
      (e: React.ChangeEvent<HTMLInputElement>) => {
        const rawValue = e.target.value;

        // Allow empty input
        if (rawValue === '') {
          if (!isControlled) {
            setInternalValue('');
          }
          onChange?.('');
          return;
        }

        // Allow only valid characters
        const isValid = /^[0-9.]*$/.test(rawValue) || (allowNegative && /^[0-9.\-]*$/.test(rawValue));

        if (!isValid) return;

        // Prevent multiple decimal points
        const dotCount = (rawValue.match(/\./g) || []).length;
        if (dotCount > 1) return;

        // Prevent more than `decimals` decimal places
        const parts = rawValue.split('.');
        if (parts.length === 2 && parts[1].length > decimals) return;

        // Prevent multiple negative signs
        if (allowNegative) {
          const dashCount = (rawValue.match(/-/g) || []).length;
          if (dashCount > 1) return;
          // Negative sign must be at the beginning
          if (rawValue.includes('-') && rawValue.indexOf('-') !== 0) return;
        }

        // Update value
        if (!isControlled) {
          setInternalValue(rawValue);
        }

        // Parse and emit numeric value
        const numericValue = parseCurrency(rawValue, decimals);
        onChange?.(numericValue);
      },
      [onChange, isControlled, decimals, allowNegative],
    );

    // Handle blur - format the value
    const handleBlur = useCallback(
      (e: React.FocusEvent<HTMLInputElement>) => {
        setIsFocused(false);
        onBlur?.(e);

        const currentValue = getDisplayValue();

        // If empty, leave as is
        if (currentValue === '') return;

        // Parse and format
        const num = parseCurrency(currentValue, decimals);
        if (num === 0) return;

        const formatted = formatCurrency(num, decimals);

        if (!isControlled) {
          setInternalValue(formatted);
        }

        // Notify parent with formatted numeric value
        onChange?.(num);
      },
      [onBlur, getDisplayValue, decimals, isControlled, onChange],
    );

    // Handle focus
    const handleFocus = useCallback(
      (e: React.FocusEvent<HTMLInputElement>) => {
        setIsFocused(true);
        onFocus?.(e);
        // Select all text on focus for easy replacement
        e.target.select();
      },
      [onFocus],
    );

    // Sync internal value when controlled value changes
    useEffect(() => {
      if (isControlled) {
        if (controlledValue === '' || controlledValue === undefined || controlledValue === null) {
          setInternalValue('');
        } else {
          setInternalValue(formatCurrency(controlledValue, decimals));
        }
      }
    }, [isControlled, controlledValue, decimals]);

    const isError = Boolean(error);
    const errorMessage = typeof error === 'string' ? error : undefined;

    return (
      <div
        className={clsx(
          styles.container,
          styles[`size-${size}`],
          fullWidth && styles.fullWidth,
          disabled && styles.disabled,
          className,
        )}
      >
        {label && (
          <label
            htmlFor={inputId}
            className={clsx(styles.label, labelHidden && styles.labelHidden)}
          >
            {label}
          </label>
        )}

        <div className={styles.inputWrapper}>
          {currencySymbol && (
            <div className={styles.symbolWrapper}>
              <Typography
                variant="body"
                weight="medium"
                color={isError ? 'error' : isFocused ? 'primary' : 'secondary'}
                className={styles.currencySymbol}
              >
                {currencySymbol}
              </Typography>
            </div>
          )}

          <Input
            ref={setRefs}
            id={inputId}
            type="text"
            inputMode="decimal"
            value={currentDisplayValue}
            onChange={handleChange}
            onFocus={handleFocus}
            onBlur={handleBlur}
            placeholder={placeholder}
            disabled={disabled}
            className={clsx(
              styles.input,
              isError && styles.inputError,
              success && styles.inputSuccess,
            )}
            inputSize={size}
            fullWidth
            autoFocus={autoFocus}
            {...restProps}
          />

          {showCurrencyCode && currencyCode && (
            <div className={styles.codeWrapper}>
              <Typography
                variant="small"
                color="muted"
                className={styles.currencyCode}
              >
                {currencyCode}
              </Typography>
            </div>
          )}
        </div>

        {isError && errorMessage && (
          <Typography
            variant="small"
            color="error"
            className={styles.errorText}
            role="alert"
          >
            {errorMessage}
          </Typography>
        )}

        {helperText && !isError && (
          <Typography
            variant="small"
            color="muted"
            className={styles.helperText}
          >
            {helperText}
          </Typography>
        )}
      </div>
    );
  },
);

AmountInput.displayName = 'AmountInput';

export default AmountInput;