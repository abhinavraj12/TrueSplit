'use client';

import Link from 'next/link';
import { ROUTES } from '@/shared/config';
import styles from './NotFoundContent.module.css';

interface NotFoundContentProps {
  title?: string;
  description?: string;
  ctaText?: string;
  ctaHref?: string;
  videoSrc?: string;
  illustrationAlt?: string;
}

export function NotFoundContent({
  title = '404 — Lost in the Bills',
  description = "Looks like you've wandered off the path. Let's get you back on track.",
  ctaText = 'Go Home ✨',
  ctaHref = ROUTES.HOME,
  videoSrc = 'https://res.cloudinary.com/cyjv98y5/video/upload/v1785131173/roommate_bdii4c.mp4',
  illustrationAlt = '404 illustration – Lost in the bills',
}: NotFoundContentProps) {
  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <div className={styles.videoWrapper}>
          <video
            className={styles.video}
            src={videoSrc}
            autoPlay
            loop
            muted
            playsInline
            aria-label={illustrationAlt}
          />
        </div>

        <h1 className={styles.title}>{title}</h1>
        <p className={styles.description}>{description}</p>

        <Link href={ctaHref} className={styles.homeButton}>
          {ctaText}
        </Link>
      </div>
    </div>
  );
}

export default NotFoundContent;