'use client';

import { useEffect, useRef, useCallback, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/features/auth';
import { usePaginatedExpenses } from '@/features/expenses/hooks/usePaginatedExpenses';
import { groupExpensesByDate } from '@/features/expenses/utils/expense-utils';
import { handleParticipantAction, settleExpense } from '@/features/expenses/services/expense-api';
import { toast } from '@/shared/_components/molecules/Toast/ToastProvider';
import { Spinner } from '@/shared/_components/atoms/Spinner';
import { PageHeader } from '@/shared/_components/molecules/PageHeader';
import { Tooltip } from '@/shared/_components/atoms/Tooltip';
import { SearchBar } from './parts/SearchBar';
import { FilterBar } from './parts/FilterBar';
import { DateGroup } from './parts/DateGroup';
import { ExpenseRowSkeleton } from './parts/ExpenseRowSkeleton';
import styles from './page.module.css';

export function ExpensesPageClient() {
  const router = useRouter();
  const { user, isLoading: authLoading } = useAuth();
  const [isSticky, setIsSticky] = useState(false);
  const stickyRef = useRef<HTMLDivElement>(null);

  const {
    expenses,
    loading,
    error,
    hasNextPage,
    status,
    searchTerm,
    setStatus,
    setSearch,
    loadMore,
    updateExpenseOptimistically,
    refresh,
  } = usePaginatedExpenses();

  const observerRef = useRef<HTMLDivElement | null>(null);

  // Group expenses by date
  const groupedExpenses = useMemo(() => {
    return groupExpensesByDate(expenses);
  }, [expenses]);

  // Intersection Observer for infinite scroll
  useEffect(() => {
    if (loading || !hasNextPage) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !loading && hasNextPage) {
          loadMore();
        }
      },
      { threshold: 0.1, rootMargin: '100px' }
    );

    const currentRef = observerRef.current;
    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, [loading, hasNextPage, loadMore]);

  // Handle scroll for sticky shadow
  useEffect(() => {
    const handleScroll = () => {
      if (stickyRef.current) {
        const rect = stickyRef.current.getBoundingClientRect();
        setIsSticky(rect.top <= 0);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Handle inline actions
  const handleAction = useCallback(
    async (expenseId: string, action: 'ACCEPT' | 'REJECT' | 'SETTLE') => {
      try {
        if (action === 'ACCEPT') {
          await handleParticipantAction(expenseId, 'ACCEPT');
          updateExpenseOptimistically(expenseId, { status: 'ACTIVE' });
          toast.success('Expense accepted successfully.');
        } else if (action === 'SETTLE') {
          await settleExpense(expenseId);
          updateExpenseOptimistically(expenseId, { status: 'SETTLED' });
          toast.success('Expense marked as settled.');
        }
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Action failed. Please try again.';
        toast.error(message);
        refresh();
      }
    },
    [updateExpenseOptimistically, refresh]
  );

  // If not authenticated and auth is done, redirect
  if (!authLoading && !user) {
    router.push('/login');
    return null;
  }

  // Show skeleton while auth is loading OR while expenses are loading with empty list
  const showSkeleton = authLoading || (loading && expenses.length === 0);

  // Error state (only if not loading and error exists)
  if (!authLoading && error && expenses.length === 0) {
    return (
      <div className={styles.errorState}>
        <h2>Unable to load expenses</h2>
        <p>{error}</p>
        <button onClick={refresh} className={styles.retryButton}>
          Try Again
        </button>
      </div>
    );
  }

  // Determine empty state type
  const hasActiveFilters = !!(searchTerm || status);
  const isSearchEmpty = hasActiveFilters && expenses.length === 0;

  // Build breadcrumb items
  const getBreadcrumbLabel = () => {
    let label = 'Expenses';
    if (searchTerm) {
      label = `Expenses: “${searchTerm}”`;
    } else if (status) {
      const statusMap: Record<string, string> = {
        PENDING: 'Pending',
        ACTIVE: 'Active',
        SETTLED: 'Settled',
        CANCELLED: 'Cancelled',
      };
      label = `${statusMap[status] || status} Expenses`;
    }
    return label;
  };

  const breadcrumbItems = [
    { label: 'Dashboard', href: '/dashboard' },
    { label: getBreadcrumbLabel() },
  ];

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        {/* Page Header with Breadcrumb + Theme Switcher */}
        <PageHeader items={breadcrumbItems} />

        {/* Sticky Container for Search + Filters */}
        <div
          ref={stickyRef}
          className={`${styles.stickyContainer} ${isSticky ? styles.stickyScrolled : ''}`}
        >
          <div className={styles.header}>
            <div className={styles.headerLeft}>
              <h1 className={styles.title}>Expenses</h1>
              <span className={styles.count}>
                {expenses.length > 0 ? `Showing ${expenses.length}` : ''}
              </span>
            </div>
            <div className={styles.headerRight}>
              <SearchBar value={searchTerm} onChange={setSearch} />
              <Tooltip content="✨ Start a new adventure – split your first expense!" placement="bottom">
                <Link href="/expenses/create" className={styles.createButton}>
                  + Create
                </Link>
              </Tooltip>
            </div>
          </div>

          <FilterBar activeStatus={status} onChange={setStatus} />
        </div>

        {/* Skeleton loading – shown on auth load, initial load, search, filter changes */}
        {showSkeleton ? (
          <ExpenseRowSkeleton count={5} />
        ) : expenses.length === 0 ? (
          /* Empty state – differentiated by whether search/filters are active */
          <div className={styles.emptyState}>
            <p className={styles.emptyTitle}>
              {isSearchEmpty ? 'Hmm, nothing matches your search' : 'Nothing here yet'}
            </p>
            <p className={styles.emptySubtitle}>
              {isSearchEmpty ? (
                <>
                  We couldn&apos;t find any expenses matching <strong>{`"${searchTerm || 'your filters'}"`}</strong>.
                  <br />
                  That&apos;s okay — every great expense starts with a single bill.
                  <br />
                  <span className={styles.emptyEmoji}>✨</span> Ready to create one?
                </>
              ) : (
                'Create your first expense and start splitting with friends.'
              )}
            </p>
            <button
              onClick={() => router.push('/expenses/create')}
              className={styles.createButton}
            >
              {isSearchEmpty ? 'Create New Expense →' : 'Create Expense →'}
            </button>
            {isSearchEmpty && (
              <button
                onClick={() => {
                  setSearch('');
                  setStatus(null);
                }}
                className={styles.clearFiltersButton}
              >
                Clear filters
              </button>
            )}
          </div>
        ) : (
          /* Expense list */
          <>
            <div className={styles.list}>
              {groupedExpenses.map((group) => (
                <DateGroup
                  key={group.dateKey}
                  label={group.label}
                  expenses={group.expenses}
                  currentUserId={user!.id}
                  onAction={handleAction}
                />
              ))}
            </div>

            {/* Infinite scroll trigger */}
            <div ref={observerRef} className={styles.loadMoreTrigger}>
              {loading && <Spinner size="sm" color="primary" />}
              {!loading && hasNextPage && (
                <button onClick={loadMore} className={styles.loadMoreButton}>
                  Load more
                </button>
              )}
              {!loading && !hasNextPage && expenses.length > 0 && (
                <p className={styles.endMessage}>No more expenses</p>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default ExpensesPageClient;