import React, { forwardRef } from 'react';
import clsx from 'clsx';
import { FaTimes } from 'react-icons/fa';
import { Avatar } from '@/shared/_components/atoms/Avatar';
import { Typography } from '@/shared/_components/atoms/Typography';
import { Icon } from '@/shared/_components/atoms/Icon';
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
  /** Subtext displayed below the name (optional) */
  subtext?: string;
  /** If true, the chip is disabled */
  disabled?: boolean;
}

/**
 * UserChip component - Displays a user's avatar with their name.
 * Clean, minimal design with hover and interactive states.
 */
export const UserChip = forwardRef<HTMLDivElement, UserChipProps>(
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
      ...restProps
    },
    ref,
  ) => {
    const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
      if (disabled || !clickable) return;
      onClick?.(e);
    };

    const handleDismiss = (e: React.MouseEvent) => {
      e.stopPropagation();
      onDismiss?.();
    };

    const avatarSizeMap: Record<UserChipSize, 'xs' | 'sm' | 'md'> = {
      sm: 'xs',
      md: 'sm',
      lg: 'md',
    };

    const typographySizeMap: Record<UserChipSize, 'small' | 'body' | 'h6'> = {
      sm: 'small',
      md: 'body',
      lg: 'h6',
    };

    return (
      <div
        ref={ref}
        className={clsx(
          styles.chip,
          styles[`size-${size}`],
          clickable && styles.clickable,
          disabled && styles.disabled,
          className,
        )}
        onClick={handleClick}
        role={clickable ? 'button' : undefined}
        tabIndex={clickable && !disabled ? 0 : undefined}
        aria-disabled={disabled}
        {...restProps}
      >
        <Avatar
          size={avatarSizeMap[size]}
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
  },
);

UserChip.displayName = 'UserChip';

export default UserChip;