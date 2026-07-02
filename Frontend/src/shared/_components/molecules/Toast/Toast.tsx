'use client';

import React, { memo } from 'react';
import { toast as hotToast, Toast as HotToast } from 'react-hot-toast';
import clsx from 'clsx';
import {
  FaCheckCircle,
  FaExclamationCircle,
  FaInfoCircle,
  FaExclamationTriangle,
  FaTimes,
} from 'react-icons/fa';
import { Icon } from '@/shared/_components/atoms/Icon';
import styles from './Toast.module.css';

export type ToastType = 'success' | 'error' | 'info' | 'warning';

export interface ToastProps {
  /** The toast instance from react-hot-toast */
  t: HotToast;
  /** The message to display */
  message: string;
  /** The type of toast (determines icon and color) */
  type?: ToastType;
  /** Custom icon (overrides default) */
  icon?: React.ReactNode;
  /** Additional CSS class for the toast container */
  className?: string;
}

const iconMap: Record<ToastType, React.ReactNode> = {
  success: <FaCheckCircle />,
  error: <FaExclamationCircle />,
  info: <FaInfoCircle />,
  warning: <FaExclamationTriangle />,
};

/**
 * Individual toast notification - Compact and clean design.
 * Renders with an icon, message, and dismiss button.
 */
export const Toast: React.FC<ToastProps> = memo(
  ({ t, message, type = 'info', icon, className = '' }) => {
    const IconNode = icon ?? iconMap[type];

    return (
      <div
        className={clsx(
          styles.toast,
          styles[type],
          className,
          t.visible && styles.visible,
        )}
        role={type === 'error' ? 'alert' : 'status'}
        aria-live={type === 'error' ? 'assertive' : 'polite'}
      >
        <div className={styles.icon}>
          <Icon size="md" color="inherit" decorative>
            {IconNode}
          </Icon>
        </div>
        <div className={styles.message}>{message}</div>
        <button
          onClick={() => hotToast.dismiss(t.id)}
          className={styles.closeButton}
          aria-label="Dismiss notification"
        >
          <FaTimes />
        </button>
      </div>
    );
  },
);

Toast.displayName = 'Toast';

export default Toast;