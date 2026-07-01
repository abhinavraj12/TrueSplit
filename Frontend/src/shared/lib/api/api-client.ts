// src/shared/lib/api/api-client.ts

/**
 * API client – centralised HTTP communication layer.
 * Handles requests, responses, authentication, and errors.
 */

import { API_BASE_URL, DEFAULT_FETCH_OPTIONS, API_ENDPOINTS } from '@/shared/config';

/**
 * API error response from the backend.
 * Matches the `ApiResponse` structure from the backend.
 */
export interface ApiErrorResponse {
  success: false;
  error: {
    code: string;
    message: string;
  };
  metadata?: {
    timestamp: string;
    apiVersion: string;
  };
}

/**
 * Successful API response from the backend.
 * Matches the `ApiResponse` structure from the backend.
 */
export interface ApiSuccessResponse<T> {
  success: true;
  data: T;
  metadata: {
    timestamp: string;
    apiVersion: string;
  };
}

/**
 * API response type (success or error).
 */
export type ApiResponse<T> = ApiSuccessResponse<T> | ApiErrorResponse;

/**
 * Custom error class for API errors.
 * Provides structured error information for consistent handling.
 */
export class ApiError extends Error {
  public readonly status: number;
  public readonly code: string;
  public readonly isApiError: true;

  constructor(status: number, code: string, message: string) {
    super(message);
    this.status = status;
    this.code = code;
    this.isApiError = true;

    // Ensures proper prototype chain for instanceof checks
    Object.setPrototypeOf(this, ApiError.prototype);
  }

  /**
   * Check if the error is an authentication error (401).
   */
  isUnauthorized(): boolean {
    return this.status === 401;
  }

  /**
   * Get a user-friendly error message.
   */
  getUserMessage(): string {
    // Map backend error codes to user-friendly messages
    const messages: Record<string, string> = {
      UNAUTHORIZED: 'Please sign in to continue.',
      FORBIDDEN: 'You don’t have access to do that.',
      NOT_FOUND: 'We couldn’t find what you’re looking for.',
      BAD_REQUEST: 'Something doesn’t look right. Please check your information and try again.',
      SERVER_ERROR: 'Something went wrong on our end. Please try again in a moment.',
    };

    return messages[this.code] || this.message || 'Something went wrong. Please try again.';
  }
}

/**
 * Fetch options for API requests.
 */
export interface ApiRequestOptions extends Omit<RequestInit, 'body' | 'headers'> {
  /** Request body (will be JSON stringified) */
  body?: unknown;
  /** Additional headers (merged with defaults) */
  headers?: Record<string, string>;
  /** Whether to skip automatic token refresh (for refresh endpoint itself) */
  skipRefresh?: boolean;
}

/**
 * Builds the full URL for an API endpoint.
 */
const buildUrl = (path: string): string => {
  // Remove trailing slashes to avoid double slashes
  const base = API_BASE_URL.replace(/\/+$/, '');
  const endpoint = path.replace(/^\/+/, '');
  return `${base}/${endpoint}`;
};

/**
 * Type guard to check if a response is an API error response.
 */
const isApiErrorResponse = (data: unknown): data is ApiErrorResponse => {
  return (
    typeof data === 'object' &&
    data !== null &&
    'success' in data &&
    data.success === false &&
    'error' in data &&
    typeof data.error === 'object' &&
    data.error !== null &&
    'code' in data.error &&
    typeof data.error.code === 'string'
  );
};

/**
 * Type guard to check if a response is a successful API response.
 */
const isApiSuccessResponse = <T>(data: unknown): data is ApiSuccessResponse<T> => {
  return (
    typeof data === 'object' &&
    data !== null &&
    'success' in data &&
    data.success === true &&
    'data' in data &&
    data.data !== undefined
  );
};

/**
 * Main API client function.
 * Makes authenticated requests to the backend with automatic error handling.
 */
export const apiClient = async <T = unknown>(
  endpoint: string,
  options: ApiRequestOptions = {}
): Promise<T> => {
  const { body, headers, skipRefresh = false, ...fetchOptions } = options;

  // Build the full URL
  const url = buildUrl(endpoint);

  // Prepare request options
  const requestOptions: RequestInit = {
    ...DEFAULT_FETCH_OPTIONS,
    ...fetchOptions,
    headers: {
      ...DEFAULT_FETCH_OPTIONS.headers,
      ...headers,
    },
  };

  // Add body if provided (and not GET/HEAD)
  if (body && !['GET', 'HEAD'].includes(fetchOptions.method || 'GET')) {
    requestOptions.body = JSON.stringify(body);
  }

  try {
    // Make the request
    const response = await fetch(url, requestOptions);

    // Parse response body (always JSON from our API)
    const data = await response.json();

    // Check if response is successful
    if (!response.ok) {
      // Handle API error responses (success: false with error details)
      if (isApiErrorResponse(data)) {
        // If unauthorized and we're not skipping refresh, try to refresh token
        if (response.status === 401 && !skipRefresh) {
          const refreshed = await attemptTokenRefresh();
          if (refreshed) {
            // Retry the original request (only once)
            return apiClient<T>(endpoint, { ...options, skipRefresh: true });
          }
        }

        throw new ApiError(response.status, data.error.code, data.error.message);
      }

      // If the response isn't in our standard format, create a generic error
      throw new ApiError(
        response.status,
        'UNKNOWN_ERROR',
        typeof data === 'object' && data !== null && 'message' in data
          ? String(data.message)
          : `Request failed with status ${response.status}`
      );
    }

    // Check if the response is in our standard API format
    if (isApiErrorResponse(data)) {
      // This shouldn't happen with a 200 status, but handle defensively
      throw new ApiError(200, data.error.code, data.error.message);
    }

    // Success response – extract the data using the type guard
    if (isApiSuccessResponse<T>(data)) {
      return data.data;
    }

    // If the response isn't in our standard format but status is 200, return the whole response
    // This handles cases where the API returns data directly without the wrapper
    return data as T;
  } catch (error) {
    // If it's already an ApiError, rethrow it
    if (error instanceof ApiError) {
      throw error;
    }

    // Handle fetch errors (network issues, etc.)
    if (error instanceof Error) {
      // Check if it's a network error (no response)
      if (error.name === 'TypeError' && error.message.includes('fetch')) {
        throw new ApiError(0, 'NETWORK_ERROR', 'Unable to connect to the server. Please check your internet connection.');
      }
      throw new ApiError(500, 'UNKNOWN_ERROR', error.message);
    }

    // Fallback for unexpected errors
    throw new ApiError(500, 'UNKNOWN_ERROR', 'An unexpected error occurred.');
  }
};

/**
 * Attempts to refresh the access token using the refresh token cookie.
 * Returns true if refresh was successful, false otherwise.
 */
let refreshPromise: Promise<boolean> | null = null;

const attemptTokenRefresh = async (): Promise<boolean> => {
  // If a refresh is already in progress, wait for it to complete
  if (refreshPromise) {
    return refreshPromise;
  }

  refreshPromise = (async () => {
    try {
      // Call the refresh endpoint (skipRefresh prevents infinite loop)
      await apiClient<void>(API_ENDPOINTS.AUTH.REFRESH, {
        method: 'POST',
        skipRefresh: true,
      });
      return true;
    } catch {
      // Refresh failed – return false (no need to handle the error here)
      return false;
    } finally {
      refreshPromise = null;
    }
  })();

  return refreshPromise;
};

/**
 * Convenience methods for common HTTP verbs.
 */
export const api = {
  get: <T = unknown>(endpoint: string, options?: Omit<ApiRequestOptions, 'body' | 'method'>) =>
    apiClient<T>(endpoint, { ...options, method: 'GET' }),

  post: <T = unknown>(endpoint: string, body?: unknown, options?: Omit<ApiRequestOptions, 'body' | 'method'>) =>
    apiClient<T>(endpoint, { ...options, method: 'POST', body }),

  put: <T = unknown>(endpoint: string, body?: unknown, options?: Omit<ApiRequestOptions, 'body' | 'method'>) =>
    apiClient<T>(endpoint, { ...options, method: 'PUT', body }),

  patch: <T = unknown>(endpoint: string, body?: unknown, options?: Omit<ApiRequestOptions, 'body' | 'method'>) =>
    apiClient<T>(endpoint, { ...options, method: 'PATCH', body }),

  delete: <T = unknown>(endpoint: string, options?: Omit<ApiRequestOptions, 'body' | 'method'>) =>
    apiClient<T>(endpoint, { ...options, method: 'DELETE' }),
};