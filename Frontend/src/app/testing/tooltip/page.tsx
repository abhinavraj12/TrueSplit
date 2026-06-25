// F:\PERSONAL\TrueSplit\frontend\src\app\testing\tooltip\page.tsx

'use client';

import React, { useState } from 'react';
import { Tooltip } from '@/shared/_components/atoms/Tooltip';
import { Typography } from '@/shared/_components/atoms/Typography';
import { Button } from '@/shared/_components/atoms/Button';
import { ThemeSwitcher } from '@/shared/_components/molecules/ThemeSwitcher';
import { Icon } from '@/shared/_components/atoms/Icon';
import {
  FaHome,
  FaUser,
  FaBell,
  FaCog,
  FaQuestionCircle,
  FaInfoCircle,
  FaPlus,
  FaTrash,
  FaEdit,
} from 'react-icons/fa';

/**
 * Testing page for the Tooltip component.
 * Demonstrates all placements, delays, offsets, and real-world scenarios.
 */
export default function TooltipTestPage() {
  const [isTooltipOpen, setIsTooltipOpen] = useState(false);
  const [tooltipContent, setTooltipContent] = useState('This is a tooltip');

  return (
    <div style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <Typography variant="h1">Tooltip Component – Real‑World Test</Typography>
        <ThemeSwitcher variant="both" />
      </div>

      <hr style={{ margin: '2rem 0' }} />

      {/* 1. Placements */}
      <section>
        <Typography variant="h2" color="secondary" style={{ marginBottom: '1rem' }}>1. Placements</Typography>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '2rem', justifyContent: 'center', padding: '2rem 0' }}>
          <Tooltip content="Top tooltip" placement="top">
            <Button variant="outline">Top</Button>
          </Tooltip>
          <Tooltip content="Bottom tooltip" placement="bottom">
            <Button variant="outline">Bottom</Button>
          </Tooltip>
          <Tooltip content="Left tooltip" placement="left">
            <Button variant="outline">Left</Button>
          </Tooltip>
          <Tooltip content="Right tooltip" placement="right">
            <Button variant="outline">Right</Button>
          </Tooltip>
        </div>
        <Typography variant="small" color="muted">Placements: top, bottom, left, right.</Typography>
      </section>

      <hr style={{ margin: '2rem 0' }} />

      {/* 2. Delays */}
      <section>
        <Typography variant="h2" color="secondary" style={{ marginBottom: '1rem' }}>2. Delays</Typography>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '2rem', justifyContent: 'center', padding: '1rem 0' }}>
          <Tooltip content="Instant (0ms)" delay={0}>
            <Button variant="outline">Instant</Button>
          </Tooltip>
          <Tooltip content="300ms delay" delay={300}>
            <Button variant="outline">300ms</Button>
          </Tooltip>
          <Tooltip content="800ms delay" delay={800}>
            <Button variant="outline">800ms</Button>
          </Tooltip>
          <Tooltip content="Hide after 500ms" hideDelay={500} delay={200}>
            <Button variant="outline">Hide delay 500ms</Button>
          </Tooltip>
        </div>
        <Typography variant="small" color="muted">Show delay (default 200ms) and hide delay (default 200ms).</Typography>
      </section>

      <hr style={{ margin: '2rem 0' }} />

      {/* 3. Offset & MaxWidth */}
      <section>
        <Typography variant="h2" color="secondary" style={{ marginBottom: '1rem' }}>3. Offset & MaxWidth</Typography>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '2rem', justifyContent: 'center', padding: '1rem 0' }}>
          <Tooltip content="Offset 20px from trigger" offset={20}>
            <Button variant="outline">Offset 20px</Button>
          </Tooltip>
          <Tooltip content="MaxWidth 200px with a long text that should wrap within 200px" maxWidth={200}>
            <Button variant="outline">MaxWidth 200px</Button>
          </Tooltip>
          <Tooltip content="Offset 4px and maxWidth 300px" offset={4} maxWidth={300}>
            <Button variant="outline">Offset 4px, max 300px</Button>
          </Tooltip>
        </div>
        <Typography variant="small" color="muted">Custom offset and maxWidth.</Typography>
      </section>

      <hr style={{ margin: '2rem 0' }} />

      {/* 4. Disabled */}
      <section>
        <Typography variant="h2" color="secondary" style={{ marginBottom: '1rem' }}>4. Disabled</Typography>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '2rem', justifyContent: 'center', padding: '1rem 0' }}>
          <Tooltip content="This tooltip is disabled" disabled>
            <Button variant="outline">Disabled Tooltip</Button>
          </Tooltip>
          <Tooltip content="This tooltip works">
            <Button variant="outline">Enabled</Button>
          </Tooltip>
        </div>
        <Typography variant="small" color="muted">Tooltips can be disabled.</Typography>
      </section>

      <hr style={{ margin: '2rem 0' }} />

      {/* 5. Interactive / Click (touch) mode */}
      <section>
        <Typography variant="h2" color="secondary" style={{ marginBottom: '1rem' }}>5. Interactive (Click/Touch)</Typography>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '2rem', justifyContent: 'center', padding: '1rem 0' }}>
          <Tooltip
            content="Click me to toggle (touch or mouse click)"
            // This is a hack: we don't have an interactive prop, but we can simulate using onOpenChange and a state
            // However, the component now supports touch, so we can just use it normally.
            // For demonstration, we'll use a controlled scenario with onOpenChange
          >
            <Button variant="outline">Tap/Click to toggle</Button>
          </Tooltip>
          <Tooltip
            content="Tooltip with custom open state"
            onOpenChange={(open) => setIsTooltipOpen(open)}
          >
            <Button variant="outline">With onOpenChange</Button>
          </Tooltip>
        </div>
        <Typography variant="small" color="muted">
          Tooltips respond to tap/click on touch devices. State: <strong>{isTooltipOpen ? 'Open' : 'Closed'}</strong>
        </Typography>
      </section>

      <hr style={{ margin: '2rem 0' }} />

      {/* 6. Real-world: Icon Buttons */}
      <section>
        <Typography variant="h2" color="secondary" style={{ marginBottom: '1rem' }}>6. Icon Buttons</Typography>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1.5rem', alignItems: 'center' }}>
          <Tooltip content="Home">
            <Button iconOnly label="Home" leftIcon={<FaHome />} variant="ghost" />
          </Tooltip>
          <Tooltip content="User Profile">
            <Button iconOnly label="User" leftIcon={<FaUser />} variant="ghost" />
          </Tooltip>
          <Tooltip content="Notifications">
            <Button iconOnly label="Notifications" leftIcon={<FaBell />} variant="ghost" />
          </Tooltip>
          <Tooltip content="Settings">
            <Button iconOnly label="Settings" leftIcon={<FaCog />} variant="ghost" />
          </Tooltip>
          <Tooltip content="Help">
            <Button iconOnly label="Help" leftIcon={<FaQuestionCircle />} variant="ghost" />
          </Tooltip>
        </div>
        <Typography variant="small" color="muted">Tooltips provide labels for icon‑only buttons.</Typography>
      </section>

      <hr style={{ margin: '2rem 0' }} />

      {/* 7. Real-world: Action Buttons */}
      <section>
        <Typography variant="h2" color="secondary" style={{ marginBottom: '1rem' }}>7. Action Buttons</Typography>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', alignItems: 'center' }}>
          <Tooltip content="Add new expense">
            <Button leftIcon={<FaPlus />}>Add</Button>
          </Tooltip>
          <Tooltip content="Edit this entry">
            <Button variant="secondary" leftIcon={<FaEdit />}>Edit</Button>
          </Tooltip>
          <Tooltip content="Delete permanently">
            <Button variant="danger" leftIcon={<FaTrash />}>Delete</Button>
          </Tooltip>
        </div>
        <Typography variant="small" color="muted">Tooltips give extra context to actions.</Typography>
      </section>

      <hr style={{ margin: '2rem 0' }} />

      {/* 8. Real-world: Truncated Text */}
      <section>
        <Typography variant="h2" color="secondary" style={{ marginBottom: '1rem' }}>8. Truncated Text</Typography>
        <div style={{ maxWidth: '300px' }}>
          <Tooltip content="This is a very long expense description that was truncated because it exceeded the container width. The full text is shown here in the tooltip.">
            <Typography
              truncate
              style={{
                border: '1px solid var(--color-border)',
                padding: '0.5rem',
                borderRadius: 'var(--radius-sm)',
                background: 'var(--color-bg-surface)',
                cursor: 'default',
              }}
            >
              This is a very long expense description that was truncated because it exceeded the container width.
            </Typography>
          </Tooltip>
          <Typography variant="small" color="muted">Hover to see the full text.</Typography>
        </div>
      </section>

      <hr style={{ margin: '2rem 0' }} />

      {/* 9. Real-world: Info Icon */}
      <section>
        <Typography variant="h2" color="secondary" style={{ marginBottom: '1rem' }}>9. Info Icon</Typography>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Typography variant="body">Amount</Typography>
          <Tooltip content="The total amount including all taxes and fees.">
            <Icon size="sm" color="muted" decorative label="More info">
              <FaInfoCircle />
            </Icon>
          </Tooltip>
        </div>
        <Typography variant="small" color="muted">Tooltip on an info icon.</Typography>
      </section>

      <hr style={{ margin: '2rem 0' }} />

      {/* 10. Real-world: Navigation item */}
      <section>
        <Typography variant="h2" color="secondary" style={{ marginBottom: '1rem' }}>10. Navigation Item</Typography>
        <div style={{ display: 'flex', gap: '1.5rem' }}>
          <Tooltip content="Go to Dashboard" placement="bottom">
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', padding: '0.5rem', borderRadius: 'var(--radius-sm)', background: 'var(--color-bg-surface)' }}>
              <Icon size="md" color="interactive" decorative><FaHome /></Icon>
              <Typography>Dashboard</Typography>
            </div>
          </Tooltip>
          <Tooltip content="View your profile" placement="bottom">
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', padding: '0.5rem', borderRadius: 'var(--radius-sm)', background: 'var(--color-bg-surface)' }}>
              <Icon size="md" color="interactive" decorative><FaUser /></Icon>
              <Typography>Profile</Typography>
            </div>
          </Tooltip>
        </div>
        <Typography variant="small" color="muted">Tooltips on navigation items.</Typography>
      </section>

      <hr style={{ margin: '2rem 0' }} />

      {/* 11. Dynamic Content */}
      <section>
        <Typography variant="h2" color="secondary" style={{ marginBottom: '1rem' }}>11. Dynamic Content</Typography>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', alignItems: 'center' }}>
          <Tooltip content={tooltipContent}>
            <Button variant="outline">Dynamic Tooltip</Button>
          </Tooltip>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <Button
              size="sm"
              variant="secondary"
              onClick={() => setTooltipContent('You have 3 new notifications')}
            >
              Set Notifications
            </Button>
            <Button
              size="sm"
              variant="secondary"
              onClick={() => setTooltipContent('No new messages')}
            >
              Set No messages
            </Button>
            <Button
              size="sm"
              variant="secondary"
              onClick={() => setTooltipContent('This is a very long tooltip content to demonstrate that the tooltip wraps and handles dynamic changes gracefully.')}
            >
              Set Long Text
            </Button>
          </div>
        </div>
        <Typography variant="small" color="muted">
          Tooltip content updates dynamically. Current: {tooltipContent}
        </Typography>
      </section>

      <footer style={{ marginTop: '3rem', padding: '1rem', borderTop: '1px solid var(--color-divider)', color: 'var(--color-text-muted)' }}>
        <Typography variant="small" color="muted">
          Tooltip component test page – all props, placements, delays, and real‑world use cases.
        </Typography>
      </footer>
    </div>
  );
}