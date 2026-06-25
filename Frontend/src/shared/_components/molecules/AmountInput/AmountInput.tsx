import React, {
  forwardRef,
  useState,
  useCallback,
  useRef,
  useEffect,
  useId,
  memo,
  useMemo,
} from 'react';
import clsx from 'clsx';
import { FaTimes } from 'react-icons/fa';
import { Input } from '@/shared/_components/atoms/Input';
import { Typography } from '@/shared/_components/atoms/Typography';
import { Icon } from '@/shared/_components/atoms/Icon';
import { Button } from '@/shared/_components/atoms/Button';
import styles from './AmountInput.module.css';

export type AmountInputSize = 'sm' | 'md' | 'lg';

export interface AmountInputProps
  extends Omit<
    React.InputHTMLAttributes<HTMLInputElement>,
    'size' | 'onChange' | 'value' | 'defaultValue'
  > {
  /** Label for the input */
  label?: React.ReactNode;
  /** Current value (controlled) – use `null` for empty */
  value?: number | null;
  /** Default value (uncontrolled) */
  defaultValue?: number | null;
  /** Callback when value changes – emits `number` or `null` */
  onChange?: (value: number | null) => void;
  /** Currency symbol (e.g., '$', '€', '₹') */
  currencySymbol?: string;
  /** Currency code (e.g., 'USD', 'EUR', 'INR') – shown when showCurrencyCode is true */
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
  /** Error state (boolean or error message string) */
  error?: boolean | string;
  /** Success state (overridden by error) */
  success?: boolean;
  /** Helper text displayed below */
  helperText?: React.ReactNode;
  /** Additional CSS class */
  className?: string;
  /** If true, full width */
  fullWidth?: boolean;
  /** Auto-focus */
  autoFocus?: boolean;
  /** Disabled state */
  disabled?: boolean;
  /** If true, label is visually hidden but accessible */
  labelHidden?: boolean;
  /** If true, marks the field as required (shows asterisk) */
  required?: boolean;
  /** If true, shows a clear button when value is not empty */
  clearable?: boolean;
  /** Minimum allowed value (inclusive) */
  min?: number;
  /** Maximum allowed value (inclusive) */
  max?: number;
  /** Step increment for keyboard arrows (not yet implemented, but props reserved) */
  step?: number;
  /** If true, input is read‑only (cannot change) */
  readOnly?: boolean;
}

/**
 * Format a number to a currency string with proper decimal places.
 * Returns empty string for null/undefined.
 */
const formatCurrency = (value: number | null, decimals: number = 2): string => {
  if (value === null || value === undefined) return '';
  return value.toFixed(decimals);
};

/**
 * Parse a currency string back to a number.
 * Returns null for empty string or invalid input.
 */
const parseCurrency = (value: string, decimals: number = 2): number | null => {
  if (!value || value.trim() === '') return null;
  // Remove non‑numeric characters except dot and minus
  const cleaned = value.replace(/[^0-9.\-]/g, '');
  if (cleaned === '' || cleaned === '-') return null;
  const num = parseFloat(cleaned);
  if (isNaN(num)) return null;
  // Round to defined decimals
  return Math.round(num * Math.pow(10, decimals)) / Math.pow(10, decimals);
};

/**
 * AmountInput – Currency input with formatting, validation, and accessibility.
 */
const AmountInputComponent = forwardRef<HTMLInputElement, AmountInputProps>(
  (
    {
      label,
      value: controlledValue,
      defaultValue = null,
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
      required = false,
      clearable = false,
      min,
      max,
      step,
      readOnly = false,
      onFocus,
      onBlur,
      ...restProps
    },
    forwardedRef,
  ) => {
    // --- IDs for accessibility ---
    const generatedId = useId();
    const inputId = `amount-input-${generatedId}`;
    const errorId = `amount-error-${generatedId}`;
    const helperId = `amount-helper-${generatedId}`;

    // --- Internal state ---
    // Store the raw string currently displayed in the input.
    const [rawInput, setRawInput] = useState<string>(() => {
      if (controlledValue !== undefined) {
        return controlledValue !== null ? formatCurrency(controlledValue, decimals) : '';
      }
      return defaultValue !== null ? formatCurrency(defaultValue, decimals) : '';
    });

    // Ref to track if the input is focused (to avoid external sync while typing)
    const isFocusedRef = useRef(false);
    const inputRef = useRef<HTMLInputElement>(null);
    const isControlled = controlledValue !== undefined;

    // --- Combine refs ---
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

    // --- Sync external value to rawInput when it changes externally ---
    useEffect(() => {
      if (isControlled && !isFocusedRef.current) {
        const newRaw = controlledValue !== null ? formatCurrency(controlledValue, decimals) : '';
        setRawInput(newRaw);
      }
    }, [isControlled, controlledValue, decimals]);

    // --- Validate and clamp ---
    const clampValue = useCallback(
      (num: number | null): number | null => {
        if (num === null) return null;
        let clamped = num;
        if (min !== undefined && clamped < min) clamped = min;
        if (max !== undefined && clamped > max) clamped = max;
        return clamped;
      },
      [min, max],
    );

    // --- Emit change (only on blur or explicit action) ---
    const emitChange = useCallback(
      (raw: string) => {
        const parsed = parseCurrency(raw, decimals);
        if (parsed === null) {
          onChange?.(null);
          return;
        }
        const clamped = clampValue(parsed);
        onChange?.(clamped);
      },
      [onChange, decimals, clampValue],
    );

    // --- Handle change (raw input) ---
    const handleChange = useCallback(
      (e: React.ChangeEvent<HTMLInputElement>) => {
        if (readOnly || disabled) return;

        const raw = e.target.value;

        // Allow empty
        if (raw === '') {
          setRawInput('');
          return;
        }

        // Validate characters
        const regex = allowNegative ? /^[0-9.\-]*$/ : /^[0-9.]*$/;
        if (!regex.test(raw)) return;

        // Prevent multiple dots
        if ((raw.match(/\./g) || []).length > 1) return;

        // Prevent more than `decimals` fractional digits
        const parts = raw.split('.');
        if (parts.length === 2 && parts[1].length > decimals) return;

        // Prevent multiple minus signs
        if (allowNegative) {
          const dashCount = (raw.match(/-/g) || []).length;
          if (dashCount > 1) return;
          if (raw.includes('-') && raw.indexOf('-') !== 0) return;
        }

        // Update raw state – no formatting, no onChange yet
        setRawInput(raw);
      },
      [allowNegative, decimals, readOnly, disabled],
    );

    // --- Handle blur: format, clamp, and emit ---
    const handleBlur = useCallback(
      (e: React.FocusEvent<HTMLInputElement>) => {
        isFocusedRef.current = false;
        onBlur?.(e);

        const raw = rawInput.trim();

        // Empty → emit null and keep raw empty
        if (raw === '') {
          onChange?.(null);
          return;
        }

        // Only a minus sign → treat as zero or empty depending on allowNegative
        if (raw === '-') {
          if (allowNegative) {
            // Keep as '-'? Or set to 0? Usually we set to 0 or null.
            // For consistency, set to 0 with sign? We'll set to null.
            setRawInput('');
            onChange?.(null);
          } else {
            setRawInput('');
            onChange?.(null);
          }
          return;
        }

        // Parse and clamp
        const parsed = parseCurrency(raw, decimals);
        if (parsed === null) {
          // Invalid input → reset to empty
          setRawInput('');
          onChange?.(null);
          return;
        }

        const clamped = clampValue(parsed);
        const formatted = formatCurrency(clamped, decimals);

        // Update raw to formatted value
        setRawInput(formatted);

        // Emit clamped number (or null)
        onChange?.(clamped);
      },
      [rawInput, onBlur, onChange, decimals, allowNegative, clampValue],
    );

    // --- Handle focus ---
    const handleFocus = useCallback(
      (e: React.FocusEvent<HTMLInputElement>) => {
        isFocusedRef.current = true;
        onFocus?.(e);
        // Select all text for easy replacement
        e.target.select();
      },
      [onFocus],
    );

    // --- Clear handler ---
    const handleClear = useCallback(() => {
      if (readOnly || disabled) return;
      setRawInput('');
      onChange?.(null);
      inputRef.current?.focus();
    }, [readOnly, disabled, onChange]);

    // --- Determine error state ---
    const isError = Boolean(error);
    const errorMessage = typeof error === 'string' ? error : undefined;

    // --- aria-describedby ---
    const describedBy = clsx(
      isError && errorId,
      helperText && !isError && helperId,
    ) || undefined;

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
            {required && <span className={styles.required}>*</span>}
          </label>
        )}

        <div className={styles.inputWrapper}>
          {/* Currency Symbol */}
          {currencySymbol && (
            <div
              className={clsx(
                styles.symbolWrapper,
                disabled && styles.symbolDisabled,
              )}
            >
              <Typography
                variant="body"
                weight="medium"
                color={isError ? 'error' : isFocusedRef.current ? 'primary' : 'secondary'}
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
            value={rawInput} // Use raw string, not formatted
            onChange={handleChange}
            onFocus={handleFocus}
            onBlur={handleBlur}
            placeholder={placeholder}
            disabled={disabled}
            readOnly={readOnly}
            className={clsx(
              styles.input,
              isError && styles.inputError,
              success && !isError && styles.inputSuccess,
            )}
            inputSize={size}
            fullWidth
            autoFocus={autoFocus}
            aria-invalid={isError || undefined}
            aria-describedby={describedBy}
            aria-required={required || undefined}
            {...restProps}
          />

          {/* Clear Button */}
          {clearable && rawInput && !disabled && !readOnly && (
            <Button
              iconOnly
              variant="ghost"
              size="sm"
              onClick={handleClear}
              className={styles.clearButton}
              aria-label="Clear amount"
            >
              <Icon size="sm" color="muted" decorative>
                <FaTimes />
              </Icon>
            </Button>
          )}

          {/* Currency Code */}
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

        {/* Error Message */}
        {isError && errorMessage && (
          <Typography
            variant="small"
            color="error"
            id={errorId}
            className={styles.errorText}
            role="alert"
          >
            {errorMessage}
          </Typography>
        )}

        {/* Helper Text (only if no error) */}
        {helperText && !isError && (
          <Typography
            variant="small"
            color="muted"
            id={helperId}
            className={styles.helperText}
          >
            {helperText}
          </Typography>
        )}
      </div>
    );
  },
);

AmountInputComponent.displayName = 'AmountInput';

// Memoize for performance
export const AmountInput = memo(AmountInputComponent);
export default AmountInput;