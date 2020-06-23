import { Injectable } from '@nestjs/common';
import { TypeOrmOptionsFactory } from '@nestjs/typeorm';
import { PostgresConnectionOptions } from 'typeorm/driver/postgres/PostgresConnectionOptions';
import accessEnv from '@helpers/accessEnv';

const type = 'postgres';
const host = accessEnv('DB_HOST', null);
const username = accessEnv('DB_USER', null);
const password = accessEnv('DB_PASSWORD', null);
const database = accessEnv('DB_NAME', null);
const isDev = accessEnv('NODE_ENV', null);

export const typeOrmOptions: PostgresConnectionOptions = {
  type,
  host,
  username,
  password,
  database,
  entities: [__dirname + '../modules/**/*.entity.ts'],
  migrations: [__dirname + '../modules/**/*.entity.ts'],
  cli: {
    migrationsDir: __dirname + '../db/migrations',
  },
  migrationsRun: true,
  synchronize: isDev ? true : false,
};

@Injectable()
export class TypeOrmOptions implements TypeOrmOptionsFactory {
  createTypeOrmOptions(): PostgresConnectionOptions {
    return {
      ...TypeOrmOptions.createTypeOrmOptions(),
    };
  }
  static createTypeOrmOptions(): PostgresConnectionOptions {
    return Object.assign({}, typeOrmOptions);
  }
}
