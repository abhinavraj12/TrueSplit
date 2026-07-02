import React from 'react';
import clsx from 'clsx';
import { Typography } from '@/shared/_components/atoms/Typography';
import { Spinner } from '@/shared/_components/atoms/Spinner';
import styles from './LoadingState.module.css';

export interface LoadingStateProps {
  message?: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const LoadingState: React.FC<LoadingStateProps> = ({
  message = 'Loading...',
  size = 'md',
  className,
}) => {
  const spinnerSizeMap = { sm: 'sm', md: 'md', lg: 'lg' } as const;
  const typographyVariantMap = { sm: 'small', md: 'body', lg: 'h6' } as const;

  return (
    <div className={clsx(styles.container, styles[`size-${size}`], className)}>
      <Spinner size={spinnerSizeMap[size]} color="primary" />
      {message && (
        <Typography variant={typographyVariantMap[size]} color="secondary" className={styles.message}>
          {message}
        </Typography>
      )}
    </div>
  );
};

LoadingState.displayName = 'LoadingState';

export default LoadingState;