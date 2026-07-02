'use client';

import React, {
  useEffect,
  useRef,
  useCallback,
  useId,
  useMemo,
} from 'react';
import { createPortal } from 'react-dom';
import clsx from 'clsx';
import {
  FaTimes,
  FaExclamationTriangle,
  FaInfoCircle,
  FaCheckCircle,
} from 'react-icons/fa';
import { Typography } from '@/shared/_components/atoms/Typography';
import { Button } from '@/shared/_components/atoms/Button';
import { Icon } from '@/shared/_components/atoms/Icon';
import styles from './Modal.module.css';

export type ModalSize = 'sm' | 'md' | 'lg' | 'xl' | 'full';
export type ModalVariant =
  | 'default'
  | 'confirm'
  | 'delete'
  | 'success'
  | 'form'
  | 'info';

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: React.ReactNode;
  children: React.ReactNode;
  size?: ModalSize;
  showCloseButton?: boolean;
  closeOnOverlayClick?: boolean;
  closeOnEscape?: boolean;
  footer?: React.ReactNode;
  className?: string;
  overlayClassName?: string;
  container?: HTMLElement;

  // Variant props
  variant?: ModalVariant;
  onConfirm?: () => void;
  onCancel?: () => void;
  loading?: boolean;
  confirmLabel?: string;
  cancelLabel?: string;
}

// Counter for stacked modals (shared across instances)
let modalCounter = 0;

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  size = 'md',
  showCloseButton = true,
  closeOnOverlayClick = true,
  closeOnEscape = true,
  footer,
  className,
  overlayClassName,
  container,
  variant = 'default',
  onConfirm,
  onCancel,
  loading = false,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
}) => {
  const overlayRef = useRef<HTMLDivElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);
  const titleId = useId();
  const descriptionId = useId();

  // --- 1. Robust body scroll lock (clean counter logic) ---
  useEffect(() => {
    if (!isOpen) return;
    modalCounter++;
    document.body.style.overflow = 'hidden';
    return () => {
      modalCounter--;
      if (modalCounter === 0) {
        document.body.style.overflow = '';
      }
    };
  }, [isOpen]);

  // --- 2. hasDescription: detect any meaningful content ---
  const hasDescription = useMemo(() => {
    const nodes = React.Children.toArray(children);
    return nodes.some((node) => {
      if (typeof node === 'string') return node.trim().length > 0;
      // Any non‑string element is considered descriptive content
      return React.isValidElement(node);
    });
  }, [children]);

  // Close on Escape
  useEffect(() => {
    if (!isOpen || !closeOnEscape) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, closeOnEscape, onClose]);

  // Focus trap with MutationObserver for dynamic content
  useEffect(() => {
    if (!isOpen) return;
    const modalElement = modalRef.current;
    if (!modalElement) return;

    const focusableSelector =
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';

    let cleanupFocusTrap: (() => void) | undefined;

    const setupFocusTrap = () => {
      const focusableElements = modalElement.querySelectorAll(focusableSelector);
      if (!focusableElements || focusableElements.length === 0) return;

      const first = focusableElements[0] as HTMLElement;
      const last = focusableElements[focusableElements.length - 1] as HTMLElement;

      const handleTab = (e: KeyboardEvent) => {
        if (e.key !== 'Tab') return;
        if (e.shiftKey) {
          if (document.activeElement === first) {
            e.preventDefault();
            last.focus();
          }
        } else {
          if (document.activeElement === last) {
            e.preventDefault();
            first.focus();
          }
        }
      };

      document.addEventListener('keydown', handleTab);
      // Use requestAnimationFrame for smoother focus timing
      requestAnimationFrame(() => {
        first.focus();
      });
      return () => document.removeEventListener('keydown', handleTab);
    };

    cleanupFocusTrap = setupFocusTrap();

    const observer = new MutationObserver(() => {
      if (cleanupFocusTrap) cleanupFocusTrap();
      cleanupFocusTrap = setupFocusTrap();
    });

    observer.observe(modalElement, { childList: true, subtree: true });

    return () => {
      if (cleanupFocusTrap) cleanupFocusTrap();
      observer.disconnect();
    };
  }, [isOpen]);

  const handleOverlayClick = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (closeOnOverlayClick && e.target === overlayRef.current) {
        onClose();
      }
    },
    [closeOnOverlayClick, onClose]
  );

  const handleConfirm = useCallback(() => {
    onConfirm?.();
  }, [onConfirm]);

  const handleCancel = useCallback(() => {
    onCancel?.();
    onClose();
  }, [onCancel, onClose]);

  if (!isOpen) return null;

  // ---- Render footer based on variant ----
  const renderFooter = () => {
    if (footer) return footer;
    switch (variant) {
      case 'confirm':
        return (
          <>
            <Button variant="ghost" onClick={handleCancel} disabled={loading}>
              {cancelLabel}
            </Button>
            <Button variant="primary" onClick={handleConfirm} loading={loading}>
              {confirmLabel}
            </Button>
          </>
        );
      case 'delete':
        return (
          <>
            <Button variant="ghost" onClick={handleCancel} disabled={loading}>
              {cancelLabel}
            </Button>
            <Button variant="danger" onClick={handleConfirm} loading={loading}>
              {confirmLabel}
            </Button>
          </>
        );
      case 'success':
        return (
          <>
            <Button variant="ghost" onClick={handleCancel} disabled={loading}>
              {cancelLabel}
            </Button>
            <Button variant="success" onClick={handleConfirm} loading={loading}>
              {confirmLabel}
            </Button>
          </>
        );
      case 'form':
        return (
          <>
            <Button variant="ghost" onClick={handleCancel} disabled={loading}>
              {cancelLabel}
            </Button>
            <Button variant="success" onClick={handleConfirm} loading={loading}>
              {confirmLabel}
            </Button>
          </>
        );
      case 'info':
        return (
          <Button variant="primary" onClick={onClose}>
            Got it
          </Button>
        );
      default:
        return null;
    }
  };

  // ---- Render content based on variant ----
  const renderContent = () => {
    switch (variant) {
      case 'confirm':
        return (
          <>
            <div className={styles.confirmIconWrapper}>
              <Icon size="xl" color="warning" decorative>
                <FaExclamationTriangle />
              </Icon>
            </div>
            <Typography
              variant="body"
              color="secondary"
              className={styles.confirmDescription}
            >
              {children}
            </Typography>
          </>
        );
      case 'delete':
        return (
          <>
            <div className={styles.confirmIconWrapper}>
              <Icon size="xl" color="error" decorative>
                <FaExclamationTriangle />
              </Icon>
            </div>
            <Typography
              variant="body"
              color="secondary"
              className={styles.confirmDescription}
            >
              {children}
            </Typography>
          </>
        );
      case 'success':
        return (
          <>
            <div className={styles.confirmIconWrapper}>
              <Icon size="xl" color="success" decorative>
                <FaCheckCircle />
              </Icon>
            </div>
            <Typography
              variant="body"
              color="secondary"
              className={styles.confirmDescription}
            >
              {children}
            </Typography>
          </>
        );
      case 'info':
        return (
          <>
            <div className={styles.infoIconWrapper}>
              <Icon size="xl" color="info" decorative>
                <FaInfoCircle />
              </Icon>
            </div>
            <div className={styles.infoContent}>{children}</div>
          </>
        );
      default:
        return children;
    }
  };

  const footerContent = renderFooter();

  // --- 3. aria-describedby: set if there is any meaningful content ---
  const ariaDescribedBy = hasDescription ? descriptionId : undefined;

  const modalContent = (
    <div
      className={clsx(styles.overlay, overlayClassName)}
      ref={overlayRef}
      onClick={handleOverlayClick}
      role="presentation"
    >
      <div
        className={clsx(
          styles.modal,
          styles[`size-${size}`],
          variant === 'confirm' && styles.confirmModal,
          variant === 'delete' && styles.deleteModal,
          variant === 'success' && styles.successModal,
          variant === 'info' && styles.infoModal,
          variant === 'form' && styles.formModal,
          className
        )}
        ref={modalRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={title ? titleId : undefined}
        aria-describedby={ariaDescribedBy}
      >
        {(title || showCloseButton) && (
          <div className={styles.header}>
            {title && (
              <Typography
                as="h2"
                id={titleId}
                variant="h4"
                weight="semibold"
                color="primary"
                className={styles.title}
              >
                {title}
              </Typography>
            )}
            {showCloseButton && (
              <Button
                iconOnly
                variant="ghost"
                size="sm"
                onClick={onClose}
                className={styles.closeButton}
                aria-label="Close modal"
                disabled={loading}
              >
                <Icon size="md" color="muted" decorative>
                  <FaTimes />
                </Icon>
              </Button>
            )}
          </div>
        )}

        {ariaDescribedBy ? (
          <div id={descriptionId} className={styles.body}>
            {renderContent()}
          </div>
        ) : (
          <div className={styles.body}>{renderContent()}</div>
        )}

        {footerContent && <div className={styles.footer}>{footerContent}</div>}
      </div>
    </div>
  );

  return createPortal(modalContent, container || document.body);
};

Modal.displayName = 'Modal';

export default Modal;