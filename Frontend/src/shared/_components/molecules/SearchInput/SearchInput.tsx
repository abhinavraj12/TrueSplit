import React, {
  forwardRef,
  useRef,
  useCallback,
  useState,
  useEffect,
  useMemo,
  memo,
  useId,
} from 'react';
import clsx from 'clsx';
import { FaSearch, FaTimes } from 'react-icons/fa';
import { Input } from '@/shared/_components/atoms/Input';
import { Icon } from '@/shared/_components/atoms/Icon';
import { Button } from '@/shared/_components/atoms/Button';
import { Typography } from '@/shared/_components/atoms/Typography';
import styles from './SearchInput.module.css';

export interface SearchInputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size' | 'onChange' | 'onSubmit'> {
  /** Controlled value */
  value?: string;
  /** Uncontrolled default value */
  defaultValue?: string;
  /** Callback when value changes (after debounce if enabled) */
  onChange?: (value: string) => void;
  /** Callback when Enter is pressed */
  onSubmit?: (value: string) => void;
  /** Callback when clear button is clicked */
  onClear?: () => void;
  /** Callback when input receives focus */
  onFocus?: React.FocusEventHandler<HTMLInputElement>;
  /** Callback when input loses focus */
  onBlur?: React.FocusEventHandler<HTMLInputElement>;
  /** Placeholder text (default: 'Search...') */
  placeholder?: string;
  /** Size variant (default: 'md') */
  size?: 'sm' | 'md' | 'lg';
  /** Loading state (shows spinner) */
  loading?: boolean;
  /** Show clear button when value exists (default: true) */
  showClear?: boolean;
  /** Additional CSS class */
  className?: string;
  /** Auto-focus on mount */
  autoFocus?: boolean;
  /** Disabled state */
  disabled?: boolean;
  /** Accessible label (default: 'Search') */
  ariaLabel?: string;
  /** Name attribute for form submission */
  name?: string;
  /** Required field (adds aria-required) */
  required?: boolean;
  /** Debounce delay in ms (default: 300; set to 0 to disable) */
  debounce?: number;
  /** Custom left icon (default: FaSearch) */
  leftIcon?: React.ReactNode;
  /** Auto-complete behavior (default: 'off') */
  autoComplete?: 'on' | 'off';
  /** Helper text displayed below the input */
  helperText?: string;
}

/**
 * SearchInput – Accessible search bar with debounce, loading state, and clear button.
 * Optimized for performance: input updates instantly, only onChange is debounced.
 */
const SearchInputComponent = forwardRef<HTMLInputElement, SearchInputProps>(
  (
    {
      value: controlledValue,
      defaultValue = '',
      onChange,
      onSubmit,
      onClear,
      onFocus: customOnFocus,
      onBlur: customOnBlur,
      placeholder = 'Search...',
      size = 'md',
      loading = false,
      showClear = true,
      className,
      autoFocus = false,
      disabled = false,
      ariaLabel = 'Search',
      name,
      required = false,
      debounce = 300,
      leftIcon = <FaSearch />,
      autoComplete = 'off',
      helperText,
      ...restProps
    },
    forwardedRef,
  ) => {
    // --- IDs for accessibility ---
    const generatedId = useId();
    const helperId = helperText ? `search-helper-${generatedId}` : undefined;

    // --- State ---
    // displayValue is the actual string shown in the input – updates instantly
    const [displayValue, setDisplayValue] = useState(
      controlledValue !== undefined ? controlledValue : defaultValue,
    );
    // Track if the current display value came from a local user action (typing/clearing)
    // to avoid overwriting with stale props
    const isLocalUpdateRef = useRef(false);

    // --- Refs ---
    const inputRef = useRef<HTMLInputElement>(null);
    const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);

    // --- Determine if controlled ---
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

    // --- Sync controlled prop to displayValue only when change is external ---
    useEffect(() => {
      if (isControlled && !isLocalUpdateRef.current) {
        // Only update displayValue if the controlled value differs and it's not a local update
        if (controlledValue !== displayValue) {
          setDisplayValue(controlledValue ?? '');
        }
      }
      // Reset the flag after the render cycle
      // We use a timeout to ensure it resets after the update has been applied
      const timer = setTimeout(() => {
        isLocalUpdateRef.current = false;
      }, 0);
      return () => clearTimeout(timer);
    }, [isControlled, controlledValue, displayValue]);

    // --- Auto-focus ---
    useEffect(() => {
      if (autoFocus && inputRef.current) {
        inputRef.current.focus();
      }
    }, [autoFocus]);

    // --- Handle change with debounce ---
    const handleChange = useCallback(
      (e: React.ChangeEvent<HTMLInputElement>) => {
        const newValue = e.target.value;

        // **CRITICAL**: Update displayValue immediately so the input feels responsive
        setDisplayValue(newValue);
        // Mark that this change is local to prevent overwriting by parent
        isLocalUpdateRef.current = true;

        // Clear existing timer
        if (debounceTimerRef.current) {
          clearTimeout(debounceTimerRef.current);
          debounceTimerRef.current = null;
        }

        // If debounce is 0, call immediately
        if (debounce === 0) {
          onChange?.(newValue);
          return;
        }

        // Debounce the onChange callback
        debounceTimerRef.current = setTimeout(() => {
          onChange?.(newValue);
          debounceTimerRef.current = null;
        }, debounce);
      },
      [onChange, debounce],
    );

    // --- Handle clear ---
    const handleClear = useCallback(() => {
      const newValue = '';

      // Update displayValue immediately
      setDisplayValue(newValue);
      isLocalUpdateRef.current = true;

      // Cancel any pending debounce
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
        debounceTimerRef.current = null;
      }

      // Notify parent immediately (clear should not be debounced)
      onChange?.(newValue);
      onClear?.();

      // Focus the input
      inputRef.current?.focus();
    }, [onChange, onClear]);

    // --- Handle key down (Enter = submit) ---
    const handleKeyDown = useCallback(
      (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
          // Cancel any pending debounce
          if (debounceTimerRef.current) {
            clearTimeout(debounceTimerRef.current);
            debounceTimerRef.current = null;
          }
          // Flush the current value
          onSubmit?.(displayValue);
        }
        restProps.onKeyDown?.(e);
      },
      [onSubmit, displayValue, restProps],
    );

    // --- Handle focus/blur — call custom callbacks only ---
    const handleFocus = useCallback(
      (e: React.FocusEvent<HTMLInputElement>) => {
        customOnFocus?.(e);
      },
      [customOnFocus],
    );

    const handleBlur = useCallback(
      (e: React.FocusEvent<HTMLInputElement>) => {
        customOnBlur?.(e);
      },
      [customOnBlur],
    );

    // --- Cleanup timer on unmount ---
    useEffect(() => {
      return () => {
        if (debounceTimerRef.current) {
          clearTimeout(debounceTimerRef.current);
        }
      };
    }, []);

    // --- Determine if clear button should show ---
    const hasValue = displayValue.length > 0;
    const showClearButton = showClear && hasValue && !disabled;

    // --- Accessibility ---
    const describedBy = helperText ? helperId : undefined;

    // --- Memoize helper text ID ---
    const helperIdValue = useMemo(() => helperId, [helperId]);

    return (
      <div className={styles.wrapperContainer}>
        <div
          className={clsx(
            styles.wrapper,
            styles[`size-${size}`],
            disabled && styles.disabled,
            className,
          )}
          role="search"
          aria-busy={loading || undefined}
        >
          {/* Left Icon */}
          <div className={styles.iconLeft} aria-hidden="true">
            <Icon size={size === 'lg' ? 'md' : 'sm'} color="muted" decorative>
              {leftIcon}
            </Icon>
          </div>

          {/* Input */}
          <Input
            ref={setRefs}
            type="text"
            value={displayValue}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            onFocus={handleFocus}
            onBlur={handleBlur}
            placeholder={placeholder}
            disabled={disabled}
            className={styles.input}
            inputSize={size}
            fullWidth
            aria-label={ariaLabel}
            aria-required={required || undefined}
            aria-describedby={describedBy}
            name={name}
            required={required}
            autoComplete={autoComplete}
            {...restProps}
          />

          {/* Loading Spinner or Clear Button */}
          <div className={styles.rightActions}>
            {loading && (
              <div className={styles.spinner} aria-label="Loading...">
                <div className={styles.spinnerDot} />
                <div className={styles.spinnerDot} />
                <div className={styles.spinnerDot} />
              </div>
            )}

            {showClearButton && (
              <Button
                iconOnly
                variant="ghost"
                size={size === 'lg' ? 'md' : 'sm'}
                onClick={handleClear}
                className={styles.clearButton}
                aria-label="Clear search"
                disabled={loading}
              >
                <Icon size="sm" color="muted" decorative>
                  <FaTimes />
                </Icon>
              </Button>
            )}
          </div>
        </div>

        {/* Helper Text */}
        {helperText && (
          <Typography
            id={helperIdValue}
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

SearchInputComponent.displayName = 'SearchInput';

// Memoize to prevent unnecessary re‑renders
export const SearchInput = memo(SearchInputComponent);
export default SearchInput;