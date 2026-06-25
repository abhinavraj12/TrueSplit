// F:\PERSONAL\TrueSplit\frontend\src\app\testing\avatar\page.tsx

'use client';

import React, { useState } from 'react';
import { Avatar, AvatarGroup } from '@/shared/_components/atoms/Avatar';
import { ThemeSwitcher } from '@/shared/_components/molecules/ThemeSwitcher';

/**
 * Testing page for Avatar & AvatarGroup components.
 * Demonstrates all real‑world use cases in TrueSplit.
 */
export default function AvatarTestPage() {
  const [clickCount, setClickCount] = useState(0);

  // Sample user data
  const users = [
    { id: 1, name: 'Alice Johnson', src: 'https://i.pravatar.cc/150?img=1', status: 'online' as const },
    { id: 2, name: 'Bob Smith', src: 'https://i.pravatar.cc/150?img=2', status: 'offline' as const },
    { id: 3, name: 'Carol White', src: 'https://i.pravatar.cc/150?img=3', status: 'busy' as const },
    { id: 4, name: 'Dave Brown', src: 'https://i.pravatar.cc/150?img=4', status: 'away' as const },
    { id: 5, name: 'Eve Davis', src: 'https://i.pravatar.cc/150?img=5' },
    { id: 6, name: 'Frank Wilson', src: 'https://i.pravatar.cc/150?img=6' },
    { id: 7, name: 'Grace Taylor', src: 'https://i.pravatar.cc/150?img=7' },
    { id: 8, name: 'Henry Martinez', src: 'https://i.pravatar.cc/150?img=8' },
  ];

  const handleAvatarClick = (name: string) => {
    setClickCount(prev => prev + 1);
    alert(`Clicked on ${name}`);
  };

  return (
    <div style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
      <h1>Avatar Component Test Page</h1>
      <ThemeSwitcher variant='both'/>
      <p>Click count: {clickCount}</p>

      <hr style={{ margin: '2rem 0' }} />

      {/* 1. Basic Avatars - All Sizes */}
      <section>
        <h2>1. Sizes</h2>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', flexWrap: 'wrap' }}>
          <Avatar size="xs" name="XS" src="https://i.pravatar.cc/150?img=1" />
          <Avatar size="sm" name="SM" src="https://i.pravatar.cc/150?img=2" />
          <Avatar size="md" name="MD" src="https://i.pravatar.cc/150?img=3" />
          <Avatar size="lg" name="LG" src="https://i.pravatar.cc/150?img=4" />
          <Avatar size="xl" name="XL" src="https://i.pravatar.cc/150?img=5" />
        </div>
      </section>

      <hr style={{ margin: '2rem 0' }} />

      {/* 2. Status Indicators */}
      <section>
        <h2>2. Status Indicators</h2>
        <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center', flexWrap: 'wrap' }}>
          <Avatar name="Online" status="online" />
          <Avatar name="Offline" status="offline" />
          <Avatar name="Busy" status="busy" />
          <Avatar name="Away" status="away" />
          <Avatar name="No Status" />
        </div>
      </section>

      <hr style={{ margin: '2rem 0' }} />

      {/* 3. Badges */}
      <section>
        <h2>3. Badges (Notifications / Counts)</h2>
        <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center', flexWrap: 'wrap' }}>
          <Avatar name="Unread" badge={5} />
          <Avatar name="High Count" badge={150} />
          <Avatar name="With status and badge" status="online" badge={3} badgePosition="top-left" />
          <Avatar name="Custom badge color" badge={7} badgeColor="#ff6b6b" />
          <Avatar name="Text badge" badge="New" />
        </div>
        <p><small>Badge position defaults to top‑right; can be changed with <code>badgePosition</code>.</small></p>
      </section>

      <hr style={{ margin: '2rem 0' }} />

      {/* 4. Fallbacks (no image, no name) */}
      <section>
        <h2>4. Fallbacks</h2>
        <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center', flexWrap: 'wrap' }}>
          <Avatar name="John Doe" /> {/* initials JD */}
          <Avatar name="A" /> {/* single initial A */}
          <Avatar name="James Tiberius Kirk" /> {/* initials JK */}
          <Avatar /> {/* default icon */}
          <Avatar src="https://i.pravatar.cc/150?img=99" name="Broken Image" />
        </div>
      </section>

      <hr style={{ margin: '2rem 0' }} />

      {/* 5. Interactive Avatars */}
      <section>
        <h2>5. Interactive (Clickable)</h2>
        <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center', flexWrap: 'wrap' }}>
          <Avatar
            name="Click me"
            src="https://i.pravatar.cc/150?img=9"
            onClick={() => handleAvatarClick('Click me')}
            tooltip="Click to show alert"
          />
          <Avatar
            name="With ring"
            src="https://i.pravatar.cc/150?img=10"
            ring
            onClick={() => handleAvatarClick('Ring avatar')}
          />
        </div>
        <p><small>Interactive avatars have a focus ring and are keyboard‑accessible.</small></p>
      </section>

      <hr style={{ margin: '2rem 0' }} />

      {/* 6. Decorative (aria-hidden) */}
      <section>
        <h2>6. Decorative</h2>
        <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
          <Avatar name="Decorative" src="https://i.pravatar.cc/150?img=11" decorative />
          <span>This avatar is hidden from screen readers.</span>
        </div>
      </section>

      <hr style={{ margin: '2rem 0' }} />

      {/* 7. Tooltips */}
      <section>
        <h2>7. Tooltips</h2>
        <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center', flexWrap: 'wrap' }}>
          <Avatar name="Hover me" tooltip="Full name: John Doe" />
          <Avatar name="With status" status="online" tooltip="John Doe • Online" />
        </div>
      </section>

      <hr style={{ margin: '2rem 0' }} />

      {/* 8. Avatar Groups */}
      <section>
        <h2>8. Avatar Groups</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div>
            <h3>Group – max 4</h3>
            <AvatarGroup max={4} size="md" ariaLabel="Group members (max 4 shown)">
              {users.map(user => (
                <Avatar
                  key={user.id}
                  name={user.name}
                  src={user.src}
                  status={user.status}
                  tooltip={user.name}
                />
              ))}
            </AvatarGroup>
          </div>

          <div>
            <h3>Group – compact (smaller overlap)</h3>
            <AvatarGroup max={6} size="lg" compact ariaLabel="Compact group">
              {users.map(user => (
                <Avatar
                  key={user.id}
                  name={user.name}
                  src={user.src}
                  status={user.status}
                />
              ))}
            </AvatarGroup>
          </div>

          <div>
            <h3>Group – all members (no max)</h3>
            <AvatarGroup size="sm" ariaLabel="All group members">
              {users.map(user => (
                <Avatar
                  key={user.id}
                  name={user.name}
                  src={user.src}
                  status={user.status}
                  size="sm"
                />
              ))}
            </AvatarGroup>
          </div>
        </div>
      </section>

      <hr style={{ margin: '2rem 0' }} />

      {/* 9. Real‑world scenarios */}
      <section>
        <h2>9. Real‑world Scenarios</h2>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '2rem' }}>
          {/* User profile card */}
          <div style={{ border: '1px solid var(--color-border)', borderRadius: 'var(--radius-md)', padding: '1rem', textAlign: 'center' }}>
            <Avatar size="xl" name="Alice Johnson" src="https://i.pravatar.cc/150?img=1" status="online" badge={3} />
            <h3>Alice Johnson</h3>
            <p>Online · 3 notifications</p>
          </div>

          {/* Group expense list item */}
          <div style={{ border: '1px solid var(--color-border)', borderRadius: 'var(--radius-md)', padding: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <Avatar name="Trip to Goa" src="https://i.pravatar.cc/150?img=12" />
              <div>
                <strong>Trip to Goa</strong>
                <div style={{ fontSize: '0.9rem', color: 'var(--color-text-secondary)' }}>
                  <AvatarGroup max={3} size="xs" compact>
                    {users.slice(0, 4).map(u => (
                      <Avatar key={u.id} name={u.name} src={u.src} size="xs" />
                    ))}
                  </AvatarGroup>
                  <span style={{ marginLeft: '0.5rem' }}>4 members</span>
                </div>
              </div>
            </div>
          </div>

          {/* Notification item */}
          <div style={{ border: '1px solid var(--color-border)', borderRadius: 'var(--radius-md)', padding: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <Avatar name="Bob Smith" src="https://i.pravatar.cc/150?img=2" status="online" />
              <div>
                <span><strong>Bob</strong> added an expense</span>
                <div style={{ fontSize: '0.9rem', color: 'var(--color-text-secondary)' }}>
                  $25.50 · 2 min ago
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <footer style={{ marginTop: '3rem', padding: '1rem', borderTop: '1px solid var(--color-divider)', color: 'var(--color-text-muted)', fontSize: '0.9rem' }}>
        <p>Avatar component test page – all props and use cases demonstrated.</p>
      </footer>
    </div>
  );
}