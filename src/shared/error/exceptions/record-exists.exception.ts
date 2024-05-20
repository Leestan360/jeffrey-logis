import { HttpException, HttpStatus } from '@nestjs/common';

export class RecordExistsException extends HttpException {
  constructor(existingRecord: any, clientStatusCode: string) {
    super(
      {
        type: HttpStatus.BAD_REQUEST,
        statusCode: HttpStatus.BAD_REQUEST,
        clientStatusCode,
        clientError: `${existingRecord} exists`,
        technicalError: 'UNIQUE CONSTRAINT ERROR',
      },
      HttpStatus.BAD_REQUEST,
    );
  }
}
