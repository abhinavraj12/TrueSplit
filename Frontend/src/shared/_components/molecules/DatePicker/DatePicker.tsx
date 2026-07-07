import React, { useState, useRef, useEffect, useCallback, useId, memo } from 'react';
import clsx from 'clsx';
import { FaCalendarAlt, FaTimes } from 'react-icons/fa';
import { Input } from '@/shared/_components/atoms/Input';
import { Typography } from '@/shared/_components/atoms/Typography';
import { Button } from '@/shared/_components/atoms/Button';
import { Icon } from '@/shared/_components/atoms/Icon';
import { DatePickerCalendar, HighlightedDate } from './DatePickerCalendar';
import { isSameDay } from '@/shared/lib/utils/date-utils';
import styles from './DatePicker.module.css';

export type DatePickerSize = 'sm' | 'md' | 'lg';

export interface DatePickerProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size' | 'onChange' | 'value' | 'defaultValue'> {
  label?: React.ReactNode;
  value?: Date | null;
  defaultValue?: Date | null;
  onChange?: (date: Date | null) => void;
  format?: string;
  placeholder?: string;
  minDate?: Date;
  maxDate?: Date;
  size?: DatePickerSize;
  error?: boolean | string;
  helperText?: React.ReactNode;
  required?: boolean;
  labelHidden?: boolean;
  className?: string;
  clearable?: boolean;
  disabled?: boolean;
  autoFocus?: boolean;
  disabledDates?: Date[];
  highlightedDates?: (Date | HighlightedDate)[];
}

/**
 * Format a date using Intl.DateTimeFormat for reliable, human-friendly output.
 * Supports standard format strings: 'MMM d, yyyy, h:mm a' -> 'Jul 7, 2026, 3:50 PM'
 */
const formatDateDisplay = (date: Date | null, format: string): string => {
  if (!date) return '';

  // Map format strings to Intl.DateTimeFormat options
  const formatMap: Record<string, Intl.DateTimeFormatOptions> = {
    'MMM d, yyyy, h:mm a': {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
    },
    'MMM d, yyyy': {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    },
    'MMMM d, yyyy': {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    },
    'MM/dd/yyyy': {
      month: '2-digit',
      day: '2-digit',
      year: 'numeric',
    },
    'yyyy-MM-dd': {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    },
    'MMM dd, yyyy': {
      month: 'short',
      day: '2-digit',
      year: 'numeric',
    },
    'dd MMM yyyy': {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    },
  };

  // If the format matches a known pattern, use Intl
  if (formatMap[format]) {
    return new Intl.DateTimeFormat('en-US', formatMap[format]).format(date);
  }

  // Fallback: use a reasonable default
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  }).format(date);
};

const DatePickerComponent: React.FC<DatePickerProps> = ({
  label,
  value: controlledValue,
  defaultValue = null,
  onChange,
  format = 'MMM d, yyyy, h:mm a',
  placeholder = 'Select date...',
  minDate,
  maxDate,
  size = 'md',
  error = false,
  helperText,
  required = false,
  labelHidden = false,
  className,
  clearable = false,
  disabled = false,
  autoFocus = false,
  disabledDates = [],
  highlightedDates = [],
  ...restProps
}) => {
  // IDs
  const generatedId = useId();
  const inputId = `datepicker-${generatedId}`;
  const errorId = `datepicker-error-${generatedId}`;
  const helperId = `datepicker-helper-${generatedId}`;

  // State
  const [isOpen, setIsOpen] = useState(false);
  const [internalValue, setInternalValue] = useState<Date | null>(defaultValue);
  const [viewDate, setViewDate] = useState<Date>(() => {
    const date = internalValue || new Date();
    date.setHours(0, 0, 0, 0);
    return date;
  });

  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const prevControlledValueRef = useRef<Date | null | undefined>(controlledValue);

  const isControlled = controlledValue !== undefined;
  const currentValue = isControlled ? controlledValue : internalValue;

  // Sync viewDate when controlled value changes externally
  useEffect(() => {
    if (isControlled && !isSameDay(controlledValue || new Date(0), prevControlledValueRef.current || new Date(0))) {
      const newView = controlledValue ? new Date(controlledValue) : new Date();
      newView.setHours(0, 0, 0, 0);
      setViewDate(newView);
      prevControlledValueRef.current = controlledValue;
    }
  }, [isControlled, controlledValue]);

  // Validate minDate > maxDate in development
  useEffect(() => {
    if (process.env.NODE_ENV === 'development' && minDate && maxDate && minDate > maxDate) {
      console.warn('DatePicker: minDate is greater than maxDate. This will cause no dates to be selectable.');
    }
  }, [minDate, maxDate]);

  const handleSelect = useCallback(
    (date: Date | null) => {
      if (!isControlled) setInternalValue(date);
      onChange?.(date);
      setIsOpen(false);
      setTimeout(() => inputRef.current?.focus(), 0);
    },
    [onChange, isControlled]
  );

  const handleClear = useCallback(() => {
    handleSelect(null);
    inputRef.current?.focus();
  }, [handleSelect]);

  const handleToggle = useCallback(() => {
    if (disabled) return;
    setIsOpen((prev) => !prev);
    if (!isOpen) {
      const base = currentValue || new Date();
      const newView = new Date(base);
      newView.setHours(0, 0, 0, 0);
      setViewDate(newView);
    }
  }, [disabled, isOpen, currentValue]);

  // Close popover on outside click
  useEffect(() => {
    if (!isOpen) return;
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  // Escape key
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsOpen(false);
        inputRef.current?.focus();
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  // Popover positioning
  const [popoverPosition, setPopoverPosition] = useState<'bottom' | 'top'>('bottom');
  const popoverRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) return;
    const updatePosition = () => {
      if (!containerRef.current || !popoverRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const popoverHeight = popoverRef.current.offsetHeight || 300;
      const spaceBelow = window.innerHeight - rect.bottom;
      const spaceAbove = rect.top;
      if (spaceBelow < popoverHeight && spaceAbove > spaceBelow) {
        setPopoverPosition('top');
      } else {
        setPopoverPosition('bottom');
      }
    };
    requestAnimationFrame(updatePosition);
    window.addEventListener('resize', updatePosition);
    return () => window.removeEventListener('resize', updatePosition);
  }, [isOpen]);

  // Use the new formatDateDisplay function
  const displayedValue = currentValue ? formatDateDisplay(currentValue, format) : '';
  const isError = Boolean(error);
  const errorMessage = typeof error === 'string' ? error : undefined;
  const describedBy = clsx(isError && errorId, helperText && !isError && helperId) || undefined;

  // Handle keyboard on calendar icon wrapper
  const handleCalendarKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLDivElement>) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        handleToggle();
      }
    },
    [handleToggle]
  );

  return (
    <div ref={containerRef} className={clsx(styles.container, styles[`size-${size}`], disabled && styles.disabled, className)}>
      {label && (
        <label htmlFor={inputId} className={clsx(styles.label, labelHidden && styles.labelHidden)}>
          {label}
          {required && <span className={styles.required}>*</span>}
        </label>
      )}

      <div className={styles.inputWrapper}>
        <Input
          ref={inputRef}
          id={inputId}
          type="text"
          value={displayedValue}
          placeholder={placeholder}
          disabled={disabled}
          className={clsx(styles.input, isError && styles.inputError)}
          inputSize={size}
          fullWidth
          autoFocus={autoFocus}
          readOnly
          onClick={handleToggle}
          aria-invalid={isError || undefined}
          aria-describedby={describedBy}
          aria-required={required || undefined}
          {...restProps}
        />

        <div className={styles.icons}>
          {clearable && currentValue && !disabled && (
            <Button
              iconOnly
              variant="ghost"
              size="sm"
              onClick={(e) => { e.stopPropagation(); handleClear(); }}
              className={styles.clearButton}
              aria-label="Clear date"
            >
              <FaTimes />
            </Button>
          )}
          {/* Calendar icon */}
          <div
            className={clsx(styles.calendarIcon, isError && styles.calendarIconError)}
            onClick={handleToggle}
            onKeyDown={handleCalendarKeyDown}
            role="button"
            tabIndex={disabled ? -1 : 0}
            aria-label="Open calendar"
            aria-disabled={disabled}
            aria-expanded={isOpen}
          >
            <Icon size="sm" color={isError ? 'error' : 'muted'} decorative>
              <FaCalendarAlt />
            </Icon>
          </div>
        </div>
      </div>

      {isOpen && !disabled && (
        <div
          ref={popoverRef}
          className={clsx(styles.popover, styles[`popover-${popoverPosition}`])}
          role="dialog"
          aria-label="Select a date"
        >
          <DatePickerCalendar
            selectedDate={currentValue}
            viewDate={viewDate}
            onViewDateChange={setViewDate}
            onSelect={handleSelect}
            minDate={minDate}
            maxDate={maxDate}
            disabledDates={disabledDates}
            highlightedDates={highlightedDates}
            clearable={clearable}
            onClear={handleClear}
          />
        </div>
      )}

      {isError && errorMessage && (
        <Typography variant="small" color="error" id={errorId} className={styles.errorText} role="alert">
          {errorMessage}
        </Typography>
      )}

      {helperText && !isError && (
        <Typography variant="small" color="muted" id={helperId} className={styles.helperText}>
          {helperText}
        </Typography>
      )}
    </div>
  );
};

DatePickerComponent.displayName = 'DatePicker';
export const DatePicker = memo(DatePickerComponent);
export default DatePicker;