/**
 * Site-wide configuration values.
 * All values are derived from environment variables or sensible defaults.
 */

// Required environment variables
const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:4000';

export const SITE = {
  /** The full URL of the application (including protocol) */
  url: APP_URL,

  /** The application name */
  name: 'TrueSplit',

  /** The default meta description */
  description:
    'Smart expense splitting for groups, friends, and families. Settle shared bills effortlessly.',

  /** Default locale (ISO 639-1) */
  locale: 'en',

  /** Default Open Graph image (absolute URL) */
  ogImage: `${APP_URL}/og-image.png`,

  /** Contact email for support and inquiries */
  contactEmail: 'support@truesplit.com',

  /** Social media profiles (used in Organization schema and footer) */
  social: {
    twitter: 'https://twitter.com/truesplit',
    facebook: 'https://facebook.com/truesplit',
    linkedin: 'https://linkedin.com/company/truesplit',
    github: 'https://github.com/truesplit',
  },
} as const;