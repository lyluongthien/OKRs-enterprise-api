import { PostgresConnectionOptions } from 'typeorm/driver/postgres/PostgresConnectionOptions';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DbConfig } from 'src/constants/Enums';
import accessEnv from '@libs/accessEnv';

const type = DbConfig.DB_TYPE;
const host = accessEnv(DbConfig.DB_HOST, '0.0.0.0');
const port = accessEnv(DbConfig.DB_PORT, null);
const username = accessEnv(DbConfig.DB_USER, null);
const password = accessEnv(DbConfig.DB_PASSWORD, null);
const database = accessEnv(DbConfig.DB_NAME, null);

export const databaseProviders = [
  TypeOrmModule.forRootAsync({
    async useFactory() {
      return {
        type,
        host,
        port,
        username,
        password,
        database,
        entities: [__dirname + '/entities/*.entity.ts'],
        migrations: [__dirname + '/migrations/*.ts'],
      } as PostgresConnectionOptions;
    },
  }),
];
