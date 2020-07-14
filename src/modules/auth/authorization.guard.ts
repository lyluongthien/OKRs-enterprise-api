import { Reflector } from '@nestjs/core';
import { Injectable, CanActivate, ExecutionContext, InternalServerErrorException } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { RoleEnum } from '@app/constants/app.enums';
import { ROLE_KEY } from '@app/constants/app.config';
import { UserEntity } from '@app/db/entities/user.entity';
import { missingAuthenticationGuard } from '@app/constants/app.exeption';
import { Observable } from 'rxjs';

@Injectable()
export class AuthorizationGuard implements CanActivate {
  constructor(private readonly reflector: Reflector, private readonly usersService: UserService) {}
  public async canActivate(context: ExecutionContext): Promise<any | boolean | Promise<boolean> | Observable<boolean>> {
    const allowedRoles = this.reflector.get<RoleEnum[]>(ROLE_KEY, context.getHandler());
    if (!allowedRoles) {
      return true;
    }
    const request = context.switchToHttp().getRequest();
    const user: UserEntity = request.user;
    if (!user) {
      throw new InternalServerErrorException(missingAuthenticationGuard);
    }
    // const request = context.switchToHttp().getRequest();
    // const authHeader: string = request.headers.authorization;
    // if (!authHeader) return false;
    // const [type, token] = authHeader.split(' ');
    // if (type !== 'Bearer') return false;
    // try {
    //   const { id }: JwtPayload = await this.jwtService.verifyAsync(token);
    //   const user: UserEntity = await this.userService.getUserById(id);
    //   request['user'] = user;
    //   return true;
    user.role = await this.usersService.getRoleByUserID(user.id);
    return allowedRoles.includes(user.role.name);
  }
  private allowedHandle(userRole: string, roleGuard: string): boolean {
    return userRole === roleGuard;
  }
}
