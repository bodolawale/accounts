import { Model, ModelObject } from 'objection';
import { Transaction } from '@interfaces/transaction.interface';

export class Transactions extends Model implements Transaction {
  id: number;
  from: number;
  to: number;
  amount: number;
  details: string;

  static tableName = 'transactions'; // database table name
  static idColumn = 'id'; // id column name
}

export type TransactionsShape = ModelObject<Transactions>;
