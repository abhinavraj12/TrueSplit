'use client';

import { useAuth } from '@/features/auth';
import { getUserDisplayName, getUserInitials, getUserAvatar } from '@/features/auth';

export default function DashboardPage() {
  const { user, isLoading, error, logout } = useAuth();

  if (isLoading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh' 
      }}>
        <p>Loading your profile...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ padding: '2rem', color: 'red' }}>
        <h2>Error loading profile</h2>
        <p>{error}</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div style={{ padding: '2rem' }}>
        <h2>Not authenticated</h2>
        <p>Please log in again.</p>
      </div>
    );
  }

  const displayName = getUserDisplayName(user);
  const initials = getUserInitials(user);
  const avatarUrl = getUserAvatar(user);

  return (
    <div style={{ maxWidth: '600px', margin: '2rem auto', padding: '2rem', border: '1px solid #ddd', borderRadius: '8px' }}>
      <h1>Dashboard</h1>
      <p>Welcome, {displayName}!</p>

      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', margin: '1.5rem 0' }}>
        {avatarUrl ? (
          <img 
            src={avatarUrl} 
            alt={displayName} 
            style={{ width: '64px', height: '64px', borderRadius: '50%', objectFit: 'cover' }} 
          />
        ) : (
          <div style={{ 
            width: '64px', 
            height: '64px', 
            borderRadius: '50%', 
            backgroundColor: '#6E8B6B', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            color: 'white',
            fontWeight: 'bold',
            fontSize: '1.5rem'
          }}>
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

      <button 
        onClick={logout}
        style={{
          padding: '0.5rem 1rem',
          backgroundColor: '#d9534f',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer'
        }}
      >
        Logout
      </button>
    </div>
  );
}