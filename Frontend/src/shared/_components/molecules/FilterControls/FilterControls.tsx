import React, {
  useState,
  useRef,
  useEffect,
  useCallback,
  useMemo,
  useId,
  memo,
} from 'react';
import clsx from 'clsx';
import { FaFilter } from 'react-icons/fa';
import { Input } from '@/shared/_components/atoms/Input';
import { Button } from '@/shared/_components/atoms/Button';
import { Badge } from '@/shared/_components/atoms/Badge';
import { Checkbox } from '@/shared/_components/atoms/Checkbox';
import { Switch } from '@/shared/_components/atoms/Switch';
import { DatePicker } from '@/shared/_components/molecules/DatePicker';
import { SelectDropdown } from '@/shared/_components/molecules/SelectDropdown';
import { SearchInput } from '@/shared/_components/molecules/SearchInput';
import styles from './FilterControls.module.css';

export type FilterType = 'text' | 'select' | 'checkbox' | 'toggle' | 'date';

export type FilterValue = string | string[] | boolean | Date | null;

export interface FilterOption {
  value: string;
  label: string;
}

export interface FilterControl {
  id: string;
  type: FilterType;
  label: string;
  value?: FilterValue;
  defaultValue?: FilterValue;
  options?: FilterOption[];
  placeholder?: string;
  disabled?: boolean;
  render?: (props: FilterRenderProps) => React.ReactNode;
}

export interface FilterRenderProps {
  value: FilterValue;
  onChange: (value: FilterValue) => void;
  id: string;
  label: string;
  options?: FilterOption[];
  disabled?: boolean;
}

export interface FilterControlsProps {
  filters: FilterControl[];
  onChange: (filters: Record<string, FilterValue>) => void;
  showSearch?: boolean;
  searchPlaceholder?: string;
  searchValue?: string;
  onSearchChange?: (value: string) => void;
  searchLoading?: boolean;
  searchDebounce?: number;
  showClearAll?: boolean;
  collapsible?: boolean;
  className?: string;
  disabled?: boolean;
  activeCount?: number;
}

type FilterValuesState = Record<string, FilterValue>;

/**
 * FilterControls – A comprehensive search + filter UI for lists.
 * Supports text, select, checkbox, toggle, and date filters.
 * Collapsible, responsive, accessible, and performant.
 * Option B layout: horizontal row with uniform control heights.
 */
const FilterControlsComponent: React.FC<FilterControlsProps> = ({
  filters,
  onChange,
  showSearch = true,
  searchPlaceholder = 'Search...',
  searchValue: controlledSearchValue,
  onSearchChange,
  searchLoading = false,
  searchDebounce = 300,
  showClearAll = true,
  collapsible = true,
  className,
  disabled = false,
  activeCount: externalActiveCount,
}) => {
  // --- IDs for accessibility ---
  const filtersRowId = useId();
  const liveRegionId = useId();

  // --- State ---
  const [isExpanded, setIsExpanded] = useState(!collapsible);
  const [internalFilterValues, setInternalFilterValues] = useState<FilterValuesState>(() => {
    const initial: FilterValuesState = {};
    filters.forEach((filter) => {
      if (filter.defaultValue !== undefined) {
        initial[filter.id] = filter.defaultValue;
      }
    });
    return initial;
  });

  // --- Live region status ---
  type SearchStatus = 'idle' | 'searching' | 'complete';
  const [searchStatus, setSearchStatus] = useState<SearchStatus>('idle');
  const prevLoadingRef = useRef(searchLoading);

  useEffect(() => {
    if (searchLoading !== prevLoadingRef.current) {
      if (searchLoading) {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setSearchStatus('searching');
      } else {
        setSearchStatus('complete');
        const timer = setTimeout(() => setSearchStatus('idle'), 2000);
        return () => clearTimeout(timer);
      }
      prevLoadingRef.current = searchLoading;
    }
    return () => {};
  }, [searchLoading]);

  // --- Refs ---
  const containerRef = useRef<HTMLDivElement>(null);
  const firstFilterRef = useRef<HTMLDivElement>(null);

  // --- Determine if filter is controlled ---
  const isFilterControlled = useCallback(
    (filter: FilterControl): boolean => filter.value !== undefined,
    [],
  );

  // --- Get current value for a filter ---
  const getFilterValue = useCallback(
    (filter: FilterControl): FilterValue => {
      if (isFilterControlled(filter)) {
        return filter.value ?? null;
      }
      return internalFilterValues[filter.id] ?? filter.defaultValue ?? null;
    },
    [isFilterControlled, internalFilterValues],
  );

  // --- Handle filter change ---
  const handleFilterChange = useCallback(
    (filterId: string, value: FilterValue) => {
      const filter = filters.find((f) => f.id === filterId);
      if (!filter) return;

      if (!isFilterControlled(filter)) {
        setInternalFilterValues((prev) => ({ ...prev, [filterId]: value }));
      }

      const allValues: FilterValuesState = {};
      filters.forEach((f) => {
        if (f.id === filterId) {
          allValues[f.id] = value;
        } else if (isFilterControlled(f)) {
          allValues[f.id] = f.value ?? null;
        } else {
          allValues[f.id] = internalFilterValues[f.id] ?? f.defaultValue ?? null;
        }
      });

      onChange(allValues);
    },
    [filters, internalFilterValues, onChange, isFilterControlled],
  );

  // --- Search change ---
  const handleSearchChange = useCallback(
    (value: string) => {
      onSearchChange?.(value);
    },
    [onSearchChange],
  );

  // --- Clear all ---
  const handleClearAll = useCallback(() => {
    const clearedValues: FilterValuesState = {};
    filters.forEach((filter) => {
      let emptyValue: FilterValue;
      switch (filter.type) {
        case 'checkbox':
          emptyValue = [];
          break;
        case 'toggle':
          emptyValue = false;
          break;
        default:
          emptyValue = '';
          break;
      }
      clearedValues[filter.id] = emptyValue;
      if (!isFilterControlled(filter)) {
        setInternalFilterValues((prev) => ({ ...prev, [filter.id]: emptyValue }));
      }
    });
    onChange(clearedValues);
    if (onSearchChange) {
      onSearchChange('');
    }
  }, [filters, onChange, isFilterControlled, onSearchChange]);

  // --- Compute active count ---
  const activeCount = useMemo(() => {
    if (externalActiveCount !== undefined) return externalActiveCount;
    let count = 0;
    filters.forEach((filter) => {
      const val = getFilterValue(filter);
      if (val !== null && val !== undefined && val !== '' && val !== false) {
        if (Array.isArray(val) && val.length > 0) count++;
        else if (!Array.isArray(val)) count++;
      }
    });
    return count;
  }, [filters, getFilterValue, externalActiveCount]);

  // --- Toggle expansion ---
  const toggleExpanded = useCallback(() => {
    setIsExpanded((prev) => !prev);
  }, []);

  // --- Focus first filter when expanded ---
  useEffect(() => {
    if (isExpanded && firstFilterRef.current) {
      const firstInput = firstFilterRef.current.querySelector(
        'input, [role="combobox"], button',
      ) as HTMLElement | null;
      if (
        firstInput &&
        'disabled' in firstInput &&
        !(firstInput as HTMLInputElement | HTMLButtonElement).disabled
      ) {
        setTimeout(() => firstInput.focus(), 50);
      }
    }
  }, [isExpanded]);

  // --- Live message ---
  const liveMessage = useMemo(() => {
    if (searchStatus === 'searching') return 'Searching...';
    if (searchStatus === 'complete') return 'Search complete';
    return '';
  }, [searchStatus]);

  // --- Helper renderers ---
  function renderTextFilter({
    id,
    label,
    value,
    onChange: onTextChange,
    placeholder,
    disabled: isDisabled,
  }: {
    id: string;
    label: string;
    value: string;
    onChange: (val: string) => void;
    placeholder?: string;
    disabled?: boolean;
  }) {
    const inputId = `filter-text-${id}`;
    return (
      <div className={styles.filterGroupContent}>
        <label htmlFor={inputId} className={styles.filterLabel}>
          {label}
        </label>
        <Input
          id={inputId}
          value={value || ''}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => onTextChange(e.target.value)}
          placeholder={placeholder || '...'}
          disabled={isDisabled}
          className={styles.filterInput}
          inputSize="sm"
        />
      </div>
    );
  }

  function renderSelectFilter({
    id,
    label,
    value,
    onChange: onSelectChange,
    options,
    placeholder,
    disabled: isDisabled,
  }: {
    id: string;
    label: string;
    value: string;
    onChange: (val: string) => void;
    options: FilterOption[];
    placeholder?: string;
    disabled?: boolean;
  }) {
    if (options.length === 0 && process.env.NODE_ENV === 'development') {
      console.warn(`FilterControls: Select filter "${id}" has no options.`);
    }
    return (
      <div className={styles.filterGroupContent}>
        <span className={styles.filterLabel}>{label}</span>
        <SelectDropdown
          value={value || ''}
          onChange={onSelectChange}
          options={options.map((opt) => ({ value: opt.value, label: opt.label }))}
          placeholder={placeholder || 'All'}
          disabled={isDisabled}
          size="sm"
          className={styles.filterSelect}
          clearable={false}
          labelHidden
        />
      </div>
    );
  }

  function renderCheckboxFilter({
    id,
    label,
    value,
    onChange: onCheckboxChange,
    options,
    disabled: isDisabled,
  }: {
    id: string;
    label: string;
    value: string[];
    onChange: (val: string[]) => void;
    options: FilterOption[];
    disabled?: boolean;
  }) {
    if (options.length === 0 && process.env.NODE_ENV === 'development') {
      console.warn(`FilterControls: Checkbox filter "${id}" has no options.`);
    }
    return (
      <div className={styles.filterGroupContent}>
        <span className={styles.filterLabel}>{label}</span>
        <div className={styles.checkboxGroup}>
          {options.map((opt) => {
            const checked = Array.isArray(value) && value.includes(opt.value);
            return (
              <Checkbox
                key={opt.value}
                label={opt.label}
                checked={checked}
                onChange={() => {
                  const current = Array.isArray(value) ? value : [];
                  const newValue = checked
                    ? current.filter((v) => v !== opt.value)
                    : [...current, opt.value];
                  onCheckboxChange(newValue);
                }}
                disabled={isDisabled}
                size="sm"
              />
            );
          })}
        </div>
      </div>
    );
  }

  function renderToggleFilter({
    label,
    value,
    onChange: onToggleChange,
    disabled: isDisabled,
  }: {
    id: string;
    label: string;
    value: boolean;
    onChange: (val: boolean) => void;
    disabled?: boolean;
  }) {
    return (
      <div className={styles.filterGroupContent}>
        <span className={styles.filterLabel}>{label}</span>
        <Switch
          checked={!!value}
          onChange={() => onToggleChange(!value)}
          disabled={isDisabled}
          size="sm"
          label={value ? 'Yes' : 'No'}
        />
      </div>
    );
  }

  function renderDateFilter({
    label,
    value,
    onChange: onDateChange,
    placeholder,
    disabled: isDisabled,
  }: {
    id: string;
    label: string;
    value: Date | null;
    onChange: (val: Date | null) => void;
    placeholder?: string;
    disabled?: boolean;
  }) {
    return (
      <div className={styles.filterGroupContent}>
        <span className={styles.filterLabel}>{label}</span>
        <DatePicker
          value={value || null}
          onChange={onDateChange}
          placeholder={placeholder || 'Date'}
          disabled={isDisabled}
          size="sm"
          clearable
          className={styles.filterDate}
        />
      </div>
    );
  }

  // --- Memoize filter controls with Option B horizontal layout ---
  const renderFilterControls = useMemo(() => {
    if (filters.length === 0) return null;

    const groups: React.ReactNode[] = [];

    filters.forEach((filter, index) => {
      const value = getFilterValue(filter);
      const isDisabled = disabled || filter.disabled;
      const filterId = filter.id;

      let control: React.ReactNode;

      if (filter.render) {
        control = filter.render({
          value,
          onChange: (val: FilterValue) => handleFilterChange(filterId, val),
          id: filterId,
          label: filter.label,
          options: filter.options,
          disabled: isDisabled,
        });
      } else {
        switch (filter.type) {
          case 'text':
            control = renderTextFilter({
              id: filterId,
              label: filter.label,
              value: value as string,
              onChange: (val) => handleFilterChange(filterId, val),
              placeholder: filter.placeholder,
              disabled: isDisabled,
            });
            break;
          case 'select':
            control = renderSelectFilter({
              id: filterId,
              label: filter.label,
              value: value as string,
              onChange: (val) => handleFilterChange(filterId, val),
              options: filter.options || [],
              placeholder: filter.placeholder,
              disabled: isDisabled,
            });
            break;
          case 'checkbox':
            control = renderCheckboxFilter({
              id: filterId,
              label: filter.label,
              value: value as string[],
              onChange: (val) => handleFilterChange(filterId, val),
              options: filter.options || [],
              disabled: isDisabled,
            });
            break;
          case 'toggle':
            control = renderToggleFilter({
              id: filterId,
              label: filter.label,
              value: value as boolean,
              onChange: (val) => handleFilterChange(filterId, val),
              disabled: isDisabled,
            });
            break;
          case 'date':
            control = renderDateFilter({
              id: filterId,
              label: filter.label,
              value: value as Date | null,
              onChange: (val) => handleFilterChange(filterId, val),
              placeholder: filter.placeholder,
              disabled: isDisabled,
            });
            break;
          default:
            if (process.env.NODE_ENV === 'development') {
              console.warn(`FilterControls: Unknown filter type "${filter.type}" for filter "${filterId}"`);
            }
            return null;
        }
      }

      const group = (
        <div key={filterId} className={styles.filterGroup} ref={index === 0 ? firstFilterRef : undefined}>
          {control}
        </div>
      );

      groups.push(group);

      if (index < filters.length - 1) {
        groups.push(
          <div key={`divider-${filterId}`} className={styles.divider} aria-hidden="true" />
        );
      }
    });

    return (
      <div className={styles.filtersRow} id={filtersRowId} role="group" aria-label="Filters">
        {groups}
      </div>
    );
  }, [filters, getFilterValue, disabled, handleFilterChange, filtersRowId]);

  return (
    <div ref={containerRef} className={clsx(styles.container, className)}>
      <div className={styles.topRow}>
        {showSearch && (
          <div className={styles.searchWrapper}>
            <SearchInput
              value={controlledSearchValue}
              onChange={handleSearchChange}
              placeholder={searchPlaceholder}
              loading={searchLoading}
              debounce={searchDebounce}
              disabled={disabled}
              size="sm"
              className={styles.searchInputComponent}
              aria-label="Search"
            />
          </div>
        )}
        <div className={styles.controlsRight}>
          {collapsible && (
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleExpanded}
              className={styles.toggleButton}
              leftIcon={<FaFilter />}
              aria-expanded={isExpanded}
              aria-controls={filtersRowId}
              disabled={disabled}
            >
              Filters
              {activeCount > 0 && (
                <Badge size="sm" variant="primary">
                  {activeCount}
                </Badge>
              )}
            </Button>
          )}
          {showClearAll && activeCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleClearAll}
              className={styles.clearButton}
              disabled={disabled}
            >
              Clear
            </Button>
          )}
        </div>
      </div>

      {(!collapsible || isExpanded) && renderFilterControls}

      <div id={liveRegionId} className={styles.liveRegion} aria-live="polite" aria-atomic="true">
        {liveMessage}
      </div>
    </div>
  );
};

FilterControlsComponent.displayName = 'FilterControls';

export const FilterControls = memo(FilterControlsComponent);
export default FilterControls;