import React, { useMemo, memo } from 'react';
import clsx from 'clsx';
import { SelectDropdown, SelectOption } from '@/shared/_components/molecules/SelectDropdown';
import styles from './CurrencySelector.module.css';

export interface CurrencyOption {
  code: string;
  symbol: string;
  name: string;
}

export interface CurrencySelectorProps {
  /** Currently selected currency code (controlled) */
  value?: string;
  /** Default currency code (uncontrolled) */
  defaultValue?: string;
  /** Callback when selection changes */
  onChange?: (value: string) => void;
  /** Label displayed above the selector */
  label?: React.ReactNode;
  /** Show currency symbol as an icon in the dropdown (default: true) */
  showSymbol?: boolean;
  /** Show full currency name alongside the code in the dropdown (default: false) */
  showFullName?: boolean;
  /** Placeholder text when no currency is selected (default: 'Select currency') */
  placeholder?: string;
  /** Disable the selector */
  disabled?: boolean;
  /** Error state (boolean or error message string) */
  error?: boolean | string;
  /** Helper text displayed below */
  helperText?: React.ReactNode;
  /** Size variant (default: 'md') */
  size?: 'sm' | 'md' | 'lg';
  /** Additional CSS class */
  className?: string;
  /** If true, marks the field as required (shows asterisk) */
  required?: boolean;
  /** If true, shows a clear button when a value is selected */
  clearable?: boolean;
  /** If true, enables search/filtering of options (default: true) */
  searchable?: boolean;
  /** Custom accessible label for screen readers (overrides label) */
  ariaLabel?: string;
  /** If true, label is visually hidden but remains accessible */
  labelHidden?: boolean;
  /** Optional custom currency list (overrides the default list) */
  currencies?: CurrencyOption[];
}

// Default currency list – ISO 4217 major currencies
const DEFAULT_CURRENCIES: CurrencyOption[] = [
  { code: 'USD', symbol: '$', name: 'US Dollar' },
  { code: 'EUR', symbol: '€', name: 'Euro' },
  { code: 'GBP', symbol: '£', name: 'British Pound' },
  { code: 'INR', symbol: '₹', name: 'Indian Rupee' },
  { code: 'JPY', symbol: '¥', name: 'Japanese Yen' },
  { code: 'CAD', symbol: 'C$', name: 'Canadian Dollar' },
  { code: 'AUD', symbol: 'A$', name: 'Australian Dollar' },
  { code: 'CHF', symbol: 'CHF', name: 'Swiss Franc' },
  { code: 'CNY', symbol: '¥', name: 'Chinese Yuan' },
  { code: 'BRL', symbol: 'R$', name: 'Brazilian Real' },
  { code: 'KRW', symbol: '₩', name: 'South Korean Won' },
  { code: 'SGD', symbol: 'S$', name: 'Singapore Dollar' },
];

/**
 * Format a currency option for display in the dropdown.
 */
const formatOptionLabel = (
  currency: CurrencyOption,
  showSymbol: boolean,
  showFullName: boolean,
): string => {
  if (showFullName) {
    return showSymbol ? `${currency.code} – ${currency.name}` : `${currency.code} – ${currency.name}`;
  }
  // Default: show just the code, optionally with symbol as icon
  return currency.code;
};

/**
 * CurrencySelector – A dropdown for selecting a currency with symbol, name, and accessibility.
 */
const CurrencySelectorComponent: React.FC<CurrencySelectorProps> = ({
  value,
  defaultValue,
  onChange,
  label,
  showSymbol = true,
  showFullName = false,
  placeholder = 'Select currency',
  disabled = false,
  error = false,
  helperText,
  size = 'md',
  className,
  required = false,
  clearable = false,
  searchable = true,
  ariaLabel,
  labelHidden = false,
  currencies = DEFAULT_CURRENCIES,
}) => {
  // Memoize options to prevent re‑creation on every render
  const options: SelectOption[] = useMemo(() => {
    return currencies.map((curr) => ({
      value: curr.code,
      label: formatOptionLabel(curr, showSymbol, showFullName),
      icon: showSymbol ? (
        <span className={styles.currencySymbol} aria-hidden="true">
          {curr.symbol}
        </span>
      ) : undefined,
    }));
  }, [currencies, showSymbol, showFullName]);

  // If value is provided but not in the options, log a warning and treat as undefined
  const safeValue = useMemo(() => {
    if (value !== undefined && !options.some((opt) => opt.value === value)) {
      if (process.env.NODE_ENV === 'development') {
        console.warn(`CurrencySelector: value "${value}" not found in currency list.`);
      }
      return undefined;
    }
    return value;
  }, [value, options]);

  return (
    <SelectDropdown
      label={label}
      value={safeValue}
      defaultValue={defaultValue}
      onChange={onChange}
      options={options}
      placeholder={placeholder}
      disabled={disabled}
      error={error}
      helperText={helperText}
      size={size}
      required={required}
      clearable={clearable}
      searchable={searchable}
      aria-label={ariaLabel}
      labelHidden={labelHidden}
      className={clsx(styles.container, className)}
    />
  );
};

CurrencySelectorComponent.displayName = 'CurrencySelector';

// Memoize to prevent unnecessary re‑renders
export const CurrencySelector = memo(CurrencySelectorComponent);
export default CurrencySelector;