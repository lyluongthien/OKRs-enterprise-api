import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UserEntity } from '@app/db/entities/user.entity';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { UserRepository } from './user.repository';
import { PasswordController } from './password.controller';
import { MulterModule } from '@nestjs/platform-express';
import { UploadImageController } from './upload.image.controller';

@Module({
  imports: [MulterModule, TypeOrmModule.forFeature([UserEntity, UserRepository])],
  controllers: [UserController, PasswordController, UploadImageController],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
