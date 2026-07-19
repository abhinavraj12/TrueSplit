/**
 * API configuration.
 * All backend communication settings are centralised here.
 */

// Base URL for all API calls (must end without a trailing slash)
// Uses environment variable with fallback for development
export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || 'http://localhost:9090/api/v1';

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
 * All paths are relative to `API_BASE_URL` – do NOT include `/api/v1` prefix.
 */
export const API_ENDPOINTS = {
  /** Authentication endpoints (under `/api/v1/auth`) */
  AUTH: {
    /** Request OTP (kept for backward compatibility, though OAuth2 is primary) */
    REQUEST_OTP: '/auth/request-otp',
    /** Verify OTP */
    VERIFY_OTP: '/auth/verify-otp',
    /** Sign up (email/password) – kept for completeness */
    SIGNUP: '/auth/signup',
    /** Login (email/password) – kept for completeness */
    LOGIN: '/auth/login',
    /** Refresh access token using refresh token cookie */
    REFRESH: '/auth/refresh',
    /** Logout (clears refresh token and invalidates session) */
    LOGOUT: '/auth/logout',
  },

  /** OAuth2 provider authorization endpoints (absolute paths, handled by Spring Security) */
  OAUTH2: {
    /** Redirect user to Google OAuth2 login */
    GOOGLE: '/oauth2/authorization/google',
    /** Redirect user to Facebook OAuth2 login (if backend supports) */
    FACEBOOK: '/oauth2/authorization/facebook',
    /** Redirect user to Apple OAuth2 login (if backend supports) */
    APPLE: '/oauth2/authorization/apple',
  },

  /** User endpoints */
  USER: {
    /** Get current authenticated user profile */
    ME: '/me',
  },

  /** Expense endpoints */
  EXPENSES: {
    /** Create a new expense */
    CREATE: '/expenses',
    /** Get recent expenses for the authenticated user */
    RECENT: '/expenses/recent',
    /** Get a single expense by ID or slug */
    GET_BY_ID_OR_SLUG: (identifier: string) => `/expenses/${identifier}`,
  },

  /** Health check */
  HEALTH: {
    /** Get application health status */
    CHECK: '/health',
  },
} as const;