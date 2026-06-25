// F:\PERSONAL\TrueSplit\frontend\src\app\testing\spinner\page.tsx

'use client';

import React, { useState } from 'react';
import { Spinner } from '@/shared/_components/atoms/Spinner';
import { Typography } from '@/shared/_components/atoms/Typography';
import { Button } from '@/shared/_components/atoms/Button';
import { ThemeSwitcher } from '@/shared/_components/molecules/ThemeSwitcher';

/**
 * Testing page for the Spinner component.
 * Demonstrates all sizes, colors, speeds, and real-world scenarios.
 */
export default function SpinnerTestPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [showDelayed, setShowDelayed] = useState(false);

  // Simulate async loading
  const handleSimulateLoading = () => {
    setIsLoading(true);
    setTimeout(() => setIsLoading(false), 3000);
  };

  // Toggle delayed spinner
  const handleToggleDelayed = () => {
    setShowDelayed(!showDelayed);
  };

  return (
    <div style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <Typography variant="h1">Spinner Component – Real‑World Test</Typography>
        <ThemeSwitcher variant="both" />
      </div>

      <hr style={{ margin: '2rem 0' }} />

      {/* 1. All Sizes */}
      <section>
        <Typography variant="h2" color="secondary" style={{ marginBottom: '1rem' }}>1. Sizes</Typography>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '2rem', alignItems: 'center' }}>
          <div style={{ textAlign: 'center' }}>
            <Spinner size="xs" />
            <Typography variant="small" color="muted">XS</Typography>
          </div>
          <div style={{ textAlign: 'center' }}>
            <Spinner size="sm" />
            <Typography variant="small" color="muted">SM</Typography>
          </div>
          <div style={{ textAlign: 'center' }}>
            <Spinner size="md" />
            <Typography variant="small" color="muted">MD (default)</Typography>
          </div>
          <div style={{ textAlign: 'center' }}>
            <Spinner size="lg" />
            <Typography variant="small" color="muted">LG</Typography>
          </div>
          <div style={{ textAlign: 'center' }}>
            <Spinner size="xl" />
            <Typography variant="small" color="muted">XL</Typography>
          </div>
        </div>
        <Typography variant="small" color="muted">All available sizes.</Typography>
      </section>

      <hr style={{ margin: '2rem 0' }} />

      {/* 2. All Colors */}
      <section>
        <Typography variant="h2" color="secondary" style={{ marginBottom: '1rem' }}>2. Colors</Typography>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '2rem', alignItems: 'center' }}>
          <div style={{ textAlign: 'center' }}>
            <Spinner color="default" />
            <Typography variant="small" color="muted">Default</Typography>
          </div>
          <div style={{ textAlign: 'center' }}>
            <Spinner color="primary" />
            <Typography variant="small" color="muted">Primary</Typography>
          </div>
          <div style={{ textAlign: 'center' }}>
            <Spinner color="success" />
            <Typography variant="small" color="muted">Success</Typography>
          </div>
          <div style={{ textAlign: 'center' }}>
            <Spinner color="warning" />
            <Typography variant="small" color="muted">Warning</Typography>
          </div>
          <div style={{ textAlign: 'center' }}>
            <Spinner color="error" />
            <Typography variant="small" color="muted">Error</Typography>
          </div>
          <div style={{ textAlign: 'center' }}>
            <Spinner color="info" />
            <Typography variant="small" color="muted">Info</Typography>
          </div>
          <div style={{ textAlign: 'center' }}>
            <Spinner color="link" />
            <Typography variant="small" color="muted">Link</Typography>
          </div>
        </div>
        <Typography variant="small" color="muted">All available colors.</Typography>
      </section>

      <hr style={{ margin: '2rem 0' }} />

      {/* 3. Speeds */}
      <section>
        <Typography variant="h2" color="secondary" style={{ marginBottom: '1rem' }}>3. Speeds</Typography>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '2rem', alignItems: 'center' }}>
          <div style={{ textAlign: 'center' }}>
            <Spinner speed="slow" />
            <Typography variant="small" color="muted">Slow</Typography>
          </div>
          <div style={{ textAlign: 'center' }}>
            <Spinner speed="normal" />
            <Typography variant="small" color="muted">Normal</Typography>
          </div>
          <div style={{ textAlign: 'center' }}>
            <Spinner speed="fast" />
            <Typography variant="small" color="muted">Fast</Typography>
          </div>
        </div>
        <Typography variant="small" color="muted">Animation speeds: slow, normal, fast.</Typography>
      </section>

      <hr style={{ margin: '2rem 0' }} />

      {/* 4. Decorative Mode */}
      <section>
        <Typography variant="h2" color="secondary" style={{ marginBottom: '1rem' }}>4. Decorative Mode</Typography>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '2rem', alignItems: 'center' }}>
          <div style={{ textAlign: 'center' }}>
            <Spinner decorative label="Hidden from screen readers" />
            <Typography variant="small" color="muted">Decorative (aria-hidden)</Typography>
          </div>
          <div style={{ textAlign: 'center' }}>
            <Spinner label="Announced to screen readers" />
            <Typography variant="small" color="muted">Accessible (role=)</Typography>
          </div>
        </div>
        <Typography variant="small" color="muted">Decorative spinners are hidden from screen readers.</Typography>
      </section>

      <hr style={{ margin: '2rem 0' }} />

      {/* 5. Custom Thickness */}
      <section>
        <Typography variant="h2" color="secondary" style={{ marginBottom: '1rem' }}>5. Custom Thickness</Typography>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '2rem', alignItems: 'center' }}>
          <div style={{ textAlign: 'center' }}>
            <Spinner thickness={1} />
            <Typography variant="small" color="muted">1px</Typography>
          </div>
          <div style={{ textAlign: 'center' }}>
            <Spinner thickness={3} />
            <Typography variant="small" color="muted">3px (default for md)</Typography>
          </div>
          <div style={{ textAlign: 'center' }}>
            <Spinner thickness={6} />
            <Typography variant="small" color="muted">6px</Typography>
          </div>
          <div style={{ textAlign: 'center' }}>
            <Spinner thickness={10} />
            <Typography variant="small" color="muted">10px</Typography>
          </div>
        </div>
        <Typography variant="small" color="muted">Custom border thickness using <code>thickness</code> prop.</Typography>
      </section>

      <hr style={{ margin: '2rem 0' }} />

      {/* 6. Delay Prop - Avoid Flicker */}
      <section>
        <Typography variant="h2" color="secondary" style={{ marginBottom: '1rem' }}>6. Delay Prop</Typography>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '2rem', alignItems: 'center' }}>
          <div style={{ textAlign: 'center' }}>
            <Spinner delay={0} />
            <Typography variant="small" color="muted">No delay (0ms)</Typography>
          </div>
          <div style={{ textAlign: 'center' }}>
            <Spinner delay={500} />
            <Typography variant="small" color="muted">500ms delay</Typography>
          </div>
          <div style={{ textAlign: 'center' }}>
            <Spinner delay={1000} />
            <Typography variant="small" color="muted">1000ms delay</Typography>
          </div>
        </div>
        <Typography variant="small" color="muted">Delayed rendering prevents flicker on fast operations.</Typography>
      </section>

      <hr style={{ margin: '2rem 0' }} />

      {/* 7. Real-world: Button with Loading State */}
      <section>
        <Typography variant="h2" color="secondary" style={{ marginBottom: '1rem' }}>7. Button with Loading State</Typography>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxWidth: '400px' }}>
          <Button
            variant="primary"
            leftIcon={isLoading ? <Spinner size="sm" decorative /> : undefined}
            onClick={handleSimulateLoading}
            loading={isLoading}
            disabled={isLoading}
            fullWidth
          >
            {isLoading ? 'Loading...' : 'Simulate Async Operation'}
          </Button>
          <Typography variant="small" color="muted">
            Click to simulate a 3‑second loading operation.
          </Typography>
        </div>
      </section>

      <hr style={{ margin: '2rem 0' }} />

      {/* 8. Real-world: Card with Loading Overlay */}
      <section>
        <Typography variant="h2" color="secondary" style={{ marginBottom: '1rem' }}>8. Card with Loading Spinner</Typography>
        <div style={{ position: 'relative', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-md)', padding: '1.5rem', background: 'var(--color-bg-surface)', maxWidth: '400px' }}>
          {isLoading && (
            <div style={{
              position: 'absolute',
              inset: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: 'rgba(0,0,0,0.3)',
              borderRadius: 'var(--radius-md)',
              zIndex: 10,
            }}>
              <Spinner size="lg" color="primary" label="Loading content..." />
            </div>
          )}
          <Typography variant="h4" color="primary" weight="semibold">Expense Details</Typography>
          <Typography variant="body" color="secondary" style={{ marginTop: '0.5rem' }}>
            {isLoading ? 'Loading data...' : 'Dinner at Italian restaurant - $45.50'}
          </Typography>
          <Typography variant="small" color="muted" style={{ marginTop: '0.25rem' }}>
            {isLoading ? 'Please wait...' : 'Paid by Alice · 2 min ago'}
          </Typography>
          <Button
            variant="outline"
            size="sm"
            onClick={handleSimulateLoading}
            style={{ marginTop: '1rem' }}
            disabled={isLoading}
          >
            {isLoading ? 'Loading...' : 'Refresh'}
          </Button>
        </div>
        <Typography variant="small" color="muted">Spinner as an overlay during data loading.</Typography>
      </section>

      <hr style={{ margin: '2rem 0' }} />

      {/* 9. Real-world: Inline Loading (Text replacement) */}
      <section>
        <Typography variant="h2" color="secondary" style={{ marginBottom: '1rem' }}>9. Inline Loading</Typography>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', maxWidth: '400px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <Spinner size="sm" color="primary" delay={200} />
            <Typography variant="body">Loading expenses...</Typography>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <Spinner size="sm" color="success" delay={400} />
            <Typography variant="body" color="success">Saving changes...</Typography>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <Spinner size="sm" color="warning" delay={600} />
            <Typography variant="body" color="warning">Processing payment...</Typography>
          </div>
        </div>
        <Typography variant="small" color="muted">Inline spinners paired with text.</Typography>
      </section>

      <hr style={{ margin: '2rem 0' }} />

      {/* 10. Accessibility */}
      <section>
        <Typography variant="h2" color="secondary" style={{ marginBottom: '1rem' }}>10. Accessibility</Typography>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <Typography variant="body">• <code>role=</code> and <code>aria-live=</code> for accessible spinners.</Typography>
          <Typography variant="body">• <code>aria-label</code> customizable via <code>label</code> prop.</Typography>
          <Typography variant="body">• <code>decorative</code> prop hides spinner from screen readers.</Typography>
          <Typography variant="body">• <code>prefers-reduced-motion</code> support (animation stops for users with motion sensitivity).</Typography>
          <Typography variant="body">• Development warning if <code>label</code> is empty.</Typography>
        </div>
        <Typography variant="small" color="muted" style={{ marginTop: '0.5rem' }}>
          The spinner is fully accessible and respects user motion preferences.
        </Typography>
      </section>

      <footer style={{ marginTop: '3rem', padding: '1rem', borderTop: '1px solid var(--color-divider)', color: 'var(--color-text-muted)' }}>
        <Typography variant="small" color="muted">
          Spinner component test page – all sizes, colors, speeds, and real‑world use cases.
        </Typography>
      </footer>
    </div>
  );
}