import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UserEntity } from '@app/db/entities/user.entity';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { UserRepository } from './user.repository';
import { ObjectiveRepository } from '../objective/objective.repository';
import { PasswordController } from './password.controller';
import { MulterModule } from '@nestjs/platform-express';
import { UploadImageController } from './upload.image.controller';
import { CheckinRepository } from '../checkin/checkin.repository';

@Module({
  imports: [
    MulterModule,
    TypeOrmModule.forFeature([UserEntity, UserRepository, ObjectiveRepository, CheckinRepository]),
  ],
  controllers: [UserController, PasswordController, UploadImageController],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
