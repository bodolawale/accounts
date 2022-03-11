import Knex from 'knex';
import { DB_PG_CONNECTION_STRING } from '@config';

const dbConnection = {
  client: 'pg',
  connection: DB_PG_CONNECTION_STRING,
  pool: {
    min: 2,
    max: 10,
  },
};

export default Knex(dbConnection);
