/**
 * String utilities – shared functions for text manipulation.
 * Provides helpers for slugs, truncation, capitalization, IDs, and sanitisation.
 */

/**
 * Generate a URL-friendly slug from a string.
 * Converts to lowercase, replaces spaces with hyphens, removes special characters.
 * @param text - The string to slugify
 * @returns Slug string (e.g., "hello-world")
 */
export const slugify = (text: string): string => {
  if (!text) return '';

  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '') // Remove special characters except whitespace and hyphen
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-') // Replace multiple hyphens with single
    .replace(/^-+|-+$/g, ''); // Trim hyphens from start and end
};

/**
 * Truncate a string to a specified maximum length, adding an ellipsis.
 * @param text - The string to truncate
 * @param maxLength - Maximum allowed length (default: 100)
 * @param ellipsis - Ellipsis string (default: '…')
 * @returns Truncated string (if longer than maxLength)
 */
export const truncate = (
  text: string,
  maxLength: number = 100,
  ellipsis: string = '…'
): string => {
  if (!text) return '';
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength).trim() + ellipsis;
};

/**
 * Capitalize the first letter of a string.
 * @param text - The string to capitalize
 * @param lowerRest - If true, lowercases the rest of the string (default: false)
 * @returns Capitalized string
 */
export const capitalize = (text: string, lowerRest: boolean = false): string => {
  if (!text) return '';
  const first = text.charAt(0).toUpperCase();
  const rest = lowerRest ? text.slice(1).toLowerCase() : text.slice(1);
  return first + rest;
};

/**
 * Generate a random alphanumeric ID (like a short UUID).
 * @param length - Length of the ID (default: 10)
 * @returns Random string (e.g., "aB3dE9fGh2")
 */
export const generateId = (length: number = 10): string => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  const randomArray = new Uint8Array(length);
  crypto.getRandomValues(randomArray);
  for (let i = 0; i < length; i++) {
    result += chars.charAt(randomArray[i] % chars.length);
  }
  return result;
};

/**
 * Basic sanitisation: removes HTML tags and escapes special characters.
 * Useful for preventing XSS in user‑generated text before rendering.
 * @param text - The string to sanitise
 * @returns Sanitised string
 */
export const sanitize = (text: string): string => {
  if (!text) return '';

  // Remove HTML tags
  const withoutTags = text.replace(/<[^>]*>/g, '');

  // Escape special characters (basic)
  const map: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;',
  };
  return withoutTags.replace(/[&<>"']/g, (m) => map[m] || m);
};

/**
 * Check if a string is empty, null, or only whitespace.
 * @param value - The string to check
 * @returns True if empty
 */
export const isEmptyString = (value: string | null | undefined): boolean => {
  return !value || value.trim().length === 0;
};

/**
 * Convert a string to title case (e.g., "hello world" → "Hello World").
 * @param text - The string to convert
 * @returns Title‑cased string
 */
export const toTitleCase = (text: string): string => {
  if (!text) return '';
  return text
    .toLowerCase()
    .split(' ')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

/**
 * Extract initials from a name (e.g., "John Doe" → "JD").
 * @param name - Full name
 * @param maxInitials - Maximum number of initials (default: 2)
 * @returns Initials string (uppercase)
 */
export const getInitials = (name: string, maxInitials: number = 2): string => {
  if (!name) return '';
  const words = name.trim().split(/\s+/);
  return words
    .slice(0, maxInitials)
    .map((word) => word.charAt(0).toUpperCase())
    .join('');
};