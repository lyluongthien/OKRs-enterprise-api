import { TypeOrmModule } from '@nestjs/typeorm';
import accessEnv from '@helpers/accessEnv';
import { PostgresConnectionOptions } from 'typeorm/driver/postgres/PostgresConnectionOptions';

const type = 'postgres';
const host = accessEnv('DB_HOST', null);
const username = accessEnv('DB_USER', null);
const password = accessEnv('DB_PASSWORD', null);
const database = accessEnv('DB_NAME', null);

export const databaseProviders = [
  TypeOrmModule.forRootAsync({
    async useFactory() {
      return {
        type,
        host,
        username,
        password,
        database,
        entities: [__dirname + '/entities/*.entity.ts'],
        migrations: [__dirname + '/migrations/*.ts'],
      } as PostgresConnectionOptions;
    },
  }),
];
