import React from 'react';
import clsx from 'clsx';
import { Typography } from '@/shared/_components/atoms/Typography';
import { SelectDropdown } from '@/shared/_components/molecules/SelectDropdown';
import styles from './CurrencySelector.module.css';

export interface CurrencyOption {
  code: string;
  symbol: string;
  name: string;
}

export interface CurrencySelectorProps {
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
  label?: React.ReactNode;
  showSymbol?: boolean;
  showFullName?: boolean;
  placeholder?: string;
  disabled?: boolean;
  error?: boolean | string;
  helperText?: React.ReactNode;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

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

export const CurrencySelector: React.FC<CurrencySelectorProps> = ({
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
}) => {
  // Utility function to format a currency display string
  // When showSymbol is true and we have an icon, the icon already shows the symbol
  // so we only show the symbol in the label when showSymbol is false
  const getDisplayValue = (curr: CurrencyOption): string => {
    if (showFullName) {
      return showSymbol ? `${curr.code} - ${curr.name}` : `${curr.code} - ${curr.name}`;
    }
    // When showSymbol is true, the icon shows the symbol, so label should only show the code
    return showSymbol ? curr.code : `${curr.symbol} ${curr.code}`;
  };

  // Generate options using the display function
  const options = DEFAULT_CURRENCIES.map((curr) => ({
    value: curr.code,
    label: getDisplayValue(curr),
    icon: showSymbol ? (
      <span className={styles.currencySymbol}>{curr.symbol}</span>
    ) : undefined,
  }));

  return (
    <div className={clsx(styles.container, className)}>
      {label && (
        <Typography variant="body" weight="medium" color="secondary" className={styles.label}>
          {label}
        </Typography>
      )}
      <SelectDropdown
        options={options}
        value={value}
        defaultValue={defaultValue}
        onChange={onChange}
        placeholder={placeholder}
        disabled={disabled}
        error={error}
        helperText={helperText}
        size={size}
        clearable={false}
        searchable
      />
    </div>
  );
};

CurrencySelector.displayName = 'CurrencySelector';

export default CurrencySelector;