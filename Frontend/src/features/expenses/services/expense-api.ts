/**
 * Expense feature – API service.
 * All expense-related backend communication is centralized here.
 */

import { api } from '@/shared/lib/api';
import { API_ENDPOINTS } from '@/shared/config';
import type {
  CreateExpenseRequest,
  ExpenseResponse,
  RecentExpenseResponse,
  ParticipantActionRequest,
  GetExpensesParams,
  PaginatedResponse,
} from '../types/expense.types';

/**
 * Base expense API endpoint
 */
const BASE_PATH = '/expenses';

/**
 * Create a new expense
 * POST /api/v1/expenses
 */
export function createExpense(request: CreateExpenseRequest): Promise<ExpenseResponse> {
  return api.post<ExpenseResponse>(API_ENDPOINTS.EXPENSES.CREATE, request);
}

/**
 * Get recent expenses for the current user
 * GET /api/v1/expenses/recent
 */
export function getRecentExpenses(): Promise<RecentExpenseResponse[]> {
  return api.get<RecentExpenseResponse[]>(API_ENDPOINTS.EXPENSES.RECENT);
}

/**
 * Get a single expense by ID or slug
 * GET /api/v1/expenses/{identifier}
 */
export function getExpense(identifier: string): Promise<ExpenseResponse> {
  return api.get<ExpenseResponse>(API_ENDPOINTS.EXPENSES.GET_BY_ID_OR_SLUG(identifier));
}

/**
 * Get a paginated, filterable list of expenses
 * GET /api/v1/expenses?page=0&size=20&status=PENDING&search=dinner
 */
export function getExpenses(params: GetExpensesParams): Promise<PaginatedResponse<ExpenseResponse>> {
  const searchParams = new URLSearchParams();
  searchParams.set('page', String(params.page));
  searchParams.set('size', String(params.size));
  if (params.status) {
    searchParams.set('status', params.status);
  }
  if (params.search && params.search.trim()) {
    searchParams.set('search', params.search.trim());
  }
  const url = `${API_ENDPOINTS.EXPENSES.LIST}?${searchParams.toString()}`;
  return api.get<PaginatedResponse<ExpenseResponse>>(url);
}

/**
 * Accept or reject an expense as a participant
 * PATCH /api/v1/expenses/{expenseId}/participants
 */
export function handleParticipantAction(
  expenseId: string,
  action: 'ACCEPT' | 'REJECT'
): Promise<void> {
  const request: ParticipantActionRequest = { action };
  return api.patch<void>(`${BASE_PATH}/${expenseId}/participants`, request);
}

/**
 * Mark an expense as settled (payer only)
 * POST /api/v1/expenses/{expenseId}/settle
 */
export function settleExpense(expenseId: string): Promise<void> {
  return api.post<void>(`${BASE_PATH}/${expenseId}/settle`);
}

/**
 * Cancel an expense (payer only)
 * PATCH /api/v1/expenses/{expenseId}/cancel
 */
export function cancelExpense(expenseId: string): Promise<void> {
  return api.patch<void>(`${BASE_PATH}/${expenseId}/cancel`);
}

// ============================================================================
// New API Functions for "Mark as Paid" Feature
// ============================================================================

/**
 * Request payment approval from the payer (participant only)
 * POST /api/v1/expenses/{expenseId}/participants/{userId}/request-payment
 */
export function requestPayment(expenseId: string, userId: string): Promise<void> {
  return api.post<void>(`${BASE_PATH}/${expenseId}/participants/${userId}/request-payment`);
}

/**
 * Approve a participant's payment request (payer only)
 * POST /api/v1/expenses/{expenseId}/participants/{userId}/approve-payment
 */
export function approvePayment(expenseId: string, userId: string): Promise<void> {
  return api.post<void>(`${BASE_PATH}/${expenseId}/participants/${userId}/approve-payment`);
}

/**
 * Reject a participant's payment request (payer only)
 * POST /api/v1/expenses/{expenseId}/participants/{userId}/reject-payment
 */
export function rejectPayment(expenseId: string, userId: string): Promise<void> {
  return api.post<void>(`${BASE_PATH}/${expenseId}/participants/${userId}/reject-payment`);
}