import { HttpException, HttpStatus } from '@nestjs/common';

export class RecordInvalidException extends HttpException {
  constructor(invalidRecord: any, clientStatusCode: string) {
    super(
      {
        type: HttpStatus.UNPROCESSABLE_ENTITY,
        statusCode: HttpStatus.UNPROCESSABLE_ENTITY,
        clientStatusCode,
        clientError: `${invalidRecord} is invalid`,
        technicalError: 'INVALID RECORD ERROR',
      },
      HttpStatus.UNPROCESSABLE_ENTITY,
    );
  }
}
