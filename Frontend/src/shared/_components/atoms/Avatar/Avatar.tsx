import React, { useState, forwardRef, useMemo, memo } from 'react';
import Image from 'next/image';
import { FaUser } from 'react-icons/fa';
import clsx from 'clsx';
import { Tooltip } from '@/shared/_components/atoms/Tooltip';
import { Badge } from '@/shared/_components/atoms/Badge';
import styles from './Avatar.module.css';

// --- Types ---

export type AvatarSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';
export type AvatarStatus = 'online' | 'offline' | 'busy' | 'away';
export type BadgePosition = 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left';

export interface AvatarProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Image source URL */
  src?: string;
  /** Alt text (if not provided, uses name or falls back to "Avatar") */
  alt?: string;
  /** User's full name (used for initials and alt) */
  name?: string;
  /** Size variant */
  size?: AvatarSize;
  /** Presence status */
  status?: AvatarStatus;
  /** Badge content (usually a number) – if `badge` is a number, it will display as count */
  badge?: React.ReactNode;
  /** Position of the badge relative to avatar */
  badgePosition?: BadgePosition;
  /** Background color of the badge – overrides default */
  badgeColor?: string;
  /** If true, adds a decorative ring (like focus ring) */
  ring?: boolean;
  /** Additional CSS class */
  className?: string;
  /** If true, marks the avatar as decorative (sets aria-hidden) */
  decorative?: boolean;
  /** Tooltip content (if provided, wraps avatar with Tooltip) */
  tooltip?: string;
  /** Callback when image fails to load */
  onImageError?: (event: React.SyntheticEvent<HTMLImageElement, Event>) => void;
  /** Click handler (makes avatar interactive) */
  onClick?: (event: React.MouseEvent<HTMLDivElement>) => void;
  /** Tab index for keyboard focus (default 0 if onClick present) */
  tabIndex?: number;
  /** For Next.js image priority */
  priority?: boolean;
}

// --- Helper functions ---

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

// --- Main Avatar Component ---

const AvatarComponent = forwardRef<HTMLDivElement, AvatarProps>(
  (
    {
      src,
      alt,
      name,
      size = 'md',
      status,
      badge,
      badgePosition = 'top-right',
      badgeColor,
      ring = false,
      className,
      decorative = false,
      tooltip,
      onImageError,
      onClick,
      tabIndex,
      priority = false,
      ...restProps
    },
    ref,
  ) => {
    const [imgError, setImgError] = useState(false);
    const shouldShowImage = src && !imgError;
    const pixelSize = getSizePixels(size);

    // Compute aria-label including status if present
    const ariaLabel = useMemo(() => {
      if (decorative) return undefined;
      let label = alt || name || 'Avatar';
      if (status) {
        label += `, ${statusLabels[status]}`;
      }
      return label;
    }, [decorative, alt, name, status]);

    // Determine if interactive (has onClick)
    const interactive = !!onClick;
    const tabIndexValue = interactive ? (tabIndex ?? 0) : (tabIndex ?? -1);

    // Fallback content
    const fallbackContent = useMemo(() => {
      if (name) {
        return <span className={styles.initials}>{extractInitials(name)}</span>;
      }
      return <FaUser className={styles.defaultIcon} />;
    }, [name]);

    // Badge rendering – use Badge component
    const badgeNode = useMemo(() => {
      if (badge === undefined || badge === null || badge === 0) return null;
      const isNumber = typeof badge === 'number';
      const content = isNumber ? (badge > 99 ? '99+' : badge) : badge;
      const variant = isNumber ? 'primary' : 'info';
      
      let badgeSize: 'sm' | 'md' | 'lg';
      if (size === 'xs' || size === 'sm') {
        badgeSize = 'sm';
      } else {
        badgeSize = 'md'; // for md, lg, xl
      }
      
      return (
        <Badge
          variant={variant}
          size={badgeSize}
          className={clsx(
            styles.badgeWrapper,
            styles[badgePosition],
            styles.badgeCompact
          )}
          style={{ backgroundColor: badgeColor }}
        >
          {content}
        </Badge>
      );
    }, [badge, badgePosition, badgeColor, size]);

    // Create the avatar element (without tooltip wrapper)
    const avatarElement = (
      <div
        ref={ref}
        className={clsx(
          styles.avatar,
          styles[size],
          interactive && styles.interactive,
          ring && styles.ring,
          className,
        )}
        onClick={onClick}
        role={decorative ? undefined : 'img'}
        aria-label={decorative ? undefined : ariaLabel}
        aria-hidden={decorative ? true : undefined}
        tabIndex={tabIndexValue}
        {...restProps}
      >
        {/* Image/Fallback */}
        <div className={clsx(styles.content, status && styles.hasStatus)}>
          {shouldShowImage ? (
            <Image
              src={src}
              alt={alt || name || 'Avatar'}
              onError={(e) => {
                setImgError(true);
                onImageError?.(e);
              }}
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

        {/* Status Indicator */}
        {status && (
          <span
            className={clsx(styles.status, styles[`status-${status}`])}
            aria-hidden={true}
          />
        )}

        {/* Badge */}
        {badgeNode}
      </div>
    );

    // Wrap with tooltip if tooltip prop provided
    if (tooltip) {
      return (
        <Tooltip content={tooltip} placement="top" delay={300}>
          {avatarElement}
        </Tooltip>
      );
    }

    return avatarElement;
  },
);

AvatarComponent.displayName = 'Avatar';

// --- AvatarGroup ---

export interface AvatarGroupProps {
  children: React.ReactNode;
  max?: number;
  size?: AvatarSize;
  className?: string;
  compact?: boolean;
  /** Accessible label for the group */
  ariaLabel?: string;
}

const AvatarGroupComponent: React.FC<AvatarGroupProps> = ({
  children,
  max,
  size = 'md',
  className,
  compact = false,
  ariaLabel = 'Group members',
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
      role="group"
      aria-label={ariaLabel}
    >
      {visibleChildren}
      {extraCount > 0 && (
        <div
          className={clsx(styles.avatar, styles[size], styles.extraCount)}
          aria-hidden="true"
        >
          +{extraCount}
        </div>
      )}
    </div>
  );
};

AvatarGroupComponent.displayName = 'AvatarGroup';

// --- Memoized exports ---

export const Avatar = memo(AvatarComponent);
export const AvatarGroup = memo(AvatarGroupComponent);

export default Avatar;