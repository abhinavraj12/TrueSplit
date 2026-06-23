import React from 'react';
import clsx from 'clsx';
import styles from './Badge.module.css';

export type BadgeVariant =
  | 'primary'
  | 'secondary'
  | 'success'
  | 'warning'
  | 'error'
  | 'info'
  | 'default';

export type BadgeSize = 'sm' | 'md' | 'lg';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  /**
   * Visual style variant
   * @default 'default'
   */
  variant?: BadgeVariant;
  /**
   * Badge size
   * @default 'md'
   */
  size?: BadgeSize;
  /**
   * If true, uses fully rounded pill shape
   * @default true
   */
  rounded?: boolean;
  /**
   * If true, shows a dot instead of text content
   * @default false
   */
  dot?: boolean;
  /**
   * Icon displayed before the text
   */
  icon?: React.ReactNode;
  /**
   * Badge content (text)
   */
  children?: React.ReactNode;
}

export const Badge = React.forwardRef<HTMLSpanElement, BadgeProps>(
  (
    {
      variant = 'default',
      size = 'md',
      rounded = true,
      dot = false,
      icon,
      children,
      className,
      ...restProps
    },
    ref,
  ) => {
    const classNames = clsx(
      styles.badge,
      styles[variant],
      styles[size],
      rounded && styles.rounded,
      dot && styles.dot,
      className,
    );

    // If dot mode is enabled, ignore children and icon
    if (dot) {
      return (
        <span
          ref={ref}
          className={classNames}
          aria-label="Status indicator"
          {...restProps}
        />
      );
    }

    return (
      <span
        ref={ref}
        className={classNames}
        {...restProps}
      >
        {icon && <span className={styles.icon}>{icon}</span>}
        {children}
      </span>
    );
  },
);

Badge.displayName = 'Badge';