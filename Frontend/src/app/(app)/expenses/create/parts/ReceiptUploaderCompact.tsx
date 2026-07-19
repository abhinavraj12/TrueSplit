'use client';

import React, { useRef, useCallback, useState, DragEvent } from 'react';
import Image from 'next/image';
import { FaUpload, FaTimes } from 'react-icons/fa';
import { Button } from '@/shared/_components/atoms/Button';
import { Icon } from '@/shared/_components/atoms/Icon';
import { Typography } from '@/shared/_components/atoms/Typography';
import styles from './ReceiptUploaderCompact.module.css';

export interface ReceiptUploaderCompactProps {
  files: File[];
  uploadProgress: Record<string, number>;
  onFilesAdded: (files: File[]) => void;
  onRemove: (filename: string) => void;
  isUploading?: boolean;
  maxFiles?: number;
  maxFileSizeBytes?: number;
  allowedMimeTypes?: string[];
}

export const ReceiptUploaderCompact: React.FC<ReceiptUploaderCompactProps> = ({
  files,
  uploadProgress,
  onFilesAdded,
  onRemove,
  isUploading = false,
  maxFiles = 20,
  maxFileSizeBytes = 1024 * 1024,
  allowedMimeTypes = ['image/jpeg', 'image/jpg', 'image/png', 'application/pdf'],
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragOver, setIsDragOver] = useState(false);

  const handleClick = useCallback(() => {
    if (isUploading) return;
    fileInputRef.current?.click();
  }, [isUploading]);

  const handleFileChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      if (isUploading) return;
      const fileList = event.target.files;
      if (fileList) {
        const fileArray = Array.from(fileList);
        const validFiles = fileArray.filter((file) => {
          if (file.size > maxFileSizeBytes) return false;
          if (!allowedMimeTypes.includes(file.type)) return false;
          return true;
        });
        if (validFiles.length > 0) {
          onFilesAdded(validFiles);
        }
        event.target.value = '';
      }
    },
    [isUploading, maxFileSizeBytes, allowedMimeTypes, onFilesAdded]
  );

  const handleDrop = useCallback(
    (event: DragEvent<HTMLDivElement>) => {
      event.preventDefault();
      setIsDragOver(false);
      if (isUploading) return;
      const files = event.dataTransfer.files;
      if (files) {
        const fileArray = Array.from(files);
        const validFiles = fileArray.filter((file) => {
          if (file.size > maxFileSizeBytes) return false;
          if (!allowedMimeTypes.includes(file.type)) return false;
          return true;
        });
        if (validFiles.length > 0) {
          onFilesAdded(validFiles);
        }
      }
    },
    [isUploading, maxFileSizeBytes, allowedMimeTypes, onFilesAdded]
  );

  const handleDragOver = useCallback((event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    if (!isUploading) setIsDragOver(true);
  }, [isUploading]);

  const handleDragLeave = useCallback((event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragOver(false);
  }, []);

  const renderGrid = () => {
    if (files.length === 0) {
      return (
        <div className={styles.emptyState}>
          <Typography variant="small" color="muted">
            No receipts uploaded yet.
          </Typography>
        </div>
      );
    }

    return (
      <div className={styles.grid}>
        {files.map((file, index) => {
          const isFirst = index === 0;
          const progress = uploadProgress[file.name] ?? 0;

          return (
            <div
              key={file.name}
              className={`${styles.gridItem} ${isFirst ? styles.gridItemLarge : styles.gridItemSmall}`}
            >
              <div className={styles.card}>
                <div className={styles.imageWrapper}>
                  <Image
                    src={URL.createObjectURL(file)}
                    alt={file.name}
                    fill
                    className={styles.image}
                    unoptimized
                  />
                  {isUploading && progress > 0 && progress < 100 && (
                    <div className={styles.progressOverlay}>
                      <div className={styles.progressBar}>
                        <div className={styles.progressFill} style={{ width: `${progress}%` }} />
                      </div>
                    </div>
                  )}
                  <button
                    className={styles.removeButton}
                    onClick={() => onRemove(file.name)}
                    disabled={isUploading}
                    aria-label={`Remove ${file.name}`}
                  >
                    <FaTimes />
                  </button>
                  <div className={styles.filenameOverlay}>
                    <span className={styles.filename} title={file.name}>
                      {file.name}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div
      className={`${styles.container} ${isDragOver ? styles.dragOver : ''}`}
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
    >
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        multiple
        accept={allowedMimeTypes.join(',')}
        className={styles.hiddenInput}
        disabled={isUploading}
      />

      <div className={styles.header}>
        <Typography variant="body" weight="semibold" color="primary">
          Receipts
        </Typography>
        <span className={styles.badge}>
          {files.length}/{maxFiles}
        </span>
      </div>

      <div className={styles.actionBar} onClick={handleClick}>
        <div className={styles.actionContent}>
          <Icon size="sm" color="muted" decorative>
            <FaUpload />
          </Icon>
          <span className={styles.actionText}>
            Drag & drop here or{' '}
          </span>
          <Button
            variant="primary"
            size="sm"
            className={styles.selectButton}
            onClick={(e) => {
              e.stopPropagation();
              handleClick();
            }}
            disabled={isUploading}
          >
            Select Files
          </Button>
        </div>
        <div className={styles.actionSubtext}>
          Allowed: {allowedMimeTypes.map(t => t.split('/')[1].toUpperCase()).join(', ')}
        </div>
      </div>

      <div className={styles.gridContainer}>
        {renderGrid()}
      </div>
    </div>
  );
};