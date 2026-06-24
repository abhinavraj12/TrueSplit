import React, { useState, useRef, useEffect, useCallback, useId } from 'react';
import clsx from 'clsx';
import { FaChevronDown, FaCheck, FaSearch, FaTimes } from 'react-icons/fa';
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
  label?: React.ReactNode;
  value?: string;
  defaultValue?: string;
  options: SelectOption[];
  onChange?: (value: string) => void;
  placeholder?: string;
  error?: boolean | string;
  helperText?: React.ReactNode;
  required?: boolean;
  size?: SelectSize;
  searchable?: boolean;
  clearable?: boolean;
  disabled?: boolean;
  labelHidden?: boolean;
  className?: string;
}

export const SelectDropdown: React.FC<SelectDropdownProps> = ({
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
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [internalValue, setInternalValue] = useState(defaultValue);
  const [focusedIndex, setFocusedIndex] = useState(-1);
  const containerRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLUListElement>(null);

  const isControlled = controlledValue !== undefined;
  const currentValue = isControlled ? controlledValue : internalValue;
  const isError = Boolean(error);
  const errorMessage = typeof error === 'string' ? error : undefined;
  const generatedId = useId();
  const dropdownId = `select-${generatedId}`;
  const listId = `select-list-${generatedId}`;
  const errorId = `select-error-${generatedId}`;

  const selectedOption = options.find((opt) => opt.value === currentValue);
  const filteredOptions = searchable && searchTerm
    ? options.filter((opt) =>
        opt.label.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : options;

  // --- Move handleSelect and handleClear above the keyboard effect ---
  const handleSelect = useCallback(
    (val: string) => {
      if (!isControlled) {
        setInternalValue(val);
      }
      onChange?.(val);
      setIsOpen(false);
      setSearchTerm('');
      setFocusedIndex(-1);
    },
    [onChange, isControlled],
  );

  const handleClear = useCallback(() => {
    const emptyValue = '';
    if (!isControlled) {
      setInternalValue(emptyValue);
    }
    onChange?.(emptyValue);
    setSearchTerm('');
    setFocusedIndex(-1);
  }, [onChange, isControlled]);

  // --- Close dropdown on outside click ---
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
        setSearchTerm('');
        setFocusedIndex(-1);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // --- Keyboard navigation ---
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsOpen(false);
        setSearchTerm('');
        setFocusedIndex(-1);
        return;
      }

      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setFocusedIndex((prev) =>
          prev < filteredOptions.length - 1 ? prev + 1 : prev
        );
      }

      if (e.key === 'ArrowUp') {
        e.preventDefault();
        setFocusedIndex((prev) => (prev > 0 ? prev - 1 : -1));
      }

      if (e.key === 'Enter' && focusedIndex >= 0) {
        e.preventDefault();
        const selected = filteredOptions[focusedIndex];
        if (selected && !selected.disabled) {
          handleSelect(selected.value);
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, filteredOptions, focusedIndex, handleSelect]); // ✅ Added handleSelect

  // --- Scroll focused option into view ---
  useEffect(() => {
    if (focusedIndex >= 0 && listRef.current) {
      const items = listRef.current.querySelectorAll('li');
      if (items[focusedIndex]) {
        items[focusedIndex].scrollIntoView({ block: 'nearest' });
      }
    }
  }, [focusedIndex]);

  const handleToggle = useCallback(() => {
    if (disabled) return;
    setIsOpen((prev) => !prev);
    if (!isOpen && searchable) {
      setTimeout(() => searchInputRef.current?.focus(), 100);
    }
  }, [disabled, isOpen, searchable]);

  const handleSearchChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      setSearchTerm(value);
      setFocusedIndex(-1);
      if (value && !isOpen) {
        setIsOpen(true);
      }
    },
    [isOpen],
  );

  const handleSearchClear = useCallback(() => {
    setSearchTerm('');
    setFocusedIndex(-1);
    searchInputRef.current?.focus();
  }, []);

  const displayValue = selectedOption?.label || placeholder;

  return (
    <div
      ref={containerRef}
      className={clsx(
        styles.dropdown,
        styles[`size-${size}`],
        isError && styles.error,
        disabled && styles.disabled,
        className,
      )}
    >
      {label && (
        <label
          htmlFor={dropdownId}
          className={clsx(styles.label, labelHidden && styles.labelHidden)}
        >
          {label}
          {required && <span className={styles.required}>*</span>}
        </label>
      )}

      <div className={styles.triggerWrapper}>
        <div
          id={dropdownId}
          className={clsx(
            styles.trigger,
            isOpen && styles.open,
            isError && styles.triggerError,
            disabled && styles.triggerDisabled,
          )}
          onClick={handleToggle}
          role="combobox"
          aria-expanded={isOpen}
          aria-controls={listId}
          aria-haspopup="listbox"
          aria-disabled={disabled}
          aria-invalid={isError}
          aria-describedby={isError && errorMessage ? errorId : undefined}
          tabIndex={disabled ? -1 : 0}
        >
          <span className={clsx(styles.value, !selectedOption && styles.placeholder)}>
            {selectedOption?.icon && (
              <span className={styles.optionIcon}>{selectedOption.icon}</span>
            )}
            {displayValue}
          </span>

          <div className={styles.actions}>
            {clearable && currentValue && !disabled && (
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
              >
                <FaTimes />
              </Button>
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

        {isOpen && !disabled && (
          <div className={styles.dropdownPanel}>
            {searchable && (
              <div className={styles.searchWrapper}>
                <Input
                  ref={searchInputRef}
                  value={searchTerm}
                  onChange={handleSearchChange}
                  placeholder="Search options..."
                  className={styles.searchInput}
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
                <li className={styles.noOptions}>No options found</li>
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
                        option.disabled && styles.optionDisabled,
                      )}
                      onClick={() => {
                        if (!option.disabled) {
                          handleSelect(option.value);
                        }
                      }}
                      role="option"
                      aria-selected={isSelected}
                      aria-disabled={option.disabled}
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
        <div className={styles.helperText}>{helperText}</div>
      )}
    </div>
  );
};

SelectDropdown.displayName = 'SelectDropdown';

export default SelectDropdown;