import React from 'react';
import clsx from 'clsx';
import { HiDotsHorizontal } from 'react-icons/hi';
import { Typography } from '@/shared/_components/atoms/Typography';
import { Icon } from '@/shared/_components/atoms/Icon';
import styles from './Breadcrumb.module.css';

export interface BreadcrumbItem {
  label: string;
  href?: string;
  icon?: React.ReactNode;
}

export interface BreadcrumbProps extends React.HTMLAttributes<HTMLElement> {
  items: BreadcrumbItem[];
  separator?: React.ReactNode;
  'aria-label'?: string;
  maxItems?: number;
  renderLink?: (item: BreadcrumbItem, props: { className: string; children: React.ReactNode }) => React.ReactNode;
  collapsedEllipsis?: BreadcrumbItem;
  small?: boolean;
}

const getItemKey = (item: BreadcrumbItem, index: number): string => {
  return item.href ? `href-${item.href}` : `item-${index}-${item.label}`;
};

export const Breadcrumb: React.FC<BreadcrumbProps> = ({
  items,
  separator = '//',
  className,
  'aria-label': ariaLabel = 'Breadcrumb',
  maxItems,
  renderLink,
  collapsedEllipsis = { label: '…', icon: <HiDotsHorizontal /> },
  small = false,
  ...restProps
}) => {
  if (!items || items.length === 0) return null;

  let displayedItems = items;

  if (maxItems && items.length > maxItems) {
    const firstItems = items.slice(0, maxItems - 1);
    const lastItem = items[items.length - 1];
    displayedItems = [...firstItems, collapsedEllipsis, lastItem];
  }

  const renderItemContent = (item: BreadcrumbItem, isLast: boolean) => {
    const content = (
      <>
        {item.icon && (
          <Icon size="sm" color="muted" decorative className={styles.icon}>
            {item.icon}
          </Icon>
        )}
        <Typography
          variant={small ? 'small' : 'body'}
          color={isLast ? 'primary' : 'secondary'}
          weight={isLast ? 'medium' : 'normal'}
          className={styles.label}
        >
          {item.label}
        </Typography>
      </>
    );

    if (!isLast && item.href) {
      const linkProps = { className: styles.link, children: content };
      if (renderLink) {
        return renderLink(item, linkProps);
      }
      return (
        <a href={item.href} className={styles.link}>
          {content}
        </a>
      );
    }

    return (
      <span
        className={isLast ? styles.current : styles.link}
        aria-current={isLast ? 'page' : undefined}
      >
        {content}
      </span>
    );
  };

  return (
    <nav
      className={clsx(styles.breadcrumb, small && styles.small, className)}
      aria-label={ariaLabel}
      {...restProps}
    >
      <ol className={styles.list}>
        {displayedItems.map((item, index) => {
          const isLast = index === displayedItems.length - 1;
          return (
            <li key={getItemKey(item, index)} className={styles.item}>
              {renderItemContent(item, isLast)}
              {!isLast && (
                <span className={styles.separator} aria-hidden="true">
                  {separator}
                </span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
};

Breadcrumb.displayName = 'Breadcrumb';

export default Breadcrumb;