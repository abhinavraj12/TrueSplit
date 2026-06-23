import React from 'react';
import clsx from 'clsx';
import styles from './Spinner.module.css';

export type SpinnerSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';
export type SpinnerColor = 'default' | 'primary' | 'success' | 'warning' | 'error' | 'info' | 'link';
export type SpinnerSpeed = 'slow' | 'normal' | 'fast';

export interface SpinnerProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * Size variant
   * @default 'md'
   */
  size?: SpinnerSize;
  /**
   * Color variant
   * @default 'default'
   */
  color?: SpinnerColor;
  /**
   * Animation speed
   * @default 'normal'
   */
  speed?: SpinnerSpeed;
  /**
   * Accessible label for screen readers
   * @default 'Loading...'
   */
  label?: string;
  /**
   * Additional CSS classes
   */
  className?: string;
}

/**
 * A reusable, accessible spinner/loader component.
 * Supports size, color, and speed variants.
 */
export const Spinner = React.forwardRef<HTMLDivElement, SpinnerProps>(
  (
    {
      size = 'md',
      color = 'default',
      speed = 'normal',
      label = 'Loading...',
      className,
      ...restProps
    },
    ref,
  ) => {
    const classNames = clsx(
      styles.spinner,
      styles[`size-${size}`],
      styles[`color-${color}`],
      styles[`speed-${speed}`],
      className,
    );

    return (
      <div
        ref={ref}
        className={classNames}
        role="status"
        aria-label={label}
        {...restProps}
      >
        <span className={styles.spinnerCircle} />
        <span className={styles.srOnly}>{label}</span>
      </div>
    );
  },
);

Spinner.displayName = 'Spinner';