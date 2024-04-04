import { config } from '@config';
import { httpService } from '@src/http.service';
import { router } from '@src/router';

export const app = async (): Promise<void> => {
  await httpService.start({ ...config, listener: router });
};
