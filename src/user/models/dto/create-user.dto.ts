import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsEnum, IsOptional, IsString } from 'class-validator';
import { RoleEnum } from '../user.enum';
import { Transform } from 'class-transformer';

export class CreateUserDto {
  @ApiProperty()
  @IsString()
  firstName: string;

  @ApiProperty()
  @IsString()
  lastName: string;

  @ApiProperty()
  @IsString()
  @IsEmail()
  email: string;

  @ApiProperty()
  @IsString()
  phoneNumber: string;

  @ApiProperty({
    enum: RoleEnum,
    example: RoleEnum.USER,
  })
  @Transform(({ value }) => value.toLowerCase())
  @IsEnum(RoleEnum)
  @IsOptional()
  role?: RoleEnum = RoleEnum.USER;

  @ApiProperty()
  @IsString()
  password: string;
}
