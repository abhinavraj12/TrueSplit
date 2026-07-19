'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/features/auth';
import { getUserDisplayName, getUserInitials, getUserAvatar } from '@/features/auth';
import { Button } from '@/shared/_components/atoms/Button';
import { Badge } from '@/shared/_components/atoms/Badge';
import { api } from '@/shared/lib/api';
import { toast } from '@/shared/_components/molecules/Toast/ToastProvider';
import styles from './page.module.css';

interface FriendRequest {
  id: string;
  senderId: string;
  senderEmail: string;
  status: 'PENDING' | 'ACCEPTED' | 'REJECTED';
}

export default function DashboardPage() {
  const { user, isLoading, error, logout } = useAuth();
  const [pendingCount, setPendingCount] = useState(0);
  const [countLoading, setCountLoading] = useState(true);

  // Fetch pending friend request count
  useEffect(() => {
    let isMounted = true;

    const fetchPendingCount = async () => {
      setCountLoading(true);
      try {
        const data = await api.get<FriendRequest[]>('/friends/requests/pending');
        if (isMounted) {
          setPendingCount(data.length);
        }
      } catch (err) {
        if (isMounted) {
          // Silently fail; not critical for dashboard
          setPendingCount(0);
        }
      } finally {
        if (isMounted) {
          setCountLoading(false);
        }
      }
    };

    if (user) {
      fetchPendingCount();
    }

    return () => {
      isMounted = false;
    };
  }, [user]);

  if (isLoading) {
    return (
      <div className={styles.loadingState}>
        <p>Loading your profile...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.errorState}>
        <h2>Error loading profile</h2>
        <p>{error}</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className={styles.notAuthState}>
        <h2>Not authenticated</h2>
        <p>Please log in again.</p>
      </div>
    );
  }

  const displayName = getUserDisplayName(user);
  const initials = getUserInitials(user);
  const avatarUrl = getUserAvatar(user);

  return (
    <div className={styles.container}>
      <h1>Dashboard</h1>
      <p>Welcome, {displayName}!</p>

      <div className={styles.userInfo}>
        {avatarUrl ? (
          <div className={styles.avatarPlaceholder}>
            <img src={avatarUrl} alt={displayName} />
          </div>
        ) : (
          <div className={styles.avatarPlaceholder}>
            {initials}
          </div>
        )}
        <div>
          <p><strong>Name:</strong> {user.name}</p>
          <p><strong>Email:</strong> {user.email}</p>
          <p><strong>Provider:</strong> {user.authProvider}</p>
          <p><strong>Roles:</strong> {user.roles.join(', ')}</p>
        </div>
      </div>

      {/* Friend Requests Link */}
      <div style={{ marginTop: '1.5rem', marginBottom: '1.5rem' }}>
        <Link href="/friends/requests" style={{ textDecoration: 'none' }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '0.75rem 1rem',
              border: '1px solid var(--color-border)',
              borderRadius: 'var(--radius-md)',
              backgroundColor: 'var(--color-bg-surface)',
              transition: 'background-color 0.2s',
              cursor: 'pointer',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = 'var(--color-surface-hover)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'var(--color-bg-surface)';
            }}
          >
            <span style={{ fontWeight: '500' }}>Friend Requests</span>
            {!countLoading && pendingCount > 0 ? (
              <Badge variant="primary" size="md">
                {pendingCount}
              </Badge>
            ) : (
              <span style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem' }}>
                {countLoading ? '...' : 'No pending'}
              </span>
            )}
          </div>
        </Link>
      </div>

      <Button variant="danger" onClick={logout}>
        Logout
      </Button>
    </div>
  );
}