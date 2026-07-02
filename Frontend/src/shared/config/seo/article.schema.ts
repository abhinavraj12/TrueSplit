/**
 * Article / BlogPosting JSON‑LD schema.
 * Generates structured data for blog posts and articles.
 */

import { SEO_COMMON } from './common';

export interface ArticleData {
  /** Headline of the article (max 110 characters) */
  headline: string;
  /** Full URL of the article */
  url: string;
  /** URL of the main image */
  imageUrl: string;
  /** Publication date (ISO 8601) */
  datePublished: string;
  /** Last modification date (ISO 8601), optional */
  dateModified?: string;
  /** Author's name */
  authorName: string;
  /** Author's URL (optional) */
  authorUrl?: string;
  /** Article description / excerpt */
  description?: string;
  /** Article body (optional, for Google News) */
  articleBody?: string;
  /** Categories or section name */
  section?: string;
}

/**
 * Internal type for the Article/BlogPosting schema object.
 * Ensures type safety without using `any`.
 */
type ArticleSchema = {
  '@context': 'https://schema.org';
  '@type': 'Article' | 'BlogPosting';
  headline: string;
  url: string;
  image: string;
  datePublished: string;
  dateModified: string;
  author: {
    '@type': 'Person';
    name: string;
    url?: string;
  };
  publisher: {
    '@type': 'Organization';
    name: string;
    logo: {
      '@type': 'ImageObject';
      url: string;
    };
  };
  mainEntityOfPage: {
    '@type': 'WebPage';
    '@id': string;
  };
  description?: string;
  articleBody?: string;
  articleSection?: string;
};

/**
 * Generates the Article/BlogPosting schema for a blog post.
 * @param data - Article data
 * @param isBlogPost - If `true`, uses `BlogPosting` type; otherwise `Article`
 * @returns Article schema JSON‑LD object
 */
export const generateArticleSchema = (
  data: ArticleData,
  isBlogPost: boolean = true
): ArticleSchema => {
  const type = isBlogPost ? 'BlogPosting' : 'Article';

  const schema: ArticleSchema = {
    '@context': 'https://schema.org',
    '@type': type,
    headline: data.headline,
    url: data.url,
    image: data.imageUrl,
    datePublished: data.datePublished,
    dateModified: data.dateModified || data.datePublished,
    author: {
      '@type': 'Person',
      name: data.authorName,
      ...(data.authorUrl && { url: data.authorUrl }),
    },
    publisher: {
      '@type': 'Organization',
      name: SEO_COMMON.name,
      logo: {
        '@type': 'ImageObject',
        url: SEO_COMMON.logo,
      },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': data.url,
    },
  };

  // Conditionally add optional fields
  if (data.description) {
    schema.description = data.description;
  }

  if (data.articleBody) {
    schema.articleBody = data.articleBody;
  }

  if (data.section) {
    schema.articleSection = data.section;
  }

  return schema;
};