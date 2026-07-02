/**
 * Authentication API service.
 * Handles all auth-related backend communication: logout, refresh, and user profile.
 * Note: Login is handled via OAuth2 redirects, not direct API calls.
 */

import { apiClient, api, ApiError } from '@/shared/lib/api';
import { API_ENDPOINTS } from '@/shared/config';
import type { User, UserProfileResponse } from '../types/auth.types';
import { parseUser } from '../utils/auth-utils';

/**
 * Logout the current user.
 * Invalidates the refresh token on the server and clears the session.
 * @returns Promise that resolves when logout is complete
 * @throws {ApiError} If the logout request fails
 */
export const logout = async (): Promise<void> => {
  await apiClient<void>(API_ENDPOINTS.AUTH.LOGOUT, {
    method: 'POST',
  });
};

/**
 * Refresh the access token using the refresh token cookie.
 * The backend uses the refresh token from the HttpOnly cookie.
 * @returns Promise that resolves when refresh is complete
 * @throws {ApiError} If the refresh fails (e.g., expired refresh token)
 */
export const refreshToken = async (): Promise<void> => {
  await apiClient<void>(API_ENDPOINTS.AUTH.REFRESH, {
    method: 'POST',
    // skipRefresh: true prevents infinite loop (already handled by api-client)
  });
};

/**
 * Get the current authenticated user's profile.
 * Fetches user data from the backend and parses it into a typed User object.
 * @returns Promise resolving to the User object
 * @throws {ApiError} If the request fails (e.g., not authenticated)
 */
export const getCurrentUser = async (): Promise<User> => {
  const response = await api.get<UserProfileResponse>(API_ENDPOINTS.USER.ME);
  
  const user = parseUser(response);
  if (!user) {
    throw new ApiError(500, 'INVALID_USER_DATA', 'Unable to parse user data from the server.');
  }
  
  return user;
};

/**
 * Check if the current user is authenticated by fetching their profile.
 * Returns false if the request fails (e.g., not authenticated).
 * @returns Promise resolving to true if authenticated, false otherwise
 */
export const checkAuth = async (): Promise<boolean> => {
  try {
    await getCurrentUser();
    return true;
  } catch (error) {
    // If it's an ApiError with status 401, return false
    if (error instanceof ApiError && error.status === 401) {
      return false;
    }
    // For other errors, we might want to handle them differently
    // We'll return false to be safe and let the caller handle the error
    return false;
  }
};

/**
 * Check the backend health status.
 * Uses the health endpoint to verify if the backend is reachable and operational.
 * @returns Promise resolving to true if backend is healthy, false otherwise
 */
export const checkHealth = async (): Promise<boolean> => {
  try {
    await apiClient<{ status: string; database: string }>(
      API_ENDPOINTS.HEALTH.CHECK,
      { method: 'GET' }
    );
    return true;
  } catch (error) {
    // If the health check fails, the backend is unreachable or unhealthy
    return false;
  }
};

/**
 * Check backend health with detailed status.
 * Returns more detailed health information for debugging.
 * @returns Promise resolving to health status object or null if unreachable
 */
export const getHealthStatus = async (): Promise<{
  status: string;
  database: string;
  service: string;
  version: string;
} | null> => {
  try {
    const response = await apiClient<{
      status: string;
      database: string;
      service: string;
      version: string;
    }>(API_ENDPOINTS.HEALTH.CHECK, { method: 'GET' });
    return response;
  } catch {
    return null;
  }
};