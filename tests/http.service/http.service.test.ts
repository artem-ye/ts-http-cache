import { httpService } from '@services/http.service';

describe('http.service', () => {
  it('Should start', async () => {
    await httpService.start();
    await httpService.stop();
    expect(true).toBe(true);
  });
});
