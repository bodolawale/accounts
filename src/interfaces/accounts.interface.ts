import { User } from './users.interface';

export interface Account {
  id: number;
  account_name: string;
  account_number: string;
  account_type: AccountType;
  balance: number;
}

export enum AccountType {
  SAVINGS = 'savings',
  CURRENT = 'current',
}
