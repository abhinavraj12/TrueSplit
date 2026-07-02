# Add Expense API – Final Design Document (v1.0)
**Last Updated:** May 2026  
---

## 1. Feature Overview

Allow authenticated users to create expenses with multiple participants, flexible split methods (equal/manual), multi-currency support (USD/INR), optional receipt images, and built‑in support for future settlement tracking. The system enforces that **only the creator can later edit** an expense, and once all participants have confirmed settlement the expense becomes **immutable (COMPLETE)**.

---

## 2. Architecture and Design Strategy

### 2.1 High‑Level Architecture

Layered REST API with async side‑effects and Redis caching:

```
[Client] → [Load Balancer] → [REST Controller]
                                  ↓
                            [Service Layer] ↔ [Cache Manager (Redis)]
                                  ↓
                            [Repository Layer] → [MongoDB]
                                  ↓
                            [Event Publisher] → [Async Workers]
                                                    ↓
                                            - Thumbnail Generator
                                            - Notification Dispatcher
                                            - Audit Logger
```

- **Unified `GET` endpoint** handles both `_id` and `titleSlug` via runtime inspection.
- **CQRS‑lite**: writes are command‑driven, reads benefit from Redis cache.
- **Async by default**: image thumbnails, notifications, and update history logging are off‑loaded so the main API stays < 500ms (p95).

### 2.2 Data Fetching via `titleSlug` and `id`

- **Single endpoint**: `GET /api/v1/expenses/{identifier}`  
  - If `identifier` matches a 24‑hex‑character `ObjectId`, look up by `_id`.  
  - Else look up by `titleSlug`.
- Redis stores two keys for each expense:  
  - `expense:{id}`  
  - `expense:slug:{titleSlug}`  
  Both point to the same full JSON. On cache miss, the fetched document is cached under both keys.

### 2.3 Ownership and Immutability

- **`createdBy`** field (immutable) is set on creation from the authenticated user.
- Future `PATCH` / `PUT` operations are allowed **only** if:
  - The authenticated user matches `createdBy`.
  - The expense `status` is **not** `COMPLETE` or `DELETED`.
- Once `status` = `COMPLETE`, the document becomes fully immutable (no updates allowed).

### 2.4 Settlement Tracking

- An embedded array `participantSettlement` holds each participant’s settlement status.
- On creation, all are `settled: false`.
- A future endpoint will allow participants to mark themselves as settled.
- When **all** participants have `settled: true`, the expense `status` automatically flips to `COMPLETE` and the document is locked from further modifications.

### 2.5 Update History

- Every update to an expense (future `PATCH` / `PUT`) is logged in a separate `expense_update_history` collection.
- Each log entry contains:
  - `expenseId`, `version` (auto‑increment)
  - `changedBy` (user ID)
  - `timestamp`
  - `previousState` (full snapshot before update)
  - `currentState` (full snapshot after update)

---

## 3. Schema Design

### 3.1 Main Collection: `expenses`

| Field                    | Type                         | Required | Description                                                                                                                                                                                                                                                         |
|--------------------------|------------------------------|----------|---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `_id`                    | ObjectId                     | auto     | Primary key, serialised as string `"id"` in API.                                                                                                                                                                                                                    |
| `title`                  | String                       | Yes      | 3–100 characters.                                                                                                                                                                                                                                                   |
| `titleSlug`              | String                       | Yes      | URL‑friendly unique slug generated from `title`. **Unique index**.                                                                                                                                                                                                  |
| `description`            | String (nullable)            | No       | Max 500 characters.                                                                                                                                                                                                                                                 |
| `totalAmount`            | Decimal128                   | Yes      | Precise decimal (e.g., `120.00`). No floating point.                                                                                                                                                                                                                |
| `currency`               | String (enum: `USD`, `INR`)  | Yes      | Currency for the whole expense; default `USD` unless user is in India (IP‑based).                                                                                                                                                                                   |
| `splitType`              | String (enum: `EQUAL`, `MANUAL`) | Yes  | How the expense is split.                                                                                                                                                                                                                                           |
| `paidBy`                 | ObjectId                     | Yes      | The user who paid the entire bill (payer). May differ from `createdBy`.                                                                                                                                                                                             |
| `createdBy`              | ObjectId                     | Yes      | The user who created the expense. **Immutable**.                                                                                                                                                                                                                    |
| `participants`           | Array of ObjectId            | Yes      | Deduplicated list of all involved users (min 1, max 50); must include `paidBy`.                                                                                                                                                                                     |
| `manualSplits`           | Array of { `userId`: ObjectId, `amount`: Decimal128 } | Conditional | Required only if `splitType` = `MANUAL`. Sum must exactly equal `totalAmount`. Each `userId` must be in `participants`.                                                                                                                               |
| `expenseDateTime`        | Date                         | Yes      | Combined date+time in UTC; default now, supports past dates.                                                                                                                                                                                                        |
| `status`                 | String (enum: `ACTIVE`, `COMPLETE`, `DELETED`) | Yes | Default `ACTIVE`. Set to `COMPLETE` when all participants have settled (future). Soft‑delete marks as `DELETED`.                                                                                                                                                     |
| `participantSettlement`  | Array of { `userId`: ObjectId, `settled`: Boolean, `settledAt`: Date (nullable) } | Yes | Initialised on creation with each participant having `settled: false`, `settledAt: null`. **Only updated via a future settlement endpoint.** |
| `images`                 | Array of Image sub‑docs      | No       | Optional, max 5.                                                                                                                                                                                                                                                    |
| `createdAt`              | Date                         | auto     | Immutable.                                                                                                                                                                                                                                                          |
| `updatedAt`              | Date                         | auto     | Automatically set on each modification.                                                                                                                                                                                                                             |

**Image sub‑document:**
```json
{
  "url": "https://cdn.example.com/full.jpg",
  "thumbnailUrl": "https://cdn.example.com/thumb.jpg",   // initially null, filled async
  "originalName": "receipt.jpg",
  "size": 204800,
  "uploadedAt": "2026-05-22T20:05:00Z"
}
```

**Indexes:**
- `{ titleSlug: 1 }` unique
- `{ createdBy: 1, expenseDateTime: -1 }` – “my created expenses”
- `{ paidBy: 1, expenseDateTime: -1 }` – “expenses I paid for”
- `{ participants: 1, expenseDateTime: -1 }` – “expenses involving me”
- `{ _id: 1 }` default

### 3.2 Update History Collection: `expense_update_history`

| Field            | Type       | Description                                                                                     |
|------------------|------------|-------------------------------------------------------------------------------------------------|
| `_id`            | ObjectId   |                                                                                                 |
| `expenseId`      | ObjectId   | Reference to the expense.                                                                       |
| `version`        | Number     | Incremental version number of the change (starting at 1).                                       |
| `changedBy`      | ObjectId   | User who performed the update.                                                                  |
| `timestamp`      | Date       | When the change was committed.                                                                  |
| `previousState`  | Object     | Full snapshot of the expense document **before** the update (all fields).                       |
| `currentState`   | Object     | Full snapshot **after** the update.                                                             |

- **Index:** `{ expenseId: 1, version: 1 }` for easy retrieval of a full history.

### 3.3 Audit Log Collection: `expense_audit_logs`

Unchanged: logs creation, update, and soft‑delete actions with user ID, timestamp, and optional snapshot. Retained for 90 days via TTL index.

---

## 4. API Structure

### 4.1 Base URL and Common Envelope

**Base:** `/api/v1`  
All responses follow:

```json
{
  "success": true,
  "data": { ... },
  "error": { "code": "...", "message": "...", "details": [...] },
  "metadata": {
    "timestamp": "2026-05-23T10:30:00Z",
    "requestId": "uuid",
    "apiVersion": "v1"
  }
}
```

### 4.2 Endpoints

#### 4.2.1 Create Expense

- **`POST /api/v1/expenses`**
- **Authentication:** Required.
- **Request Body (JSON):**
  ```json
  {
    "title": "Dinner at Joe's",                         // required, 3‑100 chars
    "description": "Team dinner",                       // optional, max 500
    "totalAmount": 120.00,                              // required, positive, 2 decimals
    "currency": "USD",                                  // optional, default "USD", enum [USD,INR]
    "splitType": "EQUAL",                               // required, EQUAL or MANUAL
    "paidBy": "60b8d295f1e2c4a1d8f3b456",               // required, user ID
    "participants": [                                   // required, deduped server‑side
      "60b8d295f1e2c4a1d8f3b456",
      "60b8d295f1e2c4a1d8f3b789",
      "60b8d295f1e2c4a1d8f3babc"
    ],
    "expenseDate": "2026-05-22",                        // required, ISO date YYYY-MM-DD
    "expenseTime": "20:00",                             // optional, HH:mm, default now
    "manualSplits": [                                   // required if MANUAL
      {"userId": "...", "amount": 40.00},
      ...
    ],
    "images": [                                         // optional, max 5
      {
        "url": "https://cdn.example.com/receipt1.jpg",
        "originalName": "receipt1.jpg",
        "size": 204800
      }
    ]
  }
  ```
- **Validation:**
  - `paidBy` must be in `participants`.
  - For `MANUAL`: sum of `manualSplits[].amount` must exactly equal `totalAmount` (BigDecimal compare).
  - All participants must be friends of the creator (security).
  - Images count ≤ 5.
- **Server‑side logic:**
  - Generate `titleSlug` from `title`; if not unique, append random 4‑char suffix.
  - Create `expenseDateTime` from `expenseDate` + `expenseTime` (UTC).
  - Initialise `participantSettlement` array for each participant with `settled: false, settledAt: null`.
  - Set `status` = `ACTIVE`, `createdBy` = current authenticated user, `createdAt`/`updatedAt` = now.
  - Save to MongoDB.
  - Publish `ExpenseCreatedEvent`.
  - Cache the new document under both Redis keys.
- **Response:** `201 Created` with full expense object (including `createdBy`, `participantSettlement`).
- **Async side‑effects:** Thumbnail generation, notifications, audit log entry.

#### 4.2.2 Get Expense (by `_id` or `titleSlug`)

- **`GET /api/v1/expenses/{identifier}`**
- **Authentication:** Required (friendship check optional for visibility).
- **Behaviour:**
  - If `identifier` is a valid 24‑char hex ObjectId:
    - Check Redis `expense:{identifier}`.
  - Else:
    - Check Redis `expense:slug:{identifier}`.
  - On cache miss, query MongoDB, populate both Redis keys, return.
- **Response:** `200 OK` with the full expense document (including up‑to‑date `thumbnailUrl`s if processed and current `participantSettlement` states).

#### 4.2.3 Update Expense (Future)

- **`PATCH /api/v1/expenses/{identifier}`**
  - **Authorization:** Only the creator (`createdBy`) can call; status must be `ACTIVE`.
  - Before update:
    - Load current document, verify permissions and status.
    - Take a snapshot (`previousState`).
  - Apply allowed changes (e.g., title, description, amount, splits, participants, images – with strict validation).
  - Save updated document; bump `updatedAt`.
  - Log into `expense_update_history` with `previousState` and `currentState`.
  - Invalidate Redis caches.
  - If participants change, re‑initialise `participantSettlement` for new users (settled: false). (For existing users, keep their settlement state.)
- **Response:** `200 OK` with updated expense.

#### 4.2.4 Participant Settlement Marking (Future)

- **`PATCH /api/v1/expenses/{identifier}/settle`**
  - **Body:** none (the authenticated user marks themselves as settled).
  - The user must be a participant in the expense and status must be `ACTIVE`.
  - Server updates the corresponding `participantSettlement` entry: `settled: true`, `settledAt: now`.
  - After save, check if **all** participants have `settled: true`; if yes, set expense `status` = `COMPLETE` (immutable thereafter).
  - Publish an event (notifications, etc.).
  - Invalidate Redis caches.
- **Response:** `200 OK` with the updated expense (showing new settlement state).

#### 4.2.5 Get Update History (Future)

- **`GET /api/v1/expenses/{identifier}/history`**
- **Authentication:** Required (only participants and creator can view).
- **Response:** An array of version history entries, sorted by version ascending (or timestamp). Each entry includes:
  - `version`
  - `changedBy`
  - `timestamp`
  - `previousState` (full expense snapshot before the change)
  - `currentState` (full expense snapshot after the change)

---

## 5. Async / Background Processing

All triggered by `ExpenseCreatedEvent` (or future `ExpenseUpdatedEvent`) after DB commit.

- **Thumbnail Generator**  
  - For each image without `thumbnailUrl`, downloads original from cloud storage, generates 200px thumbnail, uploads it, and patches the expense document.
  - Retries with exponential backoff, 3 attempts max.
- **Notification Dispatcher**  
  - Pushes a message like “You’ve been added to an expense: {title}” to all participants except the creator/payer (configurable).
- **Audit Logger**  
  - Inserts a record into `expense_audit_logs` with action type `CREATED` and a snapshot.
- **Update History Logger (future)**
  - When expense is updated via `PATCH`, the service directly writes the `expense_update_history` entry after successful DB update (can be synchronous, fast).

---

## 6. Caching Strategy (Redis)

| Key Pattern                  | Content                 | TTL      | On Create            | On Update (future)           |
|------------------------------|-------------------------|----------|----------------------|------------------------------|
| `expense:{id}`               | Full expense JSON       | 1 hour   | Set both keys        | Delete both keys             |
| `expense:slug:{titleSlug}`   | Full expense JSON       | 1 hour   | Set both keys        | Delete both keys             |

- **Cache-aside pattern**: read‑through on GET requests; on miss, load from MongoDB and populate both keys.
- **Consistency**: Since create is the only mutation in this feature, no invalidation is needed. Future updates will **delete** both keys, forcing a fresh load on next read.

---

## 7. Realistic Dummy API Responses

### 7.1 Create Expense – Equal Split (USD)

**Request:**
```json
{
  "title": "Dinner at Joe's",
  "totalAmount": 120.00,
  "currency": "USD",
  "splitType": "EQUAL",
  "paidBy": "60b8d295f1e2c4a1d8f3b456",
  "participants": [
    "60b8d295f1e2c4a1d8f3b456",
    "60b8d295f1e2c4a1d8f3b789",
    "60b8d295f1e2c4a1d8f3babc"
  ],
  "expenseDate": "2026-05-22",
  "expenseTime": "20:00"
}
```

**Response (201 Created):**
```json
{
  "success": true,
  "data": {
    "id": "647a1c2e9f8b3a2d1c4e5f67",
    "title": "Dinner at Joe's",
    "titleSlug": "dinner-at-joes-x9k2",
    "description": null,
    "totalAmount": "120.00",
    "currency": "USD",
    "splitType": "EQUAL",
    "paidBy": "60b8d295f1e2c4a1d8f3b456",
    "createdBy": "60b8d295f1e2c4a1d8f3b456",
    "participants": [
      "60b8d295f1e2c4a1d8f3b456",
      "60b8d295f1e2c4a1d8f3b789",
      "60b8d295f1e2c4a1d8f3babc"
    ],
    "manualSplits": null,
    "expenseDateTime": "2026-05-22T20:00:00Z",
    "status": "ACTIVE",
    "participantSettlement": [
      { "userId": "60b8d295f1e2c4a1d8f3b456", "settled": false, "settledAt": null },
      { "userId": "60b8d295f1e2c4a1d8f3b789", "settled": false, "settledAt": null },
      { "userId": "60b8d295f1e2c4a1d8f3babc", "settled": false, "settledAt": null }
    ],
    "images": [],
    "createdAt": "2026-05-22T20:05:10Z",
    "updatedAt": "2026-05-22T20:05:10Z"
  },
  "metadata": {
    "timestamp": "2026-05-22T20:05:10Z",
    "requestId": "d4e5f6a7-b8c9-4d0e-a1f2-3b4c5d6e7f8a",
    "apiVersion": "v1"
  }
}
```

### 7.2 Create Expense – Manual Split (INR)

**Request:**
```json
{
  "title": "Office snacks",
  "totalAmount": 500.50,
  "currency": "INR",
  "splitType": "MANUAL",
  "paidBy": "60b8d295f1e2c4a1d8f3b456",
  "participants": [
    "60b8d295f1e2c4a1d8f3b456",
    "60b8d295f1e2c4a1d8f3b789"
  ],
  "manualSplits": [
    { "userId": "60b8d295f1e2c4a1d8f3b456", "amount": 300.00 },
    { "userId": "60b8d295f1e2c4a1d8f3b789", "amount": 200.50 }
  ],
  "expenseDate": "2026-05-23"
}
```

**Response (201 Created):**
```json
{
  "success": true,
  "data": {
    "id": "647a1c2e9f8b3a2d1c4e5f68",
    "title": "Office snacks",
    "titleSlug": "office-snacks-abc1",
    "totalAmount": "500.50",
    "currency": "INR",
    "splitType": "MANUAL",
    "paidBy": "60b8d295f1e2c4a1d8f3b456",
    "createdBy": "60b8d295f1e2c4a1d8f3b456",
    "participants": [
      "60b8d295f1e2c4a1d8f3b456",
      "60b8d295f1e2c4a1d8f3b789"
    ],
    "manualSplits": [
      { "userId": "60b8d295f1e2c4a1d8f3b456", "amount": "300.00" },
      { "userId": "60b8d295f1e2c4a1d8f3b789", "amount": "200.50" }
    ],
    "expenseDateTime": "2026-05-23T10:15:00Z",
    "status": "ACTIVE",
    "participantSettlement": [
      { "userId": "60b8d295f1e2c4a1d8f3b456", "settled": false, "settledAt": null },
      { "userId": "60b8d295f1e2c4a1d8f3b789", "settled": false, "settledAt": null }
    ],
    "images": [],
    "createdAt": "2026-05-23T10:15:20Z",
    "updatedAt": "2026-05-23T10:15:20Z"
  },
  "metadata": {
    "timestamp": "2026-05-23T10:15:20Z",
    "requestId": "e7f8a9b0-c1d2-4e3f-b4a5-6c7d8e9f0a1b",
    "apiVersion": "v1"
  }
}
```

### 7.3 Get Expense (After Some Participants Have Settled)

**GET /api/v1/expenses/647a1c2e9f8b3a2d1c4e5f67**  
*(Assume the second participant has marked themselves as settled.)*

```json
{
  "success": true,
  "data": {
    "id": "647a1c2e9f8b3a2d1c4e5f67",
    "title": "Dinner at Joe's",
    "titleSlug": "dinner-at-joes-x9k2",
    "description": null,
    "totalAmount": "120.00",
    "currency": "USD",
    "splitType": "EQUAL",
    "paidBy": "60b8d295f1e2c4a1d8f3b456",
    "createdBy": "60b8d295f1e2c4a1d8f3b456",
    "participants": [
      "60b8d295f1e2c4a1d8f3b456",
      "60b8d295f1e2c4a1d8f3b789",
      "60b8d295f1e2c4a1d8f3babc"
    ],
    "manualSplits": null,
    "expenseDateTime": "2026-05-22T20:00:00Z",
    "status": "ACTIVE",
    "participantSettlement": [
      {
        "userId": "60b8d295f1e2c4a1d8f3b456",
        "settled": false,
        "settledAt": null
      },
      {
        "userId": "60b8d295f1e2c4a1d8f3b789",
        "settled": true,
        "settledAt": "2026-05-24T09:15:30Z"
      },
      {
        "userId": "60b8d295f1e2c4a1d8f3babc",
        "settled": false,
        "settledAt": null
      }
    ],
    "images": [
      {
        "url": "https://cdn.example.com/receipt1.jpg",
        "thumbnailUrl": "https://cdn.example.com/thumb/receipt1_200.jpg",
        "originalName": "receipt1.jpg",
        "size": 204800,
        "uploadedAt": "2026-05-22T20:05:00Z"
      }
    ],
    "createdAt": "2026-05-22T20:05:10Z",
    "updatedAt": "2026-05-24T09:15:30Z"
  },
  "metadata": {
    "timestamp": "2026-05-24T09:15:31Z",
    "requestId": "f1a2b3c4-d5e6-4f7a-b8c9-0d1e2f3a4b5c",
    "apiVersion": "v1"
  }
}
```

### 7.4 Get Expense – All Participants Settled (Status = COMPLETE)

**GET /api/v1/expenses/647a1c2e9f8b3a2d1c4e5f67**  
*(Now all three participants have settled; status automatically changed.)*

```json
{
  "success": true,
  "data": {
    "id": "647a1c2e9f8b3a2d1c4e5f67",
    "title": "Dinner at Joe's",
    "titleSlug": "dinner-at-joes-x9k2",
    "status": "COMPLETE",
    "participantSettlement": [
      {
        "userId": "60b8d295f1e2c4a1d8f3b456",
        "settled": true,
        "settledAt": "2026-05-24T10:00:00Z"
      },
      {
        "userId": "60b8d295f1e2c4a1d8f3b789",
        "settled": true,
        "settledAt": "2026-05-24T09:15:30Z"
      },
      {
        "userId": "60b8d295f1e2c4a1d8f3babc",
        "settled": true,
        "settledAt": "2026-05-24T10:05:00Z"
      }
    ],
    "updatedAt": "2026-05-24T10:05:01Z",
    // ... other fields unchanged
  },
  "metadata": {
    "timestamp": "2026-05-24T10:05:02Z",
    "requestId": "...",
    "apiVersion": "v1"
  }
}
```

### 7.5 Update History API Response (Future Example)

**GET /api/v1/expenses/647a1c2e9f8b3a2d1c4e5f67/history**  
*(Assume the expense was created, then updated to change the description and add an image, then updated again to add a participant.)*

```json
{
  "success": true,
  "data": {
    "history": [
      {
        "version": 1,
        "changedBy": "60b8d295f1e2c4a1d8f3b456",
        "timestamp": "2026-05-25T14:00:00Z",
        "previousState": {
          "id": "647a1c2e9f8b3a2d1c4e5f67",
          "title": "Dinner at Joe's",
          "description": null,
          "totalAmount": "120.00",
          // ... full expense as it was after creation
          "images": []
        },
        "currentState": {
          "id": "647a1c2e9f8b3a2d1c4e5f67",
          "title": "Dinner at Joe's",
          "description": "Team celebration dinner",
          "totalAmount": "120.00",
          // ... other fields unchanged,
          "images": [
            {
              "url": "https://cdn.example.com/receipt1.jpg",
              "thumbnailUrl": null,
              "originalName": "receipt1.jpg",
              "size": 204800,
              "uploadedAt": "2026-05-25T14:00:00Z"
            }
          ]
        }
      },
      {
        "version": 2,
        "changedBy": "60b8d295f1e2c4a1d8f3b456",
        "timestamp": "2026-05-26T09:30:00Z",
        "previousState": {
          // full expense as of version 1 (the previous currentState)
          "description": "Team celebration dinner",
          "participants": [
            "60b8d295f1e2c4a1d8f3b456",
            "60b8d295f1e2c4a1d8f3b789",
            "60b8d295f1e2c4a1d8f3babc"
          ]
        },
        "currentState": {
          // now with added participant 60b8d295f1e2c4a1d8f3bdef
          "participants": [
            "60b8d295f1e2c4a1d8f3b456",
            "60b8d295f1e2c4a1d8f3b789",
            "60b8d295f1e2c4a1d8f3babc",
            "60b8d295f1e2c4a1d8f3bdef"
          ],
          "participantSettlement": [
            { "userId": "60b8d295f1e2c4a1d8f3b456", "settled": false, "settledAt": null },
            { "userId": "60b8d295f1e2c4a1d8f3b789", "settled": false, "settledAt": null },
            { "userId": "60b8d295f1e2c4a1d8f3babc", "settled": false, "settledAt": null },
            { "userId": "60b8d295f1e2c4a1d8f3bdef", "settled": false, "settledAt": null }
          ]
        }
      }
    ]
  },
  "metadata": {
    "timestamp": "2026-05-26T09:31:00Z",
    "requestId": "...",
    "apiVersion": "v1"
  }
}
```

*(Note: Only the changed fields are shown for brevity; real-world responses will contain the full document snapshots.)*

### 7.6 Error – Validation Failure

```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Manual split sum does not match total amount.",
    "details": [
      { "field": "manualSplits", "message": "Sum 499.50 != total 500.50" }
    ]
  },
  "metadata": {
    "timestamp": "2026-05-23T10:20:00Z",
    "requestId": "..."
  }
}
```

### 7.7 Error – Unauthorised Update Attempt (Future)

**PATCH /api/v1/expenses/647a1c2e9f8b3a2d1c4e5f67** by a non‑creator:

```json
{
  "success": false,
  "error": {
    "code": "FORBIDDEN",
    "message": "Only the original creator can update this expense."
  },
  "metadata": { ... }
}
```

### 7.8 Error – Update on Completed Expense

**PATCH /api/v1/expenses/647a1c2e9f8b3a2d1c4e5f67** while status = `COMPLETE`:

```json
{
  "success": false,
  "error": {
    "code": "CONFLICT",
    "message": "Cannot modify an expense that is already complete."
  },
  "metadata": { ... }
}
```

---

## 8. Implementation Notes for Developers

1. **Slug Generation**: Use `Slugify` or similar library. After generating a slug, check uniqueness in the DB; if duplicate, append a random 4‑character alphanumeric until unique.
2. **Amount Precision**: Use `java.math.BigDecimal` with scale 2 and `HALF_UP` for all calculations. Store as `org.bson.types.Decimal128`.
3. **Unified GET Identifier**: Implement a utility:
   ```java
   if (ObjectId.isValid(identifier)) {
       expense = expenseRepository.findById(new ObjectId(identifier));
   } else {
       expense = expenseRepository.findByTitleSlug(identifier);
   }
   ```
4. **`createdBy`**: Set once from the authenticated principal (e.g., `SecurityContextHolder`); never accept from the client.
5. **Update Authorisation** (future): Compare `expense.getCreatedBy()` with the current user. Also forbid updates if `expense.getStatus() == COMPLETE || DELETED`.
6. **Settlement Completion** (future): After updating a participant’s settlement flag, check if `participantSettlement` array has all `settled: true`. If so, set `status = COMPLETE` and reject any subsequent write operations on the document.
7. **Caching**: On creation, store under both `expense:{id}` and `expense:slug:{slug}`. On GET miss, fetch from DB and cache under both. On update (future), delete both keys.
8. **Update History Logging** (future): Before updating, take a deep copy of the current document (`previousState`). After saving, create an `expense_update_history` entry with `previousState` and the new version. Use a sequence number for `version`.
9. **Image Compression**: Client must compress before upload. Thumbnail generation runs asynchronously; the initial response shows `thumbnailUrl: null`. The UI can poll or the document will eventually include the thumbnail.
