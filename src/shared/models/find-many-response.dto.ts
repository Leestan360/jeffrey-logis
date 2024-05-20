import { ApiProperty } from '@nestjs/swagger';

export class FindManyResponseDto<T> {
  @ApiProperty()
  total: number;

  @ApiProperty()
  totalPages: number;

  @ApiProperty()
  currentPage: number;

  data: T[];
}
