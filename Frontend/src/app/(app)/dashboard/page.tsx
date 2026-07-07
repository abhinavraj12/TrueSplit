'use client';

import { useAuth } from '@/features/auth';
import { getUserDisplayName, getUserInitials, getUserAvatar } from '@/features/auth';
import { Button } from '@/shared/_components/atoms/Button';
import styles from './page.module.css';

export default function DashboardPage() {
  const { user, isLoading, error, logout } = useAuth();

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

      <Button variant="danger" onClick={logout}>
        Logout
      </Button>
    </div>
  );
}