import { Module } from '@nestjs/common';
import { UserStarController } from './user-star.controller';
import { UserStarService } from './user-star.service';
import { UserModule } from '../user/user.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserStarEntity } from '@app/db/entities/user-stars.entity';
import { UserStarRepository } from './user-star.repository';

@Module({
  imports: [UserModule, TypeOrmModule.forFeature([UserStarEntity, UserStarRepository])],
  controllers: [UserStarController],
  providers: [UserStarService],
})
export class UserStarModule {}
