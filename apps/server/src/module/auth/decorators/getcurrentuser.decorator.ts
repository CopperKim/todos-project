import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const getCurrentUser = createParamDecorator( // idk, but by chatGPT 
  (data: 'sub' | 'username' | undefined, ctx: ExecutionContext) => {
    const req = ctx.switchToHttp().getRequest();
    const user = req.user as { sub: string; username: string };
    return data ? user?.[data] : user;
  },
);