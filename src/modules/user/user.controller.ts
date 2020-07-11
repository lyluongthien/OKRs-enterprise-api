import { Controller, Post, Body, UsePipes, Put, Param, Get, UseGuards, ParseIntPipe } from '@nestjs/common';
import { ObjectLiteral } from 'typeorm';

import { UserService } from './user.service';
import { ResetPasswordDTO, ChangePasswordDTO } from './user.dto';
import { ValidationPipe } from '@app/shared/pipes/validation.pipe';
import { AuthenticationGuard } from '../auth/authentication.guard';
import { CurrentUser } from './user.decorator';
import { UserEntity } from '@app/db/entities/user.entity';

@Controller('/api/v1/users')
export class UserController {
  constructor(private _userService: UserService) {}

  @Get()
  public getUsers(): Promise<UserEntity[]> {
    return this._userService.getUsers();
  }

  @Get('me')
  @UseGuards(AuthenticationGuard)
  public me(@CurrentUser() user: UserEntity): UserEntity {
    return user;
  }

  @Post('reset-password')
  @UsePipes(new ValidationPipe())
  public resetPassword(@Body() user: ResetPasswordDTO): Promise<void> {
    return this._userService.resetPassword(user);
  }

  @Put('/me/change-password/:id')
  @UsePipes(new ValidationPipe())
  public changePassword(@Param('id') id: number, @Body() user: ChangePasswordDTO): Promise<ObjectLiteral> {
    return this._userService.changePassword(id, user);
  }

  @Put('reject-request/:id')
  @UsePipes(new ValidationPipe())
  public rejectRequest(@Param('id') id: number): Promise<ObjectLiteral> {
    return this._userService.rejectRequest(id);
  }

  /**
   * @description: Generate link, when user get generated link then access to system
   */
  @Get('/invite-link')
  public generateLinkInvite(): Promise<ObjectLiteral> {
    return this._userService.genInviteLink();
  }

  @Get(':id')
  public getUserDetail(@Param('id', ParseIntPipe) id: number): Promise<UserEntity> {
    return this._userService.getUserDetail(id);
  }
}
