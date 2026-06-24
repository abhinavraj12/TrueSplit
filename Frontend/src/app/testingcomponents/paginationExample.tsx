'use client';

import { useState } from 'react';
import { Pagination } from '@/shared/_components/molecules/Pagination';
import { Typography } from '@/shared/_components/atoms/Typography';
import { Button } from '@/shared/_components/atoms/Button';

// Mock data for pagination demo
const MOCK_ITEMS = Array.from({ length: 97 }, (_, i) => ({
  id: i + 1,
  title: `Item ${i + 1}`,
  description: `Description for item ${i + 1}`,
}));

const ITEMS_PER_PAGE = 10;

export default function PaginationExample() {
  const [page1, setPage1] = useState(1);
  const [page2, setPage2] = useState(3);
  const [page3, setPage3] = useState(1);
  const [page4, setPage4] = useState(1);
  const [page5, setPage5] = useState(1);
  const [currentDemoPage, setCurrentDemoPage] = useState(1);

  const totalPages = Math.ceil(MOCK_ITEMS.length / ITEMS_PER_PAGE);

  // Get current items for demo
  const startIndex = (currentDemoPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentItems = MOCK_ITEMS.slice(startIndex, endIndex);

  return (
    <div style={{ maxWidth: '1000px', margin: '2rem auto', padding: '2rem' }}>
      <Typography variant="h1" color="primary" weight="bold" style={{ marginBottom: '0.5rem' }}>
        Pagination Testing
      </Typography>
      <Typography variant="body" color="secondary" style={{ marginBottom: '2rem' }}>
        Comprehensive testing page for the Pagination molecule
      </Typography>

      {/* ===== Basic ===== */}
      <div
        style={{
          padding: '1.5rem',
          backgroundColor: 'var(--color-bg-surface)',
          borderRadius: 'var(--radius-lg)',
          border: '1px solid var(--color-border)',
          marginBottom: '1.5rem',
        }}
      >
        <Typography variant="h4" color="primary" weight="semibold" style={{ marginBottom: '0.5rem' }}>
          Basic
        </Typography>
        <Typography variant="small" color="muted" style={{ marginBottom: '1rem' }}>
          Simple pagination with 10 pages
        </Typography>
        <Pagination
          currentPage={page1}
          totalPages={10}
          onPageChange={setPage1}
        />
        <Typography variant="small" color="muted" style={{ marginTop: '0.5rem' }}>
          Current page: {page1} of 10
        </Typography>
      </div>

      {/* ===== With Sibling Count ===== */}
      <div
        style={{
          padding: '1.5rem',
          backgroundColor: 'var(--color-bg-surface)',
          borderRadius: 'var(--radius-lg)',
          border: '1px solid var(--color-border)',
          marginBottom: '1.5rem',
        }}
      >
        <Typography variant="h4" color="primary" weight="semibold" style={{ marginBottom: '0.5rem' }}>
          With Sibling Count (2)
        </Typography>
        <Typography variant="small" color="muted" style={{ marginBottom: '1rem' }}>
          Shows 2 siblings on each side of the current page
        </Typography>
        <Pagination
          currentPage={page2}
          totalPages={20}
          onPageChange={setPage2}
          siblingCount={2}
        />
        <Typography variant="small" color="muted" style={{ marginTop: '0.5rem' }}>
          Current page: {page2} of 20
        </Typography>
      </div>

      {/* ===== Without First/Last ===== */}
      <div
        style={{
          padding: '1.5rem',
          backgroundColor: 'var(--color-bg-surface)',
          borderRadius: 'var(--radius-lg)',
          border: '1px solid var(--color-border)',
          marginBottom: '1.5rem',
        }}
      >
        <Typography variant="h4" color="primary" weight="semibold" style={{ marginBottom: '0.5rem' }}>
          Without First/Last Buttons
        </Typography>
        <Typography variant="small" color="muted" style={{ marginBottom: '1rem' }}>
          Only Previous, Next, and page numbers
        </Typography>
        <Pagination
          currentPage={page3}
          totalPages={15}
          onPageChange={setPage3}
          showFirstLast={false}
        />
        <Typography variant="small" color="muted" style={{ marginTop: '0.5rem' }}>
          Current page: {page3} of 15
        </Typography>
      </div>

      {/* ===== Without Prev/Next ===== */}
      <div
        style={{
          padding: '1.5rem',
          backgroundColor: 'var(--color-bg-surface)',
          borderRadius: 'var(--radius-lg)',
          border: '1px solid var(--color-border)',
          marginBottom: '1.5rem',
        }}
      >
        <Typography variant="h4" color="primary" weight="semibold" style={{ marginBottom: '0.5rem' }}>
          Without Prev/Next Buttons
        </Typography>
        <Typography variant="small" color="muted" style={{ marginBottom: '1rem' }}>
          Only First, Last, and page numbers
        </Typography>
        <Pagination
          currentPage={page4}
          totalPages={15}
          onPageChange={setPage4}
          showPrevNext={false}
        />
        <Typography variant="small" color="muted" style={{ marginTop: '0.5rem' }}>
          Current page: {page4} of 15
        </Typography>
      </div>

      {/* ===== Sizes ===== */}
      <div
        style={{
          padding: '1.5rem',
          backgroundColor: 'var(--color-bg-surface)',
          borderRadius: 'var(--radius-lg)',
          border: '1px solid var(--color-border)',
          marginBottom: '1.5rem',
        }}
      >
        <Typography variant="h4" color="primary" weight="semibold" style={{ marginBottom: '0.5rem' }}>
          Sizes
        </Typography>
        <Typography variant="small" color="muted" style={{ marginBottom: '1rem' }}>
          Small, Medium, Large variants
        </Typography>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div>
            <Typography variant="small" color="muted" style={{ marginBottom: '0.25rem' }}>
              Small
            </Typography>
            <Pagination
              currentPage={3}
              totalPages={10}
              onPageChange={() => {}}
              size="sm"
            />
          </div>
          <div>
            <Typography variant="small" color="muted" style={{ marginBottom: '0.25rem' }}>
              Medium
            </Typography>
            <Pagination
              currentPage={5}
              totalPages={10}
              onPageChange={() => {}}
              size="md"
            />
          </div>
          <div>
            <Typography variant="small" color="muted" style={{ marginBottom: '0.25rem' }}>
              Large
            </Typography>
            <Pagination
              currentPage={7}
              totalPages={10}
              onPageChange={() => {}}
              size="lg"
            />
          </div>
        </div>
      </div>

      {/* ===== Real World Example ===== */}
      <div
        style={{
          padding: '1.5rem',
          backgroundColor: 'var(--color-bg-surface)',
          borderRadius: 'var(--radius-lg)',
          border: '1px solid var(--color-border)',
          marginBottom: '1.5rem',
        }}
      >
        <Typography variant="h4" color="primary" weight="semibold" style={{ marginBottom: '0.5rem' }}>
          Real World Example
        </Typography>
        <Typography variant="small" color="muted" style={{ marginBottom: '1rem' }}>
          Pagination with mock data list
        </Typography>

        {/* Items List */}
        <div
          style={{
            backgroundColor: 'var(--color-bg-elevated)',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--color-border)',
            marginBottom: '1rem',
            maxHeight: '300px',
            overflowY: 'auto',
          }}
        >
          {currentItems.map((item) => (
            <div
              key={item.id}
              style={{
                padding: '0.75rem 1rem',
                borderBottom: '1px solid var(--color-divider)',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <Typography variant="body" color="primary" weight="medium">
                {item.title}
              </Typography>
              <Typography variant="small" color="muted">
                {item.description}
              </Typography>
            </div>
          ))}
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
          <Typography variant="small" color="muted">
            Showing {startIndex + 1}–{Math.min(endIndex, MOCK_ITEMS.length)} of {MOCK_ITEMS.length} items
          </Typography>
          <Pagination
            currentPage={currentDemoPage}
            totalPages={totalPages}
            onPageChange={setCurrentDemoPage}
            siblingCount={1}
          />
        </div>
      </div>

      {/* ===== Edge Cases ===== */}
      <div
        style={{
          padding: '1.5rem',
          backgroundColor: 'var(--color-bg-surface)',
          borderRadius: 'var(--radius-lg)',
          border: '1px solid var(--color-border)',
          marginBottom: '1.5rem',
        }}
      >
        <Typography variant="h4" color="primary" weight="semibold" style={{ marginBottom: '0.5rem' }}>
          Edge Cases
        </Typography>
        <Typography variant="small" color="muted" style={{ marginBottom: '1rem' }}>
          Testing boundary conditions
        </Typography>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <div>
            <Typography variant="small" color="muted" style={{ marginBottom: '0.25rem' }}>
              Single Page
            </Typography>
            <Pagination
              currentPage={1}
              totalPages={1}
              onPageChange={() => {}}
            />
            <Typography variant="small" color="muted" style={{ marginTop: '0.25rem' }}>
              (Renders nothing — correct behavior)
            </Typography>
          </div>

          <div>
            <Typography variant="small" color="muted" style={{ marginBottom: '0.25rem' }}>
              First Page (1 of 10)
            </Typography>
            <Pagination
              currentPage={1}
              totalPages={10}
              onPageChange={() => {}}
            />
          </div>

          <div>
            <Typography variant="small" color="muted" style={{ marginBottom: '0.25rem' }}>
              Last Page (10 of 10)
            </Typography>
            <Pagination
              currentPage={10}
              totalPages={10}
              onPageChange={() => {}}
            />
          </div>

          <div>
            <Typography variant="small" color="muted" style={{ marginBottom: '0.25rem' }}>
              Middle Page (5 of 10)
            </Typography>
            <Pagination
              currentPage={5}
              totalPages={10}
              onPageChange={() => {}}
            />
          </div>
        </div>
      </div>

      {/* ===== Multiple Pagination States ===== */}
      <div
        style={{
          padding: '1.5rem',
          backgroundColor: 'var(--color-bg-surface)',
          borderRadius: 'var(--radius-lg)',
          border: '1px solid var(--color-border)',
        }}
      >
        <Typography variant="h4" color="primary" weight="semibold" style={{ marginBottom: '0.5rem' }}>
          Multiple Pagination States
        </Typography>
        <Typography variant="small" color="muted" style={{ marginBottom: '1rem' }}>
          Quick navigation to test different states
        </Typography>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '1rem' }}>
          <Button size="sm" variant="secondary" onClick={() => setPage5(1)}>
            Page 1
          </Button>
          <Button size="sm" variant="secondary" onClick={() => setPage5(3)}>
            Page 3
          </Button>
          <Button size="sm" variant="secondary" onClick={() => setPage5(5)}>
            Page 5
          </Button>
          <Button size="sm" variant="secondary" onClick={() => setPage5(8)}>
            Page 8
          </Button>
          <Button size="sm" variant="secondary" onClick={() => setPage5(10)}>
            Page 10
          </Button>
          <Button size="sm" variant="secondary" onClick={() => setPage5(12)}>
            Page 12
          </Button>
          <Button size="sm" variant="secondary" onClick={() => setPage5(15)}>
            Page 15
          </Button>
        </div>

        <Pagination
          currentPage={page5}
          totalPages={15}
          onPageChange={setPage5}
          siblingCount={2}
        />
        <Typography variant="small" color="muted" style={{ marginTop: '0.5rem' }}>
          Current page: {page5} of 15
        </Typography>
      </div>
    </div>
  );
}