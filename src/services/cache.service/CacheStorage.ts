type StorageKey = string;
type StorageValue = unknown;

type StorageItem = {
  val: StorageValue;
  expires_at: number;
};

type Storage = {
  [k: StorageKey]: StorageItem;
};

const DEF_TTL: number = 10000;

export class CacheStorage {
  private storage: Storage;
  private ttl: number;

  constructor({ ttl = DEF_TTL }: { ttl?: number } = {}) {
    this.storage = {};
    this.ttl = ttl;
  }

  get(key: StorageKey): StorageValue {
    const item = this.storage[key];
    if (!item || Date.now() > item.expires_at) {
      return null;
    }

    return item.val;
  }

  set(key: StorageKey, val: StorageValue, ttl: number = this.ttl) {
    const expires_at: number = Date.now() + ttl;
    this.storage[key] = { val, expires_at };
  }

  del(key: StorageKey) {
    delete this.storage[key];
  }

  shrink() {
    const now: number = Date.now();

    for (const [key, val] of Object.entries(this.storage)) {
      if (now > val.expires_at) {
        this.del(key);
      }
    }
  }
}
