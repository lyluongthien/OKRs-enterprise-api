import { ObjectLiteral } from 'typeorm';
import { Controller, Post, Body, UsePipes, Put, Param, Get, UseGuards, Query } from '@nestjs/common';
import { limitPagination, currentPage } from '@app/constants/app.magic-number';
import { ValidationPipe } from '@app/shared/pipes/validation.pipe';
import { Pagination } from 'nestjs-typeorm-paginate';

import { UserService } from './user.service';
import { ResetPasswordDTO, ChangePasswordDTO, UserDTO, UserProfileDTO } from './user.dto';
import { AuthenticationGuard } from '../auth/authentication.guard';
import { CurrentUser } from './user.decorator';
import { UserEntity } from '@app/db/entities/user.entity';

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
  public async getUserDetail(@Param('id') id: number): Promise<UserEntity> {
    return this._userService.getUserById(id);
  }

  @Get('me')
  @UseGuards(AuthenticationGuard)
  public async me(@CurrentUser() user: UserEntity): Promise<UserEntity> {
    return user;
  }

  @Post('reset-password')
  @UsePipes(new ValidationPipe())
  public async resetPassword(@Body() user: ResetPasswordDTO): Promise<void> {
    return this._userService.resetPassword(user);
  }

  @Put('/me/change-password/:id')
  @UsePipes(new ValidationPipe())
  public async changePassword(@Param('id') id: number, @Body() user: ChangePasswordDTO): Promise<ObjectLiteral> {
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
