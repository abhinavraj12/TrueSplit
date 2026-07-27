/**
 * Expense feature – usePaginatedExpenses hook.
 * Manages paginated fetching, filtering, and optimistic updates for expense lists.
 */

import { useReducer, useCallback, useRef, useEffect, useMemo } from 'react';
import { getExpenses } from '../services/expense-api';
import type {
  ExpenseResponse,
  ExpenseStatus,
  GetExpensesParams,
  PaginatedResponse,
} from '../types/expense.types';

// ============================================================================
// State Types
// ============================================================================

interface PaginatedState {
  /** List of expenses on the current page */
  expenses: ExpenseResponse[];
  /** Whether the initial or subsequent load is in progress */
  loading: boolean;
  /** Error message, if any */
  error: string | null;
  /** Whether there is a next page available */
  hasNextPage: boolean;
  /** Current page number (0‑based) */
  currentPage: number;
  /** Total number of elements across all pages */
  totalElements: number;
  /** Total number of pages */
  totalPages: number;
  /** Current status filter (null means "All") */
  status: ExpenseStatus | null;
  /** Current search term (debounced) */
  searchTerm: string;
}

type Action =
  | { type: 'FETCH_START' }
  | { type: 'FETCH_SUCCESS'; payload: { response: PaginatedResponse<ExpenseResponse>; append: boolean; status: ExpenseStatus | null; searchTerm: string } }
  | { type: 'FETCH_ERROR'; payload: string }
  | { type: 'SET_STATUS'; payload: ExpenseStatus | null }
  | { type: 'SET_SEARCH'; payload: string }
  | { type: 'RESET_PAGE' }
  | { type: 'UPDATE_EXPENSE'; payload: { id: string; updates: Partial<ExpenseResponse> } }
  | { type: 'REFRESH' };

const initialState: PaginatedState = {
  expenses: [],
  loading: false,
  error: null,
  hasNextPage: false,
  currentPage: 0,
  totalElements: 0,
  totalPages: 0,
  status: null,
  searchTerm: '',
};

function paginatedReducer(state: PaginatedState, action: Action): PaginatedState {
  switch (action.type) {
    case 'FETCH_START':
      return { ...state, loading: true, error: null };

    case 'FETCH_SUCCESS': {
      const { response, append, status, searchTerm } = action.payload;
      const newExpenses = append ? [...state.expenses, ...response.content] : response.content;
      return {
        ...state,
        expenses: newExpenses,
        loading: false,
        error: null,
        hasNextPage: !response.last,
        currentPage: response.number,
        totalElements: response.totalElements,
        totalPages: response.totalPages,
        status,
        searchTerm,
      };
    }

    case 'FETCH_ERROR':
      return { ...state, loading: false, error: action.payload };

    case 'SET_STATUS':
      return { ...state, status: action.payload, currentPage: 0, expenses: [] };

    case 'SET_SEARCH':
      return { ...state, searchTerm: action.payload, currentPage: 0, expenses: [] };

    case 'RESET_PAGE':
      return { ...state, currentPage: 0, expenses: [] };

    case 'UPDATE_EXPENSE': {
      const { id, updates } = action.payload;
      const updatedExpenses = state.expenses.map((expense) =>
        expense.id === id ? { ...expense, ...updates } : expense
      );
      return { ...state, expenses: updatedExpenses };
    }

    case 'REFRESH':
      return { ...state, currentPage: 0, expenses: [] };

    default:
      return state;
  }
}

// ============================================================================
// Hook Return Type
// ============================================================================

interface UsePaginatedExpensesReturn {
  /** List of expenses for the current page */
  expenses: ExpenseResponse[];
  /** Whether data is currently loading */
  loading: boolean;
  /** Error message, if any */
  error: string | null;
  /** Whether there is a next page to load */
  hasNextPage: boolean;
  /** Current page number (0‑based) */
  currentPage: number;
  /** Total number of elements across all pages */
  totalElements: number;
  /** Total number of pages */
  totalPages: number;
  /** Current status filter (null = "All") */
  status: ExpenseStatus | null;
  /** Current search term */
  searchTerm: string;
  /** Load the next page (infinite scroll) */
  loadMore: () => void;
  /** Set the status filter (resets to page 0) */
  setStatus: (status: ExpenseStatus | null) => void;
  /** Set the search term (debounced, resets to page 0) */
  setSearch: (term: string) => void;
  /** Refresh the current page */
  refresh: () => void;
  /** Optimistically update a single expense in the list */
  updateExpenseOptimistically: (id: string, updates: Partial<ExpenseResponse>) => void;
  /** Reset all filters and reload from page 0 */
  resetFilters: () => void;
}

// ============================================================================
// Debounce Utility
// ============================================================================

function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useReducer(
    (_: T, val: T) => val,
    value
  );

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => clearTimeout(timer);
  }, [value, delay]);

  return debouncedValue;
}

// ============================================================================
// Hook Implementation
// ============================================================================

export function usePaginatedExpenses(): UsePaginatedExpensesReturn {
  const [state, dispatch] = useReducer(paginatedReducer, initialState);

  // Refs for cancellation and request tracking
  const abortControllerRef = useRef<AbortController | null>(null);
  const requestIdRef = useRef(0);
  const isMountedRef = useRef(true);

  // Debounced search term (300ms)
  const debouncedSearch = useDebounce(state.searchTerm, 300);

  // Core fetch function
  const fetchExpenses = useCallback(
    async (page: number, status: ExpenseStatus | null, search: string, append: boolean) => {
      // Cancel any in‑flight request
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }

      const abortController = new AbortController();
      abortControllerRef.current = abortController;
      const requestId = ++requestIdRef.current;

      dispatch({ type: 'FETCH_START' });

      try {
        const params: GetExpensesParams = {
          page,
          size: 20,
        };
        if (status) {
          params.status = status;
        }
        if (search && search.trim()) {
          params.search = search.trim();
        }

        const response = await getExpenses(params);

        // Ignore stale responses
        if (requestId !== requestIdRef.current || !isMountedRef.current) {
          return;
        }

        dispatch({
          type: 'FETCH_SUCCESS',
          payload: { response, append, status, searchTerm: search },
        });
      } catch (error) {
        // Ignore aborted errors
        if (error instanceof Error && error.name === 'AbortError') {
          return;
        }
        if (!isMountedRef.current) return;
        const message = error instanceof Error ? error.message : 'Failed to load expenses.';
        dispatch({ type: 'FETCH_ERROR', payload: message });
      } finally {
        if (abortControllerRef.current === abortController) {
          abortControllerRef.current = null;
        }
      }
    },
    []
  );

  // Load more (infinite scroll)
  const loadMore = useCallback(() => {
    if (state.loading || !state.hasNextPage) return;
    const nextPage = state.currentPage + 1;
    fetchExpenses(nextPage, state.status, debouncedSearch, true);
  }, [state.loading, state.hasNextPage, state.currentPage, state.status, debouncedSearch, fetchExpenses]);

  // Set status filter (resets to page 0)
  const setStatus = useCallback((status: ExpenseStatus | null) => {
    dispatch({ type: 'SET_STATUS', payload: status });
  }, []);

  // Set search term (debounced)
  const setSearch = useCallback((term: string) => {
    dispatch({ type: 'SET_SEARCH', payload: term });
  }, []);

  // Refresh current page
  const refresh = useCallback(() => {
    dispatch({ type: 'REFRESH' });
  }, []);

  // Reset all filters
  const resetFilters = useCallback(() => {
    dispatch({ type: 'SET_STATUS', payload: null });
    dispatch({ type: 'SET_SEARCH', payload: '' });
    dispatch({ type: 'REFRESH' });
  }, []);

  // Optimistic update
  const updateExpenseOptimistically = useCallback((id: string, updates: Partial<ExpenseResponse>) => {
    dispatch({ type: 'UPDATE_EXPENSE', payload: { id, updates } });
  }, []);

  // Effect: fetch when status, debounced search, or refresh changes
  useEffect(() => {
    isMountedRef.current = true;

    // Reset to page 0 when status or search changes
    // The reducer already reset currentPage to 0, but we need to fetch
    const page = 0;
    fetchExpenses(page, state.status, debouncedSearch, false);

    return () => {
      isMountedRef.current = false;
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [state.status, debouncedSearch, fetchExpenses]);

  // Effect: when refresh is triggered, re‑fetch current page
  useEffect(() => {
    // Only re‑fetch if we're not already at page 0 and not loading
    if (state.currentPage === 0 && state.expenses.length === 0 && !state.loading) {
      // Already fetched via the effect above
    }
  }, [state.currentPage, state.expenses.length, state.loading]);

  return {
    expenses: state.expenses,
    loading: state.loading,
    error: state.error,
    hasNextPage: state.hasNextPage,
    currentPage: state.currentPage,
    totalElements: state.totalElements,
    totalPages: state.totalPages,
    status: state.status,
    searchTerm: state.searchTerm,
    loadMore,
    setStatus,
    setSearch,
    refresh,
    updateExpenseOptimistically,
    resetFilters,
  };
}