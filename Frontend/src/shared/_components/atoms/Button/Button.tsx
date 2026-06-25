import React, { forwardRef, memo } from 'react';
import clsx from 'clsx';
import { Tooltip } from '@/shared/_components/atoms/Tooltip';
import styles from './Button.module.css';

// --- Types ---

export type ButtonVariant =
  | 'primary'
  | 'secondary'
  | 'outline'
  | 'ghost'
  | 'danger'
  | 'success'
  | 'link';

export type ButtonSize = 'sm' | 'md' | 'lg';

// Base props shared by both variants
interface BaseButtonProps {
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
  iconOnly?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  children?: React.ReactNode;
  className?: string;
  label?: string; // aria-label
  tooltip?: string;
  onClick?: React.MouseEventHandler<HTMLButtonElement | HTMLAnchorElement>;
}

// Omit conflicting props from HTML attributes
type ButtonHTMLProps = Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'type' | 'onClick'>;
type AnchorHTMLProps = Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, 'href' | 'target' | 'rel' | 'onClick'>;

// Button element (default)
interface ButtonElementProps extends BaseButtonProps, ButtonHTMLProps {
  as?: 'button';
  type?: 'button' | 'submit' | 'reset';
  loading?: boolean;
  disabled?: boolean;
}

// Anchor element
interface AnchorElementProps extends BaseButtonProps, AnchorHTMLProps {
  as: 'a';
  href: string;
  target?: string;
  rel?: string;
  // anchor cannot be loading/disabled
  loading?: never;
  disabled?: never;
}

export type ButtonProps = ButtonElementProps | AnchorElementProps;

// --- Loading Spinner ---

const LoadingSpinner: React.FC = () => (
  <span className={styles.spinner} aria-hidden="true">
    <span className={styles.spinnerDot} />
    <span className={styles.spinnerDot} />
    <span className={styles.spinnerDot} />
  </span>
);

// --- Component ---

const ButtonComponent = forwardRef<HTMLButtonElement | HTMLAnchorElement, ButtonProps>(
  (props, ref) => {
    const {
      variant = 'primary',
      size = 'md',
      fullWidth = false,
      iconOnly = false,
      leftIcon,
      rightIcon,
      children,
      className,
      label,
      tooltip,
      onClick,
      ...rest
    } = props;

    const isAnchor = props.as === 'a';

    let href: string | undefined;
    let target: string | undefined;
    let rel: string | undefined;
    let loading: boolean = false;
    let disabled: boolean = false;
    let type: 'button' | 'submit' | 'reset' = 'button';
    let buttonRest: React.ButtonHTMLAttributes<HTMLButtonElement> = {};
    let anchorRest: React.AnchorHTMLAttributes<HTMLAnchorElement> = {};

    if (isAnchor) {
      const anchorProps = rest as AnchorElementProps;
      href = anchorProps.href;
      target = anchorProps.target;
      rel = anchorProps.rel;
      const { href: _h, target: _t, rel: _r, ...restAnchor } = anchorProps;
      anchorRest = restAnchor;
    } else {
      const buttonProps = rest as ButtonElementProps;
      loading = buttonProps.loading || false;
      disabled = buttonProps.disabled || false;
      type = buttonProps.type || 'button';
      const { loading: _l, disabled: _d, type: _t, ...restButton } = buttonProps;
      buttonRest = restButton;
    }

    const ariaLabel = label || (typeof children === 'string' ? children : undefined);

    if (process.env.NODE_ENV === 'development' && iconOnly && !ariaLabel) {
      console.warn(
        'Button: iconOnly buttons must have an accessible label via the `label` prop or string `children`.',
      );
    }

    const isDisabled = isAnchor ? false : (disabled || loading);

    const classNames = clsx(
      styles.button,
      styles[variant],
      styles[size],
      fullWidth && styles.fullWidth,
      loading && styles.loading,
      iconOnly && styles.iconOnly,
      className,
    );

    const commonProps = {
      className: classNames,
      onClick: isDisabled ? undefined : onClick,
      'aria-label': ariaLabel,
      'aria-disabled': isDisabled,
      'data-variant': variant,
      'data-size': size,
      'data-loading': loading,
      'data-icon-only': iconOnly,
    };

    let element: React.ReactElement;
    if (isAnchor) {
      element = (
        <a
          ref={ref as React.Ref<HTMLAnchorElement>}
          href={href}
          target={target}
          rel={rel}
          {...commonProps}
          {...anchorRest}
        >
          <span className={styles.content}>
            {leftIcon && <span className={styles.iconLeft}>{leftIcon}</span>}
            {children}
            {rightIcon && <span className={styles.iconRight}>{rightIcon}</span>}
          </span>
        </a>
      );
    } else {
      element = (
        <button
          ref={ref as React.Ref<HTMLButtonElement>}
          type={type}
          disabled={isDisabled}
          aria-busy={loading}
          {...commonProps}
          {...buttonRest}
        >
          {loading && (
            <span className={styles.loadingOverlay} aria-hidden="true">
              <LoadingSpinner />
              <span className={styles.srOnly}>Loading...</span>
            </span>
          )}
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
    }

    if (tooltip) {
      return (
        <Tooltip content={tooltip} placement="top" delay={300}>
          {element}
        </Tooltip>
      );
    }

    return element;
  },
);

ButtonComponent.displayName = 'Button';

export const Button = memo(ButtonComponent);