/**
 * Expense feature – business constants.
 * All values are aligned with backend validation rules.
 */

// ============================================================================
// File Upload Constants (matching backend validation)
// ============================================================================

/**
 * Maximum file size for receipt uploads (5 MB)
 * Matches backend: @Max(value = 5 * 1024 * 1024)
 */
export const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024;

/**
 * Maximum file size in megabytes (for display purposes)
 */
export const MAX_FILE_SIZE_MB = 5;

/**
 * Allowed MIME types for receipt uploads
 * Matches backend: ALLOWED_EXTENSIONS = {"jpg", "jpeg", "png", "pdf"}
 */
export const ALLOWED_MIME_TYPES = [
  'image/jpeg',
  'image/jpg',
  'image/png',
  'application/pdf',
] as const;

/**
 * Allowed file extensions (for frontend validation and display)
 */
export const ALLOWED_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.pdf'] as const;

/**
 * Human-readable list of allowed file types (for UI messages)
 */
export const ALLOWED_FILE_TYPES_DISPLAY = 'JPG, PNG, or PDF';

// ============================================================================
// Expense Validation Constants (matching backend validation)
// ============================================================================

/**
 * Minimum title length (characters)
 * Matches backend: @Size(min = 3)
 */
export const MIN_TITLE_LENGTH = 3;

/**
 * Maximum title length (characters)
 * Matches backend: @Size(max = 100)
 */
export const MAX_TITLE_LENGTH = 100;

/**
 * Maximum description length (characters)
 * Matches backend: @Size(max = 500)
 */
export const MAX_DESCRIPTION_LENGTH = 500;

/**
 * Maximum number of participants allowed
 * Matches backend: @Size(max = 50)
 */
export const MAX_PARTICIPANTS = 50;

/**
 * Minimum number of participants required
 * Matches backend: at least 2
 */
export const MIN_PARTICIPANTS = 2;

/**
 * Decimal precision for monetary amounts (2 decimal places)
 * Matches backend: BigDecimal(2, RoundingMode.HALF_UP)
 */
export const CURRENCY_DECIMAL_PLACES = 2;

// ============================================================================
// Default Values
// ============================================================================

/**
 * Default currency code (INR)
 * Matches backend: currency default = "INR"
 */
export const DEFAULT_CURRENCY = 'INR';

/**
 * Default timezone (UTC)
 * Matches backend: fallback timezone = "UTC"
 */
export const DEFAULT_TIMEZONE = 'UTC';

/**
 * Default split type (EQUAL)
 */
export const DEFAULT_SPLIT_TYPE = 'EQUAL' as const;

/**
 * Default expense time format (for display)
 */
export const DEFAULT_TIME_FORMAT = 'h:mm a';

/**
 * Default expense date format (for display)
 */
export const DEFAULT_DATE_FORMAT = 'MMM d, yyyy';

/**
 * Default date-time format (for display)
 */
export const DEFAULT_DATE_TIME_FORMAT = 'MMM d, yyyy, h:mm a';

// ============================================================================
// Split Type Options (for UI)
// ============================================================================

/**
 * Available split type options for the toggle group
 */
export const SPLIT_TYPE_OPTIONS = [
  { value: 'EQUAL', label: 'Equal' },
  { value: 'MANUAL', label: 'Manual' },
] as const;

// ============================================================================
// API Endpoints (expense-related)
// ============================================================================

/**
 * Expense API endpoint paths (relative to API_BASE_URL)
 */
export const EXPENSE_API_ENDPOINTS = {
  /** Create a new expense */
  CREATE: '/expenses',
  /** Get recent expenses */
  RECENT: '/expenses/recent',
  /** Get expense by ID or slug */
  GET_BY_ID: (identifier: string) => `/expenses/${identifier}`,
  /** Handle participant accept/reject */
  PARTICIPANT_ACTION: (expenseId: string) => `/expenses/${expenseId}/participants`,
  /** Mark expense as settled */
  SETTLE: (expenseId: string) => `/expenses/${expenseId}/settle`,
  /** Cancel expense */
  CANCEL: (expenseId: string) => `/expenses/${expenseId}/cancel`,
} as const;

/**
 * Upload API endpoint paths
 */
export const UPLOAD_API_ENDPOINTS = {
  /** Get upload signature */
  SIGNATURE: '/upload/signature',
} as const;

// ============================================================================
// Cloudinary Upload Constants
// ============================================================================

/**
 * Cloudinary upload endpoint template (used with cloud name)
 */
export const CLOUDINARY_UPLOAD_URL_TEMPLATE =
  'https://api.cloudinary.com/v1_1/{cloud_name}/upload';

/**
 * Folder structure for receipt uploads
 */
export const RECEIPT_UPLOAD_FOLDER = 'receipts';

// ============================================================================
// Error Messages (user-friendly)
// ============================================================================

/**
 * User-friendly error messages for expense creation
 */
export const EXPENSE_ERROR_MESSAGES = {
  TITLE_REQUIRED: 'Please enter a title.',
  TITLE_TOO_SHORT: `Title must be at least ${MIN_TITLE_LENGTH} characters.`,
  TITLE_TOO_LONG: `Title cannot exceed ${MAX_TITLE_LENGTH} characters.`,
  AMOUNT_REQUIRED: 'Please enter an amount.',
  AMOUNT_POSITIVE: 'Amount must be greater than zero.',
  AMOUNT_INVALID: 'Please enter a valid amount.',
  PARTICIPANTS_MIN: `Please add at least ${MIN_PARTICIPANTS} participants.`,
  PARTICIPANTS_MAX: `Cannot have more than ${MAX_PARTICIPANTS} participants.`,
  PAID_BY_REQUIRED: 'Please select who paid.',
  DATE_REQUIRED: 'Please select a date.',
  MANUAL_SPLIT_SUM_MISMATCH: 'Manual split amounts must add up to the total amount.',
  MANUAL_SPLIT_EMPTY: 'Please add split amounts for all participants.',
  FILE_TOO_LARGE: `File size exceeds the ${MAX_FILE_SIZE_MB} MB limit.`,
  FILE_TYPE_NOT_ALLOWED: `File type not allowed. Allowed types: ${ALLOWED_FILE_TYPES_DISPLAY}.`,
  GROUP_PERMISSION_DENIED: 'You do not have permission to create expenses for this group.',
  PARTICIPANT_NOT_IN_GROUP: 'All participants must be members of the selected group.',
  DUPLICATE_PARTICIPANT: 'This participant has already been added.',
  UPLOAD_FAILED: 'Failed to upload receipt. Please try again.',
  CREATE_FAILED: 'Failed to create expense. Please try again.',
} as const;

// ============================================================================
// Success Messages
// ============================================================================

export const EXPENSE_SUCCESS_MESSAGES = {
  CREATED: 'Expense created successfully!',
  UPLOADED: 'Receipt uploaded successfully!',
} as const;