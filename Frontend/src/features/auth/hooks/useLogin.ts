'use client';

/**
 * Login hook.
 * Handles OAuth provider selection and login state for the login page.
 */

import { useState, useCallback } from 'react';
import { useAuth } from './useAuth';
import { OAUTH_PROVIDERS } from '../constants/auth.constants';
import type { AuthProvider } from '../types/auth.types';

/**
 * Login hook return type.
 */
interface UseLoginReturn {
  /** Available OAuth providers */
  providers: typeof OAUTH_PROVIDERS;
  /** Currently selected provider (if any) */
  selectedProvider: AuthProvider | null;
  /** Whether a login attempt is in progress */
  isLoggingIn: boolean;
  /** Error message from login attempt (if any) */
  error: string | null;
  /** Initiate login with a specific provider */
  loginWithProvider: (providerId: string) => void;
  /** Clear any error state */
  clearError: () => void;
}

/**
 * Login hook for the login page.
 * Handles provider selection, loading state, and error management.
 */
export const useLogin = (): UseLoginReturn => {
  const { login, error: authError, clearError: clearAuthError } = useAuth();

  const [selectedProvider, setSelectedProvider] = useState<AuthProvider | null>(null);
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);

  /**
   * Initiate login with the specified provider.
   * @param providerId - The OAuth provider ID (e.g., 'google', 'facebook', 'apple')
   */
  const loginWithProvider = useCallback(
    (providerId: string) => {
      // Check if provider is valid
      const isValidProvider = OAUTH_PROVIDERS.some((p) => p.id === providerId);
      if (!isValidProvider) {
        setLocalError(`Unknown OAuth provider: ${providerId}`);
        return;
      }

      // Set loading state and clear errors
      setIsLoggingIn(true);
      setSelectedProvider(providerId as AuthProvider);
      setLocalError(null);
      clearAuthError();

      // Initiate OAuth flow via the auth context
      login(providerId);

      // Note: The redirect happens immediately via window.location.href.
      // After this line, the page will navigate away, so we do not reset
      // the loading state. If the redirect fails (e.g., network error),
      // the user will remain on the login page with the loading state
      // still true. They can manually retry or refresh.
    },
    [login, clearAuthError]
  );

  /**
   * Clear any local error state.
   */
  const clearError = useCallback(() => {
    setLocalError(null);
    clearAuthError();
  }, [clearAuthError]);

  /**
   * Combine errors: prefer local error, fallback to auth error.
   */
  const error = localError || authError;

  return {
    providers: OAUTH_PROVIDERS,
    selectedProvider,
    isLoggingIn,
    error,
    loginWithProvider,
    clearError,
  };
};