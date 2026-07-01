import { SITE } from '@/shared/config';
import { Typography } from '@/shared/_components/atoms/Typography';
import Link from 'next/link';
import clsx from 'clsx';
import styles from './LoginFooter.module.css';

interface LoginFooterProps {
  className?: string;
}

export const LoginFooter = ({ className }: LoginFooterProps) => {
  const currentYear = new Date().getFullYear();

  return (
    <div className={clsx(styles.container, className)}>
      <Typography variant="small" color="muted" className={styles.copyright}>
        &copy; {currentYear} {SITE.name}. All rights reserved.
      </Typography>
      <Typography variant="small" color="muted" className={styles.support}>
        Need help?{' '}
        <Link href="/support" className={styles.link}>
          Contact support
        </Link>
      </Typography>
    </div>
  );
};

export default LoginFooter;