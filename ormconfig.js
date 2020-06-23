// const accessEnv = require('')

// const type = 'postgres';
// const host = accessEnv('DB_HOST', null);
// const username = accessEnv('DB_USER', null);
// const password = accessEnv('DB_PASSWORD', null);
// const database = accessEnv('DB_NAME', null);
// const isDev = accessEnv('NODE_ENV', null);
const isDev = process.env.NODE_ENV !== 'production';

module.exports = {
  type: 'postgres',
  host: process.env.DB_HOST,
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  entities: ['dist/src/db/entities/*.entity.{ts,js}'],
  migrations: ['src/db/migrations/*.{ts,js}'],
  cli: {
    entitiesDir: 'src/db/entities',
    migrationsDir: 'src/db/migrations',
  },
  migrationsRun: true,
  synchronize: isDev ? true : false,
};
