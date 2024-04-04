import { app } from '@src/app';

test('app test', async () => {
  expect(typeof app === 'function').toBe(true);
});
