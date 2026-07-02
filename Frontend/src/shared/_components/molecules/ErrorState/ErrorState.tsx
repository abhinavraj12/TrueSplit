import React from 'react';
import clsx from 'clsx';
import { FaExclamationCircle } from 'react-icons/fa';
import { Typography } from '@/shared/_components/atoms/Typography';
import { Button } from '@/shared/_components/atoms/Button';
import { Icon } from '@/shared/_components/atoms/Icon';
import styles from './ErrorState.module.css';

export interface ErrorStateProps {
  title: string;
  description?: string;
  error?: unknown;
  retryLabel?: string;
  onRetry?: () => void;
  isLoading?: boolean;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const ErrorState: React.FC<ErrorStateProps> = ({
  title,
  description,
  error,
  retryLabel = 'Try Again',
  onRetry,
  isLoading = false,
  size = 'md',
  className,
}) => {
  const iconSizeMap = { sm: 'sm', md: 'lg', lg: 'xl' } as const;

  // Helper to get a readable error message
  const getErrorMessage = (err: unknown): string => {
    if (err instanceof Error) {
      return err.stack || err.message;
    }
    return String(err);
  };

  return (
    <div
      className={clsx(styles.container, styles[`size-${size}`], className)}
      role="alert"
      aria-live="assertive"
    >
      <Icon size={iconSizeMap[size]} color="error" decorative>
        <FaExclamationCircle />
      </Icon>
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
      {!!error && process.env.NODE_ENV === 'development' && (
        <pre className={styles.errorDetails}>{getErrorMessage(error)}</pre>
      )}
      {onRetry && (
        <Button
          variant="primary"
          onClick={onRetry}
          loading={isLoading}
          className={styles.action}
        >
          {retryLabel}
        </Button>
      )}
    </div>
  );
};

ErrorState.displayName = 'ErrorState';

export default ErrorState;