# TrueSplit – Complete Workflow Raw Sketch

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    1. USER AUTHENTICATION (pre‑requisite)                  │
│                                                                             │
│  User logs in → JWT token issued → stored in HttpOnly cookie               │
│  All subsequent requests include token via cookie / header                 │
└─────────────────────────────────────────────────────────────────────────────┘
                                      │
                                      ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                        2. FRIEND MANAGEMENT                                │
│                                                                             │
│  ┌───────────────────────────────────────────────────────────────────────┐ │
│  │  2a. Send Friend Request                                             │ │
│  │  User A → POST /friends/requests { email: "B@example.com" }         │ │
│  │       │                                                              │ │
│  │       ▼                                                              │ │
│  │  Check: email exists? → No → 404 USER_NOT_FOUND                     │ │
│  │  Check: already friends? → Yes → 409 CONFLICT                       │ │
│  │  Check: pending request exists? → Yes → 409 CONFLICT                │ │
│  │  Check: self? → Yes → 400 BAD_REQUEST                               │ │
│  │  All valid → Create FriendRequest (PENDING) → Notify User B         │ │
│  │  Response: 201 CREATED                                               │ │
│  └───────────────────────────────────────────────────────────────────────┘ │
│                                      │                                      │
│                                      ▼                                      │
│  ┌───────────────────────────────────────────────────────────────────────┐ │
│  │  2b. Accept / Reject Request                                        │ │
│  │  User B → PATCH /friends/requests/{id} { action: "ACCEPT" }         │ │
│  │       │                                                              │ │
│  │       ▼                                                              │ │
│  │  Verify User B is the recipient → No → 403 FORBIDDEN                │ │
│  │  If ACCEPT → Create bidirectional friendship records                │ │
│  │  If REJECT → Delete request or mark REJECTED                        │ │
│  │  Notify User A                                                       │ │
│  │  Response: 200 OK                                                    │ │
│  └───────────────────────────────────────────────────────────────────────┘ │
│                                      │                                      │
│                                      ▼                                      │
│  ┌───────────────────────────────────────────────────────────────────────┐ │
│  │  2c. View Friends & Pending Requests                                │ │
│  │  GET /friends → list of friends (paginated, searchable)             │ │
│  │  GET /friends/requests/pending → incoming/outgoing pending requests │ │
│  └───────────────────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────────────────┘
                                      │
                                      ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                        3. GROUP MANAGEMENT                                 │
│                                                                             │
│  ┌───────────────────────────────────────────────────────────────────────┐ │
│  │  3a. Create Group                                                    │ │
│  │  User A → POST /groups { name: "Family", memberEmails: [...] }      │ │
│  │       │                                                              │ │
│  │       ▼                                                              │ │
│  │  Validate all emails exist → No → 400 BAD_REQUEST                   │ │
│  │  Create Group → User A = ownerId                                    │ │
│  │  Add members → GroupMember records (hasPermission = false)          │ │
│  │  Response: 201 CREATED with group details                           │ │
│  └───────────────────────────────────────────────────────────────────────┘ │
│                                      │                                      │
│                                      ▼                                      │
│  ┌───────────────────────────────────────────────────────────────────────┐ │
│  │  3b. Add / Remove Members (Owner Only)                              │ │
│  │  POST /groups/{groupId}/members { emails: [...] }                   │ │
│  │  DELETE /groups/{groupId}/members/{userId}                          │ │
│  │  Only owner allowed → 403 FORBIDDEN if not owner                    │ │
│  │  Cannot remove owner                                                │ │
│  └───────────────────────────────────────────────────────────────────────┘ │
│                                      │                                      │
│                                      ▼                                      │
│  ┌───────────────────────────────────────────────────────────────────────┐ │
│  │  3c. Request Access (Non‑Owner Member)                              │ │
│  │  User B (member of group, no permission) →                          │ │
│  │  POST /groups/{groupId}/access-requests                             │ │
│  │       │                                                              │ │
│  │       ▼                                                              │ │
│  │  Check: User B is a member? → No → 400 BAD_REQUEST                 │ │
│  │  Check: User B already has permission? → Yes → 409 CONFLICT        │ │
│  │  Check: pending request exists? → Yes → 409 CONFLICT               │ │
│  │  Create AccessRequest (PENDING) → Notify Group Owner               │ │
│  │  Response: 201 CREATED                                               │ │
│  └───────────────────────────────────────────────────────────────────────┘ │
│                                      │                                      │
│                                      ▼                                      │
│  ┌───────────────────────────────────────────────────────────────────────┐ │
│  │  3d. Grant / Revoke Access (Owner Only)                             │ │
│  │  Owner → PATCH /groups/{groupId}/access-requests/{id}               │ │
│  │  { action: "APPROVE" or "REJECT" }                                  │ │
│  │  If APPROVE → set hasPermission = true for that user in GroupMember │ │
│  │  If REJECT → delete request or mark REJECTED                        │ │
│  │  Notify requester                                                    │ │
│  └───────────────────────────────────────────────────────────────────────┘ │
│                                      │                                      │
│                                      ▼                                      │
│  ┌───────────────────────────────────────────────────────────────────────┐ │
│  │  3e. List Groups (Owned + Accessible + Locked)                     │ │
│  │  GET /groups → returns:                                             │ │
│  │    - owned: groups where user is owner                             │ │
│  │    - accessible: groups where user has permission (hasPermission=true)│ │
│  │    - locked: groups where user is member but no permission          │ │
│  └───────────────────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────────────────┘
                                      │
                                      ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                        4. EXPENSE CREATION                                 │
│                                                                             │
│  ┌───────────────────────────────────────────────────────────────────────┐ │
│  │  4a. User Initiates Expense Creation                                │ │
│  │  User A → Opens Create Expense UI                                   │ │
│  │  Fills: Amount, Title, Date/Time, Receipt (optional)               │ │
│  │  Selects: Group (optional) → if selected, participants auto‑filled │ │
│  │  Selects: Participants (from friends or group members)             │ │
│  │  Selects: Paid By (default: self, dropdown of participants)         │ │
│  │  Selects: Split Type (EQUAL / MANUAL)                              │ │
│  │  If MANUAL: enters amounts for each participant                     │ │
│  └───────────────────────────────────────────────────────────────────────┘ │
│                                      │                                      │
│                                      ▼                                      │
│  ┌───────────────────────────────────────────────────────────────────────┐ │
│  │  4b. Submit Expense to Backend                                      │ │
│  │  POST /expenses                                                     │ │
│  │  {                                                                  │ │
│  │    title, description, totalAmount, currency, splitType,            │ │
│  │    paidBy, participants[], expenseDate, expenseTime, timezone,     │ │
│  │    groupId (optional), manualSplits (optional)                     │ │
│  │  }                                                                  │ │
│  └───────────────────────────────────────────────────────────────────────┘ │
│                                      │                                      │
│                                      ▼                                      │
│  ┌───────────────────────────────────────────────────────────────────────┐ │
│  │  4c. Backend Validation & Processing                                │ │
│  │                                                                      │ │
│  │  Step 1: Validate input                                             │ │
│  │    ✅ Title exists, min 3 chars, max 100                            │ │
│  │    ✅ Amount > 0 with 2 decimals                                    │ │
│  │    ✅ Split type = EQUAL or MANUAL                                  │ │
│  │    ✅ PaidBy is in participants list                                │ │
│  │    ✅ Participants count >= 2                                       │ │
│  │    ✅ All participants exist in DB                                  │ │
│  │    ✅ If manual splits: sum matches total (tolerance 0.01)          │ │
│  │    ✅ If groupId provided: user has permission AND                 │ │
│  │       all participants are members of that group                   │ │
│  │                                                                      │ │
│  │  Step 2: Generate unique slug (title‑slugified, append counter)     │ │
│  │                                                                      │ │
│  │  Step 3: Create Expense record                                      │ │
│  │    status = PENDING                                                 │ │
│  │                                                                      │ │
│  │  Step 4: Create ParticipantStatus records for each participant      │ │
│  │    - Payer status = ACCEPTED (auto‑accepted)                        │ │
│  │    - Others status = PENDING                                        │ │
│  │    - store shareAmount (calculated from splits)                     │ │
│  │                                                                      │ │
│  │  Step 5: Send notifications to participants (except payer)          │ │
│  │    "You have been added to expense: {title} by {payer}"             │ │
│  │    with Accept / Reject actions                                     │ │
│  │                                                                      │ │
│  │  Step 6: Return expense ID + status                                │ │
│  └───────────────────────────────────────────────────────────────────────┘ │
│                                      │                                      │
│                                      ▼                                      │
│  ┌───────────────────────────────────────────────────────────────────────┐ │
│  │  4d. Participant Accept / Reject                                    │ │
│  │  User B (participant) → GET /expenses/{id}/status                   │ │
│  │  → sees PENDING status                                              │ │
│  │  → clicks Accept or Reject                                          │ │
│  │  PATCH /expenses/{id}/participants/{userId} { action: "ACCEPT" }   │ │
│  └───────────────────────────────────────────────────────────────────────┘ │
│                                      │                                      │
│                                      ▼                                      │
│  ┌───────────────────────────────────────────────────────────────────────┐ │
│  │  4e. Backend Processes Accept/Reject                                │ │
│  │                                                                      │ │
│  │  ✅ Verify user is the participant (not payer)                      │ │
│  │  ✅ Verify expense exists and is PENDING                            │ │
│  │                                                                      │ │
│  │  If ACCEPT:                                                         │ │
│  │    - Update ParticipantStatus to ACCEPTED                           │ │
│  │    - Check if all participants have accepted                        │ │
│  │    - If yes → update Expense status to ACTIVE                       │ │
│  │    - Notify payer that participant accepted                         │ │
│  │                                                                      │ │
│  │  If REJECT:                                                         │ │
│  │    - Update ParticipantStatus to REJECTED                           │ │
│  │    - Remove participant from expense (or mark inactive)             │ │
│  │    - Recalculate splits:                                             │ │
│  │      * If EQUAL: redistribute total amount among remaining          │ │
│  │        participants (including payer)                               │ │
│  │      * If MANUAL: payer absorbs the rejected share (or             │ │
│  │        recalculate manually – owner decides, but for simplicity     │ │
│  │        we'll add the rejected amount to the payer's share)          │ │
│  │    - Update remaining participants' shares                         │ │
│  │    - If only 1 participant remains → cancel expense                 │ │
│  │    - Notify payer that participant rejected                         │ │
│  │                                                                      │ │
│  │  Response: 200 OK with updated status                               │ │
│  └───────────────────────────────────────────────────────────────────────┘ │
│                                      │                                      │
│                                      ▼                                      │
│  ┌───────────────────────────────────────────────────────────────────────┐ │
│  │  4f. Expense Settled (Later)                                        │ │
│  │  When all participants have paid their shares, the payer can        │ │
│  │  mark the expense as SETTLED.                                       │ │
│  │  PATCH /expenses/{id}/settle                                        │ │
│  │  - Update all ParticipantStatus to SETTLED                          │ │
│  │  - Update Expense status to SETTLED                                 │ │
│  └───────────────────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 5. Complete Interaction Diagram – All Flows Together

```
User A (Payer)                     Backend                          User B (Friend/Participant)               Group Owner
     │                                  │                                     │                                   │
     │  1. Send Friend Request           │                                     │                                   │
     │─────────────────────────────────>│                                     │                                   │
     │                                  │  2. Create FriendRequest (PENDING)   │                                   │
     │                                  │─────────────────────────────────────>│                                   │
     │                                  │                                     │                                   │
     │                                  │  3. Notify User B (email/push)      │                                   │
     │                                  │─────────────────────────────────────>│                                   │
     │                                  │                                     │                                   │
     │  4. Accept/Reject Friend Req     │                                     │                                   │
     │<───────────────────────────────────────────────────────────────────────────│                                   │
     │                                  │  5. Update FriendRequest (ACCEPTED) │                                   │
     │                                  │  create friendship                  │                                   │
     │                                  │─────────────────────────────────────>│                                   │
     │                                  │                                     │                                   │
     │  6. Create Group (optional)      │                                     │                                   │
     │─────────────────────────────────>│                                     │                                   │
     │                                  │  7. Create Group (owner = User A)   │                                   │
     │                                  │  Add members                        │                                   │
     │                                  │─────────────────────────────────────>│                                   │
     │                                  │                                     │                                   │
     │  8. Request Access (Group)       │                                     │                                   │
     │<───────────────────────────────────────────────────────────────────────────│                                   │
     │                                  │  9. Create AccessRequest (PENDING)  │                                   │
     │                                  │────────────────────────────────────────────────────────────────────────────>│
     │                                  │                                     │                                   │
     │                                  │  10. Grant Access (Owner only)      │                                   │
     │                                  │<────────────────────────────────────────────────────────────────────────────│
     │                                  │                                     │                                   │
     │  11. Create Expense              │                                     │                                   │
     │  (with participants + group)     │                                     │                                   │
     │─────────────────────────────────>│                                     │                                   │
     │                                  │  12. Validate:                     │                                   │
     │                                  │  - all participants exist          │                                   │
     │                                  │  - payer in participants           │                                   │
     │                                  │  - if group: all participants in   │                                   │
     │                                  │    group & user has permission     │                                   │
     │                                  │  13. Create Expense (PENDING)      │                                   │
     │                                  │  14. Create ParticipantStatus      │                                   │
     │                                  │  15. Notify participants           │                                   │
     │                                  │─────────────────────────────────────>│                                   │
     │                                  │                                     │                                   │
     │  16. Participant Accept/Reject   │                                     │                                   │
     │                                  │<─────────────────────────────────────│                                   │
     │                                  │  17. If ACCEPT:                    │                                   │
     │                                  │  - update status to ACCEPTED       │                                   │
     │                                  │  - if all accepted: status ACTIVE  │                                   │
     │                                  │  18. If REJECT:                    │                                   │
     │                                  │  - remove participant              │                                   │
     │                                  │  - recalculate splits              │                                   │
     │                                  │  - if only 1 left: cancel          │                                   │
     │                                  │  19. Notify payer (User A)         │                                   │
     │                                  │─────────────────────────────────────>│                                   │
     │                                  │                                     │                                   │
     │  20. Mark as Settled (later)     │                                     │                                   │
     │─────────────────────────────────>│                                     │                                   │
     │                                  │  21. Update status to SETTLED      │                                   │
     │                                  │  update participant statuses       │                                   │
     │                                  │─────────────────────────────────────>│                                   │
```

---

## 6. Key Decision Points & Error Flows

| Point | Decision | Outcome |
|-------|----------|---------|
| **Friend Request** | Is recipient existing? | Yes → proceed; No → 404 |
|  | Already friends? | No → proceed; Yes → 409 |
|  | Pending request? | No → proceed; Yes → 409 |
| **Group Access Request** | Is requester a member? | Yes → proceed; No → 400 |
|  | Already has permission? | No → proceed; Yes → 409 |
|  | Pending request? | No → proceed; Yes → 409 |
| **Expense Creation** | Group selected? | Yes → validate members & permission; No → validate friends |
|  | Split type EQUAL? | Auto-calculate shares |
|  | Split type MANUAL? | Validate sum matches total |
| **Accept/Reject** | Is participant payer? | Cannot reject own expense → 400 |
|  | Is expense PENDING? | Yes → proceed; No → 400 |
|  | Accept → all accepted? | Yes → ACTIVE; No → remain PENDING |
|  | Reject → recalculated, only payer left? | Yes → cancel expense |
|  | Reject → recalculation of splits | Payer absorbs share; manual splits adjust |

---

This raw sketch covers the entire end‑to‑end flow, showing how friends, groups, and expenses work together. It includes all validation, error handling, and state transitions.