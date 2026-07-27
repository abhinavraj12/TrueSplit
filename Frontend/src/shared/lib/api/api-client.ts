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

    Object.setPrototypeOf(this, ApiError.prototype);
  }

  isUnauthorized(): boolean {
    return this.status === 401;
  }

  getUserMessage(): string {
    // If the error code is not one of the generic ones, show the exact backend message
    const genericCodes = ['UNAUTHORIZED', 'FORBIDDEN', 'NOT_FOUND', 'BAD_REQUEST', 'SERVER_ERROR'];
    if (!genericCodes.includes(this.code)) {
      return this.message;
    }

    // Fallback messages for generic codes
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

export interface ApiRequestOptions extends Omit<RequestInit, 'body' | 'headers'> {
  body?: unknown;
  headers?: Record<string, string>;
  skipRefresh?: boolean;
}

const buildUrl = (path: string): string => {
  const base = API_BASE_URL.replace(/\/+$/, '');
  const endpoint = path.replace(/^\/+/, '');
  return `${base}/${endpoint}`;
};

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

  const url = buildUrl(endpoint);

  const requestOptions: RequestInit = {
    ...DEFAULT_FETCH_OPTIONS,
    ...fetchOptions,
    headers: {
      ...DEFAULT_FETCH_OPTIONS.headers,
      ...headers,
    },
  };

  if (body && !['GET', 'HEAD'].includes(fetchOptions.method || 'GET')) {
    requestOptions.body = JSON.stringify(body);
  }

  try {
    const response = await fetch(url, requestOptions);

    // Handle 204 No Content (empty body)
    let data = null;
    if (response.status === 204) {
      // No content – return void (undefined)
      return undefined as T;
    }

    try {
      data = await response.json();
    } catch {
      // If response is not JSON, throw an error
      throw new ApiError(
        response.status,
        'INVALID_RESPONSE',
        'The server returned an invalid response format.'
      );
    }

    if (!response.ok) {
      if (isApiErrorResponse(data)) {
        if (response.status === 401 && !skipRefresh) {
          const refreshed = await attemptTokenRefresh();
          if (refreshed) {
            return apiClient<T>(endpoint, { ...options, skipRefresh: true });
          }
        }

        throw new ApiError(response.status, data.error.code, data.error.message);
      }

      throw new ApiError(
        response.status,
        'UNKNOWN_ERROR',
        typeof data === 'object' && data !== null && 'message' in data
          ? String(data.message)
          : `Request failed with status ${response.status}`
      );
    }

    if (isApiErrorResponse(data)) {
      throw new ApiError(200, data.error.code, data.error.message);
    }

    if (isApiSuccessResponse<T>(data)) {
      return data.data;
    }

    return data as T;
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }

    if (error instanceof Error) {
      if (error.name === 'TypeError' && error.message.includes('fetch')) {
        throw new ApiError(0, 'NETWORK_ERROR', 'Unable to connect to the server. Please check your internet connection.');
      }
      throw new ApiError(500, 'UNKNOWN_ERROR', error.message);
    }

    throw new ApiError(500, 'UNKNOWN_ERROR', 'An unexpected error occurred.');
  }
};

let refreshPromise: Promise<boolean> | null = null;

const attemptTokenRefresh = async (): Promise<boolean> => {
  if (refreshPromise) {
    return refreshPromise;
  }

  refreshPromise = (async () => {
    try {
      await apiClient<void>(API_ENDPOINTS.AUTH.REFRESH, {
        method: 'POST',
        skipRefresh: true,
      });
      return true;
    } catch {
      return false;
    } finally {
      refreshPromise = null;
    }
  })();

  return refreshPromise;
};

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