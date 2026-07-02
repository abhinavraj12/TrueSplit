/**
 * API layer – central export point.
 * All API client exports are re‑exported from here.
 */

export {
  apiClient,
  api,
  ApiError,
  type ApiResponse,
  type ApiSuccessResponse,
  type ApiErrorResponse,
  type ApiRequestOptions,
} from './api-client';