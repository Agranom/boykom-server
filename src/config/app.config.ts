import { ConfigHelper } from './config.helper';
import { pgConfig, PgConfig } from './pg.config';
import { webPushConfig, WebPushConfig } from './web-push.config';

export interface AppConfig {
  origin: string;
  jwtSecret: string;
  webPush: WebPushConfig;
  pgConfig: PgConfig;
}

export const appConfig = (): AppConfig => ({
  origin: ConfigHelper.getOrThrow('ORIGIN'),
  jwtSecret: ConfigHelper.getOrThrow('JWT_SECRET'),
  webPush: webPushConfig(),
  pgConfig: pgConfig(),
});
