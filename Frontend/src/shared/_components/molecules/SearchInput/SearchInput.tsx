import React, { forwardRef, useRef, useCallback, useState, useEffect } from 'react';
import clsx from 'clsx';
import { FaSearch, FaTimes } from 'react-icons/fa';
import { Input } from '@/shared/_components/atoms/Input';
import { Icon } from '@/shared/_components/atoms/Icon';
import { Button } from '@/shared/_components/atoms/Button';
import styles from './SearchInput.module.css';

export interface SearchInputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size' | 'onChange' | 'onSubmit'> {
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
  onSubmit?: (value: string) => void;
  placeholder?: string;
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  showClear?: boolean;
  className?: string;
  autoFocus?: boolean;
  disabled?: boolean;
  /** Accessible label for the search input (default: "Search") */
  ariaLabel?: string;
}

export const SearchInput = forwardRef<HTMLInputElement, SearchInputProps>(
  (
    {
      value: controlledValue,
      defaultValue = '',
      onChange,
      onSubmit,
      placeholder = 'Search...',
      size = 'md',
      loading = false,
      showClear = true,
      className,
      autoFocus = false,
      disabled = false,
      ariaLabel = 'Search',
      ...restProps
    },
    forwardedRef,
  ) => {
    const [internalValue, setInternalValue] = useState(defaultValue);
    const isControlled = controlledValue !== undefined;
    const currentValue = isControlled ? controlledValue : internalValue;
    const inputRef = useRef<HTMLInputElement>(null);

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

    useEffect(() => {
      if (autoFocus && inputRef.current) {
        inputRef.current.focus();
      }
    }, [autoFocus]);

    const handleChange = useCallback(
      (e: React.ChangeEvent<HTMLInputElement>) => {
        const newValue = e.target.value;

        if (!isControlled) {
          setInternalValue(newValue);
        }

        onChange?.(newValue);
      },
      [onChange, isControlled],
    );

    const handleClear = useCallback(() => {
      const newValue = '';

      if (!isControlled) {
        setInternalValue(newValue);
      }

      onChange?.(newValue);
      inputRef.current?.focus();
    }, [onChange, isControlled]);

    const handleKeyDown = useCallback(
      (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
          onSubmit?.(currentValue);
        }
      },
      [onSubmit, currentValue],
    );

    const hasValue = currentValue.length > 0;
    const showClearButton = showClear && hasValue && !loading && !disabled;

    return (
      <div
        className={clsx(
          styles.wrapper,
          styles[`size-${size}`],
          disabled && styles.disabled,
          className,
        )}
        role="search"
      >
        <div className={styles.iconLeft}>
          <Icon size="md" color="muted" decorative>
            <FaSearch />
          </Icon>
        </div>

        <Input
          ref={setRefs}
          type="text"
          value={currentValue}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          disabled={disabled}
          className={styles.input}
          inputSize={size}
          fullWidth
          aria-label={ariaLabel}
          {...restProps}
        />

        {loading && (
          <div className={styles.iconRight}>
            <div className={styles.spinner} aria-label="Loading..." />
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
          >
            <Icon size="sm" color="muted" decorative>
              <FaTimes />
            </Icon>
          </Button>
        )}
      </div>
    );
  },
);

SearchInput.displayName = 'SearchInput';

export default SearchInput;