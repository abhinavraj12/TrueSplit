'use client';

import { ReactNode } from 'react';
import { ThemeProvider } from './ThemeProvider';
import { ToastProvider } from '@/shared/_components/molecules/Toast';

export function RootLayoutClient({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider>
      <ToastProvider position="top-center">
        {children}
      </ToastProvider>
    </ThemeProvider>
  );
}