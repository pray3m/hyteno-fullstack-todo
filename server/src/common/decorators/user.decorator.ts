import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { User as UserType } from '@prisma/client';

/**
 * Custom decorator to extract user information from the request.
 * @param data - The data to extract (e.g., 'id', 'email').
 * @param ctx - Execution context.
 * @returns The extracted user data.
 */

export const User = createParamDecorator(
  (data: string, ctx: ExecutionContext): UserType => {
    const request = ctx.switchToHttp().getRequest();
    const user = request.user;

    return data ? user?.[data] : user;
  },
);
