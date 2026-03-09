import { Global, Module } from '@nestjs/common';
import { CustomLogger } from './customLogger';

@Global()
@Module({
  providers: [CustomLogger],
  exports: [CustomLogger],
})
export class LoggerModule {}
