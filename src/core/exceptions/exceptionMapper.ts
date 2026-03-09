import { HttpException, HttpStatus } from '@nestjs/common';
// import { ERROR_CODES, ERROR_MSGS } from '../../utils/messages';
import type { CustomLogger } from '../customLogger/customLogger';
import { TypeORMError } from 'typeorm';

/**
 * map exception to httpException
 * @param exception - the exception
 * @returns - exception from type HttpException
 */

interface CustomError extends Error {
  response?: { message: string[]; statusCode: number };
}

const getExceptionMessage = (exception: CustomError): string => {
  if (exception instanceof TypeORMError) {
    return 'Internal server error';
  }

  return exception.message;
};

export const exceptionMapper = (
  exception: CustomError,
  logger: CustomLogger,
): HttpException => {
  if (exception.response?.message) {
    logger.error(`Validation error: ${exception.response.message.toString()}`);
  }

  logger.error(`The exception is: ${exception.message}`);
  logger.error(`Stack:\n ${exception.stack}`);

  return new HttpException(
    getExceptionMessage(exception),
    HttpStatus.INTERNAL_SERVER_ERROR,
  );

  // TODO: Messages enum
  // return new HttpException(
  //   ERROR_MSGS[ERROR_CODES.GENERIC],
  //   HttpStatus.INTERNAL_SERVER_ERROR,
  // );
};
