'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import { api } from '@/shared/lib/api';
import { formatCurrency, getCurrencySymbol, settleExpense } from '@/features/expenses';
import { Button } from '@/shared/_components/atoms/Button';
import { useAuth } from '@/features/auth';
import { toast } from '@/shared/_components/molecules/Toast/ToastProvider';

interface ParticipantInfo {
  id: string;
  name: string;
  email: string;
  avatar?: string;
}

interface ManualSplitInfo {
  userId: string;
  amount: string;
}

interface ParticipantSettlementInfo {
  userId: string;
  settled: boolean;
  settledAt?: string;
}

interface ImageInfo {
  url: string;
  thumbnailUrl?: string;
  originalName?: string;
  size?: number;
  uploadedAt?: string;
}

interface ExpenseDetail {
  id: string;
  title: string;
  titleSlug: string;
  description?: string;
  totalAmount: string;
  currency: string;
  splitType: string;
  paidBy: { id: string; name: string; email: string };
  participants: ParticipantInfo[];
  manualSplits?: ManualSplitInfo[];
  expenseDateTime: string;
  status: string;
  participantSettlement?: ParticipantSettlementInfo[];
  images?: ImageInfo[];
  createdAt: string;
  updatedAt: string;
}

export default function ExpenseDetailPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params.slug as string;
  const { user } = useAuth();

  const [expense, setExpense] = useState<ExpenseDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [settling, setSettling] = useState(false);

  const fetchExpense = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await api.get<ExpenseDetail>(`/expenses/${slug}`);
      setExpense(data);
    } catch (err) {
      setError('Failed to load expense details.');
      setExpense(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExpense();
  }, [slug]);

  const goBack = () => {
    router.push('/expenses');
  };

  const handleSettleAll = async () => {
    if (!expense) return;
    setSettling(true);
    try {
      await settleExpense(expense.id);
      toast.success('Expense marked as settled.');
      await fetchExpense(); // refresh data
    } catch (err) {
      toast.error('Failed to settle expense. Please try again.');
    } finally {
      setSettling(false);
    }
  };

  if (loading) {
    return <div style={{ padding: '2rem', textAlign: 'center' }}>Loading expense details...</div>;
  }

  if (error || !expense) {
    return (
      <div style={{ padding: '2rem', textAlign: 'center' }}>
        <p style={{ color: 'var(--color-error-text)' }}>{error || 'Expense not found.'}</p>
        <Button variant="ghost" onClick={goBack} style={{ marginTop: '1rem' }}>
          ← Back to expenses
        </Button>
      </div>
    );
  }

  const totalAmount = parseFloat(expense.totalAmount);
  const currencySymbol = getCurrencySymbol(expense.currency || 'INR');
  const formattedTotal = `${currencySymbol} ${totalAmount.toFixed(2)}`;
  const expenseDate = new Date(expense.expenseDateTime);
  const formattedDate = expenseDate.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
  const formattedTime = expenseDate.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });

  const payerName = expense.paidBy?.name || 'Unknown';

  const shares: Record<string, number> = {};
  if (expense.manualSplits) {
    expense.manualSplits.forEach((split) => {
      shares[split.userId] = parseFloat(split.amount);
    });
  }

  // Check if current user is the payer
  const isPayer = user?.id === expense.paidBy?.id;
  const allSettled = expense.participantSettlement?.every((ps) => ps.settled) ?? false;

  return (
    <div style={{ padding: '2rem', maxWidth: '700px', margin: '0 auto' }}>
      <Button variant="ghost" onClick={goBack} style={{ marginBottom: '1rem' }}>
        ← Back to expenses
      </Button>

      <h1 style={{ marginBottom: '0.5rem' }}>{expense.title}</h1>
      {expense.description && (
        <p style={{ color: 'var(--color-text-secondary)', marginBottom: '1rem' }}>
          {expense.description}
        </p>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
        <div>
          <div style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)' }}>Amount</div>
          <div style={{ fontSize: '1.5rem', fontWeight: '600' }}>{formattedTotal}</div>
        </div>
        <div>
          <div style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)' }}>Status</div>
          <div style={{ textTransform: 'capitalize' }}>{expense.status.toLowerCase()}</div>
        </div>
        <div>
          <div style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)' }}>Date</div>
          <div>{formattedDate}</div>
        </div>
        <div>
          <div style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)' }}>Time</div>
          <div>{formattedTime}</div>
        </div>
        <div>
          <div style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)' }}>Paid by</div>
          <div>{payerName}</div>
        </div>
        <div>
          <div style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)' }}>Split</div>
          <div>{expense.splitType.toLowerCase()}</div>
        </div>
      </div>

      <hr style={{ border: 'none', borderTop: '1px solid var(--color-divider)', margin: '1.5rem 0' }} />

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <h3 style={{ margin: 0 }}>Participants</h3>
        {isPayer && !allSettled && expense.status !== 'SETTLED' && (
          <Button
            variant="success"
            size="sm"
            onClick={handleSettleAll}
            loading={settling}
            disabled={settling}
          >
            Mark as Settled
          </Button>
        )}
        {allSettled && (
          <span style={{ color: 'var(--color-success-text)', fontWeight: '500' }}>✓ All settled</span>
        )}
      </div>

      <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
        {expense.participants.map((participant) => {
          const share = shares[participant.id] || 0;
          const isPayerUser = participant.id === expense.paidBy?.id;
          const settled = expense.participantSettlement?.find(s => s.userId === participant.id)?.settled || false;

          return (
            <li
              key={participant.id}
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '0.75rem 0',
                borderBottom: '1px solid var(--color-divider)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                {participant.avatar ? (
                  <img
                    src={participant.avatar}
                    alt={participant.name}
                    style={{
                      width: '32px',
                      height: '32px',
                      borderRadius: '50%',
                      objectFit: 'cover',
                    }}
                  />
                ) : (
                  <div
                    style={{
                      width: '32px',
                      height: '32px',
                      borderRadius: '50%',
                      background: 'var(--color-avatar-bg)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '0.75rem',
                      fontWeight: 'bold',
                      color: 'var(--color-avatar-text)',
                    }}
                  >
                    {participant.name.charAt(0).toUpperCase()}
                  </div>
                )}
                <span>{participant.name}</span>
                {isPayerUser && (
                  <span style={{ marginLeft: '0.25rem', fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
                    (payer)
                  </span>
                )}
                <span
                  style={{
                    marginLeft: '0.5rem',
                    fontSize: '0.75rem',
                    fontWeight: '500',
                    color: settled ? 'var(--color-success-text)' : 'var(--color-error-text)',
                  }}
                >
                  {settled ? '✓ Paid' : 'Unpaid'}
                </span>
              </div>
              <div style={{ fontWeight: '500' }}>
                {currencySymbol} {share.toFixed(2)}
              </div>
            </li>
          );
        })}
      </ul>

      {/* Receipt Images Section */}
      {expense.images && expense.images.length > 0 && (
        <>
          <hr style={{ border: 'none', borderTop: '1px solid var(--color-divider)', margin: '1.5rem 0' }} />
          <h3 style={{ marginBottom: '1rem' }}>Receipts</h3>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))',
              gap: '1rem',
            }}
          >
            {expense.images.map((image, index) => (
              <div
                key={index}
                style={{
                  border: '1px solid var(--color-border)',
                  borderRadius: 'var(--radius-md)',
                  overflow: 'hidden',
                  cursor: 'pointer',
                  transition: 'transform 0.2s',
                }}
                onClick={() => window.open(image.url, '_blank', 'noopener,noreferrer')}
                onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.02)')}
                onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
              >
                <Image
                  src={image.url}
                  alt={image.originalName || `Receipt ${index + 1}`}
                  width={300}
                  height={200}
                  style={{
                    width: '100%',
                    height: 'auto',
                    objectFit: 'cover',
                    aspectRatio: '4/3',
                  }}
                  unoptimized
                />
                <div
                  style={{
                    padding: '0.5rem',
                    fontSize: '0.75rem',
                    color: 'var(--color-text-muted)',
                    textAlign: 'center',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                  }}
                >
                  {image.originalName || `Receipt ${index + 1}`}
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      <div style={{ marginTop: '2rem', fontSize: '0.875rem', color: 'var(--color-text-muted)' }}>
        Created: {new Date(expense.createdAt).toLocaleString()}
      </div>
    </div>
  );
}