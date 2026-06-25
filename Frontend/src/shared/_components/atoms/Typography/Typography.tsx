import React, { forwardRef, memo } from 'react';
import clsx from 'clsx';
import styles from './Typography.module.css';

export type TypographyVariant =
  | 'h1'
  | 'h2'
  | 'h3'
  | 'h4'
  | 'h5'
  | 'h6'
  | 'body'
  | 'small'
  | 'caption';

export type TypographyColor =
  | 'primary'
  | 'secondary'
  | 'muted'
  | 'success'
  | 'warning'
  | 'error'
  | 'info'
  | 'link';

export type TypographyWeight = 'normal' | 'medium' | 'semibold' | 'bold';

export type TypographyAlign = 'left' | 'center' | 'right' | 'justify';

export type TypographyTransform = 'none' | 'uppercase' | 'lowercase' | 'capitalize';

export interface TypographyProps
  extends React.HTMLAttributes<HTMLElement> {
  /**
   * Visual variant
   * @default 'body'
   */
  variant?: TypographyVariant;
  /**
   * Text color
   * @default 'primary'
   */
  color?: TypographyColor;
  /**
   * Font weight
   * @default 'normal'
   */
  weight?: TypographyWeight;
  /**
   * Text alignment
   * @default 'left'
   */
  align?: TypographyAlign;
  /**
   * Single-line truncation with ellipsis
   * @default false
   */
  truncate?: boolean;
  /**
   * Multi-line truncation (number of lines to show)
   * When set, overrides `truncate`
   */
  lineClamp?: number;
  /**
   * Text transformation
   * @default 'none'
   */
  transform?: TypographyTransform;
  /**
   * Letter spacing (use design tokens: tight, normal, wide)
   * @default 'normal'
   */
  letterSpacing?: 'tight' | 'normal' | 'wide';
  /**
   * Override the rendered HTML element
   */
  as?: React.ElementType;
  /**
   * For label elements: associates the label with an input
   */
  htmlFor?: string;
  /**
   * Children content
   */
  children: React.ReactNode;
  /**
   * Additional CSS classes
   */
  className?: string;
}

const variantElementMap: Record<TypographyVariant, React.ElementType> = {
  h1: 'h1',
  h2: 'h2',
  h3: 'h3',
  h4: 'h4',
  h5: 'h5',
  h6: 'h6',
  body: 'p',
  small: 'span',
  caption: 'span',
};

const buildClassName = (
  variant: TypographyVariant,
  color: TypographyColor,
  weight: TypographyWeight,
  align: TypographyAlign,
  truncate: boolean,
  transform: TypographyTransform,
  letterSpacing: 'tight' | 'normal' | 'wide',
  lineClamp?: number,
  className?: string,
): string => {
  return clsx(
    styles.root,
    styles[variant],
    styles[`color-${color}`],
    styles[`weight-${weight}`],
    styles[`align-${align}`],
    truncate && styles.truncate,
    transform !== 'none' && styles[`transform-${transform}`],
    styles[`letterSpacing-${letterSpacing}`],
    lineClamp && lineClamp > 0 && styles.lineClamp,
    className,
  );
};

const getLineClampStyle = (lineClamp: number): React.CSSProperties => {
  if (!lineClamp || lineClamp <= 0) return {};
  return {
    display: '-webkit-box',
    WebkitLineClamp: lineClamp,
    WebkitBoxOrient: 'vertical',
    overflow: 'hidden',
  } as React.CSSProperties;
};

export const Typography = forwardRef<HTMLElement, TypographyProps>(
  (
    {
      variant = 'body',
      color = 'primary',
      weight = 'normal',
      align = 'left',
      truncate = false,
      lineClamp,
      transform = 'none',
      letterSpacing = 'normal',
      as,
      className,
      children,
      ...restProps
    },
    ref,
  ) => {
    const Component = as || variantElementMap[variant] || 'p';

    // If lineClamp is provided, it overrides truncate
    const shouldTruncate = lineClamp !== undefined && lineClamp > 0 ? false : truncate;

    const classNames = buildClassName(
      variant,
      color,
      weight,
      align,
      shouldTruncate,
      transform,
      letterSpacing,
      lineClamp,
      className,
    );

    const lineClampStyle = getLineClampStyle(lineClamp || 0);

    // If truncate or lineClamp is set, add title attribute for accessibility
    const shouldHaveTitle = shouldTruncate || (lineClamp !== undefined && lineClamp > 0);
    const titleText = shouldHaveTitle && typeof children === 'string' ? children : undefined;

    return (
      <Component
        ref={ref as React.Ref<HTMLElement>}
        className={classNames}
        style={lineClampStyle}
        title={titleText}
        {...restProps}
      >
        {children}
      </Component>
    );
  },
);

Typography.displayName = 'Typography';

export default memo(Typography);