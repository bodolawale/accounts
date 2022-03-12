import AuthRoute from '../routes/auth.route';
import request from 'supertest';
import App from '../app';
import { Accounts } from './../models/accounts.model';
import { Users } from './../models/users.model';
import UserRoute from '../routes/users.route';
import { User } from '../interfaces/users.interface';
import knex from '../databases/index';

const dbUsers: Omit<User, 'password'>[] = [];

afterAll(async () => {
  await new Promise<void>(resolve => setTimeout(() => resolve(), 500));
  await Accounts.query().delete();
  await Users.query().delete();
});

beforeAll(async () => {
  const userData = {
    email: 'test@gmail.com',
    password: 'q1w2e3r4',
    first_name: 'James',
    last_name: 'Jones',
  };
  const loginData = {
    email: userData.email,
    password: userData.password,
  };
  const authRoute = new AuthRoute();
  const app = new App([authRoute]);
  await request(app.getServer()).post(`${authRoute.path}signup`).send(userData);
  const res = await request(app.getServer()).post(`${authRoute.path}login`).send(loginData);
  dbUsers.push(res.body.data.user);
});

describe('Testing Users', () => {
  describe('[GET] /users', () => {
    it('response statusCode 200 / findAll', () => {
      const usersRoute = new UserRoute();
      const app = new App([usersRoute]);
      return request(app.getServer()).get(`${usersRoute.path}`).expect(200);
    });
  });

  describe('[GET] /users/:id', () => {
    it('response statusCode 200 / findOne', () => {
      const userId = dbUsers[0].id;

      const usersRoute = new UserRoute();
      const app = new App([usersRoute]);
      return request(app.getServer()).get(`${usersRoute.path}/${userId}`).expect(200);
    });
  });

  describe('[GET] /users/accounts/:accountNumber', () => {
    it('response statusCode 200 / accountDetails', async () => {
      const userId = Number(dbUsers[0].id);
      const account = await knex<Accounts>('accounts').where({ user_id: userId }).select().first();
      const usersRoute = new UserRoute();
      const app = new App([usersRoute]);
      const res = await request(app.getServer()).get(`${usersRoute.path}/accounts/${account.account_number}`);
      expect(res.statusCode).toBe(200);
      expect(res.body.data.user_id).toEqual(userId);
    });
  });
});
