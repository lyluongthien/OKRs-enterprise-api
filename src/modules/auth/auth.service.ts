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
import { invalidCredential } from '@app/constants/app.exeption';
import { UserService } from '../user/user.service';
import { ResponseModel } from '@app/constants/app.interface';
import { CommonMessage, RouterEnum } from '@app/constants/app.enums';
import { generate } from 'generate-password';
import { TokenRepository } from './token.repository';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
    private _tokenRepository: TokenRepository,
  ) {}

  public async authenticate({ email, password }: SignInDTO): Promise<AuthResponse> {
    try {
      const user = await this.userService.getUserByEmail(email);
      if (!user) {
        throw new BadRequestException();
      }
      if (!user.comparePassword(password)) {
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
      const user = await this.userService.getUserById(id);
      if (!user) {
        throw new UnauthorizedException();
      }
      return user;
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }

  public async createBearerToken(user: UserEntity): Promise<AuthResponse> {
    const token = await this.jwtService.sign({ id: user.id });
    return { token };
  }

  public async generateInviteLink(): Promise<ResponseModel> {
    const token = generate({ length: 30, numbers: true, lowercase: true, uppercase: true });
    await this._tokenRepository.createToken(token);

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
    console.log(tokenEntity);
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
