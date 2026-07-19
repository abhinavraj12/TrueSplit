/**
 * Expense feature – useCreateExpense hook.
 * Manages the expense creation form state, validation, file uploads, and submission.
 */

import { useReducer, useCallback, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createExpense } from '../services/expense-api';
import { getUploadSignature } from '../services/upload-api';
import { toast } from '@/shared/_components/molecules/Toast/ToastProvider';
import {
  DEFAULT_CURRENCY,
  DEFAULT_TIMEZONE,
  DEFAULT_SPLIT_TYPE,
  EXPENSE_ERROR_MESSAGES,
  EXPENSE_SUCCESS_MESSAGES,
  MAX_FILE_SIZE_BYTES,
  ALLOWED_MIME_TYPES,
} from '../constants/expense.constants';
import {
  validateTitle,
  validateAmount,
  validateParticipants,
  validatePaidBy,
  validateDate,
  validateManualSplits,
  isFormValid as checkFormValidity,
  toISODateString,
  toISOTimeString,
  getUserTimezone,
  calculateEqualSplits,
} from '../utils/expense-utils';
import type {
  ExpenseFormState,
  CreateExpenseRequest,
  ImageDto,
  ParticipantInfo,
  SplitType,
} from '../types/expense.types';

/**
 * Action types for the form reducer
 */
type FormAction =
  | { type: 'SET_TITLE'; payload: string }
  | { type: 'SET_DESCRIPTION'; payload: string }
  | { type: 'SET_AMOUNT'; payload: number | null }
  | { type: 'SET_CURRENCY'; payload: string }
  | { type: 'SET_SPLIT_TYPE'; payload: SplitType }
  | { type: 'SET_PAID_BY'; payload: string }
  | { type: 'SET_PARTICIPANTS'; payload: ParticipantInfo[] }
  | { type: 'SET_EXPENSE_DATE'; payload: Date | null }
  | { type: 'SET_EXPENSE_TIME'; payload: string }
  | { type: 'SET_TIMEZONE'; payload: string }
  | { type: 'SET_MANUAL_SPLITS'; payload: Record<string, number> }
  | { type: 'SET_GROUP_ID'; payload: string | null }
  | { type: 'SET_IMAGES'; payload: ImageDto[] }
  | { type: 'ADD_IMAGE'; payload: ImageDto }
  | { type: 'REMOVE_IMAGE'; payload: number }
  | { type: 'ADD_FILES'; payload: File[] }
  | { type: 'REMOVE_FILE'; payload: string }
  | { type: 'CLEAR_FILES' }
  | { type: 'SET_UPLOAD_PROGRESS'; payload: { filename: string; progress: number } }
  | { type: 'SET_UPLOADING'; payload: boolean }
  | { type: 'RESET_FORM' }
  | { type: 'RESTORE_STATE'; payload: Partial<ExpenseFormState> };

/**
 * Default form state
 */
const defaultState: ExpenseFormState = {
  title: '',
  description: '',
  totalAmount: null,
  currency: DEFAULT_CURRENCY,
  splitType: DEFAULT_SPLIT_TYPE,
  paidBy: '',
  participants: [],
  expenseDate: new Date(),
  expenseTime: '',
  timezone: getUserTimezone(),
  manualSplits: {},
  groupId: null,
  images: [],
  pendingFiles: [],
  uploadProgress: {},
  isUploading: false,
};

/**
 * Form reducer for predictable state updates
 */
function formReducer(state: ExpenseFormState, action: FormAction): ExpenseFormState {
  switch (action.type) {
    case 'SET_TITLE':
      return { ...state, title: action.payload };
    case 'SET_DESCRIPTION':
      return { ...state, description: action.payload };
    case 'SET_AMOUNT':
      return { ...state, totalAmount: action.payload };
    case 'SET_CURRENCY':
      return { ...state, currency: action.payload };
    case 'SET_SPLIT_TYPE':
      return { ...state, splitType: action.payload };
    case 'SET_PAID_BY':
      return { ...state, paidBy: action.payload };
    case 'SET_PARTICIPANTS':
      return { ...state, participants: action.payload };
    case 'SET_EXPENSE_DATE':
      return { ...state, expenseDate: action.payload };
    case 'SET_EXPENSE_TIME':
      return { ...state, expenseTime: action.payload };
    case 'SET_TIMEZONE':
      return { ...state, timezone: action.payload };
    case 'SET_MANUAL_SPLITS':
      return { ...state, manualSplits: action.payload };
    case 'SET_GROUP_ID':
      return { ...state, groupId: action.payload };
    case 'SET_IMAGES':
      return { ...state, images: action.payload };
    case 'ADD_IMAGE':
      return { ...state, images: [...state.images, action.payload] };
    case 'REMOVE_IMAGE':
      return { ...state, images: state.images.filter((_, i) => i !== action.payload) };
    case 'ADD_FILES': {
      const existingNames = new Set(state.pendingFiles.map(f => f.name.toLowerCase()));
      const newFiles = action.payload.filter(f => !existingNames.has(f.name.toLowerCase()));
      return { ...state, pendingFiles: [...state.pendingFiles, ...newFiles] };
    }
    case 'REMOVE_FILE': {
      const filename = action.payload;
      return {
        ...state,
        pendingFiles: state.pendingFiles.filter(f => f.name !== filename),
        uploadProgress: Object.keys(state.uploadProgress).reduce((acc, key) => {
          if (key !== filename) acc[key] = state.uploadProgress[key];
          return acc;
        }, {} as Record<string, number>),
      };
    }
    case 'CLEAR_FILES':
      return { ...state, pendingFiles: [], uploadProgress: {} };
    case 'SET_UPLOAD_PROGRESS': {
      const { filename, progress } = action.payload;
      const newProgress = { ...state.uploadProgress, [filename]: progress };
      return { ...state, uploadProgress: newProgress };
    }
    case 'SET_UPLOADING':
      return { ...state, isUploading: action.payload };
    case 'RESTORE_STATE':
      return { ...defaultState, ...action.payload };
    case 'RESET_FORM':
      return defaultState;
    default:
      return state;
  }
}

/**
 * Configuration for concurrent uploads
 */
const UPLOAD_CONFIG = {
  concurrencyLimit: 5,
  maxFileSizeBytes: MAX_FILE_SIZE_BYTES,
  allowedMimeTypes: ALLOWED_MIME_TYPES,
};

/**
 * Create a Set of allowed MIME types for efficient membership testing.
 * Explicitly typed as Set<string> to accept any string for has() checks,
 * while still containing only the allowed values at runtime.
 */
const allowedMimeSet: Set<string> = new Set(ALLOWED_MIME_TYPES);

/**
 * Check if a file is allowed based on size and MIME type
 */
function isFileAllowed(file: File): { valid: boolean; error?: string } {
  if (file.size > UPLOAD_CONFIG.maxFileSizeBytes) {
    return { valid: false, error: `File "${file.name}" exceeds the 1MB limit.` };
  }
  if (!allowedMimeSet.has(file.type)) {
    return { valid: false, error: `File "${file.name}" is not an allowed file type.` };
  }
  return { valid: true };
}

/**
 * Return type for the useCreateExpense hook
 */
interface UseCreateExpenseReturn {
  state: ExpenseFormState;
  setTitle: (title: string) => void;
  setDescription: (description: string) => void;
  setAmount: (amount: number | null) => void;
  setCurrency: (currency: string) => void;
  setSplitType: (splitType: SplitType) => void;
  setPaidBy: (paidBy: string) => void;
  setParticipants: (participants: ParticipantInfo[]) => void;
  setExpenseDate: (date: Date | null) => void;
  setExpenseTime: (time: string) => void;
  setTimezone: (timezone: string) => void;
  setManualSplits: (splits: Record<string, number>) => void;
  setGroupId: (groupId: string | null) => void;
  setImages: (images: ImageDto[]) => void;
  addImage: (image: ImageDto) => void;
  removeImage: (index: number) => void;
  addFiles: (files: File[]) => { added: File[]; skipped: File[] };
  removeFile: (filename: string) => void;
  clearFiles: () => void;
  getPendingFiles: () => File[];
  resetForm: () => void;
  restoreState: (state: Partial<ExpenseFormState>) => void;
  isFormValid: boolean;
  titleError: string | null;
  amountError: string | null;
  participantsError: string | null;
  paidByError: string | null;
  dateError: string | null;
  manualSplitError: string | null;
  equalShare: number;
  manualSum: number;
  remainingAmount: number;
  isFullyAllocated: boolean;
  isSubmitting: boolean;
  submitError: string | null;
  submitForm: () => Promise<void>;
}

/**
 * Hook for creating an expense with full form management
 */
export function useCreateExpense(): UseCreateExpenseReturn {
  const router = useRouter();
  const [state, dispatch] = useReducer(formReducer, defaultState);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  // ============================================================================
  // Individual field setters
  // ============================================================================

  const setTitle = useCallback((title: string) => {
    dispatch({ type: 'SET_TITLE', payload: title });
  }, []);

  const setDescription = useCallback((description: string) => {
    dispatch({ type: 'SET_DESCRIPTION', payload: description });
  }, []);

  const setAmount = useCallback((amount: number | null) => {
    dispatch({ type: 'SET_AMOUNT', payload: amount });
  }, []);

  const setCurrency = useCallback((currency: string) => {
    dispatch({ type: 'SET_CURRENCY', payload: currency });
  }, []);

  const setSplitType = useCallback((splitType: SplitType) => {
    dispatch({ type: 'SET_SPLIT_TYPE', payload: splitType });
  }, []);

  const setPaidBy = useCallback((paidBy: string) => {
    dispatch({ type: 'SET_PAID_BY', payload: paidBy });
  }, []);

  const setParticipants = useCallback((participants: ParticipantInfo[]) => {
    dispatch({ type: 'SET_PARTICIPANTS', payload: participants });
  }, []);

  const setExpenseDate = useCallback((date: Date | null) => {
    dispatch({ type: 'SET_EXPENSE_DATE', payload: date });
  }, []);

  const setExpenseTime = useCallback((time: string) => {
    dispatch({ type: 'SET_EXPENSE_TIME', payload: time });
  }, []);

  const setTimezone = useCallback((timezone: string) => {
    dispatch({ type: 'SET_TIMEZONE', payload: timezone });
  }, []);

  const setManualSplits = useCallback((splits: Record<string, number>) => {
    dispatch({ type: 'SET_MANUAL_SPLITS', payload: splits });
  }, []);

  const setGroupId = useCallback((groupId: string | null) => {
    dispatch({ type: 'SET_GROUP_ID', payload: groupId });
  }, []);

  const setImages = useCallback((images: ImageDto[]) => {
    dispatch({ type: 'SET_IMAGES', payload: images });
  }, []);

  const addImage = useCallback((image: ImageDto) => {
    dispatch({ type: 'ADD_IMAGE', payload: image });
  }, []);

  const removeImage = useCallback((index: number) => {
    dispatch({ type: 'REMOVE_IMAGE', payload: index });
  }, []);

  // ============================================================================
  // File management functions
  // ============================================================================

  /**
   * Add multiple files to the pending list with duplicate detection.
   * Returns the files that were added and those that were skipped.
   */
  const addFiles = useCallback((files: File[]): { added: File[]; skipped: File[] } => {
    const validFiles: File[] = [];
    const skippedFiles: File[] = [];
    const existingNames = new Set(state.pendingFiles.map(f => f.name.toLowerCase()));

    for (const file of files) {
      const validation = isFileAllowed(file);
      if (!validation.valid) {
        toast.error(validation.error || `File "${file.name}" is invalid.`);
        skippedFiles.push(file);
        continue;
      }
      if (existingNames.has(file.name.toLowerCase())) {
        toast.warning(`File "${file.name}" has already been added. Please use a different file.`);
        skippedFiles.push(file);
        continue;
      }
      validFiles.push(file);
      existingNames.add(file.name.toLowerCase());
    }

    if (validFiles.length > 0) {
      dispatch({ type: 'ADD_FILES', payload: validFiles });
    }

    return { added: validFiles, skipped: skippedFiles };
  }, [state.pendingFiles]);

  const removeFile = useCallback((filename: string) => {
    dispatch({ type: 'REMOVE_FILE', payload: filename });
  }, []);

  const clearFiles = useCallback(() => {
    dispatch({ type: 'CLEAR_FILES' });
  }, []);

  const getPendingFiles = useCallback(() => {
    return state.pendingFiles;
  }, [state.pendingFiles]);

  const resetForm = useCallback(() => {
    dispatch({ type: 'RESET_FORM' });
    setSubmitError(null);
  }, []);

  const restoreState = useCallback((restoredState: Partial<ExpenseFormState>) => {
    dispatch({ type: 'RESTORE_STATE', payload: restoredState });
  }, []);

  // ============================================================================
  // Validation
  // ============================================================================

  const titleError = useMemo(() => validateTitle(state.title), [state.title]);
  const amountError = useMemo(() => validateAmount(state.totalAmount), [state.totalAmount]);
  const participantsError = useMemo(() => validateParticipants(state.participants.map(p => p.id)), [state.participants]);
  const paidByError = useMemo(() => validatePaidBy(state.paidBy, state.participants.map(p => p.id)), [state.paidBy, state.participants]);
  const dateError = useMemo(() => validateDate(state.expenseDate), [state.expenseDate]);

  const manualSplitError = useMemo(() => {
    if (state.splitType !== 'MANUAL') return null;
    if (state.totalAmount === null || state.totalAmount <= 0) return null;
    const { valid, remaining } = validateManualSplits(state.manualSplits, state.totalAmount);
    if (!valid) {
      if (remaining > 0.01) {
        return `Remaining: ₹${remaining.toFixed(2)} to allocate`;
      }
      if (remaining < -0.01) {
        return `Over‑allocated by ₹${(-remaining).toFixed(2)}`;
      }
      return 'Manual splits must add up to the total amount.';
    }
    return null;
  }, [state.splitType, state.totalAmount, state.manualSplits]);

  const isFormValid = useMemo(() => {
    return checkFormValidity(
      state.title,
      state.totalAmount,
      state.participants.map(p => p.id),
      state.paidBy,
      state.expenseDate,
      state.splitType,
      state.manualSplits,
      state.totalAmount || 0
    );
  }, [state.title, state.totalAmount, state.participants, state.paidBy, state.expenseDate, state.splitType, state.manualSplits]);

  // ============================================================================
  // Split calculations
  // ============================================================================

  const participantIds = useMemo(() => state.participants.map(p => p.id), [state.participants]);

  const equalShare = useMemo(() => {
    if (state.totalAmount === null || state.totalAmount <= 0 || participantIds.length === 0) {
      return 0;
    }
    return state.totalAmount / participantIds.length;
  }, [state.totalAmount, participantIds]);

  const manualSum = useMemo(() => {
    return Object.values(state.manualSplits).reduce((acc, val) => acc + (val || 0), 0);
  }, [state.manualSplits]);

  const remainingAmount = useMemo(() => {
    if (state.totalAmount === null) return 0;
    return state.totalAmount - manualSum;
  }, [state.totalAmount, manualSum]);

  const isFullyAllocated = useMemo(() => {
    if (state.totalAmount === null) return false;
    return Math.abs(remainingAmount) < 0.01;
  }, [remainingAmount, state.totalAmount]);

  // ============================================================================
  // Upload function for pending files
  // ============================================================================

  /**
   * Upload all pending files to Cloudinary with concurrency control.
   * Returns an array of ImageDto objects for the uploaded files.
   */
  const uploadPendingFiles = useCallback(async (): Promise<ImageDto[]> => {
    const pendingFiles = state.pendingFiles;
    if (pendingFiles.length === 0) {
      return [];
    }

    dispatch({ type: 'SET_UPLOADING', payload: true });

    try {
      const results: ImageDto[] = [];
      const errors: string[] = [];

      // Process files with concurrency limit
      const concurrencyLimit = UPLOAD_CONFIG.concurrencyLimit;
      const batches: File[][] = [];

      for (let i = 0; i < pendingFiles.length; i += concurrencyLimit) {
        batches.push(pendingFiles.slice(i, i + concurrencyLimit));
      }

      for (const batch of batches) {
        const batchPromises = batch.map(async (file) => {
          try {
            // Get upload signature from backend
            const signatureResponse = await getUploadSignature({
              filename: file.name,
              size: file.size,
              folder: 'receipts',
            });

            // Upload to Cloudinary
            const formData = new FormData();
            formData.append('file', file);
            formData.append('api_key', signatureResponse.apiKey);
            formData.append('timestamp', String(signatureResponse.timestamp));
            formData.append('signature', signatureResponse.signature);
            formData.append('public_id', signatureResponse.publicId);
            formData.append('folder', signatureResponse.folder);

            const uploadUrl = signatureResponse.uploadUrl;

            // Use XMLHttpRequest for progress tracking
            return new Promise<ImageDto>((resolve, reject) => {
              const xhr = new XMLHttpRequest();

              xhr.upload.addEventListener('progress', (event) => {
                if (event.lengthComputable) {
                  const percent = Math.round((event.loaded / event.total) * 100);
                  dispatch({
                    type: 'SET_UPLOAD_PROGRESS',
                    payload: { filename: file.name, progress: percent },
                  });
                }
              });

              xhr.addEventListener('load', () => {
                if (xhr.status >= 200 && xhr.status < 300) {
                  try {
                    const response = JSON.parse(xhr.responseText);
                    const secureUrl = response.secure_url;
                    if (!secureUrl) {
                      reject(new Error('Cloudinary did not return a secure URL.'));
                      return;
                    }
                    dispatch({
                      type: 'SET_UPLOAD_PROGRESS',
                      payload: { filename: file.name, progress: 100 },
                    });
                    resolve({
                      url: secureUrl,
                      originalName: file.name,
                      size: file.size,
                    });
                  } catch {
                    reject(new Error('Failed to parse Cloudinary response.'));
                  }
                } else {
                  reject(new Error(`Upload failed with status ${xhr.status}`));
                }
              });

              xhr.addEventListener('error', () => {
                reject(new Error('Network error during upload.'));
              });

              xhr.open('POST', uploadUrl);
              xhr.send(formData);
            });
          } catch (error) {
            const message = error instanceof Error ? error.message : 'Upload failed';
            errors.push(`${file.name}: ${message}`);
            dispatch({
              type: 'SET_UPLOAD_PROGRESS',
              payload: { filename: file.name, progress: 0 },
            });
            throw error;
          }
        });

        const batchResults = await Promise.allSettled(batchPromises);

        for (const result of batchResults) {
          if (result.status === 'fulfilled') {
            results.push(result.value);
          }
        }
      }

      if (errors.length > 0 && results.length === 0) {
        throw new Error(`All uploads failed. ${errors.join('; ')}`);
      }

      return results;
    } finally {
      dispatch({ type: 'SET_UPLOADING', payload: false });
    }
  }, [state.pendingFiles]);

  // ============================================================================
  // Form submission
  // ============================================================================

  const submitForm = useCallback(async () => {
    // Validate before submission
    if (!isFormValid) {
      setSubmitError('Please fix the highlighted errors before submitting.');
      return;
    }

    setIsSubmitting(true);
    setSubmitError(null);

    try {
      // 1. Upload all pending files first (deferred upload)
      let uploadedImages: ImageDto[] = [];
      try {
        uploadedImages = await uploadPendingFiles();
      } catch (uploadError) {
        const message = uploadError instanceof Error ? uploadError.message : 'Failed to upload receipts.';
        setSubmitError(message);
        toast.error(message);
        setIsSubmitting(false);
        return;
      }

      // 2. Combine existing images with newly uploaded ones
      const allImages = [...state.images, ...uploadedImages];

      // 3. Build the request payload
      const request: CreateExpenseRequest = {
        title: state.title.trim(),
        description: state.description.trim() || undefined,
        totalAmount: state.totalAmount!,
        currency: state.currency,
        splitType: state.splitType,
        paidBy: state.paidBy,
        participants: state.participants.map(p => p.id),
        expenseDate: toISODateString(state.expenseDate!),
        expenseTime: state.expenseTime || toISOTimeString(new Date()),
        timezone: state.timezone || DEFAULT_TIMEZONE,
        groupId: state.groupId || undefined,
        images: allImages.length > 0 ? allImages : undefined,
      };

      // Add manual splits if MANUAL
      if (state.splitType === 'MANUAL') {
        request.manualSplits = Object.entries(state.manualSplits)
          .filter(([_, amount]) => amount > 0)
          .map(([userId, amount]) => ({
            userId,
            amount: Math.round(amount * 100) / 100,
          }));
        // Ensure all participants have an entry (even zero)
        const allParticipantIds = state.participants.map(p => p.id);
        const existingUserIds = new Set(request.manualSplits.map(s => s.userId));
        for (const userId of allParticipantIds) {
          if (!existingUserIds.has(userId)) {
            request.manualSplits.push({ userId, amount: 0 });
          }
        }
      }

      // 4. Submit to backend
      const expenseResponse = await createExpense(request);

      // 5. Show success toast
      toast.success(EXPENSE_SUCCESS_MESSAGES.CREATED);

      // 6. Clear pending files and reset form state
      dispatch({ type: 'CLEAR_FILES' });
      resetForm();

      // 7. Navigate to the expense detail page
      router.push(`/expenses/${expenseResponse.id}`);

    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : EXPENSE_ERROR_MESSAGES.CREATE_FAILED;
      setSubmitError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  }, [
    isFormValid,
    state,
    router,
    resetForm,
    uploadPendingFiles,
  ]);

  // ============================================================================
  // Return
  // ============================================================================

  return {
    state,
    setTitle,
    setDescription,
    setAmount,
    setCurrency,
    setSplitType,
    setPaidBy,
    setParticipants,
    setExpenseDate,
    setExpenseTime,
    setTimezone,
    setManualSplits,
    setGroupId,
    setImages,
    addImage,
    removeImage,
    addFiles,
    removeFile,
    clearFiles,
    getPendingFiles,
    resetForm,
    restoreState,
    isFormValid,
    titleError,
    amountError,
    participantsError,
    paidByError,
    dateError,
    manualSplitError,
    equalShare,
    manualSum,
    remainingAmount,
    isFullyAllocated,
    isSubmitting,
    submitError,
    submitForm,
  };
}