import { CacheService } from '@services/cache.service/CacheService';
import { CacheStorage } from '@services/cache.service/CacheStorage';
// jest.mock('@services/cache.service/CacheService');

const createService = (...args: ConstructorParameters<typeof CacheService>) =>
  new CacheService(...args);

describe('Cache service CRUD', () => {
  it('get/set', () => {
    const service = createService();
    const MOCK = {
      key: 'foo',
      val: 'bar',
    };

    expect(service.size()).toEqual(0);
    service.set(MOCK.key, MOCK.val);
    expect(service.size()).toEqual(1);
    expect(service.get(MOCK.key)).toBe(MOCK.val);
  });

  it('del', () => {
    const service = createService();
    const MOCK = {
      key: 'foo',
      val: 'bar',
    };

    expect(service.size()).toEqual(0);
    service.set(MOCK.key, MOCK.val);
    expect(service.size()).toEqual(1);
    service.del(MOCK.key);
  });
});

describe('Cache service Scheduler', () => {
  it('Scheduler starts/stops', () => {
    const mockShrink = jest.spyOn(CacheStorage.prototype, 'shrink');
    jest.useFakeTimers();

    const SHRINK_INTERVAL = 50;
    const service = new CacheService({ shrinkInterval: SHRINK_INTERVAL });

    jest.advanceTimersByTime(SHRINK_INTERVAL * 3);
    expect(mockShrink).not.toHaveBeenCalled();

    service.start();
    jest.advanceTimersByTime(SHRINK_INTERVAL * 3);
    expect(mockShrink).toHaveBeenCalled();
    expect(mockShrink).toHaveBeenCalledTimes(3);

    service.stop();
    mockShrink.mockClear();
    jest.advanceTimersByTime(SHRINK_INTERVAL * 3);
    expect(mockShrink).not.toHaveBeenCalled();

    mockShrink.mockClear();
    jest.useRealTimers();
  });

  it('Expired records should be deleted by scheduler', () => {
    const mockShrink = jest.spyOn(CacheStorage.prototype, 'shrink');
    jest.useFakeTimers();

    const SHRINK_INTERVAL = 50;
    const TTL = 5;

    const service = new CacheService({ shrinkInterval: SHRINK_INTERVAL });
    service.set('foo', 'bar', TTL);
    expect(service.size()).toEqual(1);

    service.start();

    jest.advanceTimersByTime(SHRINK_INTERVAL * 3);
    expect(mockShrink).toHaveBeenCalled();
    expect(service.size()).toEqual(0);

    mockShrink.mockClear();
    jest.useRealTimers();
  });
});
