import React from 'react';
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
  /** If true, sets aria-hidden and ignores label. @default false */
  decorative?: boolean;
  /** The SVG element(s) to render. */
  children: React.ReactNode;
  /** Additional CSS classes. */
  className?: string;
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
  className?: string,
): string => {
  const isThemeColor = typeof color === 'string' && themeColorKeys.includes(color as ThemeColor);

  const classes = [
    styles.icon,
    styles[`size-${size}`],
    isThemeColor && styles[`color-${color as ThemeColor}`],
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return classes;
};

export const Icon = React.forwardRef<SVGSVGElement, IconProps>(
  (
    {
      size = 'md',
      color = 'default',
      label,
      decorative = false,
      className,
      children,
      ...restProps
    },
    ref,
  ) => {
    const isThemeColor =
      typeof color === 'string' && themeColorKeys.includes(color as ThemeColor);

    const classNames = buildClassName(size, color, className);

    // Inline style for custom color (non-theme)
    const style = !isThemeColor ? { color } : undefined;

    // Accessibility props
    const accessibilityProps = decorative
      ? { 'aria-hidden': true }
      : {
          role: 'img',
          'aria-label': label || undefined,
        };

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