import { UserOwnFundDTO, WithdrawalDTO, TransferDTO } from './../dtos/transactions.dto';
import { Transactions } from './../models/transactions.model';
import TransactionRoute from '../routes/transaction.route';
import AuthRoute from '../routes/auth.route';
import request from 'supertest';
import App from '../app';
import { Accounts } from './../models/accounts.model';
import { Users } from './../models/users.model';
import { User } from '../interfaces/users.interface';
import knex from '../databases/index';

const dbUsers: Omit<User, 'password'>[] = [];
const token = { user1: '', user2: '' };

afterAll(async () => {
  await new Promise<void>(resolve => setTimeout(() => resolve(), 500));
  await Accounts.query().delete();
  await Users.query().delete();
  await Transactions.query().delete();
});

beforeAll(async () => {
  const userData = {
    email: 'test@gmail.com',
    password: 'q1w2e3r4',
    first_name: 'James',
    last_name: 'Jones',
  };
  const user2 = {
    email: 'test@gmail2.com',
    password: 'q1w2e3r4',
    first_name: 'Agnes',
    last_name: 'Alex',
  };
  const loginData = {
    email: userData.email,
    password: userData.password,
  };
  const loginData2 = {
    email: user2.email,
    password: user2.password,
  };
  const authRoute = new AuthRoute();
  const app = new App([authRoute]);
  await request(app.getServer()).post(`${authRoute.path}signup`).send(userData);
  await request(app.getServer()).post(`${authRoute.path}signup`).send(user2);
  const res = await request(app.getServer()).post(`${authRoute.path}login`).send(loginData);
  const res2 = await request(app.getServer()).post(`${authRoute.path}login`).send(loginData2);
  dbUsers.push(res.body.data.user);
  dbUsers.push(res2.body.data.user);
  token.user1 = res.body.data.token;
});

describe('Testing Transactions', () => {
  describe('[POST] transactions/fund', () => {
    it('response statusCode 200 / fund account', async () => {
      const data: UserOwnFundDTO = {
        amount: 10000,
      };
      const transactionRoute = new TransactionRoute();
      const app = new App([transactionRoute]);
      const res = await request(app.getServer()).post(`${transactionRoute.path}/fund`).set('Authorization', `Bearer ${token.user1}`).send(data);
      expect(res.statusCode).toEqual(200);
      expect(res.body.data.account.balance).toEqual(data.amount);
    });
  });

  describe('[GET] transactions/withdraw', () => {
    it('response statusCode 200 / fund account', async () => {
      const data: WithdrawalDTO = {
        amount: 5000,
      };
      const transactionRoute = new TransactionRoute();
      const app = new App([transactionRoute]);
      const res = await request(app.getServer()).post(`${transactionRoute.path}/withdraw`).set('Authorization', `Bearer ${token.user1}`).send(data);
      expect(res.statusCode).toEqual(200);
      expect(res.body.data.account.balance).toEqual(5000);
    });
  });

  describe('[GET] transactions/withdraw', () => {
    it('response statusCode 200 / fund account', async () => {
      const account2 = (await knex<Accounts>('accounts').where({ user_id: dbUsers[1].id }).select())[0];
      const data: TransferDTO = {
        amount: 2500,
        account_number: account2.account_number,
      };
      const transactionRoute = new TransactionRoute();
      const app = new App([transactionRoute]);
      const res = await request(app.getServer()).post(`${transactionRoute.path}/transfer`).set('Authorization', `Bearer ${token.user1}`).send(data);
      expect(res.statusCode).toEqual(200);
      expect(res.body.data.from.account.balance).toEqual(2500);
      expect(res.body.data.to.account.balance).toEqual(2500);
    });
  });
});
