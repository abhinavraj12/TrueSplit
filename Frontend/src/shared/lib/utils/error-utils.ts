/**
 * Error utilities – shared error handling functions.
 * Provides helpers for extracting messages, logging, and checking error types.
 */

import { ApiError } from '@/shared/lib/api';

/**
 * Extracts a user-friendly error message from an unknown error.
 * @param error - The caught error (unknown type)
 * @param fallbackMessage - Optional fallback message if none can be extracted
 * @returns A string suitable for displaying to the user
 */
export const getUserErrorMessage = (
  error: unknown,
  fallbackMessage: string = 'An unexpected error occurred. Please try again.'
): string => {
  // If it's our ApiError, use its built‑in user message
  if (error instanceof ApiError) {
    return error.getUserMessage();
  }

  // If it's a standard Error, use its message
  if (error instanceof Error) {
    return error.message || fallbackMessage;
  }

  // If it's an object with a message property
  if (error && typeof error === 'object' && 'message' in error && typeof error.message === 'string') {
    return error.message;
  }

  // If it's a string
  if (typeof error === 'string') {
    return error;
  }

  // Fallback
  return fallbackMessage;
};

/**
 * Checks if an error is an API error (from our backend).
 * @param error - The error to check
 * @returns True if the error is an ApiError
 */
export const isApiError = (error: unknown): error is ApiError => {
  return error instanceof ApiError;
};

/**
 * Checks if an error is a network error (fetch failure).
 * @param error - The error to check
 * @returns True if it's a network error
 */
export const isNetworkError = (error: unknown): boolean => {
  return (
    error instanceof ApiError &&
    error.code === 'NETWORK_ERROR'
  );
};

/**
 * Safely logs an error to the console.
 * In production, you might send this to an error‑tracking service.
 * @param error - The error to log
 * @param context - Additional context (e.g., component name, action)
 */
export const logError = (
  error: unknown,
  context?: string
): void => {
  const errorMessage = getUserErrorMessage(error);

  if (context) {
    console.error(`[Error] ${context}:`, errorMessage, error);
  } else {
    console.error('[Error]:', errorMessage, error);
  }
};

/**
 * Gets a short error code for display (if available).
 * @param error - The error to examine
 * @returns A short code string, or undefined
 */
export const getErrorCode = (error: unknown): string | undefined => {
  if (error instanceof ApiError) {
    return error.code;
  }

  // If error has a code property
  if (error && typeof error === 'object' && 'code' in error && typeof error.code === 'string') {
    return error.code;
  }

  return undefined;
};