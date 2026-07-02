/**
 * FAQPage JSON‑LD schema.
 * Generates structured data for Frequently Asked Questions.
 */

export interface FAQItem {
  /** The question text */
  question: string;
  /** The answer text (can include simple HTML) */
  answer: string;
}

/**
 * Generates the FAQPage schema for a list of Q&A pairs.
 * @param items - Array of FAQ items (question & answer)
 * @returns FAQPage JSON‑LD object
 */
export const generateFAQSchema = (items: FAQItem[]) => {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.answer,
      },
    })),
  };
};