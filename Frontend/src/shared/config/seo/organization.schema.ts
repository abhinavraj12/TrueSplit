/**
 * Organization JSON‑LD schema.
 * Defines the company/organization behind TrueSplit.
 */

import { SEO_COMMON } from './common';

/**
 * Organization schema in JSON‑LD format.
 * @see https://schema.org/Organization
 */
export const organizationSchema = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: SEO_COMMON.name,
  url: SEO_COMMON.url,
  logo: SEO_COMMON.logo,
  description: SEO_COMMON.description,
  email: SEO_COMMON.email,
  sameAs: Object.values(SEO_COMMON.social),
  contactPoint: {
    '@type': 'ContactPoint',
    email: SEO_COMMON.email,
    contactType: 'customer support',
    availableLanguage: ['English'],
  },
} as const;