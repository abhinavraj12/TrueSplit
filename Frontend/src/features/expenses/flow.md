# TrueSplit – Backend Implementation Workflow

## Expense Creation, Friends & Groups

This document defines the **complete end‑to‑end workflow** for expense creation, friend management, and group management. It covers the business logic, validation rules, edge cases, and API contracts required for a production‑ready implementation.

---

## 1. Overview

TrueSplit allows users to share expenses with friends and groups. The core flow:

1. Users add friends via email invitations (friend request).
2. Users create groups, add members, and manage permissions.
3. When creating an expense, users select participants from friends or group members.
4. Expenses are created with a payer, split type, and manual split amounts if needed.
5. Participants receive an expense request (approval/rejection) to prevent misuse.

---

## 2. Friend Management

### 2.1 Send Friend Request

**Endpoint:** `POST /api/v1/friends/requests`

**Request Body:**
```json
{
  "email": "friend@example.com"
}
```

**Business Logic:**
- Validate that the `email` is valid and belongs to an existing user (if the email is not registered, the request should be queued and sent when the user signs up – but for simplicity, we assume the email must belong to an existing user; alternatively, we can support pending invites).
- Check that a friend request does not already exist (pending or accepted) between the two users.
- Create a `FriendRequest` record with status `PENDING`, `createdAt`, and `updatedAt`.
- The request must be unique per pair.

**Response:**
- `201 Created` with request details.
- `400 Bad Request` if invalid email, self‑request, or duplicate.

### 2.2 Accept/Reject Friend Request

**Endpoint:** `PATCH /api/v1/friends/requests/{requestId}`

**Request Body:**
```json
{
  "action": "ACCEPT" | "REJECT"
}
```

**Business Logic:**
- Only the recipient of the request can accept/reject.
- If `ACCEPT`: create a bidirectional friendship record (or just store in user's friend list).
- If `REJECT`: delete the request or mark as `REJECTED`.
- After acceptance, both users can see each other in their friend lists.

**Response:**
- `200 OK` with updated request status.
- `403 Forbidden` if not the recipient.
- `404 Not Found` if request not found.

### 2.3 List Friends

**Endpoint:** `GET /api/v1/friends`

**Query Parameters:**
- `page`, `limit`, `search` (optional).

**Response:**
```json
{
  "friends": [
    {
      "id": "user-id",
      "name": "John Doe",
      "email": "john@example.com",
      "avatar": "url",
      "addedAt": "2026-07-07T10:00:00Z"
    }
  ],
  "pagination": { ... }
}
```

### 2.4 Pending Friend Requests (Incoming/Outgoing)

**Endpoint:** `GET /api/v1/friends/requests/pending`

**Response:** List of pending requests with sender/recipient info.

### 2.5 Remove Friend

**Endpoint:** `DELETE /api/v1/friends/{friendId}`

**Business Logic:**
- Remove the friendship relation from both sides.

---

## 3. Group Management

### 3.1 Create Group

**Endpoint:** `POST /api/v1/groups`

**Request Body:**
```json
{
  "name": "Family",
  "memberEmails": ["mom@example.com", "dad@example.com"]
}
```

**Business Logic:**
- The creator becomes the **owner**.
- All provided emails must belong to existing users.
- Members are added with status `MEMBER` (no permissions needed for members to be part of the group, but only the owner can manage group settings).
- Group is created with `ownerId` set to the current user.

**Response:**
- `201 Created` with group details.

### 3.2 Add Members to Group (Owner Only)

**Endpoint:** `POST /api/v1/groups/{groupId}/members`

**Request Body:**
```json
{
  "emails": ["new@example.com"]
}
```

**Business Logic:**
- Only the group owner can add members.
- Emails must belong to existing users.
- If a user is not already a member, add them.

### 3.3 Remove Members from Group (Owner Only)

**Endpoint:** `DELETE /api/v1/groups/{groupId}/members/{userId}`

**Business Logic:**
- Only owner can remove.
- Cannot remove the owner (unless group is deleted).

### 3.4 Group Access Requests (For Non‑Owners)

When a user wants to use a group they don't own (e.g., they are a member but the owner hasn't granted permission to create expenses for the group), they can request access.

**Endpoint:** `POST /api/v1/groups/{groupId}/access-requests`

**Request Body:** none (or optional message).

**Business Logic:**
- Check if the user is already a member; if not, they must first be added by the owner.
- If the user already has permission, return conflict.
- Create an `AccessRequest` record with status `PENDING`, linked to group and requester.
- Notify the group owner.

**Response:** `201 Created` with request details.

### 3.5 Grant/Revoke Access (Owner Only)

**Endpoint:** `PATCH /api/v1/groups/{groupId}/access-requests/{requestId}`

**Request Body:**
```json
{
  "action": "APPROVE" | "REJECT"
}
```

**Business Logic:**
- Only the group owner can approve/reject.
- If `APPROVE`: set `hasPermission = true` for that user on the group.
- If `REJECT`: delete the request or mark as rejected.

### 3.6 List Groups (Owned + Accessible)

**Endpoint:** `GET /api/v1/groups`

**Response:**
```json
{
  "owned": [
    {
      "id": "g1",
      "name": "Family",
      "membersCount": 4,
      "ownerId": "user-1"
    }
  ],
  "accessible": [
    {
      "id": "g2",
      "name": "Roommates",
      "membersCount": 3,
      "ownerId": "user-2",
      "permissionGranted": true
    }
  ],
  "locked": [
    // groups where user is member but no permission
  ]
}
```

### 3.7 Group Details (with Members)

**Endpoint:** `GET /api/v1/groups/{groupId}`

**Response:** Full group info, including members list.

---

## 4. Expense Creation Workflow

### 4.1 Preconditions

- User must be authenticated.
- Participants must be valid user IDs (existing users).
- The payer must be one of the participants.
- Total amount > 0.

### 4.2 API Endpoint

**Endpoint:** `POST /api/v1/expenses`

**Request Body:**
```json
{
  "title": "Dinner at Saravana Bhavan",
  "description": "Optional",
  "totalAmount": 1200.00,
  "currency": "INR",
  "splitType": "EQUAL", // or "MANUAL"
  "paidBy": "user-1",
  "participants": ["user-2", "user-3", "user-4"],
  "expenseDate": "2026-07-07",
  "expenseTime": "19:30",
  "timezone": "Asia/Kolkata",
  "receiptImage": null, // base64 or file upload handled separately
  "manualSplits": null // if splitType = MANUAL, array of {userId, amount}
}
```

**Business Logic Step‑by‑Step:**

1. **Validate input:**
   - Title required, min 3 chars, max 100.
   - Total amount > 0, with two decimal places.
   - Split type must be `EQUAL` or `MANUAL`.
   - Paid by must be one of the `participants` list.
   - Participants list must contain at least 2 users (including payer and at least one other).
   - All participant IDs must exist in the system.
   - If `splitType = MANUAL`: `manualSplits` must be provided, contain an entry for each participant, and sum to `totalAmount` (allow small floating‑point tolerance).
   - If `splitType = EQUAL`: calculate shares automatically.

2. **Fetch all participants' user objects** to ensure they exist; optionally check friend/group constraints if needed (but not required).

3. **Generate a unique slug** for the expense title (for URL routing).

4. **Create expense record** with status `PENDING` initially (if we require participant approval) or `ACTIVE` (if no approval needed – but our design includes approval flow).

   For each participant, create a `ParticipantStatus` entry:
   - `userId`
   - `status`: `PENDING`, `ACCEPTED`, `REJECTED`, `SETTLED`
   - `settledAt` (nullable)
   - `shareAmount` (the amount they owe or are owed)

   The payer's status could be `ACCEPTED` by default, as they initiated the expense.

5. **For each participant (except payer), send a notification/email**: "You have been added to an expense: [title] by [payer]. Please accept or reject."

6. **Return expense ID** and the generated status.

### 4.3 Expense Approval/Rejection Flow (Post‑Creation)

**Endpoint:** `PATCH /api/v1/expenses/{expenseId}/participants/{userId}`

**Request Body:**
```json
{
  "action": "ACCEPT" | "REJECT"
}
```

**Business Logic:**
- Only the participant themselves can accept/reject.
- If `ACCEPT`: mark their status as `ACCEPTED`.
- If `REJECT`: remove the participant from the expense, recalculate shares for remaining participants (if manual splits, redistribute the rejected amount to the payer or adjust; for equal splits, recalculate equal share among remaining participants). Update the payer's share if necessary (if payer was rejected? cannot reject payer, they are the one who created it). Actually, the payer cannot reject their own expense; they are always considered "accepted".
- If all participants have accepted, the expense status can be set to `ACTIVE`.
- If a participant rejects, the payer might be notified.

**Edge Cases:**
- If only one participant remains after rejection, the expense should be cancelled or marked as invalid (or allow the payer to keep it as a personal expense? Probably cancel).
- If the total amount changes due to rejection, manual splits need to be recalculated; for equal splits, the shares are redistributed evenly.

**Alternative Approach:** Instead of modifying the expense, you could create a new version or a cancellation request, but for simplicity, we'll update the expense.

### 4.4 Expense Statuses

- `PENDING`: created, awaiting participant confirmations.
- `ACTIVE`: all participants accepted (or automatically accepted if no approval required).
- `REJECTED`: one or more participants rejected, expense may be cancelled or modified.
- `SETTLED`: all shares settled (paid back).

---

## 5. Participant Selection Logic (Individual vs Group)

### 5.1 Individual Expenses
- Participants are selected from the user's **friends list** only (or can be any existing user? Our design allowed adding via email invite, but that creates a friend request first. So for simplicity, participants must be existing users. If a user is not a friend, the frontend shows an invite option, which triggers a friend request. Therefore, the expense creation only accepts user IDs that are friends or are in the same group (if group selected).

### 5.2 Group Expenses
- If the user selects a group (via `groupId` in the expense creation request), the participants list must be a subset of the group's members (including the current user).
- The backend should validate that all participants are members of that group.
- If no group is selected, participants can be any friends (or any users, but we restrict to friends for safety). The frontend already handles invites separately.

### 5.3 Group Selection in Expense Creation
- The request could include an optional `groupId`. If provided, the backend should verify that the user has **access** to that group (i.e., either owner or has permission). If the user doesn't have permission, they cannot create an expense for that group.

- Additionally, if a group is selected, the backend can auto‑fill participants from the group (but the frontend handles that). The backend should still enforce that the participants list only contains group members.

---

## 6. Validation Rules & Edge Cases

### 6.1 Amount and Currency
- Total amount must be > 0 with up to 2 decimal places.
- Currency must be a valid ISO currency code (default INR).
- Manual split amounts must sum to total (allow tolerance of 0.01 for rounding).

### 6.2 Participants
- List must not be empty and must include the payer.
- All participant IDs must exist.
- If group is selected, all participants must be members of that group.
- No duplicates.

### 6.3 Date and Time
- Expense date must be a valid date string (ISO 8601 date).
- Time is optional; if not provided, use current time.
- Timezone must be a valid IANA timezone.

### 6.4 Receipt Image
- Handled separately via file upload endpoint (not part of this spec).

### 6.5 Expense Slug
- Must be unique; generate from title, append counter if exists.

### 6.6 Friend Request
- Cannot send request to self.
- Must be unique (pending or accepted) – if a request already exists, return conflict.
- If a user is already a friend, cannot send another request.

### 6.7 Group Access
- Only owners can add/remove members.
- Only owners can approve/revoke access requests.
- A user can request access only if they are a member (or can be non‑member? We'll require they are a member first, so the request is for permission to create expenses, not to join the group).

---

## 7. Error Scenarios & HTTP Status Codes

| Scenario | HTTP Status | Error Code |
|----------|-------------|------------|
| Invalid input (e.g., missing title, negative amount) | 400 | `BAD_REQUEST` |
| Participant not found | 400 | `INVALID_PARTICIPANT` |
| Payer not in participants list | 400 | `PAYER_NOT_IN_PARTICIPANTS` |
| Manual splits sum mismatch | 400 | `MANUAL_SPLIT_SUM_MISMATCH` |
| Group selected but user lacks permission | 403 | `GROUP_ACCESS_DENIED` |
| Participant not in group | 400 | `PARTICIPANT_NOT_IN_GROUP` |
| Friend request already exists | 409 | `FRIEND_REQUEST_EXISTS` |
| User not found for friend request | 404 | `USER_NOT_FOUND` |
| Expense not found | 404 | `EXPENSE_NOT_FOUND` |
| Unauthorized (not owner/participant) | 403 | `FORBIDDEN` |

---

## 8. Data Models Summary

### User
- id, name, email, password (hashed), avatar, etc.

### Friend
- id, userId, friendId, createdAt (bidirectional – we can store both directions or just one with a query for both).

### FriendRequest
- id, senderId, recipientId, status (PENDING, ACCEPTED, REJECTED), createdAt, updatedAt.

### Group
- id, name, ownerId, createdAt, updatedAt.

### GroupMember
- id, groupId, userId, joinedAt, hasPermission (default false; only owner has true initially; can be granted by owner to others).

### AccessRequest
- id, groupId, requesterId, status (PENDING, APPROVED, REJECTED), createdAt, updatedAt.

### Expense
- id, title, slug, description, totalAmount, currency, splitType, paidBy, createdBy, participants (array of userIds), manualSplits (array of {userId, amount}), expenseDateTime, timezone, status (PENDING, ACTIVE, REJECTED, SETTLED), createdAt, updatedAt.

### ParticipantStatus
- expenseId, userId, status (PENDING, ACCEPTED, REJECTED, SETTLED), shareAmount, settledAt.

---

## 9. Notification/Events

- When a friend request is sent, notify the recipient (email/push).
- When a group access request is made, notify the group owner.
- When an expense is created, notify all participants (except payer) with accept/reject buttons.
- When a participant accepts/rejects, notify the payer.

---

## 10. Conclusion

This document covers the complete workflow for expense creation, friend and group management. It provides enough detail for backend developers to implement the required endpoints, business logic, and validation rules.

The key design decisions:

- Friend requests must be accepted before users appear in each other's friend lists.
- Groups have owners who manage membership and permissions.
- Expense participants can be friends or group members.
- New expenses require participant approval to prevent misuse.
- Rejection triggers recalculation of splits.

All these flows are integrated into a cohesive system that ensures data integrity and a smooth user experience.