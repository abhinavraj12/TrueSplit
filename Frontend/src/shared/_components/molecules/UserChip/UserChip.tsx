import React, { forwardRef, memo, useCallback } from 'react';
import clsx from 'clsx';
import { FaTimes } from 'react-icons/fa';
import { Avatar, AvatarSize } from '@/shared/_components/atoms/Avatar';
import { Typography } from '@/shared/_components/atoms/Typography';
import { Button } from '@/shared/_components/atoms/Button';
import styles from './UserChip.module.css';

export type UserChipSize = 'sm' | 'md' | 'lg';

export interface UserChipProps extends React.HTMLAttributes<HTMLDivElement> {
  /** User's name (displayed next to avatar) */
  name: string;
  /** User's avatar image URL (optional) */
  src?: string;
  /** Alt text for avatar image */
  alt?: string;
  /** Size variant */
  size?: UserChipSize;
  /** If true, the chip is clickable */
  clickable?: boolean;
  /** If true, shows a dismiss (X) button */
  dismissible?: boolean;
  /** Called when dismiss button is clicked */
  onDismiss?: () => void;
  /** Additional CSS class */
  className?: string;
  /** If true, shows user's initials when no image */
  initials?: boolean;
  /** Status indicator dot (online, offline, busy, away) */
  status?: 'online' | 'offline' | 'busy' | 'away';
  /** Subtext displayed below the name (can be string or ReactNode) */
  subtext?: React.ReactNode;
  /** If true, the chip is disabled */
  disabled?: boolean;
  /** Override the avatar size independently */
  avatarSize?: AvatarSize;
  /** Accessible label for the chip when clickable (default: "View profile for {name}") */
  ariaLabel?: string;
}

/**
 * UserChip component - Displays a user's avatar with their name.
 * Clean, minimal design with hover and interactive states.
 */
const UserChipComponent = forwardRef<HTMLDivElement, UserChipProps>(
  (
    {
      name,
      src,
      alt,
      size = 'md',
      clickable = false,
      dismissible = false,
      onDismiss,
      className,
      initials = true,
      status,
      subtext,
      disabled = false,
      onClick,
      avatarSize,
      ariaLabel,
      ...restProps
    },
    ref,
  ) => {
    // --- All hooks must be called unconditionally ---
    const handleClick = useCallback(
      (e: React.MouseEvent<HTMLDivElement>) => {
        if (disabled || !clickable) return;
        onClick?.(e);
      },
      [disabled, clickable, onClick]
    );

    const handleKeyDown = useCallback(
      (e: React.KeyboardEvent<HTMLDivElement>) => {
        if (disabled || !clickable) return;
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onClick?.(e as unknown as React.MouseEvent<HTMLDivElement>);
        }
      },
      [disabled, clickable, onClick]
    );

    const handleDismiss = useCallback(
      (e: React.MouseEvent) => {
        e.stopPropagation();
        onDismiss?.();
      },
      [onDismiss]
    );

    // --- Guard: if name is empty, render nothing (after hooks) ---
    if (!name.trim()) {
      if (process.env.NODE_ENV === 'development') {
        console.warn('UserChip: `name` prop is empty. Rendering null.');
      }
      return null;
    }

    // Map chip size to avatar size, with optional override
    const defaultAvatarSizeMap: Record<UserChipSize, AvatarSize> = {
      sm: 'xs',
      md: 'sm',
      lg: 'md',
    };
    const finalAvatarSize = avatarSize || defaultAvatarSizeMap[size];

    // Typography size map
    const typographySizeMap: Record<UserChipSize, 'small' | 'body' | 'h6'> = {
      sm: 'small',
      md: 'body',
      lg: 'h6',
    };

    // Determine aria-label for clickable chip
    const chipAriaLabel =
      ariaLabel || (clickable ? `View profile for ${name}` : undefined);

    return (
      <div
        ref={ref}
        className={clsx(
          styles.chip,
          styles[`size-${size}`],
          clickable && styles.clickable,
          disabled && styles.disabled,
          className
        )}
        onClick={handleClick}
        onKeyDown={handleKeyDown}
        role={clickable ? 'button' : undefined}
        tabIndex={clickable && !disabled ? 0 : undefined}
        aria-disabled={disabled}
        aria-label={chipAriaLabel}
        {...restProps}
      >
        <Avatar
          size={finalAvatarSize}
          src={src}
          alt={alt || name}
          name={initials ? name : undefined}
          status={status}
          className={styles.avatar}
        />

        <div className={styles.content}>
          <Typography
            variant={typographySizeMap[size]}
            color="primary"
            weight="medium"
            className={styles.name}
            truncate
          >
            {name}
          </Typography>
          {subtext && (
            <Typography
              variant="small"
              color="muted"
              className={styles.subtext}
              truncate
            >
              {subtext}
            </Typography>
          )}
        </div>

        {dismissible && !disabled && (
          <Button
            iconOnly
            variant="ghost"
            size="sm"
            onClick={handleDismiss}
            className={styles.dismissButton}
            aria-label={`Remove ${name}`}
          >
            <FaTimes />
          </Button>
        )}
      </div>
    );
  }
);

UserChipComponent.displayName = 'UserChip';

export const UserChip = memo(UserChipComponent);
export default UserChip;