import { hash } from 'bcrypt';
import { CreateUserDto } from '@dtos/users.dto';
import { HttpException } from '@exceptions/HttpException';
import { User } from '@interfaces/users.interface';
import { Users } from '@models/users.model';
import { isEmpty } from '@utils/util';
import { Accounts } from '@/models/accounts.model';

class UserService {
  public async findAllUser(): Promise<Omit<User, 'password'>[]> {
    const users: User[] = await Users.query().select().from('users');
    await Promise.all(
      users.map(async user => {
        const account = await Accounts.query().select().from('accounts').where('user_id', '=', user.id).first();
        user.account = account;
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { password, ...u } = user;
        return u;
      }),
    );
    return users.map(user => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password, ...u } = user;
      return u;
    });
  }

  public async userById(userId: number): Promise<User> {
    const user: User = await Users.query().findById(userId);
    if (!user) throw new HttpException(409, "You're not user");
    const account = await Accounts.query().select().from('accounts').where('user_id', '=', user.id).first();
    user.account = account;

    return user;
  }

  public async createUser(userData: CreateUserDto): Promise<User> {
    if (isEmpty(userData)) throw new HttpException(400, "You're not userData");

    const user: User = await Users.query().select().from('users').where('email', '=', userData.email).first();
    if (user) throw new HttpException(409, `You're email ${userData.email} already exists`);

    const hashedPassword = await hash(userData.password, 10);
    const createUserData: User = await Users.query()
      .insert({ ...userData, password: hashedPassword })
      .into('users');

    return createUserData;
  }

  public async deleteUser(userId: number): Promise<User> {
    const user: User = await Users.query().select().from('users').where('id', '=', userId).first();
    if (!user) throw new HttpException(409, "You're not user");

    await Users.query().delete().where('id', '=', userId).into('users');
    return user;
  }
}

export default UserService;
