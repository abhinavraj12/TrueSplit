'use client';

import React, { useState } from 'react';
import { FormField } from '@/shared/_components/molecules/FormField';
import { Input } from '@/shared/_components/atoms/Input';
import { Textarea } from '@/shared/_components/atoms/Textarea';
import { SelectDropdown } from '@/shared/_components/molecules/SelectDropdown';
import { Button } from '@/shared/_components/atoms/Button';
import { Typography } from '@/shared/_components/atoms/Typography';
import { Switch } from '@/shared/_components/atoms/Switch';
import { ToggleGroup } from '@/shared/_components/molecules/ToggleGroup';
import { UserChip } from '@/shared/_components/molecules/UserChip';
import { toast } from '@/shared/_components/molecules/Toast';
import styles from './page.module.css';

// Mock participant data
const initialParticipants = [
  { id: 1, name: 'Alice', src: 'https://i.pravatar.cc/150?img=1', status: 'online' as const },
  { id: 2, name: 'Bob', src: 'https://i.pravatar.cc/150?img=2', status: 'online' as const },
  { id: 3, name: 'Charlie', src: 'https://i.pravatar.cc/150?img=3', status: 'away' as const },
  { id: 4, name: 'David', src: 'https://i.pravatar.cc/150?img=4', status: 'offline' as const },
  { id: 5, name: 'Eve', src: 'https://i.pravatar.cc/150?img=5', status: 'busy' as const },
];

const initialGroupMembers = [
  { id: 6, name: 'Frank', src: 'https://i.pravatar.cc/150?img=6', status: 'online' as const },
  { id: 7, name: 'Grace', src: 'https://i.pravatar.cc/150?img=7', status: 'offline' as const },
  { id: 8, name: 'Hank', src: 'https://i.pravatar.cc/150?img=8', status: 'online' as const },
];

export default function FormFieldTestPage() {
  // Form states
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [bio, setBio] = useState('');
  const [role, setRole] = useState('');

  // ToggleGroup states
  const [viewMode, setViewMode] = useState('grid');
  const [permissions, setPermissions] = useState<string[]>(['read']);

  // UserChip states
  const [participants, setParticipants] = useState(initialParticipants);
  const [groupMembers] = useState(initialGroupMembers);

  // Validation states
  const [nameError, setNameError] = useState<string | boolean>(false);
  const [emailError, setEmailError] = useState<string | boolean>(false);
  const [passwordError, setPasswordError] = useState<string | boolean>(false);
  const [bioError, setBioError] = useState<string | boolean>(false);
  const [roleError, setRoleError] = useState<string | boolean>(false);

  // UI controls
  const [showHelper, setShowHelper] = useState(true);
  const [showRequired, setShowRequired] = useState(true);
  const [hideLabels, setHideLabels] = useState(false);
  const [toggleGroupDisabled, setToggleGroupDisabled] = useState(false);
  const [chipsDisabled, setChipsDisabled] = useState(false);

  // Validate form
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    let hasError = false;

    if (!name.trim()) {
      setNameError('Name is required');
      hasError = true;
    } else {
      setNameError(false);
    }

    if (!email.trim()) {
      setEmailError('Email is required');
      hasError = true;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setEmailError('Please enter a valid email address');
      hasError = true;
    } else {
      setEmailError(false);
    }

    if (password.length > 0 && password.length < 6) {
      setPasswordError('Password must be at least 6 characters');
      hasError = true;
    } else {
      setPasswordError(false);
    }

    if (!role) {
      setRoleError('Please select a role');
      hasError = true;
    } else {
      setRoleError(false);
    }

    if (bio.trim().length > 0 && bio.trim().length < 10) {
      setBioError('Bio must be at least 10 characters');
      hasError = true;
    } else {
      setBioError(false);
    }

    if (!hasError) {
      toast.success('Form submitted successfully!');
    }
  };

  // Reset all fields
  const handleReset = () => {
    setName('');
    setEmail('');
    setPassword('');
    setBio('');
    setRole('');
    setViewMode('grid');
    setPermissions(['read']);
    setParticipants(initialParticipants);
    setNameError(false);
    setEmailError(false);
    setPasswordError(false);
    setBioError(false);
    setRoleError(false);
  };

  // Remove a participant (dismissible)
  const handleRemoveParticipant = (id: number) => {
    setParticipants((prev) => prev.filter((p) => p.id !== id));
    toast.info(`Removed ${participants.find((p) => p.id === id)?.name} from participants`);
  };

  // Handle click on a group member
  const handleMemberClick = (name: string) => {
    toast.info(`Clicked on ${name} – navigate to profile`);
  };

  return (
    <div className={styles.pageContainer}>
      <div className={styles.header}>
        <Typography variant="h2" weight="semibold" color="primary">
          📝 FormField + UserChip Testing
        </Typography>
        <Typography variant="body" color="secondary">
          Real‑world form with validation, toggle groups, and user chips
        </Typography>
      </div>

      {/* Interactive Controls */}
      <div className={styles.controls}>
        <Typography variant="h6" weight="medium" color="primary">
          Toggle Features
        </Typography>
        <div className={styles.controlsRow}>
          <Switch
            label="Show Helper Text"
            checked={showHelper}
            onChange={setShowHelper}
            size="sm"
          />
          <Switch
            label="Required Fields"
            checked={showRequired}
            onChange={setShowRequired}
            size="sm"
          />
          <Switch
            label="Hide Labels"
            checked={hideLabels}
            onChange={setHideLabels}
            size="sm"
          />
          <Switch
            label="Disable Toggle Groups"
            checked={toggleGroupDisabled}
            onChange={setToggleGroupDisabled}
            size="sm"
          />
          <Switch
            label="Disable Chips"
            checked={chipsDisabled}
            onChange={setChipsDisabled}
            size="sm"
          />
        </div>
      </div>

      <form onSubmit={handleSubmit} className={styles.form}>
        {/* Name Field */}
        <FormField
          label="Full Name"
          error={nameError}
          helperText={showHelper ? 'Enter your full name as shown on ID' : undefined}
          required={showRequired}
          labelHidden={hideLabels}
        >
          <Input
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              if (nameError) setNameError(false);
            }}
            placeholder="John Doe"
            autoComplete="name"
          />
        </FormField>

        {/* Email Field */}
        <FormField
          label="Email Address"
          error={emailError}
          helperText={showHelper ? "We'll never share your email with anyone" : undefined}
          required={showRequired}
          labelHidden={hideLabels}
        >
          <Input
            type="email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              if (emailError) setEmailError(false);
            }}
            placeholder="you@example.com"
            autoComplete="email"
          />
        </FormField>

        {/* Password Field */}
        <FormField
          label="Password"
          error={passwordError}
          helperText={showHelper ? 'At least 6 characters' : undefined}
          required={showRequired}
          labelHidden={hideLabels}
        >
          <Input
            type="password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              if (passwordError) setPasswordError(false);
            }}
            placeholder="••••••"
            autoComplete="new-password"
          />
        </FormField>

        {/* Role Select */}
        <FormField
          label="Role"
          error={roleError}
          helperText={showHelper ? 'Select your primary role in the team' : undefined}
          required={showRequired}
          labelHidden={hideLabels}
        >
          <SelectDropdown
            value={role}
            onChange={(val) => {
              setRole(val);
              if (roleError) setRoleError(false);
            }}
            options={[
              { value: 'admin', label: 'Admin' },
              { value: 'manager', label: 'Manager' },
              { value: 'developer', label: 'Developer' },
              { value: 'designer', label: 'Designer' },
            ]}
            placeholder="Select a role"
            clearable={false}
          />
        </FormField>

        {/* View Mode – ToggleGroup (Single Select) */}
        <FormField
          label="View Mode"
          helperText={showHelper ? 'Choose how you want to see your data' : undefined}
          required={showRequired}
          labelHidden={hideLabels}
        >
          <ToggleGroup
            type="single"
            value={viewMode}
            onChange={setViewMode}
            options={[
              { value: 'grid', label: 'Grid' },
              { value: 'list', label: 'List' },
              { value: 'compact', label: 'Compact' },
            ]}
            size="sm"
            disabled={toggleGroupDisabled}
            fullWidth
          />
        </FormField>

        {/* Permissions – ToggleGroup (Multi Select) */}
        <FormField
          label="Permissions"
          helperText={showHelper ? 'Select the permissions you need' : undefined}
          required={showRequired}
          labelHidden={hideLabels}
        >
          <ToggleGroup
            type="multi"
            value={permissions}
            onChange={setPermissions}
            options={[
              { value: 'read', label: 'Read' },
              { value: 'write', label: 'Write' },
              { value: 'delete', label: 'Delete' },
            ]}
            size="sm"
            disabled={toggleGroupDisabled}
            fullWidth
          />
        </FormField>

        {/* Bio Textarea */}
        <FormField
          label="Bio"
          error={bioError}
          helperText={showHelper ? 'Tell us about yourself (min 10 characters)' : undefined}
          required={showRequired}
          labelHidden={hideLabels}
        >
          <Textarea
            value={bio}
            onChange={(e) => {
              setBio(e.target.value);
              if (bioError) setBioError(false);
            }}
            placeholder="Write something about yourself..."
            rows={3}
            autoResize
          />
        </FormField>

        {/* Display selected values for demo */}
        <div className={styles.selectedValues}>
          <Typography variant="small" color="muted">
            View Mode: <strong>{viewMode}</strong>
          </Typography>
          <Typography variant="small" color="muted">
            Permissions: <strong>{permissions.length ? permissions.join(', ') : 'None'}</strong>
          </Typography>
        </div>

        <div className={styles.actions}>
          <Button type="submit" variant="primary" size="md">
            Submit
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="md"
            onClick={handleReset}
          >
            Reset
          </Button>
        </div>
      </form>

      {/* UserChip Use Cases Section */}
      <div className={styles.chipSection}>
        <Typography variant="h4" weight="semibold" color="primary">
          👥 UserChip Use Cases
        </Typography>

        {/* Expense Participants (dismissible) */}
        <div className={styles.chipGroup}>
          <Typography variant="h6" weight="medium" color="primary">
            Expense Participants
            <span className={styles.chipCount}>({participants.length})</span>
          </Typography>
          <Typography variant="small" color="muted">
            Click the ✕ to remove a participant (dismissible)
          </Typography>
          <div className={styles.chipContainer}>
            {participants.map((user) => (
              <UserChip
                key={user.id}
                name={user.name}
                src={user.src}
                status={user.status}
                size="md"
                dismissible
                onDismiss={() => handleRemoveParticipant(user.id)}
                disabled={chipsDisabled}
              />
            ))}
          </div>
        </div>

        {/* Group Members (clickable) */}
        <div className={styles.chipGroup}>
          <Typography variant="h6" weight="medium" color="primary">
            Group Members
            <span className={styles.chipCount}>({groupMembers.length})</span>
          </Typography>
          <Typography variant="small" color="muted">
            Click a member to simulate profile navigation (clickable)
          </Typography>
          <div className={styles.chipContainer}>
            {groupMembers.map((user) => (
              <UserChip
                key={user.id}
                name={user.name}
                src={user.src}
                status={user.status}
                size="md"
                clickable
                onClick={() => handleMemberClick(user.name)}
                disabled={chipsDisabled}
                ariaLabel={`View profile for ${user.name}`}
              />
            ))}
          </div>
        </div>

        {/* Subtext example */}
        <div className={styles.chipGroup}>
          <Typography variant="h6" weight="medium" color="primary">
            With Subtext
          </Typography>
          <Typography variant="small" color="muted">
            Shows additional info below the name
          </Typography>
          <div className={styles.chipContainer}>
            <UserChip
              name="John Doe"
              src="https://i.pravatar.cc/150?img=12"
              subtext="john@example.com"
              size="md"
            />
            <UserChip
              name="Jane Smith"
              src="https://i.pravatar.cc/150?img=13"
              subtext="Product Designer"
              size="md"
              status="online"
            />
            <UserChip
              name="Michael Johnson"
              src="https://i.pravatar.cc/150?img=14"
              subtext="+1 234 567 890"
              size="md"
              status="busy"
            />
          </div>
        </div>
      </div>
    </div>
  );
}