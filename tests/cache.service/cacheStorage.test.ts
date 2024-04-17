import { CacheStorage } from '@services/cache.service/CacheStorage';

const createCache = () => new CacheStorage();

describe('Cache storage', () => {
  it('get/set', () => {
    const cache = createCache();
    const DATA = { a: 12 };
    const KEY = 'foo';
    cache.set(KEY, DATA);

    expect(cache.get(KEY)).toBe(DATA);
    expect(cache.size()).toEqual(1);
    expect(cache.get('foo22')).toBeNull;
  });

  it('del', () => {
    const cache = createCache();
    const DATA = { a: 12 };
    const KEY = 'del';
    cache.set(KEY, DATA);

    expect(cache.get(KEY)).toBe(DATA);
    cache.del(KEY);
    expect(cache.get(KEY)).toBeNull();

    // Not to throws on non existing key
    expect(() => cache.del('123')).not.toThrow();
  });

  it('get expired data should return null', () => {
    jest.useFakeTimers();

    const cache = createCache();
    const DATA = { a: 12 };
    const KEY = 'foo';
    cache.set(KEY, DATA, 1);

    expect(cache.get(KEY)).toBe(DATA);

    jest.advanceTimersByTime(5);
    expect(cache.get(KEY)).toBeNull();
    jest.useRealTimers();
  });

  it('shrink expired data should clear cache', () => {
    jest.useFakeTimers();

    const cache = createCache();
    const DATA = { a: 12 };
    const KEY = 'foo';
    cache.set(KEY, DATA, 1);

    expect(cache.get(KEY)).toBe(DATA);

    jest.advanceTimersByTime(5);
    cache.shrink();
    expect(cache.size()).toEqual(0);
    jest.useRealTimers();
  });
});
