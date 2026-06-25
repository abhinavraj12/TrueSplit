// F:\PERSONAL\TrueSplit\frontend\src\app\testing\switch\page.tsx

'use client';

import React, { useState } from 'react';
import { Switch } from '@/shared/_components/atoms/Switch';
import { Typography } from '@/shared/_components/atoms/Typography';
import { Button } from '@/shared/_components/atoms/Button';
import { ThemeSwitcher } from '@/shared/_components/molecules/ThemeSwitcher';
import { Badge } from '@/shared/_components/atoms/Badge';

/**
 * Testing page for the Switch component.
 * Demonstrates all variants, sizes, states, and real-world scenarios.
 */
export default function SwitchTestPage() {
  // State for various real-world examples
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [pushNotifications, setPushNotifications] = useState(false);
  const [smsNotifications, setSmsNotifications] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [autoSave, setAutoSave] = useState(true);
  const [twoFactorAuth, setTwoFactorAuth] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [splitEqually, setSplitEqually] = useState(true);
  const [includeTax, setIncludeTax] = useState(false);
  const [privacyConsent, setPrivacyConsent] = useState(false);
  const [formError, setFormError] = useState('');
  const [formSubmitted, setFormSubmitted] = useState(false);

  // Handle form submit
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!privacyConsent) {
      setFormError('You must accept the privacy policy');
      return;
    }
    setFormError('');
    setFormSubmitted(true);
    setTimeout(() => setFormSubmitted(false), 3000);
  };

  return (
    <div style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <Typography variant="h1">Switch Component – Real‑World Test</Typography>
        <ThemeSwitcher variant="both" />
      </div>

      <hr style={{ margin: '2rem 0' }} />

      {/* 1. All Sizes */}
      <section>
        <Typography variant="h2" color="secondary" style={{ marginBottom: '1rem' }}>1. Sizes</Typography>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '2rem', alignItems: 'center' }}>
          <div style={{ textAlign: 'center' }}>
            <Switch size="sm" label="Small" defaultChecked />
            <Typography variant="small" color="muted">SM</Typography>
          </div>
          <div style={{ textAlign: 'center' }}>
            <Switch size="md" label="Medium" defaultChecked />
            <Typography variant="small" color="muted">MD (default)</Typography>
          </div>
          <div style={{ textAlign: 'center' }}>
            <Switch size="lg" label="Large" defaultChecked />
            <Typography variant="small" color="muted">LG</Typography>
          </div>
        </div>
        <Typography variant="small" color="muted">All available sizes.</Typography>
      </section>

      <hr style={{ margin: '2rem 0' }} />

      {/* 2. States */}
      <section>
        <Typography variant="h2" color="secondary" style={{ marginBottom: '1rem' }}>2. States</Typography>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '2rem', alignItems: 'center' }}>
          <Switch label="Unchecked" />
          <Switch label="Checked" defaultChecked />
          <Switch label="Disabled" disabled />
          <Switch label="Disabled Checked" disabled defaultChecked />
          <Switch label="Error" error="This field has an error" />
        </div>
        <Typography variant="small" color="muted">States: unchecked, checked, disabled, disabled checked, error.</Typography>
      </section>

      <hr style={{ margin: '2rem 0' }} />

      {/* 3. Error & Helper Text */}
      <section>
        <Typography variant="h2" color="secondary" style={{ marginBottom: '1rem' }}>3. Error & Helper Text</Typography>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', maxWidth: '400px' }}>
          <Switch
            label="Accept terms and conditions"
            error="You must accept the terms to continue"
            required
          />
          <Switch
            label="Enable auto-save"
            helperText="Your changes will be saved automatically"
            defaultChecked
          />
          <Switch
            label="Enable dark mode"
            checked={darkMode}
            onChange={setDarkMode}
            helperText={darkMode ? 'Dark mode is active' : 'Switch to dark mode'}
          />
        </div>
        <Typography variant="small" color="muted">Error and helper text display below the switch.</Typography>
      </section>

      <hr style={{ margin: '2rem 0' }} />

      {/* 4. Required Field */}
      <section>
        <Typography variant="h2" color="secondary" style={{ marginBottom: '1rem' }}>4. Required Fields</Typography>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '2rem', alignItems: 'center' }}>
          <Switch label="Required switch" required />
          <Switch label="Required with default" required defaultChecked />
        </div>
        <Typography variant="small" color="muted">
          Required switches show a <span style={{ color: 'var(--color-error-text)' }}>*</span> asterisk and have <code>aria-required=true</code>.
        </Typography>
      </section>

      <hr style={{ margin: '2rem 0' }} />

      {/* 5. Real‑world: Notification Preferences */}
      <section>
        <Typography variant="h2" color="secondary" style={{ marginBottom: '1rem' }}>5. Notification Preferences</Typography>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxWidth: '400px' }}>
          <div style={{ border: '1px solid var(--color-border)', borderRadius: 'var(--radius-md)', padding: '1rem' }}>
            <Typography variant="h4" weight="semibold" style={{ marginBottom: '0.75rem' }}>Notification Settings</Typography>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <Switch
                label="Email notifications"
                checked={emailNotifications}
                onChange={setEmailNotifications}
              />
              <Switch
                label="Push notifications"
                checked={pushNotifications}
                onChange={setPushNotifications}
                disabled={!emailNotifications}
                helperText={!emailNotifications ? 'Enable email notifications first' : undefined}
              />
              <Switch
                label="SMS notifications"
                checked={smsNotifications}
                onChange={setSmsNotifications}
                disabled={!emailNotifications}
                helperText={!emailNotifications ? 'Enable email notifications first' : undefined}
              />
            </div>
          </div>
          <Typography variant="small" color="muted">
            <Badge variant={emailNotifications ? 'success' : 'warning'} size="sm">
              {emailNotifications ? 'Email enabled' : 'Email disabled'}
            </Badge>
            {' '}
            Push and SMS are disabled when email notifications are off.
          </Typography>
        </div>
      </section>

      <hr style={{ margin: '2rem 0' }} />

      {/* 6. Real‑world: Feature Toggles */}
      <section>
        <Typography variant="h2" color="secondary" style={{ marginBottom: '1rem' }}>6. Feature Toggles</Typography>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', maxWidth: '400px' }}>
          <Switch
            label="Auto-save expenses"
            checked={autoSave}
            onChange={setAutoSave}
            helperText={autoSave ? 'Expenses are saved automatically' : 'Manual save required'}
          />
          <Switch
            label="Two-factor authentication"
            checked={twoFactorAuth}
            onChange={setTwoFactorAuth}
            helperText={twoFactorAuth ? 'Extra security enabled' : 'Recommended for security'}
          />
          <Switch
            label="Remember me on this device"
            checked={rememberMe}
            onChange={setRememberMe}
          />
        </div>
        <Typography variant="small" color="muted">Feature toggles with helper text.</Typography>
      </section>

      <hr style={{ margin: '2rem 0' }} />

      {/* 7. Real‑world: Expense Settings */}
      <section>
        <Typography variant="h2" color="secondary" style={{ marginBottom: '1rem' }}>7. Expense Settings</Typography>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', maxWidth: '400px' }}>
          <div style={{ border: '1px solid var(--color-border)', borderRadius: 'var(--radius-md)', padding: '1rem' }}>
            <Typography variant="h4" weight="semibold" style={{ marginBottom: '0.75rem' }}>Split Settings</Typography>
            <Switch
              label="Split equally among all members"
              checked={splitEqually}
              onChange={setSplitEqually}
              size="md"
            />
            <Switch
              label="Include tax in total"
              checked={includeTax}
              onChange={setIncludeTax}
              helperText={includeTax ? 'Tax will be added to the total' : 'Tax excluded'}
            />
          </div>
        </div>
      </section>

      <hr style={{ margin: '2rem 0' }} />

      {/* 8. Controlled vs Uncontrolled */}
      <section>
        <Typography variant="h2" color="secondary" style={{ marginBottom: '1rem' }}>8. Controlled vs Uncontrolled</Typography>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '2rem', alignItems: 'center' }}>
          <div style={{ textAlign: 'center' }}>
            <Switch label="Uncontrolled" defaultChecked />
            <Typography variant="small" color="muted">Uses <code>defaultChecked</code></Typography>
          </div>
          <div style={{ textAlign: 'center' }}>
            <Switch
              label="Controlled"
              checked={notificationsEnabled}
              onChange={setNotificationsEnabled}
            />
            <Typography variant="small" color="muted">
              State: <Badge variant={notificationsEnabled ? 'success' : 'error'} size="sm">
                {notificationsEnabled ? 'ON' : 'OFF'}
              </Badge>
            </Typography>
          </div>
        </div>
      </section>

      <hr style={{ margin: '2rem 0' }} />

      {/* 9. Real‑world: Signup Form with Validation */}
      <section>
        <Typography variant="h2" color="secondary" style={{ marginBottom: '1rem' }}>9. Signup Form with Validation</Typography>
        <form onSubmit={handleSubmit} style={{ maxWidth: '500px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <Switch
              label="I agree to the Privacy Policy"
              checked={privacyConsent}
              onChange={setPrivacyConsent}
              required
              error={formError}
            />
            <Switch
              label="Receive product updates and promotions"
              helperText="You can unsubscribe at any time"
            />
            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <Button type="submit" variant="primary">
                Create Account
              </Button>
              <Button
                type="button"
                variant="ghost"
                onClick={() => {
                  setPrivacyConsent(false);
                  setFormError('');
                  setFormSubmitted(false);
                }}
              >
                Reset
              </Button>
            </div>
            {formSubmitted && (
              <Typography variant="body" color="success">
                ✅ Form submitted successfully!
              </Typography>
            )}
          </div>
        </form>
      </section>

      <hr style={{ margin: '2rem 0' }} />

      {/* 10. Accessibility Documentation */}
      <section>
        <Typography variant="h2" color="secondary" style={{ marginBottom: '1rem' }}>10. Accessibility</Typography>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <Typography variant="body">• <code>role="switch"</code> for proper screen reader semantics</Typography>
          <Typography variant="body">• <code>aria-checked</code>, <code>aria-disabled</code>, <code>aria-invalid</code>, <code>aria-required</code></Typography>
          <Typography variant="body">• <code>aria-describedby</code> links to error/helper messages</Typography>
          <Typography variant="body">• Single label wrapper for proper label association</Typography>
          <Typography variant="body">• <code>required</code> prop with visual asterisk</Typography>
          <Typography variant="body">• <code>aria-label</code> for custom screen reader labels</Typography>
        </div>
        <Typography variant="small" color="muted" style={{ marginTop: '0.5rem' }}>
          The switch is fully accessible and follows WCAG guidelines.
        </Typography>
      </section>

      <footer style={{ marginTop: '3rem', padding: '1rem', borderTop: '1px solid var(--color-divider)', color: 'var(--color-text-muted)' }}>
        <Typography variant="small" color="muted">
          Switch component test page – all sizes, states, and real‑world use cases.
        </Typography>
      </footer>
    </div>
  );
}