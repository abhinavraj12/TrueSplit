/**
 * Next.js Middleware for route protection.
 * Redirects unauthenticated users away from private routes,
 * and authenticated users away from auth routes (e.g., /login).
 */

import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { isPublicRoute, isAuthRoute } from '@/shared/lib/utils/route-utils';

/**
 * Middleware function that runs on every request.
 * Handles two scenarios:
 * 1. Private route + no auth token → redirect to login.
 * 2. Auth route + auth token present → redirect to dashboard.
 */
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Skip middleware for static assets and Next.js internal routes
  const skipPaths = [
    '/_next',
    '/favicon.ico',
    '/logo.png',
    '/og-image.png',
    '/robots.txt',
    '/sitemap.xml',
  ];
  if (skipPaths.some((p) => pathname.startsWith(p) || pathname === p)) {
    return NextResponse.next();
  }

  // Check if the user has an authentication cookie
  const authToken = request.cookies.get('TS_AUTH')?.value;

  // Scenario 1: Auth route (e.g., /login) + authenticated user → redirect to dashboard
  if (isAuthRoute(pathname) && authToken) {
    const dashboardUrl = new URL('/dashboard', request.url);
    return NextResponse.redirect(dashboardUrl);
  }

  // Check if the route is public (excluding auth routes)
  // Public routes are open to everyone, regardless of auth status.
  const isPublic = isPublicRoute(pathname);

  // Scenario 2: Private route + no auth token → redirect to login
  if (!isPublic && !authToken) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(loginUrl);
  }

  // For all other cases (public route, or private + auth), allow access.
  return NextResponse.next();
}

/**
 * Middleware matcher configuration.
 * Specifies which routes the middleware should run on.
 * Optimised for performance by excluding static assets.
 */
export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder (public assets)
     * - api routes (handled by backend)
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};