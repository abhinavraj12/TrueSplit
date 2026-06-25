'use client';

import React, { useState, useCallback } from 'react';
import { AmountInput } from '@/shared/_components/molecules/AmountInput';
import { Button } from '@/shared/_components/atoms/Button';
import { Typography } from '@/shared/_components/atoms/Typography';
import { Divider } from '@/shared/_components/atoms/Divider';
import { ThemeSwitcher } from '@/shared/_components/molecules/ThemeSwitcher';
import styles from './page.module.css';

export default function AmountInputDemo() {
  // ----- State for examples -----
  const [basicValue, setBasicValue] = useState<number | null>(null);
  const [expenseValue, setExpenseValue] = useState<number | null>(null);
  const [settleValue, setSettleValue] = useState<number | null>(null);
  const [negativeValue, setNegativeValue] = useState<number | null>(null);
  const [validationValue, setValidationValue] = useState<number | null>(null);
  const [isValid, setIsValid] = useState(true);
  const [submitted, setSubmitted] = useState(false);

  // ----- Handlers -----
  const handleExpenseSubmit = useCallback(() => {
    if (expenseValue === null || expenseValue <= 0) {
      // Simulate validation error
      setIsValid(false);
      return;
    }
    setIsValid(true);
    setSubmitted(true);
    // In a real app, you would dispatch an action here
    console.log('Expense submitted:', expenseValue);
    setTimeout(() => setSubmitted(false), 3000);
  }, [expenseValue]);

  const handleValidationChange = useCallback(
    (val: number | null) => {
      setValidationValue(val);
      // Validate: must be > 0
      setIsValid(val !== null && val > 0);
    },
    [],
  );

  // ----- Currency options for demo -----
  const currencies = [
    { code: 'USD', symbol: '$', name: 'US Dollar' },
    { code: 'EUR', symbol: '€', name: 'Euro' },
    { code: 'GBP', symbol: '£', name: 'British Pound' },
    { code: 'INR', symbol: '₹', name: 'Indian Rupee' },
    { code: 'JPY', symbol: '¥', name: 'Japanese Yen' },
  ];
  const [selectedCurrency, setSelectedCurrency] = useState(currencies[0]);

  return (
    <div className={styles.container}>
      {/* Header with ThemeSwitcher */}
      <header className={styles.header}>
        <Typography variant="h1" color="primary">
          AmountInput – Real‑World Demo
        </Typography>
        <ThemeSwitcher variant="both" />
      </header>

      <Divider variant="middle" label="Basic Usage" thickness={2} />

      {/* ----- Basic Example ----- */}
      <section className={styles.section}>
        <Typography variant="h3" color="primary">
          Simple Amount Input
        </Typography>
        <div className={styles.row}>
          <AmountInput
            label="Amount"
            value={basicValue}
            onChange={setBasicValue}
            currencySymbol="$"
            currencyCode="USD"
            showCurrencyCode
            placeholder="0.00"
            decimals={4}
            clearable
            helperText="Enter any amount (e.g., 12.50)"
          />
          <div className={styles.preview}>
            <Typography variant="body" color="secondary">
              Current value:{' '}
              <Typography as="strong" variant="body" color="primary" weight="semibold">
                {basicValue !== null ? basicValue.toFixed(2) : '—'}
              </Typography>
            </Typography>
          </div>
        </div>
      </section>

      <Divider variant="middle" label="Expense Creation" thickness={2} />

      {/* ----- Expense Form Example ----- */}
      <section className={styles.section}>
        <Typography variant="h3" color="primary">
          Expense Form (with validation)
        </Typography>
        <div className={styles.formCard}>
          <div className={styles.row}>
            <AmountInput
              label="Expense Amount"
              value={expenseValue}
              onChange={setExpenseValue}
              currencySymbol="₹"
              currencyCode="INR"
              showCurrencyCode
              placeholder="0.00"
              required
              clearable
              error={!isValid ? 'Amount must be greater than zero' : false}
              helperText="Enter the total expense amount"
              size="lg"
            />
          </div>
          <div className={styles.actions}>
            <Button
              variant="primary"
              onClick={handleExpenseSubmit}
              disabled={!isValid || expenseValue === null}
            >
              Add Expense
            </Button>
            {submitted && (
              <Typography variant="small" color="success">
                ✓ Expense added!
              </Typography>
            )}
          </div>
        </div>
      </section>

      <Divider variant="middle" label="Settlement" thickness={2} />

      {/* ----- Settlement Example ----- */}
      <section className={styles.section}>
        <Typography variant="h3" color="primary">
          Settle Up (with negative support)
        </Typography>
        <div className={styles.row}>
          <AmountInput
            label="You owe"
            value={settleValue}
            onChange={setSettleValue}
            currencySymbol="€"
            currencyCode="EUR"
            showCurrencyCode
            placeholder="0.00"
            allowNegative
            clearable
            helperText="Negative means they owe you"
            size="md"
          />
          <div className={styles.preview}>
            <Typography variant="body" color="secondary">
              Balance:{' '}
              <Typography
                as="strong"
                variant="body"
                color={settleValue !== null && settleValue < 0 ? 'error' : 'success'}
                weight="semibold"
              >
                {settleValue !== null
                  ? `${settleValue < 0 ? '-' : '+'}${Math.abs(settleValue).toFixed(2)}`
                  : '—'}
              </Typography>
            </Typography>
          </div>
        </div>
      </section>

      <Divider variant="middle" label="Negative Values" thickness={2} />

      {/* ----- Negative Values Example ----- */}
      <section className={styles.section}>
        <Typography variant="h3" color="primary">
          Allow Negative Amounts
        </Typography>
        <div className={styles.row}>
          <AmountInput
            label="Adjustment"
            value={negativeValue}
            onChange={setNegativeValue}
            currencySymbol="$"
            currencyCode="USD"
            showCurrencyCode={false}
            allowNegative
            placeholder="0.00"
            clearable
            helperText="Use negative for credits"
            size="sm"
          />
          <div className={styles.preview}>
            <Typography variant="body" color="secondary">
              Value:{' '}
              <Typography
                as="strong"
                variant="body"
                color={negativeValue !== null && negativeValue < 0 ? 'error' : 'success'}
                weight="semibold"
              >
                {negativeValue !== null ? negativeValue.toFixed(2) : '—'}
              </Typography>
            </Typography>
          </div>
        </div>
      </section>

      <Divider variant="middle" label="Validation & Constraints" thickness={2} />

      {/* ----- Validation with min/max ----- */}
      <section className={styles.section}>
        <Typography variant="h3" color="primary">
          With Min/Max Validation
        </Typography>
        <div className={styles.row}>
          <AmountInput
            label="Amount (min: 5, max: 100)"
            value={validationValue}
            onChange={handleValidationChange}
            currencySymbol="£"
            currencyCode="GBP"
            showCurrencyCode
            min={5}
            max={100}
            error={!isValid ? 'Amount must be between 5 and 100' : false}
            helperText="Try entering 3 or 150 to see validation"
            clearable
            size="md"
          />
          <div className={styles.preview}>
            <Typography variant="body" color="secondary">
              Valid:{' '}
              <Typography
                as="strong"
                variant="body"
                color={isValid ? 'success' : 'error'}
                weight="semibold"
              >
                {isValid ? '✅ Yes' : '❌ No'}
              </Typography>
            </Typography>
          </div>
        </div>
      </section>

      <Divider variant="middle" label="Currency Selector" thickness={2} />

      {/* ----- Currency Selector ----- */}
      <section className={styles.section}>
        <Typography variant="h3" color="primary">
          Change Currency
        </Typography>
        <div className={styles.row}>
          <div className={styles.currencySelector}>
            <Typography variant="body" color="secondary" className={styles.label}>
              Select currency:
            </Typography>
            <select
              value={selectedCurrency.code}
              onChange={(e) => {
                const found = currencies.find((c) => c.code === e.target.value);
                if (found) setSelectedCurrency(found);
              }}
              className={styles.select}
            >
              {currencies.map((c) => (
                <option key={c.code} value={c.code}>
                  {c.symbol} – {c.name}
                </option>
              ))}
            </select>
          </div>
          <AmountInput
            label="Amount in selected currency"
            value={null}
            onChange={() => {}}
            currencySymbol={selectedCurrency.symbol}
            currencyCode={selectedCurrency.code}
            showCurrencyCode
            placeholder="0.00"
            clearable
            size="md"
          />
        </div>
      </section>

      <Divider variant="middle" label="Disabled & Read‑Only" thickness={2} />

      {/* ----- Disabled and Read-Only ----- */}
      <section className={styles.section}>
        <Typography variant="h3" color="primary">
          Disabled &amp; Read‑Only States
        </Typography>
        <div className={styles.row}>
          <AmountInput
            label="Disabled"
            value={42.5}
            currencySymbol="€"
            currencyCode="EUR"
            showCurrencyCode
            disabled
          />
          <AmountInput
            label="Read‑Only"
            value={99.99}
            currencySymbol="$"
            currencyCode="USD"
            showCurrencyCode
            readOnly
          />
        </div>
      </section>

      <Divider variant="middle" label="Sizes" thickness={2} />

      {/* ----- Sizes ----- */}
      <section className={styles.section}>
        <Typography variant="h3" color="primary">
          Size Variants
        </Typography>
        <div className={styles.row}>
          <AmountInput
            label="Small (sm)"
            size="sm"
            currencySymbol="$"
            placeholder="0.00"
            value={12.5}
            onChange={() => {}}
          />
          <AmountInput
            label="Medium (md)"
            size="md"
            currencySymbol="$"
            placeholder="0.00"
            value={12.5}
            onChange={() => {}}
          />
          <AmountInput
            label="Large (lg)"
            size="lg"
            currencySymbol="$"
            placeholder="0.00"
            value={12.5}
            onChange={() => {}}
          />
        </div>
      </section>

      <Divider variant="middle" label="States" thickness={2} />

      {/* ----- Error & Success States ----- */}
      <section className={styles.section}>
        <Typography variant="h3" color="primary">
          Error &amp; Success States
        </Typography>
        <div className={styles.row}>
          <AmountInput
            label="Error"
            value={0}
            onChange={() => {}}
            currencySymbol="$"
            error="Invalid amount"
            placeholder="0.00"
          />
          <AmountInput
            label="Success"
            value={25.0}
            onChange={() => {}}
            currencySymbol="$"
            success
            helperText="Valid amount"
            placeholder="0.00"
          />
          <AmountInput
            label="With Helper Text"
            value={null}
            onChange={() => {}}
            currencySymbol="€"
            helperText="Enter a positive number"
            placeholder="0.00"
          />
        </div>
      </section>

      <footer className={styles.footer}>
        <Typography variant="small" color="muted">
          AmountInput Demo – Built with TrueSplit Design System
        </Typography>
      </footer>
    </div>
  );
}