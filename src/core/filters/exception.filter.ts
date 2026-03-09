import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
} from '@nestjs/common';
import { Response } from 'express';
import { CustomLogger } from '../customLogger/customLogger';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  constructor(private readonly logger: CustomLogger) {}

  catch(exception: HttpException, host: ArgumentsHost) {
    const context = host.switchToHttp();
    const response = context.getResponse<Response>();
    const request = context.getRequest();
    const status = exception.getStatus();

    const responseJson = {
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      name: exception.name,
      messages: exception.getResponse()['message'],
      message: exception.message,
      method: request.method,
      params: request.params,
      user: request.user?.preferred_username,
      ip: request.ip,
      location: request.headers.location ?? '',
    };

    this.logger.error('Error', responseJson);

    response.status(responseJson.statusCode).json(responseJson);
  }
}
