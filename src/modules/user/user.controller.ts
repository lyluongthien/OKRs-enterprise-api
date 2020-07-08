import { Controller, Post, Body, UsePipes, Put, Param, Get } from '@nestjs/common';
import { ObjectLiteral } from 'typeorm';

import { UserEntity } from '@app/db/entities/user.entity';
import { ValidationPipe } from '@app/core/pipes/validation.pipe';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { ResetPasswordDTO } from './dto/reset-password.dto';
import { ChangePasswordDTO } from './dto/change-password.dto';

@Controller('users')
export class UserController {
  constructor(private userService: UserService) {}

  @Get()
  private getUsers(): Promise<UserEntity[]> {
    return this.userService.getUsers();
  }

  @Get(':id')
  private getUserDetail(@Param('id') id: number): Promise<UserEntity[]> {
    return this.userService.getUserDetail(id);
  }

  @Post('auth/signup')
  @UsePipes(new ValidationPipe())
  private signup(@Body() user: CreateUserDto): Promise<UserEntity> {
    return this.userService.signUp(user);
  }

  @Post('reset-password')
  @UsePipes(new ValidationPipe())
  private resetPassword(@Body() user: ResetPasswordDTO): Promise<ObjectLiteral> {
    return this.userService.resetPassword(user);
  }

  @Put('change-password/:id')
  @UsePipes(new ValidationPipe())
  private changePassword(@Param('id') id: number, @Body() user: ChangePasswordDTO): Promise<ObjectLiteral> {
    return this.userService.changePassword(id, user);
  }

  @Put('reject-request/:id')
  @UsePipes(new ValidationPipe())
  private rejectRequest(@Param('id') id: number): Promise<ObjectLiteral> {
    return this.userService.rejectRequest(id);
  }
}
