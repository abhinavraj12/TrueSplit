import React from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Button } from '@/shared/_components/atoms/Button';
import { Avatar } from '@/shared/_components/atoms/Avatar';
import styles from '../page.module.css';

export interface FormHeaderProps {
  /** The current expense title (used in the header) */
  title: string;
  /** URL of the receipt thumbnail (if any) */
  thumbnailUrl?: string | null;
  /** User avatar URL (fallback) */
  avatarUrl?: string;
  /** User name for avatar fallback */
  userName?: string;
  /** Callback when back button is clicked */
  onBack?: () => void;
}

export const FormHeader: React.FC<FormHeaderProps> = ({
  title,
  thumbnailUrl,
  avatarUrl,
  userName,
  onBack,
}) => {
  const router = useRouter();

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      router.back();
    }
  };

  const displayTitle = title.trim() || 'New Expense';

  return (
    <div className={styles.header}>
      <div className={styles.headerLeft}>
        <Button variant="ghost" size="sm" onClick={handleBack} className={styles.backButton}>
          ← Back
        </Button>
      </div>
      <h1 className={styles.title}>#{displayTitle}</h1>
      <div className={styles.headerRight}>
        {thumbnailUrl ? (
          <div className={styles.receiptThumbnailWrapper}>
            <Image
              src={thumbnailUrl}
              alt="Receipt"
              width={40}
              height={40}
              className={styles.receiptThumbnail}
              unoptimized
            />
          </div>
        ) : (
          <Avatar
            size="sm"
            src={avatarUrl}
            name={userName || 'User'}
            className={styles.userAvatar}
            tooltip={userName || 'User'}
          />
        )}
      </div>
    </div>
  );
};

export default FormHeader;