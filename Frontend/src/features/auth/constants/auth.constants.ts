// src/features/auth/constants/auth.constants.ts

/**
 * Authentication feature constants.
 * Includes OAuth provider configurations, session defaults, and other static data.
 */

import type { OAuthProviderConfig, SessionConfig } from '../types/auth.types';

/**
 * OAuth2 provider configurations for login buttons.
 * Colors are the official brand colors for each provider.
 * Icon names correspond to icon components (e.g., from react-icons).
 */
export const OAUTH_PROVIDERS: OAuthProviderConfig[] = [
  {
    id: 'google',
    name: 'Google',
    icon: 'google',
    color: '#4285F4',
    textColor: '#FFFFFF',
  },
  {
    id: 'facebook',
    name: 'Facebook',
    icon: 'facebook',
    color: '#1877F2',
    textColor: '#FFFFFF',
  },
  {
    id: 'apple',
    name: 'Apple',
    icon: 'apple',
    color: '#000000',
    textColor: '#FFFFFF',
  },
] as const;

/**
 * Session configuration for token management.
 * Values align with backend JWT settings (1 day access, 30 days refresh).
 */
export const SESSION_CONFIG: SessionConfig = {
  /** Access token expiry (1 day) – matches backend jwt.expiration-ms */
  expiryMs: 24 * 60 * 60 * 1000, // 24 hours
  /** Refresh token expiry (30 days) – matches backend jwt.refresh-expiration-ms */
  refreshTokenExpiryMs: 30 * 24 * 60 * 60 * 1000, // 30 days
  /**
   * Time before expiry to trigger a token refresh (5 minutes).
   * If the token expires in less than this threshold, we refresh it proactively.
   */
  refreshThresholdMs: 5 * 60 * 1000, // 5 minutes
} as const;

/**
 * Default user roles (used when parsing user data from backend).
 * The backend assigns 'ROLE_USER' by default.
 */
export const DEFAULT_ROLE = 'ROLE_USER';

/**
 * Auth error messages (used for consistent user feedback).
 */
export const AUTH_ERROR_MESSAGES = {
  /** User is not authenticated (e.g., trying to access protected route) */
  UNAUTHENTICATED: 'Please sign in to continue.',
  /** Session expired, user needs to sign in again */
  SESSION_EXPIRED: 'Your session has expired. Please sign in again.',
  /** OAuth provider returned an error (generic) */
  OAUTH_ERROR: 'There was a problem signing in. Please try again.',
  /** Network error during authentication */
  NETWORK_ERROR: 'We couldn’t connect right now. Please check your internet connection and try again.',
} as const;