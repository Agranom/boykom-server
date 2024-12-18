import { DataSourceOptions } from 'typeorm';
import { ConfigHelper } from './config.helper';
import { pgConfig, PgConfig } from './pg.config';
import { typeOrmConfig } from './type-orm.config';
import { webPushConfig, WebPushConfig } from './web-push.config';
import { GroceryStorageConfig, groceryStorageConfig } from './grocery-storage.config';

export interface AppConfig {
  origin: string;
  jwtSecret: string;
  webPush: WebPushConfig;
  pgConfig: PgConfig;
  typeOrmConfig: DataSourceOptions;
  port: number;
  groceryStorageConfig: GroceryStorageConfig;
}

export const appConfig = (): AppConfig => ({
  origin: ConfigHelper.getOrThrow('ORIGIN'),
  jwtSecret: ConfigHelper.getOrThrow('JWT_SECRET'),
  webPush: webPushConfig(),
  pgConfig: pgConfig(),
  typeOrmConfig: typeOrmConfig(),
  port: Number(process.env.PORT) || 4000,
  groceryStorageConfig: groceryStorageConfig(),
});
