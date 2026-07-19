import React, { useCallback } from 'react';
import { FaTimes, FaCheckCircle, FaExclamationTriangle, FaEnvelope, FaUserPlus } from 'react-icons/fa';
import { Avatar } from '@/shared/_components/atoms/Avatar';
import { Badge } from '@/shared/_components/atoms/Badge';
import { Button } from '@/shared/_components/atoms/Button';
import { SearchInput } from '@/shared/_components/molecules/SearchInput/SearchInput';
import { toast } from '@/shared/_components/molecules/Toast/ToastProvider';
import styles from '../page.module.css';

interface Participant {
  id: string;
  name: string;
  email: string;
  avatar?: string;
}

export interface ParticipantsSectionProps {
  /** Current list of participants */
  participants: Participant[];
  /** ID of the current user (for "You" badge) */
  currentUserId: string;
  /** Current search query */
  searchQuery: string;
  /** Callback when search query changes */
  onSearchChange: (value: string) => void;
  /** Search results to display */
  searchResults: Participant[];
  /** Selected group ID (for determining if group members only) */
  selectedGroupId: string | null;
  /** Selected group name (for display in restriction message) */
  selectedGroupName?: string | null;
  /** Callback to add a participant */
  onAddParticipant: (person: Participant) => void;
  /** Callback to remove a participant */
  onRemoveParticipant: (id: string) => void;
  /** Invite email for friend requests */
  inviteEmail: string;
  /** Callback when invite email changes */
  onInviteEmailChange: (value: string) => void;
  /** Invite status */
  inviteStatus: 'idle' | 'sending' | 'sent' | 'error';
  /** Callback to send invite */
  onSendInvite: () => Promise<void>;
  /** Function to check if query matches an existing participant */
  isQueryMatchAddedParticipant: (query: string) => boolean;
  /** Function to validate email */
  isValidEmail: (email: string) => boolean;
  /** Whether friends exist matching the query */
  isQueryMatchExisting: boolean;
  /** Validation error message for participants */
  error?: string | null;
  /** Additional CSS class */
  className?: string;
}

export const ParticipantsSection: React.FC<ParticipantsSectionProps> = ({
  participants,
  currentUserId,
  searchQuery,
  onSearchChange,
  searchResults,
  selectedGroupId,
  selectedGroupName,
  onAddParticipant,
  onRemoveParticipant,
  inviteEmail,
  onInviteEmailChange,
  inviteStatus,
  onSendInvite,
  isQueryMatchAddedParticipant,
  isValidEmail,
  isQueryMatchExisting,
  error,
  className = '',
}) => {
  const isParticipantAdded = (personId: string) => {
    return participants.some(p => p.id === personId);
  };

  const handleAddParticipant = useCallback((person: Participant) => {
    if (isParticipantAdded(person.id)) {
      toast.warning('This participant has already been added.');
      return;
    }
    onAddParticipant(person);
  }, [participants, onAddParticipant]);

  const handleRemoveParticipant = useCallback((id: string) => {
    if (id === currentUserId) return;
    onRemoveParticipant(id);
  }, [currentUserId, onRemoveParticipant]);

  const searchPlaceholder = selectedGroupId ? 'Add group members...' : 'Add people...';

  return (
    <div className={`${styles.fieldGroup} ${className}`}>
      <label className={styles.label}>
        Participants <span className={styles.required}>*</span>
      </label>
      <div className={styles.participantsContainer}>
        <div className={styles.chipList}>
          {participants.map((p) => {
            const isCurrent = p.id === currentUserId;
            return (
              <div key={p.id} className={styles.chip}>
                <Avatar size="xs" src={p.avatar} name={p.name} />
                <span>{p.name}</span>
                {isCurrent && <Badge variant="primary" size="sm" className={styles.youBadge}>You</Badge>}
                {!isCurrent && (
                  <button
                    className={styles.chipRemove}
                    onClick={() => handleRemoveParticipant(p.id)}
                    aria-label={`Remove ${p.name}`}
                  >
                    <FaTimes />
                  </button>
                )}
              </div>
            );
          })}

          <div className={styles.searchWrapper}>
            <SearchInput
              value={searchQuery}
              onChange={onSearchChange}
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

                    if (matchAdded) {
                      return (
                        <div className={styles.alreadyAddedMessage}>
                          <FaCheckCircle className={styles.alreadyAddedIcon} />
                          <span>This participant has already been added</span>
                        </div>
                      );
                    } else if (searchResults.length > 0) {
                      return searchResults.map((person) => (
                        <div
                          key={person.id}
                          className={styles.searchResultItem}
                          onClick={() => handleAddParticipant(person)}
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
                            Only members of <strong>&quot;{selectedGroupName || 'this group'}&quot;</strong> can be added as participants.
                          </span>
                        </div>
                      );
                    }
                  })()
                ) : (
                  (() => {
                    if (searchResults.length > 0) {
                      return searchResults.map((person) => (
                        <div
                          key={person.id}
                          className={styles.searchResultItem}
                          onClick={() => handleAddParticipant(person)}
                        >
                          <Avatar size="xs" name={person.name} src={person.avatar} />
                          <span>{person.name}</span>
                        </div>
                      ));
                    } else if (isValidEmail(searchQuery) && !isQueryMatchExisting) {
                      return (
                        <div className={styles.inviteSection}>
                          <div className={styles.inviteHeader}>
                            <FaUserPlus className={styles.inviteIcon} />
                            <span className={styles.inviteTitle}>No friends found</span>
                          </div>
                          <div className={styles.inviteBody}>
                            <p className={styles.inviteDescription}>
                              Invite <strong>&quot;{searchQuery}&quot;</strong> via email
                            </p>
                            <div className={styles.inviteInputGroup}>
                              <div className={styles.inviteInputWrapper}>
                                <FaEnvelope className={styles.inviteInputIcon} />
                                <input
                                  type="email"
                                  className={styles.inviteInput}
                                  placeholder="Enter email address"
                                  value={inviteEmail}
                                  onChange={(e) => onInviteEmailChange(e.target.value)}
                                  disabled={inviteStatus === 'sending' || inviteStatus === 'sent'}
                                />
                              </div>
                              <Button
                                variant="primary"
                                size="sm"
                                onClick={onSendInvite}
                                loading={inviteStatus === 'sending'}
                                disabled={!isValidEmail(inviteEmail) || inviteStatus === 'sent'}
                                className={styles.inviteButton}
                              >
                                {inviteStatus === 'sent' ? 'Invited ✓' : 'Send Invite'}
                              </Button>
                            </div>
                            <div className={styles.inviteDisclaimer}>
                              Enter your friend&apos;s correct email address.
                            </div>
                            {inviteStatus === 'sent' && (
                              <div className={styles.inviteSuccess}>
                                <FaCheckCircle /> Invitation sent successfully!
                              </div>
                            )}
                            {inviteStatus === 'error' && (
                              <div className={styles.inviteError}>
                                Please enter a valid email address.
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    } else {
                      return (
                        <div className={styles.groupRestrictionMessage}>
                          <FaExclamationTriangle className={styles.groupRestrictionIcon} />
                          <span>No friends found with that name or email.</span>
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
          {participants.length < 2 && (
            <span className={styles.hintError}>Add at least one more person</span>
          )}
          {error && <span className={styles.hintError}>{error}</span>}
        </div>
      </div>
    </div>
  );
};

export default ParticipantsSection;