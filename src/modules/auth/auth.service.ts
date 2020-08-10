import { JwtService } from '@nestjs/jwt';
import { Injectable, UnauthorizedException, HttpStatus, HttpException } from '@nestjs/common';
import { generate } from 'generate-password';
import { compareSync } from 'bcryptjs';

import { SignInDTO } from './auth.dto';
import { UserEntity } from '@app/db/entities/user.entity';
import { ResponseModel } from '@app/constants/app.interface';
import { CommonMessage, RoleEnum } from '@app/constants/app.enums';
import { TokenRepository } from './auth.repository';
import { expireInviteToken } from '@app/constants/app.magic-number';
import { UserRepository } from '../user/user.repository';
import { RegisterDTO } from '../auth/auth.dto';
import { JwtPayload } from './auth.interface';
import {
  EMAIL_EXIST,
  EMAIL_NOT_FOUND,
  PASSWORD_WRONG,
  INVALID_TOKEN,
  EXPIRED_TOKEN,
  USER_PENDING,
  USER_LOOKED,
} from '@app/constants/app.exeption';
import { RoleRepository } from '../role/role.repository';
import accessEnv from '@app/libs/accessEnv';

@Injectable()
export class AuthService {
  constructor(
    private _jwtService: JwtService,
    private _tokenRepository: TokenRepository,
    private _userRepository: UserRepository,
    private _roleRepository: RoleRepository,
  ) {}

  public async createUser(data: RegisterDTO): Promise<ResponseModel> {
    const currentToken = await this._tokenRepository.getToken();
    // Checkin token when register
    if (currentToken.token !== data.token) {
      throw new HttpException(INVALID_TOKEN.message, INVALID_TOKEN.statusCode);
    }
    // Checkin token is expire
    const now = new Date().getTime();
    const expireTime = currentToken.createdAt.getTime();
    const dueTime = now - expireTime;
    if (dueTime > expireInviteToken) {
      throw new HttpException(EXPIRED_TOKEN.message, EXPIRED_TOKEN.statusCode);
    }

    const emailExists = await this._userRepository.getUserByEmail(data.email);
    if (emailExists) {
      throw new HttpException(EMAIL_EXIST.message, EMAIL_EXIST.statusCode);
    }
    const role = await this._roleRepository.getRoleByName(RoleEnum.STAFF);
    const newUser = this._userRepository.create(data);
    newUser.isActive = true;
    newUser.isApproved = false;
    newUser.roleId = role.id;
    await this._userRepository.save(newUser);

    return {
      statusCode: HttpStatus.CREATED,
      message: CommonMessage.SUCCESS,
      data: newUser,
    };
  }

  public async authenticate({ email, password }: SignInDTO): Promise<ResponseModel> {
    const user = await this._userRepository.getUserByEmail(email);
    if (!user) {
      throw new HttpException(EMAIL_NOT_FOUND.message, EMAIL_NOT_FOUND.statusCode);
    }
    // When user not yet approved
    if (!user.isApproved) {
      throw new HttpException(USER_PENDING.message, USER_PENDING.statusCode);
    }

    // When user is looked
    if (!user.isActive) {
      throw new HttpException(USER_LOOKED.message, USER_LOOKED.statusCode);
    }
    const isMatchedPassword = await compareSync(password, user.password);
    if (!isMatchedPassword) {
      throw new HttpException(PASSWORD_WRONG.message, PASSWORD_WRONG.statusCode);
    }
    return await this.createBearerToken(user);
  }

  public async validateUserFromJwtPayload(payload: JwtPayload): Promise<any> {
    const { id, iat } = payload;
    const user = await this._userRepository.getUserByID(id);
    if (!user) {
      throw new UnauthorizedException();
    }
    // Check if have user + user have acceptTokenAfter + Issue At time < date of accept Token
    if (user.aceptTokenAfter && iat * 1000 < user.aceptTokenAfter.getTime()) {
      throw new UnauthorizedException();
    }
    return payload;
  }

  public async createBearerToken(user: UserEntity): Promise<ResponseModel> {
    const token = await this._jwtService.sign({ id: user.id, email: user.email });
    const urlImage = user.avatarURL ? user.avatarURL : user.gravatarURL;

    const userModel = {
      id: user.id,
      fullName: user.fullName,
      email: user.email,
      role: user.role.name,
      imageUrl: urlImage,
    };

    return {
      statusCode: HttpStatus.OK,
      message: CommonMessage.SUCCESS,
      data: {
        user: userModel,
        token: token,
      },
    };
  }

  public async generateInviteLink(): Promise<ResponseModel> {
    let token = '';
    const currentToken = await this._tokenRepository.getToken();

    if (!currentToken) {
      // If first time get link invite
      token = generate({ length: 30, numbers: true, lowercase: true, uppercase: true });
      await this._tokenRepository.createToken(token);
    } else {
      // another time get links invite
      const now = new Date().getTime();
      const expireTime = currentToken.createdAt.getTime();
      const dueTime = now - expireTime;
      if (dueTime > expireInviteToken) {
        // If token is expire, update token and createAt = now
        const date = new Date();
        token = generate({ length: 30, numbers: true, lowercase: true, uppercase: true });
        await this._tokenRepository.updateToken(currentToken.id, { token: token, createdAt: date });
      } else {
        // If token is expire
        token = currentToken.token;
      }
    }

    return {
      statusCode: HttpStatus.CREATED,
      message: CommonMessage.SUCCESS,
      data: {
        url: accessEnv('FE_HOST') + `/dang-ky?token=${token}`,
      },
    };
  }

  public async verifyLinkInvite(token: string): Promise<ResponseModel> {
    const tokenEntity = await this._tokenRepository.getToken(token);
    if (!tokenEntity) {
      throw new HttpException(INVALID_TOKEN.message, INVALID_TOKEN.statusCode);
    }

    return {
      statusCode: HttpStatus.OK,
      message: CommonMessage.VALID_TOKEN,
      data: {},
    };
  }
}
