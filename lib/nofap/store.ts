import localforage from 'localforage';
import type { NopnofStore } from './stats';

const KEY = 'nopnof_store_v1';

const storage = localforage.createInstance({
  name: 'nopnof_db',
  storeName: 'kv',
});

const DEFAULT_STORE: NopnofStore = { version: 1, days: {} };

export async function loadStore(): Promise<NopnofStore> {
  if (typeof window === 'undefined') return DEFAULT_STORE;

  try {
    const value = await storage.getItem<NopnofStore>(KEY);
    if (!value || value.version !== 1 || !value.days) return DEFAULT_STORE;
    return value;
  } catch {
    return DEFAULT_STORE;
  }
}

export async function saveStore(store: NopnofStore): Promise<void> {
  if (typeof window === 'undefined') return;
  await storage.setItem(KEY, store);
}
