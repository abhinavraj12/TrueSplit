/**
 * Application route constants.
 * All paths are defined here to ensure consistency across the codebase.
 */

export const ROUTES = {
  // Public marketing pages
  HOME: '/',
  FEATURES: '/features',
  PRICING: '/pricing',
  ABOUT: '/about',
  CONTACT: '/contact',
  BLOG: '/blog',
  CAREERS: '/careers',
  HOW_IT_WORKS: '/how-it-works',
  FAQ: '/faq',
  SUPPORT: '/support',

  // Legal & policy pages
  PRIVACY: '/privacy',
  TERMS: '/terms',
  COOKIES: '/cookies',

  // Authentication pages
  LOGIN: '/login',

  // Error & utility pages
  MAINTENANCE: '/maintenance',
  UNAVAILABLE: '/unavailable',

  // Future authenticated routes (placeholders – will be used later)
  DASHBOARD: '/dashboard',
  GROUPS: '/groups',
  EXPENSES: '/expenses',
  PROFILE: '/profile',
  SETTINGS: '/settings',
} as const;

/**
 * Grouped routes for easy checks.
 * Useful for conditional logic (e.g., hiding navigation on auth pages).
 */
export const ROUTE_GROUPS = {
  /** Routes that do not require authentication */
  PUBLIC: [
    ROUTES.HOME,
    ROUTES.FEATURES,
    ROUTES.PRICING,
    ROUTES.ABOUT,
    ROUTES.CONTACT,
    ROUTES.BLOG,
    ROUTES.CAREERS,
    ROUTES.HOW_IT_WORKS,
    ROUTES.FAQ,
    ROUTES.SUPPORT,
    ROUTES.PRIVACY,
    ROUTES.TERMS,
    ROUTES.COOKIES,
    ROUTES.LOGIN,
    ROUTES.MAINTENANCE,
    ROUTES.UNAVAILABLE,
  ] as const,

  /** Authentication-related pages (usually without header/footer) */
  AUTH: [ROUTES.LOGIN] as const,

  /** Legal / policy pages (often in footer) */
  LEGAL: [ROUTES.PRIVACY, ROUTES.TERMS, ROUTES.COOKIES] as const,
} as const;