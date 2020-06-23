import accessEnv from './src/services/helpers/accessEnv';

const type = 'postgres';
const host = accessEnv('DB_HOST', null);
const username = accessEnv('DB_USER', null);
const password = accessEnv('DB_PASSWORD', null);
const database = accessEnv('DB_NAME', null);
const isDev = accessEnv('NODE_ENV', null);

module.exports = {
  type,
  host,
  username,
  password,
  database,
  entities: [__dirname + '../modules/**/*.entity.ts'],
  migrations: [__dirname + '../modules/**/*.entity.ts'],
  cli: {
    migrationsDir: __dirname + './src/db/migrations',
  },
  migrationsRun: true,
  synchronize: isDev ? true : false,
};
