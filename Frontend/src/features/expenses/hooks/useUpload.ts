/**
 * Expense feature – useUpload hook.
 * Manages file selection, validation, Cloudinary upload, and state.
 */

import { useState, useCallback, useRef } from 'react';
import { getUploadSignature } from '../services/upload-api';
import {
  MAX_FILE_SIZE_BYTES,
  ALLOWED_MIME_TYPES,
  EXPENSE_ERROR_MESSAGES,
} from '../constants/expense.constants';
import type { UploadState } from '../types/expense.types';

/**
 * Options for the useUpload hook
 */
interface UseUploadOptions {
  /** Callback when upload succeeds */
  onSuccess?: (url: string) => void;
  /** Callback when upload fails */
  onError?: (error: string) => void;
  /** Callback when upload progress updates */
  onProgress?: (progress: number) => void;
}

/**
 * Return type of the useUpload hook
 */
interface UseUploadReturn extends UploadState {
  /** Handle file selection from input change event */
  handleFileSelect: (file: File) => Promise<void>;
  /** Clear the current file and reset state */
  clear: () => void;
  /** Manually set the uploaded URL (e.g., for testing or re-upload) */
  setUploadedUrl: (url: string) => void;
}

/**
 * Hook for handling file uploads to Cloudinary via signed signatures.
 */
export function useUpload(options: UseUploadOptions = {}): UseUploadReturn {
  const { onSuccess, onError, onProgress } = options;

  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [uploadedUrl, setUploadedUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const abortControllerRef = useRef<AbortController | null>(null);

  /**
   * Clear all state and reset the uploader
   */
  const clear = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }
    setFile(null);
    setPreviewUrl(null);
    setIsUploading(false);
    setProgress(0);
    setUploadedUrl(null);
    setError(null);
  }, [previewUrl]);

  /**
   * Internal method to set the uploaded URL
   */
  const setUploadedUrlInternal = useCallback((url: string) => {
    setUploadedUrl(url);
  }, []);

  /**
   * Validate file before upload
   */
  const validateFile = useCallback((file: File): string | null => {
    if (file.size > MAX_FILE_SIZE_BYTES) {
      return EXPENSE_ERROR_MESSAGES.FILE_TOO_LARGE;
    }

    if (!ALLOWED_MIME_TYPES.includes(file.type as (typeof ALLOWED_MIME_TYPES)[number])) {
      return EXPENSE_ERROR_MESSAGES.FILE_TYPE_NOT_ALLOWED;
    }

    return null;
  }, []);

  /**
   * Upload the file to Cloudinary using a signed signature from the backend
   */
  const uploadFile = useCallback(
    async (fileToUpload: File): Promise<string> => {
      setIsUploading(true);
      setProgress(0);
      setError(null);

      try {
        const signatureResponse = await getUploadSignature({
          filename: fileToUpload.name,
          size: fileToUpload.size,
          folder: 'receipts',
        });

        const formData = new FormData();
        formData.append('file', fileToUpload);
        formData.append('api_key', signatureResponse.apiKey);
        formData.append('timestamp', String(signatureResponse.timestamp));
        formData.append('signature', signatureResponse.signature);
        formData.append('public_id', signatureResponse.publicId);
        formData.append('folder', signatureResponse.folder);

        const abortController = new AbortController();
        abortControllerRef.current = abortController;

        const uploadUrl = signatureResponse.uploadUrl;

        return new Promise<string>((resolve, reject) => {
          const xhr = new XMLHttpRequest();

          xhr.upload.addEventListener('progress', (event) => {
            if (event.lengthComputable) {
              const percent = Math.round((event.loaded / event.total) * 100);
              setProgress(percent);
              if (onProgress) {
                onProgress(percent);
              }
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
                resolve(secureUrl);
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

          xhr.addEventListener('abort', () => {
            reject(new Error('Upload cancelled.'));
          });

          xhr.open('POST', uploadUrl);
          xhr.send(formData);
        });
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : EXPENSE_ERROR_MESSAGES.UPLOAD_FAILED;
        setError(errorMessage);
        if (onError) {
          onError(errorMessage);
        }
        throw err;
      } finally {
        setIsUploading(false);
        if (abortControllerRef.current) {
          abortControllerRef.current = null;
        }
      }
    },
    [onError, onProgress]
  );

  /**
   * Handle file selection from input
   */
  const handleFileSelect = useCallback(
    async (selectedFile: File) => {
      clear();

      const validationError = validateFile(selectedFile);
      if (validationError) {
        setError(validationError);
        if (onError) {
          onError(validationError);
        }
        return;
      }

      const objectUrl = URL.createObjectURL(selectedFile);
      setPreviewUrl(objectUrl);
      setFile(selectedFile);

      try {
        const url = await uploadFile(selectedFile);
        setUploadedUrl(url);
        setProgress(100);
        if (onSuccess) {
          onSuccess(url);
        }
      } catch {
        URL.revokeObjectURL(objectUrl);
        setPreviewUrl(null);
        setFile(null);
      }
    },
    [clear, validateFile, uploadFile, onError, onSuccess]
  );

  return {
    file,
    previewUrl,
    isUploading,
    progress,
    uploadedUrl,
    error,
    handleFileSelect,
    clear,
    setUploadedUrl: setUploadedUrlInternal,
  };
}