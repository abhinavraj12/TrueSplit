/**
 * Authentication feature types.
 * Defines the contract between frontend and backend for auth-related data.
 */

/**
 * User model – matches the backend User model.
 * @see com.truesplit.TrueSplit.model.User
 */
export interface User {
  /** Unique user identifier (from MongoDB) */
  id: string;
  /** User's full name */
  name: string;
  /** User's email address (unique) */
  email: string;
  /** User's phone number (optional) */
  phoneNumber?: string;
  /** User's roles (e.g., ['ROLE_USER']) */
  roles: string[];
  /** Authentication provider: 'local', 'google', 'facebook', 'apple' */
  authProvider: AuthProvider;
  /** Whether the email has been verified (always true for OAuth) */
  emailVerified: boolean;
  /** URL to user's profile picture/avatar (optional) */
  picture?: string;
}

/**
 * Supported OAuth2 providers.
 * Matches the backend OAuth2 configuration.
 */
export type AuthProvider = 'google' | 'facebook' | 'apple';

/**
 * OAuth provider configuration for login buttons.
 */
export interface OAuthProviderConfig {
  /** Provider identifier (matches backend) */
  id: AuthProvider;
  /** Display name (e.g., 'Google') */
  name: string;
  /** Icon component or identifier for rendering */
  icon: string;
  /** Background color for the button */
  color: string;
  /** Text color for the button */
  textColor: string;
}

/**
 * Authentication state managed by the AuthProvider.
 */
export interface AuthState {
  /** The authenticated user, or null if not authenticated */
  user: User | null;
  /** Whether authentication is currently being loaded/checked */
  isLoading: boolean;
  /** Whether the user is authenticated */
  isAuthenticated: boolean;
  /** Any authentication error, or null if no error */
  error: string | null;
}

/**
 * Session configuration.
 * Defines how sessions are managed.
 */
export interface SessionConfig {
  /** Time in milliseconds before the session expires */
  expiryMs: number;
  /** Time in milliseconds before attempting to refresh the token */
  refreshThresholdMs: number;
  /** Time in milliseconds for the refresh token (30 days) */
  refreshTokenExpiryMs: number;
}

/**
 * Response from the /api/me endpoint.
 * Matches the backend UserProfileResponse DTO.
 */
export interface UserProfileResponse {
  id: string;
  name: string;
  email: string;
  phoneNumber?: string;
  roles: string[];
  authProvider: string;
  emailVerified: boolean;
  picture?: string;
}