'use client';

import { ReactNode } from 'react';
import { ThemeProvider } from './ThemeProvider';
import { ToastProvider } from '@/shared/_components/molecules/Toast';
import { AuthProvider } from './AuthProvider';

export function RootLayoutClient({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider>
      <ToastProvider position="top-center">
        <AuthProvider>
          {children}
        </AuthProvider>
      </ToastProvider>
    </ThemeProvider>
  );
}