'use client';

import React from 'react';
import { useTheme } from 'next-themes';
import { FaSun, FaMoon } from 'react-icons/fa';
import clsx from 'clsx';
import { Button } from '@/shared/_components/atoms/Button';
import { Icon } from '@/shared/_components/atoms/Icon';
import styles from './ThemeSwitcher.module.css';

export type ThemeSwitcherVariant = 'icon' | 'text' | 'both';

export interface ThemeSwitcherProps {
  className?: string;
  variant?: ThemeSwitcherVariant;
  label?: string;
}

export const ThemeSwitcher: React.FC<ThemeSwitcherProps> = ({
  className = '',
  variant = 'icon',
  label,
}) => {
  const { setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div className={clsx(styles.placeholder, className)} />;
  }

  const isDark = resolvedTheme === 'dark';
  const defaultLabel = `Switch to ${isDark ? 'light' : 'dark'} mode`;
  const buttonLabel = label || defaultLabel;

  const handleToggle = () => {
    setTheme(isDark ? 'light' : 'dark');
  };

  const icon = isDark ? <FaSun /> : <FaMoon />;

  // Variant: icon only
  if (variant === 'icon') {
    return (
      <Button
        iconOnly
        variant="ghost"
        size="md"
        onClick={handleToggle}
        className={clsx(styles.themeButton, styles.iconOnly, className)}
        aria-label={buttonLabel}
        aria-pressed={isDark}
      >
        <Icon size="md" color="interactive" decorative>
          {icon}
        </Icon>
      </Button>
    );
  }

  // Variant: text only
  if (variant === 'text') {
    return (
      <Button
        variant="ghost"
        size="sm"
        onClick={handleToggle}
        className={clsx(styles.themeButton, styles.textOnly, className)}
        aria-label={buttonLabel}
        aria-pressed={isDark}
      >
        {isDark ? 'Light mode' : 'Dark mode'}
      </Button>
    );
  }

  // Variant: both icon + text
  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={handleToggle}
      className={clsx(styles.themeButton, styles.both, className)}
      aria-label={buttonLabel}
      aria-pressed={isDark}
      leftIcon={<Icon size="sm" color="interactive" decorative>{icon}</Icon>}
    >
      {isDark ? 'Light mode' : 'Dark mode'}
    </Button>
  );
};

ThemeSwitcher.displayName = 'ThemeSwitcher';

export default ThemeSwitcher;