import { CacheStorage, CacheStorageProps } from './CacheStorage';

interface CacheServiceProps extends CacheStorageProps {
  shrinkInterval?: number;
}

const DEF_TTL: number = 10000;
const DEF_SHRINK_INTERVAL: number = 5000;

export class CacheService {
  private storage: CacheStorage;

  // mixin composition against inheritance
  get: typeof this.storage.get;
  set: typeof this.storage.set;
  del: typeof this.storage.del;
  shrink: typeof this.storage.shrink;
  size: typeof this.storage.size;

  private shrinkTimerID: NodeJS.Timeout | null;
  private shrinkInterval: number;

  constructor(props: CacheServiceProps = {}) {
    this.storage = new CacheStorage({ ttl: props.ttl || DEF_TTL });
    this.shrinkTimerID = null;
    this.shrinkInterval = props.shrinkInterval || DEF_SHRINK_INTERVAL;

    this.set = this.storage.set.bind(this.storage);
    this.get = this.storage.get.bind(this.storage);
    this.del = this.storage.del.bind(this.storage);
    this.shrink = this.storage.shrink.bind(this.storage);
    this.size = this.storage.size.bind(this.storage);
  }

  start() {
    this.scheduleShrink();
  }

  stop() {
    this.shrinkTimerID && clearTimeout(this.shrinkTimerID);
    this.shrinkTimerID = null;
  }

  private scheduleShrink() {
    if (!this.shrinkTimerID) return;

    this.shrinkTimerID = setTimeout(
      this._setTimeoutHandler.bind(this),
      this.shrinkInterval
    );
  }

  private _setTimeoutHandler() {
    this.shrink();
    this.shrinkTimerID = null;
    this.scheduleShrink();
  }
}
