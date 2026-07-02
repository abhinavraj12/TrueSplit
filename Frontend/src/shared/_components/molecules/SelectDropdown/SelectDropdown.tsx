import React, {
  useState,
  useRef,
  useEffect,
  useCallback,
  useId,
  useMemo,
  memo,
} from 'react';
import clsx from 'clsx';
import { FaChevronDown, FaCheck, FaSearch, FaTimes, FaSpinner } from 'react-icons/fa';
import { Input } from '@/shared/_components/atoms/Input';
import { Icon } from '@/shared/_components/atoms/Icon';
import { Button } from '@/shared/_components/atoms/Button';
import styles from './SelectDropdown.module.css';

export type SelectSize = 'sm' | 'md' | 'lg';

export interface SelectOption {
  value: string;
  label: string;
  icon?: React.ReactNode;
  disabled?: boolean;
}

export interface SelectDropdownProps {
  /** Optional label above the dropdown */
  label?: React.ReactNode;
  /** Controlled selected value */
  value?: string;
  /** Uncontrolled default value */
  defaultValue?: string;
  /** Array of options (required) */
  options: SelectOption[];
  /** Callback when selection changes */
  onChange?: (value: string) => void;
  /** Placeholder text (default: 'Select an option...') */
  placeholder?: string;
  /** Error state (boolean or error message) */
  error?: boolean | string;
  /** Helper text displayed below */
  helperText?: React.ReactNode;
  /** Marks the field as required (prevents clearing) */
  required?: boolean;
  /** Size variant (default: 'md') */
  size?: SelectSize;
  /** Enables search/filtering (default: false) */
  searchable?: boolean;
  /** Shows a clear button when a value is selected (default: false) */
  clearable?: boolean;
  /** Disables the dropdown */
  disabled?: boolean;
  /** Visually hides the label but keeps it accessible */
  labelHidden?: boolean;
  /** Additional CSS class */
  className?: string;
  /** Custom accessible label for the dropdown (overrides label) */
  ariaLabel?: string;
  /** Loading state (shows spinner inside trigger) */
  loading?: boolean;
  /** Custom empty state message (default: 'No options found') */
  emptyState?: React.ReactNode;
  /** Callback when dropdown opens */
  onOpen?: () => void;
  /** Callback when dropdown closes */
  onClose?: () => void;
  /** Show option count badge near the label (default: false) */
  showOptionCount?: boolean;
}

const SelectDropdownComponent: React.FC<SelectDropdownProps> = ({
  label,
  value: controlledValue,
  defaultValue = '',
  options,
  onChange,
  placeholder = 'Select an option...',
  error = false,
  helperText,
  required = false,
  size = 'md',
  searchable = false,
  clearable = false,
  disabled = false,
  labelHidden = false,
  className,
  ariaLabel,
  loading = false,
  emptyState = 'No options found',
  onOpen,
  onClose,
  showOptionCount = false,
}) => {
  // --- IDs for accessibility ---
  const generatedId = useId();
  const dropdownId = `select-${generatedId}`;
  const listId = `select-list-${generatedId}`;
  const errorId = `select-error-${generatedId}`;
  const helperId = `select-helper-${generatedId}`;
  const liveRegionId = `select-live-${generatedId}`;

  // --- State ---
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [internalValue, setInternalValue] = useState(defaultValue);
  const [focusedIndex, setFocusedIndex] = useState(-1);
  const [dropdownPosition, setDropdownPosition] = useState<'bottom' | 'top'>('bottom');

  // --- Refs ---
  const containerRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const triggerRef = useRef<HTMLDivElement>(null);

  // --- Determine controlled ---
  const isControlled = controlledValue !== undefined;
  const currentValue = isControlled ? controlledValue : internalValue;

  // --- Memoize filtered options (handles performance) ---
  const filteredOptions = useMemo(() => {
    if (!searchable || !searchTerm) return options;
    const lower = searchTerm.toLowerCase();
    return options.filter((opt) =>
      opt.label.toLowerCase().includes(lower)
    );
  }, [options, searchable, searchTerm]);

  // --- Selected option ---
  const selectedOption = useMemo(
    () => options.find((opt) => opt.value === currentValue),
    [options, currentValue]
  );

  // --- Derived state ---
  const isError = Boolean(error);
  const errorMessage = typeof error === 'string' ? error : undefined;
  const hasLiveRegion = searchable && isOpen;

  // --- Handlers ---
  const handleSelect = useCallback(
    (val: string) => {
      if (!isControlled) setInternalValue(val);
      onChange?.(val);
      setIsOpen(false);
      setSearchTerm('');
      setFocusedIndex(-1);
      onClose?.();
      triggerRef.current?.focus();
    },
    [onChange, isControlled, onClose]
  );

  const handleClear = useCallback(() => {
    if (required) return;
    const emptyValue = '';
    if (!isControlled) setInternalValue(emptyValue);
    onChange?.(emptyValue);
    setSearchTerm('');
    setFocusedIndex(-1);
    triggerRef.current?.focus();
  }, [onChange, isControlled, required]);

  const handleToggle = useCallback(() => {
    if (disabled || loading) return;
    const newState = !isOpen;
    setIsOpen(newState);
    if (newState) {
      onOpen?.();
      setTimeout(() => {
        if (searchable && searchInputRef.current) {
          searchInputRef.current.focus();
          setSearchTerm('');
        } else if (listRef.current) {
          const firstOption = listRef.current.querySelector(
            'li[role="option"]:not([aria-disabled="true"])'
          ) as HTMLElement;
          if (firstOption) firstOption.focus();
        }
      }, 50);
    } else {
      onClose?.();
      setSearchTerm('');
      setFocusedIndex(-1);
    }
  }, [isOpen, disabled, loading, searchable, onOpen, onClose]);

  const handleSearchChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      setSearchTerm(value);
      setFocusedIndex(-1);
    },
    []
  );

  const handleSearchClear = useCallback(() => {
    setSearchTerm('');
    searchInputRef.current?.focus();
  }, []);

  // --- Click outside ---
  useEffect(() => {
    if (!isOpen) return;
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
        setSearchTerm('');
        setFocusedIndex(-1);
        onClose?.();
        triggerRef.current?.focus();
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen, onClose]);

  // --- Positioning ---
  useEffect(() => {
    if (!isOpen) return;
    const updatePosition = () => {
      if (!triggerRef.current) return;
      const rect = triggerRef.current.getBoundingClientRect();
      const dropdownHeight = 260;
      const spaceBelow = window.innerHeight - rect.bottom;
      const spaceAbove = rect.top;
      setDropdownPosition(spaceBelow < dropdownHeight && spaceAbove > spaceBelow ? 'top' : 'bottom');
    };
    updatePosition();
    window.addEventListener('resize', updatePosition);
    return () => window.removeEventListener('resize', updatePosition);
  }, [isOpen]);

  // --- Keyboard navigation ---
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsOpen(false);
        setSearchTerm('');
        setFocusedIndex(-1);
        onClose?.();
        triggerRef.current?.focus();
        return;
      }

      const activeElement = document.activeElement;
      const isSearchFocused = searchInputRef.current === activeElement;

      if (e.key === 'ArrowDown') {
        e.preventDefault();
        if (isSearchFocused) {
          const firstOption = listRef.current?.querySelector(
            'li[role="option"]:not([aria-disabled="true"])'
          ) as HTMLElement;
          if (firstOption) { firstOption.focus(); setFocusedIndex(0); }
        } else {
          const newIndex = Math.min(focusedIndex + 1, filteredOptions.length - 1);
          setFocusedIndex(newIndex);
          const optionEl = listRef.current?.children[newIndex] as HTMLElement;
          if (optionEl) optionEl.focus();
        }
      }

      if (e.key === 'ArrowUp') {
        e.preventDefault();
        if (isSearchFocused) {
          const lastIndex = filteredOptions.length - 1;
          const lastOption = listRef.current?.children[lastIndex] as HTMLElement;
          if (lastOption) { lastOption.focus(); setFocusedIndex(lastIndex); }
        } else {
          const newIndex = Math.max(focusedIndex - 1, 0);
          setFocusedIndex(newIndex);
          const optionEl = listRef.current?.children[newIndex] as HTMLElement;
          if (optionEl) optionEl.focus();
        }
      }

      if (e.key === 'Enter' && focusedIndex >= 0) {
        e.preventDefault();
        const option = filteredOptions[focusedIndex];
        if (option && !option.disabled) handleSelect(option.value);
      }

      if (e.key === 'Home') {
        e.preventDefault();
        setFocusedIndex(0);
        const optionEl = listRef.current?.children[0] as HTMLElement;
        if (optionEl) optionEl.focus();
      }
      if (e.key === 'End') {
        e.preventDefault();
        const lastIndex = filteredOptions.length - 1;
        setFocusedIndex(lastIndex);
        const optionEl = listRef.current?.children[lastIndex] as HTMLElement;
        if (optionEl) optionEl.focus();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, filteredOptions, focusedIndex, handleSelect, onClose]);

  // --- aria-describedby ---
  const describedBy = clsx(
    isError && errorId,
    helperText && !isError && helperId
  ) || undefined;

  // --- Display value ---
  const displayValue = selectedOption?.label || placeholder;

  // --- Clearable logic ---
  const showClearButton = clearable && currentValue && !disabled && !required;

  // --- Option count ---
  const optionCount = options.length;

  // --- Live region message ---
  const liveMessage = useMemo(() => {
    if (isOpen && searchable) {
      const count = filteredOptions.length;
      if (count === 0) return 'No options found';
      return `${count} option${count > 1 ? 's' : ''} available`;
    }
    return '';
  }, [isOpen, searchable, filteredOptions.length]);

  return (
    <div
      ref={containerRef}
      className={clsx(
        styles.dropdown,
        styles[`size-${size}`],
        isError && styles.error,
        disabled && styles.disabled,
        className
      )}
    >
      {label && (
        <label
          htmlFor={dropdownId}
          className={clsx(styles.label, labelHidden && styles.labelHidden)}
        >
          {label}
          {required && <span className={styles.required}>*</span>}
          {showOptionCount && (
            <span className={styles.countBadge} aria-hidden="true">
              {optionCount}
            </span>
          )}
        </label>
      )}

      <div className={styles.triggerWrapper}>
        <div
          ref={triggerRef}
          id={dropdownId}
          className={clsx(
            styles.trigger,
            isOpen && styles.open,
            isError && styles.triggerError,
            disabled && styles.triggerDisabled,
            loading && styles.triggerLoading
          )}
          onClick={handleToggle}
          role="combobox"
          aria-expanded={isOpen}
          aria-controls={listId}
          aria-haspopup="listbox"
          aria-disabled={disabled || loading}
          aria-invalid={isError || undefined}
          aria-describedby={describedBy}
          aria-required={required || undefined}
          aria-label={ariaLabel || (typeof label === 'string' ? label : undefined)}
          tabIndex={disabled || loading ? -1 : 0}
        >
          <span className={clsx(styles.value, !selectedOption && styles.placeholder)}>
            {selectedOption?.icon && (
              <span className={styles.optionIcon}>{selectedOption.icon}</span>
            )}
            {displayValue}
          </span>

          <div className={styles.actions}>
            {showClearButton && (
              <Button
                iconOnly
                variant="ghost"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  handleClear();
                }}
                className={styles.clearButton}
                aria-label="Clear selection"
                type="button"
              >
                <FaTimes />
              </Button>
            )}
            {loading && (
              <Icon size="sm" color="muted" className={styles.loadingIcon} decorative>
                <FaSpinner className={styles.spinner} />
              </Icon>
            )}
            <Icon
              size="sm"
              color="muted"
              className={clsx(styles.chevron, isOpen && styles.chevronOpen)}
              decorative
            >
              <FaChevronDown />
            </Icon>
          </div>
        </div>

        {hasLiveRegion && (
          <div id={liveRegionId} className={styles.liveRegion} aria-live="polite" aria-atomic="true">
            {liveMessage}
          </div>
        )}

        {isOpen && !disabled && !loading && (
          <div
            className={clsx(
              styles.dropdownPanel,
              styles[`dropdown-${dropdownPosition}`]
            )}
          >
            {searchable && (
              <div className={styles.searchWrapper}>
                <Input
                  ref={searchInputRef}
                  value={searchTerm}
                  onChange={handleSearchChange}
                  placeholder="Search options..."
                  className={styles.searchInput}
                  inputSize={size}
                  leftAdornment={
                    <Icon size="sm" color="muted" decorative>
                      <FaSearch />
                    </Icon>
                  }
                  rightAdornment={
                    searchTerm && (
                      <Button
                        iconOnly
                        variant="ghost"
                        size="sm"
                        onClick={handleSearchClear}
                        aria-label="Clear search"
                      >
                        <FaTimes />
                      </Button>
                    )
                  }
                />
              </div>
            )}

            <ul
              ref={listRef}
              id={listId}
              className={styles.optionsList}
              role="listbox"
              aria-label="Options"
            >
              {filteredOptions.length === 0 ? (
                <li className={styles.noOptions}>{emptyState}</li>
              ) : (
                filteredOptions.map((option, index) => {
                  const isSelected = option.value === currentValue;
                  const isFocused = index === focusedIndex;

                  return (
                    <li
                      key={option.value}
                      className={clsx(
                        styles.option,
                        isSelected && styles.optionSelected,
                        isFocused && styles.optionFocused,
                        option.disabled && styles.optionDisabled
                      )}
                      onClick={() => {
                        if (!option.disabled) handleSelect(option.value);
                      }}
                      role="option"
                      aria-selected={isSelected}
                      aria-disabled={option.disabled}
                      tabIndex={isFocused ? 0 : -1}
                      onMouseEnter={() => setFocusedIndex(index)}
                    >
                      <span className={styles.optionContent}>
                        {option.icon && (
                          <span className={styles.optionIcon}>{option.icon}</span>
                        )}
                        <span className={styles.optionLabel}>{option.label}</span>
                      </span>
                      {isSelected && (
                        <Icon size="sm" color="success" decorative>
                          <FaCheck />
                        </Icon>
                      )}
                    </li>
                  );
                })
              )}
            </ul>
          </div>
        )}
      </div>

      {isError && errorMessage && (
        <div className={styles.errorText} id={errorId} role="alert">
          {errorMessage}
        </div>
      )}

      {helperText && !isError && (
        <div className={styles.helperText} id={helperId}>
          {helperText}
        </div>
      )}
    </div>
  );
};

SelectDropdownComponent.displayName = 'SelectDropdown';

export const SelectDropdown = memo(SelectDropdownComponent);
export default SelectDropdown;