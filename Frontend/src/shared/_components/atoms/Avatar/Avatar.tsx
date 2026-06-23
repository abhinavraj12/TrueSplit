import React, { useState, forwardRef } from 'react';
import Image from 'next/image';
import { FaUser } from 'react-icons/fa';
import clsx from 'clsx';
import styles from './Avatar.module.css';

export type AvatarSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';
export type AvatarStatus = 'online' | 'offline' | 'busy' | 'away';

export interface AvatarProps extends React.HTMLAttributes<HTMLDivElement> {
  src?: string;
  alt?: string;
  name?: string;
  size?: AvatarSize;
  status?: AvatarStatus;
  badge?: React.ReactNode;
  ring?: boolean;
  className?: string;
  priority?: boolean;
}

const extractInitials = (name: string): string => {
  const parts = name.trim().split(/\s+/);
  if (parts.length === 0) return '?';
  if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
  return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
};

const getSizePixels = (size: AvatarSize): number => {
  const sizeMap: Record<AvatarSize, number> = {
    xs: 24,
    sm: 32,
    md: 40,
    lg: 48,
    xl: 64,
  };
  return sizeMap[size];
};

const statusLabels: Record<AvatarStatus, string> = {
  online: 'Online',
  offline: 'Offline',
  busy: 'Do not disturb',
  away: 'Away',
};

export const Avatar = forwardRef<HTMLDivElement, AvatarProps>(
  (
    {
      src,
      alt,
      name,
      size = 'md',
      status,
      badge,
      ring = false,
      className,
      priority = false,
      ...restProps
    },
    ref,
  ) => {
    const [imgError, setImgError] = useState(false);
    const shouldShowImage = src && !imgError;
    const pixelSize = getSizePixels(size);
    const statusLabel = status ? statusLabels[status] : undefined;

    let fallbackContent: React.ReactNode;
    if (name) {
      fallbackContent = <span className={styles.initials}>{extractInitials(name)}</span>;
    } else {
      fallbackContent = <FaUser className={styles.defaultIcon} />;
    }

    const badgeProps = badge
      ? {
          role: typeof badge === 'number' ? 'status' : undefined,
          'aria-label': typeof badge === 'number' ? `${badge} notifications` : undefined,
        }
      : {};

    return (
      <div
        ref={ref}
        className={clsx(
          styles.avatar,
          styles[size],
          ring && styles.ring,
          className,
        )}
        {...restProps}
      >
        <div className={clsx(styles.content, status && styles.hasStatus)}>
          {shouldShowImage ? (
            <Image
              src={src}
              alt={alt || name || 'Avatar'}
              onError={() => setImgError(true)}
              className={styles.image}
              width={pixelSize}
              height={pixelSize}
              loading={priority ? 'eager' : 'lazy'}
              fetchPriority={priority ? 'high' : 'auto'}
              priority={priority}
            />
          ) : (
            <div className={styles.fallback}>{fallbackContent}</div>
          )}
        </div>

        {status && (
          <span
            className={clsx(
              styles.status, 
              styles[`status-${status}`], 
              ring && styles.ringStatus
            )}
            aria-label={statusLabel}
          />
        )}

        {badge && (
          <span className={styles.badge} {...badgeProps}>
            {badge}
          </span>
        )}
      </div>
    );
  },
);

Avatar.displayName = 'Avatar';
export default Avatar;

export interface AvatarGroupProps {
  children: React.ReactNode;
  max?: number;
  size?: AvatarSize;
  className?: string;
  compact?: boolean;
}

export const AvatarGroup: React.FC<AvatarGroupProps> = ({
  children,
  max,
  size = 'md',
  className,
  compact = false,
}) => {
  const childrenArray = React.Children.toArray(children);
  const visibleChildren = max ? childrenArray.slice(0, max) : childrenArray;
  const extraCount = max ? childrenArray.length - max : 0;

  return (
    <div
      className={clsx(
        styles.avatarGroup,
        styles[`group-size-${size}`],
        compact && styles.compact,
        className,
      )}
    >
      {visibleChildren}
      {extraCount > 0 && (
        <div className={clsx(styles.avatar, styles[size], styles.extraCount)}>
          +{extraCount}
        </div>
      )}
    </div>
  );
};

AvatarGroup.displayName = 'AvatarGroup';