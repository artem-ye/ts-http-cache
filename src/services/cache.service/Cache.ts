type StorageKey = string;
type StorageVal = unknown;
type StorageItem = {
  val: StorageVal;
  ttl: number;
  expires_at: number;
};
type Storage = {
  [key: StorageKey]: StorageItem;
};

const DEF_TTL: number = 1000;
const SHRINK_INTERVAL: number = 5000;

export class Cache {
  private storage: Storage;
  private shrinkTimerID: NodeJS.Timeout | null;
  private shrinkInterval: number;

  constructor({ shrinkInterval }: { shrinkInterval?: number } = {}) {
    this.storage = {};
    this.shrinkTimerID = null;
    this.shrinkInterval = shrinkInterval || SHRINK_INTERVAL;
    this.startShrinkScheduler();
  }

  set(key: StorageKey, val: StorageVal, ttl: number = DEF_TTL) {
    this.storage[key] = this._wrap(val, ttl);
  }

  get(key: StorageKey): StorageVal {
    return this._unwrap(this.storage[key]);
  }

  del(key: StorageKey) {
    delete this.storage[key];
  }

  shrink() {
    const now = Date.now();

    for (const [k, v] of Object.entries(this.storage)) {
      if (v.expires_at >= now) {
        this.del(k);
      }
    }
  }

  startShrinkScheduler() {
    if (!this.shrinkTimerID) return;

    this.shrinkTimerID = setTimeout(
      this._shrinkHandler.bind(this),
      this.shrinkInterval
    );
  }

  stopShrinkScheduler() {
    this.shrinkTimerID && clearTimeout(this.shrinkTimerID);
    this.shrinkTimerID = null;
  }

  private _shrinkHandler() {
    this.shrink();
    this.startShrinkScheduler();
  }

  private _wrap(val: StorageVal, ttl: number): StorageItem {
    const expires_at: number = Date.now() + ttl;
    return { val, ttl, expires_at };
  }

  private _unwrap(item: StorageItem): StorageVal {
    return item?.val;
  }
}
