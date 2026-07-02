'use client';

/**
 * Authentication provider.
 * Re-exports the AuthProvider from the auth feature for use in the root layout.
 */

import { AuthProvider as AuthProviderComponent } from '@/features/auth';

// Re-export the AuthProvider component directly
export const AuthProvider = AuthProviderComponent;

// Also export as default for convenience
export default AuthProvider;