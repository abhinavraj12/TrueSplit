'use client';

import { useState, useMemo } from 'react';
import { DatePicker } from '@/shared/_components/molecules/DatePicker';
import { Typography } from '@/shared/_components/atoms/Typography';
import { Button } from '@/shared/_components/atoms/Button';

export default function DatePickerExample() {
  const [date1, setDate1] = useState<Date | null>(null);
  const [date2, setDate2] = useState<Date | null>(new Date(2024, 5, 15));
  const [date3, setDate3] = useState<Date | null>(null);
  const [date4, setDate4] = useState<Date | null>(null);
  const [date5, setDate5] = useState<Date | null>(null);
  const [date6, setDate6] = useState<Date | null>(null);
  const [date7, setDate7] = useState<Date | null>(null);
  const [date8, setDate8] = useState<Date | null>(null);
  const [date9, setDate9] = useState<Date | null>(null);
  const [date10, setDate10] = useState<Date | null>(null);
  const [date11, setDate11] = useState<Date | null>(null);
  const [disabledDate, setDisabledDate] = useState<Date | null>(null);
  const [dateHighlight, setDateHighlight] = useState<Date | null>(null);
  const [dateRangeHighlight, setDateRangeHighlight] = useState<Date | null>(null);

  const [log, setLog] = useState<string[]>([]);

  const disabledDates = useMemo(() => {
    const today = new Date();
    const year = today.getFullYear();
    const month = today.getMonth();
    const dates: Date[] = [];
    for (let d = 1; d <= 31; d++) {
      const date = new Date(year, month, d);
      if (date.getMonth() !== month) break;
      if (date.getDay() === 0 || date.getDay() === 6) {
        dates.push(date);
      }
    }
    dates.push(new Date(year, month, 15));
    dates.push(new Date(year, month, 25));
    return dates;
  }, []);

  const highlightedDates = useMemo(() => {
    const today = new Date();
    const year = today.getFullYear();
    const month = today.getMonth();
    return [
      new Date(year, month, 5),
      new Date(year, month, 10),
      new Date(year, month, 20),
    ];
  }, []);

  const dateRangeHighlighted = useMemo(() => {
    const startDate = new Date(2026, 5, 11);
    const endDate = new Date(2026, 5, 23);
    const dates = [];
    const statuses = ['success', 'info', 'warning', 'pending', 'danger'] as const;
    let dayCount = 0;
    for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
      const status = statuses[dayCount % statuses.length];
      dates.push({
        date: new Date(d),
        status: status,
      });
      dayCount++;
    }
    return dates;
  }, []);

  const addLog = (message: string) => {
    setLog((prev) => [...prev, `${new Date().toLocaleTimeString()}: ${message}`]);
  };

  const clearLog = () => setLog([]);

  const handleDateChange = (setter: (date: Date | null) => void, label: string) => {
    return (date: Date | null) => {
      setter(date);
      addLog(`${label}: ${date ? date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'Cleared'}`);
    };
  };

  return (
    <div style={{ maxWidth: '900px', margin: '2rem auto', padding: '2rem' }}>
      <Typography variant="h1" color="primary" weight="bold" style={{ marginBottom: '0.5rem' }}>
        DatePicker Testing
      </Typography>
      <Typography variant="body" color="secondary" style={{ marginBottom: '2rem' }}>
        Comprehensive testing page for the DatePicker molecule
      </Typography>

      <div
        style={{
          padding: '1.5rem',
          backgroundColor: 'var(--color-bg-surface)',
          borderRadius: 'var(--radius-lg)',
          border: '1px solid var(--color-border)',
          marginBottom: '1.5rem',
        }}
      >
        <Typography variant="h4" color="primary" weight="semibold" style={{ marginBottom: '0.5rem' }}>
          Basic
        </Typography>
        <Typography variant="small" color="muted" style={{ marginBottom: '1rem' }}>
          Simple date picker with no default value
        </Typography>
        <DatePicker
          label="Select Date"
          value={date1}
          onChange={handleDateChange(setDate1, 'Basic')}
          placeholder="Pick a date..."
        />
        <Typography variant="small" color="muted" style={{ marginTop: '0.5rem' }}>
          Selected: {date1 ? date1.toLocaleDateString() : 'None'}
        </Typography>
      </div>

      <div
        style={{
          padding: '1.5rem',
          backgroundColor: 'var(--color-bg-surface)',
          borderRadius: 'var(--radius-lg)',
          border: '1px solid var(--color-border)',
          marginBottom: '1.5rem',
        }}
      >
        <Typography variant="h4" color="primary" weight="semibold" style={{ marginBottom: '0.5rem' }}>
          With Default Value
        </Typography>
        <Typography variant="small" color="muted" style={{ marginBottom: '1rem' }}>
          Pre‑selected date (June 15, 2024)
        </Typography>
        <DatePicker
          label="Default Date"
          defaultValue={new Date(2024, 5, 15)}
          onChange={handleDateChange(setDate2, 'Default')}
        />
        <Typography variant="small" color="muted" style={{ marginTop: '0.5rem' }}>
          Selected: {date2 ? date2.toLocaleDateString() : 'None'}
        </Typography>
      </div>

      <div
        style={{
          padding: '1.5rem',
          backgroundColor: 'var(--color-bg-surface)',
          borderRadius: 'var(--radius-lg)',
          border: '1px solid var(--color-border)',
          marginBottom: '1.5rem',
        }}
      >
        <Typography variant="h4" color="primary" weight="semibold" style={{ marginBottom: '0.5rem' }}>
          With Min/Max Dates
        </Typography>
        <Typography variant="small" color="muted" style={{ marginBottom: '1rem' }}>
          Only dates between Jan 1, 2024 and Dec 31, 2024 are selectable
        </Typography>
        <DatePicker
          label="Date Range"
          value={date3}
          onChange={handleDateChange(setDate3, 'Min/Max')}
          minDate={new Date(2024, 0, 1)}
          maxDate={new Date(2024, 11, 31)}
          placeholder="Select a date in 2024..."
        />
        <Typography variant="small" color="muted" style={{ marginTop: '0.5rem' }}>
          Selected: {date3 ? date3.toLocaleDateString() : 'None'}
        </Typography>
      </div>

      <div
        style={{
          padding: '1.5rem',
          backgroundColor: 'var(--color-bg-surface)',
          borderRadius: 'var(--radius-lg)',
          border: '1px solid var(--color-border)',
          marginBottom: '1.5rem',
        }}
      >
        <Typography variant="h4" color="primary" weight="semibold" style={{ marginBottom: '0.5rem' }}>
          Error State
        </Typography>
        <Typography variant="small" color="muted" style={{ marginBottom: '1rem' }}>
          Required field with error message
        </Typography>
        <DatePicker
          label="Required Date"
          value={date4}
          onChange={handleDateChange(setDate4, 'Error')}
          error={!date4 ? 'Please select a date' : false}
          required
          placeholder="Select a date..."
        />
        <Typography variant="small" color="muted" style={{ marginTop: '0.5rem' }}>
          Selected: {date4 ? date4.toLocaleDateString() : 'None'}
        </Typography>
      </div>

      <div
        style={{
          padding: '1.5rem',
          backgroundColor: 'var(--color-bg-surface)',
          borderRadius: 'var(--radius-lg)',
          border: '1px solid var(--color-border)',
          marginBottom: '1.5rem',
        }}
      >
        <Typography variant="h4" color="primary" weight="semibold" style={{ marginBottom: '0.5rem' }}>
          Clearable
        </Typography>
        <Typography variant="small" color="muted" style={{ marginBottom: '1rem' }}>
          Click the X to clear the selected date
        </Typography>
        <DatePicker
          label="Clearable Date"
          value={date5}
          onChange={handleDateChange(setDate5, 'Clearable')}
          clearable
          placeholder="Select a date..."
          defaultValue={new Date()}
        />
        <Typography variant="small" color="muted" style={{ marginTop: '0.5rem' }}>
          Selected: {date5 ? date5.toLocaleDateString() : 'None'}
        </Typography>
      </div>

      <div
        style={{
          padding: '1.5rem',
          backgroundColor: 'var(--color-bg-surface)',
          borderRadius: 'var(--radius-lg)',
          border: '1px solid var(--color-border)',
          marginBottom: '1.5rem',
        }}
      >
        <Typography variant="h4" color="primary" weight="semibold" style={{ marginBottom: '0.5rem' }}>
          Disabled
        </Typography>
        <Typography variant="small" color="muted" style={{ marginBottom: '1rem' }}>
          Non‑interactive date picker
        </Typography>
        <DatePicker
          label="Disabled Date"
          value={date6}
          defaultValue={new Date(2024, 0, 1)}
          disabled
        />
        <Typography variant="small" color="muted" style={{ marginTop: '0.5rem' }}>
          Selected: {date6 ? date6.toLocaleDateString() : 'None'}
        </Typography>
      </div>

      <div
        style={{
          padding: '1.5rem',
          backgroundColor: 'var(--color-bg-surface)',
          borderRadius: 'var(--radius-lg)',
          border: '1px solid var(--color-border)',
          marginBottom: '1.5rem',
        }}
      >
        <Typography variant="h4" color="primary" weight="semibold" style={{ marginBottom: '0.5rem' }}>
          Sizes
        </Typography>
        <Typography variant="small" color="muted" style={{ marginBottom: '1rem' }}>
          Small, Medium, Large variants
        </Typography>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div>
            <Typography variant="small" color="muted" style={{ marginBottom: '0.25rem' }}>
              Small
            </Typography>
            <DatePicker
              size="sm"
              label="Small"
              value={date7}
              onChange={handleDateChange(setDate7, 'Small')}
              placeholder="Select..."
            />
          </div>
          <div>
            <Typography variant="small" color="muted" style={{ marginBottom: '0.25rem' }}>
              Medium
            </Typography>
            <DatePicker
              size="md"
              label="Medium"
              value={date8}
              onChange={handleDateChange(setDate8, 'Medium')}
              placeholder="Select..."
            />
          </div>
          <div>
            <Typography variant="small" color="muted" style={{ marginBottom: '0.25rem' }}>
              Large
            </Typography>
            <DatePicker
              size="lg"
              label="Large"
              value={date9}
              onChange={handleDateChange(setDate9, 'Large')}
              placeholder="Select..."
            />
          </div>
        </div>
      </div>

      <div
        style={{
          padding: '1.5rem',
          backgroundColor: 'var(--color-bg-surface)',
          borderRadius: 'var(--radius-lg)',
          border: '1px solid var(--color-border)',
          marginBottom: '1.5rem',
        }}
      >
        <Typography variant="h4" color="primary" weight="semibold" style={{ marginBottom: '0.5rem' }}>
          Helper Text
        </Typography>
        <Typography variant="small" color="muted" style={{ marginBottom: '1rem' }}>
          Additional guidance below the input
        </Typography>
        <DatePicker
          label="Event Date"
          value={date10}
          onChange={handleDateChange(setDate10, 'Helper')}
          helperText="Select the date of the event"
          placeholder="Pick a date..."
        />
        <Typography variant="small" color="muted" style={{ marginTop: '0.5rem' }}>
          Selected: {date10 ? date10.toLocaleDateString() : 'None'}
        </Typography>
      </div>

      <div
        style={{
          padding: '1.5rem',
          backgroundColor: 'var(--color-bg-surface)',
          borderRadius: 'var(--radius-lg)',
          border: '1px solid var(--color-border)',
          marginBottom: '1.5rem',
        }}
      >
        <Typography variant="h4" color="primary" weight="semibold" style={{ marginBottom: '0.5rem' }}>
          Custom Format
        </Typography>
        <Typography variant="small" color="muted" style={{ marginBottom: '1rem' }}>
          Display format: dd/MM/yyyy
        </Typography>
        <DatePicker
          label="Custom Format"
          value={date11}
          onChange={handleDateChange(setDate11, 'Custom Format')}
          format="dd/MM/yyyy"
          placeholder="DD/MM/YYYY..."
        />
        <Typography variant="small" color="muted" style={{ marginTop: '0.5rem' }}>
          Selected: {date11 ? date11.toLocaleDateString('en-GB') : 'None'}
        </Typography>
      </div>

      <div
        style={{
          padding: '1.5rem',
          backgroundColor: 'var(--color-bg-surface)',
          borderRadius: 'var(--radius-lg)',
          border: '1px solid var(--color-border)',
          marginBottom: '1.5rem',
        }}
      >
        <Typography variant="h4" color="primary" weight="semibold" style={{ marginBottom: '0.5rem' }}>
          Disabled Dates
        </Typography>
        <Typography variant="small" color="muted" style={{ marginBottom: '1rem' }}>
          Weekends, 15th, and 25th of the current month are disabled
        </Typography>
        <DatePicker
          label="Select a date"
          value={disabledDate}
          onChange={handleDateChange(setDisabledDate, 'Disabled Dates')}
          disabledDates={disabledDates}
          placeholder="Pick a date..."
        />
        <Typography variant="small" color="muted" style={{ marginTop: '0.5rem' }}>
          Selected: {disabledDate ? disabledDate.toLocaleDateString() : 'None'}
        </Typography>
        <div style={{ marginTop: '0.5rem' }}>
          <Typography variant="small" color="muted">
            Disabled dates: weekends, 15th, 25th
          </Typography>
        </div>
      </div>

      <div
        style={{
          padding: '1.5rem',
          backgroundColor: 'var(--color-bg-surface)',
          borderRadius: 'var(--radius-lg)',
          border: '1px solid var(--color-border)',
          marginBottom: '1.5rem',
        }}
      >
        <Typography variant="h4" color="primary" weight="semibold" style={{ marginBottom: '0.5rem' }}>
          Highlighted Dates
        </Typography>
        <Typography variant="small" color="muted" style={{ marginBottom: '1rem' }}>
          5th, 10th, and 20th of the current month are highlighted
        </Typography>
        <DatePicker
          label="Select a date"
          value={dateHighlight}
          onChange={handleDateChange(setDateHighlight, 'Highlighted')}
          highlightedDates={highlightedDates}
          placeholder="Pick a date..."
        />
        <Typography variant="small" color="muted" style={{ marginTop: '0.5rem' }}>
          Selected: {dateHighlight ? dateHighlight.toLocaleDateString() : 'None'}
        </Typography>
        <div style={{ marginTop: '0.5rem' }}>
          <Typography variant="small" color="muted">
            Highlighted dates: 5th, 10th, 20th
          </Typography>
        </div>
      </div>

      <div
        style={{
          padding: '1.5rem',
          backgroundColor: 'var(--color-bg-surface)',
          borderRadius: 'var(--radius-lg)',
          border: '1px solid var(--color-border)',
          marginBottom: '1.5rem',
        }}
      >
        <Typography variant="h4" color="primary" weight="semibold" style={{ marginBottom: '0.5rem' }}>
          Date Range Highlighted (11/06/2026 - 23/06/2026)
        </Typography>
        <Typography variant="small" color="muted" style={{ marginBottom: '1rem' }}>
          All dates from June 11 to June 23, 2026 are highlighted with different status colors
        </Typography>
        <DatePicker
          label="Select a date"
          value={dateRangeHighlight}
          onChange={handleDateChange(setDateRangeHighlight, 'Date Range Highlighted')}
          highlightedDates={dateRangeHighlighted}
          placeholder="Pick a date..."
        />
        <Typography variant="small" color="muted" style={{ marginTop: '0.5rem' }}>
          Selected: {dateRangeHighlight ? dateRangeHighlight.toLocaleDateString() : 'None'}
        </Typography>
        <div style={{ marginTop: '0.5rem', display: 'flex', flexWrap: 'wrap', gap: '0.5rem', alignItems: 'center' }}>
          <Typography variant="small" color="muted">
            Status colors:
          </Typography>
          <span style={{ display: 'inline-block', padding: '2px 8px', borderRadius: '4px', backgroundColor: 'rgba(77, 107, 68, 0.15)', color: 'var(--color-success-text)', fontSize: '0.75rem' }}>Success</span>
          <span style={{ display: 'inline-block', padding: '2px 8px', borderRadius: '4px', backgroundColor: 'rgba(74, 99, 70, 0.12)', color: 'var(--color-info-text)', fontSize: '0.75rem' }}>Info</span>
          <span style={{ display: 'inline-block', padding: '2px 8px', borderRadius: '4px', backgroundColor: 'rgba(123, 74, 26, 0.15)', color: 'var(--color-warning-text)', fontSize: '0.75rem' }}>Warning</span>
          <span style={{ display: 'inline-block', padding: '2px 8px', borderRadius: '4px', backgroundColor: 'rgba(74, 99, 70, 0.10)', color: 'var(--color-info-text)', fontSize: '0.75rem' }}>Pending</span>
          <span style={{ display: 'inline-block', padding: '2px 8px', borderRadius: '4px', backgroundColor: 'rgba(168, 106, 106, 0.15)', color: 'var(--color-error-text)', fontSize: '0.75rem' }}>Danger</span>
        </div>
      </div>

      <div
        style={{
          padding: '1.5rem',
          backgroundColor: 'var(--color-bg-surface)',
          borderRadius: 'var(--radius-lg)',
          border: '1px solid var(--color-border)',
          marginBottom: '1.5rem',
        }}
      >
        <Typography variant="h4" color="primary" weight="semibold" style={{ marginBottom: '0.5rem' }}>
          Real World Example — Expense Form
        </Typography>
        <Typography variant="small" color="muted" style={{ marginBottom: '1rem' }}>
          Combined fields: amount + date picker
        </Typography>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <DatePicker
            label="Expense Date"
            value={date1}
            onChange={handleDateChange(setDate1, 'Expense')}
            placeholder="Select date..."
            required
          />
          <div>
            <Typography variant="small" color="primary" weight="medium" style={{ marginBottom: '0.25rem' }}>
              Amount
            </Typography>
            <input
              type="text"
              placeholder="$0.00"
              style={{
                width: '100%',
                padding: '0.5rem 0.75rem',
                border: '2px solid var(--color-input-border)',
                borderRadius: 'var(--radius-md)',
                backgroundColor: 'var(--color-input-bg)',
                color: 'var(--color-text-primary)',
                fontSize: 'var(--font-size-md)',
                height: '44px',
              }}
            />
          </div>
        </div>
        <div style={{ marginTop: '1rem' }}>
          <Button variant="primary" size="md">
            Add Expense
          </Button>
        </div>
      </div>

      <div
        style={{
          padding: '1.5rem',
          backgroundColor: 'var(--color-bg-surface)',
          borderRadius: 'var(--radius-lg)',
          border: '1px solid var(--color-border)',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <Typography variant="h4" color="primary" weight="semibold">
            Activity Log
          </Typography>
          <Button variant="outline" size="sm" onClick={clearLog}>
            Clear Log
          </Button>
        </div>
        <div
          style={{
            maxHeight: '200px',
            overflowY: 'auto',
            backgroundColor: 'var(--color-bg-elevated)',
            borderRadius: 'var(--radius-sm)',
            padding: '0.5rem',
            border: '1px solid var(--color-border)',
          }}
        >
          {log.length === 0 ? (
            <Typography variant="small" color="muted" style={{ padding: '0.5rem' }}>
              No activity yet. Interact with the date pickers above.
            </Typography>
          ) : (
            log.map((entry, index) => (
              <Typography
                key={index}
                variant="small"
                color="secondary"
                style={{
                  padding: '0.25rem 0.5rem',
                  borderBottom: '1px solid var(--color-divider)',
                }}
              >
                {entry}
              </Typography>
            ))
          )}
        </div>
      </div>
    </div>
  );
}