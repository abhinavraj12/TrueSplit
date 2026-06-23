import React from 'react';
import styles from './Button.module.css';

export type ButtonVariant =
  | 'primary'
  | 'secondary'
  | 'outline'
  | 'ghost'
  | 'danger'
  | 'success'
  | 'link';

export type ButtonSize = 'sm' | 'md' | 'lg';

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
  loading?: boolean;
  iconOnly?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  children?: React.ReactNode;
}

const buildClassName = (
  variant: ButtonVariant,
  size: ButtonSize,
  fullWidth: boolean,
  loading: boolean,
  iconOnly: boolean,
  className?: string,
): string => {
  const classes = [
    styles.button,
    styles[variant],
    styles[size],
    fullWidth && styles.fullWidth,
    loading && styles.loading,
    iconOnly && styles.iconOnly,
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return classes;
};

const LoadingSpinner: React.FC = () => (
  <span className={styles.spinner} aria-hidden="true">
    <span className={styles.spinnerDot} />
    <span className={styles.spinnerDot} />
    <span className={styles.spinnerDot} />
  </span>
);

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = 'primary',
      size = 'md',
      fullWidth = false,
      loading = false,
      disabled = false,
      iconOnly = false,
      type = 'button',
      leftIcon,
      rightIcon,
      className,
      children,
      onClick,
      ...restProps
    },
    ref,
  ) => {
    const isDisabled = disabled || loading;

    const classNames = buildClassName(
      variant,
      size,
      fullWidth,
      loading,
      iconOnly,
      className,
    );

    return (
      <button
        ref={ref}
        type={type}
        disabled={isDisabled}
        className={classNames}
        onClick={isDisabled ? undefined : onClick}
        aria-busy={loading}
        aria-disabled={isDisabled}
        aria-label={iconOnly ? (typeof children === 'string' ? children : undefined) : undefined}
        data-variant={variant}
        data-size={size}
        data-loading={loading}
        data-icon-only={iconOnly}
        {...restProps}
      >
        {/* Loading overlay */}
        <span
          className={styles.loadingOverlay}
          aria-hidden={!loading}
          aria-label={loading ? 'Loading...' : undefined}
        >
          <LoadingSpinner />
          <span className={styles.srOnly}>Loading...</span>
        </span>

        {/* Content */}
        <span
          className={styles.content}
          aria-hidden={loading}
          style={{ visibility: loading ? 'hidden' : 'visible' }}
        >
          {leftIcon && <span className={styles.iconLeft}>{leftIcon}</span>}
          {children}
          {rightIcon && <span className={styles.iconRight}>{rightIcon}</span>}
        </span>
      </button>
    );
  },
);

Button.displayName = 'Button';