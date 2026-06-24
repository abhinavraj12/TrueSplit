'use client';

import { useState } from 'react';
import { SelectDropdown } from '@/shared/_components/molecules/SelectDropdown';
import { Typography } from '@/shared/_components/atoms/Typography';
import { Button } from '@/shared/_components/atoms/Button';
import { FaUser, FaEnvelope, FaBuilding, FaHome, FaBriefcase, FaCode, FaGlobe } from 'react-icons/fa';

// Sample option data
const categoryOptions = [
  { value: 'food', label: '🍔 Food & Dining' },
  { value: 'transport', label: '🚗 Transportation' },
  { value: 'rent', label: '🏠 Rent & Utilities' },
  { value: 'shopping', label: '🛒 Shopping' },
  { value: 'entertainment', label: '🎮 Entertainment' },
  { value: 'health', label: '💊 Health & Wellness' },
  { value: 'education', label: '📚 Education' },
  { value: 'travel', label: '✈️ Travel' },
];

const userOptions = [
  { value: 'alice', label: 'Alice Johnson', icon: <FaUser /> },
  { value: 'bob', label: 'Bob Smith', icon: <FaUser /> },
  { value: 'carol', label: 'Carol Davis', icon: <FaUser /> },
  { value: 'dave', label: 'Dave Wilson', icon: <FaUser /> },
  { value: 'emma', label: 'Emma Brown', icon: <FaUser /> },
];

const departmentOptions = [
  { value: 'engineering', label: 'Engineering', icon: <FaCode /> },
  { value: 'design', label: 'Design', icon: <FaBriefcase /> },
  { value: 'marketing', label: 'Marketing', icon: <FaGlobe /> },
  { value: 'sales', label: 'Sales', icon: <FaBuilding /> },
  { value: 'hr', label: 'Human Resources', icon: <FaUser /> },
];

const countryOptions = [
  { value: 'us', label: '🇺🇸 United States' },
  { value: 'uk', label: '🇬🇧 United Kingdom' },
  { value: 'ca', label: '🇨🇦 Canada' },
  { value: 'au', label: '🇦🇺 Australia' },
  { value: 'de', label: '🇩🇪 Germany' },
  { value: 'fr', label: '🇫🇷 France' },
  { value: 'jp', label: '🇯🇵 Japan' },
  { value: 'in', label: '🇮🇳 India' },
  { value: 'br', label: '🇧🇷 Brazil' },
  { value: 'za', label: '🇿🇦 South Africa' },
];

const currencyOptions = [
  { value: 'usd', label: 'USD - US Dollar' },
  { value: 'eur', label: 'EUR - Euro' },
  { value: 'gbp', label: 'GBP - British Pound' },
  { value: 'inr', label: 'INR - Indian Rupee' },
  { value: 'cad', label: 'CAD - Canadian Dollar' },
  { value: 'aud', label: 'AUD - Australian Dollar' },
  { value: 'jpy', label: 'JPY - Japanese Yen' },
];

export default function DropdownExample() {
  // State for various dropdown examples
  const [category, setCategory] = useState('');
  const [user, setUser] = useState('');
  const [department, setDepartment] = useState('');
  const [country, setCountry] = useState('us');
  const [currency, setCurrency] = useState('');
  const [searchableValue, setSearchableValue] = useState('');

  // State for controlled vs uncontrolled demo
  const [controlledValue, setControlledValue] = useState('food');

  const [log, setLog] = useState<string[]>([]);

  const addLog = (message: string) => {
    setLog((prev) => [...prev, `${new Date().toLocaleTimeString()}: ${message}`]);
  };

  const clearLog = () => setLog([]);

  return (
    <div style={{ maxWidth: '900px', margin: '2rem auto', padding: '2rem' }}>
      <Typography variant="h1" color="primary" weight="bold" style={{ marginBottom: '0.5rem' }}>
        SelectDropdown Testing
      </Typography>
      <Typography variant="body" color="secondary" style={{ marginBottom: '2rem' }}>
        Comprehensive testing page for the SelectDropdown molecule
      </Typography>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
        {/* ===== Basic Dropdown ===== */}
        <div
          style={{
            padding: '1.5rem',
            backgroundColor: 'var(--color-bg-surface)',
            borderRadius: 'var(--radius-lg)',
            border: '1px solid var(--color-border)',
          }}
        >
          <Typography variant="h4" color="primary" weight="semibold" style={{ marginBottom: '0.5rem' }}>
            Basic
          </Typography>
          <Typography variant="small" color="muted" style={{ marginBottom: '1rem' }}>
            Simple dropdown with placeholder
          </Typography>
          <SelectDropdown
            label="Category"
            options={categoryOptions}
            placeholder="Select a category..."
            value={category}
            onChange={(val) => {
              setCategory(val);
              addLog(`Selected category: ${val}`);
            }}
          />
          <Typography variant="small" color="muted" style={{ marginTop: '0.5rem' }}>
            Selected: {category || 'None'}
          </Typography>
        </div>

        {/* ===== With Icons ===== */}
        <div
          style={{
            padding: '1.5rem',
            backgroundColor: 'var(--color-bg-surface)',
            borderRadius: 'var(--radius-lg)',
            border: '1px solid var(--color-border)',
          }}
        >
          <Typography variant="h4" color="primary" weight="semibold" style={{ marginBottom: '0.5rem' }}>
            With Icons
          </Typography>
          <Typography variant="small" color="muted" style={{ marginBottom: '1rem' }}>
            Options with icons
          </Typography>
          <SelectDropdown
            label="User"
            options={userOptions}
            placeholder="Select a user..."
            value={user}
            onChange={(val) => {
              setUser(val);
              addLog(`Selected user: ${val}`);
            }}
          />
          <Typography variant="small" color="muted" style={{ marginTop: '0.5rem' }}>
            Selected: {user || 'None'}
          </Typography>
        </div>

        {/* ===== Searchable ===== */}
        <div
          style={{
            padding: '1.5rem',
            backgroundColor: 'var(--color-bg-surface)',
            borderRadius: 'var(--radius-lg)',
            border: '1px solid var(--color-border)',
          }}
        >
          <Typography variant="h4" color="primary" weight="semibold" style={{ marginBottom: '0.5rem' }}>
            Searchable
          </Typography>
          <Typography variant="small" color="muted" style={{ marginBottom: '1rem' }}>
            Search to filter options
          </Typography>
          <SelectDropdown
            label="Country"
            options={countryOptions}
            placeholder="Search for a country..."
            value={searchableValue}
            onChange={(val) => {
              setSearchableValue(val);
              addLog(`Selected country: ${val}`);
            }}
            searchable
          />
          <Typography variant="small" color="muted" style={{ marginTop: '0.5rem' }}>
            Selected: {searchableValue || 'None'}
          </Typography>
        </div>

        {/* ===== Clearable ===== */}
        <div
          style={{
            padding: '1.5rem',
            backgroundColor: 'var(--color-bg-surface)',
            borderRadius: 'var(--radius-lg)',
            border: '1px solid var(--color-border)',
          }}
        >
          <Typography variant="h4" color="primary" weight="semibold" style={{ marginBottom: '0.5rem' }}>
            Clearable
          </Typography>
          <Typography variant="small" color="muted" style={{ marginBottom: '1rem' }}>
            Click X to clear selection
          </Typography>
          <SelectDropdown
            label="Currency"
            options={currencyOptions}
            placeholder="Select currency..."
            value={currency}
            onChange={(val) => {
              setCurrency(val);
              addLog(`Selected currency: ${val}`);
            }}
            clearable
          />
          <Typography variant="small" color="muted" style={{ marginTop: '0.5rem' }}>
            Selected: {currency || 'None'}
          </Typography>
        </div>

        {/* ===== With Error ===== */}
        <div
          style={{
            padding: '1.5rem',
            backgroundColor: 'var(--color-bg-surface)',
            borderRadius: 'var(--radius-lg)',
            border: '1px solid var(--color-border)',
          }}
        >
          <Typography variant="h4" color="primary" weight="semibold" style={{ marginBottom: '0.5rem' }}>
            Error State
          </Typography>
          <Typography variant="small" color="muted" style={{ marginBottom: '1rem' }}>
            Required field with error message
          </Typography>
          <SelectDropdown
            label="Department"
            options={departmentOptions}
            placeholder="Select department..."
            value={department}
            onChange={(val) => {
              setDepartment(val);
              addLog(`Selected department: ${val}`);
            }}
            error={!department ? 'Please select a department' : false}
            required
          />
          <Typography variant="small" color="muted" style={{ marginTop: '0.5rem' }}>
            Selected: {department || 'None'}
          </Typography>
        </div>

        {/* ===== Controlled ===== */}
        <div
          style={{
            padding: '1.5rem',
            backgroundColor: 'var(--color-bg-surface)',
            borderRadius: 'var(--radius-lg)',
            border: '1px solid var(--color-border)',
          }}
        >
          <Typography variant="h4" color="primary" weight="semibold" style={{ marginBottom: '0.5rem' }}>
            Controlled
          </Typography>
          <Typography variant="small" color="muted" style={{ marginBottom: '1rem' }}>
            Value controlled by external state
          </Typography>
          <SelectDropdown
            label="Controlled Category"
            options={categoryOptions}
            value={controlledValue}
            onChange={(val) => {
              setControlledValue(val);
              addLog(`Controlled value changed: ${val}`);
            }}
          />
          <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem', flexWrap: 'wrap' }}>
            <Button
              size="sm"
              variant="secondary"
              onClick={() => setControlledValue('food')}
            >
              Set Food
            </Button>
            <Button
              size="sm"
              variant="secondary"
              onClick={() => setControlledValue('transport')}
            >
              Set Transport
            </Button>
            <Button
              size="sm"
              variant="secondary"
              onClick={() => setControlledValue('entertainment')}
            >
              Set Entertainment
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => setControlledValue('')}
            >
              Clear
            </Button>
          </div>
          <Typography variant="small" color="muted" style={{ marginTop: '0.5rem' }}>
            Controlled value: {controlledValue || 'None'}
          </Typography>
        </div>
      </div>

      {/* ===== Sizes ===== */}
      <div
        style={{
          marginTop: '2rem',
          padding: '1.5rem',
          backgroundColor: 'var(--color-bg-surface)',
          borderRadius: 'var(--radius-lg)',
          border: '1px solid var(--color-border)',
        }}
      >
        <Typography variant="h4" color="primary" weight="semibold" style={{ marginBottom: '0.5rem' }}>
          Sizes
        </Typography>
        <Typography variant="small" color="muted" style={{ marginBottom: '1rem' }}>
          Small, Medium, Large variants
        </Typography>
        <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap', alignItems: 'flex-start' }}>
          <div style={{ flex: 1, minWidth: '200px' }}>
            <SelectDropdown
              label="Small"
              size="sm"
              options={categoryOptions.slice(0, 4)}
              placeholder="Small dropdown..."
              value=""
            />
          </div>
          <div style={{ flex: 1, minWidth: '200px' }}>
            <SelectDropdown
              label="Medium"
              size="md"
              options={categoryOptions.slice(0, 4)}
              placeholder="Medium dropdown..."
              value="food"
            />
          </div>
          <div style={{ flex: 1, minWidth: '200px' }}>
            <SelectDropdown
              label="Large"
              size="lg"
              options={categoryOptions.slice(0, 4)}
              placeholder="Large dropdown..."
              value=""
            />
          </div>
        </div>
      </div>

      {/* ===== Disabled ===== */}
      <div
        style={{
          marginTop: '2rem',
          padding: '1.5rem',
          backgroundColor: 'var(--color-bg-surface)',
          borderRadius: 'var(--radius-lg)',
          border: '1px solid var(--color-border)',
        }}
      >
        <Typography variant="h4" color="primary" weight="semibold" style={{ marginBottom: '0.5rem' }}>
          Disabled
        </Typography>
        <Typography variant="small" color="muted" style={{ marginBottom: '1rem' }}>
          Non-interactive dropdown
        </Typography>
        <SelectDropdown
          label="Disabled Dropdown"
          options={departmentOptions}
          value="engineering"
          disabled
        />
      </div>

      {/* ===== Full Featured ===== */}
      <div
        style={{
          marginTop: '2rem',
          padding: '1.5rem',
          backgroundColor: 'var(--color-bg-surface)',
          borderRadius: 'var(--radius-lg)',
          border: '1px solid var(--color-border)',
        }}
      >
        <Typography variant="h4" color="primary" weight="semibold" style={{ marginBottom: '0.5rem' }}>
          Full Featured
        </Typography>
        <Typography variant="small" color="muted" style={{ marginBottom: '1rem' }}>
          Searchable + Clearable + Required + Error
        </Typography>
        <SelectDropdown
          label="Search & Select"
          options={countryOptions}
          placeholder="Search for a country..."
          searchable
          clearable
          required
          helperText="Start typing to search for a country"
          error={!searchableValue ? 'Please select a country' : false}
          onChange={(val) => {
            setSearchableValue(val);
            addLog(`Full featured selected: ${val}`);
          }}
        />
        <Typography variant="small" color="muted" style={{ marginTop: '0.5rem' }}>
          Selected: {searchableValue || 'None'}
        </Typography>
      </div>

      {/* ===== Activity Log ===== */}
      <div
        style={{
          marginTop: '2rem',
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
              No activity yet. Interact with the dropdowns above.
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