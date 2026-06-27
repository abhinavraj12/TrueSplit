'use client';

import React, { useState, useMemo } from 'react';
import { FilterControls, FilterControl, FilterValue } from '@/shared/_components/molecules/FilterControls';
import { Typography } from '@/shared/_components/atoms/Typography';
import { Badge } from '@/shared/_components/atoms/Badge';
import { Avatar, AvatarGroup } from '@/shared/_components/atoms/Avatar';
import styles from './page.module.css';
import { ThemeSwitcher } from '@/shared/_components/molecules/ThemeSwitcher';

// ---------- Extended Dummy Data (15 expenses) ----------
const dummyExpenses = [
  {
    id: 1,
    description: 'Dinner at Italian',
    amount: 45.50,
    category: 'Food',
    date: new Date(2025, 5, 10),
    paid: true,
    status: 'settled',
    participants: [
      { name: 'Alice', src: 'https://i.pravatar.cc/150?img=1' },
      { name: 'Bob', src: 'https://i.pravatar.cc/150?img=2' },
      { name: 'Charlie', src: 'https://i.pravatar.cc/150?img=3' },
    ],
  },
  {
    id: 2,
    description: 'Uber ride',
    amount: 12.00,
    category: 'Transport',
    date: new Date(2025, 5, 12),
    paid: false,
    status: 'pending',
    participants: [
      { name: 'Alice', src: 'https://i.pravatar.cc/150?img=1' },
      { name: 'David', src: 'https://i.pravatar.cc/150?img=4' },
    ],
  },
  {
    id: 3,
    description: 'Groceries',
    amount: 78.20,
    category: 'Food',
    date: new Date(2025, 5, 15),
    paid: true,
    status: 'settled',
    participants: [
      { name: 'Bob', src: 'https://i.pravatar.cc/150?img=2' },
      { name: 'Eve', src: 'https://i.pravatar.cc/150?img=5' },
      { name: 'Frank', src: 'https://i.pravatar.cc/150?img=6' },
      { name: 'Grace', src: 'https://i.pravatar.cc/150?img=7' },
    ],
  },
  {
    id: 4,
    description: 'Movie tickets',
    amount: 24.00,
    category: 'Entertainment',
    date: new Date(2025, 5, 18),
    paid: false,
    status: 'pending',
    participants: [
      { name: 'Alice', src: 'https://i.pravatar.cc/150?img=1' },
      { name: 'Charlie', src: 'https://i.pravatar.cc/150?img=3' },
    ],
  },
  {
    id: 5,
    description: 'Coffee',
    amount: 4.50,
    category: 'Food',
    date: new Date(2025, 5, 20),
    paid: true,
    status: 'settled',
    participants: [{ name: 'David', src: 'https://i.pravatar.cc/150?img=4' }],
  },
  {
    id: 6,
    description: 'Taxi to airport',
    amount: 35.00,
    category: 'Transport',
    date: new Date(2025, 5, 22),
    paid: false,
    status: 'pending',
    participants: [
      { name: 'Eve', src: 'https://i.pravatar.cc/150?img=5' },
      { name: 'Frank', src: 'https://i.pravatar.cc/150?img=6' },
    ],
  },
  {
    id: 7,
    description: 'Concert tickets',
    amount: 60.00,
    category: 'Entertainment',
    date: new Date(2025, 5, 25),
    paid: true,
    status: 'settled',
    participants: [
      { name: 'Alice', src: 'https://i.pravatar.cc/150?img=1' },
      { name: 'Bob', src: 'https://i.pravatar.cc/150?img=2' },
      { name: 'Charlie', src: 'https://i.pravatar.cc/150?img=3' },
      { name: 'David', src: 'https://i.pravatar.cc/150?img=4' },
      { name: 'Eve', src: 'https://i.pravatar.cc/150?img=5' },
    ],
  },
  {
    id: 8,
    description: 'Lunch with team',
    amount: 28.50,
    category: 'Food',
    date: new Date(2025, 5, 28),
    paid: false,
    status: 'pending',
    participants: [
      { name: 'Frank', src: 'https://i.pravatar.cc/150?img=6' },
      { name: 'Grace', src: 'https://i.pravatar.cc/150?img=7' },
      { name: 'Alice', src: 'https://i.pravatar.cc/150?img=1' },
    ],
  },
  {
    id: 9,
    description: 'New phone case',
    amount: 19.99,
    category: 'Shopping',
    date: new Date(2025, 6, 2),
    paid: true,
    status: 'settled',
    participants: [{ name: 'Bob', src: 'https://i.pravatar.cc/150?img=2' }],
  },
  {
    id: 10,
    description: 'Electricity bill',
    amount: 85.00,
    category: 'Utilities',
    date: new Date(2025, 6, 5),
    paid: true,
    status: 'settled',
    participants: [
      { name: 'Alice', src: 'https://i.pravatar.cc/150?img=1' },
      { name: 'Bob', src: 'https://i.pravatar.cc/150?img=2' },
      { name: 'Charlie', src: 'https://i.pravatar.cc/150?img=3' },
      { name: 'David', src: 'https://i.pravatar.cc/150?img=4' },
    ],
  },
  {
    id: 11,
    description: 'Gym membership',
    amount: 45.00,
    category: 'Health',
    date: new Date(2025, 6, 8),
    paid: false,
    status: 'pending',
    participants: [{ name: 'Eve', src: 'https://i.pravatar.cc/150?img=5' }],
  },
  {
    id: 12,
    description: 'Weekend trip gas',
    amount: 40.00,
    category: 'Transport',
    date: new Date(2025, 6, 12),
    paid: true,
    status: 'settled',
    participants: [
      { name: 'Frank', src: 'https://i.pravatar.cc/150?img=6' },
      { name: 'Grace', src: 'https://i.pravatar.cc/150?img=7' },
    ],
  },
  {
    id: 13,
    description: 'Birthday gift',
    amount: 30.00,
    category: 'Shopping',
    date: new Date(2025, 6, 15),
    paid: true,
    status: 'settled',
    participants: [
      { name: 'Alice', src: 'https://i.pravatar.cc/150?img=1' },
      { name: 'Charlie', src: 'https://i.pravatar.cc/150?img=3' },
    ],
  },
  {
    id: 14,
    description: 'Internet bill',
    amount: 55.00,
    category: 'Utilities',
    date: new Date(2025, 6, 18),
    paid: false,
    status: 'pending',
    participants: [
      { name: 'Bob', src: 'https://i.pravatar.cc/150?img=2' },
      { name: 'David', src: 'https://i.pravatar.cc/150?img=4' },
    ],
  },
  {
    id: 15,
    description: 'Dinner at Sushi',
    amount: 62.75,
    category: 'Food',
    date: new Date(2025, 6, 22),
    paid: true,
    status: 'settled',
    participants: [
      { name: 'Alice', src: 'https://i.pravatar.cc/150?img=1' },
      { name: 'Bob', src: 'https://i.pravatar.cc/150?img=2' },
      { name: 'Eve', src: 'https://i.pravatar.cc/150?img=5' },
      { name: 'Frank', src: 'https://i.pravatar.cc/150?img=6' },
    ],
  },
];

// ---------- Extended Filter Configuration (more categories) ----------
const filterConfig: FilterControl[] = [
  {
    id: 'category',
    type: 'select',
    label: 'Category',
    options: [
      { value: 'Food', label: 'Food' },
      { value: 'Transport', label: 'Transport' },
      { value: 'Entertainment', label: 'Entertainment' },
      { value: 'Shopping', label: 'Shopping' },
      { value: 'Utilities', label: 'Utilities' },
      { value: 'Health', label: 'Health' },
    ],
    placeholder: 'All categories',
  },
  {
    id: 'paid',
    type: 'toggle',
    label: 'Paid',
    defaultValue: false,
  },
  {
    id: 'dateFrom',
    type: 'date',
    label: 'From',
    placeholder: 'Start date',
  },
  {
    id: 'dateTo',
    type: 'date',
    label: 'To',
    placeholder: 'End date',
  },
  {
    id: 'status',
    type: 'checkbox',
    label: 'Status',
    options: [
      { value: 'pending', label: 'Pending' },
      { value: 'settled', label: 'Settled' },
    ],
    defaultValue: [],
  },
];

export default function FilterControlsTestPage() {
  const [filters, setFilters] = useState<Record<string, FilterValue>>({});
  const [searchQuery, setSearchQuery] = useState('');
  const [searchLoading, setSearchLoading] = useState(false);

  // Simulate search loading
  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
    setSearchLoading(true);
    clearTimeout(window._searchTimer);
    window._searchTimer = setTimeout(() => {
      setSearchLoading(false);
    }, 500);
  };

  // Apply filters
  const filteredExpenses = useMemo(() => {
    let result = dummyExpenses;

    // Search
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter((e) => e.description.toLowerCase().includes(q));
    }

    // Category
    const category = filters.category as string;
    if (category) {
      result = result.filter((e) => e.category === category);
    }

    // Paid toggle
    const paid = filters.paid as boolean;
    if (paid !== undefined && paid !== null) {
      result = result.filter((e) => e.paid === paid);
    }

    // Date range
    const from = filters.dateFrom as Date | null;
    const to = filters.dateTo as Date | null;
    if (from) {
      const fromDate = new Date(from);
      fromDate.setHours(0, 0, 0, 0);
      result = result.filter((e) => e.date >= fromDate);
    }
    if (to) {
      const toDate = new Date(to);
      toDate.setHours(23, 59, 59, 999);
      result = result.filter((e) => e.date <= toDate);
    }

    // Status (checkbox)
    const statuses = filters.status as string[] || [];
    if (statuses.length > 0) {
      result = result.filter((e) => statuses.includes(e.status));
    }

    return result;
  }, [searchQuery, filters]);

  // Totals
  const totalAmount = useMemo(() => {
    return filteredExpenses.reduce((sum, e) => sum + e.amount, 0);
  }, [filteredExpenses]);

  const averageAmount = useMemo(() => {
    if (filteredExpenses.length === 0) return 0;
    return totalAmount / filteredExpenses.length;
  }, [filteredExpenses, totalAmount]);

  return (
    <div className={styles.pageContainer}>
      <div className={styles.header}>
        <Typography variant="h2" weight="semibold" color="primary">
          💸 Expenses
        </Typography>
        <Typography variant="body" color="secondary">
          Manage and filter your shared expenses
        </Typography>

        <ThemeSwitcher variant='both'/>
      </div>

      <FilterControls
        filters={filterConfig}
        onChange={setFilters}
        showSearch
        searchValue={searchQuery}
        onSearchChange={handleSearchChange}
        searchLoading={searchLoading}
        searchDebounce={300}
        showClearAll
        collapsible
        className={styles.filterControls}
        disabled={false}
        activeCount={undefined}
      />

      <div className={styles.summary}>
        <div className={styles.summaryItem}>
          <Typography variant="small" color="muted">Total Expenses</Typography>
          <Typography variant="h4" weight="semibold" color="primary">
            {filteredExpenses.length}
          </Typography>
        </div>
        <div className={styles.summaryItem}>
          <Typography variant="small" color="muted">Total Amount</Typography>
          <Typography variant="h4" weight="semibold" color="primary">
            ${totalAmount.toFixed(2)}
          </Typography>
        </div>
        <div className={styles.summaryItem}>
          <Typography variant="small" color="muted">Average</Typography>
          <Typography variant="h4" weight="semibold" color="primary">
            ${averageAmount.toFixed(2)}
          </Typography>
        </div>
        <div className={styles.summaryItem}>
          <Typography variant="small" color="muted">Active Filters</Typography>
          <Badge variant="primary" size="md">
            {
              Object.values(filters).filter(
                (v) =>
                  v !== null &&
                  v !== undefined &&
                  v !== '' &&
                  v !== false &&
                  !(Array.isArray(v) && v.length === 0)
              ).length
            }
          </Badge>
        </div>
      </div>

      <div className={styles.results}>
        {filteredExpenses.length === 0 ? (
          <div className={styles.emptyState}>
            <Typography variant="body" color="secondary">
              No expenses match your filters. Try adjusting your search or filters.
            </Typography>
          </div>
        ) : (
          <ul className={styles.expenseList}>
            {filteredExpenses.map((expense) => {
              const avatarItems = expense.participants.map((p) => (
                <Avatar
                  key={p.name}
                  src={p.src}
                  name={p.name}
                  size="sm"
                  alt={p.name}
                />
              ));

              return (
                <li key={expense.id} className={styles.expenseItem}>
                  <div className={styles.expenseLeft}>
                    <div className={styles.expenseHeader}>
                      <Typography variant="body" weight="medium" color="primary">
                        {expense.description}
                      </Typography>
                      <Badge
                        variant={expense.paid ? 'success' : 'warning'}
                        size="sm"
                      >
                        {expense.paid ? 'Paid' : 'Pending'}
                      </Badge>
                    </div>
                    <div className={styles.expenseMeta}>
                      <Typography variant="small" color="muted">
                        {expense.category}
                      </Typography>
                      <span className={styles.metaDot}>•</span>
                      <Typography variant="small" color="muted">
                        {expense.date.toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                        })}
                      </Typography>
                    </div>
                    <div className={styles.avatarGroupWrapper}>
                      <AvatarGroup size="sm" max={3} compact>
                        {avatarItems}
                      </AvatarGroup>
                    </div>
                  </div>
                  <div className={styles.expenseRight}>
                    <Typography variant="h5" weight="semibold" color="primary">
                      ${expense.amount.toFixed(2)}
                    </Typography>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
}

// TypeScript global timer
declare global {
  interface Window {
    _searchTimer: NodeJS.Timeout;
  }
}