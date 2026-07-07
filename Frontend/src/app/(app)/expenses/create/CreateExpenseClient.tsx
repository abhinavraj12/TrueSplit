'use client';

import { useState, useCallback, useMemo, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/features/auth';
import { Button } from '@/shared/_components/atoms/Button';
import { Input } from '@/shared/_components/atoms/Input';
import { AmountInput } from '@/shared/_components/molecules/AmountInput';
import { DatePicker } from '@/shared/_components/molecules/DatePicker';
import { CurrencySelector } from '@/shared/_components/molecules/CurrencySelector';
import { SelectDropdown, SelectOption } from '@/shared/_components/molecules/SelectDropdown';
import { ToggleGroup } from '@/shared/_components/molecules/ToggleGroup';
import { SearchInput } from '@/shared/_components/molecules/SearchInput/SearchInput';
import { Breadcrumb } from '@/shared/_components/molecules/Breadcrumb/Breadcrumb';
import { ThemeSwitcher } from '@/shared/_components/molecules/ThemeSwitcher/ThemeSwitcher';
import { Avatar } from '@/shared/_components/atoms/Avatar';
import { Badge } from '@/shared/_components/atoms/Badge';
import { Icon } from '@/shared/_components/atoms/Icon';
import { FaTimes, FaImage, FaCheckCircle, FaEnvelope, FaUserPlus, FaExclamationTriangle, FaUsers, FaLock, FaSearch, FaPlus, FaChevronDown } from 'react-icons/fa';
import clsx from 'clsx';
import styles from './page.module.css';

const DUMMY_FRIENDS = [
  { id: 'friend-1', name: 'Rahul Sharma', email: 'rahul@example.com', avatar: '' },
  { id: 'friend-2', name: 'Priya Patel', email: 'priya@example.com', avatar: '' },
  { id: 'friend-3', name: 'Amit Kumar', email: 'amit@example.com', avatar: '' },
];

const DUMMY_GROUPS = [
  {
    id: 'group-1',
    name: 'Family',
    ownerId: 'user-1',
    members: [
      { userId: 'user-1', name: 'You', email: 'you@example.com', avatar: '' },
      { userId: 'friend-1', name: 'Mom', email: 'mom@example.com', avatar: '' },
      { userId: 'friend-2', name: 'Dad', email: 'dad@example.com', avatar: '' },
      { userId: 'friend-3', name: 'Sister', email: 'sister@example.com', avatar: '' },
    ],
  },
  {
    id: 'group-2',
    name: 'Roommates',
    ownerId: 'friend-2',
    members: [
      { userId: 'friend-2', name: 'Priya Patel', email: 'priya@example.com', avatar: '' },
      { userId: 'user-1', name: 'You', email: 'you@example.com', avatar: '' },
      { userId: 'friend-3', name: 'Amit Kumar', email: 'amit@example.com', avatar: '' },
    ],
    hasPermission: true,
  },
  {
    id: 'group-3',
    name: 'Design Team',
    ownerId: 'friend-1',
    members: [
      { userId: 'friend-1', name: 'Rahul Sharma', email: 'rahul@example.com', avatar: '' },
      { userId: 'friend-2', name: 'Priya Patel', email: 'priya@example.com', avatar: '' },
      { userId: 'friend-3', name: 'Amit Kumar', email: 'amit@example.com', avatar: '' },
    ],
    hasPermission: false,
  },
];

const splitTypeOptions = [
  { value: 'EQUAL', label: 'Equal' },
  { value: 'MANUAL', label: 'Manual' },
];

const toTitleCase = (str: string): string => {
  if (!str) return '';
  return str
    .toLowerCase()
    .split(' ')
    .filter(word => word.length > 0)
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

const getCurrencySymbol = (code: string): string => {
  const symbols: Record<string, string> = {
    USD: '$',
    EUR: '€',
    GBP: '£',
    INR: '₹',
    JPY: '¥',
    CAD: 'C$',
    AUD: 'A$',
    CHF: 'CHF',
    CNY: '¥',
    BRL: 'R$',
    KRW: '₩',
    SGD: 'S$',
  };
  return symbols[code] || code;
};

const isValidEmail = (email: string): boolean => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

interface GroupSelectorProps {
  selectedGroupId: string | null;
  onGroupSelect: (groupId: string | null) => void;
  groups: any[];
  disabled?: boolean;
}

const GroupSelector: React.FC<GroupSelectorProps> = ({
  selectedGroupId,
  onGroupSelect,
  groups,
  disabled,
}) => {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const containerRef = useRef<HTMLDivElement>(null);

  const selectedGroup = groups.find(g => g.id === selectedGroupId);

  const filteredGroups = useMemo(() => {
    if (!searchQuery.trim()) return groups;
    const lower = searchQuery.toLowerCase();
    return groups.filter(g => g.name.toLowerCase().includes(lower));
  }, [groups, searchQuery]);

  const ownedGroups = filteredGroups.filter(g => g.ownerId === 'user-1');
  const availableGroups = filteredGroups.filter(g => g.ownerId !== 'user-1' && g.hasPermission);
  const lockedGroups = filteredGroups.filter(g => g.ownerId !== 'user-1' && !g.hasPermission);

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
    alert(`Access requested for group: ${groups.find(g => g.id === groupId)?.name}`);
    setIsOpen(false);
  };

  const handleCreateGroup = () => {
    router.push('/groups/create');
    setIsOpen(false);
  };

  return (
    <div ref={containerRef} className={styles.groupSelectorContainer}>
      <div
        className={clsx(styles.groupSelectorTrigger, isOpen && styles.groupSelectorTriggerOpen)}
        onClick={() => !disabled && setIsOpen(!isOpen)}
      >
        <div className={styles.groupSelectorValue}>
          {selectedGroup ? (
            <>
              <FaUsers className={styles.groupSelectorIcon} />
              <span>{selectedGroup.name}</span>
              <Badge variant="default" size="sm" className={styles.groupMemberBadge}>
                {selectedGroup.members.length} members
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
          <FaChevronDown className={clsx(styles.groupSelectorChevron, isOpen && styles.groupSelectorChevronOpen)} />
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
                <p className={styles.groupSelectorEmptyText}>You don't have any groups yet.</p>
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
                        className={clsx(styles.groupSelectorItem, selectedGroupId === group.id && styles.groupSelectorItemSelected)}
                        onClick={() => handleSelect(group.id)}
                      >
                        <FaUsers className={styles.groupSelectorItemIcon} />
                        <span className={styles.groupSelectorItemName}>{group.name}</span>
                        <Badge variant="default" size="sm">{group.members.length} members</Badge>
                      </div>
                    ))}
                  </div>
                )}

                {availableGroups.length > 0 && (
                  <div className={styles.groupSelectorSection}>
                    <div className={styles.groupSelectorSectionTitle}>Available Groups</div>
                    {availableGroups.map((group) => (
                      <div
                        key={group.id}
                        className={clsx(styles.groupSelectorItem, selectedGroupId === group.id && styles.groupSelectorItemSelected)}
                        onClick={() => handleSelect(group.id)}
                      >
                        <FaUsers className={styles.groupSelectorItemIcon} />
                        <span className={styles.groupSelectorItemName}>{group.name}</span>
                        <Badge variant="default" size="sm">{group.members.length} members</Badge>
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
                        <Badge variant="default" size="sm">{group.members.length} members</Badge>
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

export default function CreateExpenseClient() {
  const router = useRouter();
  const { user } = useAuth();

  const [amount, setAmount] = useState<number | null>(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [expenseDate, setExpenseDate] = useState<Date | null>(new Date());
  const [paidBy, setPaidBy] = useState<string>(user?.id || '');
  const [participants, setParticipants] = useState<any[]>([]);
  const [splitType, setSplitType] = useState<'EQUAL' | 'MANUAL'>('EQUAL');
  const [manualSplits, setManualSplits] = useState<Record<string, number>>({});
  const [hasCustomizedManual, setHasCustomizedManual] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currency, setCurrency] = useState<string>('INR');

  const [selectedGroupId, setSelectedGroupId] = useState<string | null>(null);
  const [groups] = useState(DUMMY_GROUPS);

  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteStatus, setInviteStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');

  const thumbnailRef = useRef<HTMLDivElement>(null);
  const [showPreview, setShowPreview] = useState(false);
  const [previewPosition, setPreviewPosition] = useState({ top: 0, left: 0 });

  const currentUser = useMemo(() => {
    if (!user) return null;
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      avatar: user.picture || '',
      isCurrentUser: true,
    };
  }, [user]);

  const allParticipants = useMemo(() => {
    if (!currentUser) return [];
    const current = participants.find((p) => p.isCurrentUser);
    if (!current) {
      return [currentUser, ...participants.filter((p) => !p.isCurrentUser)];
    }
    return participants;
  }, [participants, currentUser]);

  const paidByOptions: SelectOption[] = useMemo(() => {
    return allParticipants.map((p) => ({
      value: p.id,
      label: p.name,
      icon: <Avatar size="xs" name={p.name} src={p.avatar} />,
    }));
  }, [allParticipants]);

  const equalShare = useMemo(() => {
    if (allParticipants.length === 0 || !amount) return 0;
    return amount / allParticipants.length;
  }, [amount, allParticipants]);

  const manualSum = useMemo(() => {
    return Object.values(manualSplits).reduce((acc, val) => acc + (val || 0), 0);
  }, [manualSplits]);

  const remainingAmount = useMemo(() => {
    if (splitType !== 'MANUAL' || !amount) return 0;
    return amount - manualSum;
  }, [splitType, amount, manualSum]);

  const isFullyAllocated = useMemo(() => {
    if (splitType !== 'MANUAL' || !amount) return false;
    return Math.abs(remainingAmount) < 0.01;
  }, [splitType, remainingAmount, amount]);

  const isManualValid = useMemo(() => {
    if (splitType !== 'MANUAL' || !amount) return false;
    return isFullyAllocated;
  }, [splitType, isFullyAllocated, amount]);

  const isFormValid = useMemo(() => {
    if (!amount || amount <= 0) return false;
    if (!title.trim()) return false;
    if (allParticipants.length < 2) return false;
    if (splitType === 'MANUAL' && !isManualValid) return false;
    return true;
  }, [amount, title, allParticipants, splitType, isManualValid]);

  const currencySymbol = useMemo(() => getCurrencySymbol(currency), [currency]);

  const selectedGroup = useMemo(() => {
    return groups.find(g => g.id === selectedGroupId);
  }, [selectedGroupId, groups]);

  const groupMembers = selectedGroup ? selectedGroup.members : [];

  const isQueryMatchGroupMember = (query: string) => {
    if (!query.trim() || !selectedGroup) return false;
    const lower = query.toLowerCase();
    return groupMembers.some(m =>
      m.name.toLowerCase().includes(lower) ||
      m.email.toLowerCase().includes(lower)
    );
  };

  const isQueryMatchAddedParticipant = (query: string) => {
    if (!query.trim()) return false;
    const lower = query.toLowerCase();
    return allParticipants.some(p =>
      p.name.toLowerCase().includes(lower) ||
      p.email.toLowerCase().includes(lower)
    );
  };

  const headerTitle = useMemo(() => {
    return title.trim() ? toTitleCase(title.trim()) : 'New Expense';
  }, [title]);

  const handleGroupSelect = useCallback((groupId: string | null) => {
    setSelectedGroupId(groupId);

    if (groupId) {
      const group = groups.find(g => g.id === groupId);
      if (group) {
        const groupMembers = group.members.map((m: any) => ({
          id: m.userId,
          name: m.name,
          email: m.email,
          avatar: m.avatar || '',
          isCurrentUser: m.userId === currentUser?.id,
        }));

        let finalParticipants = groupMembers;
        if (!groupMembers.some((p: any) => p.isCurrentUser) && currentUser) {
          finalParticipants = [currentUser, ...groupMembers];
        }

        setParticipants(finalParticipants);
        if (currentUser && finalParticipants.some(p => p.id === currentUser.id)) {
          setPaidBy(currentUser.id);
        } else if (finalParticipants.length > 0) {
          setPaidBy(finalParticipants[0].id);
        }
        setSearchQuery('');
      }
    } else {
      if (currentUser) {
        setParticipants([currentUser]);
        setPaidBy(currentUser.id);
      }
      setSearchQuery('');
    }
  }, [groups, currentUser]);

  const handleAddParticipant = useCallback((friend: any) => {
    if (allParticipants.some((p) => p.id === friend.id)) return;
    setParticipants([
      ...allParticipants,
      { ...friend, isCurrentUser: false },
    ]);
    if (splitType === 'MANUAL') {
      setManualSplits((prev) => ({
        ...prev,
        [friend.id]: 0,
      }));
    }
    setSearchQuery('');
  }, [allParticipants, splitType]);

  const handleRemoveParticipant = useCallback((id: string) => {
    if (id === currentUser?.id) return;
    setParticipants(allParticipants.filter((p) => p.id !== id));
    if (splitType === 'MANUAL') {
      const newManual = { ...manualSplits };
      delete newManual[id];
      setManualSplits(newManual);
    }
  }, [allParticipants, currentUser?.id, manualSplits, splitType]);

  const handleSplitChange = useCallback((value: string | string[]) => {
    if (typeof value === 'string' && (value === 'EQUAL' || value === 'MANUAL')) {
      setSplitType(value as 'EQUAL' | 'MANUAL');

      if (value === 'MANUAL') {
        if (!hasCustomizedManual) {
          const init: Record<string, number> = {};
          allParticipants.forEach((p) => {
            init[p.id] = equalShare;
          });
          setManualSplits(init);
        } else {
          const updated = { ...manualSplits };
          allParticipants.forEach((p) => {
            if (!(p.id in updated)) {
              updated[p.id] = 0;
            }
          });
          setManualSplits(updated);
        }
      }
    }
  }, [allParticipants, equalShare, hasCustomizedManual, manualSplits]);

  const handleManualSplitChange = useCallback((participantId: string, val: number | null) => {
    setManualSplits((prev) => ({
      ...prev,
      [participantId]: val ?? 0,
    }));
    setHasCustomizedManual(true);
  }, []);

  const handleImageUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        setUploadedImage(ev.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  }, []);

  const handleRemoveImage = useCallback(() => {
    setUploadedImage(null);
  }, []);

  const handleSubmit = useCallback(() => {
    if (!isFormValid) return;
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      router.push('/dashboard');
    }, 1500);
  }, [isFormValid, router]);

  const handleMouseEnter = useCallback(() => {
    if (thumbnailRef.current) {
      const rect = thumbnailRef.current.getBoundingClientRect();
      const previewWidth = 260;
      const previewHeight = 320;

      let left = rect.right - previewWidth;
      let top = rect.bottom + 8;

      if (left < 8) left = 8;
      if (top + previewHeight > window.innerHeight - 8) {
        top = rect.top - previewHeight - 8;
      }

      setPreviewPosition({ top, left });
    }
    setShowPreview(true);
  }, []);

  const handleMouseLeave = useCallback(() => {
    setShowPreview(false);
  }, []);

  const handleSendInvite = useCallback(() => {
    if (!isValidEmail(inviteEmail)) {
      setInviteStatus('error');
      return;
    }
    setInviteStatus('sending');
    setTimeout(() => {
      setInviteStatus('sent');
      setTimeout(() => {
        setInviteStatus('idle');
        setInviteEmail('');
        setSearchQuery('');
      }, 3000);
    }, 1500);
  }, [inviteEmail]);

  const handleSearchChange = useCallback((value: string) => {
    setSearchQuery(value);
    setInviteStatus('idle');
    setInviteEmail(value);
  }, []);

  if (!currentUser) {
    return (
      <div className={styles.loadingPage}>
        <p>Loading...</p>
      </div>
    );
  }

  const showSplitDetails = amount && amount > 0;

  const searchPlaceholder = selectedGroupId
    ? 'Add group members...'
    : 'Add people...';

  const breadcrumbItems = [
    { label: 'Dashboard', href: '/dashboard' },
    { label: 'Expenses', href: '/expenses' },
    { label: title.trim() ? toTitleCase(title.trim()) : 'New Expense' },
  ];

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <div className={styles.formCard}>

          <div className={styles.breadcrumbRow}>
            <Breadcrumb
              items={breadcrumbItems}
              separator="//"
              small
              aria-label="Create expense breadcrumb"
              className={styles.breadcrumb}
            />
            <ThemeSwitcher variant="both" />
          </div>

          <div className={styles.header}>
            <div className={styles.headerLeft}>
              <Button variant="ghost" size="sm" onClick={() => router.back()} className={styles.backButton}>
                ← Back
              </Button>
            </div>
            <h1 className={styles.title}>{headerTitle}</h1>
            <div className={styles.headerRight}>
              {uploadedImage ? (
                <div
                  ref={thumbnailRef}
                  className={styles.receiptThumbnailWrapper}
                  onMouseEnter={handleMouseEnter}
                  onMouseLeave={handleMouseLeave}
                >
                  <img src={uploadedImage} alt="Receipt" className={styles.receiptThumbnail} />
                  {showPreview && (
                    <div
                      className={styles.receiptPreview}
                      style={{
                        position: 'fixed',
                        top: previewPosition.top,
                        left: previewPosition.left,
                        zIndex: 9999,
                      }}
                    >
                      <img src={uploadedImage} alt="Receipt preview" className={styles.receiptPreviewImage} />
                    </div>
                  )}
                </div>
              ) : (
                <Avatar size="sm" src={currentUser.avatar} name={currentUser.name} className={styles.userAvatar} tooltip={currentUser.name} />
              )}
            </div>
          </div>

          <div className={styles.fieldGroup}>
            <div className={styles.amountRow}>
              <div className={styles.amountWrapper}>
                <label className={styles.label}>Amount <span className={styles.required}>*</span></label>
                <AmountInput
                  value={amount}
                  onChange={setAmount}
                  currencySymbol={currencySymbol}
                  currencyCode={currency}
                  placeholder="0.00"
                  autoFocus
                  size="lg"
                  className={styles.amountInput}
                />
              </div>
              <div className={styles.currencyWrapper}>
                <label className={styles.label}>Currency <span className={styles.required}>*</span></label>
                <CurrencySelector
                  value={currency}
                  onChange={setCurrency}
                  size="md"
                  showFullName={false}
                  className={styles.currencySelector}
                />
              </div>
            </div>
          </div>

          <div className={styles.fieldGroup}>
            <label className={styles.label}>Title <span className={styles.required}>*</span></label>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., Dinner at Saravana Bhavan"
              maxLength={100}
              showCount
            />
          </div>

          <div className={styles.fieldGroup}>
            <label className={styles.label}>Date & Time <span className={styles.required}>*</span></label>
            <DatePicker
              value={expenseDate}
              onChange={setExpenseDate}
              format="MMM d, yyyy, h:mm a"
              clearable={false}
            />
          </div>

          <div className={styles.fieldGroup}>
            <label className={styles.label}>Receipt</label>
            <div className={styles.uploadBox}>
              {uploadedImage ? (
                <div className={styles.uploadPreview}>
                  <img src={uploadedImage} alt="Receipt" className={styles.uploadImage} />
                  <button className={styles.uploadRemove} onClick={handleRemoveImage} aria-label="Remove receipt">
                    <FaTimes />
                  </button>
                </div>
              ) : (
                <label className={styles.uploadPlaceholder}>
                  <input type="file" accept="image/*" onChange={handleImageUpload} className={styles.hiddenInput} />
                  <Icon size="lg" color="muted" decorative><FaImage /></Icon>
                  <span className={styles.uploadText}>Add receipt</span>
                  <span className={styles.uploadSubtext}>JPEG, PNG, or PDF</span>
                </label>
              )}
            </div>
          </div>

          <div className={styles.fieldGroup}>
            <button className={styles.expander} onClick={() => setIsDescriptionExpanded((prev) => !prev)}>
              <span>{isDescriptionExpanded ? '−' : '+'}</span>
              <span>Add description (optional)</span>
            </button>
            {isDescriptionExpanded && (
              <div className={styles.expanderContent}>
                <Input
                  as="textarea"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Add any details..."
                  maxLength={500}
                  showCount
                  rows={3}
                />
              </div>
            )}
          </div>

          <hr className={styles.divider} />

          <div className={styles.fieldGroup}>
            <label className={styles.label}>Group (optional)</label>
            <GroupSelector
              selectedGroupId={selectedGroupId}
              onGroupSelect={handleGroupSelect}
              groups={groups}
            />
          </div>

          <div className={styles.fieldGroup}>
            <label className={styles.label}>Paid by <span className={styles.required}>*</span></label>
            <SelectDropdown value={paidBy} onChange={setPaidBy} options={paidByOptions} size="md" className={styles.paidBySelect} />
          </div>

          <div className={styles.fieldGroup}>
            <label className={styles.label}>Participants <span className={styles.required}>*</span></label>
            <div className={styles.participantsContainer}>
              <div className={styles.chipList}>
                {allParticipants.map((p) => {
                  const isCurrent = p.isCurrentUser;
                  return (
                    <div key={p.id} className={styles.chip}>
                      <Avatar size="xs" src={p.avatar} name={p.name} />
                      <span>{p.name}</span>
                      {isCurrent && <Badge variant="primary" size="sm" className={styles.youBadge}>You</Badge>}
                      {!isCurrent && (
                        <button className={styles.chipRemove} onClick={() => handleRemoveParticipant(p.id)} aria-label={`Remove ${p.name}`}>
                          <FaTimes />
                        </button>
                      )}
                    </div>
                  );
                })}

                <div className={styles.searchWrapper}>
                  <SearchInput
                    value={searchQuery}
                    onChange={handleSearchChange}
                    placeholder={searchPlaceholder}
                    size="sm"
                    className={styles.searchInputComponent}
                    aria-label="Search participants"
                    debounce={300}
                  />

                  {searchQuery && (
                    <div className={styles.searchResults}>
                      {selectedGroupId ? (
                        (() => {
                          const query = searchQuery.trim();
                          const matchAdded = isQueryMatchAddedParticipant(query);
                          const matchGroupMember = isQueryMatchGroupMember(query);

                          if (matchAdded) {
                            return (
                              <div className={styles.alreadyAddedMessage}>
                                <FaCheckCircle className={styles.alreadyAddedIcon} />
                                <span>This participant has already been added</span>
                              </div>
                            );
                          } else if (matchGroupMember) {
                            const available = groupMembers
                              .filter(m => m.userId !== currentUser?.id)
                              .filter(m => !allParticipants.some(p => p.id === m.userId))
                              .filter(m =>
                                m.name.toLowerCase().includes(query.toLowerCase()) ||
                                m.email.toLowerCase().includes(query.toLowerCase())
                              );
                            return available.map((person) => (
                              <div
                                key={person.userId}
                                className={styles.searchResultItem}
                                onClick={() => handleAddParticipant({
                                  id: person.userId,
                                  name: person.name,
                                  email: person.email,
                                  avatar: person.avatar || '',
                                })}
                              >
                                <Avatar size="xs" name={person.name} src={person.avatar} />
                                <span>{person.name}</span>
                              </div>
                            ));
                          } else {
                            return (
                              <div className={styles.groupRestrictionMessage}>
                                <FaExclamationTriangle className={styles.groupRestrictionIcon} />
                                <span>
                                  Only members of <strong>"{selectedGroup?.name}"</strong> can be added as participants.
                                </span>
                              </div>
                            );
                          }
                        })()
                      ) : (
                        (() => {
                          const friends = DUMMY_FRIENDS.filter(f =>
                            !allParticipants.some(p => p.id === f.id) &&
                            (f.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                             f.email.toLowerCase().includes(searchQuery.toLowerCase()))
                          );
                          if (friends.length > 0) {
                            return friends.map((friend) => (
                              <div
                                key={friend.id}
                                className={styles.searchResultItem}
                                onClick={() => handleAddParticipant(friend)}
                              >
                                <Avatar size="xs" name={friend.name} src={friend.avatar} />
                                <span>{friend.name}</span>
                              </div>
                            ));
                          } else {
                            return (
                              <div className={styles.inviteSection}>
                                <div className={styles.inviteHeader}>
                                  <FaUserPlus className={styles.inviteIcon} />
                                  <span className={styles.inviteTitle}>No friends found</span>
                                </div>
                                <div className={styles.inviteBody}>
                                  <p className={styles.inviteDescription}>Invite <strong>"{searchQuery}"</strong> via email</p>
                                  <div className={styles.inviteInputGroup}>
                                    <div className={styles.inviteInputWrapper}>
                                      <FaEnvelope className={styles.inviteInputIcon} />
                                      <input
                                        type="email"
                                        className={styles.inviteInput}
                                        placeholder="Enter email address"
                                        value={inviteEmail}
                                        onChange={(e) => setInviteEmail(e.target.value)}
                                        disabled={inviteStatus === 'sending' || inviteStatus === 'sent'}
                                      />
                                    </div>
                                    <Button
                                      variant="primary"
                                      size="sm"
                                      onClick={handleSendInvite}
                                      loading={inviteStatus === 'sending'}
                                      disabled={!isValidEmail(inviteEmail) || inviteStatus === 'sent'}
                                      className={styles.inviteButton}
                                    >
                                      {inviteStatus === 'sent' ? 'Invited ✓' : 'Send Invite'}
                                    </Button>
                                  </div>
                                  <div className={styles.inviteDisclaimer}>Enter your friend's correct email address.</div>
                                  {inviteStatus === 'sent' && (
                                    <div className={styles.inviteSuccess}><FaCheckCircle /> Invitation sent successfully!</div>
                                  )}
                                  {inviteStatus === 'error' && (
                                    <div className={styles.inviteError}>Please enter a valid email address.</div>
                                  )}
                                </div>
                              </div>
                            );
                          }
                        })()
                      )}
                    </div>
                  )}
                </div>
              </div>
              <div className={styles.participantHint}>
                {allParticipants.length < 2 && (
                  <span className={styles.hintError}>Add at least one more person</span>
                )}
              </div>
            </div>
          </div>

          <div className={styles.fieldGroup}>
            <label className={styles.label}>Split type <span className={styles.required}>*</span></label>
            <ToggleGroup
              options={splitTypeOptions.map((opt) => ({ value: opt.value, label: opt.label }))}
              value={splitType}
              onChange={handleSplitChange}
              type="single"
              size="md"
              className={styles.splitToggle}
            />
          </div>

          {showSplitDetails ? (
            <div className={styles.fieldGroup}>
              <label className={styles.label}>{splitType === 'EQUAL' ? 'Shares (equal)' : 'Shares (manual)'}</label>
              <div className={styles.splitList}>
                {allParticipants.map((p) => {
                  const share = splitType === 'EQUAL' ? equalShare : (manualSplits[p.id] ?? 0);
                  const isPayer = p.id === paidBy;
                  const isZeroShare = splitType === 'MANUAL' && share < 0.01;
                  const percent = amount && amount > 0 ? (share / amount) * 100 : 0;
                  return (
                    <div key={p.id} className={clsx(styles.splitRow, isZeroShare && styles.splitRowZero)}>
                      <div className={styles.splitParticipant}>
                        <Avatar size="sm" name={p.name} src={p.avatar} />
                        <span className={styles.splitName}>
                          {p.name}
                          {isPayer && <Badge variant="primary" size="sm" className={styles.payerBadge}>Payer</Badge>}
                          {p.isCurrentUser && <Badge variant="default" size="sm" className={styles.youBadge}>You</Badge>}
                          {isZeroShare && <span className={styles.zeroShareWarning} title="No share allocated yet">⚠️</span>}
                        </span>
                      </div>
                      {splitType === 'EQUAL' ? (
                        <span className={styles.splitAmount}>
                          {currencySymbol} {share.toFixed(2)}
                          <span className={styles.splitPercent}>
                            ({percent.toFixed(0)}%)
                          </span>
                        </span>
                      ) : (
                        <div className={styles.manualSplitRow}>
                          <AmountInput
                            value={manualSplits[p.id] ?? 0}
                            onChange={(val) => handleManualSplitChange(p.id, val)}
                            currencySymbol={currencySymbol}
                            currencyCode={currency}
                            size="sm"
                            className={styles.manualSplitInput}
                            placeholder="0.00"
                          />
                          <span className={styles.splitPercent}>
                            ({percent.toFixed(0)}%)
                          </span>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {splitType === 'MANUAL' && (
                <div className={styles.manualSplitControls}>
                  <div className={styles.manualAllocationStatus}>
                    <span className={styles.manualAllocationLabel}>
                      {remainingAmount > 0.01 ? (
                        <span className={styles.manualAllocatedRemaining}>
                          <FaExclamationTriangle /> Remaining: {currencySymbol} {remainingAmount.toFixed(2)} to allocate
                        </span>
                      ) : remainingAmount < -0.01 ? (
                        <span className={styles.manualAllocatedOver}>
                          <FaExclamationTriangle /> Over‑allocated by {currencySymbol} {(-remainingAmount).toFixed(2)}
                        </span>
                      ) : (
                        <span className={styles.manualAllocatedFull}>
                          <FaCheckCircle /> Fully allocated
                        </span>
                      )}
                    </span>
                    <div className={styles.manualProgressBar}>
                      <div
                        className={styles.manualProgressFill}
                        style={{
                          width: `${Math.min(100, (manualSum / (amount || 1)) * 100)}%`,
                          background: remainingAmount > 0.01
                            ? 'var(--color-warning-text)'
                            : remainingAmount < -0.01
                            ? 'var(--color-error-text)'
                            : 'var(--color-success-text)',
                        }}
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className={styles.fieldGroup}>
              <div className={styles.emptySplitState}>
                <span className={styles.emptySplitText}>Enter an amount to start splitting</span>
              </div>
            </div>
          )}

          <div className={styles.footerSpacer} />
        </div>
      </div>

      <div className={styles.stickyFooter}>
        <div className={styles.footerInner}>
          <Button
            variant="primary"
            size="lg"
            fullWidth
            loading={isSubmitting}
            disabled={!isFormValid || isSubmitting}
            onClick={handleSubmit}
            className={styles.createButton}
          >
            {isSubmitting ? 'Creating...' : 'Create Expense'}
          </Button>
        </div>
      </div>
    </div>
  );
}