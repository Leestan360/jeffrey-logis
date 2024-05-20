import { HttpException } from '@nestjs/common';

export type ExceptionAndNull = Readonly<[HttpException, null]>;
export type NullAndResult<T> = Readonly<[null, T]>;
export type ErrorResultTuple<T> = ExceptionAndNull | NullAndResult<T>;
