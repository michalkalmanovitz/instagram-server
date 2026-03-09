import type { ExecutionContext } from '@nestjs/common';
import { createParamDecorator } from '@nestjs/common';

export const User = createParamDecorator(
  (data: string, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const user: User = request.user;

    if (data === 'id') {
      return user.preferred_username;
    }

    return data ? user[data] : user;
  },
);

export type User = {
  preferred_username?: string;
};
