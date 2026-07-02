/**
 * Authentication feature – central export point.
 * All public exports are re-exported from here.
 */

// Types
export type {
  User,
  AuthState,
  AuthProvider as AuthProviderType,
  OAuthProviderConfig,
  SessionConfig,
} from './types/auth.types';

// Constants
export { OAUTH_PROVIDERS, SESSION_CONFIG, AUTH_ERROR_MESSAGES, DEFAULT_ROLE } from './constants/auth.constants';

// Utilities
export {
  isAuthenticated,
  hasRole,
  hasAnyRole,
  parseUser,
  getUserDisplayName,
  getUserInitials,
  getUserAvatar,
  isGuest,
  isAuthLoading,
} from './utils/auth-utils';

// Hooks and Components
export { useAuth, AuthProvider } from './hooks/useAuth';
export { useLogin } from './hooks/useLogin';

// Services
export { logout, refreshToken, getCurrentUser, checkAuth } from './services/auth-api';

// Note: `login` is not exported directly because OAuth2 login is handled via redirects.
// The `login` function is available via `useAuth` and `useLogin` hooks.