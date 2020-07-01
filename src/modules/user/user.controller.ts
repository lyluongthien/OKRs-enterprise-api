import { Controller, Post, Body, UsePipes } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UserService } from './user.service';
import { ValidationPipe } from '@app/core/pipes/validation.pipe';
import { UserEntity } from '@app/db/entities/user.entity';

@Controller()
export class UserController {
  constructor(private userService: UserService) {}

  @Post('auth/signin')
  @UsePipes(new ValidationPipe())
  signIn(@Body() user: CreateUserDto): Promise<UserEntity> {
    return this.userService.signIn(user);
  }
}
