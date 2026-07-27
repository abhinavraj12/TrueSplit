'use client';

import { useEffect, useState, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAuth } from '@/features/auth';
import { getExpense, handleParticipantAction, settleExpense, cancelExpense, requestPayment, approvePayment, rejectPayment } from '@/features/expenses/services/expense-api';
import { ApiError } from '@/shared/lib/api';
import { toast } from '@/shared/_components/molecules/Toast/ToastProvider';
import { Skeleton } from '@/shared/_components/atoms/Skeleton';
import { PageHeader } from '@/shared/_components/molecules/PageHeader';
import { NotFoundContent } from '@/shared/_components/molecules/NotFoundContent/NotFoundContent';
import { ExpenseDetailHeader } from './parts/ExpenseDetailHeader';
import { DistributionCard } from './parts/DistributionCard';
import { ParticipantsList } from './parts/ParticipantsList';
import { ReceiptsGrid } from './parts/ReceiptsGrid';
import { ActionsBar } from './parts/ActionsBar';
import type { ExpenseResponse } from '@/features/expenses';
import styles from './page.module.css';

export default function ExpenseDetailPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params.slug as string;
  const { user } = useAuth();

  const [expense, setExpense] = useState<ExpenseResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [notFound, setNotFound] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  const fetchExpense = useCallback(async () => {
    setLoading(true);
    setError(null);
    setNotFound(false);
    try {
      const data = await getExpense(slug);
      setExpense(data);
    } catch (err) {
      const isNotFound =
        err instanceof ApiError && (err.status === 404 || err.code === 'NOT_FOUND');
      if (isNotFound) {
        setNotFound(true);
      } else {
        setError('Failed to load expense details.');
        setExpense(null);
      }
    } finally {
      setLoading(false);
    }
  }, [slug]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchExpense();
  }, [fetchExpense]);

  const handleAction = async (action: 'ACCEPT' | 'REJECT' | 'SETTLE' | 'CANCEL') => {
    if (!expense) return;
    setActionLoading(true);
    try {
      if (action === 'ACCEPT' || action === 'REJECT') {
        await handleParticipantAction(expense.id, action);
        toast.success(`Expense ${action.toLowerCase()}ed successfully.`);
      } else if (action === 'SETTLE') {
        await settleExpense(expense.id);
        toast.success('Expense marked as settled.');
      } else if (action === 'CANCEL') {
        await cancelExpense(expense.id);
        toast.success('Expense cancelled.');
      }
      await fetchExpense();
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Action failed. Please try again.';
      toast.error(message);
    } finally {
      setActionLoading(false);
    }
  };

  const handleRequestPayment = async (userId: string) => {
    if (!expense) return;
    setActionLoading(true);
    try {
      await requestPayment(expense.id, userId);
      toast.success('Payment request sent. Waiting for payer approval.');
      await fetchExpense();
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to request payment. Please try again.';
      toast.error(message);
    } finally {
      setActionLoading(false);
    }
  };

  const handleApprovePayment = async (userId: string) => {
    if (!expense) return;
    setActionLoading(true);
    try {
      await approvePayment(expense.id, userId);
      toast.success('Payment approved successfully.');
      await fetchExpense();
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to approve payment. Please try again.';
      toast.error(message);
    } finally {
      setActionLoading(false);
    }
  };

  const handleRejectPayment = async (userId: string) => {
    if (!expense) return;
    setActionLoading(true);
    try {
      await rejectPayment(expense.id, userId);
      toast.success('Payment request rejected.');
      await fetchExpense();
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to reject payment. Please try again.';
      toast.error(message);
    } finally {
      setActionLoading(false);
    }
  };

  // Show not found page
  if (notFound) {
    return (
      <NotFoundContent
        title="Expense Not Found"
        description="This expense doesn't exist or has been removed."
        ctaText="← Back to Expenses"
        ctaHref="/expenses"
      />
    );
  }

  if (loading) {
    return (
      <div className={styles.page}>
        <div className={styles.container}>
          <PageHeader items={[{ label: 'Dashboard', href: '/dashboard' }, { label: 'Expenses', href: '/expenses' }, { label: 'Loading...' }]} />
          <div className={styles.loadingSkeleton}>
            <div className={styles.skeletonHeader}>
              <Skeleton variant="text" width="60%" height={32} />
              <Skeleton variant="text" width="20%" height={24} />
            </div>
            <div className={styles.grid}>
              <div className={styles.leftColumn}>
                <div className={styles.skeletonSection}>
                  <Skeleton variant="text" width="30%" height={20} />
                  <Skeleton variant="text" width="100%" height={16} />
                  <Skeleton variant="text" width="100%" height={16} />
                  <Skeleton variant="text" width="80%" height={16} />
                </div>
                <div className={styles.skeletonSection}>
                  <Skeleton variant="text" width="30%" height={20} />
                  <Skeleton variant="text" width="100%" height={16} />
                  <Skeleton variant="text" width="100%" height={16} />
                </div>
                <div className={styles.skeletonSection}>
                  <Skeleton variant="text" width="30%" height={20} />
                  <div className={styles.skeletonReceiptGrid}>
                    <Skeleton variant="custom" width={100} height={100} />
                    <Skeleton variant="custom" width={100} height={100} />
                    <Skeleton variant="custom" width={100} height={100} />
                  </div>
                </div>
              </div>
              <div className={styles.rightColumn}>
                <div className={styles.skeletonSection}>
                  <Skeleton variant="text" width="30%" height={20} />
                  <Skeleton variant="custom" width="100%" height={180} />
                  <Skeleton variant="text" width="100%" height={16} />
                  <Skeleton variant="text" width="80%" height={16} />
                </div>
                <div className={styles.skeletonSection}>
                  <Skeleton variant="text" width="30%" height={20} />
                  <Skeleton variant="text" width="100%" height={40} />
                  <Skeleton variant="text" width="100%" height={40} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !expense) {
    return (
      <div className={styles.errorState}>
        <h2>Unable to load expense</h2>
        <p>{error || 'Expense not found.'}</p>
        <button onClick={() => router.push('/expenses')} className={styles.backButton}>
          ← Back to expenses
        </button>
      </div>
    );
  }

  const breadcrumbItems = [
    { label: 'Dashboard', href: '/dashboard' },
    { label: 'Expenses', href: '/expenses' },
    { label: expense.title },
  ];

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <PageHeader items={breadcrumbItems} />

        <ExpenseDetailHeader expense={expense} currentUserId={user?.id || ''} />

        <div className={styles.grid}>
          <div className={styles.leftColumn}>
            <ParticipantsList
              expense={expense}
              currentUserId={user?.id || ''}
              onRequestPayment={handleRequestPayment}
              onApprovePayment={handleApprovePayment}
              onRejectPayment={handleRejectPayment}
              isLoading={actionLoading}
            />
            {expense.description && (
              <div className={styles.descriptionSection}>
                <h3 className={styles.sectionTitle}>Description</h3>
                <p className={styles.descriptionText}>{expense.description}</p>
              </div>
            )}
            <ReceiptsGrid images={expense.images || []} />
          </div>
          <div className={styles.rightColumn}>
            <DistributionCard expense={expense} currentUserId={user?.id || ''} />
            <ActionsBar
              expense={expense}
              currentUserId={user?.id || ''}
              onAction={handleAction}
              onApprovePayment={handleApprovePayment}
              onRejectPayment={handleRejectPayment}
              isLoading={actionLoading}
            />
          </div>
        </div>
      </div>
    </div>
  );
}