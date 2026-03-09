import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { CustomLogger } from '../customLogger/customLogger';

/**
 * interceptors wrap up things, they can wrap up a function, a controller or even the whole app itself.
 * the interceptor 'intercepts' the requests for the function (or app or controller) and can execute some things
 * before and after the 'next' is handled.
 * here is a example for logging interceptor.
 */
@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  constructor(private readonly logger: CustomLogger) {}

  /**
   *
   * @param _context object with info about the request
   * @param next for this example, after the interceptor logged anything it wanted, next.handle() must be called.
   * any function that needed to be executed after the request is done, is called via next.handle().pipe(<function>)
   */
  intercept(
    _context: ExecutionContext,
    next: CallHandler,
  ): Observable<unknown> {
    const context = _context.switchToHttp();
    return next.handle().pipe(
      tap({
        complete: () => {
          this.logger.trackRequest(
            context.getRequest().method,
            context.getRequest().url,
            context.getRequest().body,
            context.getRequest().user?.preferred_username,
          );
        },
        error: (err) => {
          this.logger.error(err);
        },
      }),
    );
  }
}
