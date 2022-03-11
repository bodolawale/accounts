import { Accounts } from './accounts.model';
import { Model, ModelObject } from 'objection';
import { User } from '@interfaces/users.interface';

export class Users extends Model implements User {
  id!: number;
  email!: string;
  password!: string;
  first_name!: string;
  last_name!: string;
  account!: Accounts;

  static tableName = 'users'; // database table name
  static idColumn = 'id'; // id column name
}

export type UsersShape = ModelObject<Users>;
