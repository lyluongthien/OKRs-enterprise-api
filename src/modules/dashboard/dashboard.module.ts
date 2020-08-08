import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { DashboardController } from './dashboard.controller';
import { DashboardService } from './dashboard.service';
import { UserModule } from '../user/user.module';
import { FeedbackRepository } from '../feedback/feedback.repository';
import { UserRepository } from '../user/user.repository';
import { ObjectiveRepository } from '../objective/objective.repository';

@Module({
  imports: [UserModule, TypeOrmModule.forFeature([FeedbackRepository, UserRepository, ObjectiveRepository])],
  controllers: [DashboardController],
  providers: [DashboardService],
})
export class DashboardModule {}
