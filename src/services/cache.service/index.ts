export type {
  CacheService as ICacheService,
  CacheServiceProps as ICacheServiceProps,
} from './CacheService';

import { CacheService } from './CacheService';

const cacheService = new CacheService();
export { cacheService };
