/**
 * Validation utilities – shared validation functions.
 * Provides validators for email, phone, required fields, numbers, dates, etc.
 * Note: Password validation is omitted because TrueSplit uses OAuth2 only.
 */

import { isEmptyString } from './string-utils';

/**
 * Validation result type.
 * Returns true if valid, or a string error message if invalid.
 */
export type ValidationResult = true | string;

/**
 * Validator function type.
 * Takes a value and an optional field name, returns a ValidationResult.
 * Validators that don't need fieldName can simply ignore the second parameter.
 */
export type Validator<T = unknown> = (value: T, fieldName?: string) => ValidationResult;

/**
 * Check if a value is a valid email address.
 * @param email - The email string to validate
 * @returns true if valid, error message string if invalid
 */
export const isEmail = (email: string): ValidationResult => {
  if (isEmptyString(email)) {
    return 'Email is required.';
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return 'Please enter a valid email address.';
  }

  return true;
};

/**
 * Check if a value is a valid phone number.
 * Supports:
 * - 10-digit numbers (e.g., 9876543210) – common in India
 * - International numbers with country code (e.g., +919876543210, +1 234 567 8900)
 * - Optional spaces, dashes, parentheses
 * @param phone - The phone number string to validate
 * @returns true if valid, error message string if invalid
 */
export const isPhone = (phone: string): ValidationResult => {
  if (isEmptyString(phone)) {
    return 'Phone number is required.';
  }

  // Remove all non-digit characters except '+'
  const cleaned = phone.replace(/[^\d+]/g, '');

  if (!cleaned || cleaned === '+') {
    return 'Please enter a valid phone number.';
  }

  // If starts with '+', it's international – allow it
  // Otherwise, ensure it's purely digits
  if (!/^\+?\d+$/.test(cleaned)) {
    return 'Please enter a valid phone number.';
  }

  // Count digits (excluding the '+')
  const digitsOnly = cleaned.replace(/^\+/, '');
  const digitCount = digitsOnly.length;

  // International standard: 7-15 digits (ITU-T E.164)
  if (digitCount < 7 || digitCount > 15) {
    return 'Phone number must be between 7 and 15 digits.';
  }

  return true;
};

/**
 * Check if a value is a valid positive number (greater than zero).
 * @param value - The number to validate
 * @param allowZero - If true, zero is allowed (default: false)
 * @returns true if valid, error message string if invalid
 */
export const isPositiveNumber = (
  value: number | string | null | undefined,
  allowZero: boolean = false
): ValidationResult => {
  const num = typeof value === 'string' ? parseFloat(value) : value;

  if (num === null || num === undefined || isNaN(num)) {
    return 'Please enter a valid number.';
  }

  if (allowZero && num === 0) {
    return true;
  }

  if (num <= 0) {
    return allowZero ? 'Number must be zero or greater.' : 'Number must be greater than zero.';
  }

  return true;
};

/**
 * Check if a value is a positive integer (whole number > 0).
 * @param value - The number to validate
 * @returns true if valid, error message string if invalid
 */
export const isPositiveInteger = (
  value: number | string | null | undefined
): ValidationResult => {
  const num = typeof value === 'string' ? parseInt(value, 10) : value;

  if (num === null || num === undefined || isNaN(num)) {
    return 'Please enter a valid number.';
  }

  if (!Number.isInteger(num)) {
    return 'Please enter a whole number.';
  }

  if (num <= 0) {
    return 'Number must be greater than zero.';
  }

  return true;
};

/**
 * Check if a value is not empty (required field).
 * @param value - The value to check (string, number, array, object)
 * @param fieldName - Optional field name for the error message
 * @returns true if valid, error message string if invalid
 */
export const isRequired = (
  value: string | number | null | undefined | unknown[] | object,
  fieldName: string = 'This field'
): ValidationResult => {
  if (value === null || value === undefined) {
    return `${fieldName} is required.`;
  }

  if (typeof value === 'string' && isEmptyString(value)) {
    return `${fieldName} is required.`;
  }

  if (Array.isArray(value) && value.length === 0) {
    return `${fieldName} is required.`;
  }

  if (typeof value === 'object' && !Array.isArray(value) && Object.keys(value).length === 0) {
    return `${fieldName} is required.`;
  }

  return true;
};

/**
 * Check if a string is within a specified length range.
 * @param value - The string to validate
 * @param minLength - Minimum length (inclusive)
 * @param maxLength - Maximum length (inclusive)
 * @param fieldName - Optional field name for the error message
 * @returns true if valid, error message string if invalid
 */
export const hasLengthBetween = (
  value: string,
  minLength: number,
  maxLength: number,
  fieldName: string = 'This field'
): ValidationResult => {
  if (isEmptyString(value)) {
    return `${fieldName} is required.`;
  }

  if (value.length < minLength) {
    return `${fieldName} must be at least ${minLength} characters long.`;
  }

  if (value.length > maxLength) {
    return `${fieldName} cannot exceed ${maxLength} characters.`;
  }

  return true;
};

/**
 * Check if a number is within a specified range.
 * @param value - The number to validate
 * @param min - Minimum value (inclusive)
 * @param max - Maximum value (inclusive)
 * @param fieldName - Optional field name for the error message
 * @returns true if valid, error message string if invalid
 */
export const isBetween = (
  value: number,
  min: number,
  max: number,
  fieldName: string = 'This field'
): ValidationResult => {
  if (isNaN(value)) {
    return `${fieldName} must be a valid number.`;
  }

  if (value < min) {
    return `${fieldName} must be at least ${min}.`;
  }

  if (value > max) {
    return `${fieldName} cannot exceed ${max}.`;
  }

  return true;
};

/**
 * Check if two values match (e.g., password confirmation, but also reusable).
 * @param value1 - First value
 * @param value2 - Second value to compare
 * @param fieldName - Optional field name for the error message
 * @returns true if valid, error message string if invalid
 */
export const matches = (
  value1: string,
  value2: string,
  fieldName: string = 'Values'
): ValidationResult => {
  if (value1 !== value2) {
    return `${fieldName} do not match.`;
  }

  return true;
};

/**
 * Check if a URL is valid.
 * @param url - The URL string to validate
 * @returns true if valid, error message string if invalid
 */
export const isUrl = (url: string): ValidationResult => {
  if (isEmptyString(url)) {
    return 'URL is required.';
  }

  try {
    new URL(url);
    return true;
  } catch {
    return 'Please enter a valid URL.';
  }
};

/**
 * Check if a value is a valid date string (YYYY-MM-DD or ISO format).
 * @param dateString - The date string to validate
 * @returns true if valid, error message string if invalid
 */
export const isDateString = (dateString: string): ValidationResult => {
  if (isEmptyString(dateString)) {
    return 'Date is required.';
  }

  const date = new Date(dateString);
  if (isNaN(date.getTime())) {
    return 'Please enter a valid date.';
  }

  return true;
};

/**
 * Run multiple validators on a value.
 * Returns the first error message encountered, or true if all pass.
 * @param value - The value to validate
 * @param validators - Array of validator functions or [validator, fieldName] tuples
 * @returns true if all pass, or the first error message
 */
export const validateAll = (
  value: unknown,
  validators: Array<Validator | [Validator, string]>
): ValidationResult => {
  for (const validator of validators) {
    let result: ValidationResult;

    if (Array.isArray(validator)) {
      const [fn, fieldName] = validator;
      // Pass the fieldName to the validator function (validators that don't need it will ignore it)
      result = fn(value, fieldName);
    } else {
      result = validator(value);
    }

    if (result !== true) {
      return result;
    }
  }

  return true;
};