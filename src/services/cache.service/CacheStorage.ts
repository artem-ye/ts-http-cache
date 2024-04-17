export type StorageKey = string;
type StorageValue = unknown;

export type StorageItem = {
  val: StorageValue;
  expires_at: number;
};

type Storage = Map<StorageKey, StorageItem>;

export type CacheStorageProps = {
  ttl?: number;
};

const DEF_TTL: number = 10000;

export class CacheStorage {
  private storage: Storage;
  private ttl: number;

  constructor({ ttl = DEF_TTL }: CacheStorageProps = {}) {
    this.storage = new Map();
    this.ttl = ttl;
  }

  get(key: StorageKey): StorageValue {
    const item = this.storage.get(key);
    if (!item || this._hasExpired(item)) {
      return null;
    }

    return item.val;
  }

  set(key: StorageKey, val: StorageValue, ttl: number = this.ttl) {
    const expires_at: number = Date.now() + ttl;
    this.storage.set(key, { val, expires_at });
  }

  del(key: StorageKey) {
    this.storage.delete(key);
  }

  size(): number {
    return this.storage.size;
  }

  shrink(): void {
    const now: number = Date.now();

    for (const [key, val] of this.storage.entries()) {
      if (this._hasExpired(val, now)) {
        this.del(key);
      }
    }
  }

  private _hasExpired(item: StorageItem, now?: number): boolean {
    return (now || Date.now()) > item.expires_at;
  }
}
