/**
 * Feature flags for progressive rollouts and environment-specific features.
 * All flags are derived from environment variables (NEXT_PUBLIC_*) or fallback to sensible defaults.
 */

/** Feature flags – enable/disable features across the app */
export const FEATURES = {
  /**
   * Recurring expenses (scheduled monthly/weekly expenses).
   * Currently behind a flag until fully implemented.
   */
  RECURRING_EXPENSES: process.env.NEXT_PUBLIC_FEATURE_RECURRING_EXPENSES === 'true',

  /**
   * Expense export (CSV, spreadsheet).
   * Will be enabled when the export feature is ready.
   */
  EXPORT_EXPENSES: process.env.NEXT_PUBLIC_FEATURE_EXPORT_EXPENSES === 'true',

  /**
   * Receipt scanning / OCR.
   * Pro feature – can be toggled per environment.
   */
  RECEIPT_SCANNING: process.env.NEXT_PUBLIC_FEATURE_RECEIPT_SCANNING === 'true',

  /**
   * Advanced analytics (spending charts, trends).
   */
  ANALYTICS: process.env.NEXT_PUBLIC_FEATURE_ANALYTICS === 'true',

  /**
   * Multiple currencies support – always on (but we keep a flag for testing).
   */
  MULTI_CURRENCY: process.env.NEXT_PUBLIC_FEATURE_MULTI_CURRENCY !== 'false', // default true
} as const;

/**
 * Helper to check if a feature is enabled.
 * Useful for conditional rendering and logic.
 */
export const isFeatureEnabled = (feature: keyof typeof FEATURES): boolean => {
  return FEATURES[feature];
};