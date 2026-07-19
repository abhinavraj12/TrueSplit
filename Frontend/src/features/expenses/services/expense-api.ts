/**
 * Expense feature – API service.
 * All expense-related backend communication is centralized here.
 */

import { api } from '@/shared/lib/api';
import type {
  CreateExpenseRequest,
  ExpenseResponse,
  RecentExpenseResponse,
  ParticipantActionRequest,
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
  return api.post<ExpenseResponse>(BASE_PATH, request);
}

/**
 * Get recent expenses for the current user
 * GET /api/v1/expenses/recent
 */
export function getRecentExpenses(): Promise<RecentExpenseResponse[]> {
  return api.get<RecentExpenseResponse[]>(`${BASE_PATH}/recent`);
}

/**
 * Get a single expense by ID or slug
 * GET /api/v1/expenses/{identifier}
 */
export function getExpense(identifier: string): Promise<ExpenseResponse> {
  return api.get<ExpenseResponse>(`${BASE_PATH}/${identifier}`);
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