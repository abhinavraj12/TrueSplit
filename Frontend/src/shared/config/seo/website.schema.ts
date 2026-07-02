/**
 * WebSite JSON‑LD schema.
 * Describes the site and provides search action for Google Sitelinks Searchbox.
 */

import { SEO_COMMON } from './common';

/**
 * WebSite schema in JSON‑LD format.
 * @see https://schema.org/WebSite
 */
export const websiteSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: SEO_COMMON.name,
  url: SEO_COMMON.url,
  description: SEO_COMMON.description,
  inLanguage: SEO_COMMON.locale,
  potentialAction: {
    '@type': 'SearchAction',
    target: {
      '@type': 'EntryPoint',
      urlTemplate: `${SEO_COMMON.url}/search?q={search_term_string}`,
    },
    'query-input': 'required name=search_term_string',
  },
} as const;