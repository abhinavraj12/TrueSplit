import React, { forwardRef, memo, useState, useEffect } from 'react';
import clsx from 'clsx';
import styles from './Spinner.module.css';

export type SpinnerSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';
export type SpinnerColor = 'default' | 'primary' | 'success' | 'warning' | 'error' | 'info' | 'link';
export type SpinnerSpeed = 'slow' | 'normal' | 'fast';

export interface SpinnerProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * Size variant
   * @default 'md'
   */
  size?: SpinnerSize;
  /**
   * Color variant
   * @default 'default'
   */
  color?: SpinnerColor;
  /**
   * Animation speed
   * @default 'normal'
   */
  speed?: SpinnerSpeed;
  /**
   * Accessible label for screen readers
   * @default 'Loading...'
   */
  label?: string;
  /**
   * If true, hides the spinner from screen readers (decorative)
   * @default false
   */
  decorative?: boolean;
  /**
   * Delay in milliseconds before showing the spinner (to avoid flicker)
   * @default 0
   */
  delay?: number;
  /**
   * Thickness of the spinner arc in pixels
   * @default undefined (uses default based on size)
   */
  thickness?: number;
  /**
   * Additional CSS classes
   */
  className?: string;
}

const SpinnerComponent = forwardRef<HTMLDivElement, SpinnerProps>(
  (
    {
      size = 'md',
      color = 'default',
      speed = 'normal',
      label = 'Loading...',
      decorative = false,
      delay = 0,
      thickness,
      className,
      ...restProps
    },
    ref,
  ) => {
    const [show, setShow] = useState(delay === 0);

    // Development warning for empty label (only when not decorative)
    if (process.env.NODE_ENV === 'development' && !decorative && !label) {
      console.warn(
        'Spinner: `label` prop is empty. Please provide an accessible label for screen readers.',
      );
    }

    useEffect(() => {
      if (delay > 0) {
        const timer = setTimeout(() => setShow(true), delay);
        return () => clearTimeout(timer);
      }
    }, [delay]);

    if (!show) return null;

    const classNames = clsx(
      styles.spinner,
      styles[`size-${size}`],
      styles[`color-${color}`],
      styles[`speed-${speed}`],
      className,
    );

    // Size-to-pixel mapping for SVG viewBox and stroke width
    const sizeMap: Record<SpinnerSize, number> = {
      xs: 16,
      sm: 20,
      md: 28,
      lg: 36,
      xl: 44,
    };

    const pixelSize = sizeMap[size];
    const strokeWidth = thickness || (size === 'xs' ? 2 : size === 'sm' ? 2.5 : size === 'md' ? 3 : size === 'lg' ? 3.5 : 4);
    const radius = (pixelSize - strokeWidth) / 2;
    const circumference = 2 * Math.PI * radius;

    // If decorative, hide from screen readers
    const accessibilityProps = decorative
      ? {
          'aria-hidden': true,
          role: 'presentation',
        }
      : {
          role: 'status',
          'aria-label': label,
          'aria-live': 'polite' as const,
        };

    return (
      <div
        ref={ref}
        className={classNames}
        {...accessibilityProps}
        {...restProps}
      >
        <svg
          className={styles.svg}
          viewBox={`0 0 ${pixelSize} ${pixelSize}`}
          width={pixelSize}
          height={pixelSize}
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Track circle */}
          <circle
            className={styles.track}
            cx={pixelSize / 2}
            cy={pixelSize / 2}
            r={radius}
            strokeWidth={strokeWidth}
            fill="none"
          />
          {/* Animated arc */}
          <circle
            className={styles.arc}
            cx={pixelSize / 2}
            cy={pixelSize / 2}
            r={radius}
            strokeWidth={strokeWidth}
            fill="none"
            strokeDasharray={circumference}
            strokeDashoffset={circumference * 0.75}
            strokeLinecap="round"
          />
        </svg>
        {!decorative && <span className={styles.srOnly}>{label}</span>}
      </div>
    );
  },
);

SpinnerComponent.displayName = 'Spinner';

export const Spinner = memo(SpinnerComponent);
export default Spinner;