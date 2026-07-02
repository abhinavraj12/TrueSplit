import React, { forwardRef, memo, useState, useEffect } from 'react';
import clsx from 'clsx';
import styles from './Skeleton.module.css';

export type SkeletonVariant =
  | 'text'
  | 'avatar'
  | 'card'
  | 'expense-card'
  | 'group-card'
  | 'user-card'
  | 'custom';

export interface SkeletonProps extends React.HTMLAttributes<HTMLElement> {
  /**
   * Visual variant of the skeleton
   * @default 'text'
   */
  variant?: SkeletonVariant;
  /**
   * Number of times to repeat the skeleton (for lists)
   * @default 1
   */
  count?: number;
  /**
   * Height for custom variant (applies to all variants via style)
   */
  height?: number | string;
  /**
   * Width for custom variant (applies to all variants via style)
   */
  width?: number | string;
  /**
   * Length of the text line (short, medium, small) – only for `text` variant
   */
  lineLength?: 'short' | 'medium' | 'small' | 'full';
  /**
   * Additional CSS classes
   */
  className?: string;
  /**
   * Delay in milliseconds before rendering (to avoid flicker)
   * @default 0
   */
  delay?: number;
  /**
   * Accessible label for screen readers (default: "Loading...")
   */
  ariaLabel?: string;
  /**
   * ID of an element that labels this skeleton
   */
  ariaLabelledBy?: string;
  /**
   * HTML element or React component to render as
   * @default 'div'
   */
  as?: React.ElementType;
}

// Helper to render a single skeleton item
const renderSkeletonItem = (
  variant: SkeletonVariant,
  height?: number | string,
  width?: number | string,
  lineLength: SkeletonProps['lineLength'] = 'full',
  className?: string,
  style?: React.CSSProperties,
  as?: React.ElementType,
) => {
  const Element = as || 'div';
  const baseStyle = { ...style };
  if (variant === 'custom' || variant === 'text') {
    if (height) baseStyle.height = height;
    if (width) baseStyle.width = width;
  }

  // Special case: user-card variant
  if (variant === 'user-card') {
    return (
      <Element className={clsx(styles.userCardLayout, className)} style={baseStyle}>
        <div className={clsx(styles.skeleton, styles.avatar)} />
        <div className={styles.userCardContent}>
          <div className={clsx(styles.skeleton, styles.line, styles.lineShort)} />
          <div className={clsx(styles.skeleton, styles.line, styles.lineMedium)} />
        </div>
      </Element>
    );
  }

  // Special case: expense-card variant
  if (variant === 'expense-card') {
    return (
      <Element className={clsx(styles.expenseCardLayout, className)} style={baseStyle}>
        <div className={styles.expenseCardLeft}>
          <div className={clsx(styles.skeleton, styles.avatarSmall)} />
          <div className={styles.expenseCardContent}>
            <div className={clsx(styles.skeleton, styles.line, styles.lineMedium)} />
            <div className={clsx(styles.skeleton, styles.line, styles.lineSmall)} />
          </div>
        </div>
        <div className={clsx(styles.skeleton, styles.line, styles.lineShort)} />
      </Element>
    );
  }

  // Special case: group-card variant
  if (variant === 'group-card') {
    return (
      <Element className={clsx(styles.groupCardLayout, className)} style={baseStyle}>
        <div className={styles.groupCardTop}>
          <div className={clsx(styles.skeleton, styles.avatarGroup)} />
          <div className={styles.groupCardContent}>
            <div className={clsx(styles.skeleton, styles.line, styles.lineMedium)} />
            <div className={clsx(styles.skeleton, styles.line, styles.lineSmall)} />
          </div>
        </div>
        <div className={styles.groupCardBottom}>
          <div className={clsx(styles.skeleton, styles.line, styles.lineShort)} />
          <div className={clsx(styles.skeleton, styles.line, styles.lineSmall)} />
        </div>
      </Element>
    );
  }

  // Default: standard skeleton item
  const lineLengthClass = variant === 'text' ? styles[`line${lineLength.charAt(0).toUpperCase() + lineLength.slice(1)}`] : undefined;
  return (
    <Element
      className={clsx(
        styles.skeleton,
        styles[variant],
        variant === 'custom' && styles.custom,
        variant === 'text' && lineLengthClass,
        className,
      )}
      style={baseStyle}
    />
  );
};

export const Skeleton = forwardRef<HTMLElement, SkeletonProps>(
  (
    {
      variant = 'text',
      count = 1,
      height,
      width,
      lineLength = 'full',
      className,
      delay = 0,
      ariaLabel = 'Loading...',
      ariaLabelledBy,
      as = 'div',
      style,
      ...restProps
    },
    ref,
  ) => {
    const [show, setShow] = useState(delay === 0);

    useEffect(() => {
      if (delay > 0) {
        const timer = setTimeout(() => setShow(true), delay);
        return () => clearTimeout(timer);
      }
    }, [delay]);

    if (!show) return null;

    const items = Array.from({ length: Math.max(0, count) }, (_, i) => i);

    // Don't render if count is 0 or negative
    if (count <= 0) return null;

    return (
      <div
        ref={ref as React.Ref<HTMLDivElement>}
        aria-hidden="true"
        role="presentation"
        aria-label={ariaLabel}
        aria-labelledby={ariaLabelledBy}
        className={styles.skeletonWrapper}
        {...restProps}
      >
        {items.map((index) => (
          <React.Fragment key={index}>
            {renderSkeletonItem(variant, height, width, lineLength, className, style, as)}
          </React.Fragment>
        ))}
      </div>
    );
  },
);

Skeleton.displayName = 'Skeleton';

export default memo(Skeleton);