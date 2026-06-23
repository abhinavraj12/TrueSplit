import React, { forwardRef, memo } from 'react';
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

export interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
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
   * Height for custom variant
   */
  height?: number | string;
  /**
   * Width for custom variant
   */
  width?: number | string;
  /**
   * Additional CSS classes
   */
  className?: string;
}

/**
 * A reusable skeleton loader component for loading states.
 * Supports text, avatar, card, user-card, expense-card, group-card, and custom variants.
 */
export const Skeleton = forwardRef<HTMLDivElement, SkeletonProps>(
  (
    {
      variant = 'text',
      count = 1,
      height,
      width,
      className,
      style,
      ...restProps
    },
    ref,
  ) => {
    const items = Array.from({ length: count }, (_, i) => i);

    const getSkeletonStyle = (): React.CSSProperties => {
      const baseStyle: React.CSSProperties = { ...style };
      if (variant === 'custom' && (height || width)) {
        if (height) baseStyle.height = height;
        if (width) baseStyle.width = width;
      }
      return baseStyle;
    };

    const renderItem = (index: number) => {
      // Special case: user-card variant has a specific layout
      if (variant === 'user-card') {
        return (
          <div
            key={index}
            className={clsx(styles.userCardLayout, className)}
            ref={ref}
            {...restProps}
          >
            <div className={clsx(styles.skeleton, styles.avatar)} />
            <div className={styles.userCardContent}>
              <div className={clsx(styles.skeleton, styles.line, styles.lineShort)} />
              <div className={clsx(styles.skeleton, styles.line, styles.lineMedium)} />
            </div>
          </div>
        );
      }

      // Special case: expense-card variant has a specific layout
      if (variant === 'expense-card') {
        return (
          <div
            key={index}
            className={clsx(styles.expenseCardLayout, className)}
            ref={ref}
            {...restProps}
          >
            <div className={styles.expenseCardLeft}>
              <div className={clsx(styles.skeleton, styles.avatarSmall)} />
              <div className={styles.expenseCardContent}>
                <div className={clsx(styles.skeleton, styles.line, styles.lineMedium)} />
                <div className={clsx(styles.skeleton, styles.line, styles.lineSmall)} />
              </div>
            </div>
            <div className={clsx(styles.skeleton, styles.line, styles.lineShort)} />
          </div>
        );
      }

      // Special case: group-card variant has a specific layout
      if (variant === 'group-card') {
        return (
          <div
            key={index}
            className={clsx(styles.groupCardLayout, className)}
            ref={ref}
            {...restProps}
          >
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
          </div>
        );
      }

      // Default: standard skeleton items
      const itemStyle = variant === 'custom' ? getSkeletonStyle() : {};

      return (
        <div
          key={index}
          className={clsx(
            styles.skeleton,
            styles[variant],
            variant === 'custom' && styles.custom,
            className,
          )}
          style={itemStyle}
          ref={ref}
          {...restProps}
        />
      );
    };

    return <>{items.map(renderItem)}</>;
  },
);

Skeleton.displayName = 'Skeleton';

export default memo(Skeleton);