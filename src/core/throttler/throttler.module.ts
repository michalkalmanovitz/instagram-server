import { ThrottlerModule as Throttler } from '@nestjs/throttler';

export const ThrottlerModule = Throttler.forRoot({
  throttlers: [
    {
      ttl: 60,
      limit: 500,
    },
  ],
});
