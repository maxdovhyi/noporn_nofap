import type { NopnofStore } from './stats';

const DB_NAME = 'nopnof_db';
const STORE_NAME = 'kv';
const KEY = 'nopnof_store_v1';

const DEFAULT_STORE: NopnofStore = { version: 1, days: {} };

function openDb(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, 1);

    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME);
      }
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

async function getFromIndexedDb<T>(key: string): Promise<T | null> {
  const db = await openDb();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readonly');
    const store = tx.objectStore(STORE_NAME);
    const req = store.get(key);

    req.onsuccess = () => resolve((req.result as T | undefined) ?? null);
    req.onerror = () => reject(req.error);
  });
}

async function setToIndexedDb<T>(key: string, value: T): Promise<void> {
  const db = await openDb();
  await new Promise<void>((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readwrite');
    tx.objectStore(STORE_NAME).put(value, key);
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
}

export async function loadStore(): Promise<NopnofStore> {
  if (typeof window === 'undefined' || !('indexedDB' in window)) {
    return DEFAULT_STORE;
  }

  try {
    const value = await getFromIndexedDb<NopnofStore>(KEY);
    if (!value || value.version !== 1 || !value.days) {
      return DEFAULT_STORE;
    }
    return value;
  } catch {
    return DEFAULT_STORE;
  }
}

export async function saveStore(store: NopnofStore): Promise<void> {
  if (typeof window === 'undefined' || !('indexedDB' in window)) {
    return;
  }

  await setToIndexedDb(KEY, store);
}
