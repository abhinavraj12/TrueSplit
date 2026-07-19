'use client';

import { useState, useCallback, useMemo, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/features/auth';
import { SelectOption } from '@/shared/_components/molecules/SelectDropdown';
import { Breadcrumb } from '@/shared/_components/molecules/Breadcrumb/Breadcrumb';
import { ThemeSwitcher } from '@/shared/_components/molecules/ThemeSwitcher/ThemeSwitcher';
import { Avatar } from '@/shared/_components/atoms/Avatar';
import styles from '../page.module.css';
import { useCreateExpense } from '@/features/expenses';
import { api, ApiError } from '@/shared/lib/api';
import { toast } from '@/shared/_components/molecules/Toast/ToastProvider';
import { saveFormState, loadFormState, clearFormState } from '@/shared/lib/storage/indexedDB';
import { GroupSelector } from './GroupSelector';
import { FormHeader } from './FormHeader';
import { AmountSection } from './AmountSection';
import { TitleSection } from './TitleSection';
import { DateTimeSection } from './DateTimeSection';
import { DescriptionSection } from './DescriptionSection';
import { PaidBySection } from './PaidBySection';
import { ReceiptSection } from './ReceiptSection';
import { ParticipantsSection } from './ParticipantsSection';
import { SplitSection } from './SplitSection';
import { FormActions } from './FormActions';

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

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

interface Friend {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  addedAt: string;
}

interface Participant {
  id: string;
  name: string;
  email: string;
  avatar?: string;
}

interface GroupsApiResponse {
  owned: Group[];
  accessible: Group[];
  locked: Group[];
}

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

const toTitleCase = (str: string): string => {
  if (!str) return '';
  return str
    .toLowerCase()
    .split(' ')
    .filter(word => word.length > 0)
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

const isValidEmail = (email: string): boolean => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export default function CreateExpense() {
  const router = useRouter();
  const { user } = useAuth();

  const {
    state,
    setTitle,
    setDescription,
    setAmount,
    setCurrency,
    setSplitType,
    setPaidBy,
    setParticipants,
    setExpenseDate,
    setManualSplits,
    setGroupId,
    addFiles,
    removeFile,
    clearFiles,
    getPendingFiles,
    restoreState,
    isFormValid,
    titleError,
    amountError,
    participantsError,
    paidByError,
    dateError,
    manualSplitError,
    equalShare,
    manualSum,
    remainingAmount,
    isFullyAllocated,
    isSubmitting,
    submitError,
    submitForm,
  } = useCreateExpense();

  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteStatus, setInviteStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');
  const [isRestoring, setIsRestoring] = useState(true);

  const [groups, setGroups] = useState<Group[]>([]);
  const [groupsLoading, setGroupsLoading] = useState(true);
  const [groupsError, setGroupsError] = useState<string | null>(null);
  const [friends, setFriends] = useState<Friend[]>([]);

  const selectedGroupId = state.groupId;
  const selectedGroup = useMemo(() => {
    return groups.find(g => g.id === selectedGroupId) || null;
  }, [groups, selectedGroupId]);

  // ============================================================================
  // Persistence: Load saved state on mount
  // ============================================================================

  useEffect(() => {
    let isMounted = true;

    const restoreSavedState = async () => {
      try {
        const saved = await loadFormState();
        if (saved && isMounted) {
          const parsed = saved as Partial<typeof state>;
          if (parsed.pendingFiles && Array.isArray(parsed.pendingFiles)) {
            restoreState(parsed);
          }
        }
      } catch (error) {
        console.warn('Failed to restore form state:', error);
      } finally {
        if (isMounted) {
          setIsRestoring(false);
        }
      }
    };

    restoreSavedState();

    return () => {
      isMounted = false;
    };
  }, [restoreState]);

  // ============================================================================
  // Persistence: Save state on change (debounced)
  // ============================================================================

  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (isRestoring) return;

    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }

    saveTimeoutRef.current = setTimeout(() => {
      saveFormState(state).catch(() => {});
    }, 500);

    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
    };
  }, [state, isRestoring]);

  // ============================================================================
  // Clear persistence on successful submission
  // ============================================================================

  const handleSubmitSuccess = useCallback(async () => {
    await clearFormState().catch(() => {});
    clearFiles();
  }, [clearFiles]);

  // ============================================================================
  // Fetch groups
  // ============================================================================

  useEffect(() => {
    const fetchGroups = async () => {
      setGroupsLoading(true);
      setGroupsError(null);
      try {
        const data = await api.get<GroupsApiResponse>('/groups');
        const allGroups: Group[] = [...(data.owned || []), ...(data.accessible || []), ...(data.locked || [])];
        setGroups(allGroups);
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to load groups. You can still create an expense without selecting a group.';
        setGroupsError(message);
        setGroups([]);
      } finally {
        setGroupsLoading(false);
      }
    };
    fetchGroups();
  }, []);

  // ============================================================================
  // Fetch friends
  // ============================================================================

  useEffect(() => {
    const fetchFriends = async () => {
      try {
        const data = await api.get<Friend[]>('/friends');
        setFriends(data);
      } catch (err) {
        console.error('Failed to fetch friends:', err);
        setFriends([]);
      }
    };
    fetchFriends();
  }, []);

  // ============================================================================
  // Group selection effect
  // ============================================================================

  useEffect(() => {
    if (!selectedGroupId) {
      if (user) {
        setParticipants([{ id: user.id, name: user.name, email: user.email, avatar: user.picture }]);
        setPaidBy(user.id);
      }
      return;
    }

    const fetchGroupDetails = async () => {
      try {
        const data = await api.get<{ members: GroupMember[] }>(`/groups/${selectedGroupId}`);
        const members: Participant[] = data.members.map((m) => ({
          id: m.userId,
          name: m.name,
          email: m.email,
          avatar: m.avatar,
        }));
        const allMembers = members.some((m) => m.id === user?.id) ? members : [...members, { id: user?.id || '', name: user?.name || '', email: user?.email || '', avatar: user?.picture || '' }];
        setParticipants(allMembers);
        const currentUserInList = allMembers.find((m) => m.id === user?.id);
        setPaidBy(currentUserInList?.id || allMembers[0]?.id || '');
      } catch (err) {
        console.error('Failed to fetch group members:', err);
      }
    };
    fetchGroupDetails();
  }, [selectedGroupId, user, setParticipants, setPaidBy]);

  // ============================================================================
  // Computed values
  // ============================================================================

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
    const current = state.participants.find((p) => p.id === currentUser.id);
    if (!current) {
      return [currentUser, ...state.participants.filter((p) => p.id !== currentUser.id)];
    }
    return state.participants;
  }, [state.participants, currentUser]);

  const paidByOptions: SelectOption[] = useMemo(() => {
    return allParticipants.map((p) => ({
      value: p.id,
      label: p.name,
      icon: <Avatar size="xs" name={p.name} src={p.avatar} />,
    }));
  }, [allParticipants]);


  const headerTitle = useMemo(() => {
    return state.title.trim() ? toTitleCase(state.title.trim()) : 'New Expense';
  }, [state.title]);

  // Determine the image to display in the header thumbnail
  const pendingFiles = getPendingFiles();
  const hasPendingImage = pendingFiles.length > 0;
  const headerPreviewUrl = hasPendingImage ? URL.createObjectURL(pendingFiles[0]) : null;

  // Clean up header preview URL
  useEffect(() => {
    return () => {
      if (headerPreviewUrl) {
        URL.revokeObjectURL(headerPreviewUrl);
      }
    };
  }, [headerPreviewUrl]);

  // ============================================================================
  // Handlers
  // ============================================================================

  const handleGroupSelect = useCallback((groupId: string | null) => {
    setGroupId(groupId);
    setSearchQuery('');
  }, [setGroupId]);

  const handleAddParticipant = useCallback((person: Participant) => {
    if (allParticipants.some((p) => p.id === person.id)) {
      toast.warning('This participant has already been added.');
      return;
    }
    const newParticipant: Participant = {
      id: person.id,
      name: person.name,
      email: person.email,
      avatar: person.avatar || '',
    };
    setParticipants([...allParticipants, newParticipant]);
    setSearchQuery('');
  }, [allParticipants, setParticipants]);

  const handleRemoveParticipant = useCallback((id: string) => {
    if (id === currentUser?.id) return;
    setParticipants(allParticipants.filter((p) => p.id !== id));
  }, [allParticipants, currentUser?.id, setParticipants]);

  const handleFilesAdded = useCallback((files: File[]) => {
    const { added } = addFiles(files);
    if (added.length > 0) {
      toast.success(`${added.length} file${added.length > 1 ? 's' : ''} added successfully.`);
    }
  }, [addFiles]);

  const handleRemoveFile = useCallback((filename: string) => {
    removeFile(filename);
  }, [removeFile]);

  const handleSendInvite = useCallback(async () => {
    if (!isValidEmail(inviteEmail)) {
      setInviteStatus('error');
      return;
    }

    setInviteStatus('sending');

    try {
      await api.post('/friends/requests', { email: inviteEmail });
      setInviteStatus('sent');
      toast.success(`Friend request sent to ${inviteEmail}`);
      setTimeout(() => {
        setInviteStatus('idle');
        setInviteEmail('');
        setSearchQuery('');
      }, 3000);
    } catch (error) {
      setInviteStatus('idle');
      if (error instanceof ApiError) {
        if (error.code === 'NOT_FOUND') {
          toast.error('User not found. Please sign up for the app first, then you can send a friend request.');
        } else if (error.code === 'CONFLICT') {
          toast.error('Friend request already sent or you are already friends.');
        } else {
          toast.error(error.getUserMessage());
        }
      } else {
        toast.error('Something went wrong. Please try again.');
      }
    }
  }, [inviteEmail]);

  const handleSearchChange = useCallback((value: string) => {
    setSearchQuery(value);
    setInviteStatus('idle');
    setInviteEmail(value);
  }, []);

  const isQueryMatchAddedParticipant = (query: string) => {
    if (!query.trim()) return false;
    const lower = query.toLowerCase();
    return allParticipants.some((p) =>
      p.name.toLowerCase().includes(lower) ||
      p.email.toLowerCase().includes(lower)
    );
  };

  const filteredFriends = useMemo(() => {
    if (!searchQuery.trim()) return [];
    const query = searchQuery.toLowerCase().trim();
    return friends.filter((f) =>
      !allParticipants.some((p) => p.id === f.id) &&
      (f.name.toLowerCase().includes(query) || f.email.toLowerCase().includes(query))
    );
  }, [searchQuery, friends, allParticipants]);

  const groupMembers = useMemo(() => {
    if (!selectedGroupId) return [];
    return allParticipants.filter((p) => p.id !== currentUser?.id);
  }, [selectedGroupId, allParticipants, currentUser]);

  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) return [];
    if (selectedGroupId) {
      const available = groupMembers.filter((m) =>
        !allParticipants.some((p) => p.id === m.id) &&
        (m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
         m.email.toLowerCase().includes(searchQuery.toLowerCase()))
      );
      return available;
    } else {
      return filteredFriends;
    }
  }, [searchQuery, selectedGroupId, groupMembers, allParticipants, filteredFriends]);

  const isQueryMatchExisting = useMemo(() => {
    if (!searchQuery.trim()) return false;
    const query = searchQuery.toLowerCase().trim();
    return friends.some((f) =>
      f.name.toLowerCase().includes(query) ||
      f.email.toLowerCase().includes(query)
    );
  }, [searchQuery, friends]);

  const breadcrumbItems = [
    { label: 'Dashboard', href: '/dashboard' },
    { label: 'Expenses', href: '/expenses' },
    { label: headerTitle },
  ];

  const handleSubmit = useCallback(async () => {
    await submitForm();
    await handleSubmitSuccess();
  }, [submitForm, handleSubmitSuccess]);

  if (isRestoring) {
    return (
      <div className={styles.loadingPage}>
        <p>Loading...</p>
      </div>
    );
  }

  if (!currentUser) {
    return (
      <div className={styles.loadingPage}>
        <p>Loading...</p>
      </div>
    );
  }

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

          <FormHeader
            title={headerTitle}
            thumbnailUrl={headerPreviewUrl}
            avatarUrl={currentUser.avatar}
            userName={currentUser.name}
          />

          <AmountSection
            totalAmount={state.totalAmount}
            onAmountChange={setAmount}
            currency={state.currency}
            onCurrencyChange={setCurrency}
            error={amountError}
            autoFocus
          />

          <TitleSection
            title={state.title}
            onChange={setTitle}
            error={titleError}
          />

          <DateTimeSection
            value={state.expenseDate}
            onChange={setExpenseDate}
            error={dateError}
          />

          <ReceiptSection
            files={getPendingFiles()}
            uploadProgress={state.uploadProgress}
            onFilesAdded={handleFilesAdded}
            onRemove={handleRemoveFile}
            isUploading={state.isUploading}
          />

          <DescriptionSection
            description={state.description}
            onChange={setDescription}
            isExpanded={isDescriptionExpanded}
            onToggle={() => setIsDescriptionExpanded(!isDescriptionExpanded)}
          />

          <hr className={styles.divider} />

          <GroupSelector
            selectedGroupId={selectedGroupId}
            onGroupSelect={handleGroupSelect}
            groups={groups}
            isLoading={groupsLoading}
            error={groupsError}
          />

          <PaidBySection
            value={state.paidBy}
            options={paidByOptions}
            onChange={setPaidBy}
            error={paidByError}
          />

          <ParticipantsSection
            participants={allParticipants}
            currentUserId={currentUser.id}
            searchQuery={searchQuery}
            onSearchChange={handleSearchChange}
            searchResults={searchResults}
            selectedGroupId={selectedGroupId}
            selectedGroupName={selectedGroup?.name}
            onAddParticipant={handleAddParticipant}
            onRemoveParticipant={handleRemoveParticipant}
            inviteEmail={inviteEmail}
            onInviteEmailChange={setInviteEmail}
            inviteStatus={inviteStatus}
            onSendInvite={handleSendInvite}
            isQueryMatchAddedParticipant={isQueryMatchAddedParticipant}
            isValidEmail={isValidEmail}
            isQueryMatchExisting={isQueryMatchExisting}
            error={participantsError}
          />

          <SplitSection
            participants={allParticipants}
            splitType={state.splitType}
            onSplitTypeChange={setSplitType}
            paidBy={state.paidBy}
            totalAmount={state.totalAmount}
            manualSplits={state.manualSplits}
            onManualSplitsChange={setManualSplits}
            equalShare={equalShare}
            manualSum={manualSum}
            remainingAmount={remainingAmount}
            isFullyAllocated={isFullyAllocated}
            currentUserId={currentUser.id}
            error={manualSplitError}
          />

          <div className={styles.footerSpacer} />
        </div>
      </div>

      <FormActions
        submitError={submitError}
        isSubmitting={isSubmitting}
        isUploading={state.isUploading}
        isFormValid={isFormValid}
        onSubmit={handleSubmit}
      />
    </div>
  );
}