'use client';

import React, { useId } from 'react';
import { FaSearch, FaTimes } from 'react-icons/fa';
import { Icon } from '@/shared/_components/atoms/Icon';
import styles from './SearchBar.module.css';

interface SearchBarProps {
  /** Current search value */
  value: string;
  /** Callback when the search value changes */
  onChange: (value: string) => void;
  /** Placeholder text (default: 'Search expenses...') */
  placeholder?: string;
  /** Accessible label (default: 'Search expenses') */
  ariaLabel?: string;
}

export function SearchBar({ value, onChange, placeholder = 'Search expenses...', ariaLabel = 'Search expenses' }: SearchBarProps) {
  const id = useId();
  const searchId = `search-${id}`;

  const handleClear = () => {
    onChange('');
  };

  return (
    <div className={styles.wrapper} role="search">
      <div className={styles.icon}>
        <Icon size="sm" color="muted" decorative>
          <FaSearch />
        </Icon>
      </div>
      <input
        id={searchId}
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={styles.input}
        aria-label={ariaLabel}
      />
      {value && (
        <button
          type="button"
          onClick={handleClear}
          className={styles.clearButton}
          aria-label="Clear search"
        >
          <Icon size="sm" color="muted" decorative>
            <FaTimes />
          </Icon>
        </button>
      )}
    </div>
  );
}

export default SearchBar;