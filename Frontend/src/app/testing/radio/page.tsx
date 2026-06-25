'use client';

import React, { useState } from 'react';
import { Radio } from '@/shared/_components/atoms/Radio';
import { Typography } from '@/shared/_components/atoms/Typography';
import { Button } from '@/shared/_components/atoms/Button';
import { ThemeSwitcher } from '@/shared/_components/molecules/ThemeSwitcher';
import { RadioGroup } from '@/shared/_components/atoms/Radio/Radio';

/**
 * Testing page for the Radio component.
 * Demonstrates all real‑world usage scenarios in TrueSplit.
 */
export default function RadioTestPage() {
  // State for various real-world examples
  const [splitMethod, setSplitMethod] = useState('equally');
  const [expenseCategory, setExpenseCategory] = useState('food');
  const [paymentMethod, setPaymentMethod] = useState('credit-card');
  const [notificationPreference, setNotificationPreference] = useState('email');
  const [selectedCurrency, setSelectedCurrency] = useState('usd');
  const [sizeExample, setSizeExample] = useState('sm');
  const [stateExample, setStateExample] = useState('checked');
  const [errorExample, setErrorExample] = useState('');
  const [requiredExample, setRequiredExample] = useState('yes');
  const [sortBy, setSortBy] = useState('date');
  const [formError, setFormError] = useState('');
  const [formSubmitted, setFormSubmitted] = useState(false);

  // Handle form submit
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!splitMethod) {
      setFormError('Please select a split method.');
      return;
    }
    setFormError('');
    setFormSubmitted(true);
    setTimeout(() => setFormSubmitted(false), 3000);
  };

  return (
    <div style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <Typography variant="h1">Radio Component – Real‑World Test</Typography>
        <ThemeSwitcher variant="both" />
      </div>

      <hr style={{ margin: '2rem 0' }} />

      {/* 1. All Sizes */}
      <section>
        <Typography variant="h2" color="secondary" style={{ marginBottom: '1rem' }}>1. Sizes</Typography>
        <RadioGroup
          name="size-example"
          value={sizeExample}
          onChange={setSizeExample}
          label="Select a size"
        >
          <Radio value="sm" label="Small" size="sm" />
          <Radio value="md" label="Medium (default)" size="md" />
          <Radio value="lg" label="Large" size="lg" />
        </RadioGroup>
        <Typography variant="small" color="muted">Sizes: sm, md, lg</Typography>
      </section>

      <hr style={{ margin: '2rem 0' }} />

      {/* 2. States */}
      <section>
        <Typography variant="h2" color="secondary" style={{ marginBottom: '1rem' }}>2. States</Typography>
        <RadioGroup
          name="state-example"
          value={stateExample}
          onChange={setStateExample}
          label="Select a state"
        >
          <Radio value="unchecked" label="Unchecked" />
          <Radio value="checked" label="Checked" />
          <Radio value="disabled" label="Disabled" disabled />
          <Radio value="disabled-checked" label="Disabled Checked" disabled />
          <Radio value="error" label="Error" error />
        </RadioGroup>
        <Typography variant="small" color="muted">States: unchecked, checked, disabled, disabled checked, error</Typography>
      </section>

      <hr style={{ margin: '2rem 0' }} />

      {/* 3. Error & Helper Text */}
      <section>
        <Typography variant="h2" color="secondary" style={{ marginBottom: '1rem' }}>3. Error & Helper Text</Typography>
        <RadioGroup
          name="error-example"
          value={errorExample}
          onChange={setErrorExample}
          label="Accept terms"
          error={!errorExample ? 'You must agree to the terms' : false}
          required
        >
          <Radio value="agree" label="I agree to the terms" />
          <Radio value="disagree" label="I do not agree" />
        </RadioGroup>
        <RadioGroup
          name="helper-example"
          value={notificationPreference}
          onChange={setNotificationPreference}
          label="Newsletter preferences"
          helperText="We'll send you monthly updates"
        >
          <Radio value="subscribe" label="Subscribe to newsletter" />
          <Radio value="unsubscribe" label="Unsubscribe" />
        </RadioGroup>
        <Typography variant="small" color="muted">Error and helper text display below the group.</Typography>
      </section>

      <hr style={{ margin: '2rem 0' }} />

      {/* 4. Required Field */}
      <section>
        <Typography variant="h2" color="secondary" style={{ marginBottom: '1rem' }}>4. Required Fields</Typography>
        <RadioGroup
          name="required-example"
          value={requiredExample}
          onChange={setRequiredExample}
          label="Select an option"
          required
        >
          <Radio value="yes" label="Required radio" />
          <Radio value="no" label="Required with default" />
        </RadioGroup>
        <Typography variant="small" color="muted">
          Required radios show a <span style={{ color: 'var(--color-error-text)' }}>*</span> asterisk and have the native <code>required</code> attribute.
        </Typography>
      </section>

      <hr style={{ margin: '2rem 0' }} />

      {/* 5. Real‑world: Split Method Selection */}
      <section>
        <Typography variant="h2" color="secondary" style={{ marginBottom: '1rem' }}>5. Split Method (RadioGroup)</Typography>
        <RadioGroup
          name="split-method"
          value={splitMethod}
          onChange={setSplitMethod}
          label="Choose how to split this expense"
          required
          helperText="Select how you want to divide the expense among members"
        >
          <Radio value="equally" label="Split Equally" />
          <Radio value="percent" label="Split by Percentage" />
          <Radio value="custom" label="Custom Amounts" />
        </RadioGroup>
        <Typography variant="body" style={{ marginTop: '0.5rem' }}>
          Selected: <strong>{splitMethod}</strong>
        </Typography>
      </section>

      <hr style={{ margin: '2rem 0' }} />

      {/* 6. Real‑world: Expense Category Selection */}
      <section>
        <Typography variant="h2" color="secondary" style={{ marginBottom: '1rem' }}>6. Expense Category</Typography>
        <RadioGroup
          name="category"
          value={expenseCategory}
          onChange={setExpenseCategory}
          label="Select expense category"
          size="sm"
        >
          <Radio value="food" label="🍕 Food & Dining" />
          <Radio value="transport" label="🚗 Transport" />
          <Radio value="shopping" label="🛍️ Shopping" />
          <Radio value="entertainment" label="🎬 Entertainment" />
          <Radio value="bills" label="📄 Bills & Utilities" />
        </RadioGroup>
        <Typography variant="small" color="muted" style={{ marginTop: '0.5rem' }}>
          Selected category: <strong>{expenseCategory}</strong>
        </Typography>
      </section>

      <hr style={{ margin: '2rem 0' }} />

      {/* 7. Real‑world: Payment Method Selection */}
      <section>
        <Typography variant="h2" color="secondary" style={{ marginBottom: '1rem' }}>7. Payment Method</Typography>
        <RadioGroup
          name="payment"
          value={paymentMethod}
          onChange={setPaymentMethod}
          label="Select payment method"
          size="md"
        >
          <Radio value="credit-card" label="💳 Credit Card (2.5% fee)" />
          <Radio value="debit-card" label="💳 Debit Card (No fee)" />
          <Radio value="bank-transfer" label="🏦 Bank Transfer" />
          <Radio value="cash" label="💵 Cash" />
        </RadioGroup>
        <Typography variant="small" color="muted" style={{ marginTop: '0.5rem' }}>
          Selected: <strong>{paymentMethod}</strong>
        </Typography>
      </section>

      <hr style={{ margin: '2rem 0' }} />

      {/* 8. Real‑world: Notification Preferences */}
      <section>
        <Typography variant="h2" color="secondary" style={{ marginBottom: '1rem' }}>8. Notification Preferences</Typography>
        <RadioGroup
          name="notifications"
          value={notificationPreference}
          onChange={setNotificationPreference}
          label="How would you like to receive notifications?"
        >
          <Radio value="email" label="📧 Email" />
          <Radio value="push" label="📱 Push notifications" />
          <Radio value="sms" label="📱 SMS" />
          <Radio value="none" label="🔕 None" />
        </RadioGroup>
        <Typography variant="small" color="muted" style={{ marginTop: '0.5rem' }}>
          Selected: <strong>{notificationPreference}</strong>
        </Typography>
      </section>

      <hr style={{ margin: '2rem 0' }} />

      {/* 9. Real‑world: Currency Selection */}
      <section>
        <Typography variant="h2" color="secondary" style={{ marginBottom: '1rem' }}>9. Currency Selection</Typography>
        <RadioGroup
          name="currency"
          value={selectedCurrency}
          onChange={setSelectedCurrency}
          label="Select your default currency"
          size="lg"
        >
          <Radio value="usd" label="$ USD - US Dollar" />
          <Radio value="eur" label="€ EUR - Euro" />
          <Radio value="gbp" label="£ GBP - British Pound" />
          <Radio value="inr" label="₹ INR - Indian Rupee" />
        </RadioGroup>
        <Typography variant="small" color="muted" style={{ marginTop: '0.5rem' }}>
          Selected currency: <strong>{selectedCurrency.toUpperCase()}</strong>
        </Typography>
      </section>

      <hr style={{ margin: '2rem 0' }} />

      {/* 10. Real‑world: Expense Form with Validation */}
      <section>
        <Typography variant="h2" color="secondary" style={{ marginBottom: '1rem' }}>10. Expense Form with Validation</Typography>
        <form onSubmit={handleSubmit} style={{ maxWidth: '500px' }}>
          <RadioGroup
            name="split-form"
            value={splitMethod}
            onChange={setSplitMethod}
            label="How to split this expense?"
            required
            error={formError}
          >
            <Radio value="equally" label="Split Equally among all members" />
            <Radio value="percent" label="Split by Percentage (e.g., 50/50)" />
            <Radio value="custom" label="Custom Amounts per person" />
            <Radio value="shares" label="By Shares (e.g., 2 shares for Alice)" />
          </RadioGroup>

          <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1rem' }}>
            <Button type="submit" variant="primary">
              Submit Expense
            </Button>
            <Button
              type="button"
              variant="ghost"
              onClick={() => {
                setSplitMethod('');
                setFormError('');
                setFormSubmitted(false);
              }}
            >
              Reset
            </Button>
          </div>

          {formSubmitted && (
            <Typography variant="body" color="success" style={{ marginTop: '0.5rem' }}>
              ✅ Form submitted successfully with split method: <strong>{splitMethod}</strong>
            </Typography>
          )}
        </form>
      </section>

      <hr style={{ margin: '2rem 0' }} />

      {/* 11. Horizontal Layout Example */}
      <section>
        <Typography variant="h2" color="secondary" style={{ marginBottom: '1rem' }}>11. Horizontal Layout</Typography>
        <div style={{ border: '1px solid var(--color-border)', borderRadius: 'var(--radius-md)', padding: '1rem' }}>
          <Typography variant="body" style={{ marginBottom: '0.5rem' }}>Sort by:</Typography>
          <RadioGroup
            name="sort"
            value={sortBy}
            onChange={setSortBy}
            size="sm"
          >
            <Radio value="date" label="Date" />
            <Radio value="amount" label="Amount" />
            <Radio value="category" label="Category" />
          </RadioGroup>
        </div>
        <Typography variant="small" color="muted">Horizontal layout for compact forms.</Typography>
      </section>

      <footer style={{ marginTop: '3rem', padding: '1rem', borderTop: '1px solid var(--color-divider)', color: 'var(--color-text-muted)' }}>
        <Typography variant="small" color="muted">
          Radio component test page – all variants, sizes, states, RadioGroup, and real‑world use cases.
        </Typography>
      </footer>
    </div>
  );
}