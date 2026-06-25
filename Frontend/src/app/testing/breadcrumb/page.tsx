'use client';

import React, { useState, useCallback, useMemo } from 'react';
import Link from 'next/link';
import {
  FaHome,
  FaUsers,
  FaWallet,
  FaReceipt,
  FaUserFriends,
  FaCog,
  FaFileInvoice,
  FaCreditCard,
  FaChevronRight,
  FaSlash,
  FaArrowRight,
  FaDollarSign,
} from 'react-icons/fa';
import { Breadcrumb } from '@/shared/_components/molecules/Breadcrumb';
import { Typography } from '@/shared/_components/atoms/Typography';
import { Button } from '@/shared/_components/atoms/Button';
import { Divider } from '@/shared/_components/atoms/Divider';
import { ThemeSwitcher } from '@/shared/_components/molecules/ThemeSwitcher';
import { Card } from '@/shared/_components/atoms/Card'; // Note: You may not have this atom yet; we'll use a div with classes
import styles from './page.module.css';

// --- Types for the demo state ---
type DemoSection = 'basic' | 'icons' | 'separator' | 'maxitems' | 'custom-link' | 'small' | 'all-features';

export default function BreadcrumbDemo() {
  // --- State ---
  const [activeSection, setActiveSection] = useState<DemoSection>('basic');
  const [selectedCurrency, setSelectedCurrency] = useState('USD');

  // --- Breadcrumb data for different scenarios ---

  // 1. Basic breadcrumb (home → groups → group details → expense)
  const basicItems = useMemo(
    () => [
      { label: 'Dashboard', href: '/dashboard' },
      { label: 'Groups', href: '/groups' },
      { label: 'Weekend Trip', href: '/groups/123' },
      { label: 'Expense Details' },
    ],
    [],
  );

  // 2. With icons
  const iconItems = useMemo(
    () => [
      { label: 'Dashboard', href: '/dashboard', icon: <FaHome /> },
      { label: 'Groups', href: '/groups', icon: <FaUsers /> },
      { label: 'Weekend Trip', href: '/groups/123', icon: <FaUserFriends /> },
      { label: 'Expense', icon: <FaReceipt /> },
    ],
    [],
  );

  // 3. Deep navigation (simulating a deep hierarchy)
  const deepItems = useMemo(
    () => [
      { label: 'Dashboard', href: '/dashboard' },
      { label: 'Groups', href: '/groups' },
      { label: 'Work', href: '/groups/work' },
      { label: 'Project Alpha', href: '/groups/work/project-alpha' },
      { label: 'Expenses', href: '/groups/work/project-alpha/expenses' },
      { label: 'Q4 Budget', href: '/groups/work/project-alpha/expenses/q4' },
      { label: 'Details' },
    ],
    [],
  );

  // 4. With custom separator
  const customSeparatorItems = useMemo(
    () => [
      { label: 'Home', href: '/', icon: <FaHome /> },
      { label: 'Settings', href: '/settings', icon: <FaCog /> },
      { label: 'Billing', href: '/settings/billing', icon: <FaCreditCard /> },
      { label: 'Invoices', icon: <FaFileInvoice /> },
    ],
    [],
  );

  // 5. With Next.js Link (renderLink)
  const linkItems = useMemo(
    () => [
      { label: 'Dashboard', href: '/dashboard', icon: <FaHome /> },
      { label: 'Wallet', href: '/wallet', icon: <FaWallet /> },
      { label: 'Transactions', href: '/transactions', icon: <FaReceipt /> },
      { label: 'Current', icon: <FaDollarSign /> },
    ],
    [],
  );

  // 6. Small variant
  const smallItems = useMemo(
    () => [
      { label: 'Dashboard', href: '/dashboard' },
      { label: 'Groups', href: '/groups' },
      { label: 'Trip', href: '/groups/trip' },
      { label: 'Details' },
    ],
    [],
  );

  // 7. All features combined
  const allFeaturesItems = useMemo(
    () => [
      { label: 'Dashboard', href: '/dashboard', icon: <FaHome /> },
      { label: 'Expenses', href: '/expenses', icon: <FaReceipt /> },
      { label: 'Shared', href: '/expenses/shared', icon: <FaUserFriends /> },
      { label: 'Settle Up', icon: <FaWallet /> },
    ],
    [],
  );

  // --- Custom renderLink for Next.js Link ---
  const renderNextLink = useCallback(
    (item: { label: string; href?: string }, props: { className: string; children: React.ReactNode }) => {
      if (!item.href) return <span className={props.className}>{props.children}</span>;
      return (
        <Link href={item.href} className={props.className}>
          {props.children}
        </Link>
      );
    },
    [],
  );

  // --- Handler for item clicks (for analytics tracking) ---
  const handleItemClick = useCallback((item: any, index: number) => {
    console.log(`[Breadcrumb] Clicked: ${item.label} at index ${index}`);
    // In a real app, you'd send this to your analytics service
  }, []);

  // --- Currency options for the "context" demo ---
  const currencies = ['USD', 'EUR', 'GBP', 'INR', 'JPY'];

  return (
    <div className={styles.container}>
      {/* Header */}
      <header className={styles.header}>
        <div className={styles.headerLeft}>
          <Typography variant="h1" color="primary">
            Breadcrumb – Real‑World Demo
          </Typography>
          <Typography variant="body" color="secondary">
            Hierarchical navigation with accessibility and responsive design
          </Typography>
        </div>
        <ThemeSwitcher variant="icon" />
      </header>

      {/* Navigation Tabs */}
      <div className={styles.tabs}>
        <button
          className={`${styles.tab} ${activeSection === 'basic' ? styles.tabActive : ''}`}
          onClick={() => setActiveSection('basic')}
        >
          Basic
        </button>
        <button
          className={`${styles.tab} ${activeSection === 'icons' ? styles.tabActive : ''}`}
          onClick={() => setActiveSection('icons')}
        >
          With Icons
        </button>
        <button
          className={`${styles.tab} ${activeSection === 'separator' ? styles.tabActive : ''}`}
          onClick={() => setActiveSection('separator')}
        >
          Custom Separator
        </button>
        <button
          className={`${styles.tab} ${activeSection === 'maxitems' ? styles.tabActive : ''}`}
          onClick={() => setActiveSection('maxitems')}
        >
          Collapsing
        </button>
        <button
          className={`${styles.tab} ${activeSection === 'custom-link' ? styles.tabActive : ''}`}
          onClick={() => setActiveSection('custom-link')}
        >
          Next.js Link
        </button>
        <button
          className={`${styles.tab} ${activeSection === 'small' ? styles.tabActive : ''}`}
          onClick={() => setActiveSection('small')}
        >
          Small Variant
        </button>
        <button
          className={`${styles.tab} ${activeSection === 'all-features' ? styles.tabActive : ''}`}
          onClick={() => setActiveSection('all-features')}
        >
          All Features
        </button>
      </div>

      <Divider variant="middle" label="Demo" thickness={2} />

      {/* --- Demo Content --- */}

      {/* 1. Basic */}
      {activeSection === 'basic' && (
        <section className={styles.section}>
          <div className={styles.sectionHeader}>
            <Typography variant="h3" color="primary">
              Basic Breadcrumb
            </Typography>
            <Typography variant="small" color="muted">
              Simple navigation with default separator (<code>/</code>)
            </Typography>
          </div>
          <div className={styles.card}>
            <Breadcrumb
              items={basicItems}
              onItemClick={handleItemClick}
            />
          </div>
          <div className={styles.codeBlock}>
            <Typography variant="small" color="secondary" className={styles.codeLabel}>
              Usage:
            </Typography>
            <pre className={styles.code}>
              {`<Breadcrumb
  items={[
    { label: 'Dashboard', href: '/dashboard' },
    { label: 'Groups', href: '/groups' },
    { label: 'Weekend Trip', href: '/groups/123' },
    { label: 'Expense Details' },
  ]}
/>`}
            </pre>
          </div>
        </section>
      )}

      {/* 2. With Icons */}
      {activeSection === 'icons' && (
        <section className={styles.section}>
          <div className={styles.sectionHeader}>
            <Typography variant="h3" color="primary">
              With Icons
            </Typography>
            <Typography variant="small" color="muted">
              Each item can have an icon for better visual identification
            </Typography>
          </div>
          <div className={styles.card}>
            <Breadcrumb items={iconItems} onItemClick={handleItemClick} />
          </div>
          <div className={styles.codeBlock}>
            <Typography variant="small" color="secondary" className={styles.codeLabel}>
              Usage:
            </Typography>
            <pre className={styles.code}>
              {`<Breadcrumb
  items={[
    { label: 'Dashboard', href: '/dashboard', icon: <FaHome /> },
    { label: 'Groups', href: '/groups', icon: <FaUsers /> },
    { label: 'Weekend Trip', href: '/groups/123', icon: <FaUserFriends /> },
    { label: 'Expense', icon: <FaReceipt /> },
  ]}
/>`}
            </pre>
          </div>
        </section>
      )}

      {/* 3. Custom Separator */}
      {activeSection === 'separator' && (
        <section className={styles.section}>
          <div className={styles.sectionHeader}>
            <Typography variant="h3" color="primary">
              Custom Separator
            </Typography>
            <Typography variant="small" color="muted">
              Use any React node as a separator
            </Typography>
          </div>
          <div className={styles.card}>
            <div className={styles.separatorDemo}>
              <div>
                <Typography variant="body" color="secondary" className={styles.separatorLabel}>
                  Chevron ({'>'}):
                </Typography>
                <Breadcrumb
                  items={customSeparatorItems}
                  separator={<FaChevronRight size={12} />}
                  onItemClick={handleItemClick}
                />
              </div>
              <div>
                <Typography variant="body" color="secondary" className={styles.separatorLabel}>
                  Slash (<code>/</code>):
                </Typography>
                <Breadcrumb
                  items={customSeparatorItems}
                  separator={<FaSlash size={12} />}
                  onItemClick={handleItemClick}
                />
              </div>
              <div>
                <Typography variant="body" color="secondary" className={styles.separatorLabel}>
                  Arrow (<code>→</code>):
                </Typography>
                <Breadcrumb
                  items={customSeparatorItems}
                  separator={<FaArrowRight size={12} />}
                  onItemClick={handleItemClick}
                />
              </div>
            </div>
          </div>
          <div className={styles.codeBlock}>
            <Typography variant="small" color="secondary" className={styles.codeLabel}>
              Usage:
            </Typography>
            <pre className={styles.code}>
              {`<Breadcrumb
  items={items}
  separator={<FaChevronRight size={12} />}
/>`}
            </pre>
          </div>
        </section>
      )}

      {/* 4. MaxItems (Collapsing) */}
      {activeSection === 'maxitems' && (
        <section className={styles.section}>
          <div className={styles.sectionHeader}>
            <Typography variant="h3" color="primary">
              Auto‑Collapsing
            </Typography>
            <Typography variant="small" color="muted">
              Long breadcrumbs automatically collapse with an ellipsis
            </Typography>
          </div>
          <div className={styles.card}>
            <div>
              <Typography variant="body" color="secondary" className={styles.collapseLabel}>
                <strong>Full path:</strong> (6 items)
              </Typography>
              <Breadcrumb items={deepItems} onItemClick={handleItemClick} />
            </div>
            <Divider orientation="horizontal" thickness={1} className={styles.divider} />
            <div>
              <Typography variant="body" color="secondary" className={styles.collapseLabel}>
                <strong>Collapsed (maxItems: 3):</strong> Dashboard … Details
              </Typography>
              <Breadcrumb items={deepItems} maxItems={3} onItemClick={handleItemClick} />
            </div>
            <div>
              <Typography variant="body" color="secondary" className={styles.collapseLabel}>
                <strong>Collapsed (maxItems: 4):</strong> Dashboard … Q4 Budget Details
              </Typography>
              <Breadcrumb items={deepItems} maxItems={4} onItemClick={handleItemClick} />
            </div>
            <div>
              <Typography variant="body" color="secondary" className={styles.collapseLabel}>
                <strong>With custom ellipsis:</strong>
              </Typography>
              <Breadcrumb
                items={deepItems}
                maxItems={3}
                collapsedEllipsis={{ label: '⋯', icon: <FaUserFriends /> }}
                onItemClick={handleItemClick}
              />
            </div>
          </div>
          <div className={styles.codeBlock}>
            <Typography variant="small" color="secondary" className={styles.codeLabel}>
              Usage:
            </Typography>
            <pre className={styles.code}>
              {`<Breadcrumb
  items={deepItems}
  maxItems={3}
  collapsedEllipsis={{ label: '⋯', icon: <FaUserFriends /> }}
/>`}
            </pre>
          </div>
        </section>
      )}

      {/* 5. Next.js Link (renderLink) */}
      {activeSection === 'custom-link' && (
        <section className={styles.section}>
          <div className={styles.sectionHeader}>
            <Typography variant="h3" color="primary">
              Next.js Link Integration
            </Typography>
            <Typography variant="small" color="muted">
              Use <code>renderLink</code> to integrate with your routing library
            </Typography>
          </div>
          <div className={styles.card}>
            <Breadcrumb
              items={linkItems}
              renderLink={renderNextLink}
              onItemClick={handleItemClick}
            />
            <Typography variant="small" color="muted" className={styles.hint}>
              💡 Click any item to see the Next.js Link in action (check the console)
            </Typography>
          </div>
          <div className={styles.codeBlock}>
            <Typography variant="small" color="secondary" className={styles.codeLabel}>
              Usage:
            </Typography>
            <pre className={styles.code}>
              {`const renderNextLink = (item, props) => {
  if (!item.href) return <span {...props} />;
  return <Link href={item.href} {...props} />;
};

<Breadcrumb
  items={items}
  renderLink={renderNextLink}
/>`}
            </pre>
          </div>
        </section>
      )}

      {/* 6. Small Variant */}
      {activeSection === 'small' && (
        <section className={styles.section}>
          <div className={styles.sectionHeader}>
            <Typography variant="h3" color="primary">
              Small Variant
            </Typography>
            <Typography variant="small" color="muted">
              Compact version for tight spaces (e.g., page headers, modals)
            </Typography>
          </div>
          <div className={styles.card}>
            <div>
              <Typography variant="body" color="secondary" className={styles.sizeLabel}>
                <strong>Default (md):</strong>
              </Typography>
              <Breadcrumb items={smallItems} onItemClick={handleItemClick} />
            </div>
            <Divider orientation="horizontal" thickness={1} className={styles.divider} />
            <div>
              <Typography variant="body" color="secondary" className={styles.sizeLabel}>
                <strong>Small variant:</strong>
              </Typography>
              <Breadcrumb items={smallItems} small onItemClick={handleItemClick} />
            </div>
            <div>
              <Typography variant="body" color="secondary" className={styles.sizeLabel}>
                <strong>Small + with icons:</strong>
              </Typography>
              <Breadcrumb
                items={iconItems}
                small
                onItemClick={handleItemClick}
              />
            </div>
          </div>
          <div className={styles.codeBlock}>
            <Typography variant="small" color="secondary" className={styles.codeLabel}>
              Usage:
            </Typography>
            <pre className={styles.code}>{`<Breadcrumb items={items} small />`}</pre>
          </div>
        </section>
      )}

      {/* 7. All Features Combined */}
      {activeSection === 'all-features' && (
        <section className={styles.section}>
          <div className={styles.sectionHeader}>
            <Typography variant="h3" color="primary">
              All Features Combined
            </Typography>
            <Typography variant="small" color="muted">
              Icons + custom separator + maxItems + custom renderLink + small variant
            </Typography>
          </div>
          <div className={styles.card}>
            <div className={styles.allFeatures}>
              <div className={styles.featureContext}>
                <Typography variant="body" color="secondary" className={styles.contextLabel}>
                  Current context:
                </Typography>
                <select
                  value={selectedCurrency}
                  onChange={(e) => setSelectedCurrency(e.target.value)}
                  className={styles.select}
                >
                  {currencies.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>
              <Breadcrumb
                items={allFeaturesItems}
                separator={<FaChevronRight size={10} />}
                maxItems={3}
                renderLink={renderNextLink}
                small={false}
                onItemClick={handleItemClick}
              />
              <Typography variant="small" color="muted" className={styles.hint}>
                💡 Current currency: <strong>{selectedCurrency}</strong> (breadcrumb context updates)
              </Typography>
            </div>
          </div>
          <div className={styles.codeBlock}>
            <Typography variant="small" color="secondary" className={styles.codeLabel}>
              Usage:
            </Typography>
            <pre className={styles.code}>
              {`<Breadcrumb
  items={items}
  separator={<FaChevronRight size={10} />}
  maxItems={3}
  renderLink={renderNextLink}
  small={false}
  onItemClick={handleItemClick}
/>`}
            </pre>
          </div>
        </section>
      )}

      <Divider variant="middle" label="Documentation" thickness={2} />

      {/* Documentation Section */}
      <section className={styles.section}>
        <Typography variant="h3" color="primary">
          Props Reference
        </Typography>
        <div className={styles.propsTable}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Prop</th>
                <th>Type</th>
                <th>Default</th>
                <th>Description</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><code>items</code></td>
                <td><code>BreadcrumbItem[]</code></td>
                <td><code>—</code></td>
                <td><strong>Required.</strong> Array of breadcrumb items</td>
              </tr>
              <tr>
                <td><code>separator</code></td>
                <td><code>React.ReactNode</code></td>
                {/* <td><code>'/'</code></td> */}
                <td>Custom separator between items</td>
              </tr>
              <tr>
                <td><code>aria-label</code></td>
                <td><code>string</code></td>
                {/* <td><code>'Breadcrumb'</code></td> */}
                <td>Accessible label for the nav</td>
              </tr>
              <tr>
                <td><code>maxItems</code></td>
                <td><code>number</code></td>
                <td><code>—</code></td>
                <td>Max visible items before collapsing</td>
              </tr>
              <tr>
                <td><code>renderLink</code></td>
                {/* <td><code>(item, props) => ReactNode</code></td> */}
                <td><code>—</code></td>
                <td>Custom link renderer (for Next.js Link)</td>
              </tr>
              <tr>
                <td><code>collapsedEllipsis</code></td>
                <td><code>BreadcrumbItem</code></td>
                {/* <td><code>{ label: '…', icon: HiDotsHorizontal }</code></td> */}
                <td>Custom ellipsis item</td>
              </tr>
              <tr>
                <td><code>small</code></td>
                <td><code>boolean</code></td>
                <td><code>false</code></td>
                <td>Compact variant</td>
              </tr>
              <tr>
                <td><code>onItemClick</code></td>
                {/* <td><code>(item, index) => void</code></td> */}
                <td><code>—</code></td>
                <td>Click handler for analytics/tracking</td>
              </tr>
              <tr>
                <td><code>className</code></td>
                <td><code>string</code></td>
                <td><code>—</code></td>
                <td>Additional CSS class</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <footer className={styles.footer}>
        <Typography variant="small" color="muted">
          Breadcrumb Demo – Built with TrueSplit Design System
        </Typography>
      </footer>
    </div>
  );
}