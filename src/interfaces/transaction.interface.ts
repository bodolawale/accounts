import { User } from './users.interface';

export interface Transaction {
  id: number;
  from: number;
  to: number;
  amount: number;
}
