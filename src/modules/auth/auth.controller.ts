import { Controller, Post, Body, ValidationPipe, Get } from '@nestjs/common';
import { ApiCreatedResponse, ApiOkResponse, ApiUnauthorizedResponse } from '@nestjs/swagger';

import { AuthService } from './auth.service';
import { RegisterDTO, SignInDTO } from './auth.dto';
import { AuthResponse } from './auth.interface';
import { UserService } from '../user/user.service';
import { ResponseModel } from '@app/constants/app.interface';

@Controller('auth')
export class AuthController {
  constructor(private readonly _authService: AuthService, private readonly userService: UserService) {}

  @Post('/signin')
  @ApiOkResponse({ description: 'Sign In with credentials' })
  @ApiUnauthorizedResponse({ description: 'Invalid credentials' })
  public async signIn(@Body(ValidationPipe) credentials: SignInDTO): Promise<AuthResponse> {
    return await this._authService.authenticate(credentials);
  }

  @Post('/register')
  @ApiCreatedResponse({ description: 'User Registration' })
  public async register(@Body(ValidationPipe) credentials: RegisterDTO): Promise<AuthResponse> {
    const user = await this.userService.createUser(credentials);
    return await this._authService.createBearerToken(user);
  }

  @Get()
  public async generateLinkInvite(): Promise<ResponseModel> {
    return this._authService.generateLinkInvite();
  }
}
