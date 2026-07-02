/**
 * Date utilities – shared date handling functions.
 * Uses DATE_FORMATS from config for consistent formatting.
 */

import { DATE_FORMATS } from '@/shared/config';

/**
 * Formats a date according to the specified format.
 * @param date - Date object or string that can be parsed to Date
 * @param format - Format key from DATE_FORMATS or custom string
 * @returns Formatted date string, or empty string if invalid
 */
export const formatDate = (
  date: Date | string | null | undefined,
  format: keyof typeof DATE_FORMATS | string = 'DISPLAY'
): string => {
  if (!date) return '';

  const parsed = typeof date === 'string' ? new Date(date) : date;
  if (!isValidDate(parsed)) return '';

  // If format is a predefined key, use it; otherwise treat as custom format
  const formatString =
    format in DATE_FORMATS ? DATE_FORMATS[format as keyof typeof DATE_FORMATS] : format;

  // Simple formatting using Intl.DateTimeFormat for common cases
  // For custom formats, we'll implement a basic token replacement
  const year = parsed.getFullYear();
  const month = String(parsed.getMonth() + 1).padStart(2, '0');
  const day = String(parsed.getDate()).padStart(2, '0');
  const hours = String(parsed.getHours()).padStart(2, '0');
  const minutes = String(parsed.getMinutes()).padStart(2, '0');

  // Define a mapping for common tokens
  const tokenMap: Record<string, string> = {
    'yyyy': String(year),
    'yy': String(year).slice(-2),
    'MM': month,
    'M': String(parsed.getMonth() + 1),
    'dd': day,
    'd': String(parsed.getDate()),
    'HH': hours,
    'H': String(parsed.getHours()),
    'hh': String(parsed.getHours() % 12 || 12).padStart(2, '0'),
    'h': String(parsed.getHours() % 12 || 12),
    'mm': minutes,
    'm': String(parsed.getMinutes()),
    'ss': String(parsed.getSeconds()).padStart(2, '0'),
    's': String(parsed.getSeconds()),
    'a': parsed.getHours() < 12 ? 'AM' : 'PM',
  };

  // For standard formats, use Intl.DateTimeFormat for proper locale support
  // Use a Set to avoid duplicate keys (INPUT and API_DATE share the same format)
  const standardFormats: Record<string, Intl.DateTimeFormatOptions> = {
    [DATE_FORMATS.DISPLAY]: {
      month: 'short',
      day: '2-digit',
      year: 'numeric',
    },
    [DATE_FORMATS.INPUT]: {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    },
    [DATE_FORMATS.API_DATETIME]: {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      timeZone: 'UTC',
      timeZoneName: 'short',
    },
  };

  // Since INPUT and API_DATE are the same format, we map API_DATE to INPUT
  // This avoids duplicate keys
  const effectiveFormat = formatString === DATE_FORMATS.API_DATE ? DATE_FORMATS.INPUT : formatString;

  // If the format matches a standard key, use Intl
  if (effectiveFormat in standardFormats) {
    return new Intl.DateTimeFormat('en-US', standardFormats[effectiveFormat]).format(parsed);
  }

  // Otherwise, replace tokens
  let result = effectiveFormat;
  for (const [token, value] of Object.entries(tokenMap)) {
    result = result.replace(new RegExp(token, 'g'), value);
  }
  return result;
};

/**
 * Checks if a date is valid.
 */
export const isValidDate = (date: Date | string | null | undefined): boolean => {
  if (!date) return false;
  const d = typeof date === 'string' ? new Date(date) : date;
  return d instanceof Date && !isNaN(d.getTime());
};

/**
 * Safely parses a date string.
 * @returns Date object or null if invalid
 */
export const parseDate = (date: string | Date | null | undefined): Date | null => {
  if (!date) return null;
  const d = typeof date === 'string' ? new Date(date) : date;
  return isValidDate(d) ? d : null;
};

/**
 * Checks if two dates are the same day.
 */
export const isSameDay = (d1: Date | string | null, d2: Date | string | null): boolean => {
  if (!d1 || !d2) return false;
  const date1 = parseDate(d1);
  const date2 = parseDate(d2);
  if (!date1 || !date2) return false;
  return (
    date1.getFullYear() === date2.getFullYear() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getDate() === date2.getDate()
  );
};

/**
 * Checks if two dates are the same month (and year).
 */
export const isSameMonth = (d1: Date | string | null, d2: Date | string | null): boolean => {
  if (!d1 || !d2) return false;
  const date1 = parseDate(d1);
  const date2 = parseDate(d2);
  if (!date1 || !date2) return false;
  return date1.getFullYear() === date2.getFullYear() && date1.getMonth() === date2.getMonth();
};

/**
 * Checks if a date is today.
 */
export const isToday = (date: Date | string | null): boolean => {
  if (!date) return false;
  const d = parseDate(date);
  if (!d) return false;
  return isSameDay(d, new Date());
};

/**
 * Checks if a date is in the future.
 */
export const isFuture = (date: Date | string | null): boolean => {
  if (!date) return false;
  const d = parseDate(date);
  if (!d) return false;
  return d.getTime() > Date.now();
};

/**
 * Checks if a date is in the past.
 */
export const isPast = (date: Date | string | null): boolean => {
  if (!date) return false;
  const d = parseDate(date);
  if (!d) return false;
  return d.getTime() < Date.now();
};

/**
 * Returns a human‑readable relative time (e.g., "2 hours ago", "in 3 days").
 * @param date - Date to compare with now
 * @param now - Optional reference date (default: now)
 * @returns Relative time string
 */
export const relativeTime = (date: Date | string | null, now: Date = new Date()): string => {
  if (!date) return '';
  const d = parseDate(date);
  if (!d) return '';
  const diffMs = d.getTime() - now.getTime();
  const diffSec = Math.round(diffMs / 1000);
  const diffMin = Math.round(diffSec / 60);
  const diffHour = Math.round(diffMin / 60);
  const diffDay = Math.round(diffHour / 24);
  const diffMonth = Math.round(diffDay / 30);
  const diffYear = Math.round(diffDay / 365);

  const rtf = new Intl.RelativeTimeFormat('en', { numeric: 'auto' });

  if (Math.abs(diffSec) < 60) {
    return rtf.format(diffSec, 'second');
  } else if (Math.abs(diffMin) < 60) {
    return rtf.format(diffMin, 'minute');
  } else if (Math.abs(diffHour) < 24) {
    return rtf.format(diffHour, 'hour');
  } else if (Math.abs(diffDay) < 30) {
    return rtf.format(diffDay, 'day');
  } else if (Math.abs(diffMonth) < 12) {
    return rtf.format(diffMonth, 'month');
  } else {
    return rtf.format(diffYear, 'year');
  }
};

/**
 * Generates an array of dates for a given month (with padding for empty days).
 * Useful for calendar rendering.
 */
export const getMonthCalendar = (year: number, month: number): Date[] => {
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const daysInMonth = lastDay.getDate();
  const startDayOfWeek = firstDay.getDay();

  const days: Date[] = [];

  // Previous month padding
  const prevMonthLastDay = new Date(year, month, 0).getDate();
  for (let i = startDayOfWeek - 1; i >= 0; i--) {
    days.push(new Date(year, month - 1, prevMonthLastDay - i));
  }

  // Current month
  for (let i = 1; i <= daysInMonth; i++) {
    days.push(new Date(year, month, i));
  }

  // Next month padding (to complete 42 days)
  const remaining = 42 - days.length;
  for (let i = 1; i <= remaining; i++) {
    days.push(new Date(year, month + 1, i));
  }

  return days;
};

/**
 * Alias for getMonthCalendar – used by DatePicker.
 */
export const generateCalendar = getMonthCalendar;

/**
 * Returns a year range (e.g., for select dropdowns).
 */
export const getYearRange = (currentYear: number, range: number = 25): number[] => {
  const start = currentYear - range;
  const end = currentYear + range;
  const years: number[] = [];
  for (let i = start; i <= end; i++) {
    years.push(i);
  }
  return years;
};

/**
 * Checks if a date is between two dates (inclusive).
 */
export const isDateBetween = (
  date: Date,
  minDate?: Date | null,
  maxDate?: Date | null
): boolean => {
  if (minDate && date < minDate) return false;
  if (maxDate && date > maxDate) return false;
  return true;
};

/**
 * Checks if a date should be disabled.
 * @param date - The date to check
 * @param minDate - Earliest selectable date (optional)
 * @param maxDate - Latest selectable date (optional)
 * @param disabledDates - Array of dates that should be disabled
 * @returns true if the date is disabled
 */
export const isDateDisabled = (
  date: Date,
  minDate?: Date | null,
  maxDate?: Date | null,
  disabledDates: Date[] = []
): boolean => {
  if (!isDateBetween(date, minDate, maxDate)) return true;
  return disabledDates.some((d) => isSameDay(date, d));
};