import React, { useMemo, useCallback, memo, useState } from 'react';
import clsx from 'clsx';
import {
  FaChevronLeft,
  FaChevronRight,
  FaChevronDown,
  FaAngleDoubleLeft,
  FaAngleDoubleRight,
} from 'react-icons/fa';
import { Typography } from '@/shared/_components/atoms/Typography';
import { Icon } from '@/shared/_components/atoms/Icon';
import { Button } from '@/shared/_components/atoms/Button';
import {
  generateCalendar,
  getYearRange,
  isSameDay,
  isDateDisabled as isDateDisabledUtil,
} from '@/shared/utils/date-utils';
import styles from './DatePicker.module.css';

export type HighlightStatus = 'success' | 'warning' | 'danger' | 'pending' | 'info';

export interface HighlightedDate {
  date: Date;
  status: HighlightStatus;
}

export interface DatePickerCalendarProps {
  selectedDate: Date | null;
  viewDate: Date;
  onViewDateChange: (date: Date) => void;
  onSelect: (date: Date | null) => void;
  minDate?: Date | null;
  maxDate?: Date | null;
  disabledDates?: Date[];
  highlightedDates?: (Date | HighlightedDate)[];
  clearable?: boolean;
  onClear?: () => void;
}

const weekDays = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

const DatePickerCalendarComponent: React.FC<DatePickerCalendarProps> = ({
  selectedDate,
  viewDate,
  onViewDateChange,
  onSelect,
  minDate = null,
  maxDate = null,
  disabledDates = [],
  highlightedDates = [],
  clearable = false,
  onClear,
}) => {
  const year = viewDate.getFullYear();
  const month = viewDate.getMonth();
  const [showYearDropdown, setShowYearDropdown] = useState(false);

  const days = useMemo(() => generateCalendar(year, month), [year, month]);
  const yearRange = useMemo(() => getYearRange(year, 25), [year]);

  const highlightedMap = useMemo(() => {
    const map = new Map<string, HighlightStatus>();
    highlightedDates.forEach((item) => {
      const date = item instanceof Date ? item : item.date;
      const status = item instanceof Date ? 'info' : item.status;
      const key = `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;
      map.set(key, status);
    });
    return map;
  }, [highlightedDates]);

  const handlePrevMonth = useCallback(() => {
    onViewDateChange(new Date(year, month - 1, 1));
  }, [year, month, onViewDateChange]);

  const handleNextMonth = useCallback(() => {
    onViewDateChange(new Date(year, month + 1, 1));
  }, [year, month, onViewDateChange]);

  const handlePrevYear = useCallback(() => {
    onViewDateChange(new Date(year - 1, month, 1));
  }, [year, month, onViewDateChange]);

  const handleNextYear = useCallback(() => {
    onViewDateChange(new Date(year + 1, month, 1));
  }, [year, month, onViewDateChange]);

  const handleYearSelect = useCallback(
    (selectedYear: number) => {
      onViewDateChange(new Date(selectedYear, month, 1));
      setShowYearDropdown(false);
    },
    [month, onViewDateChange]
  );

  const handleToday = useCallback(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    onViewDateChange(today);
    onSelect(today);
  }, [onViewDateChange, onSelect]);

  const handleDayClick = useCallback(
    (date: Date) => {
      const disabled = isDateDisabledUtil(date, minDate, maxDate, disabledDates);
      if (!disabled) onSelect(date);
    },
    [minDate, maxDate, disabledDates, onSelect]
  );

  const isSelected = useCallback(
    (date: Date) => (selectedDate ? isSameDay(date, selectedDate) : false),
    [selectedDate]
  );

  const isToday = useCallback((date: Date) => isSameDay(date, new Date()), []);

  const isDisabled = useCallback(
    (date: Date) => isDateDisabledUtil(date, minDate, maxDate, disabledDates),
    [minDate, maxDate, disabledDates]
  );

  const getHighlightStatus = useCallback(
    (date: Date): HighlightStatus | null => {
      const key = `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;
      return highlightedMap.get(key) || null;
    },
    [highlightedMap]
  );

  const renderDay = (date: Date, index: number) => {
    const disabled = isDisabled(date);
    const selected = isSelected(date);
    const today = isToday(date);
    const isOtherMonth = date.getMonth() !== month;
    const highlightStatus = getHighlightStatus(date);
    const effectiveHighlight = disabled ? null : highlightStatus;

    return (
      <button
        key={index}
        className={clsx(
          styles.dayButton,
          selected && styles.daySelected,
          today && styles.dayToday,
          disabled && styles.dayDisabled,
          isOtherMonth && styles.dayOtherMonth,
          effectiveHighlight && styles[`highlight-${effectiveHighlight}`]
        )}
        onClick={() => handleDayClick(date)}
        disabled={disabled}
        aria-label={`${date.toLocaleDateString('en-US', {
          weekday: 'long',
          month: 'long',
          day: 'numeric',
          year: 'numeric',
        })}`}
        aria-pressed={selected || undefined}
        aria-disabled={disabled || undefined}
        aria-current={today ? 'date' : undefined}
        tabIndex={selected ? 0 : -1}
      >
        {date.getDate()}
      </button>
    );
  };

  return (
    <div className={styles.calendar} role="grid" aria-label="Calendar">
      <div className={styles.calendarHeader} role="row">
        <div className={styles.navGroup}>
          <Button variant="ghost" size="sm" onClick={handlePrevYear} className={styles.navButton} aria-label="Previous year">
            <Icon size="sm" decorative><FaAngleDoubleLeft /></Icon>
          </Button>
          <Button variant="ghost" size="sm" onClick={handlePrevMonth} className={styles.navButton} aria-label="Previous month">
            <Icon size="sm" decorative><FaChevronLeft /></Icon>
          </Button>
        </div>

        <div className={styles.monthYearWrapper}>
          <Typography variant="body" weight="semibold" className={styles.monthYear} role="heading" aria-level={2}>
            {viewDate.toLocaleDateString('en-US', { month: 'long' })}
          </Typography>
          <div className={styles.yearSelectorWrapper}>
            <button
              className={styles.yearSelectorButton}
              onClick={() => setShowYearDropdown(!showYearDropdown)}
              aria-label="Select year"
              aria-expanded={showYearDropdown}
            >
              <Typography variant="body" weight="semibold" className={styles.yearText}>{year}</Typography>
              <Icon size="sm" color="muted" className={clsx(styles.yearChevron, showYearDropdown && styles.yearChevronOpen)} decorative>
                <FaChevronDown />
              </Icon>
            </button>
            {showYearDropdown && (
              <div className={styles.yearDropdown} role="listbox">
                <div className={styles.yearDropdownList}>
                  {yearRange.map((y) => (
                    <button
                      key={y}
                      className={clsx(styles.yearOption, y === year && styles.yearOptionSelected)}
                      onClick={() => handleYearSelect(y)}
                      role="option"
                      aria-selected={y === year}
                    >
                      {y}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        <div className={styles.navGroup}>
          <Button variant="ghost" size="sm" onClick={handleNextMonth} className={styles.navButton} aria-label="Next month">
            <Icon size="sm" decorative><FaChevronRight /></Icon>
          </Button>
          <Button variant="ghost" size="sm" onClick={handleNextYear} className={styles.navButton} aria-label="Next year">
            <Icon size="sm" decorative><FaAngleDoubleRight /></Icon>
          </Button>
        </div>
      </div>

      <div className={styles.calendarWeekDays} role="row">
        {weekDays.map((day) => (
          <div key={day} className={styles.weekDay} role="columnheader">{day}</div>
        ))}
      </div>

      <div className={styles.calendarGrid} role="rowgroup">
        {days.map((date, index) => (
          <div key={index} role="gridcell">{renderDay(date, index)}</div>
        ))}
      </div>

      <div className={styles.calendarFooter}>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleToday}
          className={styles.todayButton}
        >
          Today
        </Button>
        {clearable && onClear && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onClear}
            className={styles.clearButtonFooter}
          >
            Clear
          </Button>
        )}
      </div>
    </div>
  );
};

DatePickerCalendarComponent.displayName = 'DatePickerCalendar';
export const DatePickerCalendar = memo(DatePickerCalendarComponent);