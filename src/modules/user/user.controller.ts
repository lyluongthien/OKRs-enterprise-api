import { Controller, Post, Body, UsePipes } from '@nestjs/common';
import { UserService } from './user.service';
import { ValidationPipe } from '@app/core/pipes/validation.pipe';
import { UserEntity } from '@app/db/entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';

@Controller()
export class UserController {
  constructor(private userService: UserService) {}

  @Post('auth/signin')
  @UsePipes(new ValidationPipe())
  signIn(@Body() user: CreateUserDto): Promise<UserEntity> {
    return this.userService.signIn(user);
  }
}
