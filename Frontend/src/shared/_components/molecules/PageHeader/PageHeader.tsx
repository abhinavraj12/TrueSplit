'use client';

import { Breadcrumb, BreadcrumbItem } from '@/shared/_components/molecules/Breadcrumb';
import { ThemeSwitcher } from '@/shared/_components/molecules/ThemeSwitcher';
import styles from './PageHeader.module.css';

interface PageHeaderProps {
  /** Breadcrumb items to display */
  items: BreadcrumbItem[];
  /** Additional CSS class for the container */
  className?: string;
  /** Accessible label for the breadcrumb navigation */
  ariaLabel?: string;
  /** Optional children to render on the right side (e.g., search bar, count) */
  children?: React.ReactNode;
}

export function PageHeader({ items, className, ariaLabel = 'Page header', children }: PageHeaderProps) {
  return (
    <div className={`${styles.header} ${className || ''}`}>
      <div className={styles.left}>
        <Breadcrumb items={items} separator="//" small aria-label={ariaLabel} />
      </div>
      <div className={styles.right}>
        {children}
        <ThemeSwitcher variant="icon" />
      </div>
    </div>
  );
}

export default PageHeader;