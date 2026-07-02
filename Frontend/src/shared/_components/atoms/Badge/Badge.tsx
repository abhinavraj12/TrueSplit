import React, { memo } from 'react';
import clsx from 'clsx';
import styles from './Badge.module.css';

// --- Types ---

export type BadgeVariant =
  | 'primary'
  | 'secondary'
  | 'success'
  | 'warning'
  | 'error'
  | 'info'
  | 'default';

export type BadgeSize = 'sm' | 'md' | 'lg';

// Base props shared by all variants
interface BadgeBaseProps extends React.HTMLAttributes<HTMLSpanElement> {
  /** Visual style variant */
  variant?: BadgeVariant;
  /** Size variant */
  size?: BadgeSize;
  /** If true, uses fully rounded pill shape (default true) */
  rounded?: boolean;
  /** Additional CSS class */
  className?: string;
  /** Custom aria-label (overrides default in dot mode) */
  ariaLabel?: string;
}

// Dot mode: only dot, no children or icon
interface DotModeProps extends BadgeBaseProps {
  dot: true;
  children?: never;
  icon?: never;
}

// Content mode: optional children and icon, dot is false or undefined
interface ContentModeProps extends BadgeBaseProps {
  dot?: false;
  children?: React.ReactNode;
  icon?: React.ReactNode;
}

export type BadgeProps = DotModeProps | ContentModeProps;

// --- Component ---

const BadgeComponent = React.forwardRef<HTMLSpanElement, BadgeProps>(
  (
    {
      variant = 'default',
      size = 'md',
      rounded = true,
      dot = false,
      icon,
      children,
      className,
      ariaLabel,
      ...restProps
    },
    ref,
  ) => {
    // In dot mode, we ignore children and icon
    const isDot = dot === true;

    // Determine the aria-label
    const label = ariaLabel ?? (isDot ? 'Status indicator' : undefined);

    // Build class names
    const classNames = clsx(
      styles.badge,
      styles[variant],
      styles[size],
      rounded && styles.rounded,
      isDot && styles.dot,
      // If only icon is provided (and no children), adjust padding to be more compact
      !isDot && icon && !children && styles.iconOnly,
      className,
    );

    // For dot mode, render just the dot
    if (isDot) {
      return (
        <span
          ref={ref}
          className={classNames}
          aria-label={label}
          role="img" // semantic for a status indicator
          {...restProps}
        />
      );
    }

    // Otherwise render with content
    return (
      <span
        ref={ref}
        className={classNames}
        aria-label={label}
        {...restProps}
      >
        {icon && <span className={styles.icon}>{icon}</span>}
        {children}
      </span>
    );
  },
);

BadgeComponent.displayName = 'Badge';

// Memoize to prevent unnecessary re‑renders
export const Badge = memo(BadgeComponent);