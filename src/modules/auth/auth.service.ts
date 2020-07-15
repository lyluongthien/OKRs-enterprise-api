import { JwtService } from '@nestjs/jwt';
import {
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
  BadRequestException,
  HttpStatus,
  HttpException,
} from '@nestjs/common';
import { SignInDTO } from './auth.dto';
import { UserEntity } from '@app/db/entities/user.entity';
import { AuthResponse, JwtPayload } from './auth.interface';
import { invalidCredential, httpEmailExists } from '@app/constants/app.exeption';
import { ResponseModel } from '@app/constants/app.interface';
import { CommonMessage, RouterEnum } from '@app/constants/app.enums';
import { generate } from 'generate-password';
import { TokenRepository } from './token.repository';
import { expireInviteToken } from '@app/constants/app.magic-number';
import { UserRepository } from '../user/user.repository';
import { _salt } from '@app/constants/app.config';
import { RegisterDTO } from '../auth/auth.dto';
import { compareSync } from 'bcryptjs';

@Injectable()
export class AuthService {
  constructor(
    private _jwtService: JwtService,
    private _tokenRepository: TokenRepository,
    private _userRepository: UserRepository,
  ) {}

  public async createUser({ email, password, fullName }: Partial<RegisterDTO>): Promise<UserEntity> {
    try {
      const emailExists = await this._userRepository.findUserByEmail(email);
      if (emailExists) {
        throw new HttpException(httpEmailExists, HttpStatus.BAD_REQUEST);
      }
      const newUser = this._userRepository.create({ email, password, fullName, _salt });
      await this._userRepository.save(newUser);
      delete newUser.password;
      return newUser;
    } catch (error) {
      throw new HttpException(httpEmailExists, HttpStatus.BAD_REQUEST);
    }
  }

  public async authenticate({ email, password }: SignInDTO): Promise<AuthResponse> {
    try {
      const user = await this._userRepository.findUserByEmail(email);
      if (!user) {
        throw new BadRequestException();
      }
      const isMatchedPassword = await compareSync(password, user.password);
      if (!isMatchedPassword) {
        throw new BadRequestException(invalidCredential);
      }
      return await this.createBearerToken(user);
    } catch (error) {
      throw new UnauthorizedException(invalidCredential);
    }
  }

  public async validateUserFromJwtPayload(payload: JwtPayload): Promise<UserEntity | null> {
    try {
      const { id } = payload;
      const user = await this._userRepository.getUserByConditions(id);
      if (!user) {
        throw new UnauthorizedException();
      }
      return user;
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }

  public async createBearerToken(user: UserEntity): Promise<AuthResponse> {
    const token = await this._jwtService.sign({ id: user.id });
    return { token: `Bearer ${token}` };
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
        token = generate({ length: 30, numbers: true, lowercase: true, uppercase: true });
        await this._tokenRepository.updateToken(currentToken.id, { token: token, createdAt: new Date() });
      } else {
        // If token is expire
        token = currentToken.token;
      }
    }

    return {
      statusCode: HttpStatus.CREATED,
      message: CommonMessage.SUCCESS,
      data: {
        url: RouterEnum.FE_HOST_ROUTER + `/join/${token}`,
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
