import { Module } from '@nestjs/common';
import { UserStarController } from './user-star.controller';
import { UserStarService } from './user-star.service';

@Module({
  controllers: [UserStarController],
  providers: [UserStarService],
})
export class UserStarModule {}
