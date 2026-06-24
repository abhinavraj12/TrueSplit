import React, { useMemo, useCallback, useState } from 'react';
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
  minDate?: Date;
  maxDate?: Date;
  disabledDates?: Date[];
  highlightedDates?: (Date | HighlightedDate)[];
}

const generateCalendar = (year: number, month: number): (Date | null)[] => {
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const daysInMonth = lastDay.getDate();
  const startDayOfWeek = firstDay.getDay();
  const days: (Date | null)[] = [];
  const prevMonthLastDay = new Date(year, month, 0).getDate();
  for (let i = startDayOfWeek - 1; i >= 0; i--) {
    days.push(new Date(year, month - 1, prevMonthLastDay - i));
  }
  for (let i = 1; i <= daysInMonth; i++) {
    days.push(new Date(year, month, i));
  }
  const remaining = 42 - days.length;
  for (let i = 1; i <= remaining; i++) {
    days.push(new Date(year, month + 1, i));
  }
  return days;
};

const isSameDay = (d1: Date, d2: Date): boolean => {
  return d1.getFullYear() === d2.getFullYear() &&
    d1.getMonth() === d2.getMonth() &&
    d1.getDate() === d2.getDate();
};

const isDateBetween = (date: Date, min?: Date | null, max?: Date | null): boolean => {
  if (min && date < min) return false;
  if (max && date > max) return false;
  return true;
};

const getYearRange = (currentYear: number, range: number = 25): number[] => {
  const start = currentYear - range;
  const end = currentYear + range;
  const years: number[] = [];
  for (let i = start; i <= end; i++) {
    years.push(i);
  }
  return years;
};

export const DatePickerCalendar: React.FC<DatePickerCalendarProps> = ({
  selectedDate,
  viewDate,
  onViewDateChange,
  onSelect,
  minDate,
  maxDate,
  disabledDates = [],
  highlightedDates = [],
}) => {
  const year = viewDate.getFullYear();
  const month = viewDate.getMonth();
  const [showYearDropdown, setShowYearDropdown] = useState(false);

  const days = useMemo(() => generateCalendar(year, month), [year, month]);
  const yearRange = useMemo(() => getYearRange(year, 25), [year]);

  const handlePrevMonth = useCallback(() => {
    const newDate = new Date(year, month - 1, 1);
    onViewDateChange(newDate);
  }, [year, month, onViewDateChange]);

  const handleNextMonth = useCallback(() => {
    const newDate = new Date(year, month + 1, 1);
    onViewDateChange(newDate);
  }, [year, month, onViewDateChange]);

  const handlePrevDecade = useCallback(() => {
    const newDate = new Date(year - 1, month, 1);
    onViewDateChange(newDate);
  }, [year, month, onViewDateChange]);

  const handleNextDecade = useCallback(() => {
    const newDate = new Date(year + 1, month, 1);
    onViewDateChange(newDate);
  }, [year, month, onViewDateChange]);

  const handleYearSelect = useCallback(
    (selectedYear: number) => {
      const newDate = new Date(selectedYear, month, 1);
      onViewDateChange(newDate);
      setShowYearDropdown(false);
    },
    [month, onViewDateChange],
  );

  const handleToday = useCallback(() => {
    const today = new Date();
    onViewDateChange(today);
    // Also select today's date
    onSelect(today);
  }, [onViewDateChange, onSelect]);

  const isDateDisabled = useCallback(
    (date: Date): boolean => {
      if (date.getMonth() !== month || date.getFullYear() !== year) {
        return true;
      }
      if (!isDateBetween(date, minDate, maxDate)) {
        return true;
      }
      if (disabledDates.length > 0) {
        return disabledDates.some((disabledDate) => isSameDay(date, disabledDate));
      }
      return false;
    },
    [month, year, minDate, maxDate, disabledDates],
  );

  const isSelected = useCallback(
    (date: Date): boolean => {
      return selectedDate ? isSameDay(date, selectedDate) : false;
    },
    [selectedDate],
  );

  const isToday = useCallback(
    (date: Date): boolean => {
      const today = new Date();
      return isSameDay(date, today);
    },
    [],
  );

  const getHighlightStatus = useCallback(
    (date: Date): HighlightStatus | null => {
      for (const item of highlightedDates) {
        const dateToCheck = item instanceof Date ? item : item.date;
        if (isSameDay(date, dateToCheck)) {
          if (item instanceof Date) return 'info';
          return item.status;
        }
      }
      return null;
    },
    [highlightedDates],
  );

  const weekDays = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

  return (
    <div className={styles.calendar}>
      <div className={styles.calendarHeader}>
        <div className={styles.navGroup}>
          <Button
            variant="ghost"
            size="sm"
            onClick={handlePrevDecade}
            className={styles.navButton}
            aria-label="Back 1 years"
          >
            <Icon size="sm" decorative>
              <FaAngleDoubleLeft />
            </Icon>
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={handlePrevMonth}
            className={styles.navButton}
            aria-label="Previous month"
          >
            <Icon size="sm" decorative>
              <FaChevronLeft />
            </Icon>
          </Button>
        </div>

        <div className={styles.monthYearWrapper}>
          <Typography
            variant="body"
            weight="semibold"
            className={styles.monthYear}
          >
            {viewDate.toLocaleDateString('en-US', { month: 'long' })}
          </Typography>
          <div className={styles.yearSelectorWrapper}>
            <button
              className={styles.yearSelectorButton}
              onClick={() => setShowYearDropdown(!showYearDropdown)}
              aria-label="Select year"
            >
              <Typography variant="body" weight="semibold" className={styles.yearText}>
                {year}
              </Typography>
              <Icon
                size="sm"
                color="muted"
                className={clsx(styles.yearChevron, showYearDropdown && styles.yearChevronOpen)}
                decorative
              >
                <FaChevronDown />
              </Icon>
            </button>
            {showYearDropdown && (
              <div className={styles.yearDropdown}>
                <div className={styles.yearDropdownList}>
                  {yearRange.map((y) => (
                    <button
                      key={y}
                      className={clsx(
                        styles.yearOption,
                        y === year && styles.yearOptionSelected,
                      )}
                      onClick={() => handleYearSelect(y)}
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
          <Button
            variant="ghost"
            size="sm"
            onClick={handleNextMonth}
            className={styles.navButton}
            aria-label="Next month"
          >
            <Icon size="sm" decorative>
              <FaChevronRight />
            </Icon>
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleNextDecade}
            className={styles.navButton}
            aria-label="Forward 1 years"
          >
            <Icon size="sm" decorative>
              <FaAngleDoubleRight />
            </Icon>
          </Button>
        </div>
      </div>

      <div className={styles.calendarWeekDays}>
        {weekDays.map((day) => (
          <div key={day} className={styles.weekDay}>
            {day}
          </div>
        ))}
      </div>

      <div className={styles.calendarGrid}>
        {days.map((date, index) => {
          if (!date) return null;
          const disabled = isDateDisabled(date);
          const selected = isSelected(date);
          const today = isToday(date);
          const isOtherMonth = date.getMonth() !== month;
          const highlightStatus = getHighlightStatus(date);

          return (
            <button
              key={index}
              className={clsx(
                styles.dayButton,
                selected && styles.daySelected,
                today && styles.dayToday,
                disabled && styles.dayDisabled,
                isOtherMonth && styles.dayOtherMonth,
                highlightStatus && styles[`highlight-${highlightStatus}`],
              )}
              onClick={() => {
                if (!disabled) {
                  onSelect(date);
                }
              }}
              disabled={disabled}
              aria-label={date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
              aria-current={selected ? 'date' : undefined}
            >
              {date.getDate()}
            </button>
          );
        })}
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
      </div>
    </div>
  );
};

DatePickerCalendar.displayName = 'DatePickerCalendar';