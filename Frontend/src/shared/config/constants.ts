/**
 * Application-wide generic constants.
 * These values are used across multiple features and should be kept here.
 */

/** Default page size for paginated lists (expenses, groups, etc.) */
export const DEFAULT_PAGE_SIZE = 20;

/** Maximum length for text inputs and textareas (to avoid database truncation) */
export const MAX_DESCRIPTION_LENGTH = 500;
export const MAX_TITLE_LENGTH = 100;

/** Supported date formats – use consistent patterns across the app */
export const DATE_FORMATS = {
  /** Display format for UI (e.g., "Jan 15, 2025") */
  DISPLAY: 'MMM dd, yyyy',
  /** HTML5 date input format (YYYY-MM-DD) */
  INPUT: 'yyyy-MM-dd',
  /** API format (ISO 8601 date) */
  API_DATE: 'yyyy-MM-dd',
  /** API format for full datetime (ISO 8601) */
  API_DATETIME: "yyyy-MM-dd'T'HH:mm:ss'Z'",
} as const;

/** Default currency and locale settings (INR for India) */
export const CURRENCY = {
  /** Default currency code (ISO 4217) */
  DEFAULT: 'INR',
  /** Default currency symbol */
  SYMBOL: '₹',
  /** Locale used for number/currency formatting (e.g., en-IN for India) */
  LOCALE: 'en-IN',
  /** Minimum fraction digits for currency display */
  MIN_FRACTION_DIGITS: 2,
  /** Maximum fraction digits for currency display */
  MAX_FRACTION_DIGITS: 2,
} as const;

/** Debounce delay for search inputs and other real‑time interactions (milliseconds) */
export const DEBOUNCE_DELAY = 300;

/** Default animation durations (milliseconds) – matches CSS custom properties for consistency */
export const ANIMATION_DURATIONS = {
  FAST: 150,
  BASE: 250,
  SLOW: 400,
} as const;

/** Pagination defaults for infinite scroll / load more patterns */
export const PAGINATION = {
  /** Initial page number (0‑based) */
  INITIAL_PAGE: 0,
  /** Default items per page (re-exported for clarity) */
  DEFAULT_PAGE_SIZE,
  /** Maximum items per page (to prevent huge queries) */
  MAX_PAGE_SIZE: 100,
} as const;