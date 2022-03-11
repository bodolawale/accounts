import { Account } from '@interfaces/accounts.interface';
export interface User {
  id: number;
  email: string;
  password: string;
  first_name: string;
  last_name: string;
  account: Account;
}
