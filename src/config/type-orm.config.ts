import { DataSource, DataSourceOptions } from 'typeorm';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';
import { ConfigHelper } from './config.helper';
import * as dotenv from 'dotenv';

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
  namingStrategy: new SnakeNamingStrategy(),
  synchronize: false,
  entities: [`${entryDir}/**/*.entity{.ts,.js}`],
  migrations: [`${entryDir}/migrations/*{.ts,.js}`],
});

export const connectionSource = new DataSource(typeOrmConfig());
