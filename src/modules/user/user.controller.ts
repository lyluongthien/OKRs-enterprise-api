import { ObjectLiteral } from 'typeorm';
import { Controller, Post, Body, UsePipes, Put, Param, Get, UseGuards, Query, ParseIntPipe } from '@nestjs/common';
import { limitPagination, currentPage } from '@app/constants/app.magic-number';
import { ValidationPipe } from '@app/shared/pipes/validation.pipe';

import { UserService } from './user.service';
import { ResetPasswordDTO, ChangePasswordDTO, UserDTO, UserProfileDTO } from './user.dto';
import { AuthenticationGuard } from '../auth/authentication.guard';
import { CurrentUser } from './user.decorator';
import { UserEntity } from '@app/db/entities/user.entity';
import { ResponseModel } from '@app/constants/app.interface';

@Controller('/api/v1/users')
export class UserController {
  constructor(private _userService: UserService) {}

  @Get('/active')
  @UseGuards(AuthenticationGuard)
  public async searchUsersActived(
    @Query('text') text: string,
    @Query('page') page: number,
    @Query('limit') limit: number,
  ): Promise<ResponseModel> {
    page = page ? page : currentPage;
    limit = limit ? limit : limitPagination;
    if (text) {
      return this._userService.searchUsersActived(text, {
        page,
        limit,
        route: '',
      });
    }
    return this._userService.getUsersActived({
      page,
      limit,
      route: '',
    });
  }
  @Get('/pending')
  @UseGuards(AuthenticationGuard)
  public async searchUsersAprroved(
    @Query('text') text: string,
    @Query('page') page: number,
    @Query('limit') limit: number,
  ): Promise<ResponseModel> {
    page = page ? page : currentPage;
    limit = limit ? limit : limitPagination;
    if (text) {
      return this._userService.searchUsersApproved(text, {
        page,
        limit,
        route: '',
      });
    }
    return this._userService.getUsersApproved({
      page,
      limit,
      route: '',
    });
  }
  @Get('/deactive')
  @UseGuards(AuthenticationGuard)
  public async searchUsersDeactived(
    @Query('text') text: string,
    @Query('page') page: number,
    @Query('limit') limit: number,
  ): Promise<ResponseModel> {
    page = page ? page : currentPage;
    limit = limit ? limit : limitPagination;
    if (text) {
      return this._userService.searchUsersDeactived(text, {
        page,
        limit,
        route: '',
      });
    }
    return this._userService.getUsersDeactived({
      page,
      limit,
      route: '',
    });
  }

  @Get('me')
  @UseGuards(AuthenticationGuard)
  public async me(@CurrentUser() user: UserEntity): Promise<any> {
    return this._userService.getUserDetail(user.id);
  }

  @Post('me/logout')
  @UseGuards(AuthenticationGuard)
  public async logout(@CurrentUser() user: UserEntity): Promise<ResponseModel> {
    return await this._userService.logout(user.id);
  }

  @Get(':id')
  @UseGuards(AuthenticationGuard)
  public async getUserDetail(@Param('id', ParseIntPipe) id: number): Promise<ResponseModel> {
    return this._userService.getUserDetail(id);
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
  @UseGuards(AuthenticationGuard)
  @UsePipes(new ValidationPipe())
  public async changePassword(@Param('id') id: number, @Body() user: ChangePasswordDTO): Promise<ResponseModel> {
    return this._userService.changePassword(id, user);
  }

  @Put('reject-request/:id')
  @UseGuards(AuthenticationGuard)
  @UsePipes(new ValidationPipe())
  public async rejectRequest(@Param('id') id: number): Promise<ObjectLiteral> {
    return this._userService.rejectRequest(id);
  }

  @Put(':id')
  @UseGuards(AuthenticationGuard)
  public updateUserInfo(@Param('id') id: number, @Body() data: UserDTO): Promise<ObjectLiteral> {
    return this._userService.updateUserInfor(id, data);
  }

  @Post('me')
  @UseGuards(AuthenticationGuard)
  public updateUserProfile(@Param('id') id: number, @Body() data: UserProfileDTO): Promise<ObjectLiteral> {
    return this._userService.updateUserProfile(id, data);
  }
}
