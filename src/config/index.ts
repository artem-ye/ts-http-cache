import { env } from 'process';

interface Config {
  host: string;
  port: number;
  logging: boolean;
}

export const config: Config = {
  host: env.HTTP_HOST || '127.0.0.1',
  port: parseInt(env.HTTP_PORT ?? '3000'),
  logging: !!(env.LOGGING ?? true),
};
