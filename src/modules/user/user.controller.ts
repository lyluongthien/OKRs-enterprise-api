import { Controller, Post, Body, UsePipes, Put, Param, Get, UseGuards, Query } from '@nestjs/common';
import { ObjectLiteral } from 'typeorm';

import { limitPagination, currentPage } from '@app/constants/app.magic-number';
import { ValidationPipe } from '@app/shared/pipes/validation.pipe';
import { Pagination } from 'nestjs-typeorm-paginate';

import { UserService } from './user.service';
import { ResetPasswordDTO, ChangePasswordDTO, UserDTO, UserProfileDTO } from './user.dto';
import { AuthenticationGuard } from '../auth/authentication.guard';
import { CurrentUser } from './user.decorator';
import { UserEntity } from '@app/db/entities/user.entity';
import { ResponseModel } from '@app/constants/app.interface';

@Controller('/api/v1/users')
export class UserController {
  constructor(private _userService: UserService) {}

  @Get()
  public async getUsers(@Query('page') page: number, @Query('limit') limit: number): Promise<Pagination<UserEntity>> {
    page = page ? page : currentPage;
    limit = limit ? limit : limitPagination;
    return this._userService.getUsers({
      page,
      limit,
      route: '',
    });
  }

  @Get('/search')
  public async searchUsers(
    @Query('text') text: string,
    @Query('page') page: number,
    @Query('limit') limit: number,
  ): Promise<Pagination<UserEntity>> {
    page = page ? page : currentPage;
    limit = limit ? limit : limitPagination;
    return this._userService.searchUsers(text, {
      page,
      limit,
      route: '',
    });
  }

  @Get(':id')
  public async getUserDetail(@Param('id') id: number): Promise<ResponseModel> {
    return this._userService.getUserDetail(id);
  }

  @Get('me')
  @UseGuards(AuthenticationGuard)
  public async me(@CurrentUser() user: UserEntity): Promise<UserEntity> {
    return user;
  }

  /**
   * @description: Verify token in links
   */
  @Get('password/verification')
  public async verifyForgotPassword(@Query('token') token: string): Promise<ObjectLiteral> {
    return this._userService.verifyForgetPassword(token);
  }

  /**
   * @description: Send mail to user a links, then use this link to reset password
   */
  @Post('password/forget')
  @UsePipes(new ValidationPipe())
  public async forgetPassword(@Body() user: ResetPasswordDTO): Promise<ResponseModel> {
    return this._userService.forgetPassword(user);
  }

  /**
   * @description: Save new password of user
   */
  @Put('password/reset:token')
  @UsePipes(new ValidationPipe())
  public async resetPassword(@Param('token') token: string, @Body() data: ChangePasswordDTO): Promise<ResponseModel> {
    return this._userService.resetPassword(token, data);
  }

  @Put('/me/change-password/:id')
  @UsePipes(new ValidationPipe())
  public async changePassword(@Param('id') id: number, @Body() user: ChangePasswordDTO): Promise<ResponseModel> {
    return this._userService.changePassword(id, user);
  }

  @Put('reject-request/:id')
  @UsePipes(new ValidationPipe())
  public async rejectRequest(@Param('id') id: number): Promise<ObjectLiteral> {
    return this._userService.rejectRequest(id);
  }

  @Put(':id')
  public updateUserInfo(@Param('id') id: number, @Body() data: UserDTO): Promise<ObjectLiteral> {
    return this._userService.updateUserInfor(id, data);
  }

  @Post('me')
  public updateUserProfile(@Param('id') id: number, @Body() data: UserProfileDTO): Promise<ObjectLiteral> {
    return this._userService.updateUserProfile(id, data);
  }
}
