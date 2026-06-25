'use client';

import React, {
  useState,
  useRef,
  useEffect,
  useId,
  useCallback,
  memo,
  useMemo,
} from 'react';
import { createPortal } from 'react-dom';
import clsx from 'clsx';
import styles from './Tooltip.module.css';

export interface TooltipProps {
  /**
   * The trigger element that will show the tooltip on hover/focus/touch.
   */
  children: React.ReactNode;
  /**
   * The tooltip content. If falsy, the tooltip is not rendered.
   */
  content: React.ReactNode;
  /**
   * Preferred placement of the tooltip.
   * @default 'top'
   */
  placement?: 'top' | 'bottom' | 'left' | 'right';
  /**
   * Delay in milliseconds before showing the tooltip.
   * @default 200 (mouse), 100 (touch)
   */
  delay?: number;
  /**
   * Delay in milliseconds before hiding the tooltip.
   * @default 200
   */
  hideDelay?: number;
  /**
   * Offset (gap) in pixels between the trigger and the tooltip.
   * @default 8
   */
  offset?: number;
  /**
   * Maximum width of the tooltip in pixels.
   * @default 360
   */
  maxWidth?: number;
  /**
   * Additional CSS class for the trigger container.
   */
  className?: string;
  /**
   * If true, the tooltip will not be shown.
   * @default false
   */
  disabled?: boolean;
  /**
   * Custom ID for the tooltip element.
   */
  id?: string;
  /**
   * Callback when the tooltip opens or closes.
   */
  onOpenChange?: (open: boolean) => void;
  /**
   * If true, the tooltip will appear on click (touch) rather than hover.
   * @default false
   */
  interactive?: boolean;
}

const TooltipComponent: React.FC<TooltipProps> = ({
  children,
  content,
  placement = 'top',
  delay,
  hideDelay = 200,
  offset = 8,
  maxWidth = 360,
  className,
  disabled = false,
  id: externalId,
  onOpenChange,
}) => {
  const generatedId = useId();
  const tooltipId = externalId || `tooltip-${generatedId}`;
  const [visible, setVisible] = useState(false);
  const [delayedVisible, setDelayedVisible] = useState(false);
  const [position, setPosition] = useState({ top: 0, left: 0 });
  const triggerRef = useRef<HTMLDivElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);
  const showTimeout = useRef<NodeJS.Timeout | null>(null);
  const hideTimeout = useRef<NodeJS.Timeout | null>(null);
  const isMounted = useRef(true);

  // Determine actual delay based on device type
  const getShowDelay = useCallback(() => {
    if (delay !== undefined) return delay;
    // Use shorter delay for touch devices
    return 'ontouchstart' in window ? 100 : 200;
  }, [delay]);

  // Update position
  const updatePosition = useCallback(() => {
    if (!triggerRef.current || !tooltipRef.current) return;
    const triggerRect = triggerRef.current.getBoundingClientRect();
    const tooltipRect = tooltipRef.current.getBoundingClientRect();
    const gap = offset;
    let top = 0;
    let left = 0;

    switch (placement) {
      case 'top':
        top = triggerRect.top - tooltipRect.height - gap + window.scrollY;
        left = triggerRect.left + triggerRect.width / 2 + window.scrollX;
        break;
      case 'bottom':
        top = triggerRect.bottom + gap + window.scrollY;
        left = triggerRect.left + triggerRect.width / 2 + window.scrollX;
        break;
      case 'left':
        top = triggerRect.top + triggerRect.height / 2 + window.scrollY;
        left = triggerRect.left - tooltipRect.width - gap + window.scrollX;
        break;
      case 'right':
        top = triggerRect.top + triggerRect.height / 2 + window.scrollY;
        left = triggerRect.right + gap + window.scrollX;
        break;
    }

    // Keep within viewport
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    if (left + tooltipRect.width > viewportWidth + window.scrollX) {
      left = viewportWidth + window.scrollX - tooltipRect.width;
    }
    if (left < window.scrollX) left = window.scrollX;
    if (top + tooltipRect.height > viewportHeight + window.scrollY) {
      top = viewportHeight + window.scrollY - tooltipRect.height;
    }
    if (top < window.scrollY) top = window.scrollY;

    setPosition({ top, left });
  }, [placement, offset]);

  // Show/hide with delay
  const showTooltip = useCallback(() => {
    if (disabled || !content) return;
    if (hideTimeout.current) clearTimeout(hideTimeout.current);
    const showDelay = getShowDelay();
    showTimeout.current = setTimeout(() => {
      if (isMounted.current) {
        setDelayedVisible(true);
        onOpenChange?.(true);
        requestAnimationFrame(updatePosition);
      }
    }, showDelay);
  }, [disabled, content, getShowDelay, updatePosition, onOpenChange]);

  const hideTooltip = useCallback(() => {
    if (showTimeout.current) clearTimeout(showTimeout.current);
    hideTimeout.current = setTimeout(() => {
      if (isMounted.current) {
        setDelayedVisible(false);
        onOpenChange?.(false);
      }
    }, hideDelay);
  }, [hideDelay, onOpenChange]);

  // Cancel hide (e.g., when hovering over the tooltip itself)
  const cancelHide = useCallback(() => {
    if (hideTimeout.current) {
      clearTimeout(hideTimeout.current);
      hideTimeout.current = null;
    }
  }, []);

  // Force hide immediately (for Escape key)
  const forceHide = useCallback(() => {
    if (showTimeout.current) clearTimeout(showTimeout.current);
    if (hideTimeout.current) clearTimeout(hideTimeout.current);
    if (isMounted.current) {
      setDelayedVisible(false);
      onOpenChange?.(false);
    }
  }, [onOpenChange]);

  // Mouse enter/leave on trigger
  const handleMouseEnter = useCallback(() => {
    setVisible(true);
    showTooltip();
  }, [showTooltip]);

  const handleMouseLeave = useCallback(() => {
    setVisible(false);
    hideTooltip();
  }, [hideTooltip]);

  // Touch support
  const handleTouchStart = useCallback(
    (e: React.TouchEvent) => {
      if (disabled || !content) return;
      // If already visible, hide it (toggle)
      if (delayedVisible) {
        forceHide();
        return;
      }
      // Otherwise show
      setVisible(true);
      // Use a shorter delay for touch
      const showDelay = Math.min(getShowDelay(), 100);
      if (showTimeout.current) clearTimeout(showTimeout.current);
      showTimeout.current = setTimeout(() => {
        if (isMounted.current) {
          setDelayedVisible(true);
          onOpenChange?.(true);
          requestAnimationFrame(updatePosition);
        }
      }, showDelay);
    },
    [disabled, content, delayedVisible, forceHide, getShowDelay, updatePosition, onOpenChange],
  );

  // Click outside to hide (for touch)
  useEffect(() => {
    if (!delayedVisible) return;
    const handleClickOutside = (e: MouseEvent | TouchEvent) => {
      const target = e.target as Node;
      if (
        triggerRef.current &&
        !triggerRef.current.contains(target) &&
        tooltipRef.current &&
        !tooltipRef.current.contains(target)
      ) {
        forceHide();
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('touchstart', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, [delayedVisible, forceHide]);

  // Escape key to hide
  useEffect(() => {
    if (!delayedVisible) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        forceHide();
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [delayedVisible, forceHide]);

  // Update position on scroll/resize
  useEffect(() => {
    if (!delayedVisible) return;
    const handleUpdate = () => {
      requestAnimationFrame(updatePosition);
    };
    window.addEventListener('scroll', handleUpdate, true);
    window.addEventListener('resize', handleUpdate);
    return () => {
      window.removeEventListener('scroll', handleUpdate, true);
      window.removeEventListener('resize', handleUpdate);
    };
  }, [delayedVisible, updatePosition]);

  // Cleanup timeouts on unmount
  useEffect(() => {
    isMounted.current = true;
    return () => {
      isMounted.current = false;
      if (showTimeout.current) clearTimeout(showTimeout.current);
      if (hideTimeout.current) clearTimeout(hideTimeout.current);
    };
  }, []);

  // Memoize transform style based on placement
  const transformStyle = useMemo(() => {
    if (placement === 'top' || placement === 'bottom') {
      return 'translateX(-50%)';
    }
    return 'translateY(-50%)';
  }, [placement]);

  // If content is falsy, just render children (no tooltip)
  if (!content) {
    return <>{children}</>;
  }

  return (
    <>
      <div
        ref={triggerRef}
        className={clsx(styles.tooltipContainer, className)}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onTouchStart={handleTouchStart}
        onFocus={handleMouseEnter}
        onBlur={handleMouseLeave}
        aria-describedby={delayedVisible ? tooltipId : undefined}
        // Prevent context menu on touch devices if needed
      >
        {children}
      </div>
      {delayedVisible && !disabled &&
        createPortal(
          <div
            id={tooltipId}
            role="tooltip"
            ref={tooltipRef}
            className={clsx(
              styles.tooltip,
              styles[`tooltip-${placement}`],
              styles.tooltipVisible,
            )}
            style={{
              top: position.top,
              left: position.left,
              transform: transformStyle,
              maxWidth: maxWidth,
            }}
            onMouseEnter={cancelHide}
            onMouseLeave={handleMouseLeave}
          >
            {content}
          </div>,
          document.body,
        )}
    </>
  );
};

TooltipComponent.displayName = 'Tooltip';

export const Tooltip = memo(TooltipComponent);
export default Tooltip;