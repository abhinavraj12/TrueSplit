'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { api } from '@/shared/lib/api';
import { getCurrencySymbol } from '@/features/expenses';

interface ParticipantSummary {
  id: string;
  name: string;
  avatar?: string;
}

interface RecentExpense {
  id: string;
  title: string;
  titleSlug?: string;
  participants: ParticipantSummary[];
  time: string;
  pendingAmount: string;
  currency: string;
}

export default function ExpensesPage() {
  const [expenses, setExpenses] = useState<RecentExpense[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchExpenses = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await api.get<RecentExpense[]>('/expenses/recent');
        setExpenses(data);
      } catch (err) {
        setError('Failed to load expenses.');
        setExpenses([]);
      } finally {
        setLoading(false);
      }
    };
    fetchExpenses();
  }, []);

  if (loading) {
    return <div style={{ padding: '2rem', textAlign: 'center' }}>Loading expenses...</div>;
  }

  if (error) {
    return <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--color-error-text)' }}>{error}</div>;
  }

  if (expenses.length === 0) {
    return (
      <div style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto' }}>
        <h1>Expenses</h1>
        <p style={{ color: 'var(--color-text-muted)', textAlign: 'center', padding: '2rem 0' }}>
          No expenses yet. Create your first expense!
        </p>
        <div style={{ textAlign: 'center' }}>
          <Link href="/expenses/create" style={{ color: 'var(--color-text-link)' }}>
            Create Expense →
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <h1>Recent Expenses</h1>
        <Link href="/expenses/create" style={{ color: 'var(--color-text-link)' }}>
          Create Expense →
        </Link>
      </div>

      <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
        {expenses.map((expense) => {
          const amount = parseFloat(expense.pendingAmount);
          const currencySymbol = getCurrencySymbol(expense.currency || 'INR');
          const formattedAmount = `${currencySymbol} ${amount.toFixed(2)}`;
          const date = new Date(expense.time);
          const formattedDate = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

          // Use titleSlug if available, otherwise fallback to id
          const detailPath = expense.titleSlug ? `/expenses/${expense.titleSlug}` : `/expenses/${expense.id}`;

          return (
            <li
              key={expense.id}
              style={{
                padding: '1rem',
                marginBottom: '0.75rem',
                border: '1px solid var(--color-border)',
                borderRadius: 'var(--radius-md)',
                backgroundColor: 'var(--color-bg-surface)',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <div style={{ flex: 1 }}>
                <Link
                  href={detailPath}
                  style={{
                    fontWeight: '500',
                    color: 'var(--color-text-primary)',
                    textDecoration: 'none',
                    fontSize: '1.1rem',
                  }}
                >
                  {expense.title}
                </Link>
                <div style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)', marginTop: '0.25rem' }}>
                  {expense.participants.map(p => p.name).join(' • ')} &middot; {formattedDate}
                </div>
              </div>
              <div style={{ fontWeight: '600', color: 'var(--color-text-primary)' }}>
                {formattedAmount}
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}