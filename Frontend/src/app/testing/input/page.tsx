'use client';

import React, { useState } from 'react';
import { Input } from '@/shared/_components/atoms/Input';
import { Typography } from '@/shared/_components/atoms/Typography';
import { Button } from '@/shared/_components/atoms/Button';
import { ThemeSwitcher } from '@/shared/_components/molecules/ThemeSwitcher';
import { Icon } from '@/shared/_components/atoms/Icon';
import { FaUser, FaEnvelope, FaLock, FaSearch, FaDollarSign, FaCalendarAlt } from 'react-icons/fa';

/**
 * Testing page for the Input component.
 * Demonstrates all real‑world usage scenarios in TrueSplit.
 */
export default function InputTestPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  // Handle form submit simulation
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !password) {
      setErrorMessage('Please fill in all required fields.');
      return;
    }
    setErrorMessage('');
    alert('Form submitted successfully!');
  };

  return (
    <div style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <Typography variant="h1">Input Component – Real‑World Test</Typography>
        <ThemeSwitcher variant="both" />
      </div>

      <hr style={{ margin: '2rem 0' }} />

      {/* 1. All Sizes */}
      <section>
        <Typography variant="h2" color="secondary" style={{ marginBottom: '1rem' }}>1. Sizes</Typography>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', alignItems: 'center' }}>
          <div style={{ width: '200px' }}>
            <Input inputSize="sm" placeholder="Small" />
          </div>
          <div style={{ width: '200px' }}>
            <Input inputSize="md" placeholder="Medium (default)" />
          </div>
          <div style={{ width: '200px' }}>
            <Input inputSize="lg" placeholder="Large" />
          </div>
        </div>
        <Typography variant="small" color="muted">Sizes: sm, md, lg</Typography>
      </section>

      <hr style={{ margin: '2rem 0' }} />

      {/* 2. States */}
      <section>
        <Typography variant="h2" color="secondary" style={{ marginBottom: '1rem' }}>2. States</Typography>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', alignItems: 'center' }}>
          <div style={{ width: '200px' }}>
            <Input placeholder="Default" />
          </div>
          <div style={{ width: '200px' }}>
            <Input placeholder="Error" error />
          </div>
          <div style={{ width: '200px' }}>
            <Input placeholder="Success" success />
          </div>
          <div style={{ width: '200px' }}>
            <Input placeholder="Disabled" disabled value="Disabled" />
          </div>
          <div style={{ width: '200px' }}>
            <Input placeholder="Required" required />
          </div>
        </div>
        <Typography variant="small" color="muted">Error, success, disabled, required.</Typography>
      </section>

      <hr style={{ margin: '2rem 0' }} />

      {/* 3. Adornments */}
      <section>
        <Typography variant="h2" color="secondary" style={{ marginBottom: '1rem' }}>3. Adornments</Typography>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', alignItems: 'center' }}>
          <div style={{ width: '220px' }}>
            <Input
              leftAdornment={<Icon size="sm" color="muted" decorative><FaUser /></Icon>}
              placeholder="Username"
            />
          </div>
          <div style={{ width: '220px' }}>
            <Input
              leftAdornment={<Icon size="sm" color="muted" decorative><FaEnvelope /></Icon>}
              placeholder="Email"
            />
          </div>
          <div style={{ width: '220px' }}>
            <Input
              leftAdornment={<Icon size="sm" color="muted" decorative><FaLock /></Icon>}
              type="password"
              placeholder="Password"
            />
          </div>
          <div style={{ width: '220px' }}>
            <Input
              leftAdornment={<Icon size="sm" color="muted" decorative><FaDollarSign /></Icon>}
              placeholder="0.00"
              inputMode="decimal"
            />
          </div>
        </div>
        <Typography variant="small" color="muted">Left adornments (icons) for common fields.</Typography>
      </section>

      <hr style={{ margin: '2rem 0' }} />

      {/* 4. Right Adornments + Clearable */}
      <section>
        <Typography variant="h2" color="secondary" style={{ marginBottom: '1rem' }}>4. Right Adornments & Clearable</Typography>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', alignItems: 'center' }}>
          <div style={{ width: '220px' }}>
            <Input
              placeholder="Search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              clearable
              rightAdornment={<Icon size="sm" color="muted" decorative><FaSearch /></Icon>}
            />
          </div>
          <div style={{ width: '220px' }}>
            <Input
              placeholder="Amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              leftAdornment={<Icon size="sm" color="muted" decorative><FaDollarSign /></Icon>}
              rightAdornment={<span style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>USD</span>}
              inputMode="decimal"
            />
          </div>
          <div style={{ width: '220px' }}>
            <Input
              placeholder="Date"
              rightAdornment={<Icon size="sm" color="muted" decorative><FaCalendarAlt /></Icon>}
              readOnly
              value="2024-01-15"
            />
          </div>
        </div>
        <Typography variant="small" color="muted">Right adornments, clearable, and read‑only.</Typography>
      </section>

      <hr style={{ margin: '2rem 0' }} />

      {/* 5. Character Count */}
      <section>
        <Typography variant="h2" color="secondary" style={{ marginBottom: '1rem' }}>5. Character Count</Typography>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', alignItems: 'center' }}>
          <div style={{ width: '300px' }}>
            <Input
              placeholder="Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              maxLength={50}
              showCount
            />
          </div>
          <div style={{ width: '300px' }}>
            <Input
              placeholder="Comments"
              value="This is a long comment that exceeds the limit"
              maxLength={20}
              showCount
              error
            />
          </div>
        </div>
        <Typography variant="small" color="muted">Shows character count when `maxLength` and `showCount` are set.</Typography>
      </section>

      <hr style={{ margin: '2rem 0' }} />

      {/* 6. Error with errorMessageId */}
      <section>
        <Typography variant="h2" color="secondary" style={{ marginBottom: '1rem' }}>6. Error with Message</Typography>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', maxWidth: '400px' }}>
          <Input
            placeholder="Email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            error={!!email && !email.includes('@')}
            errorMessageId="email-error"
            required
            ariaLabel="Email"
          />
          {email && !email.includes('@') && (
            <Typography id="email-error" variant="small" color="error">
              Please enter a valid email address.
            </Typography>
          )}
          <Typography variant="small" color="muted">Error state linked with error message via `errorMessageId`.</Typography>
        </div>
      </section>

      <hr style={{ margin: '2rem 0' }} />

      {/* 7. Full Width */}
      <section>
        <Typography variant="h2" color="secondary" style={{ marginBottom: '1rem' }}>7. Full Width</Typography>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', maxWidth: '500px' }}>
          <Input fullWidth placeholder="Full width input" />
          <Input fullWidth placeholder="Full width with left icon" leftAdornment={<Icon size="sm" color="muted" decorative><FaUser /></Icon>} />
          <Input fullWidth placeholder="Full width with clear" clearable />
        </div>
      </section>

      <hr style={{ margin: '2rem 0' }} />

      {/* 8. Real‑world: Login Form */}
      <section>
        <Typography variant="h2" color="secondary" style={{ marginBottom: '1rem' }}>8. Login Form</Typography>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxWidth: '400px' }}>
          <Input
            leftAdornment={<Icon size="sm" color="muted" decorative><FaUser /></Icon>}
            placeholder="Username or Email"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            ariaLabel="Username"
          />
          <Input
            leftAdornment={<Icon size="sm" color="muted" decorative><FaLock /></Icon>}
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            ariaLabel="Password"
          />
          {errorMessage && (
            <Typography variant="small" color="error" role="alert">
              {errorMessage}
            </Typography>
          )}
          <Button type="submit" variant="primary" fullWidth>
            Sign In
          </Button>
        </form>
        <Typography variant="small" color="muted">Required fields with validation.</Typography>
      </section>

      <hr style={{ margin: '2rem 0' }} />

      {/* 9. Real‑world: Expense Form */}
      <section>
        <Typography variant="h2" color="secondary" style={{ marginBottom: '1rem' }}>9. Expense Form</Typography>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxWidth: '500px' }}>
          <Input
            leftAdornment={<Icon size="sm" color="muted" decorative><FaDollarSign /></Icon>}
            placeholder="Amount"
            inputMode="decimal"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            required
            clearable
          />
          <Input
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            maxLength={100}
            showCount
            required
          />
          <Input
            leftAdornment={<Icon size="sm" color="muted" decorative><FaCalendarAlt /></Icon>}
            placeholder="Date"
            type="date"
            defaultValue="2024-01-15"
          />
          <Button variant="success" fullWidth>
            Add Expense
          </Button>
        </div>
        <Typography variant="small" color="muted">Amount, description with char count, and date.</Typography>
      </section>

      <hr style={{ margin: '2rem 0' }} />

      {/* 10. Search Input */}
      <section>
        <Typography variant="h2" color="secondary" style={{ marginBottom: '1rem' }}>10. Search Input</Typography>
        <div style={{ maxWidth: '400px' }}>
          <Input
            leftAdornment={<Icon size="sm" color="muted" decorative><FaSearch /></Icon>}
            placeholder="Search expenses..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            clearable
            fullWidth
            ariaLabel="Search expenses"
          />
          {/* <Typography variant="small" color="muted">Searching for: "{searchQuery || '...'}"</Typography> */}
        </div>
      </section>

      <footer style={{ marginTop: '3rem', padding: '1rem', borderTop: '1px solid var(--color-divider)', color: 'var(--color-text-muted)' }}>
        <Typography variant="small" color="muted">
          Input component test page – all sizes, states, adornments, and real‑world use cases.
        </Typography>
      </footer>
    </div>
  );
}