// F:\PERSONAL\TrueSplit\frontend\src\app\testing\checkbox\page.tsx

'use client';

import React, { useState } from 'react';
import { Checkbox } from '@/shared/_components/atoms/Checkbox';
import { ThemeSwitcher } from '@/shared/_components/molecules/ThemeSwitcher';
import { Button } from '@/shared/_components/atoms/Button';
import { Divider } from '@/shared/_components/atoms/Divider';
import { Badge } from '@/shared/_components/atoms/Badge';

/**
 * Testing page for the Checkbox component.
 * Demonstrates all real‑world usage scenarios in TrueSplit.
 */
export default function CheckboxTestPage() {
  // State for various real-world examples
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [promotionalEmails, setPromotionalEmails] = useState(false);
  const [selectedExpenses, setSelectedExpenses] = useState<string[]>([]);
  const [splitEqually, setSplitEqually] = useState(true);
  const [splitPercent, setSplitPercent] = useState(false);
  const [splitCustom, setSplitCustom] = useState(false);
  const [privacyConsent, setPrivacyConsent] = useState(false);
  const [newsletterSignup, setNewsletterSignup] = useState(false);
  const [bulkSelectAll, setBulkSelectAll] = useState(false);
  const [filterCategories, setFilterCategories] = useState<string[]>([]);
  const [filterStatus, setFilterStatus] = useState<string[]>([]);

  // Sample expense data for bulk selection
  const expenses = [
    { id: 'exp1', description: 'Dinner at Italian place', amount: 45.50, date: '2024-01-15' },
    { id: 'exp2', description: 'Groceries - Weekly', amount: 120.00, date: '2024-01-14' },
    { id: 'exp3', description: 'Movie tickets', amount: 30.00, date: '2024-01-13' },
    { id: 'exp4', description: 'Uber ride', amount: 15.75, date: '2024-01-12' },
    { id: 'exp5', description: 'Coffee shop', amount: 8.50, date: '2024-01-11' },
  ];

  // Toggle expense selection
  const toggleExpense = (id: string) => {
    setSelectedExpenses(prev =>
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  // Select/deselect all expenses
  const toggleAllExpenses = () => {
    if (bulkSelectAll) {
      setSelectedExpenses([]);
    } else {
      setSelectedExpenses(expenses.map(e => e.id));
    }
    setBulkSelectAll(!bulkSelectAll);
  };

  // Handle split method change (mutually exclusive)
  const handleSplitChange = (method: 'equally' | 'percent' | 'custom') => {
    setSplitEqually(method === 'equally');
    setSplitPercent(method === 'percent');
    setSplitCustom(method === 'custom');
  };

  // Filter handlers
  const toggleCategory = (category: string) => {
    setFilterCategories(prev =>
      prev.includes(category) ? prev.filter(c => c !== category) : [...prev, category]
    );
  };

  const toggleStatus = (status: string) => {
    setFilterStatus(prev =>
      prev.includes(status) ? prev.filter(s => s !== status) : [...prev, status]
    );
  };

  return (
    <div style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1>Checkbox Component – Real‑World Test</h1>
        <ThemeSwitcher variant="both" />
      </div>

      <hr style={{ margin: '2rem 0' }} />

      {/* 1. All Sizes */}
      <section>
        <h2>1. Sizes</h2>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '2rem', alignItems: 'center' }}>
          <Checkbox size="sm" label="Small" />
          <Checkbox size="md" label="Medium (default)" />
          <Checkbox size="lg" label="Large" />
        </div>
      </section>

      <hr style={{ margin: '2rem 0' }} />

      {/* 2. States */}
      <section>
        <h2>2. States</h2>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '2rem', alignItems: 'center' }}>
          <Checkbox label="Unchecked" />
          <Checkbox checked label="Checked" />
          <Checkbox indeterminate label="Indeterminate" />
          <Checkbox disabled label="Disabled" />
          <Checkbox disabled checked label="Disabled Checked" />
        </div>
      </section>

      <hr style={{ margin: '2rem 0' }} />

      {/* 3. Error & Helper Text */}
      <section>
        <h2>3. Error & Helper Text</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', maxWidth: '400px' }}>
          <Checkbox
            label="Accept Terms and Conditions"
            error="You must accept the terms to continue"
            checked={termsAccepted}
            onChange={setTermsAccepted}
            required
          />
          <Checkbox
            label="Subscribe to newsletter"
            helperText="We'll send you monthly updates about new features"
            checked={newsletterSignup}
            onChange={setNewsletterSignup}
          />
          <Checkbox
            label="Privacy Policy Consent"
            error={!privacyConsent ? 'Please review and accept our privacy policy' : false}
            helperText="We take your privacy seriously"
            checked={privacyConsent}
            onChange={setPrivacyConsent}
            required
          />
        </div>
      </section>

      <hr style={{ margin: '2rem 0' }} />

      {/* 4. Required Field */}
      <section>
        <h2>4. Required Fields</h2>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '2rem', alignItems: 'center' }}>
          <Checkbox label="Required checkbox" required />
          <Checkbox label="Required with default" required defaultChecked />
          <Checkbox label="Required with error" required error="This field is required" />
        </div>
        <p><small>Required checkboxes show a <span style={{ color: 'var(--color-error-text)' }}>*</span> asterisk and have <code>aria-required=</code>.</small></p>
      </section>

      <hr style={{ margin: '2rem 0' }} />

      {/* 5. Real‑world: Login Form */}
      <section>
        <h2>5. Login Form</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', maxWidth: '400px' }}>
          <Checkbox label="Remember me" checked={rememberMe} onChange={setRememberMe} />
          <Checkbox label="Keep me logged in" />
          <Button variant="primary" fullWidth>Sign In</Button>
        </div>
      </section>

      <hr style={{ margin: '2rem 0' }} />

      {/* 6. Real‑world: Notification Preferences */}
      <section>
        <h2>6. Notification Preferences</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', maxWidth: '400px' }}>
          <Checkbox
            label="Email notifications"
            checked={emailNotifications}
            onChange={setEmailNotifications}
          />
          <Checkbox
            label="Promotional emails"
            checked={promotionalEmails}
            onChange={setPromotionalEmails}
            disabled={!emailNotifications}
          />
          <Checkbox label="Push notifications" />
          <Checkbox label="SMS alerts" />
        </div>
        <p><small>Promotional emails is disabled when email notifications are off.</small></p>
      </section>

      <hr style={{ margin: '2rem 0' }} />

      {/* 7. Real‑world: Split Method (Mutually Exclusive) */}
      <section>
        <h2>7. Split Method</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', maxWidth: '400px' }}>
          <Checkbox
            label="Split equally"
            checked={splitEqually}
            onChange={() => handleSplitChange('equally')}
          />
          <Checkbox
            label="Split by percentage"
            checked={splitPercent}
            onChange={() => handleSplitChange('percent')}
          />
          <Checkbox
            label="Split custom amount"
            checked={splitCustom}
            onChange={() => handleSplitChange('custom')}
          />
        </div>
        <p><small>Mutually exclusive selection (only one split method can be active).</small></p>
      </section>

      <hr style={{ margin: '2rem 0' }} />

      {/* 8. Real‑world: Bulk Expense Selection */}
      <section>
        <h2>8. Bulk Expense Selection</h2>
        <div style={{ border: '1px solid var(--color-border)', borderRadius: 'var(--radius-md)', padding: '1rem', maxWidth: '600px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.75rem', paddingBottom: '0.75rem', borderBottom: '1px solid var(--color-divider)' }}>
            <Checkbox
              label="Select All"
              checked={bulkSelectAll}
              onChange={toggleAllExpenses}
              indeterminate={selectedExpenses.length > 0 && selectedExpenses.length < expenses.length}
            />
            <Badge variant="primary">{selectedExpenses.length} selected</Badge>
          </div>
          {expenses.map(exp => (
            <div key={exp.id} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.5rem 0', borderBottom: '1px solid var(--color-divider)' }}>
              <Checkbox
                checked={selectedExpenses.includes(exp.id)}
                onChange={() => toggleExpense(exp.id)}
              />
              <span style={{ flex: 1 }}>{exp.description}</span>
              <span style={{ color: 'var(--color-text-secondary)' }}>${exp.amount.toFixed(2)}</span>
            </div>
          ))}
          {selectedExpenses.length > 0 && (
            <Button variant="danger" size="sm" style={{ marginTop: '0.75rem' }}>
              Delete Selected ({selectedExpenses.length})
            </Button>
          )}
        </div>
        <p><small>Indeterminate state shown when some (not all) items are selected.</small></p>
      </section>

      <hr style={{ margin: '2rem 0' }} />

      {/* 9. Real‑world: Filter Controls */}
      <section>
        <h2>9. Filter Controls</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', maxWidth: '600px' }}>
          <div>
            <h4>Categories</h4>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem 1.5rem' }}>
              <Checkbox
                label="Food"
                checked={filterCategories.includes('food')}
                onChange={() => toggleCategory('food')}
                size="sm"
              />
              <Checkbox
                label="Transport"
                checked={filterCategories.includes('transport')}
                onChange={() => toggleCategory('transport')}
                size="sm"
              />
              <Checkbox
                label="Shopping"
                checked={filterCategories.includes('shopping')}
                onChange={() => toggleCategory('shopping')}
                size="sm"
              />
              <Checkbox
                label="Entertainment"
                checked={filterCategories.includes('entertainment')}
                onChange={() => toggleCategory('entertainment')}
                size="sm"
              />
              <Checkbox
                label="Bills"
                checked={filterCategories.includes('bills')}
                onChange={() => toggleCategory('bills')}
                size="sm"
              />
            </div>
            <Badge size="sm">{filterCategories.length} filters active</Badge>
          </div>

          <div>
            <h4>Status</h4>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem 1.5rem' }}>
              <Checkbox
                label="Paid"
                checked={filterStatus.includes('paid')}
                onChange={() => toggleStatus('paid')}
                size="sm"
              />
              <Checkbox
                label="Pending"
                checked={filterStatus.includes('pending')}
                onChange={() => toggleStatus('pending')}
                size="sm"
              />
              <Checkbox
                label="Overdue"
                checked={filterStatus.includes('overdue')}
                onChange={() => toggleStatus('overdue')}
                size="sm"
              />
              <Checkbox
                label="Settled"
                checked={filterStatus.includes('settled')}
                onChange={() => toggleStatus('settled')}
                size="sm"
              />
            </div>
          </div>
        </div>
      </section>

      <hr style={{ margin: '2rem 0' }} />

      {/* 10. Real‑world: Terms & Signup */}
      <section>
        <h2>10. Signup Form</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', maxWidth: '500px' }}>
          <Checkbox
            label="I accept the Terms of Service"
            checked={termsAccepted}
            onChange={setTermsAccepted}
            required
            error={!termsAccepted ? 'You must accept the Terms of Service' : false}
          />
          <Checkbox
            label="I agree to the Privacy Policy"
            checked={privacyConsent}
            onChange={setPrivacyConsent}
            required
            error={!privacyConsent ? 'Please agree to our Privacy Policy' : false}
          />
          <Checkbox
            label="Receive product updates and promotions"
            checked={promotionalEmails}
            onChange={setPromotionalEmails}
            helperText="You can unsubscribe at any time"
          />
          <Button
            variant="primary"
            disabled={!termsAccepted || !privacyConsent}
            fullWidth
          >
            Create Account
          </Button>
          {(!termsAccepted || !privacyConsent) && (
            <div style={{ fontSize: '0.9rem', color: 'var(--color-error-text)' }}>
              Please accept all required terms to continue.
            </div>
          )}
        </div>
      </section>

      <footer style={{ marginTop: '3rem', padding: '1rem', borderTop: '1px solid var(--color-divider)', color: 'var(--color-text-muted)', fontSize: '0.9rem' }}>
        <p>Checkbox component test page – all variants, sizes, states, and real‑world use cases.</p>
      </footer>
    </div>
  );
}