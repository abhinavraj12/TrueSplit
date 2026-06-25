// F:\PERSONAL\TrueSplit\frontend\src\app\testing\icon\page.tsx

'use client';

import React from 'react';
import { Icon } from '@/shared/_components/atoms/Icon';
import { Typography } from '@/shared/_components/atoms/Typography';
import { Button } from '@/shared/_components/atoms/Button';
import { Badge } from '@/shared/_components/atoms/Badge';
import { ThemeSwitcher } from '@/shared/_components/molecules/ThemeSwitcher';
import {
  FaHome,
  FaUser,
  FaBell,
  FaCheckCircle,
  FaExclamationTriangle,
  FaInfoCircle,
  FaSpinner,
  FaHeart,
  FaStar,
  FaCamera,
  FaCloud,
  FaGithub,
  FaSave,
  FaTrash,
  FaEdit,
} from 'react-icons/fa';

/**
 * Testing page for the Icon component.
 * Demonstrates all variants, sizes, colors, animations, and multi‑color support.
 */
export default function IconTestPage() {
  return (
    <div style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <Typography variant="h1">Icon Component – Real‑World Test</Typography>
        <ThemeSwitcher variant="both" />
      </div>

      <hr style={{ margin: '2rem 0' }} />

      {/* 1. All Sizes */}
      <section>
        <Typography variant="h2" color="secondary" style={{ marginBottom: '1rem' }}>1. Sizes</Typography>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1.5rem', alignItems: 'center' }}>
          <Icon size="xs" label="XS"><FaHome /></Icon>
          <Icon size="sm" label="SM"><FaHome /></Icon>
          <Icon size="md" label="MD"><FaHome /></Icon>
          <Icon size="lg" label="LG"><FaHome /></Icon>
          <Icon size="xl" label="XL"><FaHome /></Icon>
        </div>
        <Typography variant="small" color="muted">
          Sizes: xs (12px), sm (16px), md (20px), lg (24px), xl (32px)
        </Typography>
      </section>

      <hr style={{ margin: '2rem 0' }} />

      {/* 2. All Theme Colors */}
      <section>
        <Typography variant="h2" color="secondary" style={{ marginBottom: '1rem' }}>2. Theme Colors</Typography>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1.5rem', alignItems: 'center' }}>
          <Icon color="default" label="Default"><FaHeart /></Icon>
          <Icon color="muted" label="Muted"><FaHeart /></Icon>
          <Icon color="interactive" label="Interactive"><FaHeart /></Icon>
          <Icon color="primary" label="Primary"><FaHeart /></Icon>
          <Icon color="success" label="Success"><FaHeart /></Icon>
          <Icon color="warning" label="Warning"><FaHeart /></Icon>
          <Icon color="error" label="Error"><FaHeart /></Icon>
          <Icon color="info" label="Info"><FaHeart /></Icon>
          <Icon color="link" label="Link"><FaHeart /></Icon>
        </div>
        <Typography variant="small" color="muted">
          Colors: default, muted, interactive, primary, success, warning, error, info, link
        </Typography>
      </section>

      <hr style={{ margin: '2rem 0' }} />

      {/* 3. Custom Color */}
      <section>
        <Typography variant="h2" color="secondary" style={{ marginBottom: '1rem' }}>3. Custom Color</Typography>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1.5rem', alignItems: 'center' }}>
          <Icon color="#ff6b6b" label="Custom hex"><FaStar /></Icon>
          <Icon color="rgb(255, 150, 50)" label="Custom rgb"><FaStar /></Icon>
          <Icon color="hotpink" label="Custom named"><FaStar /></Icon>
          <Icon color="rebeccapurple" label="Custom named"><FaStar /></Icon>
        </div>
        <Typography variant="small" color="muted">
          Custom colors can be any valid CSS color string.
        </Typography>
      </section>

      <hr style={{ margin: '2rem 0' }} />

      {/* 4. Decorative (aria-hidden) */}
      <section>
        <Typography variant="h2" color="secondary" style={{ marginBottom: '1rem' }}>4. Decorative Icons</Typography>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1.5rem', alignItems: 'center' }}>
          <Icon decorative><FaCamera /></Icon>
          <Icon decorative><FaCloud /></Icon>
          <Icon decorative><FaBell /></Icon>
        </div>
        <Typography variant="small" color="muted">
          Decorative icons are hidden from screen readers (<code>aria-hidden=</code>).
        </Typography>
      </section>

      <hr style={{ margin: '2rem 0' }} />

      {/* 5. Accessible (with label) */}
      <section>
        <Typography variant="h2" color="secondary" style={{ marginBottom: '1rem' }}>5. Accessible Icons</Typography>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1.5rem', alignItems: 'center' }}>
          <Icon label="Home" color="interactive"><FaHome /></Icon>
          <Icon label="User profile" color="primary"><FaUser /></Icon>
          <Icon label="Notifications" color="warning"><FaBell /></Icon>
          <Icon label="GitHub" color="default"><FaGithub /></Icon>
        </div>
        <Typography variant="small" color="muted">
          Accessible icons have <code>role=</code> and <code>aria-label</code>.
        </Typography>
      </section>

      <hr style={{ margin: '2rem 0' }} />

      {/* 6. Spin Animation */}
      <section>
        <Typography variant="h2" color="secondary" style={{ marginBottom: '1rem' }}>6. Spin Animation</Typography>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1.5rem', alignItems: 'center' }}>
          <Icon spin label="Loading"><FaSpinner /></Icon>
          <Icon spin color="primary" label="Loading"><FaSpinner /></Icon>
          <Icon spin color="success" label="Loading"><FaSpinner /></Icon>
          <Icon spin color="interactive" label="Loading"><FaSpinner /></Icon>
        </div>
        <Typography variant="small" color="muted">
          Use <code>spin</code> for loading/processing states.
        </Typography>
      </section>

      <hr style={{ margin: '2rem 0' }} />

      {/* 7. Pulse Animation */}
      <section>
        <Typography variant="h2" color="secondary" style={{ marginBottom: '1rem' }}>7. Pulse Animation</Typography>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1.5rem', alignItems: 'center' }}>
          <Icon pulse label="Attention"><FaBell /></Icon>
          <Icon pulse color="error" label="Alert"><FaExclamationTriangle /></Icon>
          <Icon pulse color="warning" label="Warning"><FaInfoCircle /></Icon>
        </div>
        <Typography variant="small" color="muted">
          Use <code>pulse</code> to draw attention.
        </Typography>
      </section>

      <hr style={{ margin: '2rem 0' }} />

      {/* 8. Multi‑Color SVG Support */}
      <section>
        <Typography variant="h2" color="secondary" style={{ marginBottom: '1rem' }}>8. Multi‑Color SVG Support</Typography>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '2rem', alignItems: 'center' }}>
          <div style={{ textAlign: 'center' }}>
            <Icon size="xl" label="Multi‑color logo">
              <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
                <circle cx="30" cy="30" r="25" fill="#ff6b6b" />
                <circle cx="70" cy="30" r="25" fill="#4ecdc4" />
                <circle cx="50" cy="70" r="25" fill="#ffe66d" />
                <text x="50" y="55" textAnchor="middle" fill="#2c3e50" fontSize="12" fontWeight="bold">3</text>
              </svg>
            </Icon>
            <Typography variant="small">Multi‑color logo</Typography>
          </div>
          <div style={{ textAlign: 'center' }}>
            <Icon size="xl" label="Colored SVG">
              <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
                <rect x="10" y="10" width="80" height="80" fill="#4a90d9" rx="10" />
                <circle cx="50" cy="50" r="25" fill="#fff" />
                <path d="M50 30 L65 60 L35 60 Z" fill="#2c3e50" />
              </svg>
            </Icon>
            <Typography variant="small">Custom SVG with explicit colors</Typography>
          </div>
          <div style={{ textAlign: 'center' }}>
            <Icon size="xl" label="Multi‑color with theme" color="primary">
              <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
                <circle cx="50" cy="50" r="45" fill="currentColor" opacity="0.2" />
                <circle cx="50" cy="50" r="30" fill="currentColor" />
                <circle cx="50" cy="50" r="15" fill="#fff" />
              </svg>
            </Icon>
            <Typography variant="small">Using <code>currentColor</code> with theme</Typography>
          </div>
        </div>
        <Typography variant="small" color="muted">
          Multi‑color SVGs retain their original colors. Icons using <code>currentColor</code> adapt to theme.
        </Typography>
      </section>

      <hr style={{ margin: '2rem 0' }} />

      {/* 9. Real‑world Scenario: Buttons with Icons using Button component */}
      <section>
        <Typography variant="h2" color="secondary" style={{ marginBottom: '1rem' }}>9. Buttons with Icons</Typography>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem', alignItems: 'center' }}>
          <Button leftIcon={<Icon size="sm" color="interactive" decorative><FaHome /></Icon>}>
            Home
          </Button>
          <Button variant="success" leftIcon={<Icon size="sm" color="inherit" decorative><FaSave /></Icon>}>
            Save
          </Button>
          <Button variant="danger" leftIcon={<Icon size="sm" color="inherit" decorative><FaTrash /></Icon>}>
            Delete
          </Button>
          <Button variant="secondary" leftIcon={<Icon size="sm" color="inherit" decorative><FaEdit /></Icon>}>
            Edit
          </Button>
          <Button variant="outline" leftIcon={<Icon size="sm" color="inherit" decorative><FaCheckCircle /></Icon>}>
            Confirm
          </Button>
        </div>
        <Typography variant="small" color="muted">
          Buttons using our <code>Button</code> component with <code>leftIcon</code> and Icon.
        </Typography>
      </section>

      <hr style={{ margin: '2rem 0' }} />

      {/* 10. Real‑world: Notification Badge with Icon */}
      <section>
        <Typography variant="h2" color="secondary" style={{ marginBottom: '1rem' }}>10. Notification Badge</Typography>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '2rem', alignItems: 'center' }}>
          <div style={{ position: 'relative', display: 'inline-block' }}>
            <Icon size="xl" color="interactive" label="Notifications"><FaBell /></Icon>
            <span style={{ position: 'absolute', top: '-8px', right: '-8px' }}>
              <Badge variant="primary" size="sm">3</Badge>
            </span>
          </div>
          <div style={{ position: 'relative', display: 'inline-block' }}>
            <Icon size="lg" color="muted" label="Messages"><FaBell /></Icon>
            <span style={{ position: 'absolute', top: '-6px', right: '-6px' }}>
              <Badge variant="warning" size="sm">12</Badge>
            </span>
          </div>
        </div>
        <Typography variant="small" color="muted">
          Badge count on top of Icon – integrated with Badge component.
        </Typography>
      </section>

      <footer style={{ marginTop: '3rem', padding: '1rem', borderTop: '1px solid var(--color-divider)', color: 'var(--color-text-muted)' }}>
        <Typography variant="small" color="muted">
          Icon component test page – all sizes, colors, animations, and real‑world use cases.
        </Typography>
      </footer>
    </div>
  );
}