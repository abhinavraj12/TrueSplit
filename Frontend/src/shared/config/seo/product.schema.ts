/**
 * Product JSON‑LD schema.
 * Generates structured data for pricing plans and products.
 */

import { SEO_COMMON } from './common';

export interface ProductOffer {
  /** The name of the plan/package */
  name: string;
  /** Description of the plan (optional) */
  description?: string;
  /** The price in the default currency (e.g., "9.99") */
  price: string;
  /** Currency code (e.g., "USD", "INR") – defaults to "INR" */
  currency?: string;
  /** Billing period (e.g., "month", "year") */
  billingPeriod?: string;
  /** List of features (optional) */
  features?: string[];
}

export interface ProductData {
  /** The product name (overall product, e.g., "TrueSplit Pro") */
  productName: string;
  /** The product description (overall) */
  productDescription?: string;
  /** The brand name (e.g., "TrueSplit") */
  brandName: string;
  /** Absolute URL to the product image (e.g., `/logo.png`) */
  imageUrl: string;
  /** The main product URL (e.g., `/pricing`) */
  productUrl: string;
  /** List of offers (plans) */
  offers: ProductOffer[];
}

/**
 * Generates the Product schema with Offers for the pricing page.
 * @param data - Product data
 * @returns Product schema JSON‑LD object
 */
export const generateProductSchema = (data: ProductData) => {
  // Build the offers array
  const offers = data.offers.map((offer) => {
    const offerObject: {
      '@type': 'Offer';
      name: string;
      price: string;
      priceCurrency: string;
      description?: string;
      availability: string;
      url: string;
    } = {
      '@type': 'Offer',
      name: offer.name,
      price: offer.price,
      priceCurrency: offer.currency || 'INR',
      availability: 'https://schema.org/InStock',
      url: data.productUrl,
    };

    if (offer.description) {
      offerObject.description = offer.description;
    }

    return offerObject;
  });

  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: data.productName,
    description: data.productDescription || SEO_COMMON.description,
    brand: {
      '@type': 'Brand',
      name: data.brandName,
    },
    image: data.imageUrl,
    url: data.productUrl,
    offers: offers,
  };
};