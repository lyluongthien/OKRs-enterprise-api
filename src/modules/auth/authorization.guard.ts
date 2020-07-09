import { Observable } from 'rxjs';
import { Reflector } from '@nestjs/core';
import {
  Injectable,
  CanActivate,
  ExecutionContext,
  Inject,
  forwardRef,
  InternalServerErrorException,
} from '@nestjs/common';
import { UserService } from '../user/user.service';
import { RoleEnum } from '@app/constants/app.enums';
import { ROLE_KEY } from '@app/constants/app.config';
import { UserEntity } from '@app/db/entities/user.entity';
import { missingAuthenticationGuard } from '@app/constants/app.exeption';
import { RoleService } from '../role/role.service';

@Injectable()
export class AuthorizationGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly usersService: UserService,
    private readonly userRoleService: RoleService,
  ) {}
  public canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    const allowedRoles = this.reflector.get<RoleEnum[]>(ROLE_KEY, context.getHandler());
    if (!allowedRoles) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const currentUser: UserEntity = request.user;
    if (!currentUser) {
      throw new InternalServerErrorException(missingAuthenticationGuard);
    }
  }
}
