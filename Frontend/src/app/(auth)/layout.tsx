import type { Metadata } from 'next';
import { SITE } from '@/shared/config';

export const metadata: Metadata = {
  title: `Sign In | ${SITE.name}`,
  description: `Sign in to ${SITE.name} to manage your shared expenses and groups.`,
  robots: {
    index: false, // Auth pages should not be indexed
    follow: false,
  },
};

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="auth-layout">
      <div className="auth-container">
        {children}
      </div>
    </div>
  );
}