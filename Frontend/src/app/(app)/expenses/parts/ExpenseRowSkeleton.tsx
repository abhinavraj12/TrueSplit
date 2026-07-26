import { Skeleton } from '@/shared/_components/atoms/Skeleton';
import styles from './ExpenseRowSkeleton.module.css';

interface ExpenseRowSkeletonProps {
  count?: number;
}

export function ExpenseRowSkeleton({ count = 5 }: ExpenseRowSkeletonProps) {
  return (
    <div className={styles.container}>
      {Array.from({ length: count }).map((_, index) => (
        <div key={index} className={styles.row}>
          {/* Status dot */}
          <div className={styles.statusDotWrapper}>
            <Skeleton variant="custom" width={12} height={12} className={styles.statusDot} />
          </div>

          {/* Content */}
          <div className={styles.content}>
            <div className={styles.topLine}>
              <Skeleton variant="text" width="60%" height={20} className={styles.titleSkeleton} />
              <div className={styles.avatarStack}>
                <Skeleton variant="custom" width={24} height={24} className={styles.avatarSkeleton} />
                <Skeleton variant="custom" width={24} height={24} className={styles.avatarSkeleton} />
                <Skeleton variant="custom" width={24} height={24} className={styles.avatarSkeleton} />
              </div>
              <Skeleton variant="text" width="30%" height={16} className={styles.participantSkeleton} />
            </div>
            <div className={styles.meta}>
              <Skeleton variant="text" width="25%" height={14} />
              <Skeleton variant="text" width="15%" height={14} />
            </div>
          </div>

          {/* Right column */}
          <div className={styles.rightCol}>
            <Skeleton variant="text" width="70%" height={24} className={styles.amountSkeleton} />
            <Skeleton variant="text" width="40%" height={14} className={styles.actionSkeleton} />
          </div>
        </div>
      ))}
    </div>
  );
}