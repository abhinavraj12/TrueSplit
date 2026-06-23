import React from 'react';
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

export interface TypographyProps
  extends React.HTMLAttributes<HTMLElement> {
  variant?: TypographyVariant;
  color?: TypographyColor;
  weight?: TypographyWeight;
  align?: TypographyAlign;
  truncate?: boolean;
  as?: React.ElementType;
  children?: React.ReactNode;
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
  className?: string,
): string => {
  const classes = [
    styles.root,
    styles[variant],
    styles[`color-${color}`],
    styles[`weight-${weight}`],
    styles[`align-${align}`],
    truncate && styles.truncate,
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return classes;
};

export const Typography = React.forwardRef<HTMLElement, TypographyProps>(
  (
    {
      variant = 'body',
      color = 'primary',
      weight = 'normal',
      align = 'left',
      truncate = false,
      as,
      className,
      children,
      ...restProps
    },
    ref,
  ) => {
    const Component = as || variantElementMap[variant] || 'p';

    const classNames = buildClassName(
      variant,
      color,
      weight,
      align,
      truncate,
      className,
    );

    // Cast ref to HTMLElement because the underlying element is always an HTML element.
    // This is safe because all possible components are HTML elements.
    return (
      <Component
        ref={ref as React.Ref<HTMLElement>}
        className={classNames}
        {...restProps}
      >
        {children}
      </Component>
    );
  },
);

Typography.displayName = 'Typography';