'use client';

import { useState, useEffect } from 'react';
import { Typography } from '@/shared/_components/atoms/Typography';
import { Button } from '@/shared/_components/atoms/Button';
import { Icon } from '@/shared/_components/atoms/Icon';
import { Input } from '@/shared/_components/atoms/Input';
import { Avatar } from '@/shared/_components/atoms/Avatar';
import { Badge } from '@/shared/_components/atoms/Badge';
import { Checkbox } from '@/shared/_components/atoms/Checkbox';
import { Switch } from '@/shared/_components/atoms/Switch';
import { Radio } from '@/shared/_components/atoms/Radio';
import { Skeleton } from '@/shared/_components/atoms/Skeleton';
import { Spinner } from '@/shared/_components/atoms/Spinner';
import { Tooltip } from '@/shared/_components/atoms/Tooltip';
import { Textarea } from '@/shared/_components/atoms/Textarea';
import { toast } from '@/shared/_components/molecules/Toast';
import { FormField } from '@/shared/_components/molecules/FormField';
import { SearchInput } from '@/shared/_components/molecules/SearchInput';
import { UserChip } from '@/shared/_components/molecules/UserChip';
import { SelectDropdown } from '@/shared/_components/molecules/SelectDropdown';
import { AmountInput } from '@/shared/_components/molecules/AmountInput';
import { DatePicker } from '@/shared/_components/molecules/DatePicker';
import { ToggleGroup } from '@/shared/_components/molecules/ToggleGroup';
import { FilterControls } from '@/shared/_components/molecules/FilterControls';
import { Pagination } from '@/shared/_components/molecules/Pagination';
import { CurrencySelector } from '@/shared/_components/molecules/CurrencySelector';
import { CategoryChip } from '@/shared/_components/molecules/CategoryChip';
import { Breadcrumb } from '@/shared/_components/molecules/Breadcrumb';
import { ThemeSwitcher } from '@/shared/_components/molecules/ThemeSwitcher';
import { Modal } from '@/shared/_components/molecules/Modal';
import {
  FaPlus,
  FaTrash,
  FaCheck,
  FaCog,
  FaTimes,
  FaHome,
  FaUser,
  FaBell,
  FaInfo,
  FaExclamationTriangle,
  FaUtensils,
  FaCar,
  FaShoppingBag,
  FaHeart,
  FaStar,
  FaFolder,
} from 'react-icons/fa';
import ErrorState from '@/shared/_components/molecules/ErrorState/ErrorState';
import LoadingState from '@/shared/_components/molecules/LoadingState/LoadingState';
import EmptyState from '@/shared/_components/molecules/EmptyState/EmptyState';

export default function TestingPage() {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  // ===== Component States =====
  const [searchValue, setSearchValue] = useState('');
  const [selectedOption, setSelectedOption] = useState('');
  const [amount, setAmount] = useState<number | string>('');
  const [date, setDate] = useState<Date | null>(null);
  const [toggleView, setToggleView] = useState('grid');
  const [toggleFilters, setToggleFilters] = useState<string[]>([]);
  const [paginationPage, setPaginationPage] = useState(1);
  const [currency, setCurrency] = useState('USD');
  const [filterValues, setFilterValues] = useState<Record<string, any>>({});
  const [isSearching, setIsSearching] = useState(false);

  // ===== Modal States =====
  const [modalOpen, setModalOpen] = useState(false);
  const [modalVariant, setModalVariant] = useState<
    'default' | 'confirm' | 'delete' | 'success' | 'form' | 'info'
  >('default');
  const [modalTitle, setModalTitle] = useState('Modal Title');
  const [modalLoading, setModalLoading] = useState(false);

  // ===== Breadcrumb Items =====
  const breadcrumbItems = [
    { label: 'Home', href: '/', icon: <FaHome /> },
    { label: 'Dashboard', href: '/dashboard', icon: <FaFolder /> },
    { label: 'Testing' },
  ];

  // ===== Category Chips =====
  const categoryChips = [
    { label: 'Food', icon: <FaUtensils /> },
    { label: 'Transport', icon: <FaCar /> },
    { label: 'Shopping', icon: <FaShoppingBag /> },
    { label: 'Health', icon: <FaHeart /> },
    { label: 'Entertainment', icon: <FaStar /> },
  ];

  // ===== Filter Config =====
  const filterConfig = [
    {
      id: 'category',
      type: 'select' as const,
      label: 'Category',
      options: [
        { value: 'food', label: 'Food' },
        { value: 'transport', label: 'Transport' },
        { value: 'shopping', label: 'Shopping' },
        { value: 'health', label: 'Health' },
      ],
    },
    {
      id: 'status',
      type: 'select' as const,
      label: 'Status',
      options: [
        { value: 'paid', label: 'Paid' },
        { value: 'pending', label: 'Pending' },
        { value: 'overdue', label: 'Overdue' },
      ],
    },
    {
      id: 'recurring',
      type: 'toggle' as const,
      label: 'Recurring',
      defaultValue: false,
    },
  ];

  // ===== Toast Handlers =====
  const showToast = (type: 'success' | 'error' | 'info' | 'warning', message: string) => {
    toast[type](message);
  };

  // ===== Search Handler =====
  const handleSearch = (value: string) => {
    setIsSearching(true);
    setTimeout(() => {
      setIsSearching(false);
    }, 1000);
  };

  // ===== Modal Handlers =====
  const openModal = (
    variant: 'default' | 'confirm' | 'delete' | 'success' | 'form' | 'info',
    title: string
  ) => {
    setModalVariant(variant);
    setModalTitle(title);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setModalLoading(false);
  };

  const handleDelete = () => {
    setModalLoading(true);
    setTimeout(() => {
      showToast('success', 'Item deleted successfully!');
      setModalLoading(false);
      closeModal();
    }, 1500);
  };

  const handleSubmit = () => {
    setModalLoading(true);
    setTimeout(() => {
      showToast('success', 'Item created successfully!');
      setModalLoading(false);
      closeModal();
    }, 1500);
  };

  return (
    <main style={{ padding: '2rem', maxWidth: '1400px', margin: '0 auto' }}>
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
        <Typography variant="h1" color="primary" weight="bold">
          TrueSplit — All Molecules Testing
        </Typography>
        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
          <ThemeSwitcher variant="icon" />
          <Button onClick={toggleTheme} variant="secondary" size="sm" leftIcon={<FaCog />}>
            {theme === 'light' ? 'Dark' : 'Light'}
          </Button>
        </div>
      </div>

      {/* ===== TOAST ===== */}
      <section style={{ marginBottom: '2rem' }}>
        <Typography variant="h2" color="primary" weight="semibold" style={{ marginBottom: '0.5rem' }}>
          Toast
        </Typography>
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          <Button variant="success" leftIcon={<FaCheck />} onClick={() => showToast('success', 'Success!')}>
            Success
          </Button>
          <Button variant="danger" leftIcon={<FaTrash />} onClick={() => showToast('error', 'Error occurred!')}>
            Error
          </Button>
          <Button variant="secondary" leftIcon={<FaInfo />} onClick={() => showToast('info', 'Info message')}>
            Info
          </Button>
          <Button variant="outline" leftIcon={<FaExclamationTriangle />} onClick={() => showToast('warning', 'Warning!')}>
            Warning
          </Button>
        </div>
      </section>

      {/* ===== FORMFIELD ===== */}
      <section style={{ marginBottom: '2rem' }}>
        <Typography variant="h2" color="primary" weight="semibold" style={{ marginBottom: '0.5rem' }}>
          FormField
        </Typography>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', maxWidth: '600px' }}>
          <FormField label="Email" id="email">
            <Input placeholder="Enter email" />
          </FormField>
          <FormField label="Password" id="password" error="Password is required">
            <Input type="password" placeholder="Enter password" />
          </FormField>
        </div>
      </section>

      {/* ===== SEARCHINPUT ===== */}
      <section style={{ marginBottom: '2rem' }}>
        <Typography variant="h2" color="primary" weight="semibold" style={{ marginBottom: '0.5rem' }}>
          SearchInput
        </Typography>
        <div style={{ maxWidth: '400px' }}>
          <SearchInput
            value={searchValue}
            onChange={(val) => {
              setSearchValue(val);
              handleSearch(val);
            }}
            placeholder="Search..."
            loading={isSearching}
            debounce={300}
          />
        </div>
      </section>

      {/* ===== USERCHIP ===== */}
      <section style={{ marginBottom: '2rem' }}>
        <Typography variant="h2" color="primary" weight="semibold" style={{ marginBottom: '0.5rem' }}>
          UserChip
        </Typography>
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          <UserChip name="John Doe" status="online" />
          <UserChip name="Jane Smith" src="https://i.pravatar.cc/150?img=1" status="busy" />
          <UserChip name="Alice Johnson" subtext="alice@example.com" clickable />
          <UserChip name="Bob Williams" dismissible onDismiss={() => alert('Dismissed')} />
        </div>
      </section>

      {/* ===== SELECTDROPDOWN ===== */}
      <section style={{ marginBottom: '2rem' }}>
        <Typography variant="h2" color="primary" weight="semibold" style={{ marginBottom: '0.5rem' }}>
          SelectDropdown
        </Typography>
        <div style={{ maxWidth: '300px' }}>
          <SelectDropdown
            label="Choose an option"
            options={[
              { value: 'option1', label: 'Option 1' },
              { value: 'option2', label: 'Option 2' },
              { value: 'option3', label: 'Option 3' },
            ]}
            value={selectedOption}
            onChange={(val) => setSelectedOption(val)}
            placeholder="Select..."
          />
        </div>
      </section>

      {/* ===== AMOUNTINPUT ===== */}
      <section style={{ marginBottom: '2rem' }}>
        <Typography variant="h2" color="primary" weight="semibold" style={{ marginBottom: '0.5rem' }}>
          AmountInput
        </Typography>
        <div style={{ maxWidth: '300px' }}>
          <AmountInput
            label="Amount"
            currencySymbol="$"
            value={amount}
            onChange={(val) => setAmount(val)}
            placeholder="0.00"
          />
        </div>
      </section>

      {/* ===== DATEPICKER ===== */}
      <section style={{ marginBottom: '2rem' }}>
        <Typography variant="h2" color="primary" weight="semibold" style={{ marginBottom: '0.5rem' }}>
          DatePicker
        </Typography>
        <div style={{ maxWidth: '300px' }}>
          <DatePicker
            label="Select Date"
            value={date}
            onChange={(d) => setDate(d)}
            placeholder="Pick a date..."
            clearable
          />
        </div>
      </section>

      {/* ===== TOGGLEGROUP ===== */}
      <section style={{ marginBottom: '2rem' }}>
        <Typography variant="h2" color="primary" weight="semibold" style={{ marginBottom: '0.5rem' }}>
          ToggleGroup
        </Typography>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxWidth: '400px' }}>
          <div>
            <Typography variant="small" color="muted" style={{ marginBottom: '0.25rem' }}>
              Single selection — View
            </Typography>
            <ToggleGroup
              options={[
                { value: 'grid', label: 'Grid' },
                { value: 'list', label: 'List' },
                { value: 'table', label: 'Table' },
              ]}
              value={toggleView}
              onChange={(val) => setToggleView(val as string)}
              type="single"
            />
            <Typography variant="small" color="muted" style={{ marginTop: '0.25rem' }}>
              Selected: {toggleView}
            </Typography>
          </div>
          <div>
            <Typography variant="small" color="muted" style={{ marginBottom: '0.25rem' }}>
              Multi selection — Filters
            </Typography>
            <ToggleGroup
              options={[
                { value: 'food', label: 'Food' },
                { value: 'transport', label: 'Transport' },
                { value: 'shopping', label: 'Shopping' },
              ]}
              value={toggleFilters}
              onChange={(val) => setToggleFilters(val as string[])}
              type="multi"
            />
            <Typography variant="small" color="muted" style={{ marginTop: '0.25rem' }}>
              Selected: {toggleFilters.length ? toggleFilters.join(', ') : 'None'}
            </Typography>
          </div>
        </div>
      </section>

      {/* ===== FILTERCONTROLS ===== */}
      <section style={{ marginBottom: '2rem' }}>
        <Typography variant="h2" color="primary" weight="semibold" style={{ marginBottom: '0.5rem' }}>
          FilterControls
        </Typography>
        <FilterControls
          filters={filterConfig}
          onChange={(filters) => setFilterValues(filters)}
          showSearch
          searchPlaceholder="Search items..."
          onSearchChange={handleSearch}
          searchLoading={isSearching}
          searchDebounce={300}
          collapsible
        />
        <Typography variant="small" color="muted" style={{ marginTop: '0.5rem' }}>
          Active filters: {JSON.stringify(filterValues)}
        </Typography>
      </section>

      {/* ===== PAGINATION ===== */}
      <section style={{ marginBottom: '2rem' }}>
        <Typography variant="h2" color="primary" weight="semibold" style={{ marginBottom: '0.5rem' }}>
          Pagination
        </Typography>
        <Pagination
          currentPage={paginationPage}
          totalPages={10}
          onPageChange={setPaginationPage}
          siblingCount={1}
          showFirstLast
          showPrevNext
        />
        <Typography variant="small" color="muted" style={{ marginTop: '0.5rem' }}>
          Page {paginationPage} of 10
        </Typography>
      </section>

      {/* ===== CURRENCYSELECTOR ===== */}
      <section style={{ marginBottom: '2rem' }}>
        <Typography variant="h2" color="primary" weight="semibold" style={{ marginBottom: '0.5rem' }}>
          CurrencySelector
        </Typography>
        <div style={{ maxWidth: '300px' }}>
          <CurrencySelector
            label="Currency"
            value={currency}
            onChange={(val) => setCurrency(val)}
            showSymbol
            showFullName={false}
            placeholder="Select currency"
          />
          <Typography variant="small" color="muted" style={{ marginTop: '0.5rem' }}>
            Selected: {currency}
          </Typography>
        </div>
      </section>

      {/* ===== CATEGORYCHIP ===== */}
      <section style={{ marginBottom: '2rem' }}>
        <Typography variant="h2" color="primary" weight="semibold" style={{ marginBottom: '0.5rem' }}>
          CategoryChip
        </Typography>
        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
          {categoryChips.map((chip, idx) => (
            <CategoryChip
              key={idx}
              label={chip.label}
              icon={chip.icon}
              interactive
              onClick={() => console.log(`Clicked ${chip.label}`)}
            />
          ))}
          <CategoryChip label="Selected" icon={<FaCheck />} selected />
          <CategoryChip label="Disabled" icon={<FaTimes />} disabled />
        </div>
      </section>

      {/* ===== BREADCRUMB ===== */}
      <section style={{ marginBottom: '2rem' }}>
        <Typography variant="h2" color="primary" weight="semibold" style={{ marginBottom: '0.5rem' }}>
          Breadcrumb
        </Typography>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <Breadcrumb items={breadcrumbItems} />
          <Breadcrumb
            items={[
              { label: 'Home', href: '/', icon: <FaHome /> },
              { label: 'Docs', href: '/docs' },
              { label: 'Components' },
            ]}
            separator="›"
            small
          />
          <Breadcrumb
            items={[
              { label: 'Home', href: '/' },
              { label: 'Products', href: '/products' },
              { label: 'Electronics', href: '/products/electronics' },
              { label: 'Laptops', href: '/products/electronics/laptops' },
              { label: 'MacBook Pro' },
            ]}
            maxItems={3}
            separator="/"
          />
        </div>
      </section>

      {/* ===== EMPTYSTATE ===== */}
      <section style={{ marginBottom: '2rem' }}>
        <Typography variant="h2" color="primary" weight="semibold" style={{ marginBottom: '0.5rem' }}>
          EmptyState
        </Typography>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <EmptyState
            title="No expenses yet"
            description="Start tracking your expenses by adding your first expense."
            icon={<FaPlus />}
            actionLabel="Add Expense"
            onAction={() => alert('Add expense')}
            size="md"
          />
          <EmptyState
            title="No groups found"
            description="Create a group to split expenses with friends."
            icon={<FaUser />}
            actionLabel="Create Group"
            onAction={() => alert('Create group')}
            size="sm"
          />
          <EmptyState
            title="All caught up!"
            description="You have no pending notifications."
            icon={<FaBell />}
            size="lg"
          />
        </div>
      </section>

      {/* ===== ERRORSTATE ===== */}
      <section style={{ marginBottom: '2rem' }}>
        <Typography variant="h2" color="primary" weight="semibold" style={{ marginBottom: '0.5rem' }}>
          ErrorState
        </Typography>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <ErrorState
            title="Failed to load expenses"
            description="There was an error loading your expenses. Please try again."
            error={new Error('Network error')}
            onRetry={() => alert('Retry')}
            size="md"
          />
          <ErrorState
            title="Page not found"
            description="The page you're looking for doesn't exist."
            onRetry={() => alert('Go back')}
            retryLabel="Go Back"
            size="sm"
          />
        </div>
      </section>

      {/* ===== LOADINGSTATE ===== */}
      <section style={{ marginBottom: '2rem' }}>
        <Typography variant="h2" color="primary" weight="semibold" style={{ marginBottom: '0.5rem' }}>
          LoadingState
        </Typography>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
          <LoadingState message="Loading..." size="sm" />
          <LoadingState message="Processing your request..." size="md" />
          <LoadingState message="Please wait, this may take a moment..." size="lg" />
        </div>
      </section>

      {/* ===== MODAL ===== */}
      <section style={{ marginBottom: '2rem' }}>
        <Typography variant="h2" color="primary" weight="semibold" style={{ marginBottom: '0.5rem' }}>
          Modal
        </Typography>
        <Typography variant="body" color="secondary" style={{ marginBottom: '1rem' }}>
          Click the buttons below to open modals with different variants.
        </Typography>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem' }}>
          <Button variant="danger" leftIcon={<FaTrash />} onClick={() => openModal('delete', 'Delete Item')}>
            Delete
          </Button>
          <Button variant="success" leftIcon={<FaCheck />} onClick={() => openModal('success', 'Success')}>
            Success
          </Button>
          <Button variant="secondary" leftIcon={<FaExclamationTriangle />} onClick={() => openModal('confirm', 'Confirm Action')}>
            Confirm
          </Button>
          <Button variant="secondary" leftIcon={<FaPlus />} onClick={() => openModal('form', 'Create Item')}>
            Form
          </Button>
          <Button variant="outline" leftIcon={<FaInfo />} onClick={() => openModal('info', 'Information')}>
            Info
          </Button>
          <Button variant="primary" onClick={() => openModal('default', 'Default Modal')}>
            Default
          </Button>
        </div>
      </section>

      {/* ===== ATOMS RECAP ===== */}
      <section style={{ marginBottom: '2rem' }}>
        <Typography variant="h2" color="primary" weight="semibold" style={{ marginBottom: '0.5rem' }}>
          Atoms Quick Recap
        </Typography>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', alignItems: 'center' }}>
          <Badge variant="primary">Badge</Badge>
          <Checkbox label="Checkbox" />
          <Switch label="Switch" />
          <Radio label="Radio" value="radio" />
          <Spinner size="sm" />
          <Skeleton variant="text" width="100px" height="20px" />
          <Avatar name="User" size="sm" />
          <Tooltip content="Tooltip">
            <Icon size="md"><FaInfo /></Icon>
          </Tooltip>
          <Textarea placeholder="Textarea" rows={2} style={{ width: '200px' }} />
        </div>
      </section>

      {/* ===== MODALS (Actual Modals) ===== */}
 <Modal
        isOpen={modalOpen && modalVariant === 'delete'}
        onClose={closeModal}
        title="Delete Item"
        variant="default"
        onConfirm={handleDelete}
        onCancel={closeModal}
        loading={modalLoading}
        confirmLabel="Delete"
        cancelLabel="Cancel"
        size="sm"
      >
        Are you sure you want to delete this item? This action cannot be undone.
      </Modal>
      {/* Delete Modal */}
      <Modal
        isOpen={modalOpen && modalVariant === 'delete'}
        onClose={closeModal}
        title="Delete Item"
        variant="delete"
        onConfirm={handleDelete}
        onCancel={closeModal}
        loading={modalLoading}
        confirmLabel="Delete"
        cancelLabel="Cancel"
        size="sm"
      >
        Are you sure you want to delete this item? This action cannot be undone.
      </Modal>

      {/* Success Modal */}
      <Modal
        isOpen={modalOpen && modalVariant === 'success'}
        onClose={closeModal}
        title="Success!"
        variant="success"
        onConfirm={closeModal}
        loading={modalLoading}
        confirmLabel="Done"
        cancelLabel="Cancel"
        size="sm"
      >
        Your item has been created successfully.
      </Modal>

      {/* Confirm Modal */}
      <Modal
        isOpen={modalOpen && modalVariant === 'confirm'}
        onClose={closeModal}
        title="Confirm Action"
        variant="confirm"
        onConfirm={closeModal}
        onCancel={closeModal}
        loading={modalLoading}
        confirmLabel="Confirm"
        cancelLabel="Cancel"
        size="sm"
      >
        Are you sure you want to proceed with this action?
      </Modal>

      {/* Form Modal */}
      <Modal
        isOpen={modalOpen && modalVariant === 'form'}
        onClose={closeModal}
        title="Create New Item"
        variant="form"
        onConfirm={handleSubmit}
        onCancel={closeModal}
        loading={modalLoading}
        confirmLabel="Create"
        cancelLabel="Cancel"
        size="md"
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <FormField label="Name" id="item-name">
            <Input placeholder="Enter item name" />
          </FormField>
          <FormField label="Description" id="item-desc">
            <Textarea placeholder="Enter description" rows={3} />
          </FormField>
          <FormField label="Category" id="item-cat">
            <SelectDropdown
              options={[
                { value: 'food', label: 'Food' },
                { value: 'transport', label: 'Transport' },
                { value: 'shopping', label: 'Shopping' },
              ]}
              placeholder="Select category"
            />
          </FormField>
        </div>
      </Modal>

      {/* Info Modal */}
      <Modal
        isOpen={modalOpen && modalVariant === 'info'}
        onClose={closeModal}
        title="Information"
        variant="info"
        size="md"
      >
        <Typography variant="body" color="secondary">
          This is an information modal. You can use it to display additional details,
          help content, or any other information to the user.
        </Typography>
        <div style={{ marginTop: '1rem', padding: '1rem', background: 'var(--color-bg-elevated)', borderRadius: 'var(--radius-md)' }}>
          <Typography variant="body" weight="medium" color="primary">
            <Icon size="sm" color="interactive" decorative><FaInfo /></Icon>
            Tip: Modals are great for focused user interactions.
          </Typography>
        </div>
      </Modal>

      {/* Default Modal */}
      <Modal
        isOpen={modalOpen && modalVariant === 'default'}
        onClose={closeModal}
        title="Default Modal"
        variant="default"
        size="md"
      >
        <Typography variant="body" color="secondary">
          This is a default modal. You can put any content here.
          <br /><br />
          Modals are useful for:
          <ul style={{ marginTop: '0.5rem', paddingLeft: '1.5rem', listStyle: 'disc' }}>
            <li>Confirming user actions</li>
            <li>Displaying forms</li>
            <li>Showing detailed information</li>
            <li>Warnings and alerts</li>
          </ul>
        </Typography>
      </Modal>
    </main>
  );
}