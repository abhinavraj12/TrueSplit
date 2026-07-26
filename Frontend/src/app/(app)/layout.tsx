/**
 * Layout for authenticated pages (dashboard, groups, expenses, etc.).
 * Includes a floating bottom navigation bar for mobile devices.
 */


import { BottomNav } from '@/shared/_components/molecules/BottomNav';
import styles from './layout.module.css';

export default function AppLayout({ children }: { children: React.ReactNode }) {
  console.log('AppLayout is rendering');
  return (
    <div className={styles.layout}>
      <main className={styles.main}>{children}</main>
      <BottomNav />
    </div>
  );
}