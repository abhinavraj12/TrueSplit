/**
 * Session management hook.
 * Provides functions to refresh the access token and check session validity.
 */

import { useCallback } from 'react';
import { refreshToken, getCurrentUser } from '../services/auth-api';
import type { User } from '../types/auth.types';

/**
 * Session management hook.
 * @returns Object containing refresh and check functions
 */
export const useSession = () => {
  /**
   * Manually refresh the access token using the refresh token cookie.
   * @returns Promise resolving to true if refresh succeeded, false otherwise
   */
  const refresh = useCallback(async (): Promise<boolean> => {
    try {
      await refreshToken();
      return true;
    } catch {
      return false;
    }
  }, []);

  /**
   * Check if the current session is still valid by fetching the user profile.
   * @returns Promise resolving to the User if valid, null if not authenticated
   */
  const check = useCallback(async (): Promise<User | null> => {
    try {
      return await getCurrentUser();
    } catch {
      return null;
    }
  }, []);

  return { refresh, check };
};