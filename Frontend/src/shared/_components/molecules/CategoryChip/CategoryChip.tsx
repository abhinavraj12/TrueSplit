import React, { memo, useCallback } from 'react';
import clsx from 'clsx';
import { FaTimes, FaCheck } from 'react-icons/fa';
import { Typography } from '@/shared/_components/atoms/Typography';
import { Icon } from '@/shared/_components/atoms/Icon';
import { Button } from '@/shared/_components/atoms/Button';
import styles from './CategoryChip.module.css';

export type CategoryChipSize = 'sm' | 'md' | 'lg';

export interface CategoryChipProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Display text (required) */
  label: string;
  /** Optional icon */
  icon?: React.ReactNode;
  /** Size variant (default: 'md') */
  size?: CategoryChipSize;
  /** If true, chip is interactive (clickable) */
  interactive?: boolean;
  /** Selected state (applies primary styling) */
  selected?: boolean;
  /** Disabled state (prevents interactions) */
  disabled?: boolean;
  /** If true, shows a dismiss (×) button */
  dismissible?: boolean;
  /** Callback when dismiss button is clicked */
  onDismiss?: () => void;
  /** Custom aria-label for screen readers */
  ariaLabel?: string;
  /** Custom role (default: 'button' when interactive) */
  role?: string;
  /** Additional CSS class */
  className?: string;
}

// --- Helper maps (defined outside component for performance) ---
const iconSizeMap: Record<CategoryChipSize, 'sm' | 'md' | 'lg'> = {
  sm: 'sm',
  md: 'md',
  lg: 'lg',
};

const typographyVariantMap: Record<CategoryChipSize, 'small' | 'body' | 'h6'> = {
  sm: 'small',
  md: 'body',
  lg: 'h6',
};

const iconTypographyMap: Record<CategoryChipSize, 'xs' | 'sm' | 'md' | 'lg'> = {
  sm: 'xs',
  md: 'sm',
  lg: 'lg', // updated to match larger text
};

/**
 * CategoryChip – Visual tag for categories with optional icon and interactions.
 */
const CategoryChipComponent: React.FC<CategoryChipProps> = ({
  label,
  icon,
  size = 'md',
  interactive = false,
  selected = false,
  disabled = false,
  dismissible = false,
  onDismiss,
  ariaLabel,
  role,
  className,
  onClick,
  ...restProps
}) => {
  // Auto-set interactive if onClick is provided
  const isInteractive = interactive || !!onClick;
  const isDisabled = disabled;

  // Prevent clicks when disabled
  const handleClick = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (isDisabled) return;
      onClick?.(e);
    },
    [isDisabled, onClick],
  );

  // Keyboard support (Enter and Space) – dispatches a synthetic click
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLDivElement>) => {
      if (isDisabled) return;
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        // Simulate a click event on the chip
        const clickEvent = new MouseEvent('click', {
          bubbles: true,
          cancelable: true,
        });
        e.currentTarget.dispatchEvent(clickEvent);
      }
    },
    [isDisabled],
  );

  // Handle dismiss
  const handleDismiss = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      if (isDisabled) return;
      onDismiss?.();
    },
    [isDisabled, onDismiss],
  );

  // Determine aria label
  const labelAria = ariaLabel || label;

  // Determine role
  const chipRole = role || (isInteractive ? 'button' : undefined);

  // Determine if we should show selected checkmark
  const showSelectedIcon = selected && !icon;

  return (
    <div
      className={clsx(
        styles.chip,
        styles[`size-${size}`],
        isInteractive && styles.interactive,
        selected && styles.selected,
        isDisabled && styles.disabled,
        className,
      )}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      role={chipRole}
      tabIndex={isInteractive && !isDisabled ? 0 : -1}
      aria-pressed={selected}
      aria-disabled={isDisabled}
      aria-label={labelAria}
      aria-describedby={label ? undefined : 'Missing category label'}
      {...restProps}
    >
      {/* Icon or selected checkmark */}
      {icon && !showSelectedIcon && (
        <Icon
          size={iconSizeMap[size]}
          color={selected ? 'primary' : 'interactive'}
          className={styles.icon}
          decorative
        >
          {icon}
        </Icon>
      )}

      {showSelectedIcon && (
        <Icon
          size={iconTypographyMap[size]}
          color="primary"
          className={styles.icon}
          decorative
        >
          <FaCheck />
        </Icon>
      )}

      {/* Label with title attribute for truncated text */}
      <Typography
        as="span"
        variant={typographyVariantMap[size]}
        weight={selected ? 'medium' : 'normal'}
        color={selected ? 'primary' : 'secondary'}
        className={styles.label}
        truncate
        title={label} // Show full label on hover if truncated
      >
        {label}
      </Typography>

      {/* Dismiss button */}
      {dismissible && !isDisabled && (
        <Button
          iconOnly
          variant="ghost"
          size="sm"
          onClick={handleDismiss}
          className={styles.dismissButton}
          aria-label={`Remove ${label}`}
        >
          <FaTimes />
        </Button>
      )}
    </div>
  );
};

CategoryChipComponent.displayName = 'CategoryChip';

// Memoize for performance
export const CategoryChip = memo(CategoryChipComponent);
export default CategoryChip;