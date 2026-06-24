'use client';

import { useState, useMemo, useCallback } from 'react';
import { SearchInput } from '@/shared/_components/molecules/SearchInput';
import { Typography } from '@/shared/_components/atoms/Typography';

// Memoized search results to prevent unnecessary re-renders
const MOCK_DATA = [
  'Expense Report Q1',
  'Team Dinner',
  'Office Supplies',
  'Client Meeting',
  'Travel Expenses',
  'Groceries',
  'Rent Payment',
  'Utilities',
  'Internet Bill',
  'Phone Bill',
];

export default function SearchExample() {
  const [searchTerm, setSearchTerm] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [results, setResults] = useState<string[]>([]);

  // Optimized search handler with useCallback
  const handleSearch = useCallback((value: string) => {
    setSearchTerm(value);
    
    if (!value.trim()) {
      setResults([]);
      setIsSearching(false);
      return;
    }

    setIsSearching(true);

    // Simulate API delay
    const timer = setTimeout(() => {
      const filtered = MOCK_DATA.filter((item) =>
        item.toLowerCase().includes(value.toLowerCase())
      );
      setResults(filtered);
      setIsSearching(false);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div style={{ maxWidth: '600px', margin: '2rem auto', padding: '2rem' }}>
      <Typography variant="h3" style={{ marginBottom: '1rem' }}>
        Search with Debounce (Smooth)
      </Typography>

      {/* Use defaultValue instead of value to avoid re-renders */}
      <SearchInput
        defaultValue={searchTerm}
        onChange={handleSearch}
        placeholder="Search expenses, groups, or people..."
        debounce={300}
        loading={isSearching}
        size="lg"
      />

      <div style={{ marginTop: '1rem' }}>
        <Typography variant="small" color="muted">
          Typing: &quot;{searchTerm || '...'}&quot;
        </Typography>
      </div>

      {results.length > 0 && (
        <div style={{ marginTop: '1rem' }}>
          <Typography variant="body" weight="semibold" style={{ marginBottom: '0.5rem' }}>
            Results ({results.length})
          </Typography>
          <ul style={{ listStyle: 'none', padding: 0 }}>
            {results.map((result, index) => (
              <li
                key={index}
                style={{
                  padding: '0.5rem',
                  borderBottom: '1px solid var(--color-border)',
                }}
              >
                {result}
              </li>
            ))}
          </ul>
        </div>
      )}

      {searchTerm && results.length === 0 && !isSearching && (
        <Typography variant="body" color="muted" style={{ marginTop: '1rem' }}>
          No results found for &quot;{searchTerm}&quot;
        </Typography>
      )}
    </div>
  );
}