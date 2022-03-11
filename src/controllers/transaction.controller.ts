import { WithdrawalDTO, TransferDTO } from './../dtos/transactions.dto';
import { UserOwnFundDTO } from '@dtos/transactions.dto';
import { NextFunction, Response } from 'express';
import TransactionService from '@services/transaction.service';
import { RequestWithUser } from '@/interfaces/auth.interface';

class TransactionController {
  public transactionService = new TransactionService();

  public fund = async (req: RequestWithUser, res: Response, next: NextFunction): Promise<void> => {
    try {
      const data: UserOwnFundDTO = req.body;
      const user = req.user;

      const response = await this.transactionService.fund(data, user);

      res.status(200).json({ data: response, message: 'User fund successful' });
    } catch (error) {
      next(error);
    }
  };

  public withdraw = async (req: RequestWithUser, res: Response, next: NextFunction): Promise<void> => {
    try {
      const data: WithdrawalDTO = req.body;
      const user = req.user;

      const response = await this.transactionService.withdraw(data, user);

      res.status(200).json({ data: response, message: 'Withdrawal successful' });
    } catch (error) {
      next(error);
    }
  };

  public transfer = async (req: RequestWithUser, res: Response, next: NextFunction): Promise<void> => {
    try {
      const data: TransferDTO = req.body;
      const user = req.user;

      const response = await this.transactionService.transfer(data, user);

      res.status(201).json({ data: response, message: 'Transfer successful' });
    } catch (error) {
      next(error);
    }
  };
}

export default TransactionController;
