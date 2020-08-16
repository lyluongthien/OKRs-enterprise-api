import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { DashboardController } from './dashboard.controller';
import { DashboardService } from './dashboard.service';
import { UserModule } from '../user/user.module';
import { FeedbackRepository } from '../feedback/feedback.repository';
import { UserRepository } from '../user/user.repository';
import { ObjectiveRepository } from '../objective/objective.repository';
import { RecognitionRepository } from '../recognition/recognition.repository';
import { RoleRepository } from '../role/role.repository';
import { CheckinRepository } from '../checkin/checkin.repository';

@Module({
  imports: [
    UserModule,
    TypeOrmModule.forFeature([
      FeedbackRepository,
      UserRepository,
      ObjectiveRepository,
      RecognitionRepository,
      RoleRepository,
      CheckinRepository,
    ]),
  ],
  controllers: [DashboardController],
  providers: [DashboardService],
})
export class DashboardModule {}
