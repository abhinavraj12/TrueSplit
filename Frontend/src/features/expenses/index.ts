/**
 * Expense feature – barrel export.
 * All public APIs are re‑exported from here.
 */

// ============================================================================
// Types
// ============================================================================

export type {
  SplitType,
  CurrencyCode,
  ExpenseStatus,
  ManualSplitEntry,
  ImageDto,
  CreateExpenseRequest,
  UploadSignatureRequest,
  UploadSignatureResponse,
  ExpenseResponse,
  PaidByInfo,
  CreatedByInfo,
  ParticipantInfo,
  ManualSplitInfo,
  ParticipantSettlementInfo,
  ImageInfo,
  RecentExpenseResponse,
  ParticipantSummary,
  ParticipantActionRequest,
  ExpenseFormState,
  UploadState,
} from './types/expense.types';

// ============================================================================
// Constants
// ============================================================================

export {
  MAX_FILE_SIZE_BYTES,
  MAX_FILE_SIZE_MB,
  ALLOWED_MIME_TYPES,
  ALLOWED_EXTENSIONS,
  ALLOWED_FILE_TYPES_DISPLAY,
  MIN_TITLE_LENGTH,
  MAX_TITLE_LENGTH,
  MAX_DESCRIPTION_LENGTH,
  MAX_PARTICIPANTS,
  MIN_PARTICIPANTS,
  CURRENCY_DECIMAL_PLACES,
  DEFAULT_CURRENCY,
  DEFAULT_TIMEZONE,
  DEFAULT_SPLIT_TYPE,
  DEFAULT_TIME_FORMAT,
  DEFAULT_DATE_FORMAT,
  DEFAULT_DATE_TIME_FORMAT,
  SPLIT_TYPE_OPTIONS,
  EXPENSE_API_ENDPOINTS,
  UPLOAD_API_ENDPOINTS,
  CLOUDINARY_UPLOAD_URL_TEMPLATE,
  RECEIPT_UPLOAD_FOLDER,
  EXPENSE_ERROR_MESSAGES,
  EXPENSE_SUCCESS_MESSAGES,
} from './constants/expense.constants';

// ============================================================================
// Utilities
// ============================================================================

export {
  getCurrencySymbol,
  formatCurrency,
  parseCurrency,
  formatPercent,
  calculateEqualSplits,
  validateManualSplits,
  isFullyAllocated,
  validateTitle,
  validateAmount,
  validateParticipants,
  validatePaidBy,
  validateDate,
  isFileSizeValid,
  isFileTypeAllowed,
  getFileExtension,
  formatFileSize,
  generateSlug,
  getInitials,
  isCurrentUser,
  isFormValid,
  toISODateString,
  toISOTimeString,
  getUserTimezone,
  formatDateDisplay,
} from './utils/expense-utils';

// ============================================================================
// Services
// ============================================================================

export {
  createExpense,
  getRecentExpenses,
  getExpense,
  handleParticipantAction,
  settleExpense,
  cancelExpense,
} from './services/expense-api';

export { getUploadSignature } from './services/upload-api';

// ============================================================================
// Hooks
// ============================================================================

export { useUpload } from './hooks/useUpload';
export { useCreateExpense } from './hooks/useCreateExpense';