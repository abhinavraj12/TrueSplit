// F:\PERSONAL\TrueSplit\frontend\src\app\testing\badge\page.tsx

'use client';

import React, { useState } from 'react';
import { Badge } from '@/shared/_components/atoms/Badge';
import { ThemeSwitcher } from '@/shared/_components/molecules/ThemeSwitcher';
import { Button } from '@/shared/_components/atoms/Button';
import { FaBell, FaUser, FaHome, FaExclamationTriangle, FaCheckCircle, FaInfoCircle } from 'react-icons/fa';

/**
 * Testing page for the Badge component.
 * Demonstrates all real‑world usage scenarios in TrueSplit.
 */
export default function BadgeTestPage() {
  const [notificationCount, setNotificationCount] = useState(3);
  const [isLoading, setIsLoading] = useState(false);

  const incrementCount = () => {
    setNotificationCount(prev => Math.min(prev + 1, 99));
  };

  const decrementCount = () => {
    setNotificationCount(prev => Math.max(prev - 1, 0));
  };

  return (
    <div style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1>Badge Component – Real‑World Test</h1>
        <ThemeSwitcher variant="both" />
      </div>

      <hr style={{ margin: '2rem 0' }} />

      {/* 1. All Variants */}
      <section>
        <h2>1. Variants</h2>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', alignItems: 'center' }}>
          <Badge variant="default">Default</Badge>
          <Badge variant="primary">Primary</Badge>
          <Badge variant="secondary">Secondary</Badge>
          <Badge variant="success">Success</Badge>
          <Badge variant="warning">Warning</Badge>
          <Badge variant="error">Error</Badge>
          <Badge variant="info">Info</Badge>
        </div>
      </section>

      <hr style={{ margin: '2rem 0' }} />

      {/* 2. Sizes */}
      <section>
        <h2>2. Sizes</h2>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', alignItems: 'center' }}>
          <Badge size="sm">Small</Badge>
          <Badge size="md">Medium</Badge>
          <Badge size="lg">Large</Badge>
        </div>
      </section>

      <hr style={{ margin: '2rem 0' }} />

      {/* 3. With Icons */}
      <section>
        <h2>3. With Icons</h2>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', alignItems: 'center' }}>
          <Badge variant="primary" icon={<FaBell />}>Notifications</Badge>
          <Badge variant="success" icon={<FaCheckCircle />}>Completed</Badge>
          <Badge variant="warning" icon={<FaExclamationTriangle />}>Pending</Badge>
          <Badge variant="info" icon={<FaInfoCircle />}>Info</Badge>
          <Badge variant="default" icon={<FaUser />}>User</Badge>
        </div>
      </section>

      <hr style={{ margin: '2rem 0' }} />

      {/* 4. Icon‑only Badges */}
      <section>
        <h2>4. Icon‑only</h2>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', alignItems: 'center' }}>
          <Badge variant="primary" icon={<FaBell />} />
          <Badge variant="success" icon={<FaCheckCircle />} />
          <Badge variant="warning" icon={<FaExclamationTriangle />} />
          <Badge variant="error" icon={<FaInfoCircle />} />
        </div>
        <p><small>When only an icon is provided, the badge automatically becomes compact.</small></p>
      </section>

      <hr style={{ margin: '2rem 0' }} />

      {/* 5. Dot Mode */}
      <section>
        <h2>5. Dot Mode (Status Indicators)</h2>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', alignItems: 'center' }}>
          <Badge dot variant="success" ariaLabel="Online" />
          <Badge dot variant="warning" ariaLabel="Away" />
          <Badge dot variant="error" ariaLabel="Busy" />
          <Badge dot variant="info" ariaLabel="Idle" />
          <Badge dot variant="default" ariaLabel="Offline" />
        </div>
        <p><small>Use the <code>ariaLabel</code> prop to give meaning to the dot.</small></p>
      </section>

      <hr style={{ margin: '2rem 0' }} />

      {/* 6. Rounded vs Non‑rounded */}
      <section>
        <h2>6. Rounded (Pill) vs Square</h2>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', alignItems: 'center' }}>
          <Badge rounded>Pill (default)</Badge>
          <Badge rounded={false}>Square</Badge>
        </div>
      </section>

      <hr style={{ margin: '2rem 0' }} />

      {/* 7. Real‑world Scenario: Notification Count on a Button */}
      <section>
        <h2>7. Notification Bell with Count</h2>
        <div style={{ display: 'flex', alignItems: 'center', gap: '2rem', flexWrap: 'wrap' }}>
          <div style={{ position: 'relative', display: 'inline-block' }}>
            <Button variant="ghost" size="lg" iconOnly aria-label="Notifications">
              <FaBell size={24} />
            </Button>
            <span style={{ position: 'absolute', top: '-6px', right: '-6px' }}>
              <Badge variant="primary" size="sm">{notificationCount}</Badge>
            </span>
          </div>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <Button onClick={decrementCount} disabled={notificationCount === 0}>−</Button>
            <Button onClick={incrementCount} disabled={notificationCount === 99}>+</Button>
          </div>
          <span>Count: {notificationCount}</span>
        </div>
        <p><small>Badge displays the current notification count. Max is 99.</small></p>
      </section>

      <hr style={{ margin: '2rem 0' }} />

      {/* 8. Real‑world Scenario: Expense Status Tags */}
      <section>
        <h2>8. Expense & Settlement Status</h2>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', alignItems: 'center' }}>
          <Badge variant="success">Paid</Badge>
          <Badge variant="warning">Pending</Badge>
          <Badge variant="error">Overdue</Badge>
          <Badge variant="info">Settled</Badge>
          <Badge variant="secondary">Unpaid</Badge>
        </div>
      </section>

      <hr style={{ margin: '2rem 0' }} />

      {/* 9. Real‑world Scenario: Category Tags */}
      <section>
        <h2>9. Category Tags</h2>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', alignItems: 'center' }}>
          <Badge variant="primary" icon={<FaHome />}>Rent</Badge>
          <Badge variant="success" icon={<FaCheckCircle />}>Groceries</Badge>
          <Badge variant="warning" icon={<FaExclamationTriangle />}>Utilities</Badge>
          <Badge variant="info" icon={<FaBell />}>Subscriptions</Badge>
          <Badge variant="default" icon={<FaUser />}>Personal</Badge>
        </div>
      </section>

      <hr style={{ margin: '2rem 0' }} />

      {/* 10. Interactive: Loading State with Badge */}
      <section>
        <h2>10. Loading State Example</h2>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', flexWrap: 'wrap' }}>
          <Button
            variant="primary"
            loading={isLoading}
            onClick={() => {
              setIsLoading(true);
              setTimeout(() => setIsLoading(false), 2000);
            }}
          >
            Simulate Loading
          </Button>
          {isLoading && <Badge variant="info">Loading…</Badge>}
        </div>
      </section>

      <footer style={{ marginTop: '3rem', padding: '1rem', borderTop: '1px solid var(--color-divider)', color: 'var(--color-text-muted)', fontSize: '0.9rem' }}>
        <p>Badge component test page – all variants, sizes, and real‑world use cases.</p>
      </footer>
    </div>
  );
}