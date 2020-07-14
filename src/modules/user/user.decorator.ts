import { createParamDecorator, ExecutionContext, InternalServerErrorException } from '@nestjs/common';

export const CurrentUser = createParamDecorator(
  (_, ctx: ExecutionContext): ParameterDecorator => {
    const user = ctx.switchToHttp().getRequest().user;
    if (!user) {
      throw new InternalServerErrorException();
    }
    return user;
  },
);
