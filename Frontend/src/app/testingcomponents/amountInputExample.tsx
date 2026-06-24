'use client';

import { useState } from 'react';
import { AmountInput } from '@/shared/_components/molecules/AmountInput';
import { Typography } from '@/shared/_components/atoms/Typography';
import { Button } from '@/shared/_components/atoms/Button';

export default function AmountInputExample() {
  const [amount1, setAmount1] = useState<number | string>('');
  const [amount2, setAmount2] = useState<number | string>(42.50);
  const [amount3, setAmount3] = useState<number | string>('');
  const [amount4, setAmount4] = useState<number | string>('');
  const [log, setLog] = useState<string[]>([]);

  const addLog = (message: string) => {
    setLog((prev) => [...prev, `${new Date().toLocaleTimeString()}: ${message}`]);
  };

  const clearLog = () => setLog([]);

  return (
    <div style={{ maxWidth: '800px', margin: '2rem auto', padding: '2rem' }}>
      <Typography variant="h1" color="primary" weight="bold" style={{ marginBottom: '0.5rem' }}>
        AmountInput Testing
      </Typography>
      <Typography variant="body" color="secondary" style={{ marginBottom: '2rem' }}>
        Currency input with formatting and validation
      </Typography>

      {/* ===== Basic ===== */}
      <div
        style={{
          padding: '1.5rem',
          backgroundColor: 'var(--color-bg-surface)',
          borderRadius: 'var(--radius-lg)',
          border: '1px solid var(--color-border)',
          marginBottom: '1.5rem',
        }}
      >
        <Typography variant="h4" color="primary" weight="semibold" style={{ marginBottom: '0.5rem' }}>
          Basic
        </Typography>
        <AmountInput
          label="Amount"
          currencySymbol="$"
          placeholder="0.00"
          value={amount1}
          onChange={(val) => {
            setAmount1(val);
            addLog(`Amount changed: ${val}`);
          }}
        />
        <Typography variant="small" color="muted" style={{ marginTop: '0.5rem' }}>
          Value: {amount1 || 'empty'}
        </Typography>
      </div>

      {/* ===== With Default Value ===== */}
      <div
        style={{
          padding: '1.5rem',
          backgroundColor: 'var(--color-bg-surface)',
          borderRadius: 'var(--radius-lg)',
          border: '1px solid var(--color-border)',
          marginBottom: '1.5rem',
        }}
      >
        <Typography variant="h4" color="primary" weight="semibold" style={{ marginBottom: '0.5rem' }}>
          Default Value
        </Typography>
        <AmountInput
          label="Amount"
          currencySymbol="$"
          defaultValue={42.50}
          onChange={(val) => {
            setAmount2(val);
            addLog(`Default amount changed: ${val}`);
          }}
        />
        <Typography variant="small" color="muted" style={{ marginTop: '0.5rem' }}>
          Value: {amount2}
        </Typography>
      </div>

      {/* ===== Different Currencies ===== */}
      <div
        style={{
          padding: '1.5rem',
          backgroundColor: 'var(--color-bg-surface)',
          borderRadius: 'var(--radius-lg)',
          border: '1px solid var(--color-border)',
          marginBottom: '1.5rem',
        }}
      >
        <Typography variant="h4" color="primary" weight="semibold" style={{ marginBottom: '0.5rem' }}>
          Different Currencies
        </Typography>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <AmountInput
            label="USD"
            currencySymbol="$"
            currencyCode="USD"
            showCurrencyCode
            placeholder="0.00"
            value={amount3}
            onChange={(val) => {
              setAmount3(val);
              addLog(`USD: ${val}`);
            }}
          />
          <AmountInput
            label="EUR"
            currencySymbol="€"
            currencyCode="EUR"
            showCurrencyCode
            placeholder="0.00"
            value={amount4}
            onChange={(val) => {
              setAmount4(val);
              addLog(`EUR: ${val}`);
            }}
          />
        </div>
      </div>

      {/* ===== Sizes ===== */}
      <div
        style={{
          padding: '1.5rem',
          backgroundColor: 'var(--color-bg-surface)',
          borderRadius: 'var(--radius-lg)',
          border: '1px solid var(--color-border)',
          marginBottom: '1.5rem',
        }}
      >
        <Typography variant="h4" color="primary" weight="semibold" style={{ marginBottom: '0.5rem' }}>
          Sizes
        </Typography>
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'flex-start' }}>
          <div style={{ flex: 1, minWidth: '150px' }}>
            <AmountInput
              label="sm"
              size="sm"
              currencySymbol="$"
              defaultValue={10}
            />
          </div>
          <div style={{ flex: 1, minWidth: '150px' }}>
            <AmountInput
              label="md"
              size="md"
              currencySymbol="$"
              defaultValue={20}
            />
          </div>
          <div style={{ flex: 1, minWidth: '150px' }}>
            <AmountInput
              label="lg"
              size="lg"
              currencySymbol="$"
              defaultValue={30}
            />
          </div>
        </div>
      </div>

      {/* ===== States ===== */}
      <div
        style={{
          padding: '1.5rem',
          backgroundColor: 'var(--color-bg-surface)',
          borderRadius: 'var(--radius-lg)',
          border: '1px solid var(--color-border)',
          marginBottom: '1.5rem',
        }}
      >
        <Typography variant="h4" color="primary" weight="semibold" style={{ marginBottom: '0.5rem' }}>
          States
        </Typography>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <AmountInput
            label="Error"
            currencySymbol="$"
            error="Please enter a valid amount"
            placeholder="0.00"
          />
          <AmountInput
            label="Success"
            currencySymbol="$"
            success
            defaultValue={99.99}
          />
        </div>
        <div style={{ marginTop: '1rem' }}>
          <AmountInput
            label="Disabled"
            currencySymbol="$"
            disabled
            defaultValue={50}
          />
        </div>
      </div>

      {/* ===== Helper Text ===== */}
      <div
        style={{
          padding: '1.5rem',
          backgroundColor: 'var(--color-bg-surface)',
          borderRadius: 'var(--radius-lg)',
          border: '1px solid var(--color-border)',
          marginBottom: '1.5rem',
        }}
      >
        <Typography variant="h4" color="primary" weight="semibold" style={{ marginBottom: '0.5rem' }}>
          Helper Text
        </Typography>
        <AmountInput
          label="Amount"
          currencySymbol="$"
          helperText="Enter the expense amount (max 2 decimal places)"
          placeholder="0.00"
        />
      </div>

      {/* ===== Activity Log ===== */}
      <div
        style={{
          padding: '1.5rem',
          backgroundColor: 'var(--color-bg-surface)',
          borderRadius: 'var(--radius-lg)',
          border: '1px solid var(--color-border)',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <Typography variant="h4" color="primary" weight="semibold">
            Activity Log
          </Typography>
          <Button variant="outline" size="sm" onClick={clearLog}>
            Clear Log
          </Button>
        </div>
        <div
          style={{
            maxHeight: '200px',
            overflowY: 'auto',
            backgroundColor: 'var(--color-bg-elevated)',
            borderRadius: 'var(--radius-sm)',
            padding: '0.5rem',
            border: '1px solid var(--color-border)',
          }}
        >
          {log.length === 0 ? (
            <Typography variant="small" color="muted" style={{ padding: '0.5rem' }}>
              No activity yet. Interact with the inputs above.
            </Typography>
          ) : (
            log.map((entry, index) => (
              <Typography
                key={index}
                variant="small"
                color="secondary"
                style={{
                  padding: '0.25rem 0.5rem',
                  borderBottom: '1px solid var(--color-divider)',
                }}
              >
                {entry}
              </Typography>
            ))
          )}
        </div>
      </div>
    </div>
  );
}