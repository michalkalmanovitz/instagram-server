import { Module } from '@nestjs/common';
import { ThrottlerGuard } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import { TypeormModule } from './core/typeorm/typeorm.module';
import { ThrottlerModule } from './core/throttler/throttler.module';
import { HealthController } from './core/health/health.controller';
import { AADStrategy } from './core/guards/authentication/aad.strategy';
import { ConfigModule } from './core/config/config.module';
import { LoggerModule } from './core/customLogger/customLogger.module';
import { PostModule } from './models/post/post.module';

@Module({
  imports: [
    ConfigModule, // This import is resolving all the .env params, MUST be done first.
    TypeormModule, // This import get the typeorm configuration, should be before the other modules.
    ThrottlerModule,
    LoggerModule,
    PostModule,
  ],
  controllers: [HealthController],
  providers: [
    //* When adding a guard to AppModule, if you add it with `provide: APP_GUARD`, it will be global
    {
      provide: APP_GUARD,
      useClass: AADStrategy,
    },
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}
