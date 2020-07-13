import { AuthGuard } from '@nestjs/passport';
import { Injectable, UnauthorizedException, ExecutionContext } from '@nestjs/common';
import { UserEntity } from '@app/db/entities/user.entity';

@Injectable()
export class AuthenticationGuard extends AuthGuard('jwt') {
  public async canActivate(context: ExecutionContext): Promise<any> {
    return super.canActivate(context);
  }

  public handleRequest<T = UserEntity>(err: Error, user?: T): T {
    if (err || !user) {
      throw err || new UnauthorizedException();
    }
    return user;
  }
}
