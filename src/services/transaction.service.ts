import { WithdrawalDTO, TransferDTO } from './../dtos/transactions.dto';
import { Accounts } from './../models/accounts.model';
import { Transactions } from './../models/transactions.model';
import { UserOwnFundDTO } from '@dtos/transactions.dto';
import { User } from './../interfaces/users.interface';
import { Users } from '@/models/users.model';

class TransactionService {
  public async fund(payload: UserOwnFundDTO, user: User) {
    const data = {
      ...payload,
      to: user.id,
    };

    await Transactions.transaction<any>(async trx => {
      await trx<Transactions>('transactions').insert(data, '*');
      await trx<Accounts>('accounts').where({ id: data.to }).increment('balance', data.amount);
    });

    return this.getUserFullDetails(user.id);
  }

  public async withdraw(payload: WithdrawalDTO, user: User) {
    const data = {
      ...payload,
      from: user.id,
    };

    await Transactions.transaction<any>(async trx => {
      await trx<Transactions>('transactions').insert(data, '*');
      const account = await Accounts.query().findById(user.account.id);
      if (data.amount > account.balance) throw new Error('Insufficient funds');
      await trx<Accounts>('accounts').where({ id: user.account.id }).decrement('balance', data.amount);
    });

    return this.getUserFullDetails(user.id);
  }

  public async transfer(payload: TransferDTO, user: User) {
    const destinationAccount = await Accounts.query().select().from('accounts').where('account_number', '=', payload.account_number).first();
    if (!destinationAccount) throw new Error('destination account not found');

    if (user.account.id === destinationAccount.id) throw new Error('Cannot transfer to self');

    const data = {
      details: payload.details,
      amount: payload.amount,
      from: user.id,
      to: destinationAccount.user_id,
    };
    await Transactions.transaction<any>(async trx => {
      await trx<Transactions>('transactions').insert(data, '*');
      const account = await Accounts.query().findById(user.account.id);
      if (data.amount > account.balance) throw new Error('Insufficient funds');
      await trx<Accounts>('accounts').where({ id: user.account.id }).decrement('balance', data.amount);
      await trx<Accounts>('accounts').where({ id: destinationAccount.id }).increment('balance', data.amount);
    });

    const [from, to] = await Promise.all([this.getUserFullDetails(user.id), this.getUserFullDetails(destinationAccount.user_id)]);

    return { from, to };
  }

  private async getUserFullDetails(userId: number): Promise<Omit<User, 'password'>> {
    const [user, account] = await Promise.all([
      Users.query().findById(userId),
      Accounts.query().select().from('accounts').where('user_id', '=', userId).first(),
    ]);

    user.account = account;

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...u } = user;
    return u;
  }
}

export default TransactionService;
