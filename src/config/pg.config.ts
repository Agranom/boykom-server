import { ConfigHelper } from './config.helper';

export interface PgConfig {
  host: string;
  port: number;
  user: string;
  password: string;
  dbName: string;
}

export const pgConfig = (): PgConfig => ({
  host: ConfigHelper.getOrThrow('POSTGRES_HOST'),
  port: Number(ConfigHelper.getOrThrow('POSTGRES_PORT')),
  user: ConfigHelper.getOrThrow('POSTGRES_USER'),
  password: process.env.POSTGRES_PASSWORD || '',
  dbName: ConfigHelper.getOrThrow('POSTGRES_DATABASE'),
});
