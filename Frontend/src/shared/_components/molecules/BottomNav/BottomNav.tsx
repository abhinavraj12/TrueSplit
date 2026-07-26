'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { FaHome, FaReceipt, FaUsers, FaUserFriends, FaUser } from 'react-icons/fa';
import { Badge } from '@/shared/_components/atoms/Badge';
import { ROUTES } from '@/shared/config';
import styles from './BottomNav.module.css';

interface NavItem {
  label: string;
  icon: React.ReactNode;
  href: string;
  badge?: number | null;
}

export function BottomNav() {
  const pathname = usePathname();

  const isActive = (href: string): boolean => {
    if (href === ROUTES.DASHBOARD) {
      return pathname === href;
    }
    if (href === ROUTES.EXPENSES) {
      return pathname.startsWith(href);
    }
    if (href === ROUTES.GROUPS) {
      return pathname.startsWith(href);
    }
    if (href === ROUTES.FRIENDS) {
      return pathname.startsWith(href);
    }
    if (href === ROUTES.PROFILE) {
      return pathname.startsWith(href);
    }
    return pathname === href;
  };

  const navItems: NavItem[] = [
    {
      label: 'Home',
      icon: <FaHome />,
      href: ROUTES.DASHBOARD,
    },
    {
      label: 'Expenses',
      icon: <FaReceipt />,
      href: ROUTES.EXPENSES,
    },
    {
      label: 'Groups',
      icon: <FaUsers />,
      href: ROUTES.GROUPS,
    },
    {
      label: 'Friends',
      icon: <FaUserFriends />,
      href: ROUTES.FRIENDS,
    },
    {
      label: 'Profile',
      icon: <FaUser />,
      href: ROUTES.PROFILE,
    },
  ];
console.log('BottomNav is rendering');
  return (
    <nav className={styles.nav} role="navigation" aria-label="Main navigation">
      <div className={styles.container}>
        {navItems.map((item) => {
          const active = isActive(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`${styles.item} ${active ? styles.active : ''}`}
              aria-current={active ? 'page' : undefined}
            >
              <div className={styles.iconWrapper}>
                {item.icon}
                {item.badge && item.badge > 0 && (
                  <Badge variant="primary" size="sm" className={styles.badge}>
                    {item.badge > 99 ? '99+' : item.badge}
                  </Badge>
                )}
              </div>
              <span className={styles.label}>{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

export default BottomNav;