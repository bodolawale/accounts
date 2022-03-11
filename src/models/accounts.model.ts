import { AccountType } from './../interfaces/accounts.interface';
import { Model, ModelObject } from 'objection';
import { Account } from '@interfaces/accounts.interface';

export class Accounts extends Model implements Account {
  id: number;
  account_name: string;
  account_number: string;
  account_type: AccountType = AccountType.SAVINGS;
  balance = 0;
  user_id: number;

  static tableName = 'accounts'; // database table name
  static idColumn = 'id'; // id column name
}

export type AccountsShape = ModelObject<Accounts>;
