import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UserModule } from '@app/modules/user/user.module';
import { FeedbackEntity } from '@app/db/entities/feedback.entity';
import { FeedbackRepository } from './feedback.repository';
import { FeedbackController } from './feedback.controller';
import { FeedbackService } from './feedback.service';
import { CheckinRepository } from '../checkin/checkin.repository';
import { UserRepository } from '../user/user.repository';

@Module({
  imports: [
    UserModule,
    TypeOrmModule.forFeature([FeedbackEntity, FeedbackRepository, CheckinRepository, UserRepository]),
  ],
  controllers: [FeedbackController],
  providers: [FeedbackService],
})
export class FeedbackModule {}
