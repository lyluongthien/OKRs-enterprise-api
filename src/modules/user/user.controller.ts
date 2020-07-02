import { Controller, Post, Body, UsePipes } from '@nestjs/common';
import { UserService } from './user.service';
import { ValidationPipe } from '@app/core/pipes/validation.pipe';
import { UserEntity } from '@app/db/entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { ObjectLiteral } from 'typeorm';
import { ResetPasswordDTO } from './dto/reset-password.dto';

@Controller()
export class UserController {
  constructor(private userService: UserService) {}

  @Post('auth/signin')
  @UsePipes(new ValidationPipe())
  private signIn(@Body() user: CreateUserDto): Promise<UserEntity> {
    return this.userService.signIn(user);
  }

  @Post('user/reset-password')
  @UsePipes(new ValidationPipe())
  private resetPassword(@Body() user: ResetPasswordDTO): Promise<ObjectLiteral> {
    return this.userService.resetPassword(user);
  }

  @Post('user/change-password')
  @UsePipes(new ValidationPipe())
  private changePassword(@Body() user: ResetPasswordDTO): Promise<ObjectLiteral> {
    return this.userService.resetPassword(user);
  }
}
