import { IsNumber, IsOptional, IsString } from 'class-validator';

export class UserOwnFundDTO {
  @IsNumber()
  public amount: string;

  @IsOptional()
  @IsString()
  public details?: string;
}

export class TransferDTO {
  @IsNumber()
  public amount: string;

  @IsString()
  public account_number: string;

  @IsOptional()
  @IsString()
  public details?: string;
}

export class WithdrawalDTO {
  @IsNumber()
  public amount: string;

  @IsOptional()
  @IsString()
  public details?: string;
}
