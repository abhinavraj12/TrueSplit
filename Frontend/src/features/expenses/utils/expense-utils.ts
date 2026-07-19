/**
 * Expense feature – pure utility functions.
 * These functions are side-effect-free and testable.
 */

import {
  DEFAULT_CURRENCY,
  CURRENCY_DECIMAL_PLACES,
  MIN_TITLE_LENGTH,
  MAX_TITLE_LENGTH,
  MAX_PARTICIPANTS,
  MIN_PARTICIPANTS,
  MAX_FILE_SIZE_BYTES,
  ALLOWED_MIME_TYPES,
} from '../constants/expense.constants';

// ============================================================================
// Currency & Amount Utilities
// ============================================================================

/**
 * Get the currency symbol for a given currency code
 */
export function getCurrencySymbol(currencyCode: string): string {
  const symbols: Record<string, string> = {
    USD: '$',
    EUR: '€',
    GBP: '£',
    INR: '₹',
    JPY: '¥',
    CAD: 'C$',
    AUD: 'A$',
    CHF: 'CHF',
    CNY: '¥',
    BRL: 'R$',
    KRW: '₩',
    SGD: 'S$',
    TRY: '₺',
    RUB: '₽',
    ZAR: 'R',
    MXN: 'Mex$',
    THB: '฿',
    VND: '₫',
    PHP: '₱',
    IDR: 'Rp',
  };
  return symbols[currencyCode] || currencyCode;
}

/**
 * Format a number as a currency string
 */
export function formatCurrency(
  value: number | null | undefined,
  currencyCode: string = DEFAULT_CURRENCY,
  locale: string = 'en-IN'
): string {
  if (value === null || value === undefined || isNaN(value)) {
    return '';
  }

  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currencyCode,
    minimumFractionDigits: CURRENCY_DECIMAL_PLACES,
    maximumFractionDigits: CURRENCY_DECIMAL_PLACES,
  }).format(value);
}

/**
 * Parse a currency string to a number
 * Returns null if parsing fails
 */
export function parseCurrency(value: string): number | null {
  if (!value || value.trim() === '') {
    return null;
  }

  // Remove non-numeric characters except dot and minus
  const cleaned = value.replace(/[^0-9.\-]/g, '');
  if (cleaned === '' || cleaned === '-') {
    return null;
  }

  const num = parseFloat(cleaned);
  if (isNaN(num)) {
    return null;
  }

  // Round to 2 decimal places
  return Math.round(num * 100) / 100;
}

/**
 * Format a number as a percentage
 */
export function formatPercent(value: number, total: number): string {
  if (total === 0) {
    return '0%';
  }
  const percent = (value / total) * 100;
  return `${percent.toFixed(0)}%`;
}

// ============================================================================
// Split Calculation Utilities
// ============================================================================

/**
 * Calculate equal splits for a list of participants
 * The last participant gets the remainder to handle rounding
 */
export function calculateEqualSplits(
  totalAmount: number,
  participantIds: string[]
): Record<string, number> {
  if (participantIds.length === 0) {
    return {};
  }

  const count = participantIds.length;
  const share = Math.round((totalAmount / count) * 100) / 100;
  const totalFromShares = share * count;
  const remainder = Math.round((totalAmount - totalFromShares) * 100) / 100;

  const splits: Record<string, number> = {};
  for (let i = 0; i < count; i++) {
    const amount = i === count - 1 ? share + remainder : share;
    splits[participantIds[i]] = Math.round(amount * 100) / 100;
  }

  return splits;
}

/**
 * Validate manual splits against the total amount
 * Returns true if the sum matches the total (within 0.01 tolerance)
 */
export function validateManualSplits(
  manualSplits: Record<string, number>,
  totalAmount: number
): { valid: boolean; sum: number; remaining: number } {
  const sum = Object.values(manualSplits).reduce((acc, val) => acc + (val || 0), 0);
  const remaining = Math.round((totalAmount - sum) * 100) / 100;
  const valid = Math.abs(remaining) < 0.01;

  return { valid, sum, remaining };
}

/**
 * Check if manual splits are fully allocated (no remaining amount)
 */
export function isFullyAllocated(manualSplits: Record<string, number>, totalAmount: number): boolean {
  const { valid } = validateManualSplits(manualSplits, totalAmount);
  return valid;
}

// ============================================================================
// Validation Utilities
// ============================================================================

/**
 * Validate expense title
 * Returns error message or null if valid
 */
export function validateTitle(title: string): string | null {
  if (!title || title.trim() === '') {
    return 'Please enter a title.';
  }
  if (title.trim().length < MIN_TITLE_LENGTH) {
    return `Title must be at least ${MIN_TITLE_LENGTH} characters.`;
  }
  if (title.trim().length > MAX_TITLE_LENGTH) {
    return `Title cannot exceed ${MAX_TITLE_LENGTH} characters.`;
  }
  return null;
}

/**
 * Validate expense amount
 * Returns error message or null if valid
 */
export function validateAmount(amount: number | null): string | null {
  if (amount === null || amount === undefined) {
    return 'Please enter an amount.';
  }
  if (isNaN(amount) || amount <= 0) {
    return 'Amount must be greater than zero.';
  }
  // Check for more than 2 decimal places
  const rounded = Math.round(amount * 100) / 100;
  if (Math.abs(amount - rounded) > 0.0001) {
    return 'Amount cannot have more than 2 decimal places.';
  }
  return null;
}

/**
 * Validate participants list
 * Returns error message or null if valid
 */
export function validateParticipants(participants: string[]): string | null {
  if (!participants || participants.length < MIN_PARTICIPANTS) {
    return `Please add at least ${MIN_PARTICIPANTS} participants.`;
  }
  if (participants.length > MAX_PARTICIPANTS) {
    return `Cannot have more than ${MAX_PARTICIPANTS} participants.`;
  }
  // Check for duplicates
  const unique = new Set(participants);
  if (unique.size !== participants.length) {
    return 'Duplicate participants are not allowed.';
  }
  return null;
}

/**
 * Validate that paidBy is in participants
 */
export function validatePaidBy(paidBy: string, participants: string[]): string | null {
  if (!paidBy) {
    return 'Please select who paid.';
  }
  if (!participants.includes(paidBy)) {
    return 'The payer must be included as a participant.';
  }
  return null;
}

/**
 * Validate expense date
 * Returns error message or null if valid
 */
export function validateDate(date: Date | null): string | null {
  if (!date) {
    return 'Please select a date.';
  }
  if (!(date instanceof Date) || isNaN(date.getTime())) {
    return 'Please select a valid date.';
  }
  return null;
}

/**
 * Validate file size
 * Returns true if file is within limit
 */
export function isFileSizeValid(fileSize: number): boolean {
  return fileSize <= MAX_FILE_SIZE_BYTES;
}

/**
 * Validate file MIME type
 * Returns true if file type is allowed
 */
export function isFileTypeAllowed(mimeType: string): boolean {
  return ALLOWED_MIME_TYPES.includes(mimeType as (typeof ALLOWED_MIME_TYPES)[number]);
}

/**
 * Get file extension from filename
 */
export function getFileExtension(filename: string): string {
  const lastDot = filename.lastIndexOf('.');
  if (lastDot === -1) {
    return '';
  }
  return filename.substring(lastDot + 1).toLowerCase();
}

/**
 * Format file size to human-readable string
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) {
    return '0 B';
  }
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

// ============================================================================
// Slug Utilities
// ============================================================================

/**
 * Generate a URL-friendly slug from a title
 * Matches backend SlugGeneratorService logic
 */
export function generateSlug(title: string): string {
  if (!title) {
    return '';
  }

  return title
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '') // Remove special characters
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-') // Replace multiple hyphens with single
    .replace(/^-+|-+$/g, ''); // Trim hyphens from start and end
}

// ============================================================================
// Participant Utilities
// ============================================================================

/**
 * Extract initials from a name
 */
export function getInitials(name: string): string {
  if (!name || name.trim() === '') {
    return '?';
  }

  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) {
    return parts[0].charAt(0).toUpperCase();
  }
  return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
}

/**
 * Check if a participant ID is the current user
 */
export function isCurrentUser(participantId: string, currentUserId: string): boolean {
  return participantId === currentUserId;
}

// ============================================================================
// Form Helpers
// ============================================================================

/**
 * Check if a form is ready for submission
 * Returns true if all required fields are valid
 */
export function isFormValid(
  title: string,
  amount: number | null,
  participants: string[],
  paidBy: string,
  expenseDate: Date | null,
  splitType: 'EQUAL' | 'MANUAL',
  manualSplits: Record<string, number>,
  totalAmount: number
): boolean {
  // Validate required fields
  if (validateTitle(title) !== null) {
    return false;
  }
  if (validateAmount(amount) !== null) {
    return false;
  }
  if (validateParticipants(participants) !== null) {
    return false;
  }
  if (validatePaidBy(paidBy, participants) !== null) {
    return false;
  }
  if (validateDate(expenseDate) !== null) {
    return false;
  }

  // Validate splits
  if (splitType === 'MANUAL') {
    const { valid } = validateManualSplits(manualSplits, totalAmount);
    if (!valid) {
      return false;
    }
    // Check all participants have a split assigned
    for (const participantId of participants) {
      if (!(participantId in manualSplits)) {
        return false;
      }
    }
  }

  return true;
}

/**
 * Convert a Date object to ISO date string (YYYY-MM-DD)
 */
export function toISODateString(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * Convert a Date object to ISO time string (HH:mm:ss)
 */
export function toISOTimeString(date: Date): string {
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const seconds = String(date.getSeconds()).padStart(2, '0');
  return `${hours}:${minutes}:${seconds}`;
}

/**
 * Get the user's timezone using Intl
 */
export function getUserTimezone(): string {
  try {
    return Intl.DateTimeFormat().resolvedOptions().timeZone;
  } catch {
    return 'UTC';
  }
}

/**
 * Format a date for display using the specified format
 */
export function formatDateDisplay(
  date: Date | null,
  format: 'date' | 'time' | 'datetime' = 'datetime'
): string {
  if (!date) {
    return '';
  }

  const options: Intl.DateTimeFormatOptions = {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  };

  if (format === 'time' || format === 'datetime') {
    options.hour = 'numeric';
    options.minute = '2-digit';
  }

  if (format === 'time') {
    delete options.month;
    delete options.day;
    delete options.year;
  }

  return new Intl.DateTimeFormat('en-US', options).format(date);
}