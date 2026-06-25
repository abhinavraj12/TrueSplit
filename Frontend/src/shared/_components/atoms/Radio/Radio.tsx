import React, { forwardRef, useId, useCallback, memo } from 'react';
import clsx from 'clsx';
import styles from './Radio.module.css';

export type RadioSize = 'sm' | 'md' | 'lg';

export interface RadioProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type' | 'checked' | 'onChange' | 'size' | 'value'> {
  /**
   * Whether the radio is checked (selected).
   * @default false
   */
  checked?: boolean;
  /**
   * Default checked value (for uncontrolled usage).
   */
  defaultChecked?: boolean;
  /**
   * Callback fired when the radio is selected.
   * Receives the value of the radio.
   */
  onChange?: (value: string) => void;
  /**
   * The value of the radio input.
   */
  value: string;
  /**
   * Name attribute for grouping radio buttons.
   */
  name?: string;
  /**
   * Label displayed next to the radio.
   */
  label?: React.ReactNode;
  /**
   * Size variant.
   * @default 'md'
   */
  size?: RadioSize;
  /**
   * If true, disables the radio.
   * @default false
   */
  disabled?: boolean;
  /**
   * If true (or a string), applies error styling.
   * @default false
   */
  error?: boolean | string;
  /**
   * Helper text displayed below the radio.
   */
  helperText?: React.ReactNode;
  /**
   * If true, marks the field as required.
   * @default false
   */
  required?: boolean;
  /**
   * ID of an element that describes the error (used for aria-describedby).
   * If not provided and error is a string, an ID is auto-generated.
   */
  errorMessageId?: string;
  /**
   * Accessible label for the radio (overrides label for a11y).
   */
  ariaLabel?: string;
  /**
   * Additional CSS class for the container.
   */
  className?: string;
}

const RadioComponent = forwardRef<HTMLInputElement, RadioProps>(
  (
    {
      checked,
      defaultChecked,
      onChange,
      value,
      name,
      label,
      size = 'md',
      disabled = false,
      error = false,
      helperText,
      required = false,
      errorMessageId,
      ariaLabel,
      id,
      className,
      ...restProps
    },
    forwardedRef,
  ) => {
    const generatedId = useId();
    const radioId = id || generatedId;
    const isError = Boolean(error);
    const errorMessage = typeof error === 'string' ? error : undefined;

    // Auto-generate error ID if needed
    const errorId = errorMessageId || (errorMessage ? `error-${radioId}` : undefined);
    const helperId = helperText ? `helper-${radioId}` : undefined;

    const handleChange = useCallback(
      (e: React.ChangeEvent<HTMLInputElement>) => {
        if (disabled) return;
        onChange?.(e.target.value);
      },
      [disabled, onChange],
    );

    const ariaDescribedBy = clsx(
      isError && errorId,
      helperText && helperId,
    ) || undefined;

    return (
      <div className={clsx(styles.radioWrapper, className)}>
        <label
          className={clsx(
            styles.radioContainer,
            styles[size],
            {
              [styles.disabled]: disabled,
              [styles.error]: isError,
              [styles.required]: required,
            },
          )}
          htmlFor={radioId}
        >
          <input
            type="radio"
            id={radioId}
            name={name}
            value={value}
            checked={checked}
            defaultChecked={defaultChecked}
            onChange={handleChange}
            disabled={disabled}
            className={styles.radioInput}
            ref={forwardedRef}
            aria-checked={checked}
            aria-disabled={disabled}
            aria-describedby={ariaDescribedBy}
            required={required}
            aria-label={ariaLabel}
            {...restProps}
          />
          <span
            className={clsx(styles.radioControl, {
              [styles.checked]: checked,
            })}
            aria-hidden="true"
          >
            {checked && <span className={styles.radioDot} />}
          </span>
          {label && <span className={styles.radioLabel}>{label}</span>}
          {required && <span className={styles.requiredStar} aria-hidden="true">*</span>}
        </label>

        {isError && errorMessage && (
          <div id={errorId} className={styles.errorText} role="alert">
            {errorMessage}
          </div>
        )}
        {helperText && !isError && (
          <div id={helperId} className={styles.helperText}>
            {helperText}
          </div>
        )}
      </div>
    );
  },
);

RadioComponent.displayName = 'Radio';

export const Radio = memo(RadioComponent);

// --- RadioGroup ---

export interface RadioGroupProps {
  /** Name for the group (used for all radios) */
  name: string;
  /** Current selected value */
  value?: string;
  /** Default selected value (uncontrolled) */
  defaultValue?: string;
  /** Callback when selection changes */
  onChange?: (value: string) => void;
  /** Label for the group (rendered as legend) */
  label?: React.ReactNode;
  /** Error state for the group */
  error?: boolean | string;
  /** Helper text for the group */
  helperText?: React.ReactNode;
  /** If true, marks the group as required */
  required?: boolean;
  /** Size variant for all radios */
  size?: RadioSize;
  /** Additional CSS class for the fieldset */
  className?: string;
  /** Children (Radio components) */
  children: React.ReactNode;
}

export const RadioGroup: React.FC<RadioGroupProps> = ({
  name,
  value: controlledValue,
  defaultValue,
  onChange,
  label,
  error = false,
  helperText,
  required = false,
  size = 'md',
  className,
  children,
}) => {
  const isControlled = controlledValue !== undefined;
  const [internalValue, setInternalValue] = React.useState(defaultValue || '');

  const currentValue = isControlled ? controlledValue : internalValue;

  const handleChange = (val: string) => {
    if (!isControlled) {
      setInternalValue(val);
    }
    onChange?.(val);
  };

  const isError = Boolean(error);
  const errorMessage = typeof error === 'string' ? error : undefined;

  // Clone children and inject props
  const radios = React.Children.map(children, (child) => {
    if (React.isValidElement<RadioProps>(child) && child.type === Radio) {
      return React.cloneElement(child, {
        name,
        size,
        checked: child.props.value === currentValue,
        onChange: handleChange,
        disabled: child.props.disabled || false,
        required,
        error: isError,
        'aria-invalid': isError,
      } as RadioProps);
    }
    return child;
  });

  return (
    <fieldset className={clsx(styles.radioGroup, className)}>
      {label && <legend className={styles.legend}>{label}</legend>}
      <div className={styles.radioGroupOptions}>
        {radios}
      </div>
      {isError && errorMessage && (
        <div className={styles.errorText} role="alert">
          {errorMessage}
        </div>
      )}
      {helperText && !isError && (
        <div className={styles.helperText}>{helperText}</div>
      )}
    </fieldset>
  );
};

RadioGroup.displayName = 'RadioGroup';

export default Radio;