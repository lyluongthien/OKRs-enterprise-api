import { Injectable } from '@nestjs/common';
import { TypeOrmOptionsFactory, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { DbConfig } from '@app/constants/app.enums';
import { isDevMode } from '@app/constants/app.config';
import accessEnv from '@app/libs/accessEnv';

const type = DbConfig.DB_TYPE;
const host = accessEnv(DbConfig.DB_HOST);
const port = +accessEnv(DbConfig.DB_PORT);
const username = accessEnv(DbConfig.DB_USER);
const password = accessEnv(DbConfig.DB_PASSWORD);
const database = accessEnv(DbConfig.DB_NAME);

@Injectable()
export class DatabaseConnectionService implements TypeOrmOptionsFactory {
  createTypeOrmOptions(): TypeOrmModuleOptions {
    return {
      type,
      port,
      host,
      username,
      password,
      database,
      entities: ['dist/**/*.entity.js'],
      migrations: ['dist/db/migrations/*.js'],
      cli: {
        migrationsDir: 'src/db/migrations/*.ts',
        entitiesDir: 'src/db/entities/*.ts',
      },
      dropSchema: false,
      logging: isDevMode ? true : false,
      synchronize: false,
      keepConnectionAlive: true,
    };
  }
}