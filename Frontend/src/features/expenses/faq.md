# TrueSplit – Complete FAQ: Create Expense

This comprehensive FAQ covers every aspect of creating an expense in TrueSplit, from user‑facing questions to backend validation rules, error handling, edge cases, and advanced scenarios.

---

## 1. General Questions

### Q1: What is the minimum information required to create an expense?
**A:** At minimum, you need:
- **Amount** (positive number with up to 2 decimal places)
- **Title** (at least 3 characters, max 100)
- **Paid By** (must be one of the participants)
- **Participants** (at least 2 people, including the payer)
- **Date** (defaults to today)

Everything else (description, receipt, group, manual splits, time, timezone) is optional or auto‑filled.

### Q2: Can I create an expense without selecting a group?
**A:** Yes. Groups are completely optional. If no group is selected, participants must be chosen from your friends list or added via email invite. The expense is then considered an individual/personal expense.

### Q3: Can I create an expense for a group I don't own?
**A:** Yes, but only if the group owner has granted you permission to create expenses for that group. If not, you'll see a "Request Access" button. Once the owner approves, the group becomes available for expense creation. Without permission, you cannot select that group.

### Q4: What happens to expenses if a group is deleted?
**A:** Expenses created for that group remain visible to all participants. The group association is stored in the expense record, but deleting the group does not delete the expenses. However, you cannot create new expenses for a deleted group.

### Q5: Can I edit an expense after creating it?
**A:** No. Expenses are immutable once created to prevent disputes and maintain a clear audit trail. If you need to change an expense:
- Cancel the expense and create a new one.
- Or, in a future version, we may support editing with full audit logging.

### Q6: Can I create an expense for someone who hasn't signed up yet?
**A:** Yes. You can enter their email address. The system will:
1. Check if the email exists in the system.
2. If not, send them an invitation to join TrueSplit.
3. Once they sign up, they will receive all pending friend requests and expense requests.
4. The expense will appear in their pending list after they join.

### Q7: What happens if I try to add a participant who is already added?
**A:** Duplicate participants are not allowed. The system will ignore duplicate entries or show an error: "This participant has already been added."

### Q8: Can I create an expense with only myself?
**A:** No. An expense must have at least 2 participants (including the payer). For personal expenses, use a different feature (or create a dummy participant, but that's not recommended). The reasoning is that expense‑splitting requires at least two people.

---

## 2. Amount & Currency

### Q9: What currencies are supported?
**A:** All ISO 4217 currency codes are supported. The default is INR (₹). The currency is selected at the time of expense creation and cannot be changed afterwards.

### Q10: Can I enter decimal amounts?
**A:** Yes, amounts can have up to 2 decimal places (e.g., ₹ 1200.50). The system automatically rounds to 2 decimals. For currencies without decimals (like JPY), the system respects the currency's standard decimal places.

### Q11: What if I enter a negative amount or zero?
**A:** The system will reject it with a validation error: `Total amount must be greater than zero.`

### Q12: How is the total amount validated in manual splits?
**A:** The sum of all manual split amounts must equal the total amount exactly (within a tolerance of 0.01 due to floating‑point precision). If the sum is off by more than 0.01, the expense creation fails with: `Manual split amounts must add up to the total amount.`

### Q13: Who pays for rounding differences in manual splits?
**A:** In EQUAL split mode, rounding differences are applied to the last participant in the list to ensure the total matches exactly. In MANUAL mode, the user must ensure the sum matches the total. The system does not auto‑adjust manual splits.

### Q14: Can I change the currency after creating the expense?
**A:** No. The currency is fixed at creation time to maintain consistency. If you need to change it, create a new expense.

### Q15: What happens if the total amount is ₹0.00?
**A:** The system rejects the expense with: `Total amount must be greater than zero.`

---

## 3. Participants & Groups

### Q16: Can I add someone who is not my friend as a participant?
**A:** Yes. If you enter an email address that is not in your friends list, the system will:
1. Offer to send them a friend request.
2. The expense will be created with them as a participant (status: PENDING).
3. They will receive an expense request to accept or reject.
4. If they reject, they are removed from the expense.
5. If they accept, they become a participant AND a friend (if the friend request is accepted).

### Q17: Can I remove a participant after the expense is created?
**A:** Yes, but only if the participant has not yet accepted the expense:
- If the participant is still in `PENDING` status, the payer can remove them.
- Once they accept (`ACCEPTED` status), they cannot be removed (unless they reject the expense themselves).
- The payer can always cancel the entire expense if needed.

### Q18: What happens when I select a group?
**A:** All members of that group are automatically added as participants. You can still manually remove individuals (except yourself), but any added participant must be a member of the group (if group is selected). The group association is stored for tracking purposes.

### Q19: Can I create an expense for a group but only include some members?
**A:** Yes. When you select a group, all members are added by default, but you can remove any member (except yourself) from the participant list. The expense will then only include the remaining participants. The group association remains for reference.

### Q20: What happens if a participant is also the payer?
**A:** The payer is automatically included as a participant and their status is set to `ACCEPTED` by default. They cannot reject the expense because they created it.

### Q21: Can I add more participants after the expense is created?
**A:** No. Participants are fixed at creation time. If you need to add someone, you must create a new expense or cancel the existing one and recreate it.

### Q22: What if a participant's account is deleted after the expense is created?
**A:** The participant is marked as `DELETED` in the expense record. Their share remains, but they cannot accept/reject. The payer can manually settle their portion or remove them (if they haven't accepted yet). The expense remains active for other participants.

### Q23: Can I add a participant who is not in the selected group?
**A:** No. If a group is selected, all participants must be members of that group. The system validates this and rejects the expense with: `All participants must be members of the selected group.`

### Q24: What if the group owner removes me from the group after I've created an expense for that group?
**A:** The existing expense remains unaffected. The participants are stored individually in the expense. Future expenses will not allow selecting that group until you are re‑added or permission is restored.

### Q25: Can I create an expense for a group I'm not a member of?
**A:** No. You must be a member of the group to create an expense for it. If you're not a member, you'll see the group in the "Request Access" section, and you must first request to join.

---

## 4. Splits (Equal vs Manual)

### Q26: What is the difference between EQUAL and MANUAL split?
**A:**
- **EQUAL**: The total amount is divided equally among all participants (including the payer). Example: ₹1000 among 5 people = ₹200 each.
- **MANUAL**: You specify exactly how much each participant owes. This is useful when different people owe different amounts (e.g., someone paid for extra items).

### Q27: Can I change the split type after the expense is created?
**A:** No. The split type is fixed at creation. If you need to change it, create a new expense.

### Q28: In MANUAL split, can a participant's share be ₹0.00?
**A:** Yes, but a warning (`⚠️`) is displayed indicating that this participant has no share assigned. The expense can still be created, but the participant will be notified of the expense even though they owe nothing. This is useful for cases like "moral support" participants.

### Q29: In MANUAL split, what if I don't assign a share to one participant?
**A:** The participant's share defaults to ₹0.00. The warning appears, but the expense can still be created. The participant will receive a notification that they were added to an expense but owe nothing.

### Q30: How is the percentage calculated in manual splits?
**A:** Percentage = (individual share / total amount) × 100. This is displayed next to each participant's amount for clarity. Example: ₹250 / ₹1000 = 25%.

### Q31: What happens if a participant rejects a manual split expense?
**A:** The participant is removed from the expense. The payer's share increases by the rejected amount (since the total remains the same, but one participant no longer owes). The remaining participants' shares remain unchanged. The total amount stays the same.

### Q32: What happens if a participant rejects an equal split expense?
**A:** The participant is removed, and the equal share is recalculated among the remaining participants. Example: 3 people, ₹1000 total = ₹333.33 each. One rejects → 2 people left = ₹500 each.

### Q33: Can I pre‑fill manual splits with equal shares?
**A:** Yes. When you switch from EQUAL to MANUAL mode, the system pre‑fills the manual split fields with equal shares. You can then adjust them as needed.

### Q34: What if manual splits don't add up to the total?
**A:** The system shows a real‑time validation message:
- If sum < total: `Remaining: ₹X to allocate`
- If sum > total: `Total exceeds ₹X by ₹Y`
- The "Create Expense" button is disabled until the sum matches exactly.

---

## 5. Date & Time

### Q35: What timezone is used for the expense date?
**A:** The expense date is stored in UTC but displayed in the user's local timezone. The timezone can be selected at creation (defaults to the user's current timezone). This ensures consistency across users in different timezones.

### Q36: Can I create an expense for a past date?
**A:** Yes, you can select any past date. This is useful for retroactively adding expenses (e.g., yesterday's dinner).

### Q37: Can I create an expense for a future date?
**A:** Yes, you can select a future date. This is useful for scheduling expenses (e.g., rent due next week, upcoming trip expenses).

### Q38: What happens if I don't provide a time?
**A:** The current time (in the selected timezone) is used by default. The time is optional but recommended for accurate record‑keeping.

### Q39: What format is the date stored in?
**A:** The date is stored as an ISO 8601 string (YYYY‑MM‑DD) with time and timezone information. This ensures consistency across different systems and APIs.

### Q40: Can I create an expense without a time but with a date?
**A:** Yes. If no time is provided, the system uses 00:00:00 in the selected timezone (effectively midnight).

---

## 6. Approvals & Settlements

### Q41: Why do participants need to approve an expense?
**A:** To prevent misuse. If someone adds you to an expense you weren't part of, you can reject it. This ensures all participants are aware and consent to the expense. It's a core safeguard against fraud.

### Q42: What happens if a participant never accepts or rejects?
**A:** The expense remains in `PENDING` state indefinitely. The payer can:
- Manually cancel the expense.
- Contact the participant directly.
- In a future version, we may add an auto‑expire feature (e.g., auto‑accept after 7 days with notification).

### Q43: Can the payer cancel the expense before all participants accept?
**A:** Yes. The payer can cancel the expense at any time, which marks it as `CANCELLED` and notifies all participants. Participants are automatically removed from the expense.

### Q44: What happens if a participant rejects an expense after some have already accepted?
**A:** The rejecting participant is removed, and the remaining participants' shares are recalculated. The accepted participants remain active. The payer is notified of the rejection. The expense status remains `PENDING` until all remaining participants accept or reject.

### Q45: Can a participant accept after rejecting?
**A:** No. Once rejected, the participant cannot accept. They would need to be re‑added by creating a new expense. Rejection is final to prevent confusion.

### Q46: Can a participant change their status from ACCEPTED to REJECTED?
**A:** No. Once accepted, the participant is locked in. The expense can only be cancelled by the payer. This ensures stability once people commit.

### Q47: When is an expense considered fully settled?
**A:** When all participants have paid their shares and the payer marks the expense as `SETTLED`. This can be done manually by the payer. Participants cannot mark the expense as settled themselves.

### Q48: Can participants settle their share partially?
**A:** In the current version, settlement is all‑or‑nothing. Partial payments are not supported. Each participant either owes the full share or nothing.

### Q49: What happens to the expense if a participant settles their share but others don't?
**A:** The participant's status is updated to `SETTLED` individually. The expense remains `ACTIVE` for other participants. The payer can see who has settled and who hasn't.

### Q50: Can the payer mark an expense as settled if not everyone has paid?
**A:** Yes, the payer can mark the expense as `SETTLED` at any time, but this should only be done when all participants have paid. Marking it settled doesn't enforce payments; it's a record‑keeping action.

---

## 7. Receipts

### Q51: Can I upload a receipt image?
**A:** Yes. You can upload a receipt image (JPEG, PNG, or PDF) during expense creation. The image is optional and stored as a reference. It's useful for record‑keeping and validation.

### Q52: Is the receipt image required?
**A:** No. It's completely optional, but recommended for transparency and record‑keeping, especially for business expenses.

### Q53: What size limit is there for receipt images?
**A:** The limit is 5MB per image. Larger images are rejected with a clear error message. This prevents storage abuse and ensures fast uploads.

### Q54: Can I upload multiple receipt images?
**A:** In the current version, only one receipt image is supported per expense. Multiple images may be supported in a future version.

### Q55: What if I uploaded the wrong receipt image?
**A:** You can remove the image before creating the expense. After creation, images cannot be changed. You would need to create a new expense.

### Q56: Where are receipt images stored?
**A:** Images are uploaded to secure cloud storage (AWS S3 or equivalent) and linked to the expense record. They are accessible to all participants for transparency.

### Q57: Can participants see the receipt image?
**A:** Yes. All participants can view the receipt image to verify the expense. This promotes transparency and trust.

### Q58: What happens to receipt images when the expense is deleted?
**A:** Images are soft‑deleted (archived) but not permanently removed. They remain accessible for audit purposes.

---

## 8. Error Scenarios & Edge Cases

### Q59: What if a participant is not found when trying to add them?
**A:** If the email doesn't exist in the system, the frontend offers to send an invite. The expense can still be created, and the invited person will receive a friend request and an expense request simultaneously.

### Q60: What happens if the total amount is ₹0.00?
**A:** The system rejects the expense with: `Total amount must be greater than zero.`

### Q61: Can I create an expense with only one participant (myself)?
**A:** No. An expense must have at least 2 participants (including the payer). For personal expenses, use a different feature (or create a dummy participant, but that's not recommended).

### Q62: What if a participant is both the payer and the only other participant rejects?
**A:** If a non‑payer participant rejects, the payer is left as the only participant. The system will cancel the expense automatically and notify the payer.

### Q63: What happens to manual splits if the number of participants changes due to rejection?
**A:** The rejected participant's share is added to the payer's share. The remaining participants' shares remain unchanged. The total amount stays the same.

### Q64: Can I create an expense for a group if I don't have permission?
**A:** No. The group will appear in the list with a "Request Access" button. You must request permission from the group owner. Until granted, the group cannot be selected for expense creation.

### Q65: What if the group owner revokes my permission after I've already created an expense for that group?
**A:** The existing expense remains unaffected. Future expenses will not allow selecting that group until permission is restored. The participants are already stored in the expense.

### Q66: What if a participant is removed from the group after the expense is created?
**A:** The participant remains in the expense. Group membership changes do not affect existing expenses. The participant is still responsible for their share if they accepted.

### Q67: What if the group is deleted after the expense is created?
**A:** The expense remains accessible. The group association is stored, but deletion of the group does not delete the expense. You can still view and manage the expense.

### Q68: What if the payer leaves the group?
**A:** The expense remains unaffected. The payer is still responsible for the expense. The group association is for reference only.

### Q69: What happens if a participant rejects and the expense is already settled?
**A:** This cannot happen. Once an expense is settled, it is locked. Rejection is only allowed when the expense is in `PENDING` state.

### Q70: Can a participant reject an expense they have already partially paid?
**A:** No. If a participant has made a payment (settled), the expense is locked for that participant. They can only reject before accepting.

### Q71: What if there's a dispute about who paid?
**A:** The "Paid By" field is the source of truth. If there's a dispute, participants can discuss offline and the payer can cancel and recreate the expense with the correct information.

### Q72: Can multiple people be the payer?
**A:** No, only one person can be the payer. If multiple people paid, the expense can be split accordingly.

### Q73: What if the total amount is very large (e.g., ₹1,00,000)?
**A:** There is no upper limit on the amount. However, very large amounts may trigger additional validation or anti‑fraud checks.

### Q74: What if a participant is added twice (duplicate)?
**A:** The system prevents duplicate participants. If the same user ID appears twice, it's deduplicated. If two different emails refer to the same user, the system uses the user ID.

### Q75: What if a participant's email is incorrect?
**A:** If the email doesn't exist in the system, the user is prompted to send an invite. If the email is malformed, the system rejects it with: `Please enter a valid email address.`

---

## 9. Technical / Implementation Questions

### Q76: How is the expense slug generated?
**A:** The slug is generated from the title by:
1. Converting to lowercase.
2. Replacing spaces with hyphens.
3. Removing special characters.
4. If the slug already exists, appending a counter (e.g., `dinner-at-saravana-bhavan`, `dinner-at-saravana-bhavan-1`).
The slug is used for URL routing and is unique.

### Q77: How are manual splits stored in the database?
**A:** They are stored as an array of objects: `[{ "userId": "user-1", "amount": 450.00 }, { "userId": "user-2", "amount": 550.00 }]`. This ensures each participant's share is explicitly recorded.

### Q78: How are participants and their acceptance status tracked?
**A:** A separate `ParticipantStatus` collection/table stores:
- `expenseId`
- `userId`
- `status` (PENDING, ACCEPTED, REJECTED, SETTLED)
- `shareAmount`
- `settledAt` (timestamp)
This allows independent tracking per participant and supports the Accept/Reject flow.

### Q79: How does the system handle concurrency (e.g., two participants accepting at the same time)?
**A:** Database transactions and optimistic locking are used to prevent race conditions. Only one participant can update the status at a time, and the system checks that the expense is still in `PENDING` state before processing the accept/reject.

### Q80: What notifications are sent and when?
**A:**
| Event | Recipients | Method |
|-------|------------|--------|
| Friend request sent | Recipient | Email + In‑app |
| Friend request accepted | Sender | In‑app |
| Group access request | Group owner | Email + In‑app |
| Access request approved | Requester | In‑app |
| Expense created | All participants (except payer) | Email + In‑app |
| Participant accepted | Payer | In‑app |
| Participant rejected | Payer | In‑app |
| Expense cancelled | All participants | In‑app |
| Expense settled | All participants | In‑app |

### Q81: How are notifications delivered?
**A:** Notifications are delivered via:
- **In‑app notification** – stored in the database and displayed in the app.
- **Email** – for critical actions like expense creation, friend requests (even if the user is offline).
- **Push notifications** – for mobile apps (future).

### Q82: What is the data retention policy for expenses?
**A:** Expenses are never deleted from the database (soft delete). Users can archive them to hide from the main list, but they remain accessible for audit purposes. Hard deletion is not allowed to maintain an audit trail.

### Q83: How long are pending expenses stored?
**A:** Pending expenses remain indefinitely until the payer cancels or all participants accept/reject. There is no auto‑expiry currently, but a future version may add an auto‑expire feature (e.g., 30 days).

### Q84: What is the maximum number of participants allowed in an expense?
**A:** The maximum is 50 participants. This prevents performance issues and maintains a good user experience. Beyond 50 participants, you should consider breaking it into multiple expenses.

### Q85: Can I create an expense without an internet connection?
**A:** No. The expense creation process requires a backend API call. However, we may support offline mode in a future version where expenses are synced later.

### Q86: What if the backend API returns a 500 error during expense creation?
**A:** The user sees a user‑friendly error: `Something went wrong. Please try again.` The expense is not created. The user can retry or contact support.

### Q87: How are timezones handled in the API?
**A:** The API accepts `expenseDate`, `expenseTime`, and `timezone`. The backend converts the date/time to UTC before storing. When displaying, it converts back to the user's timezone.

### Q88: What validation happens on the backend vs frontend?
**A:** Both:
- **Frontend**: Immediate feedback, preventing invalid submissions (e.g., negative amount, title too short).
- **Backend**: Final validation, security checks, and business logic validation (e.g., participants exist, group permissions). The frontend is for UX; the backend is the source of truth.

### Q89: Can I create an expense using an API key (machine‑to‑machine)?
**A:** No. All expense creation requires user authentication (JWT). This is to prevent abuse and ensure proper audit trails.

### Q90: What is the API rate limit for expense creation?
**A:** The rate limit is 100 requests per minute per user. This prevents abuse and ensures server stability.

### Q91: How are expense images handled in the API?
**A:** Images are uploaded via a separate file upload endpoint (`POST /api/v1/upload`). The returned URL is then included in the expense creation request. This separates concerns and improves performance.

---

## 10. Best Practices & User Guide

### Q92: What is the best way to create an expense with many participants?
**A:** Use a group! Groups automatically add all members, saving you time. If you don't have a group, you can add participants one by one, but it's faster to create a group first.

### Q93: Should I always add a receipt?
**A:** It's highly recommended for transparency. Receipts help resolve disputes and provide proof of the expense. They also make record‑keeping easier.

### Q94: What if I make a mistake while creating an expense?
**A:** You can cancel the expense before anyone accepts it. If participants have already accepted, you can mark it as settled and create a new correct expense. For minor mistakes, you can add a note in the description.

### Q95: How do I ensure participants accept my expense quickly?
**A:** Send a reminder message via the app or WhatsApp. You can also add a clear title and description to make it easy for participants to understand the expense. Adding a receipt image also helps.

### Q96: What if a participant doesn't have the app installed?
**A:** They will receive an email notification. They can accept/reject via the web version (if available) or install the app to manage their expenses.

### Q97: Can I add a note for participants?
**A:** Yes, the description field is for this purpose. You can add notes, explanations, or any additional details about the expense.

### Q98: Is there a limit to how many expenses I can create per day?
**A:** No, there's no daily limit. You can create as many expenses as you need.

### Q99: Can I create expenses in bulk?
**A:** Not currently. Bulk expense creation may be added in a future version for power users.

### Q100: What happens if a participant rejects my expense without explanation?
**A:** You'll be notified and can reach out to them directly. Rejection is an action that requires confirmation, so it's intentional on their part.

---

## 11. Quick Reference Table

| Scenario | Expected Behavior |
|----------|-------------------|
| User adds participant who rejects | Participant removed, shares recalculated, payer notified |
| User adds participant who accepts | Participant added, expense moves to ACTIVE if all accept |
| Payer cancels expense | All participants notified, expense marked CANCELLED |
| Participant never responds | Expense remains PENDING indefinitely |
| Group owner denies access request | Requester notified, request marked REJECTED |
| Group owner approves access request | Requester can now create expenses for that group |
| User adds non‑existing email | Invite sent, expense created with PENDING status |
| Manual split sum mismatch | Expense creation blocked, error shown |
| Duplicate participant | Deduplicated, warning shown |
| Amount is negative or zero | Expense creation blocked |
| Title too short or too long | Expense creation blocked |

---

This FAQ covers every possible question about creating an expense in TrueSplit. It's designed to be a comprehensive reference for users, support teams, and developers. If any additional questions arise, we'll update this document accordingly.