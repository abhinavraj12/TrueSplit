'use client';

import React, { useState, useCallback, useMemo } from 'react';
import { DatePicker } from '@/shared/_components/molecules/DatePicker';
import { HighlightedDate } from '@/shared/_components/molecules/DatePicker/DatePickerCalendar';
import { Typography } from '@/shared/_components/atoms/Typography';
import { Divider } from '@/shared/_components/atoms/Divider';
import { ThemeSwitcher } from '@/shared/_components/molecules/ThemeSwitcher';
import { Button } from '@/shared/_components/atoms/Button';
import styles from './page.module.css';

type DemoSection =
  | 'basic'
  | 'formats'
  | 'validation'
  | 'disabled'
  | 'highlighted'
  | 'clearable'
  | 'sizes'
  | 'states'
  | 'real-world';

export default function DatePickerDemo() {
  // --- State for different examples ---
  const [basicDate, setBasicDate] = useState<Date | null>(new Date());
  const [expenseDate, setExpenseDate] = useState<Date | null>(new Date());
  const [settlementDate, setSettlementDate] = useState<Date | null>(null);
  const [filterDate, setFilterDate] = useState<Date | null>(null);
  const [customFormatDate, setCustomFormatDate] = useState<Date | null>(new Date());
  const [minMaxDate, setMinMaxDate] = useState<Date | null>(null);
  const [disabledDatesDate, setDisabledDatesDate] = useState<Date | null>(null);
  const [highlightedDate, setHighlightedDate] = useState<Date | null>(null);
  const [clearableDate, setClearableDate] = useState<Date | null>(new Date());
  const [formDate, setFormDate] = useState<Date | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [formError, setFormError] = useState<string | false>(false);

  // --- Active section ---
  const [activeSection, setActiveSection] = useState<DemoSection>('basic');

  // --- Handlers ---
  const handleBasicChange = useCallback((date: Date | null) => {
    setBasicDate(date);
  }, []);

  const handleExpenseChange = useCallback((date: Date | null) => {
    setExpenseDate(date);
  }, []);

  const handleSettlementChange = useCallback((date: Date | null) => {
    setSettlementDate(date);
  }, []);

  const handleFilterChange = useCallback((date: Date | null) => {
    setFilterDate(date);
  }, []);

  const handleCustomFormatChange = useCallback((date: Date | null) => {
    setCustomFormatDate(date);
  }, []);

  const handleMinMaxChange = useCallback((date: Date | null) => {
    setMinMaxDate(date);
  }, []);

  const handleDisabledDatesChange = useCallback((date: Date | null) => {
    setDisabledDatesDate(date);
  }, []);

  const handleHighlightedChange = useCallback((date: Date | null) => {
    setHighlightedDate(date);
  }, []);

  const handleClearableChange = useCallback((date: Date | null) => {
    setClearableDate(date);
  }, []);

  const handleFormChange = useCallback((date: Date | null) => {
    setFormDate(date);
    setFormError(false);
  }, []);

  const handleFormSubmit = useCallback(() => {
    if (!formDate) {
      setFormError('Please select a date');
      return;
    }
    setFormError(false);
    setSubmitted(true);
    console.log('Submitted date:', formDate);
    setTimeout(() => setSubmitted(false), 3000);
  }, [formDate]);

  // --- Pre-defined dates for demos ---
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const minDate = useMemo(() => {
    const date = new Date();
    date.setDate(date.getDate() - 7);
    return date;
  }, []);

  const maxDate = useMemo(() => {
    const date = new Date();
    date.setDate(date.getDate() + 7);
    return date;
  }, []);

  const disabledDatesList = useMemo(() => {
    const dates: Date[] = [];
    for (let i = 1; i <= 5; i++) {
      const date = new Date();
      date.setDate(date.getDate() + i);
      date.setHours(0, 0, 0, 0);
      dates.push(date);
    }
    return dates;
  }, []);

  const highlightedDatesList: (Date | HighlightedDate)[] = useMemo(() => {
    const dates: (Date | HighlightedDate)[] = [];
    // Regular date (default info)
    const infoDate = new Date();
    infoDate.setDate(infoDate.getDate() + 2);
    dates.push(infoDate);

    // Highlighted dates with specific statuses
    const successDate = new Date();
    successDate.setDate(successDate.getDate() + 4);
    dates.push({ date: successDate, status: 'success' });

    const warningDate = new Date();
    warningDate.setDate(warningDate.getDate() + 6);
    dates.push({ date: warningDate, status: 'warning' });

    const dangerDate = new Date();
    dangerDate.setDate(dangerDate.getDate() + 8);
    dates.push({ date: dangerDate, status: 'danger' });

    const pendingDate = new Date();
    pendingDate.setDate(pendingDate.getDate() + 10);
    dates.push({ date: pendingDate, status: 'pending' });

    return dates;
  }, []);

  // --- Format options ---
  const formatOptions = [
    { value: 'MMM dd, yyyy', label: 'MMM dd, yyyy' },
    { value: 'dd/MM/yyyy', label: 'dd/MM/yyyy' },
    { value: 'MM/dd/yyyy', label: 'MM/dd/yyyy' },
    { value: 'yyyy-MM-dd', label: 'yyyy-MM-dd' },
  ];
  const [selectedFormat, setSelectedFormat] = useState('MMM dd, yyyy');

  return (
    <div className={styles.container}>
      {/* Header */}
      <header className={styles.header}>
        <div className={styles.headerLeft}>
          <Typography variant="h1" color="primary">
            DatePicker – Real‑World Demo
          </Typography>
          <Typography variant="body" color="secondary">
            Date selection with calendar, validation, highlighting, and accessibility
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
          className={`${styles.tab} ${activeSection === 'formats' ? styles.tabActive : ''}`}
          onClick={() => setActiveSection('formats')}
        >
          Formats
        </button>
        <button
          className={`${styles.tab} ${activeSection === 'validation' ? styles.tabActive : ''}`}
          onClick={() => setActiveSection('validation')}
        >
          Validation
        </button>
        <button
          className={`${styles.tab} ${activeSection === 'disabled' ? styles.tabActive : ''}`}
          onClick={() => setActiveSection('disabled')}
        >
          Disabled Dates
        </button>
        <button
          className={`${styles.tab} ${activeSection === 'highlighted' ? styles.tabActive : ''}`}
          onClick={() => setActiveSection('highlighted')}
        >
          Highlighted
        </button>
        <button
          className={`${styles.tab} ${activeSection === 'clearable' ? styles.tabActive : ''}`}
          onClick={() => setActiveSection('clearable')}
        >
          Clearable
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
              Simple date picker with default format (MMM dd, yyyy)
            </Typography>
          </div>
          <div className={styles.row}>
            <DatePicker
              label="Select Date"
              value={basicDate}
              onChange={handleBasicChange}
              placeholder="Pick a date..."
              helperText="Click the calendar icon to open"
            />
            <div className={styles.preview}>
              <Typography variant="body" color="secondary">
                Selected:{' '}
                <Typography as="strong" variant="body" color="primary" weight="semibold">
                  {basicDate ? basicDate.toLocaleDateString('en-US', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  }) : 'None'}
                </Typography>
              </Typography>
            </div>
          </div>
          <div className={styles.codeBlock}>
            <Typography variant="small" color="secondary" className={styles.codeLabel}>
              Usage:
            </Typography>
            <pre className={styles.code}>
              {`<DatePicker
  label="Select Date"
  value={date}
  onChange={setDate}
  placeholder="Pick a date..."
  helperText="Click the calendar icon to open"
/>`}
            </pre>
          </div>
        </section>
      )}

      {/* ============================================================
      2. Formats
      ============================================================ */}
      {activeSection === 'formats' && (
        <section className={styles.section}>
          <div className={styles.sectionHeader}>
            <Typography variant="h3" color="primary">
              Date Formats
            </Typography>
            <Typography variant="small" color="muted">
              Choose different display formats
            </Typography>
          </div>
          <div className={styles.row}>
            <div className={styles.formatSelector}>
              <Typography variant="body" color="secondary" className={styles.formatLabel}>
                Format:
              </Typography>
              <select
                value={selectedFormat}
                onChange={(e) => setSelectedFormat(e.target.value)}
                className={styles.select}
              >
                {formatOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className={styles.row}>
            <DatePicker
              label="Custom Format"
              value={customFormatDate}
              onChange={handleCustomFormatChange}
              format={selectedFormat}
              placeholder="Pick a date..."
              helperText={`Format: ${selectedFormat}`}
            />
            <div className={styles.preview}>
              <Typography variant="body" color="secondary">
                Displayed as:{' '}
                <Typography as="strong" variant="body" color="primary" weight="semibold">
                  {customFormatDate
                    ? customFormatDate.toLocaleDateString(
                        selectedFormat.includes('/') ? 'en-GB' : 'en-US',
                        selectedFormat === 'yyyy-MM-dd'
                          ? { year: 'numeric', month: '2-digit', day: '2-digit' }
                          : { month: 'short', day: '2-digit', year: 'numeric' }
                      )
                    : 'None'}
                </Typography>
              </Typography>
            </div>
          </div>
          <div className={styles.codeBlock}>
            <Typography variant="small" color="secondary" className={styles.codeLabel}>
              Usage:
            </Typography>
            <pre className={styles.code}>
              {`<DatePicker
  label="Custom Format"
  value={date}
  onChange={setDate}
  format="dd/MM/yyyy"
/>`}
            </pre>
          </div>
        </section>
      )}

      {/* ============================================================
      3. Validation (Min/Max Dates)
      ============================================================ */}
      {activeSection === 'validation' && (
        <section className={styles.section}>
          <div className={styles.sectionHeader}>
            <Typography variant="h3" color="primary">
              Min/Max Date Validation
            </Typography>
            <Typography variant="small" color="muted">
              Dates outside the range are disabled
            </Typography>
          </div>
          <div className={styles.row}>
            <DatePicker
              label="Select Date (7-day window)"
              value={minMaxDate}
              onChange={handleMinMaxChange}
              minDate={minDate}
              maxDate={maxDate}
              placeholder="Pick a date..."
              helperText={`Valid range: ${minDate.toLocaleDateString()} – ${maxDate.toLocaleDateString()}`}
            />
            <div className={styles.preview}>
              <Typography variant="body" color="secondary">
                Selected:{' '}
                <Typography as="strong" variant="body" color="primary" weight="semibold">
                  {minMaxDate ? minMaxDate.toLocaleDateString() : 'None'}
                </Typography>
              </Typography>
              <Typography variant="small" color="muted">
                Only dates within ±7 days are selectable
              </Typography>
            </div>
          </div>
          <div className={styles.codeBlock}>
            <Typography variant="small" color="secondary" className={styles.codeLabel}>
              Usage:
            </Typography>
            <pre className={styles.code}>
              {`<DatePicker
  label="Select Date"
  value={date}
  onChange={setDate}
  minDate={minDate}
  maxDate={maxDate}
  helperText="Valid range: Jan 1 – Jan 31"
/>`}
            </pre>
          </div>
        </section>
      )}

      {/* ============================================================
      4. Disabled Dates
      ============================================================ */}
      {activeSection === 'disabled' && (
        <section className={styles.section}>
          <div className={styles.sectionHeader}>
            <Typography variant="h3" color="primary">
              Disabled Dates
            </Typography>
            <Typography variant="small" color="muted">
              Specific dates that cannot be selected
            </Typography>
          </div>
          <div className={styles.row}>
            <DatePicker
              label="Select Date"
              value={disabledDatesDate}
              onChange={handleDisabledDatesChange}
              disabledDates={disabledDatesList}
              placeholder="Pick a date..."
              helperText="Next 5 days are disabled"
            />
            <div className={styles.preview}>
              <Typography variant="body" color="secondary">
                Selected:{' '}
                <Typography as="strong" variant="body" color="primary" weight="semibold">
                  {disabledDatesDate ? disabledDatesDate.toLocaleDateString() : 'None'}
                </Typography>
              </Typography>
              <Typography variant="small" color="muted">
                Disabled: {disabledDatesList.map(d => d.getDate()).join(', ')}
              </Typography>
            </div>
          </div>
          <div className={styles.codeBlock}>
            <Typography variant="small" color="secondary" className={styles.codeLabel}>
              Usage:
            </Typography>
            <pre className={styles.code}>
              {`const disabledDates = [
  new Date(2024, 0, 1),
  new Date(2024, 0, 15),
  new Date(2024, 0, 31),
];

<DatePicker
  label="Select Date"
  value={date}
  onChange={setDate}
  disabledDates={disabledDates}
/>`}
            </pre>
          </div>
        </section>
      )}

      {/* ============================================================
      5. Highlighted Dates
      ============================================================ */}
      {activeSection === 'highlighted' && (
        <section className={styles.section}>
          <div className={styles.sectionHeader}>
            <Typography variant="h3" color="primary">
              Highlighted Dates
            </Typography>
            <Typography variant="small" color="muted">
              Dates with custom status colors (success, warning, danger, pending, info)
            </Typography>
          </div>
          <div className={styles.row}>
            <DatePicker
              label="Select Date"
              value={highlightedDate}
              onChange={handleHighlightedChange}
              highlightedDates={highlightedDatesList}
              placeholder="Pick a date..."
              helperText="Colors indicate different statuses"
            />
            <div className={styles.preview}>
              <Typography variant="body" color="secondary">
                Selected:{' '}
                <Typography as="strong" variant="body" color="primary" weight="semibold">
                  {highlightedDate ? highlightedDate.toLocaleDateString() : 'None'}
                </Typography>
              </Typography>
              <div className={styles.legend}>
                <div className={styles.legendItem}>
                  <span className={styles.legendColorSuccess} />
                  <Typography variant="small" color="secondary">Success</Typography>
                </div>
                <div className={styles.legendItem}>
                  <span className={styles.legendColorWarning} />
                  <Typography variant="small" color="secondary">Warning</Typography>
                </div>
                <div className={styles.legendItem}>
                  <span className={styles.legendColorDanger} />
                  <Typography variant="small" color="secondary">Danger</Typography>
                </div>
                <div className={styles.legendItem}>
                  <span className={styles.legendColorPending} />
                  <Typography variant="small" color="secondary">Pending</Typography>
                </div>
                <div className={styles.legendItem}>
                  <span className={styles.legendColorInfo} />
                  <Typography variant="small" color="secondary">Info</Typography>
                </div>
              </div>
            </div>
          </div>
          <div className={styles.codeBlock}>
            <Typography variant="small" color="secondary" className={styles.codeLabel}>
              Usage:
            </Typography>
            <pre className={styles.code}>
              {`const highlightedDates = [
  { date: new Date(2024, 0, 15), status: 'success' },
  { date: new Date(2024, 0, 20), status: 'warning' },
  { date: new Date(2024, 0, 25), status: 'danger' },
];

<DatePicker
  label="Select Date"
  value={date}
  onChange={setDate}
  highlightedDates={highlightedDates}
/>`}
            </pre>
          </div>
        </section>
      )}

      {/* ============================================================
      6. Clearable
      ============================================================ */}
      {activeSection === 'clearable' && (
        <section className={styles.section}>
          <div className={styles.sectionHeader}>
            <Typography variant="h3" color="primary">
              Clearable
            </Typography>
            <Typography variant="small" color="muted">
              Clear button to reset the selection (also inside calendar)
            </Typography>
          </div>
          <div className={styles.row}>
            <DatePicker
              label="Select Date"
              value={clearableDate}
              onChange={handleClearableChange}
              placeholder="Pick a date..."
              clearable
              helperText="Click the ✕ button to clear"
            />
            <div className={styles.preview}>
              <Typography variant="body" color="secondary">
                Selected:{' '}
                <Typography as="strong" variant="body" color="primary" weight="semibold">
                  {clearableDate ? clearableDate.toLocaleDateString() : 'None'}
                </Typography>
              </Typography>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleClearableChange(null)}
                className={styles.clearPreviewButton}
              >
                Clear from here
              </Button>
            </div>
          </div>
          <div className={styles.codeBlock}>
            <Typography variant="small" color="secondary" className={styles.codeLabel}>
              Usage:
            </Typography>
            <pre className={styles.code}>
              {`<DatePicker
  label="Select Date"
  value={date}
  onChange={setDate}
  clearable
/>`}
            </pre>
          </div>
        </section>
      )}

      {/* ============================================================
      7. Size Variants
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
              <DatePicker
                label="Small"
                value={new Date()}
                onChange={() => {}}
                size="sm"
                placeholder="Pick a date..."
              />
            </div>
            <div>
              <Typography variant="body" color="secondary" className={styles.sizeLabel}>
                Medium (md) – default
              </Typography>
              <DatePicker
                label="Medium"
                value={new Date()}
                onChange={() => {}}
                size="md"
                placeholder="Pick a date..."
              />
            </div>
            <div>
              <Typography variant="body" color="secondary" className={styles.sizeLabel}>
                Large (lg)
              </Typography>
              <DatePicker
                label="Large"
                value={new Date()}
                onChange={() => {}}
                size="lg"
                placeholder="Pick a date..."
              />
            </div>
          </div>
          <div className={styles.codeBlock}>
            <Typography variant="small" color="secondary" className={styles.codeLabel}>
              Usage:
            </Typography>
            <pre className={styles.code}>
              {`<DatePicker size="lg" />`}
            </pre>
          </div>
        </section>
      )}

      {/* ============================================================
      8. States
      ============================================================ */}
      {activeSection === 'states' && (
        <section className={styles.section}>
          <div className={styles.sectionHeader}>
            <Typography variant="h3" color="primary">
              States
            </Typography>
            <Typography variant="small" color="muted">
              Error, disabled, required, and helper text
            </Typography>
          </div>
          <div className={styles.grid}>
            <div>
              <Typography variant="body" color="secondary" className={styles.stateLabel}>
                Error
              </Typography>
              <DatePicker
                label="Error State"
                value={null}
                onChange={() => {}}
                error="Please select a valid date"
                placeholder="Pick a date..."
              />
            </div>
            <div>
              <Typography variant="body" color="secondary" className={styles.stateLabel}>
                Disabled
              </Typography>
              <DatePicker
                label="Disabled"
                value={new Date()}
                onChange={() => {}}
                disabled
                placeholder="Pick a date..."
              />
            </div>
            <div>
              <Typography variant="body" color="secondary" className={styles.stateLabel}>
                Required
              </Typography>
              <DatePicker
                label="Required Field"
                value={null}
                onChange={() => {}}
                required
                placeholder="Pick a date..."
                helperText="This field is required"
              />
            </div>
            <div>
              <Typography variant="body" color="secondary" className={styles.stateLabel}>
                With Helper Text
              </Typography>
              <DatePicker
                label="Helper Text"
                value={null}
                onChange={() => {}}
                helperText="Select a date for your expense"
                placeholder="Pick a date..."
              />
            </div>
          </div>
          <div className={styles.codeBlock}>
            <Typography variant="small" color="secondary" className={styles.codeLabel}>
              Usage:
            </Typography>
            <pre className={styles.code}>
              {`<DatePicker error="Please select a date" />
<DatePicker disabled />
<DatePicker required />
<DatePicker helperText="Helpful hint" />`}
            </pre>
          </div>
        </section>
      )}

      {/* ============================================================
      9. Real‑World: Expense Form
      ============================================================ */}
      {activeSection === 'real-world' && (
        <section className={styles.section}>
          <div className={styles.sectionHeader}>
            <Typography variant="h3" color="primary">
              Real‑World: Expense Form
            </Typography>
            <Typography variant="small" color="muted">
              Complete expense creation with date validation
            </Typography>
          </div>
          <div className={styles.formCard}>
            <div className={styles.formRow}>
              <Typography variant="body" color="secondary" className={styles.formLabel}>
                Expense Date
              </Typography>
              <DatePicker
                label=""
                value={formDate}
                onChange={handleFormChange}
                placeholder="When did this expense occur?"
                required
                error={formError}
                clearable
                helperText="Select the date of the expense"
                size="lg"
              />
            </div>
            <div className={styles.formRow}>
              <Typography variant="body" color="secondary" className={styles.formLabel}>
                Description
              </Typography>
              <input
                type="text"
                placeholder="Dinner with friends"
                className={styles.formInput}
              />
            </div>
            <div className={styles.formRow}>
              <Typography variant="body" color="secondary" className={styles.formLabel}>
                Amount
              </Typography>
              <input
                type="text"
                placeholder="0.00"
                className={styles.formInput}
              />
            </div>
            <div className={styles.actions}>
              <Button variant="primary" onClick={handleFormSubmit}>
                Add Expense
              </Button>
              {submitted && (
                <Typography variant="small" color="success">
                  ✓ Expense added for {formDate?.toLocaleDateString()}
                </Typography>
              )}
              {formError && (
                <Typography variant="small" color="error">
                  {formError}
                </Typography>
              )}
            </div>
          </div>
          <div className={styles.codeBlock}>
            <Typography variant="small" color="secondary" className={styles.codeLabel}>
              Usage:
            </Typography>
            <pre className={styles.code}>
              {`// In your expense form
<DatePicker
  label="Expense Date"
  value={date}
  onChange={setDate}
  required
  error={error}
  clearable
  helperText="Select the date of the expense"
  size="lg"
/>`}
            </pre>
          </div>
        </section>
      )}

      <footer className={styles.footer}>
        <Typography variant="small" color="muted">
          DatePicker Demo – Built with TrueSplit Design System
        </Typography>
      </footer>
    </div>
  );
}