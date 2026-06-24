'use client';

import { useState, useEffect } from 'react';
import { Typography } from '@/shared/_components/atoms/Typography';
import { Button } from '@/shared/_components/atoms/Button';
import { Icon } from '@/shared/_components/atoms/Icon';
import { Input } from '@/shared/_components/atoms/Input';
import { Avatar, AvatarGroup } from '@/shared/_components/atoms/Avatar';
import { Badge } from '@/shared/_components/atoms/Badge';
import { Checkbox } from '@/shared/_components/atoms/Checkbox';
import { Switch } from '@/shared/_components/atoms/Switch';
import { Radio } from '@/shared/_components/atoms/Radio';
import { Skeleton } from '@/shared/_components/atoms/Skeleton';
import { Spinner } from '@/shared/_components/atoms/Spinner';
import { Tooltip } from '@/shared/_components/atoms/Tooltip';
import { Textarea } from '@/shared/_components/atoms/Textarea';
import { toast } from '@/shared/_components/molecules/Toast';
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
  FaUtensils,
  FaCar,
  FaShoppingBag,
} from 'react-icons/fa';
import { FormField } from '@/shared/_components/molecules/FormField';
import { SearchInput } from '@/shared/_components/molecules/SearchInput';
import SearchExample from './testingcomponents/SearchExample';
import { UserChip } from '@/shared/_components/molecules/UserChip';
import DropdownExample from './testingcomponents/dropdownExample';
import AmountInputExample from './testingcomponents/amountInputExample';
import PaginationExample from './testingcomponents/paginationExample';
import DatePickerExample from './testingcomponents/datepickerexample';
import { ToggleGroup } from '@/shared/_components/molecules/ToggleGroup';
// NEW: Import FilterControls
import { FilterControls } from '@/shared/_components/molecules/FilterControls';
import { CategoryChip } from '@/shared/_components/molecules/CategoryChip';
import { ThemeSwitcher } from '@/shared/_components/molecules/ThemeSwitcher';

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

  // Switch states
  const [switch1, setSwitch1] = useState(false);
  const [switch2, setSwitch2] = useState(true);
  const [switch3, setSwitch3] = useState(false);

  // Radio states
  const [selectedPayment, setSelectedPayment] = useState<string>('cash');
  const [selectedSplit, setSelectedSplit] = useState<string>('equal');

  // ToggleGroup states
  const [view, setView] = useState('grid');
  const [filters, setFilters] = useState<string[]>([]);
  const viewOptions = [
    { value: 'grid', label: 'Grid' },
    { value: 'list', label: 'List' },
    { value: 'table', label: 'Table' },
  ];
  const filterOptions = [
    { value: 'food', label: '🍔 Food' },
    { value: 'transport', label: '🚗 Transport' },
    { value: 'rent', label: '🏠 Rent' },
  ];

  // FilterControls states
  const [filterValues, setFilterValues] = useState<Record<string, any>>({});
  const [searchQuery, setSearchQuery] = useState('');

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

  // Toast test handlers
  const showToast = (type: 'success' | 'error' | 'info' | 'warning', message: string) => {
    toast[type](message);
  };

  const [search, setSearch] = useState('');
  const isLoading = true;

  // FilterControls change handler
  const handleFilterChange = (values: Record<string, any>) => {
    setFilterValues(values);
    console.log('Filters changed:', values);
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
            Component Library Showcase — Molecules
          </Typography>
        </div>
        <ThemeSwitcher variant="both" label="Toggle theme" />
      </div>

      {/* ========= MOLECULES ============ */}
<CategoryChip label="Food" icon={<FaUtensils />} interactive />
<CategoryChip label="Transport" icon={<FaCar/>} selected />
<CategoryChip label="Shopping" icon={<FaShoppingBag />} size="lg" />
      {/* Single selection toggle */}
      <ToggleGroup
        options={viewOptions}
        value={view}
        onChange={setView}
        type="single"
      />

      {/* Multi selection toggle */}
      <ToggleGroup
        options={filterOptions}
        value={filters}
        onChange={setFilters}
        type="multi"
      />

      {/* Disabled toggle group */}
      <ToggleGroup disabled options={viewOptions} value="grid" />

      <DatePickerExample />
      <PaginationExample />
      <AmountInputExample />
      <SearchInput placeholder="Search expenses..." />
      <SearchExample />

      {/* ============= UserChip ================== */}
      <UserChip name="John Doe" />
      <UserChip
        name="Jane Smith"
        src="https://i.pravatar.cc/150?img=1"
        alt="Jane Smith"
      />
      <UserChip name="Alice Johnson" status="online" />
      <UserChip name="Bob Williams" status="busy" />
      <UserChip name="Carol Davis" status="away" />

      <UserChip
        name="David Brown"
        subtext="david@example.com"
      />
      <UserChip
        name="Emma Wilson"
        clickable
        onClick={() => console.log('User clicked')}
      />
      <UserChip
        name="Frank Miller"
        dismissible
        onDismiss={() => console.log('User removed')}
      />
      <UserChip name="Small User" size="sm" />
      <UserChip name="Medium User" size="md" />
      <UserChip name="Large User" size="lg" />
      <UserChip
        name="Grace Lee"
        src="https://i.pravatar.cc/150?img=2"
        status="online"
        subtext="grace@example.com"
        clickable
        dismissible
        onDismiss={() => console.log('Removed Grace')}
        onClick={() => console.log('Clicked Grace')}
      />

      <DropdownExample />

      {/* ================ Form Field =============== */}
      <FormField label="Email" id="email">
        <Input placeholder="Enter your email" />
      </FormField>

      <FormField label="Password" error="Password is required" id="password">
        <Input type="password" placeholder="Enter password" />
      </FormField>

      <FormField label="Username" helperText="At least 3 characters" id="username">
        <Input placeholder="Choose a username" />
      </FormField>

      <FormField label="Full Name" required id="name">
        <Input placeholder="Enter your full name" />
      </FormField>

      <FormField label="Description" id="desc">
        <Textarea placeholder="Add a description" rows={3} />
      </FormField>

      <FormField label="Search" labelHidden id="search">
        <Input placeholder="Search..." leftAdornment={<Icon><FaSearch /></Icon>} />
      </FormField>

      {/* ===== NEW: FILTER CONTROLS ===== */}
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
          Filter Controls
        </Typography>
        <Typography variant="body" color="secondary" style={{ marginBottom: '1rem' }}>
          Flexible filtering controls with text, select, checkbox, toggle, and date inputs.
        </Typography>

        <FilterControls
          filters={[
            {
              id: 'category',
              type: 'select',
              label: 'Category',
              options: [
                { value: 'food', label: '🍔 Food' },
                { value: 'transport', label: '🚗 Transport' },
                { value: 'rent', label: '🏠 Rent' },
                { value: 'shopping', label: '🛒 Shopping' },
                { value: 'entertainment', label: '🎮 Entertainment' },
              ],
              placeholder: 'All Categories',
            },
            {
              id: 'status',
              type: 'checkbox',
              label: 'Status',
              options: [
                { value: 'paid', label: 'Paid' },
                { value: 'pending', label: 'Pending' },
                { value: 'overdue', label: 'Overdue' },
              ],
              defaultValue: ['paid'],
            },
            {
              id: 'amount',
              type: 'text',
              label: 'Min Amount',
              placeholder: 'e.g. 10',
            },
            {
              id: 'date',
              type: 'date',
              label: 'Date From',
            },
            {
              id: 'recurring',
              type: 'toggle',
              label: 'Recurring',
              defaultValue: false,
            },
          ]}
          onChange={handleFilterChange}
          showSearch
          searchPlaceholder="Search expenses..."
          searchValue={searchQuery}
          onSearchChange={setSearchQuery}
          showClearAll
          collapsible
        />

        <div style={{ marginTop: '1rem' }}>
          <Typography variant="small" color="muted">
            Active filters: {JSON.stringify(filterValues)}
          </Typography>
          {searchQuery && (
            <Typography variant="small" color="muted">
              Search query: {searchQuery}
            </Typography>
          )}
        </div>
      </div>

      {/* ===== ALL OTHER SECTIONS COMMENTED OUT ===== */}
      {/*
      ===== TYPOGRAPHY SECTION =====
      <div ...> ... </div>
      */}

      {/*
      ===== ICON SECTION =====
      <div ...> ... </div>
      */}

      {/*
      ===== INPUT SECTION =====
      <div ...> ... </div>
      */}

      {/*
      ===== AVATAR SECTION =====
      <div ...> ... </div>
      */}

      {/*
      ===== BADGE SECTION =====
      <div ...> ... </div>
      */}

      {/*
      ===== CHECKBOX SECTION =====
      <div ...> ... </div>
      */}

      {/*
      ===== SWITCH SECTION =====
      <div ...> ... </div>
      */}

      {/*
      ===== RADIO SECTION =====
      <div ...> ... </div>
      */}

      {/*
      ===== SKELETON SECTION =====
      <div ...> ... </div>
      */}

      {/*
      ===== SPINNER SECTION =====
      <div ...> ... </div>
      */}

      {/*
      ===== TOOLTIP SECTION =====
      <div ...> ... </div>
      */}

      {/*
      ===== TEXTAREA SECTION =====
      <div ...> ... </div>
      */}

      {/*
      ===== BUTTON SECTION =====
      <div ...> ... </div>
      */}

      {/*
      ===== TOAST TESTING SECTION =====
      <div ...> ... </div>
      */}

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