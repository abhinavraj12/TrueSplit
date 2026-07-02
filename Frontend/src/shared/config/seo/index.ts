/**
 * SEO schemas – central export point.
 * All schema generators and types are re‑exported from here.
 */

// Common data
export { SEO_COMMON } from './common';

// Schema generators
export { organizationSchema } from './organization.schema';
export { websiteSchema } from './website.schema';
export {
  generateBreadcrumbSchema,
  getBasicBreadcrumb,
  homeBreadcrumb,
  type BreadcrumbItem,
} from './breadcrumb.schema';

export { generateFAQSchema, type FAQItem } from './faq.schema';

export { generateArticleSchema, type ArticleData } from './article.schema';

export { generateProductSchema, type ProductData, type ProductOffer } from './product.schema';