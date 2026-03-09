import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { exceptionMapper } from '../exceptions/exceptionMapper';
import { CustomLogger } from '../customLogger/customLogger';

@Injectable()
export class ErrorsInterceptor implements NestInterceptor {
  constructor(private readonly logger: CustomLogger) {}

  intercept(_: ExecutionContext, next: CallHandler): Observable<unknown> {
    return next.handle().pipe(
      catchError((err) => {
        const exception = exceptionMapper(err, this.logger);
        return throwError(() => exception);
      }),
    );
  }
}
