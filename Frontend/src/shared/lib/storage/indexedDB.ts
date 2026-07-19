/**
 * IndexedDB persistence utility for saving and restoring expense form state.
 * Stores the entire form state including File objects (Blobs) so that data
 * survives page refreshes.
 */

const DB_NAME = 'TrueSplitFormDB';
const STORE_NAME = 'formState';
const DB_VERSION = 1;

export interface StoredFormState {
  /** Unique key for this store (always 'current') */
  id: string;
  /** The serialized form state (includes pendingFiles as File objects) */
  data: unknown;
  /** Timestamp of last save (for debugging/expiry) */
  updatedAt: number;
}

/**
 * Opens the IndexedDB database and ensures the object store exists.
 * Returns a Promise that resolves to the database instance.
 */
function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        const store = db.createObjectStore(STORE_NAME, { keyPath: 'id' });
        store.createIndex('updatedAt', 'updatedAt');
      }
    };

    request.onsuccess = () => {
      resolve(request.result);
    };

    request.onerror = () => {
      reject(request.error);
    };
  });
}

/**
 * Saves the form state to IndexedDB.
 * @param data - The form state object (should be the entire ExpenseFormState)
 * @returns Promise that resolves when save is complete
 */
export async function saveFormState(data: unknown): Promise<void> {
  try {
    const db = await openDB();
    const transaction = db.transaction(STORE_NAME, 'readwrite');
    const store = transaction.objectStore(STORE_NAME);

    const storedData: StoredFormState = {
      id: 'current',
      data,
      updatedAt: Date.now(),
    };

    await new Promise<void>((resolve, reject) => {
      const request = store.put(storedData);
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });

    db.close();
  } catch (error) {
    console.warn('Failed to save form state to IndexedDB:', error);
  }
}

/**
 * Loads the saved form state from IndexedDB.
 * @returns The stored data if found, otherwise null.
 */
export async function loadFormState(): Promise<unknown | null> {
  try {
    const db = await openDB();
    const transaction = db.transaction(STORE_NAME, 'readonly');
    const store = transaction.objectStore(STORE_NAME);

    const result = await new Promise<StoredFormState | undefined>((resolve, reject) => {
      const request = store.get('current');
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });

    db.close();

    if (result && result.data) {
      return result.data;
    }
    return null;
  } catch (error) {
    console.warn('Failed to load form state from IndexedDB:', error);
    return null;
  }
}

/**
 * Clears the saved form state from IndexedDB.
 * Called after a successful expense creation.
 */
export async function clearFormState(): Promise<void> {
  try {
    const db = await openDB();
    const transaction = db.transaction(STORE_NAME, 'readwrite');
    const store = transaction.objectStore(STORE_NAME);

    await new Promise<void>((resolve, reject) => {
      const request = store.delete('current');
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });

    db.close();
  } catch (error) {
    console.warn('Failed to clear form state from IndexedDB:', error);
  }
}

/**
 * Checks if there is any saved form state.
 * @returns true if data exists.
 */
export async function hasSavedState(): Promise<boolean> {
  const data = await loadFormState();
  return data !== null;
}