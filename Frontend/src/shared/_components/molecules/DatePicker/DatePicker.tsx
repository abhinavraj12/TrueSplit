import React, { useState, useRef, useEffect, useCallback, useId } from 'react';
import clsx from 'clsx';
import { FaCalendarAlt, FaChevronLeft, FaChevronRight, FaTimes } from 'react-icons/fa';
import { Input } from '@/shared/_components/atoms/Input';
import { Typography } from '@/shared/_components/atoms/Typography';
import { Button } from '@/shared/_components/atoms/Button';
import { Icon } from '@/shared/_components/atoms/Icon';
import { DatePickerCalendar, HighlightedDate } from './DatePickerCalendar';
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

const formatDate = (date: Date | null, format: string): string => {
  if (!date) return '';
  const map: Record<string, string> = {
    'MMM dd, yyyy': 'MMM dd, yyyy',
    'dd/MM/yyyy': 'dd/MM/yyyy',
    'MM/dd/yyyy': 'MM/dd/yyyy',
    'yyyy-MM-dd': 'yyyy-MM-dd',
  };
  const pattern = map[format] || 'MMM dd, yyyy';
  const options: Intl.DateTimeFormatOptions = {
    month: 'short',
    day: '2-digit',
    year: 'numeric',
  };
  if (pattern.includes('dd/MM')) {
    return date.toLocaleDateString('en-GB', options);
  }
  if (pattern === 'yyyy-MM-dd') {
    return date.toISOString().split('T')[0];
  }
  return date.toLocaleDateString('en-US', options);
};

export const DatePicker: React.FC<DatePickerProps> = ({
  label,
  value: controlledValue,
  defaultValue = null,
  onChange,
  format = 'MMM dd, yyyy',
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
  disabledDates,
  highlightedDates,
  ...restProps
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [internalValue, setInternalValue] = useState<Date | null>(defaultValue || null);
  const [viewDate, setViewDate] = useState<Date>(
    internalValue || new Date()
  );
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const isInternalChangeRef = useRef(false);

  const isControlled = controlledValue !== undefined;
  const currentValue = isControlled ? controlledValue : internalValue;
  const isError = Boolean(error);
  const errorMessage = typeof error === 'string' ? error : undefined;
  const generatedId = useId();
  const inputId = `datepicker-${generatedId}`;
  const errorId = `datepicker-error-${generatedId}`;

  // Close popover on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Sync viewDate with currentValue only when it comes from external source
  useEffect(() => {
    if (isControlled && !isInternalChangeRef.current) {
      setViewDate(currentValue || new Date());
    }
    isInternalChangeRef.current = false;
  }, [isControlled, currentValue]);

  const handleSelect = useCallback(
    (date: Date | null) => {
      isInternalChangeRef.current = true;
      if (!isControlled) {
        setInternalValue(date);
      }
      onChange?.(date);
      setIsOpen(false);
      if (inputRef.current) {
        inputRef.current.focus();
      }
    },
    [onChange, isControlled],
  );

  const handleClear = useCallback(() => {
    handleSelect(null);
  }, [handleSelect]);

  const handleToggle = useCallback(() => {
    if (disabled) return;
    setIsOpen((prev) => !prev);
  }, [disabled]);

  const handleViewDateChange = useCallback((date: Date) => {
    isInternalChangeRef.current = true;
    setViewDate(date);
  }, []);

  const displayedValue = currentValue ? formatDate(currentValue, format) : '';

  return (
    <div
      ref={containerRef}
      className={clsx(
        styles.container,
        styles[`size-${size}`],
        disabled && styles.disabled,
        className,
      )}
    >
      {label && (
        <label
          htmlFor={inputId}
          className={clsx(styles.label, labelHidden && styles.labelHidden)}
        >
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
          className={clsx(
            styles.input,
            isError && styles.inputError,
          )}
          inputSize={size}
          fullWidth
          autoFocus={autoFocus}
          readOnly
          onClick={handleToggle}
          {...restProps}
        />

        <div className={styles.icons}>
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
              aria-label="Clear date"
            >
              <FaTimes />
            </Button>
          )}
          <Icon
            size="sm"
            color={isError ? 'error' : 'muted'}
            className={styles.calendarIcon}
            decorative
            onClick={handleToggle}
          >
            <FaCalendarAlt />
          </Icon>
        </div>
      </div>

      {isOpen && !disabled && (
        <div className={styles.popover}>
          <DatePickerCalendar
            selectedDate={currentValue}
            viewDate={viewDate}
            onViewDateChange={handleViewDateChange}
            onSelect={handleSelect}
            minDate={minDate}
            maxDate={maxDate}
            disabledDates={disabledDates}
            highlightedDates={highlightedDates}
          />
        </div>
      )}

      {isError && errorMessage && (
        <Typography
          variant="small"
          color="error"
          id={errorId}
          className={styles.errorText}
          role="alert"
        >
          {errorMessage}
        </Typography>
      )}

      {helperText && !isError && (
        <Typography
          variant="small"
          color="muted"
          className={styles.helperText}
        >
          {helperText}
        </Typography>
      )}
    </div>
  );
};

DatePicker.displayName = 'DatePicker';

export default DatePicker;