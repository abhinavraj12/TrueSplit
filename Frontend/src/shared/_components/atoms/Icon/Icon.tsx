import React, { forwardRef, memo } from 'react';
import styles from './Icon.module.css';

export type IconSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

export type ThemeColor =
  | 'default'
  | 'muted'
  | 'interactive'
  | 'primary'
  | 'success'
  | 'warning'
  | 'error'
  | 'info'
  | 'link';

export type IconColor = ThemeColor | string;

export interface IconProps extends React.SVGAttributes<SVGSVGElement> {
  /** Icon size based on design tokens. @default 'md' */
  size?: IconSize;
  /** Color – either a theme key or any CSS color string. @default 'default' */
  color?: IconColor;
  /** Accessible label for screen readers (ignored when decorative). */
  label?: string;
  /** ID of element that labels this icon (for aria-labelledby). */
  labelledBy?: string;
  /** If true, sets aria-hidden and ignores label. @default false */
  decorative?: boolean;
  /** The SVG element(s) to render. */
  children: React.ReactNode;
  /** Additional CSS classes. */
  className?: string;
  /** If true, adds a spin animation (for loading states). */
  spin?: boolean;
  /** If true, adds a pulse animation (for attention). */
  pulse?: boolean;
}

/** List of predefined theme colors */
const themeColorKeys: ThemeColor[] = [
  'default',
  'muted',
  'interactive',
  'primary',
  'success',
  'warning',
  'error',
  'info',
  'link',
];

/**
 * Build the class name string for the icon.
 */
const buildClassName = (
  size: IconSize,
  color: IconColor,
  spin: boolean,
  pulse: boolean,
  className?: string,
): string => {
  const isThemeColor = typeof color === 'string' && themeColorKeys.includes(color as ThemeColor);

  const classes = [
    styles.icon,
    styles[`size-${size}`],
    isThemeColor && styles[`color-${color as ThemeColor}`],
    spin && styles.spin,
    pulse && styles.pulse,
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return classes;
};

export const Icon = forwardRef<SVGSVGElement, IconProps>(
  (
    {
      size = 'md',
      color = 'default',
      label,
      labelledBy,
      decorative = false,
      className,
      children,
      spin = false,
      pulse = false,
      ...restProps
    },
    ref,
  ) => {
    // Development warning for missing children
    if (process.env.NODE_ENV === 'development' && !children) {
      console.warn('Icon: No children provided. Please pass an SVG element.');
    }

    const isThemeColor =
      typeof color === 'string' && themeColorKeys.includes(color as ThemeColor);

    const classNames = buildClassName(size, color, spin, pulse, className);

    // Determine accessibility props
    let accessibilityProps: {
      'aria-hidden'?: boolean;
      role?: string;
      'aria-label'?: string;
      'aria-labelledby'?: string;
    };

    if (decorative) {
      accessibilityProps = {
        'aria-hidden': true,
        role: 'presentation',
      };
    } else {
      accessibilityProps = {
        role: 'img',
      };
      if (labelledBy) {
        accessibilityProps['aria-labelledby'] = labelledBy;
      } else if (label) {
        accessibilityProps['aria-label'] = label;
      }
    }

    // For theme colors, apply the color via CSS variable (controlled by theme)
    // For custom colors, apply via inline style
    const style: React.CSSProperties = {};
    if (!isThemeColor && color) {
      style.color = color;
    }

    return (
      <svg
        ref={ref}
        className={classNames}
        style={style}
        {...accessibilityProps}
        {...restProps}
      >
        {children}
      </svg>
    );
  },
);

Icon.displayName = 'Icon';

// Memoize to prevent unnecessary re‑renders
export default memo(Icon);