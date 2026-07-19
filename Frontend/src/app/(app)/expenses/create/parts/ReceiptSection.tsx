import React from 'react';
import { ReceiptUploaderCompact } from './ReceiptUploaderCompact';
import styles from '../page.module.css';

export interface ReceiptSectionProps {
  /** Array of pending files */
  files: File[];
  /** Upload progress per filename (0-100) */
  uploadProgress: Record<string, number>;
  /** Callback when files are added */
  onFilesAdded: (files: File[]) => void;
  /** Callback when a file is removed */
  onRemove: (filename: string) => void;
  /** Whether upload is in progress */
  isUploading?: boolean;
  /** Maximum files allowed (default: 20) */
  maxFiles?: number;
  /** Additional CSS class for the container */
  className?: string;
}

export const ReceiptSection: React.FC<ReceiptSectionProps> = ({
  files,
  uploadProgress,
  onFilesAdded,
  onRemove,
  isUploading = false,
  maxFiles = 20,
  className = '',
}) => {
  return (
    <div className={`${styles.fieldGroup} ${className}`}>
      <label className={styles.label}>Receipts</label>
      <ReceiptUploaderCompact
        files={files}
        uploadProgress={uploadProgress}
        onFilesAdded={onFilesAdded}
        onRemove={onRemove}
        isUploading={isUploading}
        maxFiles={maxFiles}
        maxFileSizeBytes={1024 * 1024}
      />
    </div>
  );
};

export default ReceiptSection;