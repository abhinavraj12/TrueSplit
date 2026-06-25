// F:\PERSONAL\TrueSplit\frontend\src\app\testing\skeleton\page.tsx

'use client';

import React, { useState } from 'react';
import { Skeleton } from '@/shared/_components/atoms/Skeleton';
import { Typography } from '@/shared/_components/atoms/Typography';
import { Button } from '@/shared/_components/atoms/Button';
import { ThemeSwitcher } from '@/shared/_components/molecules/ThemeSwitcher';

/**
 * Testing page for the Skeleton component.
 * Demonstrates all variants, counts, line lengths, delays, and real-world scenarios.
 */
export default function SkeletonTestPage() {
  const [showContent, setShowContent] = useState(false);

  return (
    <div style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <Typography variant="h1">Skeleton Component – Real‑World Test</Typography>
        <ThemeSwitcher variant="both" />
      </div>

      <hr style={{ margin: '2rem 0' }} />

      {/* 1. Text Variant */}
      <section>
        <Typography variant="h2" color="secondary" style={{ marginBottom: '1rem' }}>1. Text Variant</Typography>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', maxWidth: '400px' }}>
          <Skeleton variant="text" lineLength="full" />
          <Skeleton variant="text" lineLength="medium" />
          <Skeleton variant="text" lineLength="small" />
          <Skeleton variant="text" lineLength="short" />
        </div>
        <Typography variant="small" color="muted">Text with various line lengths.</Typography>
      </section>

      <hr style={{ margin: '2rem 0' }} />

      {/* 2. Avatar Variant */}
      <section>
        <Typography variant="h2" color="secondary" style={{ marginBottom: '1rem' }}>2. Avatar Variant</Typography>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <Skeleton variant="avatar" />
          <Skeleton variant="avatar" />
          <Skeleton variant="avatar" />
        </div>
        <Typography variant="small" color="muted">Avatar skeletons (40px).</Typography>
      </section>

      <hr style={{ margin: '2rem 0' }} />

      {/* 3. Card Variant */}
      <section>
        <Typography variant="h2" color="secondary" style={{ marginBottom: '1rem' }}>3. Card Variant</Typography>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '1rem' }}>
          <Skeleton variant="card" />
          <Skeleton variant="card" />
          <Skeleton variant="card" />
        </div>
        <Typography variant="small" color="muted">Card skeletons (120px height).</Typography>
      </section>

      <hr style={{ margin: '2rem 0' }} />

      {/* 4. User Card Variant */}
      <section>
        <Typography variant="h2" color="secondary" style={{ marginBottom: '1rem' }}>4. User Card Variant</Typography>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', maxWidth: '400px' }}>
          <Skeleton variant="user-card" />
          <Skeleton variant="user-card" />
        </div>
        <Typography variant="small" color="muted">User card with avatar and two text lines.</Typography>
      </section>

      <hr style={{ margin: '2rem 0' }} />

      {/* 5. Expense Card Variant */}
      <section>
        <Typography variant="h2" color="secondary" style={{ marginBottom: '1rem' }}>5. Expense Card Variant</Typography>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', maxWidth: '500px' }}>
          <Skeleton variant="expense-card" />
          <Skeleton variant="expense-card" />
          <Skeleton variant="expense-card" count={2} />
        </div>
        <Typography variant="small" color="muted">Expense card with avatar, description, and amount.</Typography>
      </section>

      <hr style={{ margin: '2rem 0' }} />

      {/* 6. Group Card Variant */}
      <section>
        <Typography variant="h2" color="secondary" style={{ marginBottom: '1rem' }}>6. Group Card Variant</Typography>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', maxWidth: '500px' }}>
          <Skeleton variant="group-card" />
          <Skeleton variant="group-card" />
        </div>
        <Typography variant="small" color="muted">Group card with avatar, title, members, and balance info.</Typography>
      </section>

      <hr style={{ margin: '2rem 0' }} />

      {/* 7. Count Prop - Multiple Items */}
      <section>
        <Typography variant="h2" color="secondary" style={{ marginBottom: '1rem' }}>7. Count Prop</Typography>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', maxWidth: '400px' }}>
          <Skeleton variant="text" count={3} lineLength="medium" />
          <Skeleton variant="expense-card" count={3} />
          <Skeleton variant="user-card" count={2} />
        </div>
        <Typography variant="small" color="muted">Using <code>count</code> to generate multiple skeletons.</Typography>
      </section>

      <hr style={{ margin: '2rem 0' }} />

      {/* 8. Custom Variant with Height/Width */}
      <section>
        <Typography variant="h2" color="secondary" style={{ marginBottom: '1rem' }}>8. Custom Variant</Typography>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', flexWrap: 'wrap' }}>
          <Skeleton variant="custom" height="80px" width="80px" />
          <Skeleton variant="custom" height="40px" width="200px" />
          <Skeleton variant="custom" height="20px" width="100%" />
          <Skeleton variant="custom" height="60px" width="150px" />
        </div>
        <Typography variant="small" color="muted">Custom sizes via <code>height</code> and <code>width</code>.</Typography>
      </section>

      <hr style={{ margin: '2rem 0' }} />

      {/* 9. Delay Prop - Avoid Flicker */}
      <section>
        <Typography variant="h2" color="secondary" style={{ marginBottom: '1rem' }}>9. Delay Prop</Typography>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', maxWidth: '300px' }}>
          <Skeleton variant="text" delay={300} lineLength="medium" />
          <Skeleton variant="text" delay={500} lineLength="short" />
          <Skeleton variant="text" delay={1000} lineLength="full" />
        </div>
        <Typography variant="small" color="muted">Each skeleton appears after a delay (300ms, 500ms, 1000ms).</Typography>
      </section>

      <hr style={{ margin: '2rem 0' }} />

      {/* 10. Real-world: Loading State Toggle */}
      <section>
        <Typography variant="h2" color="secondary" style={{ marginBottom: '1rem' }}>10. Real-world: Loading State Toggle</Typography>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxWidth: '500px' }}>
          <Button
            variant="primary"
            onClick={() => setShowContent(!showContent)}
          >
            {showContent ? 'Show Skeletons' : 'Show Content'}
          </Button>
          {!showContent ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <Skeleton variant="expense-card" count={3} />
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <div style={{ padding: '1rem', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-md)', background: 'var(--color-bg-surface)' }}>
                <strong>Expense 1</strong>
                <div style={{ color: 'var(--color-text-secondary)' }}>$25.00 · 2 min ago</div>
              </div>
              <div style={{ padding: '1rem', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-md)', background: 'var(--color-bg-surface)' }}>
                <strong>Expense 2</strong>
                <div style={{ color: 'var(--color-text-secondary)' }}>$12.50 · 5 min ago</div>
              </div>
              <div style={{ padding: '1rem', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-md)', background: 'var(--color-bg-surface)' }}>
                <strong>Expense 3</strong>
                <div style={{ color: 'var(--color-text-secondary)' }}>$8.00 · 10 min ago</div>
              </div>
            </div>
          )}
          <Typography variant="small" color="muted">Toggle between skeletons and loaded content.</Typography>
        </div>
      </section>

      <hr style={{ margin: '2rem 0' }} />

      {/* 11. Accessibility: Reduced Motion */}
      <section>
        <Typography variant="h2" color="secondary" style={{ marginBottom: '1rem' }}>11. Accessibility</Typography>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <Typography variant="body">• All skeletons have <code>aria-hidden=</code> and <code>role</code>.</Typography>
          <Typography variant="body">• You can set custom <code>ariaLabel</code> or <code>ariaLabelledBy</code>.</Typography>
          <Typography variant="body">• Animation respects <code>prefers-reduced-motion</code> (disable shimmer).</Typography>
        </div>
      </section>

      <footer style={{ marginTop: '3rem', padding: '1rem', borderTop: '1px solid var(--color-divider)', color: 'var(--color-text-muted)' }}>
        <Typography variant="small" color="muted">
          Skeleton component test page – all variants, counts, line lengths, delays, and real‑world use cases.
        </Typography>
      </footer>
    </div>
  );
}