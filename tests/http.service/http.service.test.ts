import { httpService } from '@src/http.service';

describe('http.service', () => {
  it('Should start', async () => {
    await httpService.start();
    await httpService.stop();
    expect(true).toBe(true);
  });
});
