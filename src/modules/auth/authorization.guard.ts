import { Reflector } from '@nestjs/core';
import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { RoleEnum } from '@app/constants/app.enums';
import { ROLE_KEY } from '@app/constants/app.config';
import { UserEntity } from '@app/db/entities/user.entity';
import { Observable } from 'rxjs';

@Injectable()
export class AuthorizationGuard implements CanActivate {
  constructor(private readonly _reflector: Reflector, private readonly _usersService: UserService) {}

  public async canActivate(context: ExecutionContext): Promise<any | boolean | Promise<boolean> | Observable<boolean>> {
    const request = context.switchToHttp().getRequest();
    const user: UserEntity = request.user;
    if (!user) {
      throw new UnauthorizedException();
    }
    const allowedRoles = this._reflector.get<RoleEnum[]>(ROLE_KEY, context.getHandler());
    if (!allowedRoles) {
      return true;
    }

    const userRole = await this._usersService.getRoleByUserID(user.id);
    return allowedRoles.includes(userRole.name);
  }
}
