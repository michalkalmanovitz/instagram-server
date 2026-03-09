import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';

/**
 * this interceptor exists for security reasons.
 * you may read about each header in the internet.
 */
@Injectable()
export class HeadersInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler<unknown>) {
    const res = context.switchToHttp().getResponse();

    res.setHeader('Cache-Control', 'no-store');
    res.setHeader('Feature-Policy', '');
    res.setHeader(
      'Permissions-Policy',
      'geolocation=(), microphone=(), camera=(), fullscreen=()',
    );
    res.setHeader('Server', '');
    return next.handle();
  }
}
