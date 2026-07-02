import React, { forwardRef } from 'react';
import clsx from 'clsx';
import styles from './Divider.module.css';

export type DividerOrientation = 'horizontal' | 'vertical';
export type DividerVariant = 'full' | 'inset' | 'middle';
export type DividerLabelPosition = 'left' | 'center' | 'right';

export interface DividerProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * Orientation of the divider.
   * @default 'horizontal'
   */
  orientation?: DividerOrientation;
  /**
   * Visual style variant.
   * @default 'full'
   */
  variant?: DividerVariant;
  /**
   * Text or element to display in the middle (only for `middle` variant).
   */
  label?: React.ReactNode;
  /**
   * Position of the label when `variant='middle'`.
   * @default 'center'
   */
  labelPosition?: DividerLabelPosition;
  /**
   * Thickness of the divider line in pixels.
   * @default 1
   */
  thickness?: 1 | 2 | 3;
  /**
   * Additional CSS classes.
   */
  className?: string;
}

/**
 * Get the border width style based on thickness
 */
const getBorderWidth = (thickness: 1 | 2 | 3): string => {
  return `${thickness}px`;
};

/**
 * A reusable divider component for visual separation.
 * Supports horizontal/vertical orientation, full/inset/middle variants, and optional label.
 */
export const Divider = forwardRef<HTMLDivElement, DividerProps>(
  (
    {
      orientation = 'horizontal',
      variant = 'full',
      label,
      labelPosition = 'center',
      thickness = 1,
      className,
      ...restProps
    },
    ref,
  ) => {
    const isHorizontal = orientation === 'horizontal';
    const isVertical = orientation === 'vertical';

    // Validate: label only works with 'middle' variant
    if (label && variant !== 'middle') {
      console.warn('Divider: label prop is only supported when variant is "middle".');
    }

    // Validate: vertical orientation only works with 'full' or 'inset' (middle makes no sense)
    if (isVertical && variant === 'middle') {
      console.warn('Divider: "middle" variant is not supported for vertical orientation. Falling back to "full".');
    }

    const effectiveVariant = isVertical && variant === 'middle' ? 'full' : variant;

    // For vertical, only 'full' or 'inset' make sense
    const isInset = effectiveVariant === 'inset';
    const isFull = effectiveVariant === 'full';
    const isMiddle = effectiveVariant === 'middle' && !isVertical;

    const borderWidth = getBorderWidth(thickness);

    const containerClasses = clsx(
      styles.dividerContainer,
      {
        [styles.horizontal]: isHorizontal,
        [styles.vertical]: isVertical,
        [styles[`variant-${effectiveVariant}`]]: true,
        [styles.labelPositionLeft]: isMiddle && labelPosition === 'left',
        [styles.labelPositionCenter]: isMiddle && labelPosition === 'center',
        [styles.labelPositionRight]: isMiddle && labelPosition === 'right',
      },
      className,
    );

    return (
      <div
        ref={ref}
        className={containerClasses}
        {...restProps}
      >
        {isMiddle && label ? (
          <>
            <span
              className={styles.line}
              style={{ borderWidth }}
            />
            <span className={styles.label}>{label}</span>
            <span
              className={styles.line}
              style={{ borderWidth }}
            />
          </>
        ) : (
          <span
            className={styles.line}
            style={{ borderWidth }}
          />
        )}
      </div>
    );
  },
);

Divider.displayName = 'Divider';