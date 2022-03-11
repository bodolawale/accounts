import { DB_PG_CONNECTION_STRING } from './src/config';

export = {
  client: 'pg',
  connection: DB_PG_CONNECTION_STRING,
  migrations: {
    directory: 'src/databases/migrations',
    tableName: 'migrations',
    // stub: 'src/databases/stubs',
  },
  seeds: {
    directory: 'src/databases/seeds',
    // stub: 'src/databases/stubs',
  },
};
