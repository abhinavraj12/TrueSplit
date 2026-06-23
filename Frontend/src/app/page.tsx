'use client';

import { useState, useEffect } from 'react';
import { Typography } from '@/shared/_components/atoms/Typography';

export default function Home() {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  // Apply theme attribute to the root element
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  return (
    <main style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto' }}>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '1.5rem',
        }}
      >
        <Typography variant="h1" color="primary" weight="bold">
          TrueSplit – Typography Test
        </Typography>
        <button
          onClick={toggleTheme}
          style={{
            padding: '0.5rem 1rem',
            background: 'var(--color-btn-primary-bg)',
            color: 'var(--color-btn-primary-text)',
            border: 'none',
            borderRadius: 'var(--radius-md)',
            cursor: 'pointer',
            fontSize: 'var(--font-size-sm)',
            fontWeight: 'var(--font-weight-medium)',
            transition: 'all var(--duration-fast) var(--easing-standard)',
          }}
        >
          Switch to {theme === 'light' ? 'Dark' : 'Light'} Mode
        </button>
      </div>

      <Typography variant="h2" color="secondary" weight="semibold" style={{ marginTop: '1.5rem' }}>
        Headings
      </Typography>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        <Typography variant="h1">h1 – The quick brown fox</Typography>
        <Typography variant="h2">h2 – The quick brown fox</Typography>
        <Typography variant="h3">h3 – The quick brown fox</Typography>
        <Typography variant="h4">h4 – The quick brown fox</Typography>
        <Typography variant="h5">h5 – The quick brown fox</Typography>
        <Typography variant="h6">h6 – The quick brown fox</Typography>
        <Typography variant="body">body – The quick brown fox jumps over the lazy dog.</Typography>
        <Typography variant="small">small – The quick brown fox</Typography>
        <Typography variant="caption">caption – The quick brown fox</Typography>
      </div>

      <Typography variant="h2" color="secondary" weight="semibold" style={{ marginTop: '2rem' }}>
        Colors
      </Typography>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
        <Typography color="primary">primary – This is primary text</Typography>
        <Typography color="secondary">secondary – This is secondary text</Typography>
        <Typography color="muted">muted – This is muted text</Typography>
        <Typography color="success">success – This is success text</Typography>
        <Typography color="warning">warning – This is warning text</Typography>
        <Typography color="error">error – This is error text</Typography>
        <Typography color="info">info – This is info text</Typography>
        <Typography color="link">link – This is link text</Typography>
      </div>

      <Typography variant="h2" color="secondary" weight="semibold" style={{ marginTop: '2rem' }}>
        Truncation
      </Typography>

      <div style={{ width: '200px', border: '1px solid var(--color-border)', padding: '0.5rem' }}>
        <Typography truncate>
          This is a very long text that will be truncated with an ellipsis.
        </Typography>
      </div>

      <Typography variant="h2" color="secondary" weight="semibold" style={{ marginTop: '2rem' }}>
        Alignment
      </Typography>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
        <Typography align="left">Left aligned</Typography>
        <Typography align="center">Center aligned</Typography>
        <Typography align="right">Right aligned</Typography>
        <Typography align="justify" style={{ maxWidth: '300px' }}>
          Justified text: This is a longer paragraph that demonstrates text justification.
        </Typography>
      </div>
    </main>
  );
}