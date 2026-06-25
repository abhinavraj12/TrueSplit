'use client';

import React, { useState } from 'react';
import { Textarea } from '@/shared/_components/atoms/Textarea';
import { Typography } from '@/shared/_components/atoms/Typography';
import { Button } from '@/shared/_components/atoms/Button';
import { ThemeSwitcher } from '@/shared/_components/molecules/ThemeSwitcher';
import { Badge } from '@/shared/_components/atoms/Badge';

/**
 * Testing page for the Textarea component.
 * Demonstrates all sizes, states, auto-resize, character count, and real-world scenarios.
 */
export default function TextareaTestPage() {
  // State for various real-world examples
  const [expenseDescription, setExpenseDescription] = useState('');
  const [groupNote, setGroupNote] = useState('');
  const [comment, setComment] = useState('');
  const [feedback, setFeedback] = useState('');
  const [bio, setBio] = useState('');
  const [formError, setFormError] = useState('');
  const [formSubmitted, setFormSubmitted] = useState(false);

  // Handle form submit
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!expenseDescription.trim()) {
      setFormError('Please enter an expense description');
      return;
    }
    setFormError('');
    setFormSubmitted(true);
    setTimeout(() => setFormSubmitted(false), 3000);
  };

  return (
    <div style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <Typography variant="h1">Textarea Component – Real‑World Test</Typography>
        <ThemeSwitcher variant="both" />
      </div>

      <hr style={{ margin: '2rem 0' }} />

      {/* 1. All Sizes */}
      <section>
        <Typography variant="h2" color="secondary" style={{ marginBottom: '1rem' }}>1. Sizes</Typography>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1.5rem', alignItems: 'flex-start' }}>
          <div style={{ width: '200px' }}>
            <Textarea textareaSize="sm" placeholder="Small" rows={2} />
            <Typography variant="small" color="muted">SM</Typography>
          </div>
          <div style={{ width: '200px' }}>
            <Textarea textareaSize="md" placeholder="Medium (default)" rows={3} />
            <Typography variant="small" color="muted">MD</Typography>
          </div>
          <div style={{ width: '200px' }}>
            <Textarea textareaSize="lg" placeholder="Large" rows={4} />
            <Typography variant="small" color="muted">LG</Typography>
          </div>
        </div>
        <Typography variant="small" color="muted">All available sizes.</Typography>
      </section>

      <hr style={{ margin: '2rem 0' }} />

      {/* 2. States */}
      <section>
        <Typography variant="h2" color="secondary" style={{ marginBottom: '1rem' }}>2. States</Typography>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1.5rem', alignItems: 'flex-start' }}>
          <div style={{ width: '250px' }}>
            <Textarea placeholder="Default" rows={2} />
            <Typography variant="small" color="muted">Default</Typography>
          </div>
          <div style={{ width: '250px' }}>
            <Textarea placeholder="Error" error="This field has an error" rows={2} />
            <Typography variant="small" color="muted">Error</Typography>
          </div>
          <div style={{ width: '250px' }}>
            <Textarea placeholder="Success" success rows={2} />
            <Typography variant="small" color="muted">Success</Typography>
          </div>
          <div style={{ width: '250px' }}>
            <Textarea placeholder="Disabled" disabled value="Disabled text" rows={2} />
            <Typography variant="small" color="muted">Disabled</Typography>
          </div>
          <div style={{ width: '250px' }}>
            <Textarea placeholder="Required" required rows={2} />
            <Typography variant="small" color="muted">Required *</Typography>
          </div>
        </div>
        <Typography variant="small" color="muted">All available states.</Typography>
      </section>

      <hr style={{ margin: '2rem 0' }} />

      {/* 3. Auto-Resize */}
      <section>
        <Typography variant="h2" color="secondary" style={{ marginBottom: '1rem' }}>3. Auto‑Resize</Typography>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1.5rem', alignItems: 'flex-start' }}>
          <div style={{ width: '300px' }}>
            <Textarea
              placeholder="Type to see auto‑resize"
              autoResize
              rows={2}
              maxHeight={150}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
            />
            <Typography variant="small" color="muted">
              Auto‑resize with maxHeight (150px). <Badge variant="info" size="sm">{comment.length} characters</Badge>
            </Typography>
          </div>
          <div style={{ width: '300px' }}>
            <Textarea
              placeholder="Uncontrolled auto‑resize"
              autoResize
              rows={2}
              defaultValue="This textarea starts with content and will resize automatically as you type more."
              maxHeight="200px"
            />
            <Typography variant="small" color="muted">Uncontrolled with default value and maxHeight.</Typography>
          </div>
        </div>
      </section>

      <hr style={{ margin: '2rem 0' }} />

      {/* 4. Character Count */}
      <section>
        <Typography variant="h2" color="secondary" style={{ marginBottom: '1rem' }}>4. Character Count</Typography>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1.5rem', alignItems: 'flex-start' }}>
          <div style={{ width: '300px' }}>
            <Textarea
              placeholder="Write a short bio (max 100 chars)"
              maxLength={100}
              showCount
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              rows={3}
            />
            <Typography variant="small" color="muted">Shows character count below.</Typography>
          </div>
          <div style={{ width: '300px' }}>
            <Textarea
              placeholder="Write a review (max 200 chars)"
              maxLength={200}
              showCount
              defaultValue="Great product! I really enjoyed using it. The interface is intuitive and the support team is responsive."
              rows={4}
            />
            <Typography variant="small" color="muted">Character count with default value.</Typography>
          </div>
        </div>
      </section>

      <hr style={{ margin: '2rem 0' }} />

      {/* 5. Error & Helper Text */}
      <section>
        <Typography variant="h2" color="secondary" style={{ marginBottom: '1rem' }}>5. Error & Helper Text</Typography>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1.5rem', alignItems: 'flex-start' }}>
          <div style={{ width: '300px' }}>
            <Textarea
              placeholder="Enter your feedback"
              helperText="We value your opinion"
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              rows={3}
            />
            <Typography variant="small" color="muted">Helper text provides guidance.</Typography>
          </div>
          <div style={{ width: '300px' }}>
            <Textarea
              placeholder="Enter your feedback"
              error="Please provide feedback (minimum 10 characters)"
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              rows={3}
            />
            <Typography variant="small" color="muted">Error message displayed below.</Typography>
          </div>
        </div>
      </section>

      <hr style={{ margin: '2rem 0' }} />

      {/* 6. Full Width */}
      <section>
        <Typography variant="h2" color="secondary" style={{ marginBottom: '1rem' }}>6. Full Width</Typography>
        <div style={{ maxWidth: '600px' }}>
          <Textarea fullWidth placeholder="This textarea takes the full width of its container" rows={3} />
          <Typography variant="small" color="muted">Full width with maxWidth container.</Typography>
        </div>
      </section>

      <hr style={{ margin: '2rem 0' }} />

      {/* 7. Controlled vs Uncontrolled */}
      <section>
        <Typography variant="h2" color="secondary" style={{ marginBottom: '1rem' }}>7. Controlled vs Uncontrolled</Typography>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1.5rem', alignItems: 'flex-start' }}>
          <div style={{ width: '300px' }}>
            <Textarea
              placeholder="Controlled textarea"
              value={groupNote}
              onChange={(e) => setGroupNote(e.target.value)}
              rows={3}
            />
            <Typography variant="small" color="muted">
              Controlled – state: <Badge variant={groupNote ? 'success' : 'warning'} size="sm">
                {groupNote ? `${groupNote.length} chars` : 'Empty'}
              </Badge>
            </Typography>
          </div>
          <div style={{ width: '300px' }}>
            <Textarea
              placeholder="Uncontrolled textarea"
              defaultValue="This is uncontrolled"
              rows={3}
            />
            <Typography variant="small" color="muted">Uncontrolled – uses defaultValue.</Typography>
          </div>
        </div>
      </section>

      <hr style={{ margin: '2rem 0' }} />

      {/* 8. Real-world: Expense Description Form */}
      <section>
        <Typography variant="h2" color="secondary" style={{ marginBottom: '1rem' }}>8. Expense Description Form</Typography>
        <form onSubmit={handleSubmit} style={{ maxWidth: '500px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <Textarea
              placeholder="Describe the expense (e.g., Dinner at Italian place)"
              value={expenseDescription}
              onChange={(e) => setExpenseDescription(e.target.value)}
              rows={3}
              maxLength={200}
              showCount
              required
              error={formError}
              helperText="Include details like date, participants, and purpose"
            />
            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <Button type="submit" variant="primary">
                Add Expense
              </Button>
              <Button
                type="button"
                variant="ghost"
                onClick={() => {
                  setExpenseDescription('');
                  setFormError('');
                  setFormSubmitted(false);
                }}
              >
                Reset
              </Button>
            </div>
            {formSubmitted && (
              <Typography variant="body" color="success">
                ✅ Expense added successfully!
              </Typography>
            )}
          </div>
        </form>
        <Typography variant="small" color="muted">Real‑world expense description with validation.</Typography>
      </section>

      <hr style={{ margin: '2rem 0' }} />

      {/* 9. Real-world: Group Note (auto-resize) */}
      <section>
        <Typography variant="h2" color="secondary" style={{ marginBottom: '1rem' }}>9. Group Note (auto‑resize)</Typography>
        <div style={{ maxWidth: '500px' }}>
          <Textarea
            placeholder="Write a note for your group (auto‑resizes)"
            autoResize
            rows={2}
            maxHeight={200}
            value={groupNote}
            onChange={(e) => setGroupNote(e.target.value)}
            helperText={groupNote ? `${groupNote.length} characters` : 'Start typing to see auto‑resize in action'}
          />
          <Typography variant="small" color="muted">Auto‑resize textarea for group notes.</Typography>
        </div>
      </section>

      <hr style={{ margin: '2rem 0' }} />

      {/* 10. Accessibility */}
      <section>
        <Typography variant="h2" color="secondary" style={{ marginBottom: '1rem' }}>10. Accessibility</Typography>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <Typography variant="body">• <code>aria-invalid</code> set when error state is active.</Typography>
          <Typography variant="body">• <code>aria-describedby</code> links to error/helper messages.</Typography>
          <Typography variant="body">• <code>aria-required</code> when <code>required</code> prop is set.</Typography>
          <Typography variant="body">• <code>aria-label</code> can be customised via the <code>ariaLabel</code> prop.</Typography>
          <Typography variant="body">• Proper <code>id</code> generation for label association.</Typography>
        </div>
        <Typography variant="small" color="muted" style={{ marginTop: '0.5rem' }}>
          The textarea is fully accessible and follows WCAG guidelines.
        </Typography>
      </section>

      <footer style={{ marginTop: '3rem', padding: '1rem', borderTop: '1px solid var(--color-divider)', color: 'var(--color-text-muted)' }}>
        <Typography variant="small" color="muted">
          Textarea component test page – all sizes, states, and real‑world use cases.
        </Typography>
      </footer>
    </div>
  );
}