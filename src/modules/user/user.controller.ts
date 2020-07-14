import { ObjectLiteral } from 'typeorm';
import { Controller, Post, Body, UsePipes, Put, Param, Get, UseGuards, Query } from '@nestjs/common';
import { UserService } from './user.service';
import { ResetPasswordDTO, ChangePasswordDTO, UserDTO, UserProfileDTO } from './user.dto';
import { ValidationPipe } from '@app/shared/pipes/validation.pipe';
import { AuthenticationGuard } from '../auth/authentication.guard';
import { CurrentUser } from './user.decorator';
import { UserEntity } from '@app/db/entities/user.entity';
import { Pagination } from 'nestjs-typeorm-paginate';
import { limitPagination, currentPage } from '@app/constants/app.magic-number';

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

  @Get(':id')
  public async getUserDetail(@Param('id') id: number): Promise<UserEntity> {
    return this._userService.getUserById(id);
  }

  @Get('me')
  @UseGuards(AuthenticationGuard)
  public async me(@CurrentUser() user: UserEntity): Promise<UserEntity> {
    return user;
  }

  @Get('password/verification')
  public async verifyForgotPassword(@Query('token') token: string): Promise<ObjectLiteral> {
    return this._userService.verifyForgotPassword(token);
  }

  @Post('password/forgot')
  @UsePipes(new ValidationPipe())
  public async forgetPassword(@Body() user: ResetPasswordDTO): Promise<void> {
    return this._userService.forgetPassword(user);
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
