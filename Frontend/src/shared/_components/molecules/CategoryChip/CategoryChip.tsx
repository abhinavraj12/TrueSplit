import React from 'react';
import clsx from 'clsx';
import { Typography } from '@/shared/_components/atoms/Typography';
import { Icon } from '@/shared/_components/atoms/Icon';
import styles from './CategoryChip.module.css';

export type CategoryChipSize = 'sm' | 'md' | 'lg';

export interface CategoryChipProps extends React.HTMLAttributes<HTMLDivElement> {
  label: string;
  icon?: React.ReactNode;
  size?: CategoryChipSize;
  interactive?: boolean;
  selected?: boolean;
  disabled?: boolean;
  className?: string;
}

export const CategoryChip: React.FC<CategoryChipProps> = ({
  label,
  icon,
  size = 'md',
  interactive = false,
  selected = false,
  disabled = false,
  className,
  onClick,
  ...restProps
}) => {
  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (disabled || !interactive) return;
    onClick?.(e);
  };

  const iconSizeMap: Record<CategoryChipSize, 'sm' | 'md' | 'lg'> = {
    sm: 'sm',
    md: 'md',
    lg: 'lg',
  };

  const typographyVariantMap: Record<CategoryChipSize, 'small' | 'body' | 'h6'> = {
    sm: 'small',
    md: 'body',
    lg: 'h6',
  };

  return (
    <div
      className={clsx(
        styles.chip,
        styles[`size-${size}`],
        interactive && styles.interactive,
        selected && styles.selected,
        disabled && styles.disabled,
        className,
      )}
      onClick={handleClick}
      role={interactive ? 'button' : undefined}
      tabIndex={interactive && !disabled ? 0 : undefined}
      aria-disabled={disabled}
      aria-pressed={selected}
      {...restProps}
    >
      {icon && (
        <Icon
          size={iconSizeMap[size]}
          color={selected ? 'primary' : 'interactive'}
          className={styles.icon}
          decorative
        >
          {icon}
        </Icon>
      )}
      <Typography
        as="span"
        variant={typographyVariantMap[size]}
        weight={selected ? 'medium' : 'normal'}
        color={selected ? 'primary' : 'secondary'}
        className={styles.label}
        truncate
      >
        {label}
      </Typography>
    </div>
  );
};

CategoryChip.displayName = 'CategoryChip';

export default CategoryChip;