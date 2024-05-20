import { ApiProperty } from '@nestjs/swagger';
import { UserResponseDto } from './user-response.dto';

export class UserResponseWithPassDto extends UserResponseDto {
  @ApiProperty()
  password: string;
}
