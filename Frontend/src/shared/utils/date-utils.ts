/**
 * Shared date utilities for the DatePicker component.
 */

export const isSameDay = (d1: Date, d2: Date): boolean => {
  return (
    d1.getFullYear() === d2.getFullYear() &&
    d1.getMonth() === d2.getMonth() &&
    d1.getDate() === d2.getDate()
  );
};

export const isDateBetween = (date: Date, min?: Date | null, max?: Date | null): boolean => {
  if (min && date < min) return false;
  if (max && date > max) return false;
  return true;
};

export const generateCalendar = (year: number, month: number): Date[] => {
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const daysInMonth = lastDay.getDate();
  const startDayOfWeek = firstDay.getDay();
  const days: Date[] = [];

  // Previous month
  const prevMonthLastDay = new Date(year, month, 0).getDate();
  for (let i = startDayOfWeek - 1; i >= 0; i--) {
    days.push(new Date(year, month - 1, prevMonthLastDay - i));
  }

  // Current month
  for (let i = 1; i <= daysInMonth; i++) {
    days.push(new Date(year, month, i));
  }

  // Next month
  const remaining = 42 - days.length;
  for (let i = 1; i <= remaining; i++) {
    days.push(new Date(year, month + 1, i));
  }

  return days;
};

export const getYearRange = (currentYear: number, range: number = 25): number[] => {
  const start = currentYear - range;
  const end = currentYear + range;
  const years: number[] = [];
  for (let i = start; i <= end; i++) {
    years.push(i);
  }
  return years;
};

export const formatDate = (date: Date | null, format: string): string => {
  if (!date) return '';
  switch (format) {
    case 'dd/MM/yyyy':
      return date.toLocaleDateString('en-GB', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
      });
    case 'MM/dd/yyyy':
      return date.toLocaleDateString('en-US', {
        month: '2-digit',
        day: '2-digit',
        year: 'numeric',
      });
    case 'yyyy-MM-dd':
      return date.toISOString().split('T')[0];
    case 'MMM dd, yyyy':
    default:
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: '2-digit',
        year: 'numeric',
      });
  }
};

export const isDateDisabled = (
  date: Date,
  minDate?: Date | null,
  maxDate?: Date | null,
  disabledDates: Date[] = []
): boolean => {
  if (!isDateBetween(date, minDate, maxDate)) return true;
  return disabledDates.some((d) => isSameDay(date, d));
};