/**
 * SEO helper – generates JSON‑LD script tags as strings.
 * This utility returns a JSON‑LD script tag as a string that can be injected
 * using dangerouslySetInnerHTML in a Next.js Head component.
 */

/**
 * Generates a JSON‑LD script tag as a string.
 * @param schema - The structured data schema object
 * @returns A string containing the <script> tag with JSON‑LD
 */
export const generateJsonLd = (schema: Record<string, unknown>): string => {
  const jsonString = JSON.stringify(schema);
  return `<script type="application/ld+json">${jsonString}</script>`;
};

/**
 * Generates just the JSON string without the script wrapper.
 * Useful if you need to embed the JSON directly.
 */
export const generateJsonString = (schema: Record<string, unknown>): string => {
  return JSON.stringify(schema);
};

/**
 * Checks if the schema is valid (non-empty object).
 */
export const isValidSchema = (schema: Record<string, unknown>): boolean => {
  return typeof schema === 'object' && schema !== null && Object.keys(schema).length > 0;
};