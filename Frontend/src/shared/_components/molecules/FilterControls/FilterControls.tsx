import React, { useState, useCallback, useRef, useEffect, memo } from 'react';
import clsx from 'clsx';
import { FaSearch, FaTimes, FaFilter, FaSpinner } from 'react-icons/fa';
import { Typography } from '@/shared/_components/atoms/Typography';
import { Input } from '@/shared/_components/atoms/Input';
import { Button } from '@/shared/_components/atoms/Button';
import { Icon } from '@/shared/_components/atoms/Icon';
import { Badge } from '@/shared/_components/atoms/Badge';
import { Checkbox } from '@/shared/_components/atoms/Checkbox';
import { Switch } from '@/shared/_components/atoms/Switch';
import { DatePicker } from '@/shared/_components/molecules/DatePicker';
import { SelectDropdown } from '@/shared/_components/molecules/SelectDropdown';
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
  activeCount,
}) => {
  // Internal search value - always used for the input to ensure instant responsiveness
  const [internalSearchValue, setInternalSearchValue] = useState(
    controlledSearchValue ?? ''
  );
  const [isExpanded, setIsExpanded] = useState(!collapsible);
  const [internalValues, setInternalValues] = useState<FilterValuesState>(() => {
    const initial: FilterValuesState = {};
    filters.forEach((filter) => {
      if (filter.defaultValue !== undefined) {
        initial[filter.id] = filter.defaultValue;
      }
    });
    return initial;
  });

  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);
  const isInternalUpdateRef = useRef(false);

  // Sync internal value with controlled prop when it changes from outside
  useEffect(() => {
    if (
      controlledSearchValue !== undefined &&
      controlledSearchValue !== internalSearchValue &&
      !isInternalUpdateRef.current
    ) {
      setInternalSearchValue(controlledSearchValue);
    }
  }, [controlledSearchValue, internalSearchValue]);

  const isFilterControlled = (filter: FilterControl): boolean => {
    return filter.value !== undefined;
  };

  const getFilterValue = (filter: FilterControl): FilterValue => {
    if (isFilterControlled(filter)) {
      return filter.value ?? null;
    }
    return internalValues[filter.id] ?? filter.defaultValue ?? null;
  };

  const handleFilterChange = useCallback(
    (filterId: string, value: FilterValue) => {
      const filter = filters.find((f) => f.id === filterId);
      if (!filter) return;

      if (!isFilterControlled(filter)) {
        setInternalValues((prev) => ({ ...prev, [filterId]: value }));
      }

      const allValues: FilterValuesState = {};
      filters.forEach((f) => {
        if (f.id === filterId) {
          allValues[f.id] = value;
        } else if (isFilterControlled(f)) {
          allValues[f.id] = f.value ?? null;
        } else {
          allValues[f.id] = internalValues[f.id] ?? f.defaultValue ?? null;
        }
      });

      onChange(allValues);
    },
    [filters, internalValues, onChange]
  );

  // Search handlers - always update internal state immediately
  const handleSearchChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;

      // Update internal state immediately for responsive typing
      setInternalSearchValue(value);
      isInternalUpdateRef.current = true;

      // Debounce the external callback
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }

      debounceTimerRef.current = setTimeout(() => {
        onSearchChange?.(value);
        isInternalUpdateRef.current = false;
      }, searchDebounce);

      // If debounce is 0, call immediately
      if (searchDebounce === 0) {
        onSearchChange?.(value);
        isInternalUpdateRef.current = false;
      }
    },
    [onSearchChange, searchDebounce]
  );

  const handleSearchClear = useCallback(() => {
    // Clear internal state immediately
    setInternalSearchValue('');
    isInternalUpdateRef.current = true;

    // Notify parent
    onSearchChange?.('');

    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
      isInternalUpdateRef.current = false;
    }
  }, [onSearchChange]);

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
        setInternalValues((prev) => ({ ...prev, [filter.id]: emptyValue }));
      }
    });
    onChange(clearedValues);
    // Clear search as well
    handleSearchClear();
  }, [filters, onChange, handleSearchClear]);

  const getActiveCount = (): number => {
    if (activeCount !== undefined) return activeCount;

    let count = 0;
    filters.forEach((filter) => {
      const val = getFilterValue(filter);
      if (val !== null && val !== undefined && val !== '' && val !== false) {
        if (Array.isArray(val) && val.length > 0) count++;
        else if (!Array.isArray(val)) count++;
      }
    });
    return count;
  };

  const activeFilters = getActiveCount();

  const renderFilterControl = useCallback(
    (filter: FilterControl): React.ReactNode => {
      const value = getFilterValue(filter);
      const isDisabled = disabled || filter.disabled;

      if (filter.render) {
        return filter.render({
          value,
          onChange: (val: FilterValue) => handleFilterChange(filter.id, val),
          id: filter.id,
          label: filter.label,
          options: filter.options,
          disabled: isDisabled,
        });
      }

      switch (filter.type) {
        case 'text':
          return (
            <div className={styles.filterItem}>
              <Typography variant="small" color="secondary" className={styles.filterLabel}>
                {filter.label}
              </Typography>
              <Input
                id={filter.id}
                value={(value as string) || ''}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  handleFilterChange(filter.id, e.target.value)
                }
                placeholder={filter.placeholder || '...'}
                disabled={isDisabled}
                className={styles.filterInput}
                inputSize="sm"
              />
            </div>
          );

        case 'select':
          return (
            <div className={styles.filterItem}>
              <Typography variant="small" color="secondary" className={styles.filterLabel}>
                {filter.label}
              </Typography>
              <SelectDropdown
                value={(value as string) || ''}
                onChange={(val: string) => handleFilterChange(filter.id, val)}
                options={filter.options?.map((opt) => ({
                  value: opt.value,
                  label: opt.label,
                })) || []}
                placeholder={filter.placeholder || 'All'}
                disabled={isDisabled}
                size="sm"
                className={styles.filterSelect}
                clearable={false}
              />
            </div>
          );

        case 'checkbox':
          return (
            <div className={styles.filterItem}>
              <Typography variant="small" color="secondary" className={styles.filterLabel}>
                {filter.label}
              </Typography>
              <div className={styles.checkboxGroup}>
                {filter.options?.map((opt) => {
                  const selected = Array.isArray(value) && value.includes(opt.value);
                  return (
                    <Checkbox
                      key={opt.value}
                      label={opt.label}
                      checked={selected}
                      onChange={() => {
                        const current = Array.isArray(value) ? value : [];
                        const newValue = selected
                          ? current.filter((v) => v !== opt.value)
                          : [...current, opt.value];
                        handleFilterChange(filter.id, newValue);
                      }}
                      disabled={isDisabled}
                      size="sm"
                    />
                  );
                })}
              </div>
            </div>
          );

        case 'toggle':
          return (
            <div className={styles.filterItem}>
              <Typography variant="small" color="secondary" className={styles.filterLabel}>
                {filter.label}
              </Typography>
              <Switch
                checked={!!value}
                onChange={() => handleFilterChange(filter.id, !value)}
                disabled={isDisabled}
                size="sm"
                label={value ? 'Yes' : 'No'}
              />
            </div>
          );

        case 'date':
          return (
            <div className={styles.filterItem}>
              <Typography variant="small" color="secondary" className={styles.filterLabel}>
                {filter.label}
              </Typography>
              <DatePicker
                value={(value as Date) || null}
                onChange={(date: Date | null) => handleFilterChange(filter.id, date)}
                placeholder={filter.placeholder || 'Date'}
                disabled={isDisabled}
                size="sm"
                clearable
                className={styles.filterDate}
              />
            </div>
          );

        default:
          return null;
      }
    },
    [disabled, getFilterValue, handleFilterChange]
  );

  useEffect(() => {
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, []);

  const displaySearchValue = internalSearchValue;

  return (
    <div className={clsx(styles.container, className)}>
      <div className={styles.topRow}>
        {showSearch && (
          <div className={styles.searchWrapper}>
            <Icon size="sm" color="muted" className={styles.searchIcon} decorative>
              <FaSearch />
            </Icon>
            <input
              type="text"
              value={displaySearchValue}
              onChange={handleSearchChange}
              placeholder={searchPlaceholder}
              disabled={disabled}
              className={styles.searchInput}
            />
            {displaySearchValue && !disabled && (
              <button
                className={styles.searchClear}
                onClick={handleSearchClear}
                aria-label="Clear search"
                type="button"
              >
                <FaTimes />
              </button>
            )}
            {searchLoading && (
              <div className={styles.searchLoading}>
                <FaSpinner className={styles.spinner} />
              </div>
            )}
          </div>
        )}

        <div className={styles.controlsRight}>
          {collapsible && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsExpanded(!isExpanded)}
              className={styles.toggleButton}
              leftIcon={<FaFilter />}
            >
              Filters {activeFilters > 0 && <Badge size="sm" variant="primary">{activeFilters}</Badge>}
            </Button>
          )}
          {showClearAll && activeFilters > 0 && (
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

      {(!collapsible || isExpanded) && filters.length > 0 && (
        <div className={styles.filtersRow}>
          {filters.map((filter) => (
            <div key={filter.id} className={styles.filterWrapper}>
              {renderFilterControl(filter)}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// Memoize to prevent unnecessary re-renders
export const FilterControls = memo(FilterControlsComponent);

FilterControls.displayName = 'FilterControls';

export default FilterControls;