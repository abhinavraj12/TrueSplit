'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import ErrorState from '@/shared/_components/molecules/ErrorState/ErrorState';
import styles from './error.module.css';

interface ErrorPageProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function ErrorPage({ error, reset }: ErrorPageProps) {
  const router = useRouter();

  useEffect(() => {
    // Log the error to an error reporting service
    console.error('Application error:', error);
  }, [error]);

  const handleRetry = () => {
    reset();
  };

  const handleGoHome = () => {
    router.push('/');
  };

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <ErrorState
          title="Oops! Something went wrong"
          description="Don't worry—something unexpected happened. Please try again in a moment or go back to the home page."
          error={error}
          retryLabel="Try Again"
          onRetry={handleRetry}
          size="lg"
        />
        <button
          onClick={handleGoHome}
          className={styles.homeButton}
          aria-label="Go to homepage"
        >
          Go to Homepage
        </button>
      </div>
    </div>
  );
}