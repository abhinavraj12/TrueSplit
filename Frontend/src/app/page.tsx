'use client';

import { useState, useEffect } from 'react';
import { Typography } from '@/shared/_components/atoms/Typography';
import { Button } from '@/shared/_components/atoms/Button';
import { Icon } from '@/shared/_components/atoms/Icon';
import { Input } from '@/shared/_components/atoms/Input';
import { Avatar, AvatarGroup } from '@/shared/_components/atoms/Avatar';
import { Badge } from '@/shared/_components/atoms/Badge';
import { Checkbox } from '@/shared/_components/atoms/Checkbox';
import {
  FaPlus,
  FaTrash,
  FaCheck,
  FaArrowRight,
  FaEdit,
  FaCog,
  FaTimes,
  FaHome,
  FaUser,
  FaBell,
  FaInfo,
  FaExclamationTriangle,
  FaEnvelope,
  FaSearch,
} from 'react-icons/fa';
import { Switch } from '@/shared/_components/atoms/Switch';
import { Radio } from '@/shared/_components/atoms/Radio';
import Skeleton from '@/shared/_components/atoms/Skeleton/Skeleton';
import { Divider } from '@/shared/_components/atoms/Divider';
import { Spinner } from '@/shared/_components/atoms/Spinner';
import Tooltip from '@/shared/_components/atoms/Tooltip';
import { Textarea } from '@/shared/_components/atoms/Textarea';

export default function Home() {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [loadingState, setLoadingState] = useState<{
    [key: string]: boolean;
  }>({});

  // Checkbox states
  const [checked1, setChecked1] = useState(false);
  const [checked2, setChecked2] = useState(false);
  const [indeterminate, setIndeterminate] = useState(true);
  const [selectedCategories, setSelectedCategories] = useState<{
    food: boolean;
    transport: boolean;
    rent: boolean;
    shopping: boolean;
    entertainment: boolean;
  }>({
    food: true,
    transport: false,
    rent: true,
    shopping: false,
    entertainment: false,
  });

  const allChecked = Object.values(selectedCategories).every(Boolean);
  const someChecked = Object.values(selectedCategories).some(Boolean);

  const [switch1, setSwitch1] = useState(false);
const [switch2, setSwitch2] = useState(true);
const [switch3, setSwitch3] = useState(false);
const [selectedPayment, setSelectedPayment] = useState<string>('cash');
const [selectedSplit, setSelectedSplit] = useState<string>('equal');


  // Apply theme to root element
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  const handleLoadingClick = (id: string) => {
    setLoadingState((prev) => ({ ...prev, [id]: true }));
    setTimeout(() => {
      setLoadingState((prev) => ({ ...prev, [id]: false }));
    }, 2000);
  };

  const toggleAllCategories = () => {
    const newValue = !allChecked;
    setSelectedCategories({
      food: newValue,
      transport: newValue,
      rent: newValue,
      shopping: newValue,
      entertainment: newValue,
    });
  };

  const updateCategory = (key: keyof typeof selectedCategories, value: boolean) => {
    setSelectedCategories((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <main
      style={{
        padding: '2rem',
        maxWidth: '1200px',
        margin: '0 auto',
        minHeight: '100vh',
        backgroundColor: 'var(--color-bg-page)',
        transition: 'background-color var(--duration-base) var(--easing-standard)',
      }}
    >
      {/* ===== HEADER ===== */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '2rem',
          padding: '1rem 0',
          borderBottom: '1px solid var(--color-border)',
        }}
      >
        <div>
          <Typography variant="h1" color="primary" weight="bold">
            TrueSplit
          </Typography>
          <Typography variant="small" color="secondary">
            Component Library Showcase — Atoms
          </Typography>
        </div>
        <Button onClick={toggleTheme} variant="secondary" size="sm" leftIcon={<FaCog />}>
          {theme === 'light' ? '🌙 Dark' : '☀️ Light'}
        </Button>
      </div>

{/* ===== TEXTAREA SECTION ===== */}
<div
  style={{
    marginBottom: '2.5rem',
    padding: '1.5rem',
    backgroundColor: 'var(--color-bg-surface)',
    borderRadius: 'var(--radius-lg)',
    border: '1px solid var(--color-border)',
    transition: 'background-color var(--duration-base) var(--easing-standard)',
  }}
>
  <Typography variant="h3" color="primary" weight="semibold" style={{ marginBottom: '0.5rem' }}>
    Textarea
  </Typography>
  <Typography variant="body" color="secondary" style={{ marginBottom: '1rem' }}>
    Multi-line text input for descriptions, notes, and comments
  </Typography>

  {/* Sizes */}
  <Typography variant="body" color="primary" weight="medium" style={{ marginBottom: '0.5rem' }}>
    Sizes
  </Typography>
  <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '1.5rem', maxWidth: '500px' }}>
    <Textarea textareaSize="sm" placeholder="Small textarea" rows={2} />
    <Textarea textareaSize="md" placeholder="Medium textarea" rows={3} />
    <Textarea textareaSize="lg" placeholder="Large textarea" rows={4} />
  </div>

  {/* States */}
  <Typography variant="body" color="primary" weight="medium" style={{ marginBottom: '0.5rem' }}>
    States
  </Typography>
  <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '1.5rem', maxWidth: '500px' }}>
    <Textarea placeholder="Default textarea" rows={2} />
    <Textarea placeholder="Error state" error rows={2} />
    <Textarea placeholder="Success state" success rows={2} />
    <Textarea placeholder="Disabled textarea" disabled rows={2} />
  </div>

  {/* Auto-resize */}
  <Typography variant="body" color="primary" weight="medium" style={{ marginBottom: '0.5rem' }}>
    Auto-resize
  </Typography>
  <div style={{ maxWidth: '500px', marginBottom: '1.5rem' }}>
    <Textarea
      placeholder="Type something to see auto-resize in action..."
      autoResize
      rows={2}
      maxHeight={200}
    />
    <Typography variant="small" color="muted" style={{ marginTop: '0.25rem' }}>
      Auto-resizes up to 200px max height
    </Typography>
  </div>

  {/* Full width */}
  <Typography variant="body" color="primary" weight="medium" style={{ marginBottom: '0.5rem' }}>
    Full Width
  </Typography>
  <div style={{ marginBottom: '1.5rem' }}>
    <Textarea fullWidth placeholder="Full width textarea" rows={2} />
  </div>

  {/* Real World Examples */}
  <Typography variant="body" color="primary" weight="medium" style={{ marginBottom: '0.5rem' }}>
    Real World Examples
  </Typography>
  <div
    style={{
      display: 'flex',
      flexDirection: 'column',
      gap: '1rem',
      padding: '1rem',
      backgroundColor: 'var(--color-bg-elevated)',
      borderRadius: 'var(--radius-md)',
      border: '1px solid var(--color-border)',
    }}
  >
    {/* Expense Description */}
    <div>
      <Typography variant="small" color="secondary" style={{ marginBottom: '0.25rem' }}>
        Expense Description
      </Typography>
      <Textarea
        placeholder="Add a description for this expense..."
        rows={2}
        autoResize
      />
    </div>

    {/* Group Description */}
    <div>
      <Typography variant="small" color="secondary" style={{ marginBottom: '0.25rem' }}>
        Group Description
      </Typography>
      <Textarea
        placeholder="Describe your group..."
        rows={3}
        textareaSize="lg"
      />
    </div>

    {/* Comment */}
    <div>
      <Typography variant="small" color="secondary" style={{ marginBottom: '0.25rem' }}>
        Comment
      </Typography>
      <Textarea
        placeholder="Write a comment..."
        rows={2}
        textareaSize="sm"
        autoResize
        maxHeight={120}
      />
    </div>

    {/* With error message */}
    <div>
      <Typography variant="small" color="secondary" style={{ marginBottom: '0.25rem' }}>
        Description <span style={{ color: 'var(--color-error-text)' }}>*</span>
      </Typography>
      <Textarea
        placeholder="Description is required"
        rows={2}
        error="Description is required"
      />
      <Typography variant="small" color="error" style={{ marginTop: '0.25rem' }}>
        Description is required
      </Typography>
    </div>
  </div>
</div>

{/* ===== TOOLTIP SECTION ===== */}
<div
  style={{
    marginBottom: '2.5rem',
    padding: '1.5rem',
    backgroundColor: 'var(--color-bg-surface)',
    borderRadius: 'var(--radius-lg)',
    border: '1px solid var(--color-border)',
    transition: 'background-color var(--duration-base) var(--easing-standard)',
  }}
>
  <Typography variant="h3" color="primary" weight="semibold" style={{ marginBottom: '0.5rem' }}>
    Tooltips
  </Typography>
  <Typography variant="body" color="secondary" style={{ marginBottom: '1rem' }}>
    Contextual tooltips with placement, delay, and accessibility
  </Typography>

  {/* Placements */}
  <Typography variant="body" color="primary" weight="medium" style={{ marginBottom: '0.5rem' }}>
    Placements
  </Typography>
  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1.5rem', alignItems: 'center', marginBottom: '1.5rem' }}>
    <Tooltip content="I'm on top!" placement="top">
      <Button variant="secondary" size="sm">Top</Button>
    </Tooltip>
    <Tooltip content="I'm on the bottom!" placement="bottom">
      <Button variant="secondary" size="sm">Bottom</Button>
    </Tooltip>
    <Tooltip content="I'm on the left!" placement="left">
      <Button variant="secondary" size="sm">Left</Button>
    </Tooltip>
    <Tooltip content="I'm on the right!" placement="right">
      <Button variant="secondary" size="sm">Right</Button>
    </Tooltip>
  </div>

  {/* With custom delay */}
  <Typography variant="body" color="primary" weight="medium" style={{ marginBottom: '0.5rem' }}>
    Custom Delay
  </Typography>
  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1.5rem', alignItems: 'center', marginBottom: '1.5rem' }}>
    <Tooltip content="Fast (100ms)" placement="top" delay={100}>
      <Button variant="outline" size="sm">Fast</Button>
    </Tooltip>
    <Tooltip content="Normal (200ms)" placement="top" delay={200}>
      <Button variant="outline" size="sm">Normal</Button>
    </Tooltip>
    <Tooltip content="Slow (500ms)" placement="top" delay={500}>
      <Button variant="outline" size="sm">Slow</Button>
    </Tooltip>
  </div>

  {/* Disabled */}
  <Typography variant="body" color="primary" weight="medium" style={{ marginBottom: '0.5rem' }}>
    Disabled
  </Typography>
  <Tooltip content="This won't show" placement="top" disabled>
    <Button variant="secondary" size="sm">Hover (no tooltip)</Button>
  </Tooltip>

  {/* Long content */}
  <Typography variant="body" color="primary" weight="medium" style={{ marginTop: '1.5rem', marginBottom: '0.5rem' }}>
    Long Content
  </Typography>
  <Tooltip
    content="This tooltip has a longer description to demonstrate how it handles multi‑line text and wraps gracefully within the max-width constraint."
    placement="bottom"
  >
    <Button variant="primary">Hover for long text</Button>
  </Tooltip>

  {/* On Icons */}
  <Typography variant="body" color="primary" weight="medium" style={{ marginTop: '1.5rem', marginBottom: '0.5rem' }}>
    On Icons
  </Typography>
  <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
    <Tooltip content="Dashboard" placement="top">
      <Icon size="lg"><FaHome /></Icon>
    </Tooltip>
    <Tooltip content="User Profile" placement="top">
      <Icon size="lg"><FaUser /></Icon>
    </Tooltip>
    <Tooltip content="Settings" placement="top">
      <Icon size="lg"><FaCog /></Icon>
    </Tooltip>
    <Tooltip content="Notifications" placement="top">
      <Icon size="lg"><FaBell /></Icon>
    </Tooltip>
  </div>
</div>

{/* ===== SPINNER SECTION ===== */}
<div
  style={{
    marginBottom: '2.5rem',
    padding: '1.5rem',
    backgroundColor: 'var(--color-bg-surface)',
    borderRadius: 'var(--radius-lg)',
    border: '1px solid var(--color-border)',
    transition: 'background-color var(--duration-base) var(--easing-standard)',
  }}
>
  <Typography variant="h3" color="primary" weight="semibold" style={{ marginBottom: '0.5rem' }}>
    Spinner
  </Typography>
  <Typography variant="body" color="secondary" style={{ marginBottom: '1rem' }}>
    Standalone loading indicator with sizes, colors, and speeds
  </Typography>

  {/* Sizes */}
  <Typography variant="body" color="primary" weight="medium" style={{ marginBottom: '0.5rem' }}>
    Sizes
  </Typography>
  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1.5rem', alignItems: 'center', marginBottom: '1.5rem' }}>
    <Spinner size="xs" />
    <Spinner size="sm" />
    <Spinner size="md" />
    <Spinner size="lg" />
    <Spinner size="xl" />
  </div>

  {/* Colors */}
  <Typography variant="body" color="primary" weight="medium" style={{ marginBottom: '0.5rem' }}>
    Colors
  </Typography>
  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1.5rem', alignItems: 'center', marginBottom: '1.5rem' }}>
    <Spinner color="default" />
    <Spinner color="primary" />
    <Spinner color="success" />
    <Spinner color="warning" />
    <Spinner color="error" />
    <Spinner color="info" />
    <Spinner color="link" />
  </div>

  {/* Speeds */}
  <Typography variant="body" color="primary" weight="medium" style={{ marginBottom: '0.5rem' }}>
    Speeds
  </Typography>
  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1.5rem', alignItems: 'center', marginBottom: '1.5rem' }}>
    <Spinner speed="slow" />
    <Spinner speed="normal" />
    <Spinner speed="fast" />
  </div>

  {/* With custom label */}
  <Typography variant="body" color="primary" weight="medium" style={{ marginBottom: '0.5rem' }}>
    With Custom Label
  </Typography>
  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', alignItems: 'center', marginBottom: '1.5rem' }}>
    <Spinner label="Loading expenses..." />
    <Spinner label="Processing payment..." color="success" />
  </div>

  {/* Real World Examples */}
  <Typography variant="body" color="primary" weight="medium" style={{ marginBottom: '0.5rem' }}>
    Real World Examples
  </Typography>
  <div
    style={{
      display: 'flex',
      flexDirection: 'column',
      gap: '1rem',
      padding: '1rem',
      backgroundColor: 'var(--color-bg-elevated)',
      borderRadius: 'var(--radius-md)',
      border: '1px solid var(--color-border)',
    }}
  >
    {/* Button with spinner */}
    <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
      <Button loading variant="primary" size="sm">
        Loading
      </Button>
      <Spinner size="sm" />
      <Typography variant="small" color="muted">Loading data...</Typography>
    </div>

    {/* Centered spinner */}
    <div style={{ display: 'flex', justifyContent: 'center', padding: '1rem' }}>
      <Spinner size="lg" color="primary" />
    </div>

    {/* Inline spinner */}
    <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
      <Spinner size="xs" />
      <Typography variant="small" color="secondary">Fetching latest transactions...</Typography>
    </div>
  </div>
</div>

{/* ===== DIVIDER SECTION ===== */}
<div
  style={{
    marginBottom: '2.5rem',
    padding: '1.5rem',
    backgroundColor: 'var(--color-bg-surface)',
    borderRadius: 'var(--radius-lg)',
    border: '1px solid var(--color-border)',
    transition: 'background-color var(--duration-base) var(--easing-standard)',
  }}
>
  <Typography variant="h3" color="primary" weight="semibold" style={{ marginBottom: '0.5rem' }}>
    Dividers
  </Typography>
  <Typography variant="body" color="secondary" style={{ marginBottom: '1rem' }}>
    Visual separators for content sections
  </Typography>

  {/* Horizontal - Full */}
  <Typography variant="body" color="primary" weight="medium" style={{ marginBottom: '0.5rem' }}>
    Horizontal — Full Width
  </Typography>
  <div style={{ maxWidth: '500px', marginBottom: '1.5rem' }}>
    <Typography variant="body" color="secondary">Top content</Typography>
    <Divider />
    <Typography variant="body" color="secondary">Bottom content</Typography>
  </div>

  {/* Horizontal - Inset */}
  <Typography variant="body" color="primary" weight="medium" style={{ marginBottom: '0.5rem' }}>
    Horizontal — Inset (with padding)
  </Typography>
  <div style={{ maxWidth: '500px', marginBottom: '1.5rem' }}>
    <Typography variant="body" color="secondary">Top content</Typography>
    <Divider variant="inset" />
    <Typography variant="body" color="secondary">Bottom content</Typography>
  </div>

  {/* Horizontal - Middle with Label */}
  <Typography variant="body" color="primary" weight="medium" style={{ marginBottom: '0.5rem' }}>
    Horizontal — Middle with Label
  </Typography>
  <div style={{ maxWidth: '500px', marginBottom: '1.5rem' }}>
    <Typography variant="body" color="secondary">Top content</Typography>
    <Divider variant="middle" label="OR" />
    <Typography variant="body" color="secondary">Bottom content</Typography>
  </div>

  {/* Horizontal - Middle with Label (various positions) */}
  <Typography variant="body" color="primary" weight="medium" style={{ marginBottom: '0.5rem' }}>
    Horizontal — Label Positions
  </Typography>
  <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxWidth: '500px', marginBottom: '1.5rem' }}>
    <div>
      <Typography variant="small" color="muted">Left</Typography>
      <Divider variant="middle" label="OR" labelPosition="left" />
    </div>
    <div>
      <Typography variant="small" color="muted">Center (default)</Typography>
      <Divider variant="middle" label="OR" labelPosition="center" />
    </div>
    <div>
      <Typography variant="small" color="muted">Right</Typography>
      <Divider variant="middle" label="OR" labelPosition="right" />
    </div>
  </div>

  {/* Thickness */}
  <Typography variant="body" color="primary" weight="medium" style={{ marginBottom: '0.5rem' }}>
    Thickness
  </Typography>
  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', maxWidth: '500px', marginBottom: '1.5rem' }}>
    <div>
      <Typography variant="small" color="muted">Thickness: 1px (default)</Typography>
      <Divider thickness={1} />
    </div>
    <div>
      <Typography variant="small" color="muted">Thickness: 2px</Typography>
      <Divider thickness={2} />
    </div>
    <div>
      <Typography variant="small" color="muted">Thickness: 3px</Typography>
      <Divider thickness={3} />
    </div>
  </div>

  {/* Vertical Divider */}
  <Typography variant="body" color="primary" weight="medium" style={{ marginBottom: '0.5rem' }}>
    Vertical Divider
  </Typography>
  <div style={{ display: 'flex', alignItems: 'stretch', gap: '1rem', height: '100px', marginBottom: '1.5rem' }}>
    <div style={{ flex: 1, padding: '0.5rem', backgroundColor: 'var(--color-bg-elevated)', borderRadius: 'var(--radius-sm)' }}>
      <Typography variant="small" color="secondary">Left</Typography>
    </div>
    <Divider orientation="vertical" />
    <div style={{ flex: 1, padding: '0.5rem', backgroundColor: 'var(--color-bg-elevated)', borderRadius: 'var(--radius-sm)' }}>
      <Typography variant="small" color="secondary">Right</Typography>
    </div>
  </div>

  {/* Vertical with Inset */}
  <Typography variant="body" color="primary" weight="medium" style={{ marginBottom: '0.5rem' }}>
    Vertical — Inset
  </Typography>
  <div style={{ display: 'flex', alignItems: 'stretch', gap: '1rem', height: '100px', marginBottom: '1.5rem' }}>
    <div style={{ flex: 1, padding: '0.5rem', backgroundColor: 'var(--color-bg-elevated)', borderRadius: 'var(--radius-sm)' }}>
      <Typography variant="small" color="secondary">Left</Typography>
    </div>
    <Divider orientation="vertical" variant="inset" />
    <div style={{ flex: 1, padding: '0.5rem', backgroundColor: 'var(--color-bg-elevated)', borderRadius: 'var(--radius-sm)' }}>
      <Typography variant="small" color="secondary">Right</Typography>
    </div>
  </div>

  {/* Real World Example: Section separator */}
  <Typography variant="body" color="primary" weight="medium" style={{ marginBottom: '0.5rem' }}>
    Real World Example — Section Separator
  </Typography>
  <div
    style={{
      padding: '1rem',
      backgroundColor: 'var(--color-bg-elevated)',
      borderRadius: 'var(--radius-md)',
      border: '1px solid var(--color-border)',
    }}
  >
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <Typography variant="body" color="primary">Expenses</Typography>
        <Typography variant="body" color="secondary">$1,234</Typography>
      </div>
      <Divider />
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <Typography variant="body" color="primary">Settlements</Typography>
        <Typography variant="body" color="secondary">$567</Typography>
      </div>
      <Divider variant="inset" />
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <Typography variant="body" color="primary" weight="bold">Total</Typography>
        <Typography variant="body" color="primary" weight="bold">$1,801</Typography>
      </div>
      <Divider variant="middle" label="Today" />
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <Typography variant="body" color="secondary">Pending</Typography>
        <Typography variant="body" color="error">$89</Typography>
      </div>
    </div>
  </div>
</div>

{/* ===== SKELETON SECTION ===== */}
<div
  style={{
    marginBottom: '2.5rem',
    padding: '1.5rem',
    backgroundColor: 'var(--color-bg-surface)',
    borderRadius: 'var(--radius-lg)',
    border: '1px solid var(--color-border)',
    transition: 'background-color var(--duration-base) var(--easing-standard)',
  }}
>
  <Typography variant="h3" color="primary" weight="semibold" style={{ marginBottom: '0.5rem' }}>
    Skeletons
  </Typography>
  <Typography variant="body" color="secondary" style={{ marginBottom: '1rem' }}>
    Loading placeholders for improved perceived performance
  </Typography>

  {/* Variants */}
  <Typography variant="body" color="primary" weight="medium" style={{ marginBottom: '0.5rem' }}>
    Variants
  </Typography>
  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', alignItems: 'center', marginBottom: '1.5rem' }}>
    <Skeleton variant="text" width="200px" />
    <Skeleton variant="avatar" />
    <Skeleton variant="card" width="200px" />
    <Skeleton variant="custom" width="100px" height="40px" />
  </div>

  {/* Text Skeleton - Single */}
  <Typography variant="body" color="primary" weight="medium" style={{ marginBottom: '0.5rem' }}>
    Text Skeleton (Single)
  </Typography>
  <div style={{ maxWidth: '400px', marginBottom: '1.5rem' }}>
    <Skeleton variant="text" />
  </div>

  {/* Text Skeleton - Multiple */}
  <Typography variant="body" color="primary" weight="medium" style={{ marginBottom: '0.5rem' }}>
    Text Skeleton (Multiple with count)
  </Typography>
  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', maxWidth: '400px', marginBottom: '1.5rem' }}>
    <Skeleton variant="text" count={3} />
  </div>

  {/* User Card */}
  <Typography variant="body" color="primary" weight="medium" style={{ marginBottom: '0.5rem' }}>
    User Card
  </Typography>
  <div style={{ maxWidth: '400px', marginBottom: '1.5rem' }}>
    <Skeleton variant="user-card" />
  </div>

  {/* User Card - Multiple */}
  <Typography variant="body" color="primary" weight="medium" style={{ marginBottom: '0.5rem' }}>
    User Cards (Multiple)
  </Typography>
  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', maxWidth: '400px', marginBottom: '1.5rem' }}>
    <Skeleton variant="user-card" count={2} />
  </div>

  {/* Expense Card */}
  <Typography variant="body" color="primary" weight="medium" style={{ marginBottom: '0.5rem' }}>
    Expense Card
  </Typography>
  <div style={{ maxWidth: '500px', marginBottom: '1.5rem' }}>
    <Skeleton variant="expense-card" />
  </div>

  {/* Group Card */}
  <Typography variant="body" color="primary" weight="medium" style={{ marginBottom: '0.5rem' }}>
    Group Card
  </Typography>
  <div style={{ maxWidth: '400px', marginBottom: '1.5rem' }}>
    <Skeleton variant="group-card" />
  </div>

  {/* Custom Skeleton with inline styles */}
  <Typography variant="body" color="primary" weight="medium" style={{ marginBottom: '0.5rem' }}>
    Custom Skeleton (inline style)
  </Typography>
  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', alignItems: 'center', marginBottom: '1.5rem' }}>
    <Skeleton
      variant="custom"
      width="120px"
      height="60px"
      style={{ borderRadius: 'var(--radius-lg)' }}
    />
    <Skeleton
      variant="custom"
      width="80px"
      height="80px"
      style={{ borderRadius: 'var(--radius-full)' }}
    />
    <Skeleton
      variant="custom"
      width="200px"
      height="100px"
      style={{ borderRadius: 'var(--radius-sm)' }}
    />
  </div>

  {/* Real World Example: Loading Expense List */}
  <Typography variant="body" color="primary" weight="medium" style={{ marginBottom: '0.5rem' }}>
    Real World Example — Loading Expense List
  </Typography>
  <div
    style={{
      display: 'flex',
      flexDirection: 'column',
      gap: '0.75rem',
      padding: '1rem',
      backgroundColor: 'var(--color-bg-elevated)',
      borderRadius: 'var(--radius-md)',
      border: '1px solid var(--color-border)',
    }}
  >
    <Skeleton variant="expense-card" count={3} />
  </div>
</div>
{/* ===== RADIO SECTION ===== */}
<div
  style={{
    marginBottom: '2.5rem',
    padding: '1.5rem',
    backgroundColor: 'var(--color-bg-surface)',
    borderRadius: 'var(--radius-lg)',
    border: '1px solid var(--color-border)',
    transition: 'background-color var(--duration-base) var(--easing-standard)',
  }}
>
  <Typography variant="h3" color="primary" weight="semibold" style={{ marginBottom: '0.5rem' }}>
    Radios
  </Typography>
  <Typography variant="body" color="secondary" style={{ marginBottom: '1rem' }}>
    Radio buttons for exclusive selection
  </Typography>

  {/* Basic States */}
  <Typography variant="body" color="primary" weight="medium" style={{ marginBottom: '0.5rem' }}>
    States
  </Typography>
  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1.5rem', alignItems: 'center', marginBottom: '1.5rem' }}>
    <Radio label="Unselected" value="unselected" checked={false} />
    <Radio label="Selected" value="selected" checked />
    <Radio label="Disabled" value="disabled" disabled />
    <Radio label="Disabled Selected" value="disabled-selected" checked disabled />
    <Radio label="Error" value="error" error />
  </div>

  {/* Sizes */}
  <Typography variant="body" color="primary" weight="medium" style={{ marginBottom: '0.5rem' }}>
    Sizes
  </Typography>
  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1.5rem', alignItems: 'center', marginBottom: '1.5rem' }}>
    <Radio size="sm" label="Small" value="sm" checked />
    <Radio size="md" label="Medium" value="md" checked />
    <Radio size="lg" label="Large" value="lg" checked />
  </div>

  {/* Group: Payment Method */}
  <Typography variant="body" color="primary" weight="medium" style={{ marginBottom: '0.5rem' }}>
    Group – Payment Method
  </Typography>
  <div
    style={{
      display: 'flex',
      flexDirection: 'column',
      gap: '0.5rem',
      padding: '1rem',
      backgroundColor: 'var(--color-bg-elevated)',
      borderRadius: 'var(--radius-md)',
      border: '1px solid var(--color-border)',
      marginBottom: '1.5rem',
    }}
  >
    <Radio
      name="payment"
      label="💳 Credit Card"
      value="card"
      checked={selectedPayment === 'card'}
      onChange={setSelectedPayment}
    />
    <Radio
      name="payment"
      label="💰 Cash"
      value="cash"
      checked={selectedPayment === 'cash'}
      onChange={setSelectedPayment}
    />
    <Radio
      name="payment"
      label="🏦 Bank Transfer"
      value="bank"
      checked={selectedPayment === 'bank'}
      onChange={setSelectedPayment}
    />
    <div style={{ marginTop: '0.25rem' }}>
      <Typography variant="small" color="muted">
        Selected: {selectedPayment || 'None'}
      </Typography>
    </div>
  </div>

  {/* Group: Split Method */}
  <Typography variant="body" color="primary" weight="medium" style={{ marginBottom: '0.5rem' }}>
    Group – Split Method (with disabled option)
  </Typography>
  <div
    style={{
      display: 'flex',
      flexDirection: 'column',
      gap: '0.5rem',
      padding: '1rem',
      backgroundColor: 'var(--color-bg-elevated)',
      borderRadius: 'var(--radius-md)',
      border: '1px solid var(--color-border)',
    }}
  >
    <Radio
      name="split"
      label="Equal"
      value="equal"
      checked={selectedSplit === 'equal'}
      onChange={setSelectedSplit}
    />
    <Radio
      name="split"
      label="Percentage"
      value="percentage"
      checked={selectedSplit === 'percentage'}
      onChange={setSelectedSplit}
    />
    <Radio
      name="split"
      label="Custom Amount"
      value="custom"
      checked={selectedSplit === 'custom'}
      onChange={setSelectedSplit}
      disabled
    />
    <div style={{ marginTop: '0.25rem' }}>
      <Typography variant="small" color="muted">
        Selected: {selectedSplit || 'None'}
      </Typography>
    </div>
  </div>
</div>

{/* ===== SWITCH SECTION ===== */}
<div
  style={{
    marginBottom: '2.5rem',
    padding: '1.5rem',
    backgroundColor: 'var(--color-bg-surface)',
    borderRadius: 'var(--radius-lg)',
    border: '1px solid var(--color-border)',
    transition: 'background-color var(--duration-base) var(--easing-standard)',
  }}
>
  <Typography variant="h3" color="primary" weight="semibold" style={{ marginBottom: '0.5rem' }}>
    Switches
  </Typography>
  <Typography variant="body" color="secondary" style={{ marginBottom: '1rem' }}>
    Toggle switches for settings and preferences
  </Typography>

  {/* Basic States */}
  <Typography variant="body" color="primary" weight="medium" style={{ marginBottom: '0.5rem' }}>
    States
  </Typography>
  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1.5rem', alignItems: 'center', marginBottom: '1.5rem' }}>
    <Switch label="Off" checked={false} />
    <Switch label="On" checked />
    <Switch label="Disabled" disabled />
    <Switch label="Disabled On" checked disabled />
    <Switch label="Error" error />
  </div>

  {/* Controlled */}
  <Typography variant="body" color="primary" weight="medium" style={{ marginBottom: '0.5rem' }}>
    Controlled
  </Typography>
  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1.5rem', alignItems: 'center', marginBottom: '1.5rem' }}>
    <Switch
      label="Notifications"
      checked={switch1}
      onChange={setSwitch1}
    />
    <Switch
      label="Dark Mode"
      checked={switch2}
      onChange={setSwitch2}
    />
    <Switch
      label="Auto-save"
      checked={switch3}
      onChange={setSwitch3}
    />
    <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>
      {switch3 ? 'Enabled' : 'Disabled'}
    </div>
  </div>

  {/* Sizes */}
  <Typography variant="body" color="primary" weight="medium" style={{ marginBottom: '0.5rem' }}>
    Sizes
  </Typography>
  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1.5rem', alignItems: 'center', marginBottom: '1.5rem' }}>
    <Switch size="sm" label="Small" checked />
    <Switch size="md" label="Medium" checked />
    <Switch size="lg" label="Large" checked />
  </div>

  {/* Real World Settings */}
  <Typography variant="body" color="primary" weight="medium" style={{ marginBottom: '0.5rem' }}>
    Settings Example
  </Typography>
  <div
    style={{
      display: 'flex',
      flexDirection: 'column',
      gap: '0.75rem',
      padding: '1rem',
      backgroundColor: 'var(--color-bg-elevated)',
      borderRadius: 'var(--radius-md)',
      border: '1px solid var(--color-border)',
    }}
  >
    <Switch label="🔔 Push Notifications" checked onChange={() => {}} />
    <Switch label="📧 Email Reminders" checked onChange={() => {}} />
    <Switch label="📊 Spending Analytics" onChange={() => {}} />
    <Switch label="🔄 Recurring Expenses" checked onChange={() => {}} />
  </div>

  {/* With Badge */}
  <Typography variant="body" color="primary" weight="medium" style={{ marginTop: '1.5rem', marginBottom: '0.5rem' }}>
    With Badge
  </Typography>
  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1.5rem', alignItems: 'center' }}>
    <Switch
      label="Beta Features"
      checked={false}
      onChange={() => {}}
    />
    <Badge variant="warning" size="sm">Coming soon</Badge>
  </div>
</div>

      {/* ===== TYPOGRAPHY SECTION ===== */}
      <div
        style={{
          marginBottom: '2.5rem',
          padding: '1.5rem',
          backgroundColor: 'var(--color-bg-surface)',
          borderRadius: 'var(--radius-lg)',
          border: '1px solid var(--color-border)',
          transition: 'background-color var(--duration-base) var(--easing-standard)',
        }}
      >
        <Typography variant="h3" color="primary" weight="semibold" style={{ marginBottom: '0.5rem' }}>
          Typography
        </Typography>
        <Typography variant="body" color="secondary" style={{ marginBottom: '1rem' }}>
          All text styles using design tokens
        </Typography>

        <Typography variant="body" color="primary" weight="medium" style={{ marginBottom: '0.5rem' }}>
          Variants
        </Typography>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem', marginBottom: '1.5rem' }}>
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

        <Typography variant="body" color="primary" weight="medium" style={{ marginBottom: '0.5rem' }}>
          Colors
        </Typography>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem', marginBottom: '1.5rem' }}>
          <Typography color="primary">primary – Primary text</Typography>
          <Typography color="secondary">secondary – Secondary text</Typography>
          <Typography color="muted">muted – Muted text</Typography>
          <Typography color="success">success – Success text</Typography>
          <Typography color="warning">warning – Warning text</Typography>
          <Typography color="error">error – Error text</Typography>
          <Typography color="info">info – Info text</Typography>
          <Typography color="link">link – Link text</Typography>
        </div>

        <Typography variant="body" color="primary" weight="medium" style={{ marginBottom: '0.5rem' }}>
          Truncation
        </Typography>
        <div style={{ width: '200px', border: '1px solid var(--color-border)', padding: '0.5rem', marginBottom: '1.5rem' }}>
          <Typography truncate>
            This is a very long text that will be truncated with an ellipsis.
          </Typography>
        </div>

        <Typography variant="body" color="primary" weight="medium" style={{ marginBottom: '0.5rem' }}>
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
      </div>

      {/* ===== ICON SECTION ===== */}
      <div
        style={{
          marginBottom: '2.5rem',
          padding: '1.5rem',
          backgroundColor: 'var(--color-bg-surface)',
          borderRadius: 'var(--radius-lg)',
          border: '1px solid var(--color-border)',
          transition: 'background-color var(--duration-base) var(--easing-standard)',
        }}
      >
        <Typography variant="h3" color="primary" weight="semibold" style={{ marginBottom: '0.5rem' }}>
          Icons
        </Typography>
        <Typography variant="body" color="secondary" style={{ marginBottom: '1rem' }}>
          Consistent icon system with design tokens
        </Typography>

        <Typography variant="body" color="primary" weight="medium" style={{ marginBottom: '0.5rem' }}>
          Sizes
        </Typography>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', alignItems: 'center', marginBottom: '1.5rem' }}>
          <Icon size="xs"><FaHome /></Icon>
          <Icon size="sm"><FaHome /></Icon>
          <Icon size="md"><FaHome /></Icon>
          <Icon size="lg"><FaHome /></Icon>
          <Icon size="xl"><FaHome /></Icon>
        </div>

        <Typography variant="body" color="primary" weight="medium" style={{ marginBottom: '0.5rem' }}>
          Colors
        </Typography>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', alignItems: 'center', marginBottom: '1.5rem' }}>
          <Icon color="default"><FaUser /></Icon>
          <Icon color="muted"><FaUser /></Icon>
          <Icon color="interactive"><FaUser /></Icon>
          <Icon color="primary"><FaUser /></Icon>
          <Icon color="success"><FaCheck /></Icon>
          <Icon color="warning"><FaExclamationTriangle /></Icon>
          <Icon color="error"><FaTimes /></Icon>
          <Icon color="info"><FaInfo /></Icon>
          <Icon color="link"><FaEnvelope /></Icon>
        </div>

        <Typography variant="body" color="primary" weight="medium" style={{ marginBottom: '0.5rem' }}>
          Custom Color
        </Typography>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', alignItems: 'center', marginBottom: '1.5rem' }}>
          <Icon color="#ff6b6b" size="lg"><FaPlus /></Icon>
          <Icon color="#4ecdc4" size="lg"><FaCheck /></Icon>
          <Icon color="#ffd93d" size="lg"><FaBell /></Icon>
          <Icon color="#6c5ce7" size="lg"><FaSearch /></Icon>
        </div>

        <Typography variant="body" color="primary" weight="medium" style={{ marginBottom: '0.5rem' }}>
          Accessibility
        </Typography>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', alignItems: 'center' }}>
          <Icon decorative size="lg"><FaHome /></Icon>
          <span style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>decorative</span>
          <Icon label="Dashboard" size="lg"><FaHome /></Icon>
          <span style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>labeled</span>
        </div>
      </div>

      {/* ===== INPUT SECTION ===== */}
      <div
        style={{
          marginBottom: '2.5rem',
          padding: '1.5rem',
          backgroundColor: 'var(--color-bg-surface)',
          borderRadius: 'var(--radius-lg)',
          border: '1px solid var(--color-border)',
          transition: 'background-color var(--duration-base) var(--easing-standard)',
        }}
      >
        <Typography variant="h3" color="primary" weight="semibold" style={{ marginBottom: '0.5rem' }}>
          Inputs
        </Typography>
        <Typography variant="body" color="secondary" style={{ marginBottom: '1rem' }}>
          Form input with variants, sizes, and states
        </Typography>

        <Typography variant="body" color="primary" weight="medium" style={{ marginBottom: '0.5rem' }}>
          Sizes
        </Typography>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1.5rem', maxWidth: '400px' }}>
          <Input inputSize="sm" placeholder="Small input" />
          <Input inputSize="md" placeholder="Medium input" />
          <Input inputSize="lg" placeholder="Large input" />
        </div>

        <Typography variant="body" color="primary" weight="medium" style={{ marginBottom: '0.5rem' }}>
          States
        </Typography>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1.5rem', maxWidth: '400px' }}>
          <Input placeholder="Default input" />
          <Input placeholder="Error state" error />
          <Input placeholder="Success state" success />
          <Input placeholder="Disabled input" disabled />
        </div>

        <Typography variant="body" color="primary" weight="medium" style={{ marginBottom: '0.5rem' }}>
          With Adornments
        </Typography>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1.5rem', maxWidth: '400px' }}>
          <Input
            leftAdornment={<Icon size="sm"><FaSearch /></Icon>}
            placeholder="Search..."
          />
          <Input
            leftAdornment={<span style={{ fontWeight: 600, color: 'var(--color-text-secondary)' }}>$</span>}
            placeholder="0.00"
            inputSize="lg"
          />
          <Input
            rightAdornment={<Icon size="sm" color="muted"><FaEnvelope /></Icon>}
            placeholder="Email address"
          />
          <Input
            leftAdornment={<Icon size="sm" color="muted"><FaUser /></Icon>}
            rightAdornment={<Icon size="sm" color="success"><FaCheck /></Icon>}
            placeholder="Username"
            success
          />
        </div>

        <Typography variant="body" color="primary" weight="medium" style={{ marginBottom: '0.5rem' }}>
          Full Width
        </Typography>
        <div style={{ maxWidth: '400px', marginBottom: '1.5rem' }}>
          <Input fullWidth placeholder="Full width input" />
        </div>
      </div>

      {/* ===== AVATAR SECTION ===== */}
      <div
        style={{
          marginBottom: '2.5rem',
          padding: '1.5rem',
          backgroundColor: 'var(--color-bg-surface)',
          borderRadius: 'var(--radius-lg)',
          border: '1px solid var(--color-border)',
          transition: 'background-color var(--duration-base) var(--easing-standard)',
        }}
      >
        <Typography variant="h3" color="primary" weight="semibold" style={{ marginBottom: '0.5rem' }}>
          Avatars
        </Typography>
        <Typography variant="body" color="secondary" style={{ marginBottom: '1rem' }}>
          User avatars with sizes, status indicators, badges, and grouped stacks
        </Typography>

        <Typography variant="body" color="primary" weight="medium" style={{ marginBottom: '0.5rem' }}>
          Sizes
        </Typography>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', alignItems: 'center', marginBottom: '1.5rem' }}>
          <Avatar size="xs" name="Alice" />
          <Avatar size="sm" name="Bob" />
          <Avatar size="md" name="Charlie" />
          <Avatar size="lg" name="Diana" />
          <Avatar size="xl" name="Eve" />
        </div>

        <Typography variant="body" color="primary" weight="medium" style={{ marginBottom: '0.5rem' }}>
          Status Indicators
        </Typography>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', alignItems: 'center', marginBottom: '1.5rem' }}>
          <Avatar size="lg" name="Online" status="online" />
          <Avatar size="lg" name="Offline" status="offline" />
          <Avatar size="lg" name="Away" status="away" />
          <Avatar size="lg" name="Busy" status="busy" />
        </div>

        <Typography variant="body" color="primary" weight="medium" style={{ marginBottom: '0.5rem' }}>
          Badges
        </Typography>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', alignItems: 'center', marginBottom: '1.5rem' }}>
          <Avatar size="lg" name="Notifications" badge={3} status="online" />
          <Avatar size="lg" name="Messages" badge="!" status="busy" />
          <Avatar size="lg" name="Updates" badge="●" status="away" />
        </div>

        <Typography variant="body" color="primary" weight="medium" style={{ marginBottom: '0.5rem' }}>
          Ring / Focus
        </Typography>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', alignItems: 'center', marginBottom: '1.5rem' }}>
          <Avatar size="lg" name="Active" ring status="online" />
          <Avatar size="lg" name="Selected" ring src="https://i.pravatar.cc/150?img=1" alt="Jane" />
        </div>

        <Typography variant="body" color="primary" weight="medium" style={{ marginBottom: '0.5rem' }}>
          Avatar Group
        </Typography>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', marginBottom: '1.5rem' }}>
          <div>
            <Typography variant="small" color="secondary" style={{ marginBottom: '0.5rem' }}>
              Default Stack
            </Typography>
            <AvatarGroup>
              <Avatar size="md" src="https://i.pravatar.cc/150?img=1" alt="Jane" status="online" />
              <Avatar size="md" src="https://i.pravatar.cc/150?img=2" alt="John" status="busy" />
              <Avatar size="md" src="https://i.pravatar.cc/150?img=3" alt="Emily" status="away" />
              <Avatar size="md" name="Alex" status="online" />
              <Avatar size="md" name="Sarah" />
            </AvatarGroup>
          </div>

          <div>
            <Typography variant="small" color="secondary" style={{ marginBottom: '0.5rem' }}>
              With Max
            </Typography>
            <AvatarGroup max={3}>
              <Avatar size="md" src="https://i.pravatar.cc/150?img=1" alt="Jane" />
              <Avatar size="md" src="https://i.pravatar.cc/150?img=2" alt="John" />
              <Avatar size="md" src="https://i.pravatar.cc/150?img=3" alt="Emily" />
              <Avatar size="md" name="Alex" />
              <Avatar size="md" name="Sarah" />
              <Avatar size="md" name="Mike" />
            </AvatarGroup>
          </div>

          <div>
            <Typography variant="small" color="secondary" style={{ marginBottom: '0.5rem' }}>
              Compact
            </Typography>
            <AvatarGroup compact max={4}>
              <Avatar size="md" src="https://i.pravatar.cc/150?img=1" alt="Jane" />
              <Avatar size="md" src="https://i.pravatar.cc/150?img=2" alt="John" />
              <Avatar size="md" src="https://i.pravatar.cc/150?img=3" alt="Emily" />
              <Avatar size="md" name="Alex" />
              <Avatar size="md" name="Sarah" />
            </AvatarGroup>
          </div>
        </div>
      </div>

      {/* ===== BADGE SECTION ===== */}
      <div
        style={{
          marginBottom: '2.5rem',
          padding: '1.5rem',
          backgroundColor: 'var(--color-bg-surface)',
          borderRadius: 'var(--radius-lg)',
          border: '1px solid var(--color-border)',
          transition: 'background-color var(--duration-base) var(--easing-standard)',
        }}
      >
        <Typography variant="h3" color="primary" weight="semibold" style={{ marginBottom: '0.5rem' }}>
          Badges
        </Typography>
        <Typography variant="body" color="secondary" style={{ marginBottom: '1rem' }}>
          Status labels, tags, and indicators with variants and sizes
        </Typography>

        <Typography variant="body" color="primary" weight="medium" style={{ marginBottom: '0.5rem' }}>
          Variants
        </Typography>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem', alignItems: 'center', marginBottom: '1.5rem' }}>
          <Badge variant="default">Default</Badge>
          <Badge variant="primary">Primary</Badge>
          <Badge variant="secondary">Secondary</Badge>
          <Badge variant="success">Success</Badge>
          <Badge variant="warning">Warning</Badge>
          <Badge variant="error">Error</Badge>
          <Badge variant="info">Info</Badge>
        </div>

        <Typography variant="body" color="primary" weight="medium" style={{ marginBottom: '0.5rem' }}>
          Sizes
        </Typography>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem', alignItems: 'center', marginBottom: '1.5rem' }}>
          <Badge size="sm" variant="primary">Small</Badge>
          <Badge size="md" variant="primary">Medium</Badge>
          <Badge size="lg" variant="primary">Large</Badge>
        </div>

        <Typography variant="body" color="primary" weight="medium" style={{ marginBottom: '0.5rem' }}>
          With Icons
        </Typography>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem', alignItems: 'center', marginBottom: '1.5rem' }}>
          <Badge variant="success" icon={<span>✓</span>}>Completed</Badge>
          <Badge variant="warning" icon={<span>⚠</span>}>Pending</Badge>
          <Badge variant="error" icon={<span>✕</span>}>Failed</Badge>
          <Badge variant="info" icon={<span>ℹ</span>}>Info</Badge>
        </div>

        <Typography variant="body" color="primary" weight="medium" style={{ marginBottom: '0.5rem' }}>
          Dot Indicators
        </Typography>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem', alignItems: 'center', marginBottom: '1.5rem' }}>
          <Badge dot variant="success" />
          <Badge dot variant="warning" />
          <Badge dot variant="error" />
          <Badge dot variant="info" />
          <Badge dot variant="primary" />
          <Badge dot variant="default" />
          <span style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>with text</span>
          <Badge variant="success" dot style={{ marginLeft: '0.5rem' }} />
          <span style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>Online</span>
        </div>

        <Typography variant="body" color="primary" weight="medium" style={{ marginBottom: '0.5rem' }}>
          Real World Examples
        </Typography>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', alignItems: 'center' }}>
          <Badge variant="success">Paid</Badge>
          <Badge variant="warning">Pending</Badge>
          <Badge variant="error">Overdue</Badge>
          <Badge variant="info">Processing</Badge>

          <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
            <span style={{ fontSize: '0.9rem', color: 'var(--color-text-secondary)' }}>Notifications</span>
            <Badge variant="error" size="sm">3</Badge>
          </div>

          <Badge variant="secondary" size="sm" icon={<span>🏷️</span>}>Food</Badge>
          <Badge variant="secondary" size="sm" icon={<span>🚗</span>}>Transport</Badge>
          <Badge variant="secondary" size="sm" icon={<span>🏠</span>}>Rent</Badge>
        </div>
      </div>

      {/* ===== CHECKBOX SECTION ===== */}
      <div
        style={{
          marginBottom: '2.5rem',
          padding: '1.5rem',
          backgroundColor: 'var(--color-bg-surface)',
          borderRadius: 'var(--radius-lg)',
          border: '1px solid var(--color-border)',
          transition: 'background-color var(--duration-base) var(--easing-standard)',
        }}
      >
        <Typography variant="h3" color="primary" weight="semibold" style={{ marginBottom: '0.5rem' }}>
          Checkboxes
        </Typography>
        <Typography variant="body" color="secondary" style={{ marginBottom: '1rem' }}>
          Form checkboxes with states, sizes, labels, and groups
        </Typography>

        {/* Basic States */}
        <Typography variant="body" color="primary" weight="medium" style={{ marginBottom: '0.5rem' }}>
          States
        </Typography>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1.5rem', alignItems: 'center', marginBottom: '1.5rem' }}>
          <Checkbox label="Unchecked" checked={false} />
          <Checkbox label="Checked" checked />
          <Checkbox label="Indeterminate" indeterminate />
          <Checkbox label="Disabled" disabled />
          <Checkbox label="Disabled Checked" checked disabled />
          <Checkbox label="Error" error />
        </div>

        {/* Controlled */}
        <Typography variant="body" color="primary" weight="medium" style={{ marginBottom: '0.5rem' }}>
          Controlled
        </Typography>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1.5rem', alignItems: 'center', marginBottom: '1.5rem' }}>
          <Checkbox
            label="Click me"
            checked={checked1}
            onChange={setChecked1}
          />
          <Checkbox
            label="Indeterminate toggle"
            checked={checked2}
            onChange={setChecked2}
            indeterminate={indeterminate}
          />
          <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>Set indeterminate:</span>
            <button
              onClick={() => setIndeterminate(!indeterminate)}
              style={{
                padding: '4px 12px',
                border: '1px solid var(--color-border)',
                borderRadius: 'var(--radius-sm)',
                backgroundColor: 'var(--color-bg-elevated)',
                color: 'var(--color-text-primary)',
                cursor: 'pointer',
                fontSize: '0.8rem',
                transition: 'all var(--duration-fast) var(--easing-standard)',
              }}
            >
              Toggle
            </button>
          </div>
        </div>

        {/* Sizes */}
        <Typography variant="body" color="primary" weight="medium" style={{ marginBottom: '0.5rem' }}>
          Sizes
        </Typography>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1.5rem', alignItems: 'center', marginBottom: '1.5rem' }}>
          <Checkbox size="sm" label="Small" checked />
          <Checkbox size="md" label="Medium" checked />
          <Checkbox size="lg" label="Large" checked />
        </div>

        {/* Groups */}
        <Typography variant="body" color="primary" weight="medium" style={{ marginBottom: '0.5rem' }}>
          Groups (Expense Categories)
        </Typography>
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '0.5rem',
            padding: '1rem',
            backgroundColor: 'var(--color-bg-elevated)',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--color-border)',
          }}
        >
          <Checkbox
            label="🏷️ Food & Dining"
            checked={selectedCategories.food}
            onChange={(checked) => updateCategory('food', checked)}
          />
          <Checkbox
            label="🚗 Transportation"
            checked={selectedCategories.transport}
            onChange={(checked) => updateCategory('transport', checked)}
          />
          <Checkbox
            label="🏠 Rent & Utilities"
            checked={selectedCategories.rent}
            onChange={(checked) => updateCategory('rent', checked)}
          />
          <Checkbox
            label="🛒 Shopping"
            checked={selectedCategories.shopping}
            onChange={(checked) => updateCategory('shopping', checked)}
          />
          <Checkbox
            label="🎮 Entertainment"
            checked={selectedCategories.entertainment}
            onChange={(checked) => updateCategory('entertainment', checked)}
          />
          <div style={{ marginTop: '0.5rem', borderTop: '1px solid var(--color-divider)', paddingTop: '0.5rem' }}>
            <Checkbox
              label="Select All"
              checked={allChecked}
              onChange={toggleAllCategories}
              indeterminate={someChecked && !allChecked}
            />
          </div>
          <div style={{ marginTop: '0.25rem' }}>
            <Typography variant="small" color="muted">
              {Object.values(selectedCategories).filter(Boolean).length} of 5 selected
            </Typography>
          </div>
        </div>
      </div>

      {/* ===== BUTTON SECTION ===== */}
      <div
        style={{
          marginBottom: '2.5rem',
          padding: '1.5rem',
          backgroundColor: 'var(--color-bg-surface)',
          borderRadius: 'var(--radius-lg)',
          border: '1px solid var(--color-border)',
          transition: 'background-color var(--duration-base) var(--easing-standard)',
        }}
      >
        <Typography variant="h3" color="primary" weight="semibold" style={{ marginBottom: '0.5rem' }}>
          Buttons
        </Typography>
        <Typography variant="body" color="secondary" style={{ marginBottom: '1rem' }}>
          All button variants with icons, loading, and states
        </Typography>

        <Typography variant="body" color="primary" weight="medium" style={{ marginBottom: '0.5rem' }}>
          Variants
        </Typography>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.5rem' }}>
          <Button variant="primary">Primary</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="outline">Outline</Button>
          <Button variant="ghost">Ghost</Button>
          <Button variant="danger">Danger</Button>
          <Button variant="success">Success</Button>
          <Button variant="link">Link</Button>
        </div>

        <Typography variant="body" color="primary" weight="medium" style={{ marginBottom: '0.5rem' }}>
          Sizes
        </Typography>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', alignItems: 'center', marginBottom: '1.5rem' }}>
          <Button size="sm" variant="primary">Small</Button>
          <Button size="md" variant="primary">Medium</Button>
          <Button size="lg" variant="primary">Large</Button>
        </div>

        <Typography variant="body" color="primary" weight="medium" style={{ marginBottom: '0.5rem' }}>
          With Icons
        </Typography>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.5rem' }}>
          <Button leftIcon={<FaPlus />} variant="primary">Add Expense</Button>
          <Button leftIcon={<FaEdit />} variant="secondary">Edit Profile</Button>
          <Button leftIcon={<FaCheck />} variant="success">Confirm</Button>
          <Button leftIcon={<FaTrash />} variant="danger">Delete</Button>
          <Button rightIcon={<FaArrowRight />} variant="outline">Next Step</Button>
        </div>

        <Typography variant="body" color="primary" weight="medium" style={{ marginBottom: '0.5rem' }}>
          Icon Only
        </Typography>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', alignItems: 'center', marginBottom: '1.5rem' }}>
          <Button iconOnly variant="primary" aria-label="Add">
            <FaPlus />
          </Button>
          <Button iconOnly variant="secondary" aria-label="Settings">
            <FaCog />
          </Button>
          <Button iconOnly variant="outline" aria-label="Edit">
            <FaEdit />
          </Button>
          <Button iconOnly variant="danger" aria-label="Delete">
            <FaTrash />
          </Button>
          <Button iconOnly variant="success" aria-label="Confirm">
            <FaCheck />
          </Button>
          <Button iconOnly variant="ghost" aria-label="Close">
            <FaTimes />
          </Button>
        </div>

        <Typography variant="body" color="primary" weight="medium" style={{ marginBottom: '0.5rem' }}>
          Loading States
        </Typography>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.5rem' }}>
          <Button
            loading={loadingState['save']}
            onClick={() => handleLoadingClick('save')}
            variant="primary"
            leftIcon={<FaPlus />}
          >
            Save Changes
          </Button>
          <Button
            loading={loadingState['submit']}
            onClick={() => handleLoadingClick('submit')}
            variant="success"
            leftIcon={<FaCheck />}
          >
            Submit
          </Button>
          <Button
            loading={loadingState['delete']}
            onClick={() => handleLoadingClick('delete')}
            variant="danger"
            leftIcon={<FaTrash />}
          >
            Delete Item
          </Button>
          <Button
            loading={loadingState['loading']}
            onClick={() => handleLoadingClick('loading')}
            variant="outline"
          >
            Load Data
          </Button>
        </div>

        <Typography variant="body" color="primary" weight="medium" style={{ marginBottom: '0.5rem' }}>
          Disabled States
        </Typography>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.5rem' }}>
          <Button disabled variant="primary">Primary</Button>
          <Button disabled variant="secondary">Secondary</Button>
          <Button disabled variant="outline">Outline</Button>
          <Button disabled variant="ghost">Ghost</Button>
          <Button disabled variant="danger">Danger</Button>
          <Button disabled variant="success">Success</Button>
          <Button disabled variant="link">Link</Button>
        </div>

        <Typography variant="body" color="primary" weight="medium" style={{ marginBottom: '0.5rem' }}>
          Full Width
        </Typography>
        <div style={{ maxWidth: '500px', marginBottom: '1.5rem' }}>
          <Button fullWidth variant="primary" leftIcon={<FaPlus />}>
            Create New Group
          </Button>
          <div style={{ height: '0.5rem' }} />
          <Button fullWidth variant="outline">
            Cancel
          </Button>
        </div>

        <Typography variant="body" color="primary" weight="medium" style={{ marginBottom: '0.5rem' }}>
          Real World Examples
        </Typography>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: '0.75rem',
              padding: '1rem',
              backgroundColor: 'var(--color-bg-elevated)',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--color-border)',
            }}
          >
            <Button variant="primary" leftIcon={<FaPlus />} size="sm">
              Add Expense
            </Button>
            <Button variant="outline" leftIcon={<FaEdit />} size="sm">
              Edit
            </Button>
            <Button variant="ghost" size="sm">
              View Details
            </Button>
            <div style={{ marginLeft: 'auto' }}>
              <Button variant="danger" leftIcon={<FaTrash />} size="sm">
                Delete
              </Button>
            </div>
          </div>

          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: '0.75rem',
              padding: '1rem',
              backgroundColor: 'var(--color-bg-elevated)',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--color-border)',
            }}
          >
            <Button variant="success" leftIcon={<FaCheck />}>
              Save Changes
            </Button>
            <Button variant="outline">Cancel</Button>
            <Button variant="ghost">Reset</Button>
          </div>
        </div>
      </div>

      {/* ===== FOOTER ===== */}
      <div
        style={{
          marginTop: '3rem',
          paddingTop: '1.5rem',
          borderTop: '1px solid var(--color-border)',
          textAlign: 'center',
        }}
      >
        <Typography variant="small" color="muted">
          TrueSplit Component Library • Built with ❤️ using Atomic Design
        </Typography>
      </div>
    </main>
  );
}