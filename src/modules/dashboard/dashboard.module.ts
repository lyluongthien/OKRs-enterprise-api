import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { DashboardController } from './dashboard.controller';
import { DashboardService } from './dashboard.service';
import { UserModule } from '../user/user.module';
import { FeedbackRepository } from '../feedback/feedback.repository';

@Module({
  imports: [UserModule, TypeOrmModule.forFeature([FeedbackRepository])],
  controllers: [DashboardController],
  providers: [DashboardService],
})
export class DashboardModule {}
