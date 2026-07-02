import type { Metadata } from 'next';
import { SITE } from '@/shared/config';
import { LoginForm } from './parts/LoginForm/LoginForm';
import { LoginFooter } from './parts/LoginFooter/LoginFooter';
import styles from './page.module.css';

export const metadata: Metadata = {
  title: `Sign In | ${SITE.name}`,
  description: `Sign in to ${SITE.name} to manage your shared expenses and groups.`,
  robots: {
    index: false,
    follow: false,
  },
};

export default function LoginPage() {
  return (
    <div className={styles.container}>
      <LoginForm />
      <div className={styles.desktopFooter}>
        <LoginFooter />
      </div>
    </div>
  );
}