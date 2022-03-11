import { IsNumber, IsOptional, IsString } from 'class-validator';

export class UserOwnFundDTO {
  @IsNumber()
  public amount: number;

  @IsOptional()
  @IsString()
  public details?: string;
}

export class TransferDTO {
  @IsNumber()
  public amount: number;

  @IsString()
  public account_number: string;

  @IsOptional()
  @IsString()
  public details?: string;
}

export class WithdrawalDTO {
  @IsNumber()
  public amount: number;

  @IsOptional()
  @IsString()
  public details?: string;
}
