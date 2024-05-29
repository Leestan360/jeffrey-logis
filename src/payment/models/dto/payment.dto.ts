import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString } from 'class-validator';

export class PaymentDto {
  @ApiProperty()
  @IsNumber()
  BusinessShortCode: number;

  @ApiProperty()
  @IsString()
  Password: string;

  @ApiProperty()
  @IsString()
  Timestamp: string;

  @ApiProperty()
  @IsString()
  TransactionType: string;

  @ApiProperty()
  @IsNumber()
  Amount: number;

  @ApiProperty()
  @IsNumber()
  PartyA: number;

  @ApiProperty()
  @IsNumber()
  PartyB: number;

  @ApiProperty()
  @IsNumber()
  PhoneNumber: number;

  @ApiProperty()
  @IsString()
  CallBackURL: string;

  @ApiProperty()
  @IsString()
  AccountReference: string;

  @ApiProperty()
  @IsString()
  TransactionDesc?: string;
}
