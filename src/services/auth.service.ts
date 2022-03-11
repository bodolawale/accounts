import { hash, compare } from 'bcrypt';
import { sign } from 'jsonwebtoken';
import { SECRET_KEY } from '@config';
import { CreateUserDto } from '@dtos/users.dto';
import { HttpException } from '@exceptions/HttpException';
import { DataStoredInToken, TokenData } from '@interfaces/auth.interface';
import { User } from '@interfaces/users.interface';
import { Users } from '@models/users.model';
import { isEmpty } from '@utils/util';
import { Accounts } from './../models/accounts.model';
import { Account } from '@interfaces/accounts.interface';

class AuthService {
  public async signup(userData: CreateUserDto): Promise<Omit<User, 'password'>> {
    if (isEmpty(userData)) throw new HttpException(400, "You're not userData");

    const findUser: Users = await Users.query().select().from('users').where('email', '=', userData.email).first();
    if (findUser) throw new HttpException(409, `You're email ${userData.email} already exists`);

    const hashedPassword = await hash(userData.password, 10);
    const user = await this.createUserAndAssignAccount({ ...userData, password: hashedPassword });

    const createUserData = await Users.query()
      .select()
      .from('users')
      .join('accounts', 'users.id', '=', 'accounts.id')
      .where('users.id', '=', user.id)
      .first();

    const { password, ...u } = createUserData;
    return u;
  }

  public async login(userData: CreateUserDto): Promise<{ token: string; findUser: Omit<User, 'password'> }> {
    if (isEmpty(userData)) throw new HttpException(400, "You're not userData");

    const findUser: User = await Users.query()
      .leftJoin('accounts', 'users.id', 'accounts.user_id')
      .select('users', 'accounts')
      .from('users')
      .where('email', '=', userData.email)
      .first();

    console.log(findUser);

    if (!findUser) throw new HttpException(409, `You're email ${userData.email} not found`);

    const isPasswordMatching: boolean = await compare(userData.password, findUser.password);
    if (!isPasswordMatching) throw new HttpException(409, "You're password not matching");

    const tokenData = this.createToken(findUser);

    const { password, ...u } = findUser;

    return { token: tokenData.token, findUser: u };
  }

  public async logout(userData: User): Promise<User> {
    if (isEmpty(userData)) throw new HttpException(400, "You're not userData");

    const findUser: User = await Users.query()
      .select()
      .from('users')
      .where('email', '=', userData.email)
      .andWhere('password', '=', userData.password)
      .first();

    if (!findUser) throw new HttpException(409, "You're not user");

    return findUser;
  }

  public createToken(user: User): TokenData {
    const dataStoredInToken: DataStoredInToken = { id: user.id };
    const secretKey: string = SECRET_KEY;
    const expiresIn: number = 60 * 60;

    return { expiresIn, token: sign(dataStoredInToken, secretKey, { expiresIn }) };
  }

  public createCookie(tokenData: TokenData): string {
    return `Authorization=${tokenData.token}; HttpOnly; Max-Age=${tokenData.expiresIn};`;
  }

  private async createUserAndAssignAccount(userData: CreateUserDto): Promise<User> {
    const user = await Users.transaction<User>(async transaction => {
      const user = (await transaction<User>('users').insert(userData, '*'))[0];
      const accountData = this.prepAccountData(userData, user.id);
      await transaction('accounts').insert(accountData);
      return user;
    });

    return user;
  }

  private prepAccountData(user: CreateUserDto, userId: number): Account {
    const account = new Accounts();

    account.account_name = `${user.first_name} ${user.last_name}`;
    account.account_number = Date.now().toString();
    account.user_id = userId;

    return account;
  }
}

export default AuthService;
