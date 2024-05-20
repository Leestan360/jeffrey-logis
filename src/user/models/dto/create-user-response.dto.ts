import { ApiProperty } from '@nestjs/swagger';
import { RoleEnum } from '../user.enum';

export class CreateUserResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  firstName: string;

  @ApiProperty()
  lastName: string;

  @ApiProperty()
  email: string;

  @ApiProperty()
  phoneNumber: string;

  @ApiProperty({
    enum: RoleEnum,
  })
  role?: RoleEnum;
}
