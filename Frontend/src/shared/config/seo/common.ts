/**
 * Common data used across SEO schemas.
 * Imports from the main site config to keep everything in sync.
 */

import { SITE } from '../site';

/**
 * Core information about the site.
 * Used by Organization, WebSite, and other schemas.
 */
export const SEO_COMMON = {
  /** The full URL of the site (e.g., https://truesplit.com) */
  url: SITE.url,

  /** The site name */
  name: SITE.name,

  /** The default description for the site */
  description: SITE.description,

  /** Absolute URL to the logo (used in Organization schema) */
  logo: `${SITE.url}/logo.png`,

  /** Contact email (for Organization schema) */
  email: SITE.contactEmail,

  /** Social profile URLs (for Organization and WebSite schemas) */
  social: SITE.social,

  /** Default locale (for WebSite and other schemas) */
  locale: SITE.locale,
} as const;