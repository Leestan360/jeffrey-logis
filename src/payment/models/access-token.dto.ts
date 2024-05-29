import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString } from 'class-validator';

export class AccessTokenResponse {
  @ApiProperty()
  @IsString()
  access_token: string;

  @ApiProperty()
  @IsNumber()
  expires_in: number;
}
