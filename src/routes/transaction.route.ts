import { Router } from 'express';
import TransactionController from '@controllers/transaction.controller';
import { UserOwnFundDTO, WithdrawalDTO, TransferDTO } from '@dtos/transactions.dto';
import { Routes } from '@interfaces/routes.interface';
import authMiddleware from '@middlewares/auth.middleware';
import validationMiddleware from '@middlewares/validation.middleware';

class TransactionRoute implements Routes {
  public path = '/transactions';
  public router = Router();
  public transactionController = new TransactionController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.post(`${this.path}/fund`, authMiddleware, validationMiddleware(UserOwnFundDTO, 'body'), this.transactionController.fund);
    this.router.post(`${this.path}/withdraw`, authMiddleware, validationMiddleware(WithdrawalDTO, 'body'), this.transactionController.withdraw);
    this.router.post(`${this.path}/transfer`, authMiddleware, validationMiddleware(TransferDTO, 'body'), this.transactionController.transfer);
  }
}

export default TransactionRoute;
