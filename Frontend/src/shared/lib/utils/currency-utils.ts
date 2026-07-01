/**
 * Currency utilities – shared functions for formatting, parsing, and currency data.
 * Uses the CURRENCY config for default values.
 */

import { CURRENCY } from '@/shared/config';

/**
 * Currency information interface.
 */
export interface CurrencyInfo {
  /** ISO 4217 currency code (e.g., 'USD') */
  code: string;
  /** Currency symbol (e.g., '$', '€', '₹') */
  symbol: string;
  /** Full name of the currency (e.g., 'US Dollar') */
  name: string;
}

/**
 * List of major currencies (ISO 4217).
 * This list can be extended as needed.
 */
export const CURRENCIES: CurrencyInfo[] = [
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
  { code: 'TRY', symbol: '₺', name: 'Turkish Lira' },
  { code: 'RUB', symbol: '₽', name: 'Russian Ruble' },
  { code: 'ZAR', symbol: 'R', name: 'South African Rand' },
  { code: 'MXN', symbol: 'Mex$', name: 'Mexican Peso' },
  { code: 'THB', symbol: '฿', name: 'Thai Baht' },
  { code: 'VND', symbol: '₫', name: 'Vietnamese Dong' },
  { code: 'PHP', symbol: '₱', name: 'Philippine Peso' },
  { code: 'IDR', symbol: 'Rp', name: 'Indonesian Rupiah' },
];

/**
 * Get currency information by code.
 * @param code - ISO 4217 currency code (e.g., 'USD')
 * @returns CurrencyInfo object or undefined if not found
 */
export const getCurrencyByCode = (code: string): CurrencyInfo | undefined => {
  return CURRENCIES.find((c) => c.code === code);
};

/**
 * Get currency symbol by code.
 * @param code - ISO 4217 currency code
 * @returns Currency symbol, or undefined if not found
 */
export const getCurrencySymbol = (code: string): string | undefined => {
  return getCurrencyByCode(code)?.symbol;
};

/**
 * Format a number as a currency string with proper decimal places.
 * @param value - Number to format (or null/undefined for empty)
 * @param currencyCode - ISO 4217 currency code (optional, defaults to config default)
 * @param decimals - Number of decimal places (optional, defaults to 2)
 * @param locale - Locale for formatting (optional, defaults to config default)
 * @returns Formatted currency string (e.g., "$1,234.56") or empty string if value is null/undefined
 */
export const formatCurrency = (
  value: number | null | undefined,
  currencyCode: string = CURRENCY.DEFAULT,
  decimals: number = CURRENCY.MAX_FRACTION_DIGITS,
  locale: string = CURRENCY.LOCALE
): string => {
  if (value === null || value === undefined || isNaN(value)) return '';

  // Intl.NumberFormat handles symbol, formatting, and locale
  const formatter = new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currencyCode,
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });

  return formatter.format(value);
};

/**
 * Parse a currency string back to a number.
 * @param value - String representing a currency amount (may include symbols, spaces, etc.)
 * @param decimals - Number of decimal places to round to (defaults to 2)
 * @param allowNegative - If true, negative values are allowed (defaults to true)
 * @returns Parsed number (with decimal precision), or null if invalid
 */
export const parseCurrency = (
  value: string,
  decimals: number = CURRENCY.MAX_FRACTION_DIGITS,
  allowNegative: boolean = true
): number | null => {
  if (!value || value.trim() === '') return null;

  // Remove all non‑numeric characters except dot (.) and minus (-)
  const cleaned = value.replace(/[^0-9.\-]/g, '');

  if (cleaned === '' || cleaned === '-') return null;

  const num = parseFloat(cleaned);
  if (isNaN(num)) return null;

  // Round to defined decimals
  const factor = Math.pow(10, decimals);
  const rounded = Math.round(num * factor) / factor;

  // Enforce negative constraint
  if (!allowNegative && rounded < 0) return null;

  return rounded;
};

/**
 * Format a number as a simple currency string without symbol (e.g., "1,234.56").
 * Useful for API submission or display without symbol.
 * @param value - Number to format (or null/undefined)
 * @param decimals - Number of decimal places (defaults to 2)
 * @param locale - Locale for formatting (defaults to config default)
 * @returns Formatted number string, or empty string if invalid
 */
export const formatCurrencyNumber = (
  value: number | null | undefined,
  decimals: number = CURRENCY.MAX_FRACTION_DIGITS,
  locale: string = CURRENCY.LOCALE
): string => {
  if (value === null || value === undefined || isNaN(value)) return '';

  const formatter = new Intl.NumberFormat(locale, {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });

  return formatter.format(value);
};

/**
 * Get the default currency symbol from config.
 */
export const getDefaultCurrencySymbol = (): string => {
  return getCurrencySymbol(CURRENCY.DEFAULT) || CURRENCY.SYMBOL;
};