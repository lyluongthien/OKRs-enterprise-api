import { Controller, Post, Body, ValidationPipe, Get, Param, UseGuards } from '@nestjs/common';
import { ApiCreatedResponse, ApiOkResponse, ApiUnauthorizedResponse, ApiBadRequestResponse } from '@nestjs/swagger';

import { AuthService } from './auth.service';
import { RegisterDTO, SignInDTO } from './auth.dto';
import { ResponseModel } from '@app/constants/app.interface';
import { AuthenticationGuard } from './authentication.guard';
import { AuthorizationGuard } from './authorization.guard';
import { Roles } from '../role/role.decorator';
import { RoleEnum } from '@app/constants/app.enums';

@Controller('/api/v1/auth')
export class AuthController {
  constructor(private readonly _authService: AuthService) {}

  @Post('/login')
  @ApiOkResponse({ description: 'Sign In with credentials' })
  @ApiUnauthorizedResponse({ description: 'Invalid credentials' })
  public async login(@Body(ValidationPipe) credentials: SignInDTO): Promise<ResponseModel> {
    return await this._authService.authenticate(credentials);
  }

  @Post('/register')
  @ApiCreatedResponse({ description: 'User Registration' })
  public async register(@Body(ValidationPipe) credentials: RegisterDTO): Promise<ResponseModel> {
    const user = await this._authService.createUser(credentials);
    return await this._authService.createBearerToken(user);
  }

  /**
   * @description: Generate a link, user can access this link to register an account
   */
  @Get('/verification/:token')
  @ApiOkResponse({ description: 'Valid token' })
  @ApiBadRequestResponse({ description: 'Bad request' })
  public async verifyLinkInvite(@Param('token') token: string): Promise<ResponseModel> {
    return this._authService.verifyLinkInvite(token);
  }

  /**
   * @description: Generate a link, user can access this link to register an account
   */
  @Get('/link_invite')
  @UseGuards(AuthenticationGuard, AuthorizationGuard)
  @Roles(RoleEnum.HR, RoleEnum.ADMIN)
  @ApiOkResponse({ description: 'Success' })
  @ApiBadRequestResponse({ description: 'Bad request' })
  public async generateInviteLink(): Promise<ResponseModel> {
    return this._authService.generateInviteLink();
  }
}
