import { Accounts } from './../models/accounts.model';
import { Users } from './../models/users.model';
import { LoginUserDto } from './../dtos/users.dto';
import request from 'supertest';
import App from '../app';
import { CreateUserDto } from '../dtos/users.dto';
import AuthRoute from '../routes/auth.route';

afterAll(async () => {
  await new Promise<void>(resolve => setTimeout(() => resolve(), 500));
  await Accounts.query().delete();
  await Users.query().delete();
});

describe('Testing Auth', () => {
  describe('[POST] /signup', () => {
    it('response should have the Create userData', () => {
      const userData: CreateUserDto = {
        email: 'test@email.com',
        password: 'q1w2e3r4',
        first_name: 'James',
        last_name: 'Jones',
      };

      const authRoute = new AuthRoute();
      const app = new App([authRoute]);
      return request(app.getServer()).post('/signup').send(userData).expect(201);
    });
  });

  describe('[POST] /login', () => {
    it('response should return authorization token', async () => {
      const userData: LoginUserDto = {
        email: 'test@email.com',
        password: 'q1w2e3r4',
      };

      const authRoute = new AuthRoute();
      const app = new App([authRoute]);
      return request(app.getServer()).post('/login').send(userData).expect(200);
    });
  });
});
