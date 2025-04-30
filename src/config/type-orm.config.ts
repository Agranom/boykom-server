import { DataSource, DataSourceOptions } from 'typeorm';
import { DatabaseNamingStrategy } from '../common/db/database-naming-strategy';
import { ConfigHelper } from './config.helper';
import * as dotenv from 'dotenv';
import { join } from 'path';

dotenv.config();

const isProduction = process.env.NODE_ENV === 'production';
const entryDir = isProduction ? 'dist' : 'src';

export const typeOrmConfig = (): DataSourceOptions => ({
  type: 'postgres',
  host: ConfigHelper.getOrThrow('POSTGRES_HOST'),
  port: Number(ConfigHelper.getOrThrow('POSTGRES_PORT')),
  username: ConfigHelper.getOrThrow('POSTGRES_USER'),
  password: process.env.POSTGRES_PASSWORD || '',
  database: ConfigHelper.getOrThrow('POSTGRES_DATABASE'),
  namingStrategy: new DatabaseNamingStrategy(),
  synchronize: false,
  entities: [join(__dirname, '..', '**', '*.entity.{ts,js}')],
  migrations: [join(__dirname, '..', 'migrations', '*.{ts,js}')],
  // TODO: Change after releasing
  poolSize: 5,
});

export const connectionSource = new DataSource(typeOrmConfig());
