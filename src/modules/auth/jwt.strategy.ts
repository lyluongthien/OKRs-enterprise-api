import { Strategy, ExtractJwt } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtPayload } from './auth.interface';
import { httpUnauthorized } from '@app/constants/app.exeption';
import { UserEntity } from '@app/db/entities/user.entity';
import { defaultJwtModuleOption } from '@app/constants/app.config';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(private readonly _authService: AuthService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: defaultJwtModuleOption.secret,
    });
  }

  /**
   * @description:
   * Passport will build a "user" object based on the return value of our validate() method,
   * and attach it as a property on the Request object.
   */
  public async validate(payload: any | JwtPayload): Promise<UserEntity> {
    const user = await this._authService.validateUserFromJwtPayload(payload);
    if (!user) {
      throw new UnauthorizedException(httpUnauthorized);
    }
    return user;
  }
}
