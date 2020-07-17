import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UserEntity } from '@app/db/entities/user.entity';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { UserRepository } from './user.repository';
import { PasswordController } from './password.controller';

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity, UserRepository])],
  controllers: [UserController, PasswordController],
  providers: [UserService],
  // exports: [UserService, UserRepository],
})
export class UserModule {}
