import { Controller, Get } from '@nestjs/common';
import { Public } from '../decorators/public.decorator';
import { SkipThrottle } from '@nestjs/throttler';

@SkipThrottle()
@Controller()
export class HealthController {
  constructor() {}

  @Public()
  @Get()
  readiness() {
    return {};
  }
}
