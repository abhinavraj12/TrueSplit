import React, { useState, useCallback, useMemo, memo } from 'react';
import clsx from 'clsx';
import styles from './ToggleGroup.module.css';

export type ToggleGroupSize = 'sm' | 'md' | 'lg';
export type ToggleGroupType = 'single' | 'multi';

export interface ToggleGroupOption {
  value: string;
  label: React.ReactNode;
  disabled?: boolean;
}

type BaseProps = {
  options: ToggleGroupOption[];
  size?: ToggleGroupSize;
  disabled?: boolean;
  className?: string;
  /** Accessible label for the group (screen reader only) */
  ariaLabel?: string;
  /** If a visible label exists, provide its ID for aria-labelledby */
  ariaLabelledBy?: string;
  /** If true, the group takes full width; otherwise inline */
  fullWidth?: boolean;
};

type SingleProps = BaseProps & {
  type?: 'single';
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
};

type MultiProps = BaseProps & {
  type: 'multi';
  value?: string[];
  defaultValue?: string[];
  onChange?: (value: string[]) => void;
};

export type ToggleGroupProps = SingleProps | MultiProps;

/**
 * ToggleGroup – A group of toggle buttons supporting single or multi-select.
 * Accessible, responsive, and fully controlled/uncontrolled.
 */
const ToggleGroupComponent: React.FC<ToggleGroupProps> = ({
  options,
  size = 'md',
  disabled = false,
  className,
  ariaLabel,
  ariaLabelledBy,
  fullWidth = false,
  ...props
}) => {
  // All hooks must be called unconditionally
  const isMulti = props.type === 'multi';
  const isControlled = props.value !== undefined;

  // Internal state for uncontrolled mode
  const [internalValue, setInternalValue] = useState<string | string[]>(
    isMulti
      ? (props as MultiProps).defaultValue ?? []
      : (props as SingleProps).defaultValue ?? ''
  );

  // Compute current value (controlled or internal)
  const currentValue = isControlled
    ? props.value
    : internalValue;

  const handleSelect = useCallback(
    (optionValue: string) => {
      if (disabled) return;

      let newValue: string | string[];

      if (isMulti) {
        const currentArray = Array.isArray(currentValue) ? currentValue : [];
        newValue = currentArray.includes(optionValue)
          ? currentArray.filter((v) => v !== optionValue)
          : [...currentArray, optionValue];
      } else {
        newValue = currentValue === optionValue ? '' : optionValue;
      }

      if (!isControlled) {
        setInternalValue(newValue);
      }

      if (isMulti) {
        (props as MultiProps).onChange?.(newValue as string[]);
      } else {
        (props as SingleProps).onChange?.(newValue as string);
      }
    },
    [currentValue, isMulti, disabled, isControlled, props]
  );

  const isSelected = useCallback(
    (optionValue: string): boolean => {
      if (isMulti) {
        return Array.isArray(currentValue) && currentValue.includes(optionValue);
      }
      return currentValue === optionValue;
    },
    [currentValue, isMulti]
  );

  // Memoize rendered buttons to prevent unnecessary re-renders
  const buttons = useMemo(
    () =>
      options.map((option) => {
        const selected = isSelected(option.value);
        const optionDisabled = option.disabled || disabled;

        return (
          <button
            key={option.value}
            className={clsx(
              styles.toggleButton,
              selected && styles.selected,
              optionDisabled && styles.optionDisabled
            )}
            onClick={() => handleSelect(option.value)}
            disabled={optionDisabled}
            aria-pressed={selected}
            aria-disabled={optionDisabled}
            type="button"
          >
            {option.label}
          </button>
        );
      }),
    [options, isSelected, handleSelect, disabled]
  );

  // Guard: render nothing if options are invalid (after all hooks)
  if (!options || options.length === 0) {
    if (process.env.NODE_ENV === 'development') {
      console.warn('ToggleGroup: `options` is empty or undefined. Rendering null.');
    }
    return null;
  }

  // Determine ARIA label for the group
  const ariaAttributes = {
    ...(ariaLabelledBy ? { 'aria-labelledby': ariaLabelledBy } : {}),
    ...(ariaLabel && !ariaLabelledBy ? { 'aria-label': ariaLabel } : {}),
    role: 'group',
  };

  return (
    <div
      className={clsx(
        styles.toggleGroup,
        styles[`size-${size}`],
        disabled && styles.disabled,
        fullWidth && styles.fullWidth,
        className
      )}
      {...ariaAttributes}
    >
      {buttons}
    </div>
  );
};

ToggleGroupComponent.displayName = 'ToggleGroup';

export const ToggleGroup = memo(ToggleGroupComponent);
export default ToggleGroup;