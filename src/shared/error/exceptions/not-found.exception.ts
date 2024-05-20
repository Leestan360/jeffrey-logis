import { HttpException, HttpStatus } from '@nestjs/common';

export class RecordNotFoundException extends HttpException {
  constructor() {
    super(
      {
        type: HttpStatus.NOT_FOUND,
        statusCode: 404,
        clientError: 'Record Not found',
        technicalError: 'Record Not found',
      },
      HttpStatus.INTERNAL_SERVER_ERROR,
    );
  }
}
