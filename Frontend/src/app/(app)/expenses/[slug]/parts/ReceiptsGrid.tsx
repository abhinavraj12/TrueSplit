'use client';

import Image from 'next/image';
import { ImageInfo } from '@/features/expenses/types/expense.types';
import styles from './ReceiptsGrid.module.css';

interface ReceiptsGridProps {
  images: ImageInfo[];
}

export function ReceiptsGrid({ images }: ReceiptsGridProps) {
  if (!images || images.length === 0) {
    return null;
  }

  const handleImageClick = (url: string) => {
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className={styles.section}>
      <h3 className={styles.title}>Receipts</h3>
      <div className={styles.grid}>
        {images.map((image, index) => (
          <div
            key={index}
            className={styles.imageWrapper}
            onClick={() => handleImageClick(image.url)}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                handleImageClick(image.url);
              }
            }}
            aria-label={`View receipt ${image.originalName || index + 1}`}
          >
            <div className={styles.imageContainer}>
              <Image
                src={image.url}
                alt={image.originalName || `Receipt ${index + 1}`}
                fill
                className={styles.image}
                unoptimized={image.url.startsWith('data:')}
                sizes="(max-width: 768px) 100vw, 300px"
              />
            </div>
            <div className={styles.imageLabel}>
              <span className={styles.imageName}>
                {image.originalName || `Receipt ${index + 1}`}
              </span>
              {image.size && (
                <span className={styles.imageSize}>
                  {(image.size / 1024).toFixed(0)} KB
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ReceiptsGrid;