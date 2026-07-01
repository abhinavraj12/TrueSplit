/**
 * Route utilities – helpers for route matching and public/private checks.
 * Uses PUBLIC_ROUTE_PATTERNS and AUTH_ROUTES from config as the single source of truth.
 */

import { PUBLIC_ROUTE_PATTERNS, AUTH_ROUTES } from '@/shared/config';

/**
 * Checks if a given pathname is a public route.
 * Supports both exact matches and wildcard patterns (e.g., '/blog/*').
 * @param pathname - The current URL pathname (e.g., '/login', '/blog/my-post')
 * @returns true if the path is public, false otherwise
 */
export const isPublicRoute = (pathname: string): boolean => {
  if (!pathname) return false;

  // Normalize the pathname (remove trailing slash if present)
  const normalizedPath = pathname.replace(/\/$/, '');

  return PUBLIC_ROUTE_PATTERNS.some((pattern) => {
    // If pattern ends with '/*', treat it as a prefix match
    if (pattern.endsWith('/*')) {
      const prefix = pattern.slice(0, -2); // Remove '/*'
      return normalizedPath === prefix || normalizedPath.startsWith(`${prefix}/`);
    }

    // Exact match
    return normalizedPath === pattern;
  });
};

/**
 * Checks if a given pathname is an authentication route (e.g., login, signup).
 * @param pathname - The current URL pathname
 * @returns true if the path is an auth route, false otherwise
 */
export const isAuthRoute = (pathname: string): boolean => {
  if (!pathname) return false;

  const normalizedPath = pathname.replace(/\/$/, '');

  return AUTH_ROUTES.some((route) => normalizedPath === route);
};

/**
 * Checks if a given pathname is a private (authenticated) route.
 * @param pathname - The current URL pathname
 * @returns true if the path is private, false otherwise
 */
export const isPrivateRoute = (pathname: string): boolean => {
  return !isPublicRoute(pathname);
};

/**
 * Checks if the current route is public using window.location.
 * This is a convenience function for client-side components.
 * @returns true if the current route is public, false otherwise
 */
export const isCurrentRoutePublic = (): boolean => {
  if (typeof window === 'undefined') return false;
  return isPublicRoute(window.location.pathname);
};

/**
 * Checks if the current route is an auth route using window.location.
 * This is a convenience function for client-side components.
 * @returns true if the current route is an auth route, false otherwise
 */
export const isCurrentRouteAuth = (): boolean => {
  if (typeof window === 'undefined') return false;
  return isAuthRoute(window.location.pathname);
};

/**
 * Checks if the current route is private using window.location.
 * This is a convenience function for client-side components.
 * @returns true if the current route is private, false otherwise
 */
export const isCurrentRoutePrivate = (): boolean => {
  return !isCurrentRoutePublic();
};