'use client';

/**
 * Authentication context and hook.
 * Provides auth state and functions to the entire application.
 */

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useMemo,
  type ReactNode,
} from 'react';
import { useRouter } from 'next/navigation';
import { API_BASE_URL, ROUTES } from '@/shared/config';
import { ApiError } from '@/shared/lib/api';
import { isPublicRoute } from '@/shared/lib/utils/route-utils';
import type { User, AuthState, AuthProvider as AuthProviderType } from '../types/auth.types';
import { getCurrentUser, logout as logoutService, refreshToken } from '../services/auth-api';
import { OAUTH_PROVIDERS } from '../constants/auth.constants';
import { isAuthenticated } from '../utils/auth-utils';

/**
 * Auth context interface.
 */
interface AuthContextValue extends AuthState {
  /** Log in with OAuth provider (redirects) */
  login: (provider: string) => void;
  /** Log out the current user */
  logout: () => Promise<void>;
  /** Refresh the access token manually */
  refresh: () => Promise<boolean>;
  /** Check the current session and update state */
  checkAuth: () => Promise<boolean>;
  /** Clear any authentication error */
  clearError: () => void;
}

/**
 * Default auth state.
 */
const defaultState: AuthState = {
  user: null,
  isLoading: true,
  isAuthenticated: false,
  error: null,
};

/**
 * Create auth context with default values.
 */
const AuthContext = createContext<AuthContextValue | undefined>(undefined);

/**
 * Auth provider props.
 */
interface AuthProviderProps {
  children: ReactNode;
}

/**
 * Type guard to check if a string is a valid AuthProvider.
 * @param value - The string to check
 * @returns true if the value is a valid AuthProvider, narrowing the type
 */
const isValidProvider = (value: string): value is AuthProviderType => {
  return OAUTH_PROVIDERS.some((p) => p.id === value);
};

/**
 * Auth Provider component.
 * Wraps the app and provides authentication state.
 */
export const AuthProvider = ({ children }: AuthProviderProps) => {
  const router = useRouter();

  const [state, setState] = useState<AuthState>(defaultState);

  /**
   * Clear any error in the state.
   */
  const clearError = useCallback(() => {
    setState((prev) => ({ ...prev, error: null }));
  }, []);

  /**
   * Update state with user data.
   */
  const setAuthenticated = useCallback((user: User) => {
    setState({
      user,
      isLoading: false,
      error: null,
      isAuthenticated: isAuthenticated(user, false),
    });
  }, []);

  /**
   * Update state to unauthenticated.
   */
  const setUnauthenticated = useCallback((error?: string) => {
    setState({
      user: null,
      isLoading: false,
      error: error || null,
      isAuthenticated: isAuthenticated(null, false),
    });
  }, []);

  /**
   * Check the current session and update state.
   * @returns true if authenticated, false otherwise
   */
  const checkAuth = useCallback(async (): Promise<boolean> => {
    // Skip auth check on public pages
    if (typeof window !== 'undefined' && isPublicRoute(window.location.pathname)) {
      setUnauthenticated(); // no error
      return false;
    }

    try {
      const user = await getCurrentUser();
      setAuthenticated(user);
      return true;
    } catch (error) {
      // If it's a 401, just set unauthenticated without error
      if (error instanceof ApiError && error.status === 401) {
        setUnauthenticated();
      } else {
        // Other errors (network, server error) – pass the message
        const message = error instanceof ApiError ? error.getUserMessage() : undefined;
        setUnauthenticated(message);
      }
      return false;
    }
  }, [setAuthenticated, setUnauthenticated]);

  /**
   * Refresh the access token manually.
   * @returns true if refresh succeeded, false otherwise
   */
  const refresh = useCallback(async (): Promise<boolean> => {
    try {
      await refreshToken();
      // After refresh, re-check auth
      return await checkAuth();
    } catch {
      return false;
    }
  }, [checkAuth]);

  /**
   * Log in with OAuth provider.
   * Redirects to the provider's authorization endpoint.
   */
  const login = useCallback(
    (provider: string) => {
      // Validate provider using type guard
      if (!isValidProvider(provider)) {
        setState((prev) => ({
          ...prev,
          error: `Unknown OAuth provider: ${provider}`,
        }));
        return;
      }

      // After type guard, provider is narrowed to AuthProviderType
      const redirectUrl = `${API_BASE_URL.replace(/\/api\/v1$/, '')}/oauth2/authorization/${provider}`;
      window.location.href = redirectUrl;
    },
    []
  );

  /**
   * Log out the current user.
   */
  const logout = useCallback(async (): Promise<void> => {
    try {
      await logoutService();
      setUnauthenticated();
      // Redirect to home page after logout
      router.push(ROUTES.HOME);
    } catch {
      // Even if logout fails, clear local state
      setUnauthenticated();
      router.push(ROUTES.HOME);
    }
  }, [router, setUnauthenticated]);

  /**
   * On mount, check authentication status.
   */
  useEffect(() => {
    let mounted = true;

    const initAuth = async () => {
      if (!mounted) return;
      await checkAuth();
    };

    initAuth();

    return () => {
      mounted = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Run once on mount

  /**
   * Memoize context value to prevent unnecessary re-renders.
   */
  const contextValue = useMemo<AuthContextValue>(
    () => ({
      ...state,
      login,
      logout,
      refresh,
      checkAuth,
      clearError,
    }),
    [state, login, logout, refresh, checkAuth, clearError]
  );

  return <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>;
};

/**
 * Hook to use authentication context.
 * Must be used within an AuthProvider.
 * @returns Auth context value
 * @throws Error if used outside of AuthProvider
 */
export const useAuth = (): AuthContextValue => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};