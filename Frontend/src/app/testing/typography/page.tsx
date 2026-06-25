// F:\PERSONAL\TrueSplit\frontend\src\app\testing\typography\page.tsx

'use client';

import React from 'react';
import { Typography } from '@/shared/_components/atoms/Typography';
import { ThemeSwitcher } from '@/shared/_components/molecules/ThemeSwitcher';
import { Badge } from '@/shared/_components/atoms/Badge';

/**
 * Testing page for the Typography component.
 * Demonstrates all variants, colors, weights, alignments, truncation, lineClamp, transform, letterSpacing, and as prop.
 */
export default function TypographyTestPage() {
  return (
    <div style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <Typography variant="h1">Typography Component – Real‑World Test</Typography>
        <ThemeSwitcher variant="both" />
      </div>

      <hr style={{ margin: '2rem 0' }} />

      {/* 1. All Variants */}
      <section>
        <Typography variant="h2" color="secondary" style={{ marginBottom: '1rem' }}>1. All Variants</Typography>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <Typography variant="h1">Heading 1 – The quick brown fox</Typography>
          <Typography variant="h2">Heading 2 – The quick brown fox</Typography>
          <Typography variant="h3">Heading 3 – The quick brown fox</Typography>
          <Typography variant="h4">Heading 4 – The quick brown fox</Typography>
          <Typography variant="h5">Heading 5 – The quick brown fox</Typography>
          <Typography variant="h6">Heading 6 – The quick brown fox</Typography>
          <Typography variant="body">Body text – The quick brown fox jumps over the lazy dog.</Typography>
          <Typography variant="small">Small text – The quick brown fox jumps over the lazy dog.</Typography>
          <Typography variant="caption">Caption text – The quick brown fox jumps over the lazy dog.</Typography>
        </div>
        <Typography variant="small" color="muted">All typography variants from h1 to caption.</Typography>
      </section>

      <hr style={{ margin: '2rem 0' }} />

      {/* 2. Colors */}
      <section>
        <Typography variant="h2" color="secondary" style={{ marginBottom: '1rem' }}>2. Colors</Typography>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem 2rem' }}>
          <Typography color="primary">Primary text</Typography>
          <Typography color="secondary">Secondary text</Typography>
          <Typography color="muted">Muted text</Typography>
          <Typography color="success">Success text</Typography>
          <Typography color="warning">Warning text</Typography>
          <Typography color="error">Error text</Typography>
          <Typography color="info">Info text</Typography>
          <Typography color="link">Link text</Typography>
        </div>
        <Typography variant="small" color="muted">All available text colors.</Typography>
      </section>

      <hr style={{ margin: '2rem 0' }} />

      {/* 3. Weights */}
      <section>
        <Typography variant="h2" color="secondary" style={{ marginBottom: '1rem' }}>3. Weights</Typography>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem 2rem' }}>
          <Typography weight="normal">Normal (400)</Typography>
          <Typography weight="medium">Medium (500)</Typography>
          <Typography weight="semibold">Semibold (600)</Typography>
          <Typography weight="bold">Bold (700)</Typography>
        </div>
        <Typography variant="small" color="muted">All font weights.</Typography>
      </section>

      <hr style={{ margin: '2rem 0' }} />

      {/* 4. Alignment */}
      <section>
        <Typography variant="h2" color="secondary" style={{ marginBottom: '1rem' }}>4. Alignment</Typography>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', maxWidth: '400px' }}>
          <Typography align="left">Left aligned text.</Typography>
          <Typography align="center">Center aligned text.</Typography>
          <Typography align="right">Right aligned text.</Typography>
          <Typography align="justify">Justified text that stretches to fill the width of the container. This is a longer sentence to show justification.</Typography>
        </div>
        <Typography variant="small" color="muted">Left, center, right, and justify alignment.</Typography>
      </section>

      <hr style={{ margin: '2rem 0' }} />

      {/* 5. Truncation */}
      <section>
        <Typography variant="h2" color="secondary" style={{ marginBottom: '1rem' }}>5. Truncation (Single Line)</Typography>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', maxWidth: '300px' }}>
          <Typography truncate>
            This is a very long text that will be truncated with an ellipsis when it exceeds the container width.
          </Typography>
          <Typography truncate color="secondary">
            Another long text to demonstrate truncation in a small container.
          </Typography>
        </div>
        <Typography variant="small" color="muted">
          Single-line truncation with <code>truncate</code> prop. Hover to see full text via <code>title</code>.
        </Typography>
      </section>

      <hr style={{ margin: '2rem 0' }} />

      {/* 6. Line Clamp (Multi-line Truncation) */}
      <section>
        <Typography variant="h2" color="secondary" style={{ marginBottom: '1rem' }}>6. Line Clamp</Typography>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxWidth: '400px' }}>
          <div>
            <Typography variant="small" color="muted" style={{ marginBottom: '0.25rem' }}>2 lines:</Typography>
            <Typography lineClamp={2}>
              This is a longer text that will be clamped to only two lines. The rest of the content will be hidden and an ellipsis will be shown at the end of the second line. This is useful for card descriptions and list items.
            </Typography>
          </div>
          <div>
            <Typography variant="small" color="muted" style={{ marginBottom: '0.25rem' }}>3 lines:</Typography>
            <Typography lineClamp={3}>
              This text will be clamped to three lines. Its perfect for previewing content in cards, lists, or any component where you want to keep a consistent height. The ellipsis at the end of the third line indicates theres more content.
            </Typography>
          </div>
          <div>
            <Typography variant="small" color="muted" style={{ marginBottom: '0.25rem' }}>1 line (with truncate fallback):</Typography>
            <Typography lineClamp={1}>
              This is a very long text that will be limited to exactly one line, similar to truncate but using line-clamp.
            </Typography>
          </div>
        </div>
        <Typography variant="small" color="muted">
          Multi-line truncation with <code>lineClamp</code> prop. Supports 1–n lines.
        </Typography>
      </section>

      <hr style={{ margin: '2rem 0' }} />

      {/* 7. Text Transform */}
      <section>
        <Typography variant="h2" color="secondary" style={{ marginBottom: '1rem' }}>7. Text Transform</Typography>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem 2rem' }}>
          <Typography transform="none">None (default)</Typography>
          <Typography transform="uppercase">Uppercase</Typography>
          <Typography transform="lowercase">LOWERCASE</Typography>
          <Typography transform="capitalize">capitalize each word</Typography>
        </div>
        <Typography variant="small" color="muted">Transform options: none, uppercase, lowercase, capitalize.</Typography>
      </section>

      <hr style={{ margin: '2rem 0' }} />

      {/* 8. Letter Spacing */}
      <section>
        <Typography variant="h2" color="secondary" style={{ marginBottom: '1rem' }}>8. Letter Spacing</Typography>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem 2rem' }}>
          <Typography letterSpacing="tight">Tight spacing</Typography>
          <Typography letterSpacing="normal">Normal spacing</Typography>
          <Typography letterSpacing="wide">Wide spacing</Typography>
        </div>
        <Typography variant="small" color="muted">Letter spacing tokens: tight, normal, wide.</Typography>
      </section>

      <hr style={{ margin: '2rem 0' }} />

      {/* 9. As Prop – Semantic Override */}
      <section>
        <Typography variant="h2" color="secondary" style={{ marginBottom: '1rem' }}>9. As Prop</Typography>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <Typography as="div" variant="body">This is a body rendered as a <code>&lt;div&gt;</code>.</Typography>
          <Typography as="span" variant="h3">This is an h3 rendered as a <code>&lt;span&gt;</code>.</Typography>
          <Typography as="label" variant="small" htmlFor="test-input">This is a small text rendered as a <code>&lt;label&gt;</code>.</Typography>
          <input id="test-input" type="text" placeholder="Input for label" style={{ marginTop: '0.25rem' }} />
        </div>
        <Typography variant="small" color="muted">The <code>as</code> prop allows rendering as any HTML element.</Typography>
      </section>

      <hr style={{ margin: '2rem 0' }} />

      {/* 10. Real-world Combo */}
      <section>
        <Typography variant="h2" color="secondary" style={{ marginBottom: '1rem' }}>10. Real-world Combo</Typography>
        <div style={{ border: '1px solid var(--color-border)', borderRadius: 'var(--radius-md)', padding: '1.5rem', background: 'var(--color-bg-surface)' }}>
          <Typography variant="h3" color="primary" weight="semibold" transform="uppercase" letterSpacing="wide" style={{ marginBottom: '0.5rem' }}>
            Expense Summary
          </Typography>
          <Typography variant="body" color="secondary" style={{ marginBottom: '0.5rem' }}>
            Total spent this month: <Typography as="span" variant="body" color="primary" weight="bold">$1,245.50</Typography>
          </Typography>
          <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '0.5rem' }}>
            <Badge variant="success">Paid</Badge>
            <Badge variant="warning">Pending</Badge>
          </div>
          <Typography variant="small" color="muted" lineClamp={2}>
            Detailed description of the expense that might be long and should be clamped to two lines to keep the UI clean.
          </Typography>
        </div>
        <Typography variant="small" color="muted">Combining multiple props: variant, color, weight, transform, letterSpacing, and lineClamp.</Typography>
      </section>

      <hr style={{ margin: '2rem 0' }} />

      {/* 11. Accessibility: Title on Truncation */}
      <section>
        <Typography variant="h2" color="secondary" style={{ marginBottom: '1rem' }}>11. Accessibility</Typography>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', maxWidth: '400px' }}>
          <Typography truncate>
            This truncated text has a title attribute with the full content, so screen readers and hover tooltips show the complete text.
          </Typography>
          <Typography lineClamp={2}>
            This line-clamped text also includes the title attribute with the full content, ensuring all users can access the complete information.
          </Typography>
          <Typography variant="small" color="muted">
            All truncated text automatically gets <code>title</code> attribute for accessibility.
          </Typography>
        </div>
      </section>

      <footer style={{ marginTop: '3rem', padding: '1rem', borderTop: '1px solid var(--color-divider)', color: 'var(--color-text-muted)' }}>
        <Typography variant="small" color="muted">
          Typography component test page – all variants, colors, weights, alignments, truncation, lineClamp, transform, letterSpacing, and as prop.
        </Typography>
      </footer>
    </div>
  );
}