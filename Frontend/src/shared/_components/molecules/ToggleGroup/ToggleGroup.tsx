import React, { useCallback } from 'react';
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

export const ToggleGroup: React.FC<ToggleGroupProps> = ({
  options,
  size = 'md',
  disabled = false,
  className,
  ...props
}) => {
  const isMulti = props.type === 'multi';
  const isControlled = props.value !== undefined;

  const getDefaultValue = () => {
    if (isMulti) return [];
    return '';
  };

  const initialValue = isMulti
    ? (props as MultiProps).defaultValue ?? []
    : (props as SingleProps).defaultValue ?? '';

  const [internalValue, setInternalValue] = React.useState<string | string[]>(initialValue);

  const currentValue = isControlled
    ? (isMulti ? (props as MultiProps).value : (props as SingleProps).value)
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

  const isSelected = (optionValue: string): boolean => {
    if (isMulti) {
      return Array.isArray(currentValue) && currentValue.includes(optionValue);
    }
    return currentValue === optionValue;
  };

  return (
    <div
      className={clsx(
        styles.toggleGroup,
        styles[`size-${size}`],
        disabled && styles.disabled,
        className
      )}
      role="group"
      aria-label="Toggle options"
    >
      {options.map((option) => {
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
      })}
    </div>
  );
};

ToggleGroup.displayName = 'ToggleGroup';

export default ToggleGroup;