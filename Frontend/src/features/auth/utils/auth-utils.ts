// src/features/auth/utils/auth-utils.ts

/**
 * Authentication utilities – pure helper functions.
 * These functions do not depend on React hooks or API calls.
 */

import type { User, UserProfileResponse, AuthProvider } from '../types/auth.types';
import { DEFAULT_ROLE } from '../constants/auth.constants';

/**
 * Check if a user is authenticated based on the current user and loading state.
 * @param user - The user object (or null)
 * @param isLoading - Whether authentication is being loaded
 * @returns true if the user is authenticated (user exists and not loading)
 */
export const isAuthenticated = (user: User | null, isLoading: boolean): boolean => {
  return user !== null && !isLoading;
};

/**
 * Check if the user has a specific role.
 * @param user - The user object (or null)
 * @param role - The role to check for (e.g., 'ROLE_ADMIN')
 * @returns true if the user has the specified role
 */
export const hasRole = (user: User | null, role: string): boolean => {
  if (!user) return false;
  return user.roles.includes(role);
};

/**
 * Check if the user has any of the specified roles.
 * @param user - The user object (or null)
 * @param roles - Array of role strings to check
 * @returns true if the user has any of the specified roles
 */
export const hasAnyRole = (user: User | null, roles: string[]): boolean => {
  if (!user || roles.length === 0) return false;
  return roles.some((role) => user.roles.includes(role));
};

/**
 * Type guard to check if a string is a valid AuthProvider.
 * @param value - The string to check
 * @returns true if the value is one of 'google', 'facebook', or 'apple'
 */
const isValidAuthProvider = (value: string): value is AuthProvider => {
  return ['google', 'facebook', 'apple'].includes(value);
};

/**
 * Parse user data from the API response.
 * Transforms the raw API response into a typed User object.
 * @param response - The user profile response from /api/me
 * @returns A typed User object, or null if the response is invalid
 */
export const parseUser = (response: UserProfileResponse | null): User | null => {
  if (!response) return null;

  // Validate required fields
  if (!response.id || !response.name || !response.email) {
    console.warn('Invalid user response: missing required fields', response);
    return null;
  }

  // Validate and cast authProvider
  const authProvider: AuthProvider = isValidAuthProvider(response.authProvider)
    ? response.authProvider
    : 'google'; // fallback to google if unknown

  return {
    id: response.id,
    name: response.name,
    email: response.email,
    phoneNumber: response.phoneNumber,
    roles: response.roles || [DEFAULT_ROLE],
    authProvider,
    emailVerified: response.emailVerified ?? true,
    picture: response.picture,
  };
};

/**
 * Get a display name for the user (fallback to email if name is empty).
 * @param user - The user object (or null)
 * @returns The user's display name, or 'User' if null
 */
export const getUserDisplayName = (user: User | null): string => {
  if (!user) return 'User';
  return user.name?.trim() || user.email || 'User';
};

/**
 * Get the user's initials for avatar display.
 * @param user - The user object (or null)
 * @returns A string of up to 2 uppercase initials
 */
export const getUserInitials = (user: User | null): string => {
  if (!user) return '?';
  const name = user.name?.trim() || user.email || '';
  if (!name) return '?';

  const parts = name.split(/\s+/);
  if (parts.length === 1) {
    return parts[0].charAt(0).toUpperCase();
  }
  return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
};

/**
 * Get the user's avatar URL (prefer picture, fallback to null).
 * @param user - The user object (or null)
 * @returns The avatar URL, or null if not available
 */
export const getUserAvatar = (user: User | null): string | null => {
  if (!user) return null;
  return user.picture || null;
};

/**
 * Check if the user is a guest (not authenticated).
 * @param user - The user object (or null)
 * @param isLoading - Whether authentication is being loaded
 * @returns true if the user is not authenticated
 */
export const isGuest = (user: User | null, isLoading: boolean): boolean => {
  return !isAuthenticated(user, isLoading);
};

/**
 * Check if authentication is in progress.
 * @param isLoading - Whether authentication is being loaded
 * @returns true if authentication is loading
 */
export const isAuthLoading = (isLoading: boolean): boolean => {
  return isLoading;
};