import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/features/auth';
import { FaUsers, FaSearch, FaLock, FaPlus, FaChevronDown, FaTimes } from 'react-icons/fa';
import { Button } from '@/shared/_components/atoms/Button';
import { Badge } from '@/shared/_components/atoms/Badge';
import { toast } from '@/shared/_components/molecules/Toast/ToastProvider';
import styles from '../page.module.css';

interface GroupMember {
  userId: string;
  name: string;
  email: string;
  avatar?: string;
}

interface Group {
  id: string;
  name: string;
  ownerId: string;
  members: GroupMember[];
  hasPermission?: boolean;
}

interface GroupSelectorProps {
  selectedGroupId: string | null;
  onGroupSelect: (groupId: string | null) => void;
  groups: Group[];
  isLoading?: boolean;
  error?: string | null;
  disabled?: boolean;
}

export const GroupSelector: React.FC<GroupSelectorProps> = ({
  selectedGroupId,
  onGroupSelect,
  groups,
  isLoading = false,
  error = null,
  disabled,
}) => {
  const router = useRouter();
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const containerRef = useRef<HTMLDivElement>(null);

  const currentUserId = user?.id || '';
  const selectedGroup = groups.find(g => g.id === selectedGroupId);

  const filteredGroups = useMemo(() => {
    if (!searchQuery.trim()) return groups;
    const lower = searchQuery.toLowerCase();
    return groups.filter(g => g.name.toLowerCase().includes(lower));
  }, [groups, searchQuery]);

  const ownedGroups = filteredGroups.filter(g => g.ownerId === currentUserId);
  const accessibleGroups = filteredGroups.filter(g => g.ownerId !== currentUserId && g.hasPermission);
  const lockedGroups = filteredGroups.filter(g => g.ownerId !== currentUserId && !g.hasPermission);

  const totalGroups = groups.length;

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (groupId: string) => {
    onGroupSelect(groupId);
    setIsOpen(false);
    setSearchQuery('');
  };

  const handleClear = () => {
    onGroupSelect(null);
    setIsOpen(false);
  };

  const handleRequestAccess = (groupId: string) => {
    toast.info(`Access requested for group: ${groups.find(g => g.id === groupId)?.name}`);
    setIsOpen(false);
  };

  const handleCreateGroup = () => {
    router.push('/groups/create');
    setIsOpen(false);
  };

  if (isLoading) {
    return (
      <div className={styles.groupSelectorContainer}>
        <div className={styles.groupSelectorTrigger} style={{ opacity: 0.6 }}>
          <div className={styles.groupSelectorValue}>
            <span className={styles.groupSelectorPlaceholder}>Loading groups...</span>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.groupSelectorContainer}>
        <div className={styles.groupSelectorTrigger} style={{ opacity: 0.6 }}>
          <div className={styles.groupSelectorValue}>
            <span className={styles.groupSelectorPlaceholder}>Could not load groups</span>
          </div>
        </div>
        <div className={styles.groupSelectorError}>{error}</div>
      </div>
    );
  }

  return (
    <div ref={containerRef} className={styles.groupSelectorContainer}>
      <div
        className={`${styles.groupSelectorTrigger} ${isOpen ? styles.groupSelectorTriggerOpen : ''}`}
        onClick={() => !disabled && setIsOpen(!isOpen)}
      >
        <div className={styles.groupSelectorValue}>
          {selectedGroup ? (
            <>
              <FaUsers className={styles.groupSelectorIcon} />
              <span>{selectedGroup.name}</span>
              <Badge variant="default" size="sm" className={styles.groupMemberBadge}>
                {selectedGroup.members?.length || 0} members
              </Badge>
            </>
          ) : (
            <span className={styles.groupSelectorPlaceholder}>Select a group (optional)</span>
          )}
        </div>
        <div className={styles.groupSelectorActions}>
          {selectedGroup && (
            <button
              className={styles.groupSelectorClear}
              onClick={(e) => { e.stopPropagation(); handleClear(); }}
              aria-label="Clear group"
            >
              <FaTimes />
            </button>
          )}
          <FaChevronDown className={`${styles.groupSelectorChevron} ${isOpen ? styles.groupSelectorChevronOpen : ''}`} />
        </div>
      </div>

      {isOpen && (
        <div className={styles.groupSelectorPopover}>
          <div className={styles.groupSelectorSearch}>
            <FaSearch className={styles.groupSelectorSearchIcon} />
            <input
              type="text"
              placeholder="Search groups..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={styles.groupSelectorSearchInput}
              autoFocus
            />
          </div>

          <div className={styles.groupSelectorList}>
            {totalGroups === 0 ? (
              <div className={styles.groupSelectorEmpty}>
                <p className={styles.groupSelectorEmptyText}>You don&apos;t have any groups yet.</p>
                <Button
                  variant="primary"
                  size="sm"
                  onClick={handleCreateGroup}
                  className={styles.groupSelectorCreateButton}
                  leftIcon={<FaPlus />}
                >
                  Create Group
                </Button>
              </div>
            ) : (
              <>
                {ownedGroups.length > 0 && (
                  <div className={styles.groupSelectorSection}>
                    <div className={styles.groupSelectorSectionTitle}>Your Groups</div>
                    {ownedGroups.map((group) => (
                      <div
                        key={group.id}
                        className={`${styles.groupSelectorItem} ${selectedGroupId === group.id ? styles.groupSelectorItemSelected : ''}`}
                        onClick={() => handleSelect(group.id)}
                      >
                        <FaUsers className={styles.groupSelectorItemIcon} />
                        <span className={styles.groupSelectorItemName}>{group.name}</span>
                        <Badge variant="default" size="sm">{group.members?.length || 0} members</Badge>
                      </div>
                    ))}
                  </div>
                )}

                {accessibleGroups.length > 0 && (
                  <div className={styles.groupSelectorSection}>
                    <div className={styles.groupSelectorSectionTitle}>Available Groups</div>
                    {accessibleGroups.map((group) => (
                      <div
                        key={group.id}
                        className={`${styles.groupSelectorItem} ${selectedGroupId === group.id ? styles.groupSelectorItemSelected : ''}`}
                        onClick={() => handleSelect(group.id)}
                      >
                        <FaUsers className={styles.groupSelectorItemIcon} />
                        <span className={styles.groupSelectorItemName}>{group.name}</span>
                        <Badge variant="default" size="sm">{group.members?.length || 0} members</Badge>
                      </div>
                    ))}
                  </div>
                )}

                {lockedGroups.length > 0 && (
                  <div className={styles.groupSelectorSection}>
                    <div className={styles.groupSelectorSectionTitle}>Request Access</div>
                    {lockedGroups.map((group) => (
                      <div key={group.id} className={styles.groupSelectorItem}>
                        <FaLock className={styles.groupSelectorItemIcon} />
                        <span className={styles.groupSelectorItemName}>{group.name}</span>
                        <Badge variant="default" size="sm">{group.members?.length || 0} members</Badge>
                        <Button
                          variant="primary"
                          size="sm"
                          onClick={() => handleRequestAccess(group.id)}
                          className={styles.groupSelectorRequestButton}
                        >
                          Request Access
                        </Button>
                      </div>
                    ))}
                  </div>
                )}

                {filteredGroups.length === 0 && searchQuery && (
                  <div className={styles.groupSelectorEmpty}>
                    <span className={styles.groupSelectorEmptyText}>No groups match your search.</span>
                  </div>
                )}

                <div className={styles.groupSelectorCreateGroupOption}>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleCreateGroup}
                    className={styles.groupSelectorCreateGroupButton}
                    leftIcon={<FaPlus />}
                  >
                    Create New Group
                  </Button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default GroupSelector;