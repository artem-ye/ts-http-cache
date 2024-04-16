import { config } from '@config';
import { httpService } from '@services/http.service';
import { createRouter } from '@src/router';
import { cacheService } from './services/cache.service';

export const app = async (): Promise<void> => {
  const listener = createRouter(cacheService);
  await httpService.start({ ...config, listener });
};
