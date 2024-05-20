import { HttpException, HttpStatus } from '@nestjs/common';

export class DbException extends HttpException {
  constructor() {
    super(
      {
        type: HttpStatus.INTERNAL_SERVER_ERROR,
        statusCode: 500,
        clientError: 'Something went wrong',
        technicalError: 'DB Error',
      },
      HttpStatus.INTERNAL_SERVER_ERROR,
    );
  }
}
