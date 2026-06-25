'use client';

import React, { useState, useCallback, useMemo } from 'react';
import {
  SelectDropdown,
  SelectOption,
} from '@/shared/_components/molecules/SelectDropdown';
import { Typography } from '@/shared/_components/atoms/Typography';
import { Divider } from '@/shared/_components/atoms/Divider';
import { ThemeSwitcher } from '@/shared/_components/molecules/ThemeSwitcher';
import { Button } from '@/shared/_components/atoms/Button';
import { Badge } from '@/shared/_components/atoms/Badge';
import {
  FaUtensils,
  FaCar,
  FaFilm,
  FaShoppingBag,
  FaHome,
  FaCoffee,
  FaPlane,
  FaGift,
  FaUser,
  FaUsers,
  FaDollarSign,
  FaEuroSign,
  FaPoundSign,
  FaBitcoin,
  FaEthereum,
  FaYenSign,
} from 'react-icons/fa';
import styles from './page.module.css';

// --- Mock data for different dropdowns ---
const CATEGORY_OPTIONS: SelectOption[] = [
  { value: 'food', label: 'Food', icon: <FaUtensils /> },
  { value: 'transport', label: 'Transport', icon: <FaCar /> },
  { value: 'entertainment', label: 'Entertainment', icon: <FaFilm /> },
  { value: 'shopping', label: 'Shopping', icon: <FaShoppingBag /> },
  { value: 'utilities', label: 'Utilities', icon: <FaHome /> },
  { value: 'coffee', label: 'Coffee', icon: <FaCoffee /> },
  { value: 'travel', label: 'Travel', icon: <FaPlane /> },
  { value: 'gifts', label: 'Gifts', icon: <FaGift /> },
];

const MEMBER_OPTIONS: SelectOption[] = [
  { value: 'alice', label: 'Alice Johnson' },
  { value: 'bob', label: 'Bob Smith' },
  { value: 'charlie', label: 'Charlie Brown' },
  { value: 'diana', label: 'Diana Prince' },
  { value: 'eve', label: 'Eve Adams' },
  { value: 'frank', label: 'Frank Castle', disabled: true },
];

const CURRENCY_OPTIONS: SelectOption[] = [
  { value: 'usd', label: 'USD', icon: <FaDollarSign /> },
  { value: 'eur', label: 'EUR', icon: <FaEuroSign /> },
  { value: 'gbp', label: 'GBP', icon: <FaPoundSign /> },
  { value: 'jpy', label: 'JPY', icon: <FaYenSign /> },
  { value: 'btc', label: 'BTC', icon: <FaBitcoin /> },
  { value: 'eth', label: 'ETH', icon: <FaEthereum /> },
];

const GROUP_OPTIONS: SelectOption[] = [
  { value: 'weekend', label: 'Weekend Trip', icon: <FaUsers /> },
  { value: 'roommates', label: 'Roommates', icon: <FaUsers /> },
  { value: 'family', label: 'Family Dinner', icon: <FaUsers /> },
  { value: 'office', label: 'Office Lunch', icon: <FaUsers /> },
  { value: 'gym', label: 'Gym Buddies', icon: <FaUsers /> },
];

const LARGE_OPTIONS: SelectOption[] = Array.from({ length: 50 }, (_, i) => ({
  value: `item-${i + 1}`,
  label: `Option ${i + 1} - ${Math.random().toString(36).substring(2, 8)}`,
  icon: i % 3 === 0 ? <FaUser /> : undefined,
  disabled: i === 25 || i === 42,
}));

type DemoSection =
  | 'basic'
  | 'controlled'
  | 'sizes'
  | 'searchable'
  | 'clearable'
  | 'required'
  | 'states'
  | 'disabled-options'
  | 'large-list'
  | 'real-world';

export default function SelectDropdownDemo() {
  // --- State for different examples ---
  const [basicValue, setBasicValue] = useState('');
  const [controlledValue, setControlledValue] = useState('food');
  const [searchValue, setSearchValue] = useState('');
  const [clearableValue, setClearableValue] = useState('usd');
  const [requiredValue, setRequiredValue] = useState('');
  const [errorValue, setErrorValue] = useState('');
  const [loadingValue, setLoadingValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [categoryValue, setCategoryValue] = useState('');
  const [currencyValue, setCurrencyValue] = useState('usd');
  const [memberValue, setMemberValue] = useState('');
  const [groupValue, setGroupValue] = useState('weekend');
  const [largeValue, setLargeValue] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [submissionError, setSubmissionError] = useState<string | false>(false);

  // --- Active section ---
  const [activeSection, setActiveSection] = useState<DemoSection>('basic');

  // --- Handlers ---
  const handleBasicChange = useCallback((value: string) => {
    setBasicValue(value);
  }, []);

  const handleControlledChange = useCallback((value: string) => {
    setControlledValue(value);
  }, []);

  const handleSearchChange = useCallback((value: string) => {
    setSearchValue(value);
  }, []);

  const handleClearableChange = useCallback((value: string) => {
    setClearableValue(value);
  }, []);

  const handleRequiredChange = useCallback((value: string) => {
    setRequiredValue(value);
    setSubmissionError(false);
  }, []);

  const handleErrorChange = useCallback((value: string) => {
    setErrorValue(value);
  }, []);

  const handleLoadingChange = useCallback((value: string) => {
    setLoadingValue(value);
    if (value) {
      setIsLoading(true);
      setTimeout(() => setIsLoading(false), 1500);
    }
  }, []);

  const handleCategoryChange = useCallback((value: string) => {
    setCategoryValue(value);
  }, []);

  const handleCurrencyChange = useCallback((value: string) => {
    setCurrencyValue(value);
  }, []);

  const handleMemberChange = useCallback((value: string) => {
    setMemberValue(value);
  }, []);

  const handleGroupChange = useCallback((value: string) => {
    setGroupValue(value);
  }, []);

  const handleLargeChange = useCallback((value: string) => {
    setLargeValue(value);
  }, []);

  const handleFormSubmit = useCallback(() => {
    if (!requiredValue) {
      setSubmissionError('Please select a category');
      return;
    }
    setSubmissionError(false);
    setSubmitted(true);
    console.log('Form submitted with:', requiredValue);
    setTimeout(() => setSubmitted(false), 3000);
  }, [requiredValue]);

  // --- Memoized display helpers ---
  const getCategoryLabel = useCallback(
    (value: string) => CATEGORY_OPTIONS.find((o) => o.value === value)?.label || 'None',
    []
  );

  const getCurrencyLabel = useCallback(
    (value: string) => CURRENCY_OPTIONS.find((o) => o.value === value)?.label || 'None',
    []
  );

  const getGroupLabel = useCallback(
    (value: string) => GROUP_OPTIONS.find((o) => o.value === value)?.label || 'None',
    []
  );

  // --- Search handlers for real-world ---
  const [searchText, setSearchText] = useState('');

  const handleSearchSelect = useCallback((value: string) => {
    console.log('Selected:', value);
  }, []);

  return (
    <div className={styles.container}>
      {/* Header */}
      <header className={styles.header}>
        <div className={styles.headerLeft}>
          <Typography variant="h1" color="primary">
            SelectDropdown – Real‑World Demo
          </Typography>
          <Typography variant="body" color="secondary">
            Accessible dropdown with search, icons, loading, and keyboard navigation
          </Typography>
        </div>
        <ThemeSwitcher variant="both" />
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
          className={`${styles.tab} ${activeSection === 'controlled' ? styles.tabActive : ''}`}
          onClick={() => setActiveSection('controlled')}
        >
          Controlled
        </button>
        <button
          className={`${styles.tab} ${activeSection === 'sizes' ? styles.tabActive : ''}`}
          onClick={() => setActiveSection('sizes')}
        >
          Sizes
        </button>
        <button
          className={`${styles.tab} ${activeSection === 'searchable' ? styles.tabActive : ''}`}
          onClick={() => setActiveSection('searchable')}
        >
          Searchable
        </button>
        <button
          className={`${styles.tab} ${activeSection === 'clearable' ? styles.tabActive : ''}`}
          onClick={() => setActiveSection('clearable')}
        >
          Clearable
        </button>
        <button
          className={`${styles.tab} ${activeSection === 'required' ? styles.tabActive : ''}`}
          onClick={() => setActiveSection('required')}
        >
          Required
        </button>
        <button
          className={`${styles.tab} ${activeSection === 'states' ? styles.tabActive : ''}`}
          onClick={() => setActiveSection('states')}
        >
          States
        </button>
        <button
          className={`${styles.tab} ${activeSection === 'disabled-options' ? styles.tabActive : ''}`}
          onClick={() => setActiveSection('disabled-options')}
        >
          Disabled Options
        </button>
        <button
          className={`${styles.tab} ${activeSection === 'large-list' ? styles.tabActive : ''}`}
          onClick={() => setActiveSection('large-list')}
        >
          Large List
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
              Simple dropdown with options, no search or clearing
            </Typography>
          </div>
          <div className={styles.row}>
            <SelectDropdown
              label="Select a category"
              value={basicValue}
              onChange={handleBasicChange}
              options={CATEGORY_OPTIONS}
              placeholder="Choose a category..."
              helperText="Select a category from the list"
            />
            <div className={styles.preview}>
              <Typography variant="body" color="secondary">
                Selected:{' '}
                <Typography as="strong" variant="body" color="primary" weight="semibold">
                  {getCategoryLabel(basicValue)}
                </Typography>
              </Typography>
            </div>
          </div>
          <div className={styles.codeBlock}>
            <Typography variant="small" color="secondary" className={styles.codeLabel}>
              Usage:
            </Typography>
            <pre className={styles.code}>
              {`<SelectDropdown
  label="Select a category"
  value={value}
  onChange={setValue}
  options={CATEGORY_OPTIONS}
  placeholder="Choose a category..."
  helperText="Select a category from the list"
/>`}
            </pre>
          </div>
        </section>
      )}

      {/* ============================================================
      2. Controlled Mode
      ============================================================ */}
      {activeSection === 'controlled' && (
        <section className={styles.section}>
          <div className={styles.sectionHeader}>
            <Typography variant="h3" color="primary">
              Controlled Mode
            </Typography>
            <Typography variant="small" color="muted">
              Parent controls the selected value (with external reset button)
            </Typography>
          </div>
          <div className={styles.row}>
            <SelectDropdown
              label="Controlled Select"
              value={controlledValue}
              onChange={handleControlledChange}
              options={CATEGORY_OPTIONS}
              placeholder="Choose a category..."
            />
            <div className={styles.actions}>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleControlledChange('food')}
              >
                Set to Food
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleControlledChange('entertainment')}
              >
                Set to Entertainment
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleControlledChange('')}
              >
                Reset
              </Button>
            </div>
          </div>
          <div className={styles.preview}>
            <Typography variant="body" color="secondary">
              Current controlled value:{' '}
              <Typography as="strong" variant="body" color="primary" weight="semibold">
                {getCategoryLabel(controlledValue)}
              </Typography>
            </Typography>
          </div>
          <div className={styles.codeBlock}>
            <Typography variant="small" color="secondary" className={styles.codeLabel}>
              Usage:
            </Typography>
            <pre className={styles.code}>
              {`// Parent controls the value
const [value, setValue] = useState('food');

<SelectDropdown
  label="Controlled Select"
  value={value}
  onChange={setValue}
  options={options}
/>

// External buttons can change the value
<Button onClick={() => setValue('food')}>Set to Food</Button>`}
            </pre>
          </div>
        </section>
      )}

      {/* ============================================================
      3. Size Variants
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
              <SelectDropdown
                label="Small"
                value="food"
                onChange={() => {}}
                options={CATEGORY_OPTIONS.slice(0, 4)}
                size="sm"
              />
            </div>
            <div>
              <Typography variant="body" color="secondary" className={styles.sizeLabel}>
                Medium (md) – default
              </Typography>
              <SelectDropdown
                label="Medium"
                value="food"
                onChange={() => {}}
                options={CATEGORY_OPTIONS.slice(0, 4)}
                size="md"
              />
            </div>
            <div>
              <Typography variant="body" color="secondary" className={styles.sizeLabel}>
                Large (lg)
              </Typography>
              <SelectDropdown
                label="Large"
                value="food"
                onChange={() => {}}
                options={CATEGORY_OPTIONS.slice(0, 4)}
                size="lg"
              />
            </div>
          </div>
          <div className={styles.codeBlock}>
            <Typography variant="small" color="secondary" className={styles.codeLabel}>
              Usage:
            </Typography>
            <pre className={styles.code}>
              {`<SelectDropdown size="lg" />`}
            </pre>
          </div>
        </section>
      )}

      {/* ============================================================
      4. Searchable
      ============================================================ */}
      {activeSection === 'searchable' && (
        <section className={styles.section}>
          <div className={styles.sectionHeader}>
            <Typography variant="h3" color="primary">
              Searchable
            </Typography>
            <Typography variant="small" color="muted">
              Filter options by typing in the search input
            </Typography>
          </div>
          <div className={styles.row}>
            <SelectDropdown
              label="Searchable Select"
              value={searchValue}
              onChange={handleSearchChange}
              options={CATEGORY_OPTIONS}
              placeholder="Search and select..."
              searchable
              helperText="Type to filter options"
            />
            <div className={styles.preview}>
              <Typography variant="body" color="secondary">
                Selected:{' '}
                <Typography as="strong" variant="body" color="primary" weight="semibold">
                  {getCategoryLabel(searchValue)}
                </Typography>
              </Typography>
            </div>
          </div>
          <div className={styles.codeBlock}>
            <Typography variant="small" color="secondary" className={styles.codeLabel}>
              Usage:
            </Typography>
            <pre className={styles.code}>
              {`<SelectDropdown
  label="Searchable Select"
  value={value}
  onChange={setValue}
  options={options}
  searchable
  helperText="Type to filter options"
/>`}
            </pre>
          </div>
        </section>
      )}

      {/* ============================================================
      5. Clearable
      ============================================================ */}
      {activeSection === 'clearable' && (
        <section className={styles.section}>
          <div className={styles.sectionHeader}>
            <Typography variant="h3" color="primary">
              Clearable
            </Typography>
            <Typography variant="small" color="muted">
              Clear button appears when a value is selected
            </Typography>
          </div>
          <div className={styles.row}>
            <SelectDropdown
              label="Clearable Select"
              value={clearableValue}
              onChange={handleClearableChange}
              options={CURRENCY_OPTIONS}
              placeholder="Select currency..."
              clearable
              helperText="Click ✕ to clear the selection"
            />
            <div className={styles.preview}>
              <Typography variant="body" color="secondary">
                Selected:{' '}
                <Typography as="strong" variant="body" color="primary" weight="semibold">
                  {getCurrencyLabel(clearableValue)}
                </Typography>
              </Typography>
            </div>
          </div>
          <div className={styles.codeBlock}>
            <Typography variant="small" color="secondary" className={styles.codeLabel}>
              Usage:
            </Typography>
            <pre className={styles.code}>
              {`<SelectDropdown
  label="Clearable Select"
  value={value}
  onChange={setValue}
  options={options}
  clearable
  helperText="Click ✕ to clear the selection"
/>`}
            </pre>
          </div>
        </section>
      )}

      {/* ============================================================
      6. Required
      ============================================================ */}
      {activeSection === 'required' && (
        <section className={styles.section}>
          <div className={styles.sectionHeader}>
            <Typography variant="h3" color="primary">
              Required Field
            </Typography>
            <Typography variant="small" color="muted">
              Required field with validation; clearing is prevented
            </Typography>
          </div>
          <div className={styles.formCard}>
            <div className={styles.formRow}>
              <SelectDropdown
                label="Category (Required)"
                value={requiredValue}
                onChange={handleRequiredChange}
                options={CATEGORY_OPTIONS}
                placeholder="Select a category..."
                required
                error={submissionError}
                helperText="Please select a category (required)"
                clearable
              />
            </div>
            <div className={styles.actions}>
              <Button variant="primary" onClick={handleFormSubmit}>
                Submit Form
              </Button>
              {submitted && (
                <Typography variant="small" color="success">
                  ✓ Form submitted with: {getCategoryLabel(requiredValue)}
                </Typography>
              )}
              {submissionError && (
                <Typography variant="small" color="error">
                  {submissionError}
                </Typography>
              )}
            </div>
          </div>
          <div className={styles.codeBlock}>
            <Typography variant="small" color="secondary" className={styles.codeLabel}>
              Usage:
            </Typography>
            <pre className={styles.code}>
              {`<SelectDropdown
  label="Category (Required)"
  value={value}
  onChange={setValue}
  options={options}
  required
  error={error}
  helperText="Please select a category (required)"
  clearable
/>`}
            </pre>
          </div>
        </section>
      )}

      {/* ============================================================
      7. States: Disabled, Error, Loading
      ============================================================ */}
      {activeSection === 'states' && (
        <section className={styles.section}>
          <div className={styles.sectionHeader}>
            <Typography variant="h3" color="primary">
              States
            </Typography>
            <Typography variant="small" color="muted">
              Disabled, Error, Loading, and Helper Text
            </Typography>
          </div>
          <div className={styles.grid}>
            <div>
              <Typography variant="body" color="secondary" className={styles.stateLabel}>
                Disabled
              </Typography>
              <SelectDropdown
                label="Disabled"
                value="food"
                onChange={() => {}}
                options={CATEGORY_OPTIONS.slice(0, 4)}
                disabled
              />
            </div>
            <div>
              <Typography variant="body" color="secondary" className={styles.stateLabel}>
                Error
              </Typography>
              <SelectDropdown
                label="Error"
                value={errorValue}
                onChange={handleErrorChange}
                options={CATEGORY_OPTIONS.slice(0, 4)}
                error="Please select a valid option"
                placeholder="Select option..."
              />
            </div>
            <div>
              <Typography variant="body" color="secondary" className={styles.stateLabel}>
                Loading
              </Typography>
              <SelectDropdown
                label="Loading"
                value={loadingValue}
                onChange={handleLoadingChange}
                options={CATEGORY_OPTIONS}
                placeholder="Select option..."
                loading={isLoading}
                helperText={isLoading ? '⏳ Loading options...' : 'Type to trigger loading'}
              />
            </div>
            <div>
              <Typography variant="body" color="secondary" className={styles.stateLabel}>
                With Helper Text
              </Typography>
              <SelectDropdown
                label="Helper Text"
                value=""
                onChange={() => {}}
                options={CATEGORY_OPTIONS.slice(0, 4)}
                placeholder="Select option..."
                helperText="This is a helpful description"
              />
            </div>
          </div>
          <div className={styles.codeBlock}>
            <Typography variant="small" color="secondary" className={styles.codeLabel}>
              Usage:
            </Typography>
            <pre className={styles.code}>
              {`<SelectDropdown disabled />
<SelectDropdown error="Please select a valid option" />
<SelectDropdown loading={isLoading} />
<SelectDropdown helperText="Helpful description" />`}
            </pre>
          </div>
        </section>
      )}

      {/* ============================================================
      8. Disabled Options
      ============================================================ */}
      {activeSection === 'disabled-options' && (
        <section className={styles.section}>
          <div className={styles.sectionHeader}>
            <Typography variant="h3" color="primary">
              Disabled Options
            </Typography>
            <Typography variant="small" color="muted">
              Some options are disabled and cannot be selected
            </Typography>
          </div>
          <div className={styles.row}>
            <SelectDropdown
              label="Select a member"
              value={memberValue}
              onChange={handleMemberChange}
              options={MEMBER_OPTIONS}
              placeholder="Choose a member..."
              searchable
              helperText="Frank Castle is disabled"
            />
            <div className={styles.preview}>
              <Typography variant="body" color="secondary">
                Selected:{' '}
                <Typography as="strong" variant="body" color="primary" weight="semibold">
                  {memberValue || 'None'}
                </Typography>
              </Typography>
              <Typography variant="small" color="muted">
                {memberValue === 'frank' ? '❌ Frank is disabled!' : '✓ Valid selection'}
              </Typography>
            </div>
          </div>
          <div className={styles.codeBlock}>
            <Typography variant="small" color="secondary" className={styles.codeLabel}>
              Usage:
            </Typography>
            <pre className={styles.code}>
              {`const options = [
  { value: 'alice', label: 'Alice Johnson' },
  { value: 'bob', label: 'Bob Smith' },
  { value: 'frank', label: 'Frank Castle', disabled: true },
];

<SelectDropdown
  label="Select a member"
  value={value}
  onChange={setValue}
  options={options}
  searchable
/>`}
            </pre>
          </div>
        </section>
      )}

      {/* ============================================================
      9. Large List
      ============================================================ */}
      {activeSection === 'large-list' && (
        <section className={styles.section}>
          <div className={styles.sectionHeader}>
            <Typography variant="h3" color="primary">
              Large List (50 Options)
            </Typography>
            <Typography variant="small" color="muted">
              Performance test with 50 options; searchable to filter
            </Typography>
          </div>
          <div className={styles.row}>
            <SelectDropdown
              label="Large List"
              value={largeValue}
              onChange={handleLargeChange}
              options={LARGE_OPTIONS}
              placeholder="Select an option..."
              searchable
              showOptionCount
              helperText={`${LARGE_OPTIONS.length} options available (some disabled)`}
            />
            <div className={styles.preview}>
              <Typography variant="body" color="secondary">
                Selected:{' '}
                <Typography as="strong" variant="body" color="primary" weight="semibold">
                  {largeValue || 'None'}
                </Typography>
              </Typography>
            </div>
          </div>
          <div className={styles.codeBlock}>
            <Typography variant="small" color="secondary" className={styles.codeLabel}>
              Usage:
            </Typography>
            <pre className={styles.code}>
              {`// With 50+ options
<SelectDropdown
  label="Large List"
  value={value}
  onChange={setValue}
  options={LARGE_OPTIONS}
  searchable
  showOptionCount
  helperText="50 options available"
/>`}
            </pre>
          </div>
        </section>
      )}

      {/* ============================================================
      10. Real‑World: Expense Form
      ============================================================ */}
      {activeSection === 'real-world' && (
        <section className={styles.section}>
          <div className={styles.sectionHeader}>
            <Typography variant="h3" color="primary">
              Real‑World: Expense Form
            </Typography>
            <Typography variant="small" color="muted">
              Complete expense form with category, currency, and payer selection
            </Typography>
          </div>
          <div className={styles.formCard}>
            <div className={styles.formGrid}>
              <div className={styles.formField}>
                <Typography variant="body" weight="medium" className={styles.fieldLabel}>
                  Category
                </Typography>
                <SelectDropdown
                  label=""
                  value={categoryValue}
                  onChange={handleCategoryChange}
                  options={CATEGORY_OPTIONS}
                  placeholder="Select category..."
                  searchable
                  required
                  clearable
                />
              </div>
              <div className={styles.formField}>
                <Typography variant="body" weight="medium" className={styles.fieldLabel}>
                  Currency
                </Typography>
                <SelectDropdown
                  label=""
                  value={currencyValue}
                  onChange={handleCurrencyChange}
                  options={CURRENCY_OPTIONS}
                  placeholder="Select currency..."
                  clearable
                />
              </div>
              <div className={styles.formField}>
                <Typography variant="body" weight="medium" className={styles.fieldLabel}>
                  Payer
                </Typography>
                <SelectDropdown
                  label=""
                  value={memberValue}
                  onChange={handleMemberChange}
                  options={MEMBER_OPTIONS}
                  placeholder="Who paid?"
                  searchable
                  clearable
                />
              </div>
              <div className={styles.formField}>
                <Typography variant="body" weight="medium" className={styles.fieldLabel}>
                  Group
                </Typography>
                <SelectDropdown
                  label=""
                  value={groupValue}
                  onChange={handleGroupChange}
                  options={GROUP_OPTIONS}
                  placeholder="Select group..."
                  showOptionCount
                />
              </div>
            </div>
            <div className={styles.preview}>
              <div className={styles.previewRow}>
                <Typography variant="body" color="secondary">
                  Category:{' '}
                  <Typography as="strong" variant="body" color="primary" weight="semibold">
                    {getCategoryLabel(categoryValue) || '—'}
                  </Typography>
                </Typography>
                <Typography variant="body" color="secondary">
                  Currency:{' '}
                  <Typography as="strong" variant="body" color="primary" weight="semibold">
                    {getCurrencyLabel(currencyValue) || '—'}
                  </Typography>
                </Typography>
                <Typography variant="body" color="secondary">
                  Payer:{' '}
                  <Typography as="strong" variant="body" color="primary" weight="semibold">
                    {memberValue || '—'}
                  </Typography>
                </Typography>
                <Typography variant="body" color="secondary">
                  Group:{' '}
                  <Typography as="strong" variant="body" color="primary" weight="semibold">
                    {getGroupLabel(groupValue) || '—'}
                  </Typography>
                </Typography>
              </div>
            </div>
          </div>



          <div className={styles.codeBlock}>
            <Typography variant="small" color="secondary" className={styles.codeLabel}>
              Real‑world usage:
            </Typography>
            <pre className={styles.code}>
              {`// Expense Form
<SelectDropdown
  label="Category"
  value={category}
  onChange={setCategory}
  options={CATEGORY_OPTIONS}
  searchable
  required
  clearable
/>

// Filter Controls
<SelectDropdown
  label="Category Filter"
  value=""
  onChange={handleFilter}
  options={CATEGORY_OPTIONS}
  placeholder="All Categories..."
  size="sm"
  clearable
/>`}
            </pre>
          </div>
        </section>
      )}

      <footer className={styles.footer}>
        <Typography variant="small" color="muted">
          SelectDropdown Demo – Built with TrueSplit Design System
        </Typography>
      </footer>
    </div>
  );
}