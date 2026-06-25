'use client';

import React, { useState, useCallback, useMemo } from 'react';
import {
  FaUtensils,
  FaCar,
  FaFilm,
  FaShoppingBag,
  FaHome,
  FaCoffee,
  FaPlane,
  FaGift,
  FaLightbulb,
  FaHeart,
  FaMusic,
  FaGamepad,
  FaBook,
  FaBriefcase,
  FaGraduationCap,
  FaPizzaSlice,
  FaBeer,
  FaTshirt,
  FaDumbbell,
  FaBicycle,
} from 'react-icons/fa';
import { CategoryChip } from '@/shared/_components/molecules/CategoryChip';
import { Typography } from '@/shared/_components/atoms/Typography';
import { Divider } from '@/shared/_components/atoms/Divider';
import { ThemeSwitcher } from '@/shared/_components/molecules/ThemeSwitcher';
import { Button } from '@/shared/_components/atoms/Button';
import styles from './page.module.css';

// --- Category data for demos ---
const CATEGORIES = [
  { id: 'food', label: 'Food', icon: <FaUtensils /> },
  { id: 'transport', label: 'Transport', icon: <FaCar /> },
  { id: 'entertainment', label: 'Entertainment', icon: <FaFilm /> },
  { id: 'shopping', label: 'Shopping', icon: <FaShoppingBag /> },
  { id: 'utilities', label: 'Utilities', icon: <FaLightbulb /> },
  { id: 'rent', label: 'Rent', icon: <FaHome /> },
  { id: 'coffee', label: 'Coffee', icon: <FaCoffee /> },
  { id: 'travel', label: 'Travel', icon: <FaPlane /> },
  { id: 'gifts', label: 'Gifts', icon: <FaGift /> },
  { id: 'health', label: 'Health', icon: <FaHeart /> },
  { id: 'music', label: 'Music', icon: <FaMusic /> },
  { id: 'gaming', label: 'Gaming', icon: <FaGamepad /> },
  { id: 'books', label: 'Books', icon: <FaBook /> },
  { id: 'work', label: 'Work', icon: <FaBriefcase /> },
  { id: 'education', label: 'Education', icon: <FaGraduationCap /> },
  { id: 'pizza', label: 'Pizza', icon: <FaPizzaSlice /> },
  { id: 'drinks', label: 'Drinks', icon: <FaBeer /> },
  { id: 'clothing', label: 'Clothing', icon: <FaTshirt /> },
  { id: 'fitness', label: 'Fitness', icon: <FaDumbbell /> },
  { id: 'cycling', label: 'Cycling', icon: <FaBicycle /> },
];

export default function CategoryChipDemo() {
  // --- State for interactive demos ---
  const [selectedCategory, setSelectedCategory] = useState<string | null>('food');
  const [selectedCategories, setSelectedCategories] = useState<string[]>(['food', 'transport']);
  const [dismissedCategories, setDismissedCategories] = useState<string[]>([]);

  // --- Handlers ---
  const handleSingleSelect = useCallback((id: string) => {
    setSelectedCategory((prev) => (prev === id ? null : id));
  }, []);

  const handleMultiSelect = useCallback((id: string) => {
    setSelectedCategories((prev) =>
      prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id]
    );
  }, []);

  const handleDismiss = useCallback((id: string) => {
    setDismissedCategories((prev) => [...prev, id]);
  }, []);

  const handleResetDismissed = useCallback(() => {
    setDismissedCategories([]);
  }, []);

  // --- Visible categories (excluding dismissed) ---
  const visibleCategories = useMemo(() => {
    return CATEGORIES.filter((c) => !dismissedCategories.includes(c.id));
  }, [dismissedCategories]);

  // --- Demo groups ---
  const foodCategories = CATEGORIES.slice(0, 6);
  const allCategories = CATEGORIES;

  return (
    <div className={styles.container}>
      {/* Header */}
      <header className={styles.header}>
        <div className={styles.headerLeft}>
          <Typography variant="h1" color="primary">
            CategoryChip – Real‑World Demo
          </Typography>
          <Typography variant="body" color="secondary">
            Visual tags for categories, filters, and tags with interactive states
          </Typography>
        </div>
        <ThemeSwitcher variant="both" />
      </header>

      <Divider variant="middle" label="Basic Usage" thickness={2} />

      {/* --- Basic (label only) --- */}
      <section className={styles.section}>
        <Typography variant="h3" color="primary">
          Basic Chips (label only)
        </Typography>
        <div className={styles.chipGroup}>
          <CategoryChip label="Food" />
          <CategoryChip label="Transport" />
          <CategoryChip label="Entertainment" />
          <CategoryChip label="Shopping" />
          <CategoryChip label="Utilities" />
        </div>
        <div className={styles.codeBlock}>
          <Typography variant="small" color="secondary" className={styles.codeLabel}>
            Usage:
          </Typography>
          <pre className={styles.code}>
            {`<CategoryChip label="Food" />`}
          </pre>
        </div>
      </section>

      <Divider variant="middle" label="With Icons" thickness={2} />

      {/* --- With Icons --- */}
      <section className={styles.section}>
        <Typography variant="h3" color="primary">
          With Icons
        </Typography>
        <div className={styles.chipGroup}>
          {foodCategories.map((cat) => (
            <CategoryChip key={cat.id} label={cat.label} icon={cat.icon} />
          ))}
        </div>
        <div className={styles.codeBlock}>
          <Typography variant="small" color="secondary" className={styles.codeLabel}>
            Usage:
          </Typography>
          <pre className={styles.code}>
            {`<CategoryChip label="Food" icon={<FaUtensils />} />`}
          </pre>
        </div>
      </section>

      <Divider variant="middle" label="Interactive & Selected" thickness={2} />

      {/* --- Interactive & Selected (single select) --- */}
      <section className={styles.section}>
        <Typography variant="h3" color="primary">
          Interactive Chips (Single Select)
        </Typography>
        <Typography variant="body" color="secondary" className={styles.hint}>
          Click a chip to select/deselect it. Selected chips are highlighted.
        </Typography>
        <div className={styles.chipGroup}>
          {foodCategories.map((cat) => (
            <CategoryChip
              key={cat.id}
              label={cat.label}
              icon={cat.icon}
              interactive
              selected={selectedCategory === cat.id}
              onClick={() => handleSingleSelect(cat.id)}
            />
          ))}
        </div>
        <Typography variant="small" color="muted">
          Selected: <strong>{selectedCategory || 'None'}</strong>
        </Typography>
        <div className={styles.codeBlock}>
          <Typography variant="small" color="secondary" className={styles.codeLabel}>
            Usage:
          </Typography>
          <pre className={styles.code}>
            {`<CategoryChip
  label="Food"
  icon={<FaUtensils />}
  interactive
  selected={selectedCategory === 'food'}
  onClick={() => handleSelect('food')}
/>`}
          </pre>
        </div>
      </section>

      <Divider variant="middle" label="Multi-Select" thickness={2} />

      {/* --- Multi-select --- */}
      <section className={styles.section}>
        <Typography variant="h3" color="primary">
          Multi‑Select Chips
        </Typography>
        <Typography variant="body" color="secondary" className={styles.hint}>
          Click multiple chips. Selected chips show a checkmark.
        </Typography>
        <div className={styles.chipGroup}>
          {allCategories.slice(0, 8).map((cat) => (
            <CategoryChip
              key={cat.id}
              label={cat.label}
              icon={cat.icon}
              interactive
              selected={selectedCategories.includes(cat.id)}
              onClick={() => handleMultiSelect(cat.id)}
            />
          ))}
        </div>
        <Typography variant="small" color="muted">
          Selected: <strong>{selectedCategories.join(', ') || 'None'}</strong>
        </Typography>
        <div className={styles.codeBlock}>
          <Typography variant="small" color="secondary" className={styles.codeLabel}>
            Usage:
          </Typography>
          <pre className={styles.code}>
            {`<CategoryChip
  label="Food"
  icon={<FaUtensils />}
  interactive
  selected={selectedCategories.includes('food')}
  onClick={() => handleToggle('food')}
/>`}
          </pre>
        </div>
      </section>

      <Divider variant="middle" label="Dismissible Chips" thickness={2} />

      {/* --- Dismissible --- */}
      <section className={styles.section}>
        <Typography variant="h3" color="primary">
          Dismissible Chips (Filter Tags)
        </Typography>
        <Typography variant="body" color="secondary" className={styles.hint}>
          Each chip has a close button to remove it. Reset to restore all.
        </Typography>
        <div className={styles.chipGroup}>
          {visibleCategories.slice(0, 10).map((cat) => (
            <CategoryChip
              key={cat.id}
              label={cat.label}
              icon={cat.icon}
              dismissible
              onDismiss={() => handleDismiss(cat.id)}
            />
          ))}
        </div>
        <div className={styles.actions}>
          <Button variant="outline" size="sm" onClick={handleResetDismissed}>
            Reset all chips
          </Button>
          <Typography variant="small" color="muted">
            {dismissedCategories.length} chip(s) dismissed
          </Typography>
        </div>
        <div className={styles.codeBlock}>
          <Typography variant="small" color="secondary" className={styles.codeLabel}>
            Usage:
          </Typography>
          <pre className={styles.code}>
            {`<CategoryChip
  label="Food"
  icon={<FaUtensils />}
  dismissible
  onDismiss={() => handleDismiss('food')}
/>`}
          </pre>
        </div>
      </section>

      <Divider variant="middle" label="Size Variants" thickness={2} />

      {/* --- Sizes --- */}
      <section className={styles.section}>
        <Typography variant="h3" color="primary">
          Size Variants
        </Typography>
        <div className={styles.sizeGrid}>
          <div>
            <Typography variant="body" color="secondary" className={styles.sizeLabel}>
              Small (sm)
            </Typography>
            <CategoryChip label="Food" icon={<FaUtensils />} size="sm" interactive selected />
          </div>
          <div>
            <Typography variant="body" color="secondary" className={styles.sizeLabel}>
              Medium (md) – default
            </Typography>
            <CategoryChip label="Food" icon={<FaUtensils />} size="md" interactive selected />
          </div>
          <div>
            <Typography variant="body" color="secondary" className={styles.sizeLabel}>
              Large (lg)
            </Typography>
            <CategoryChip label="Food" icon={<FaUtensils />} size="lg" interactive selected />
          </div>
        </div>
        <div className={styles.codeBlock}>
          <Typography variant="small" color="secondary" className={styles.codeLabel}>
            Usage:
          </Typography>
          <pre className={styles.code}>
            {`<CategoryChip label="Food" icon={<FaUtensils />} size="lg" />`}
          </pre>
        </div>
      </section>

      <Divider variant="middle" label="States" thickness={2} />

      {/* --- States: disabled, etc. --- */}
      <section className={styles.section}>
        <Typography variant="h3" color="primary">
          States
        </Typography>
        <div className={styles.chipGroup}>
          <CategoryChip label="Default" />
          <CategoryChip label="Interactive" interactive />
          <CategoryChip label="Selected" interactive selected />
          <CategoryChip label="Disabled" disabled />
          <CategoryChip label="Disabled + Selected" disabled selected />
          <CategoryChip label="Dismissible" dismissible />
        </div>
        <div className={styles.codeBlock}>
          <Typography variant="small" color="secondary" className={styles.codeLabel}>
            Usage:
          </Typography>
          <pre className={styles.code}>
            {`<CategoryChip label="Disabled" disabled />
<CategoryChip label="Selected" interactive selected />`}
          </pre>
        </div>
      </section>

      <Divider variant="middle" label="Real‑World: Expense Filter Bar" thickness={2} />

      {/* --- Real‑world filter bar --- */}
      <section className={styles.section}>
        <Typography variant="h3" color="primary">
          Expense Filter Bar
        </Typography>
        <Typography variant="body" color="secondary" className={styles.hint}>
          Click chips to filter expenses by category (multi‑select).
        </Typography>
        <div className={styles.filterBar}>
          <Typography variant="body" color="secondary" className={styles.filterLabel}>
            Categories:
          </Typography>
          <div className={styles.chipGroup}>
            {allCategories.slice(0, 12).map((cat) => (
              <CategoryChip
                key={cat.id}
                label={cat.label}
                icon={cat.icon}
                size="sm"
                interactive
                selected={selectedCategories.includes(cat.id)}
                onClick={() => handleMultiSelect(cat.id)}
              />
            ))}
          </div>
        </div>
        <div className={styles.filterSummary}>
          <Typography variant="small" color="muted">
            Active filters: <strong>{selectedCategories.length}</strong>
          </Typography>
          {selectedCategories.length > 0 && (
            <Button variant="ghost" size="sm" onClick={() => setSelectedCategories([])}>
              Clear all
            </Button>
          )}
        </div>
        <div className={styles.codeBlock}>
          <Typography variant="small" color="secondary" className={styles.codeLabel}>
            Real‑world usage:
          </Typography>
          <pre className={styles.code}>
            {`// In your expense filter component
{allCategories.map((cat) => (
  <CategoryChip
    key={cat.id}
    label={cat.label}
    icon={cat.icon}
    size="sm"
    interactive
    selected={activeFilters.includes(cat.id)}
    onClick={() => toggleFilter(cat.id)}
  />
))}`}
          </pre>
        </div>
      </section>

      <Divider variant="middle" label="Customization & Accessibility" thickness={2} />

      {/* --- Customization & Accessibility --- */}
      <section className={styles.section}>
        <Typography variant="h3" color="primary">
          Customization &amp; Accessibility
        </Typography>
        <div className={styles.customGrid}>
          <div>
            <Typography variant="body" color="secondary" className={styles.customLabel}>
              With custom aria-label:
            </Typography>
            <CategoryChip
              label="Food"
              icon={<FaUtensils />}
              interactive
              ariaLabel="Food category filter"
            />
          </div>
          <div>
            <Typography variant="body" color="secondary" className={styles.customLabel}>
              With custom role (option):
            </Typography>
            <CategoryChip
              label="Transport"
              icon={<FaCar />}
              interactive
              role="option"
            />
          </div>
          <div>
            <Typography variant="body" color="secondary" className={styles.customLabel}>
              With custom className:
            </Typography>
            <CategoryChip
              label="Custom style"
              icon={<FaGift />}
              className={styles.customChip}
            />
          </div>
        </div>
        <div className={styles.codeBlock}>
          <Typography variant="small" color="secondary" className={styles.codeLabel}>
            Usage:
          </Typography>
          <pre className={styles.code}>
            {`<CategoryChip
  label="Food"
  icon={<FaUtensils />}
  interactive
  ariaLabel="Food category filter"
  role="option"
  className="my-custom-class"
/>`}
          </pre>
        </div>
      </section>

      <footer className={styles.footer}>
        <Typography variant="small" color="muted">
          CategoryChip Demo – Built with TrueSplit Design System
        </Typography>
      </footer>
    </div>
  );
}