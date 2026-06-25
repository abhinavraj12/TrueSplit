'use client';

import React, { useState } from 'react';
import { Button } from '@/shared/_components/atoms/Button';
import { ThemeSwitcher } from '@/shared/_components/molecules/ThemeSwitcher';
import {
  FaPlus,
  FaTrash,
  FaEdit,
  FaSave,
  FaTimes,
  FaCheck,
  FaBell,
  FaUser,
  FaHome,
  FaSync,
} from 'react-icons/fa';

/**
 * Testing page for the Button component.
 * Demonstrates all real‑world usage scenarios in TrueSplit.
 */
export default function ButtonTestPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setSubmitSuccess(false);
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsSubmitting(false);
    setSubmitSuccess(true);
    setTimeout(() => setSubmitSuccess(false), 3000);
  };

  return (
    <div style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1>Button Component – Real‑World Test</h1>
        <ThemeSwitcher variant="both" />
      </div>

      <hr style={{ margin: '2rem 0' }} />

      {/* 1. All Variants */}
      <section>
        <h2>1. Variants</h2>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem', alignItems: 'center' }}>
          <Button variant="primary">Primary</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="outline">Outline</Button>
          <Button variant="ghost">Ghost</Button>
          <Button variant="danger">Danger</Button>
          <Button variant="success">Success</Button>
          <Button variant="link">Link</Button>
        </div>
      </section>

      <hr style={{ margin: '2rem 0' }} />

      {/* 2. Sizes */}
      <section>
        <h2>2. Sizes</h2>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem', alignItems: 'center' }}>
          <Button size="sm">Small</Button>
          <Button size="md">Medium</Button>
          <Button size="lg">Large</Button>
        </div>
      </section>

      <hr style={{ margin: '2rem 0' }} />

      {/* 3. With Icons */}
      <section>
        <h2>3. With Icons</h2>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem', alignItems: 'center' }}>
          <Button leftIcon={<FaPlus />}>Add</Button>
          <Button leftIcon={<FaSave />} variant="success">Save</Button>
          <Button leftIcon={<FaEdit />} variant="secondary">Edit</Button>
          <Button leftIcon={<FaTrash />} variant="danger">Delete</Button>
          <Button rightIcon={<FaBell />}>Notify</Button>
          <Button leftIcon={<FaSync />} loading>Loading</Button>
        </div>
      </section>

      <hr style={{ margin: '2rem 0' }} />

      {/* 4. Icon‑only Buttons */}
      <section>
        <h2>4. Icon‑only Buttons</h2>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem', alignItems: 'center' }}>
          <Button iconOnly label="Add item" leftIcon={<FaPlus />} variant="primary" />
          <Button iconOnly label="Edit" leftIcon={<FaEdit />} variant="secondary" />
          <Button iconOnly label="Delete" leftIcon={<FaTrash />} variant="danger" />
          <Button iconOnly label="Save" leftIcon={<FaSave />} variant="success" />
          <Button iconOnly label="Close" leftIcon={<FaTimes />} variant="ghost" />
          <Button iconOnly label="Bell" leftIcon={<FaBell />} variant="outline" />
        </div>
        <p><small>Icon‑only buttons require a <code>label</code> prop for accessibility.</small></p>
      </section>

      <hr style={{ margin: '2rem 0' }} />

      {/* 5. Full Width */}
      <section>
        <h2>5. Full Width</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', maxWidth: '400px' }}>
          <Button fullWidth>Full Width</Button>
          <Button fullWidth variant="secondary" leftIcon={<FaHome />}>Full Width with Icon</Button>
          <Button fullWidth variant="outline">Full Width Outline</Button>
        </div>
      </section>

      <hr style={{ margin: '2rem 0' }} />

      {/* 6. Disabled State */}
      <section>
        <h2>6. Disabled State</h2>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem', alignItems: 'center' }}>
          <Button disabled variant="primary">Primary Disabled</Button>
          <Button disabled variant="secondary">Secondary Disabled</Button>
          <Button disabled variant="outline">Outline Disabled</Button>
          <Button disabled variant="ghost">Ghost Disabled</Button>
          <Button disabled variant="danger">Danger Disabled</Button>
          <Button disabled variant="success">Success Disabled</Button>
          <Button disabled variant="link">Link Disabled</Button>
        </div>
      </section>

      <hr style={{ margin: '2rem 0' }} />

      {/* 7. Loading State */}
      <section>
        <h2>7. Loading State</h2>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem', alignItems: 'center' }}>
          <Button loading variant="primary">Loading</Button>
          <Button loading variant="secondary" leftIcon={<FaSync />}>Submitting</Button>
          <Button loading variant="outline">Processing</Button>
          <Button loading variant="danger">Deleting</Button>
          <Button loading variant="success">Saving</Button>
          <Button loading iconOnly label="Loading" leftIcon={<FaPlus />} variant="primary" />
        </div>
      </section>

      <hr style={{ margin: '2rem 0' }} />

      {/* 8. Link Variant (Button styled as link) */}
      <section>
        <h2>8. Link Variant</h2>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem', alignItems: 'center' }}>
          <Button variant="link">Click here</Button>
          <Button variant="link" leftIcon={<FaUser />}>User Profile</Button>
          <Button variant="link" disabled>Disabled Link</Button>
        </div>
      </section>

      <hr style={{ margin: '2rem 0' }} />

      {/* 9. Link Button as Anchor (polymorphic) */}
      <section>
        <h2>9. Link Button as Anchor </h2>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem', alignItems: 'center' }}>
          <Button as="a" href="/testing" variant="primary">Navigate to /testing</Button>
          <Button as="a" href="https://example.com" target="_blank" rel="noopener noreferrer" variant="outline">
            External Link
          </Button>
          <Button as="a" href="/dashboard" variant="secondary" leftIcon={<FaHome />}>Dashboard</Button>
        </div>
        <p><small>Anchor buttons are rendered as <code>&lt;a&gt;</code> tags, not <code>&lt;button&gt;</code>.</small></p>
      </section>

      <hr style={{ margin: '2rem 0' }} />

      {/* 10. Tooltip on Icon‑only Buttons */}
      <section>
        <h2>10. Tooltips</h2>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem', alignItems: 'center' }}>
          <Button iconOnly label="Add" leftIcon={<FaPlus />} variant="primary" tooltip="Add new item" />
          <Button iconOnly label="Delete" leftIcon={<FaTrash />} variant="danger" tooltip="Delete this item" />
          <Button iconOnly label="Edit" leftIcon={<FaEdit />} variant="secondary" tooltip="Edit entry" />
          <Button variant="secondary" tooltip="Click to refresh" onClick={() => alert('Refreshed!')}>
            <span role="img" aria-hidden="true">🔄</span> Refresh
          </Button>
        </div>
      </section>

      <hr style={{ margin: '2rem 0' }} />

      {/* 11. Interactive Example: Async Submit */}
      <section>
        <h2>11. Async Submit Demo</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxWidth: '400px' }}>
          <Button
            variant="primary"
            leftIcon={<FaSave />}
            loading={isSubmitting}
            onClick={handleSubmit}
            fullWidth
          >
            {submitSuccess ? 'Success!' : 'Submit Form'}
          </Button>
          {submitSuccess && (
            <div style={{ color: 'var(--color-success-text)', background: 'var(--color-success-bg)', padding: '0.5rem', borderRadius: 'var(--radius-md)' }}>
              Form submitted successfully! ✓
            </div>
          )}
          <p><small>Simulates a 2‑second loading state.</small></p>
        </div>
      </section>

      <hr style={{ margin: '2rem 0' }} />

      {/* 12. Group of Buttons */}
      <section>
        <h2>12. Button Group (Action Bar)</h2>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem', alignItems: 'center' }}>
          <Button variant="primary" leftIcon={<FaCheck />}>Confirm</Button>
          <Button variant="outline" leftIcon={<FaTimes />}>Cancel</Button>
          <Button variant="ghost" disabled>Disabled</Button>
          <Button variant="danger" leftIcon={<FaTrash />}>Delete</Button>
        </div>
        <p><small>Common pattern for modals and confirmation dialogs.</small></p>
      </section>

      <footer style={{ marginTop: '3rem', padding: '1rem', borderTop: '1px solid var(--color-divider)', color: 'var(--color-text-muted)', fontSize: '0.9rem' }}>
        <p>Button component test page – all variants, sizes, states, and real‑world use cases.</p>
      </footer>
    </div>
  );
}