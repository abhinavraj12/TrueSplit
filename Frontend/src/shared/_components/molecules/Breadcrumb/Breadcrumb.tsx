'use client';

import React, { memo } from 'react';
import clsx from 'clsx';
import { HiDotsHorizontal } from 'react-icons/hi';
import { Typography } from '@/shared/_components/atoms/Typography';
import { Icon } from '@/shared/_components/atoms/Icon';
import styles from './Breadcrumb.module.css';

export interface BreadcrumbItem {
  /** Display text */
  label: string;
  /** Optional URL (if omitted, item is non‑clickable) */
  href?: string;
  /** Optional icon */
  icon?: React.ReactNode;
}

export interface BreadcrumbProps extends React.HTMLAttributes<HTMLElement> {
  /** Array of breadcrumb items (required) */
  items: BreadcrumbItem[];
  /** Custom separator (default: '/') */
  separator?: React.ReactNode;
  /** Accessible label for the navigation (default: 'Breadcrumb') */
  'aria-label'?: string;
  /** Maximum number of items before collapsing (must be ≥ 2) */
  maxItems?: number;
  /** Custom link renderer for integration with routing libraries */
  renderLink?: (item: BreadcrumbItem, props: { className: string; children: React.ReactNode }) => React.ReactNode;
  /** Custom ellipsis item (default: { label: '…', icon: <HiDotsHorizontal /> }) */
  collapsedEllipsis?: BreadcrumbItem;
  /** Compact variant */
  small?: boolean;
  /** Additional CSS class */
  className?: string;
  /** Click handler for individual items (for analytics, etc.) */
  onItemClick?: (item: BreadcrumbItem, index: number) => void;
}

/**
 * Get a stable key for a breadcrumb item.
 */
const getItemKey = (item: BreadcrumbItem, index: number): string => {
  return item.href ? `href-${item.href}` : `item-${index}-${item.label}`;
};

/**
 * Breadcrumb – Hierarchical navigation with accessibility and responsive design.
 */
const BreadcrumbComponent: React.FC<BreadcrumbProps> = ({
  items,
  separator = '//',
  'aria-label': ariaLabel = 'Breadcrumb',
  maxItems,
  renderLink,
  collapsedEllipsis = { label: '…', icon: <HiDotsHorizontal /> },
  small = false,
  className,
  onItemClick,
  ...restProps
}) => {
  // Defensive check
  if (!items || items.length === 0) return null;

  // Validate maxItems
  if (maxItems !== undefined && maxItems < 2) {
    if (process.env.NODE_ENV === 'development') {
      console.warn('Breadcrumb: `maxItems` should be at least 2. Using default.');
    }
    // Use a safe default
    maxItems = 2;
  }

  let displayedItems = items;

  // Collapse logic
  if (maxItems && items.length > maxItems) {
    const firstItems = items.slice(0, maxItems - 1);
    const lastItem = items[items.length - 1];
    displayedItems = [...firstItems, collapsedEllipsis, lastItem];
  }

  /**
   * Render a single breadcrumb item.
   */
  const renderItem = (item: BreadcrumbItem, index: number, isLast: boolean) => {
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
          truncate
        >
          {item.label}
        </Typography>
      </>
    );

    // Handle click for tracking
    const handleClick = () => {
      onItemClick?.(item, index);
    };

    // Last item (current page) – non‑interactive with aria-current
    if (isLast) {
      return (
        <span
          className={clsx(styles.current, styles.labelWrapper)}
          aria-current="page"
        >
          {content}
        </span>
      );
    }

    // Non‑last item – interactive if href exists
    const isInteractive = !!item.href && !item.label.includes('…'); // Don't make ellipsis interactive

    if (isInteractive && item.href) {
      const linkProps = {
        className: clsx(styles.link, styles.labelWrapper),
        children: content,
        onClick: handleClick,
        'aria-label': `Navigate to ${item.label}`,
      };

      if (renderLink) {
        return renderLink(item, linkProps);
      }

      return (
        <a href={item.href} className={styles.link} onClick={handleClick}>
          {content}
        </a>
      );
    }

    // Non‑interactive (no href or ellipsis)
    return (
      <span
        className={clsx(
          styles.link,
          styles.nonInteractive,
          item.label === '…' && styles.ellipsisItem,
        )}
      >
        {content}
      </span>
    );
  };

  /**
   * Render a separator between items.
   */
  const renderSeparator = (key: string) => (
    <span key={`sep-${key}`} className={styles.separator} aria-hidden="true">
      <Typography variant={small ? 'small' : 'body'} color="muted">
        {separator}
      </Typography>
    </span>
  );

  return (
    <nav
      className={clsx(styles.breadcrumb, small && styles.small, className)}
      aria-label={ariaLabel}
      {...restProps}
    >
      <ol className={styles.list}>
        {displayedItems.map((item, index) => {
          const isLast = index === displayedItems.length - 1;
          const key = getItemKey(item, index);

          return (
            <li key={key} className={styles.item}>
              {renderItem(item, index, isLast)}
              {!isLast && renderSeparator(key)}
            </li>
          );
        })}
      </ol>
    </nav>
  );
};

BreadcrumbComponent.displayName = 'Breadcrumb';

export const Breadcrumb = memo(BreadcrumbComponent);
export default Breadcrumb;