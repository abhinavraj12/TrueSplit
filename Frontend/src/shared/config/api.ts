/**
 * API configuration.
 * All backend communication settings are centralised here.
 */

// Base URL for all API calls (must end without a trailing slash)
export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api/v1';

/**
 * Default fetch options used for all API requests.
 * - `credentials: 'include'` ensures cookies (JWT) are sent with each request.
 * - `headers` include `Content-Type: application/json` by default.
 */
export const DEFAULT_FETCH_OPTIONS: RequestInit = {
  credentials: 'include',
  headers: {
    'Content-Type': 'application/json',
  },
};

/**
 * API endpoint paths grouped by domain.
 * All paths are relative to `API_BASE_URL` unless noted otherwise.
 */
export const API_ENDPOINTS = {
  /** OAuth2 provider authorization endpoints (absolute paths, handled by Spring Security) */
  AUTH: {
    /** Redirect user to Google OAuth2 login */
    GOOGLE: '/oauth2/authorization/google',
    /** Redirect user to Facebook OAuth2 login (if backend supports) */
    FACEBOOK: '/oauth2/authorization/facebook',
    /** Redirect user to Apple OAuth2 login (if backend supports) */
    APPLE: '/oauth2/authorization/apple',
    /** Refresh access token using refresh token cookie */
    REFRESH: '/auth/refresh',
    /** Logout (clears refresh token and invalidates session) */
    LOGOUT: '/auth/logout',
  },

  /** User endpoints */
  USER: {
    /** Get current authenticated user profile */
    ME: '/api/me',
  },

  /** Expense endpoints (under `/api/v1/expenses`) */
  EXPENSES: {
    CREATE: '/api/v1/expenses',
    RECENT: '/api/v1/expenses/recent',
    GET_BY_ID_OR_SLUG: (identifier: string) => `/api/v1/expenses/${identifier}`,
  },

  // Future endpoints (groups, friends, settlements, etc.) can be added here.
} as const;