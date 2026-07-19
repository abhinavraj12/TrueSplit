/**
 * Upload feature – API service.
 * Handles communication with the backend upload endpoints.
 */

import { api } from '@/shared/lib/api';
import type {
  UploadSignatureRequest,
  UploadSignatureResponse,
} from '../types/expense.types';

/**
 * Base upload API endpoint
 */
const BASE_PATH = '/upload';

/**
 * Get a signed upload URL for Cloudinary
 * POST /api/v1/upload/signature
 *
 * This returns a signature and credentials that allow the frontend
 * to upload a file directly to Cloudinary.
 */
export function getUploadSignature(
  request: UploadSignatureRequest
): Promise<UploadSignatureResponse> {
  return api.post<UploadSignatureResponse>(`${BASE_PATH}/signature`, request);
}