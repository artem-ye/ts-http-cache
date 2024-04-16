import { CacheService } from '@services/cache.service';

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
  it.todo('Scheduler works');
});
