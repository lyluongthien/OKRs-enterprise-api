import { JwtService } from '@nestjs/jwt';
import { Injectable, UnauthorizedException, HttpStatus, HttpException } from '@nestjs/common';
import { SignInDTO } from './auth.dto';
import { UserEntity } from '@app/db/entities/user.entity';
import { httpEmailExists, EMAIL_NOT_FOUND, PASSWORD_WRONG, INTERNAL_SERVER_ERROR } from '@app/constants/app.exeption';
import { ResponseModel } from '@app/constants/app.interface';
import { CommonMessage, RouterEnum } from '@app/constants/app.enums';
import { generate } from 'generate-password';
import { TokenRepository } from './auth.repository';
import { expireInviteToken } from '@app/constants/app.magic-number';
import { UserRepository } from '../user/user.repository';
import { RegisterDTO } from '../auth/auth.dto';
import { compareSync } from 'bcryptjs';
import { JwtPayload } from './auth.interface';

@Injectable()
export class AuthService {
  constructor(
    private _jwtService: JwtService,
    private _tokenRepository: TokenRepository,
    private _userRepository: UserRepository,
  ) {}

  public async createUser(data: RegisterDTO): Promise<UserEntity> {
    try {
      const emailExists = await this._userRepository.getUserByEmail(data.email);
      if (emailExists) {
        throw new HttpException(httpEmailExists, HttpStatus.BAD_REQUEST);
      }
      const newUser = this._userRepository.create(data);
      await this._userRepository.save(newUser);

      const user = await this._userRepository.getUserByEmail(data.email);
      return user;
    } catch (error) {
      throw new HttpException(httpEmailExists, HttpStatus.BAD_REQUEST);
    }
  }

  public async authenticate({ email, password }: SignInDTO): Promise<ResponseModel> {
    try {
      const user = await this._userRepository.getUserByEmail(email);
      if (!user) {
        throw new HttpException(EMAIL_NOT_FOUND.message, EMAIL_NOT_FOUND.statusCode);
      }
      const isMatchedPassword = await compareSync(password, user.password);
      if (!isMatchedPassword) {
        throw new HttpException(PASSWORD_WRONG.message, PASSWORD_WRONG.statusCode);
      }
      return await this.createBearerToken(user);
    } catch (error) {
      throw new HttpException(INTERNAL_SERVER_ERROR.message, INTERNAL_SERVER_ERROR.statusCode);
    }
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
      name: user.fullName,
      email: user.email,
      role: user.role.name,
      image_url: urlImage,
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
        url: RouterEnum.FE_HOST_ROUTER + `/dang-ky?token=${token}`,
      },
    };
  }

  public async verifyLinkInvite(token: string): Promise<ResponseModel> {
    const tokenEntity = await this._tokenRepository.getToken(token);
    if (!tokenEntity) {
      throw new HttpException(CommonMessage.INVALID_TOKEN, HttpStatus.BAD_REQUEST);
    }

    return {
      statusCode: HttpStatus.OK,
      message: CommonMessage.VALID_TOKEN,
      data: {},
    };
  }
}
