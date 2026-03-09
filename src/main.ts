import 'reflect-metadata';
import { NestFactory, Reflector } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import {
  RequestMethod,
  ClassSerializerInterceptor,
  ValidationPipe,
} from '@nestjs/common';
import compression from 'compression';
import { AppModule } from './app.module';
import { LoggingInterceptor } from './core/interceptors/logging.interceptor';
import { ErrorsInterceptor } from './core/interceptors/errors.interceptor';
import { HeadersInterceptor } from './core/interceptors/headers.interceptor';
import { AADAuthGuard } from './core/guards/authentication/aad.guard';
import { HttpExceptionFilter } from './core/filters/exception.filter';
import { CustomLogger } from './core/customLogger/customLogger';
import { helmetConfig } from './core/helmet/helmetConfig';
// import { setupSwagger } from './core/swagger/swagger';
import otelTracer from './core/tracing/tracer';

async function bootstrap() {
  otelTracer.start();
  const app = await NestFactory.create(AppModule, { bufferLogs: true });

  app.enableCors({
    origin: [process.env.CLIENT_URL, process.env.SERVER_URL],
    credentials: true,
  });

  // Access to .env
  const configService = app.get(ConfigService);

  const reflector = app.get(Reflector);

  const logger: CustomLogger = new CustomLogger(configService);

  app.setGlobalPrefix('api', {
    exclude: [{ path: '/', method: RequestMethod.GET }],
  });
  app.useLogger(logger);
  app.useGlobalGuards(new AADAuthGuard(reflector));
  app.useGlobalFilters(new HttpExceptionFilter(logger));
  app.useGlobalInterceptors(new LoggingInterceptor(logger));
  app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));
  app.useGlobalInterceptors(new ErrorsInterceptor(logger));
  app.useGlobalInterceptors(new HeadersInterceptor());
  app.use(helmetConfig);
  app.use(compression());

  app.useGlobalPipes(new ValidationPipe({ transform: true }));

  // Swagger, enable only locally
  // if (process.env.NODE_ENV !== 'production') {
  //   setupSwagger(app);
  // }

  const port = configService.get<string>('PORT') || 5216;

  // Start server
  await app.listen(port);
  logger.log(`Server Started on port ${port}!`);
}

void bootstrap();
