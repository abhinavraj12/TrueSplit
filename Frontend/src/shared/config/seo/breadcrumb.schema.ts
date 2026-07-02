/**
 * BreadcrumbList JSON‑LD schema.
 * Generates a breadcrumb trail for any given path.
 */

import { SEO_COMMON } from './common';

/**
 * Represents a single breadcrumb item.
 */
export interface BreadcrumbItem {
  /** The name of the breadcrumb (display label) */
  name: string;
  /** The URL of the breadcrumb */
  url: string;
}

/**
 * Generates the BreadcrumbList schema for a set of breadcrumb items.
 * @param items - Array of breadcrumb items (ordered from home to current page)
 * @returns BreadcrumbList JSON‑LD object
 */
export const generateBreadcrumbSchema = (items: BreadcrumbItem[]) => {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
};

/**
 * Pre‑defined breadcrumb for the home page (single item).
 */
export const homeBreadcrumb = {
  name: SEO_COMMON.name,
  url: SEO_COMMON.url,
};

/**
 * Helper to build a common breadcrumb trail for most pages (Home > Page).
 * @param pageName - The name of the current page
 * @param pagePath - The relative path of the current page
 * @returns BreadcrumbItem array
 */
export const getBasicBreadcrumb = (pageName: string, pagePath: string): BreadcrumbItem[] => {
  return [
    homeBreadcrumb,
    { name: pageName, url: `${SEO_COMMON.url}${pagePath}` },
  ];
};