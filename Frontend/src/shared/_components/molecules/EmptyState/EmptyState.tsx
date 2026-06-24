import React from 'react';
import clsx from 'clsx';
import { Typography } from '@/shared/_components/atoms/Typography';
import { Button } from '@/shared/_components/atoms/Button';
import { Icon } from '@/shared/_components/atoms/Icon';
import styles from './EmptyState.module.css';

export interface EmptyStateProps {
  title: string;
  description?: string;
  icon?: React.ReactNode;
  actionLabel?: string;
  onAction?: () => void;
  isLoading?: boolean;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title,
  description,
  icon,
  actionLabel,
  onAction,
  isLoading = false,
  size = 'md',
  className,
}) => {
  const iconSizeMap = { sm: 'sm', md: 'lg', lg: 'xl' } as const;

  return (
    <div
      className={clsx(styles.container, styles[`size-${size}`], className)}
      role="status"
      aria-live="polite"
    >
      {icon && (
        <div className={styles.iconWrapper}>
          <Icon size={iconSizeMap[size]} color="muted" decorative>
            {icon}
          </Icon>
        </div>
      )}
      {title && (
        <Typography
          variant={size === 'lg' ? 'h3' : 'h4'}
          color="primary"
          weight="semibold"
          className={styles.title}
        >
          {title}
        </Typography>
      )}
      {description && (
        <Typography variant="body" color="secondary" className={styles.description}>
          {description}
        </Typography>
      )}
      {actionLabel && onAction && (
        <Button
          variant="primary"
          onClick={onAction}
          loading={isLoading}
          type="button"
          className={styles.action}
        >
          {actionLabel}
        </Button>
      )}
    </div>
  );
};

EmptyState.displayName = 'EmptyState';

export default EmptyState;