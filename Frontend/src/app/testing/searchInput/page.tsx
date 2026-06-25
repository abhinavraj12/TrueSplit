'use client';

import React, { useState, useCallback, useMemo } from 'react';
import {
  SearchInput,
  SearchInputProps,
} from '@/shared/_components/molecules/SearchInput';
import { Typography } from '@/shared/_components/atoms/Typography';
import { Divider } from '@/shared/_components/atoms/Divider';
import { ThemeSwitcher } from '@/shared/_components/molecules/ThemeSwitcher';
import { Button } from '@/shared/_components/atoms/Button';
import { Badge } from '@/shared/_components/atoms/Badge';
import { Icon } from '@/shared/_components/atoms/Icon';
import { FaUser, FaSearch, FaFilter } from 'react-icons/fa';
import styles from './page.module.css';

// --- Mock data for real-world examples ---
const EXPENSES = [
  { id: 1, title: 'Dinner with friends', amount: 45.50, category: 'Food', date: '2024-01-15' },
  { id: 2, title: 'Uber ride to airport', amount: 32.00, category: 'Transport', date: '2024-01-16' },
  { id: 3, title: 'Movie tickets', amount: 24.00, category: 'Entertainment', date: '2024-01-17' },
  { id: 4, title: 'Groceries at Whole Foods', amount: 78.20, category: 'Shopping', date: '2024-01-18' },
  { id: 5, title: 'Electricity bill', amount: 120.00, category: 'Utilities', date: '2024-01-19' },
  { id: 6, title: 'Coffee with team', amount: 12.50, category: 'Food', date: '2024-01-20' },
  { id: 7, title: 'Monthly rent', amount: 1200.00, category: 'Rent', date: '2024-01-21' },
  { id: 8, title: 'Gym membership', amount: 45.00, category: 'Health', date: '2024-01-22' },
];

const GROUPS = [
  { id: 1, name: 'Weekend Trip', members: 6 },
  { id: 2, name: 'Roommates', members: 3 },
  { id: 3, name: 'Family Dinner', members: 8 },
  { id: 4, name: 'Office Lunch', members: 12 },
  { id: 5, name: 'Gym Buddies', members: 4 },
];

type DemoSection = 'basic' | 'debounce' | 'loading' | 'clear' | 'sizes' | 'states' | 'real-world';

export default function SearchInputDemo() {
  // --- State for different examples ---
  const [basicValue, setBasicValue] = useState('');
  const [debounceValue, setDebounceValue] = useState('');
  const [loadingValue, setLoadingValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [clearValue, setClearValue] = useState('');
  const [clearCount, setClearCount] = useState(0);
  const [filterValue, setFilterValue] = useState('');
  const [filteredExpenses, setFilteredExpenses] = useState(EXPENSES);
  const [submittedValue, setSubmittedValue] = useState('');

  // --- State for group search ---
  const [groupSearchValue, setGroupSearchValue] = useState('');
  const [filteredGroups, setFilteredGroups] = useState(GROUPS);

  // --- Active section ---
  const [activeSection, setActiveSection] = useState<DemoSection>('basic');

  // --- Handlers ---
  const handleBasicChange = useCallback((value: string) => {
    setBasicValue(value);
  }, []);

  const handleBasicSubmit = useCallback((value: string) => {
    setSubmittedValue(value);
    console.log('Basic search submitted:', value);
  }, []);

  const handleDebounceChange = useCallback((value: string) => {
    setDebounceValue(value);
  }, []);

  const handleLoadingChange = useCallback((value: string) => {
    setLoadingValue(value);
    if (value.length > 0) {
      setIsLoading(true);
      // Simulate API call
      setTimeout(() => {
        setIsLoading(false);
      }, 1500);
    } else {
      setIsLoading(false);
    }
  }, []);

  const handleClearChange = useCallback((value: string) => {
    setClearValue(value);
  }, []);

  const handleClear = useCallback(() => {
    setClearCount((prev) => prev + 1);
    console.log('Search cleared!');
  }, []);

  const handleFilterChange = useCallback((value: string) => {
    setFilterValue(value);
    const filtered = EXPENSES.filter((expense) =>
      expense.title.toLowerCase().includes(value.toLowerCase()) ||
      expense.category.toLowerCase().includes(value.toLowerCase())
    );
    setFilteredExpenses(filtered);
  }, []);

  const handleGroupSearch = useCallback((value: string) => {
    setGroupSearchValue(value);
    const filtered = GROUPS.filter((group) =>
      group.name.toLowerCase().includes(value.toLowerCase())
    );
    setFilteredGroups(filtered);
  }, []);

  const handleGroupSubmit = useCallback((value: string) => {
    console.log('Group search submitted:', value);
  }, []);

  // --- Memoized search results count ---
  const resultCount = useMemo(() => filteredExpenses.length, [filteredExpenses]);

  return (
    <div className={styles.container}>
      {/* Header */}
      <header className={styles.header}>
        <div className={styles.headerLeft}>
          <Typography variant="h1" color="primary">
            SearchInput – Real‑World Demo
          </Typography>
          <Typography variant="body" color="secondary">
            Accessible search bar with debounce, loading, and clear functionality
          </Typography>
        </div>
        <ThemeSwitcher variant="icon" />
      </header>

      {/* Navigation Tabs */}
      <div className={styles.tabs}>
        <button
          className={`${styles.tab} ${activeSection === 'basic' ? styles.tabActive : ''}`}
          onClick={() => setActiveSection('basic')}
        >
          Basic
        </button>
        <button
          className={`${styles.tab} ${activeSection === 'debounce' ? styles.tabActive : ''}`}
          onClick={() => setActiveSection('debounce')}
        >
          Debounce
        </button>
        <button
          className={`${styles.tab} ${activeSection === 'loading' ? styles.tabActive : ''}`}
          onClick={() => setActiveSection('loading')}
        >
          Loading
        </button>
        <button
          className={`${styles.tab} ${activeSection === 'clear' ? styles.tabActive : ''}`}
          onClick={() => setActiveSection('clear')}
        >
          Clear
        </button>
        <button
          className={`${styles.tab} ${activeSection === 'sizes' ? styles.tabActive : ''}`}
          onClick={() => setActiveSection('sizes')}
        >
          Sizes
        </button>
        <button
          className={`${styles.tab} ${activeSection === 'states' ? styles.tabActive : ''}`}
          onClick={() => setActiveSection('states')}
        >
          States
        </button>
        <button
          className={`${styles.tab} ${activeSection === 'real-world' ? styles.tabActive : ''}`}
          onClick={() => setActiveSection('real-world')}
        >
          Real‑World
        </button>
      </div>

      <Divider variant="middle" label="Demo" thickness={2} />

      {/* ============================================================
      1. Basic Usage
      ============================================================ */}
      {activeSection === 'basic' && (
        <section className={styles.section}>
          <div className={styles.sectionHeader}>
            <Typography variant="h3" color="primary">
              Basic Usage
            </Typography>
            <Typography variant="small" color="muted">
              Simple search input with onChange and onSubmit
            </Typography>
          </div>
          <div className={styles.row}>
            <SearchInput
              value={basicValue}
              onChange={handleBasicChange}
              onSubmit={handleBasicSubmit}
              placeholder="Search expenses..."
              ariaLabel="Search expenses"
              helperText="Type something and press Enter to submit"
            />
            <div className={styles.preview}>
              <div className={styles.previewRow}>
                <Typography variant="body" color="secondary">
                  Current value:{' '}
                  <Typography as="strong" variant="body" color="primary" weight="semibold">
                    {basicValue || '(empty)'}
                  </Typography>
                </Typography>
              </div>
              {submittedValue && (
                <div className={styles.previewRow}>
                  <Typography variant="body" color="secondary">
                    Last submitted:{' '}
                    <Typography as="strong" variant="body" color="success" weight="semibold">
                      {submittedValue}
                    </Typography>
                  </Typography>
                </div>
              )}
            </div>
          </div>
          <div className={styles.codeBlock}>
            <Typography variant="small" color="secondary" className={styles.codeLabel}>
              Usage:
            </Typography>
            <pre className={styles.code}>
              {`<SearchInput
  value={searchValue}
  onChange={setSearchValue}
  onSubmit={handleSubmit}
  placeholder="Search expenses..."
  helperText="Type something and press Enter to submit"
/>`}
            </pre>
          </div>
        </section>
      )}

      {/* ============================================================
      2. Debounce
      ============================================================ */}
      {activeSection === 'debounce' && (
        <section className={styles.section}>
          <div className={styles.sectionHeader}>
            <Typography variant="h3" color="primary">
              Debounce
            </Typography>
            <Typography variant="small" color="muted">
              onChange fires after 500ms of inactivity
            </Typography>
          </div>
          <div className={styles.row}>
            <SearchInput
              value={debounceValue}
              onChange={handleDebounceChange}
              placeholder="Search with debounce..."
              debounce={500}
              helperText="onChange fires 500ms after you stop typing"
            />
            <div className={styles.preview}>
              <Typography variant="body" color="secondary">
                Current value:{' '}
                <Typography as="strong" variant="body" color="primary" weight="semibold">
                  {debounceValue || '(empty)'}
                </Typography>
              </Typography>
              <Typography variant="small" color="muted">
                🔄 Debounce: 500ms
              </Typography>
            </div>
          </div>
          <div className={styles.codeBlock}>
            <Typography variant="small" color="secondary" className={styles.codeLabel}>
              Usage:
            </Typography>
            <pre className={styles.code}>
              {`<SearchInput
  value={searchValue}
  onChange={setSearchValue}
  debounce={500}
  helperText="onChange fires 500ms after you stop typing"
/>`}
            </pre>
          </div>
        </section>
      )}

      {/* ============================================================
      3. Loading State
      ============================================================ */}
      {activeSection === 'loading' && (
        <section className={styles.section}>
          <div className={styles.sectionHeader}>
            <Typography variant="h3" color="primary">
              Loading State
            </Typography>
            <Typography variant="small" color="muted">
              Shows spinner while loading; clear button is disabled during load
            </Typography>
          </div>
          <div className={styles.row}>
            <SearchInput
              value={loadingValue}
              onChange={handleLoadingChange}
              placeholder="Search (simulates API call)..."
              loading={isLoading}
              helperText={isLoading ? '⏳ Searching...' : 'Type to start searching'}
            />
            <div className={styles.preview}>
              <Typography variant="body" color="secondary">
                Status:{' '}
                <Typography
                  as="strong"
                  variant="body"
                  color={isLoading ? 'warning' : 'success'}
                  weight="semibold"
                >
                  {isLoading ? '⏳ Loading...' : '✅ Ready'}
                </Typography>
              </Typography>
              {loadingValue && (
                <Typography variant="small" color="muted">
                  Searching for: "{loadingValue}"
                </Typography>
              )}
            </div>
          </div>
          <div className={styles.codeBlock}>
            <Typography variant="small" color="secondary" className={styles.codeLabel}>
              Usage:
            </Typography>
            <pre className={styles.code}>
              {`<SearchInput
  value={searchValue}
  onChange={setSearchValue}
  loading={isLoading}
  helperText={isLoading ? 'Searching...' : 'Type to start'}
/>`}
            </pre>
          </div>
        </section>
      )}

      {/* ============================================================
      4. Clear Button
      ============================================================ */}
      {activeSection === 'clear' && (
        <section className={styles.section}>
          <div className={styles.sectionHeader}>
            <Typography variant="h3" color="primary">
              Clear Button &amp; onClear Callback
            </Typography>
            <Typography variant="small" color="muted">
              Shows clear button when value exists; onClear tracks clears
            </Typography>
          </div>
          <div className={styles.row}>
            <SearchInput
              value={clearValue}
              onChange={handleClearChange}
              onClear={handleClear}
              placeholder="Type something to see clear button..."
              showClear={true}
              helperText={`Cleared ${clearCount} time(s)`}
            />
            <div className={styles.preview}>
              <Typography variant="body" color="secondary">
                Clear count:{' '}
                <Badge variant="primary" size="md">
                  {clearCount}
                </Badge>
              </Typography>
              <Typography variant="small" color="muted">
                Click ✕ to clear and increment the count
              </Typography>
            </div>
          </div>
          <div className={styles.codeBlock}>
            <Typography variant="small" color="secondary" className={styles.codeLabel}>
              Usage:
            </Typography>
            <pre className={styles.code}>
              {`<SearchInput
  value={searchValue}
  onChange={setSearchValue}
  onClear={handleClear}
  showClear={true}
  helperText="Cleared {clearCount} time(s)"
/>`}
            </pre>
          </div>
        </section>
      )}

      {/* ============================================================
      5. Size Variants
      ============================================================ */}
      {activeSection === 'sizes' && (
        <section className={styles.section}>
          <div className={styles.sectionHeader}>
            <Typography variant="h3" color="primary">
              Size Variants
            </Typography>
            <Typography variant="small" color="muted">
              Small, medium (default), and large
            </Typography>
          </div>
          <div className={styles.grid}>
            <div>
              <Typography variant="body" color="secondary" className={styles.sizeLabel}>
                Small (sm)
              </Typography>
              <SearchInput
                value=""
                onChange={() => {}}
                placeholder="Small search..."
                size="sm"
              />
            </div>
            <div>
              <Typography variant="body" color="secondary" className={styles.sizeLabel}>
                Medium (md) – default
              </Typography>
              <SearchInput
                value=""
                onChange={() => {}}
                placeholder="Medium search..."
                size="md"
              />
            </div>
            <div>
              <Typography variant="body" color="secondary" className={styles.sizeLabel}>
                Large (lg)
              </Typography>
              <SearchInput
                value=""
                onChange={() => {}}
                placeholder="Large search..."
                size="lg"
              />
            </div>
          </div>
          <div className={styles.codeBlock}>
            <Typography variant="small" color="secondary" className={styles.codeLabel}>
              Usage:
            </Typography>
            <pre className={styles.code}>
              {`<SearchInput size="lg" />`}
            </pre>
          </div>
        </section>
      )}

      {/* ============================================================
      6. States
      ============================================================ */}
      {activeSection === 'states' && (
        <section className={styles.section}>
          <div className={styles.sectionHeader}>
            <Typography variant="h3" color="primary">
              States
            </Typography>
            <Typography variant="small" color="muted">
              Disabled, required, custom icon, helper text, no clear
            </Typography>
          </div>
          <div className={styles.grid}>
            <div>
              <Typography variant="body" color="secondary" className={styles.stateLabel}>
                Disabled
              </Typography>
              <SearchInput
                value="Disabled search"
                onChange={() => {}}
                disabled
              />
            </div>
            <div>
              <Typography variant="body" color="secondary" className={styles.stateLabel}>
                Required
              </Typography>
              <SearchInput
                value=""
                onChange={() => {}}
                required
                placeholder="Required field..."
                helperText="This field is required"
              />
            </div>
            <div>
              <Typography variant="body" color="secondary" className={styles.stateLabel}>
                Custom Icon
              </Typography>
              <SearchInput
                value=""
                onChange={() => {}}
                leftIcon={<FaUser />}
                placeholder="Search users..."
              />
            </div>
            <div>
              <Typography variant="body" color="secondary" className={styles.stateLabel}>
                No Clear Button
              </Typography>
              <SearchInput
                value="Cannot clear me"
                onChange={() => {}}
                showClear={false}
                helperText="Clear button is hidden"
              />
            </div>
          </div>
          <div className={styles.codeBlock}>
            <Typography variant="small" color="secondary" className={styles.codeLabel}>
              Usage:
            </Typography>
            <pre className={styles.code}>
              {`<SearchInput disabled />
<SearchInput required />
<SearchInput leftIcon={<FaUser />} />
<SearchInput showClear={false} />`}
            </pre>
          </div>
        </section>
      )}

      {/* ============================================================
      7. Real‑World: Expense Search
      ============================================================ */}
      {activeSection === 'real-world' && (
        <section className={styles.section}>
          <div className={styles.sectionHeader}>
            <Typography variant="h3" color="primary">
              Real‑World: Expense Search
            </Typography>
            <Typography variant="small" color="muted">
              Search through expenses with real-time filtering
            </Typography>
          </div>

          {/* Search bar */}
          <SearchInput
            value={filterValue}
            onChange={handleFilterChange}
            placeholder="Search expenses by title or category..."
            debounce={200}
            helperText={`${resultCount} expense(s) found`}
            size="lg"
          />

          {/* Results */}
          <div className={styles.results}>
            <div className={styles.resultsHeader}>
              <Typography variant="body" weight="semibold">
                Results
              </Typography>
              <Badge variant="primary" size="sm">
                {resultCount}
              </Badge>
            </div>
            <div className={styles.resultsList}>
              {filteredExpenses.length === 0 ? (
                <div className={styles.emptyState}>
                  <Icon size="lg" color="muted" decorative>
                    <FaSearch />
                  </Icon>
                  <Typography variant="body" color="muted">
                    No expenses found matching your search
                  </Typography>
                </div>
              ) : (
                filteredExpenses.map((expense) => (
                  <div key={expense.id} className={styles.resultItem}>
                    <div className={styles.resultLeft}>
                      <Typography variant="body" weight="medium">
                        {expense.title}
                      </Typography>
                      <Typography variant="small" color="muted">
                        {expense.category} • {expense.date}
                      </Typography>
                    </div>
                    <Typography variant="body" weight="semibold" color="primary">
                      ${expense.amount.toFixed(2)}
                    </Typography>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className={styles.codeBlock}>
            <Typography variant="small" color="secondary" className={styles.codeLabel}>
              Real‑world usage:
            </Typography>
            <pre className={styles.code}>
              {`// In your expense list component
const [search, setSearch] = useState('');
const filteredExpenses = expenses.filter(e =>
  e.title.toLowerCase().includes(search.toLowerCase()) ||
  e.category.toLowerCase().includes(search.toLowerCase())
);

<SearchInput
  value={search}
  onChange={setSearch}
  placeholder="Search expenses..."
  debounce={200}
  helperText={\`\${filteredExpenses.length} expense(s) found\`}
/>`}
            </pre>
          </div>
        </section>
      )}

      {/* Extra: Group Search Example (Bonus) */}
      {activeSection === 'real-world' && (
        <section className={styles.section}>
          <div className={styles.sectionHeader}>
            <Typography variant="h3" color="primary">
              Bonus: Group Search
            </Typography>
            <Typography variant="small" color="muted">
              Search through groups with submit handler
            </Typography>
          </div>

          <div className={styles.row}>
            <SearchInput
              value={groupSearchValue}
              onChange={handleGroupSearch}
              onSubmit={handleGroupSubmit}
              placeholder="Search groups..."
              leftIcon={<FaFilter />}
              helperText={`${filteredGroups.length} group(s) found`}
            />
            <div className={styles.preview}>
              <div className={styles.groupResults}>
                {filteredGroups.map((group) => (
                  <div key={group.id} className={styles.groupChip}>
                    <Typography variant="small" weight="medium">
                      {group.name}
                    </Typography>
                    <Badge variant="default" size="sm">
                      {group.members}
                    </Badge>
                  </div>
                ))}
                {filteredGroups.length === 0 && (
                  <Typography variant="small" color="muted">
                    No groups found
                  </Typography>
                )}
              </div>
            </div>
          </div>
        </section>
      )}

      <footer className={styles.footer}>
        <Typography variant="small" color="muted">
          SearchInput Demo – Built with TrueSplit Design System
        </Typography>
      </footer>
    </div>
  );
}