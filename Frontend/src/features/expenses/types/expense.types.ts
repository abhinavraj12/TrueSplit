/**
 * Expense feature – TypeScript type definitions.
 * All types are aligned with the backend DTOs (CreateExpenseRequest, UploadSignatureRequest, etc.)
 * to ensure type safety across the frontend.
 */

// ============================================================================
// Core Expense Types
// ============================================================================

/**
 * Split type – matches backend validation pattern
 */
export type SplitType = 'EQUAL' | 'MANUAL';

/**
 * ISO 4217 currency code (major currencies)
 */
export type CurrencyCode = 'USD' | 'EUR' | 'GBP' | 'INR' | 'JPY' | 'CAD' | 'AUD' | 'CHF' | 'CNY' | 'BRL' | 'KRW' | 'SGD';

/**
 * Expense status – matches backend Expense.status
 */
export type ExpenseStatus = 'PENDING' | 'ACTIVE' | 'SETTLED' | 'CANCELLED';

// ============================================================================
// DTOs for API Requests
// ============================================================================

/**
 * Manual split entry – each participant's share
 * Matches backend ManualSplitEntry
 */
export interface ManualSplitEntry {
  userId: string;
  amount: number;
}

/**
 * Image DTO – sent from frontend to backend when creating an expense
 * Matches backend ImageDto
 */
export interface ImageDto {
  url: string;
  originalName?: string;
  size?: number;
}

/**
 * Request body for POST /api/v1/expenses
 * Matches backend CreateExpenseRequest
 */
export interface CreateExpenseRequest {
  title: string;
  description?: string;
  totalAmount: number;
  currency?: string;
  splitType: SplitType;
  paidBy: string;
  participants: string[];
  expenseDate: string;      // ISO date string (YYYY-MM-DD)
  expenseTime?: string;     // ISO time string (HH:mm:ss)
  timezone?: string;        // IANA timezone (e.g., 'Asia/Kolkata')
  manualSplits?: ManualSplitEntry[];
  groupId?: string;
  images?: ImageDto[];
}

/**
 * Request body for POST /api/v1/upload/signature
 * Matches backend UploadSignatureRequest
 */
export interface UploadSignatureRequest {
  filename: string;
  size: number;
  folder?: string;
}

/**
 * Response from POST /api/v1/upload/signature
 * Matches backend UploadSignatureResponse
 */
export interface UploadSignatureResponse {
  cloudName: string;
  apiKey: string;
  timestamp: number;
  signature: string;
  publicId: string;
  folder: string;
  uploadUrl: string;
}

// ============================================================================
// API Response Types (from backend)
// ============================================================================

/**
 * Generic API response wrapper – matches backend ApiResponse
 */
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  error?: {
    code: string;
    message: string;
  };
  metadata?: {
    timestamp: string;
    apiVersion: string;
  };
}

/**
 * Expense response – matches backend ExpenseResponse
 * Used for GET /api/v1/expenses/{identifier}
 */
export interface ExpenseResponse {
  id: string;
  title: string;
  titleSlug: string;
  description?: string;
  totalAmount: string;
  currency: string;
  splitType: SplitType;
  paidBy: PaidByInfo;
  createdBy?: CreatedByInfo;
  participants: ParticipantInfo[];
  manualSplits?: ManualSplitInfo[];
  expenseDateTime: string;
  timezone: string;
  status: ExpenseStatus;
  participantSettlement?: ParticipantSettlementInfo[];
  images?: ImageInfo[];
  createdAt: string;
  updatedAt: string;
}

export interface PaidByInfo {
  id: string;
  name: string;
  email: string;
}

export interface CreatedByInfo {
  id: string;
  name: string;
  email: string;
}

export interface ParticipantInfo {
  id: string;
  name: string;
  email: string;
  avatar?: string;
}

export interface ManualSplitInfo {
  userId: string;
  amount: string;
}

export interface ParticipantSettlementInfo {
  userId: string;
  settled: boolean;
  settledAt?: string;
}

export interface ImageInfo {
  url: string;
  thumbnailUrl?: string;
  originalName?: string;
  size?: number;
  uploadedAt?: string;
}

/**
 * Recent expense response – matches backend RecentExpenseResponse
 * Used for GET /api/v1/expenses/recent
 */
export interface RecentExpenseResponse {
  id: string;
  title: string;
  participants: ParticipantSummary[];
  time: string;
  pendingAmount: string;
  currency: string;
}

export interface ParticipantSummary {
  id: string;
  name: string;
  avatar?: string;
}

// ============================================================================
// Participant Action
// ============================================================================

/**
 * Request body for PATCH /api/v1/expenses/{expenseId}/participants
 * Matches backend ParticipantActionDto
 */
export interface ParticipantActionRequest {
  action: 'ACCEPT' | 'REJECT';
}

// ============================================================================
// Helper Types for UI State
// ============================================================================

/**
 * UI state for the create expense form
 * Extended to support pending files, upload progress, and upload status.
 */
export interface ExpenseFormState {
  title: string;
  description: string;
  totalAmount: number | null;
  currency: string;
  splitType: SplitType;
  paidBy: string;
  participants: ParticipantInfo[];
  expenseDate: Date | null;
  expenseTime: string;
  timezone: string;
  manualSplits: Record<string, number>;
  groupId: string | null;
  images: ImageDto[];
  /** Pending files waiting to be uploaded (deferred upload) */
  pendingFiles: File[];
  /** Upload progress per filename (0-100) */
  uploadProgress: Record<string, number>;
  /** Whether an upload is currently in progress */
  isUploading: boolean;
}

/**
 * Upload state for receipt upload
 * (Kept for backward compatibility but no longer used for the new flow)
 */
export interface UploadState {
  file: File | null;
  previewUrl: string | null;
  isUploading: boolean;
  progress: number;
  uploadedUrl: string | null;
  error: string | null;
}

// ============================================================================
// New Types for Receipt Grid & File Upload
// ============================================================================

/**
 * Represents a single receipt item in the grid.
 * Contains the file object and its current upload progress.
 */
export interface ReceiptGridItem {
  /** The file object (will be uploaded later) */
  file: File;
  /** Unique identifier for the item (derived from file name + size) */
  id: string;
  /** Upload progress percentage (0-100) */
  progress: number;
  /** Whether the file is currently being uploaded */
  isUploading: boolean;
  /** Whether the upload has completed successfully */
  isComplete: boolean;
  /** Error message if upload failed, null otherwise */
  error: string | null;
}

/**
 * Configuration for concurrent uploads.
 */
export interface UploadConfig {
  /** Maximum number of files to upload concurrently */
  concurrencyLimit: number;
  /** Maximum file size in bytes (1MB) */
  maxFileSizeBytes: number;
  /** Allowed MIME types (same as backend) */
  allowedMimeTypes: string[];
}