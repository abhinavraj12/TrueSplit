'use client';

import React, { useState, useCallback, useMemo } from 'react';
import {
  CurrencySelector,
  CurrencyOption,
} from '@/shared/_components/molecules/CurrencySelector';
import { Typography } from '@/shared/_components/atoms/Typography';
import { Divider } from '@/shared/_components/atoms/Divider';
import { ThemeSwitcher } from '@/shared/_components/molecules/ThemeSwitcher';
import { Button } from '@/shared/_components/atoms/Button';
import styles from './page.module.css';

// --- Custom currency list for testing ---
const CUSTOM_CURRENCIES: CurrencyOption[] = [
  { code: 'BTC', symbol: '₿', name: 'Bitcoin' },
  { code: 'ETH', symbol: 'Ξ', name: 'Ethereum' },
  { code: 'XRP', symbol: 'XRP', name: 'Ripple' },
  { code: 'LTC', symbol: 'Ł', name: 'Litecoin' },
  { code: 'DOGE', symbol: 'Ð', name: 'Dogecoin' },
];

export default function CurrencySelectorDemo() {
  // --- State for different examples ---
  const [basicValue, setBasicValue] = useState<string>('USD');
  const [expenseValue, setExpenseValue] = useState<string>('EUR');
  const [settingsValue, setSettingsValue] = useState<string>('GBP');
  const [customCurrencyValue, setCustomCurrencyValue] = useState<string>('BTC');
  const [errorValue, setErrorValue] = useState<string>('');
  const [submitted, setSubmitted] = useState(false);
  const [clearableValue, setClearableValue] = useState<string>('USD');
  const [requiredError, setRequiredError] = useState<boolean | string>(false);

  // --- Handlers ---
  const handleBasicChange = useCallback((value: string) => {
    setBasicValue(value);
  }, []);

  const handleExpenseChange = useCallback((value: string) => {
    setExpenseValue(value);
  }, []);

  const handleSettingsChange = useCallback((value: string) => {
    setSettingsValue(value);
  }, []);

  const handleCustomChange = useCallback((value: string) => {
    setCustomCurrencyValue(value);
  }, []);

  const handleErrorChange = useCallback((value: string) => {
    setErrorValue(value);
    setRequiredError(false);
  }, []);

  const handleClearableChange = useCallback((value: string) => {
    setClearableValue(value);
  }, []);

  const handleSubmit = useCallback(() => {
    if (!errorValue) {
      setRequiredError('Please select a currency');
      return;
    }
    setRequiredError(false);
    setSubmitted(true);
    console.log('Submitted currency:', errorValue);
    setTimeout(() => setSubmitted(false), 3000);
  }, [errorValue]);

  const handleClearError = useCallback(() => {
    setRequiredError(false);
  }, []);

  // --- Memoized custom options for demo ---
  const customOptions = useMemo(() => CUSTOM_CURRENCIES, []);

  return (
    <div className={styles.container}>
      {/* Header */}
      <header className={styles.header}>
        <div className={styles.headerLeft}>
          <Typography variant="h1" color="primary">
            CurrencySelector – Real‑World Demo
          </Typography>
          <Typography variant="body" color="secondary">
            Currency selection dropdown with symbol, full name, and accessibility
          </Typography>
        </div>
        <ThemeSwitcher variant="both" />
      </header>

      <Divider variant="middle" label="Basic Usage" thickness={2} />

      {/* --- Basic --- */}
      <section className={styles.section}>
        <Typography variant="h3" color="primary">
          Basic Currency Selector
        </Typography>
        <div className={styles.row}>
          <CurrencySelector
            label="Default Currency"
            value={basicValue}
            onChange={handleBasicChange}
            placeholder="Select currency..."
            helperText="This is your default currency for all expenses"
          />
          <div className={styles.preview}>
            <Typography variant="body" color="secondary">
              Selected: <strong>{basicValue}</strong>
            </Typography>
          </div>
        </div>
        <div className={styles.codeBlock}>
          <Typography variant="small" color="secondary" className={styles.codeLabel}>
            Usage:
          </Typography>
          <pre className={styles.code}>
            {`<CurrencySelector
  label="Default Currency"
  value={currency}
  onChange={setCurrency}
  placeholder="Select currency..."
  helperText="This is your default currency for all expenses"
/>`}
          </pre>
        </div>
      </section>

      <Divider variant="middle" label="Expense Form" thickness={2} />

      {/* --- Expense Form (with validation) --- */}
      <section className={styles.section}>
        <Typography variant="h3" color="primary">
          Expense Form (with required validation)
        </Typography>
        <div className={styles.formCard}>
          <div className={styles.row}>
            <CurrencySelector
              label="Expense Currency"
              value={errorValue}
              onChange={handleErrorChange}
              placeholder="Select expense currency"
              required
              error={requiredError}
              helperText="Choose the currency for this expense"
              clearable
            />
          </div>
          <div className={styles.actions}>
            <Button
              variant="primary"
              onClick={handleSubmit}
              disabled={!!requiredError && !errorValue}
            >
              Add Expense
            </Button>
            {submitted && (
              <Typography variant="small" color="success">
                ✓ Expense added with currency: {errorValue}
              </Typography>
            )}
            {requiredError && typeof requiredError === 'string' && (
              <Typography variant="small" color="error">
                {requiredError}
              </Typography>
            )}
          </div>
        </div>
        <div className={styles.codeBlock}>
          <Typography variant="small" color="secondary" className={styles.codeLabel}>
            Usage:
          </Typography>
          <pre className={styles.code}>
            {`<CurrencySelector
  label="Expense Currency"
  value={currency}
  onChange={setCurrency}
  required
  error={error}
  helperText="Choose the currency for this expense"
  clearable
/>`}
          </pre>
        </div>
      </section>

      <Divider variant="middle" label="Display Options" thickness={2} />

      {/* --- Display Options --- */}
      <section className={styles.section}>
        <Typography variant="h3" color="primary">
          Display Options
        </Typography>
        <div className={styles.grid}>
          <div>
            <Typography variant="body" color="secondary" className={styles.label}>
              Default (symbol only)
            </Typography>
            <CurrencySelector
              value={basicValue}
              onChange={() => {}}
              showSymbol={true}
              showFullName={false}
              size="sm"
            />
          </div>
          <div>
            <Typography variant="body" color="secondary" className={styles.label}>
              Full name only
            </Typography>
            <CurrencySelector
              value={basicValue}
              onChange={() => {}}
              showSymbol={false}
              showFullName={true}
              size="sm"
            />
          </div>
          <div>
            <Typography variant="body" color="secondary" className={styles.label}>
              Symbol + full name
            </Typography>
            <CurrencySelector
              value={basicValue}
              onChange={() => {}}
              showSymbol={true}
              showFullName={true}
              size="sm"
            />
          </div>
          <div>
            <Typography variant="body" color="secondary" className={styles.label}>
              Code only (no symbol)
            </Typography>
            <CurrencySelector
              value={basicValue}
              onChange={() => {}}
              showSymbol={false}
              showFullName={false}
              size="sm"
            />
          </div>
        </div>
        <div className={styles.codeBlock}>
          <Typography variant="small" color="secondary" className={styles.codeLabel}>
            Usage:
          </Typography>
          <pre className={styles.code}>
            {`<CurrencySelector
  showSymbol={true}
  showFullName={false}  // or true
/>`}
          </pre>
        </div>
      </section>

      <Divider variant="middle" label="Custom Currencies" thickness={2} />

      {/* --- Custom Currencies (crypto) --- */}
      <section className={styles.section}>
        <Typography variant="h3" color="primary">
          Custom Currencies (Crypto)
        </Typography>
        <Typography variant="body" color="secondary" className={styles.hint}>
          Pass a custom list of currencies via the `currencies` prop
        </Typography>
        <div className={styles.row}>
          <CurrencySelector
            label="Cryptocurrency"
            value={customCurrencyValue}
            onChange={handleCustomChange}
            currencies={customOptions}
            showSymbol={true}
            showFullName={true}
            placeholder="Select crypto..."
            helperText="Supports Bitcoin, Ethereum, and more"
          />
          <div className={styles.preview}>
            <Typography variant="body" color="secondary">
              Selected: <strong>{customCurrencyValue}</strong>
            </Typography>
          </div>
        </div>
        <div className={styles.codeBlock}>
          <Typography variant="small" color="secondary" className={styles.codeLabel}>
            Usage:
          </Typography>
          <pre className={styles.code}>
            {`const CUSTOM_CURRENCIES = [
  { code: 'BTC', symbol: '₿', name: 'Bitcoin' },
  { code: 'ETH', symbol: 'Ξ', name: 'Ethereum' },
];

<CurrencySelector
  currencies={CUSTOM_CURRENCIES}
  showSymbol={true}
  showFullName={true}
/>`}
          </pre>
        </div>
      </section>

      <Divider variant="middle" label="States" thickness={2} />

      {/* --- States: Disabled, Error, Clearable --- */}
      <section className={styles.section}>
        <Typography variant="h3" color="primary">
          States
        </Typography>
        <div className={styles.grid}>
          <div>
            <Typography variant="body" color="secondary" className={styles.label}>
              Disabled
            </Typography>
            <CurrencySelector
              value="USD"
              onChange={() => {}}
              disabled
              label="Disabled Currency"
            />
          </div>
          <div>
            <Typography variant="body" color="secondary" className={styles.label}>
              Error state
            </Typography>
            <CurrencySelector
              value=""
              onChange={() => {}}
              error="Please select a currency"
              label="Error Example"
            />
          </div>
          <div>
            <Typography variant="body" color="secondary" className={styles.label}>
              Clearable
            </Typography>
            <CurrencySelector
              value={clearableValue}
              onChange={handleClearableChange}
              clearable
              label="Clearable Currency"
              helperText="Click the ✕ button to clear"
            />
          </div>
          <div>
            <Typography variant="body" color="secondary" className={styles.label}>
              With helper text
            </Typography>
            <CurrencySelector
              value="EUR"
              onChange={() => {}}
              helperText="This is the default currency for your profile"
              label="Profile Currency"
            />
          </div>
        </div>
        <div className={styles.codeBlock}>
          <Typography variant="small" color="secondary" className={styles.codeLabel}>
            Usage:
          </Typography>
          <pre className={styles.code}>
            {`<CurrencySelector disabled />
<CurrencySelector error="Please select a currency" />
<CurrencySelector clearable />
<CurrencySelector helperText="Helpful hint" />`}
          </pre>
        </div>
      </section>

      <Divider variant="middle" label="Size Variants" thickness={2} />

      {/* --- Sizes --- */}
      <section className={styles.section}>
        <Typography variant="h3" color="primary">
          Size Variants
        </Typography>
        <div className={styles.grid}>
          <div>
            <Typography variant="body" color="secondary" className={styles.label}>
              Small (sm)
            </Typography>
            <CurrencySelector
              value="USD"
              onChange={() => {}}
              size="sm"
              label="Small"
            />
          </div>
          <div>
            <Typography variant="body" color="secondary" className={styles.label}>
              Medium (md) – default
            </Typography>
            <CurrencySelector
              value="USD"
              onChange={() => {}}
              size="md"
              label="Medium"
            />
          </div>
          <div>
            <Typography variant="body" color="secondary" className={styles.label}>
              Large (lg)
            </Typography>
            <CurrencySelector
              value="USD"
              onChange={() => {}}
              size="lg"
              label="Large"
            />
          </div>
        </div>
        <div className={styles.codeBlock}>
          <Typography variant="small" color="secondary" className={styles.codeLabel}>
            Usage:
          </Typography>
          <pre className={styles.code}>
            {`<CurrencySelector size="lg" />`}
          </pre>
        </div>
      </section>

      <Divider variant="middle" label="Settings Panel (Real‑World)" thickness={2} />

      {/* --- Settings panel simulation --- */}
      <section className={styles.section}>
        <Typography variant="h3" color="primary">
          Settings Panel (Real‑World)
        </Typography>
        <Typography variant="body" color="secondary" className={styles.hint}>
          User preferences for currency and notification settings
        </Typography>
        <div className={styles.settingsPanel}>
          <div className={styles.settingRow}>
            <Typography variant="body" color="secondary" className={styles.settingLabel}>
              Default Currency
            </Typography>
            <CurrencySelector
              value={settingsValue}
              onChange={handleSettingsChange}
              size="sm"
              clearable
              helperText="All expenses will use this currency by default"
            />
          </div>
          <div className={styles.settingRow}>
            <Typography variant="body" color="secondary" className={styles.settingLabel}>
              Notification Currency
            </Typography>
            <CurrencySelector
              value="EUR"
              onChange={() => {}}
              size="sm"
              disabled
              helperText="Currency for email notifications (read‑only)"
            />
          </div>
          <div className={styles.settingRow}>
            <Typography variant="body" color="secondary" className={styles.settingLabel}>
              Report Currency
            </Typography>
            <CurrencySelector
              value="GBP"
              onChange={() => {}}
              size="sm"
              showSymbol={true}
              showFullName={true}
              helperText="Currency for exported reports"
            />
          </div>
        </div>
        <div className={styles.codeBlock}>
          <Typography variant="small" color="secondary" className={styles.codeLabel}>
            Usage:
          </Typography>
          <pre className={styles.code}>
            {`// In your settings component
<CurrencySelector
  value={settings.currency}
  onChange={handleCurrencyChange}
  size="sm"
  clearable
  helperText="All expenses will use this currency by default"
/>`}
          </pre>
        </div>
      </section>

      <footer className={styles.footer}>
        <Typography variant="small" color="muted">
          CurrencySelector Demo – Built with TrueSplit Design System
        </Typography>
      </footer>
    </div>
  );
}