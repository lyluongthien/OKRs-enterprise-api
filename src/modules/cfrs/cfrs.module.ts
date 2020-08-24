import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UserModule } from '@app/modules/user/user.module';
import { CFRsEntity } from '@app/db/entities/cfrs.entity';
import { CFRsRepository } from './cfrs.repository';
import { CFRsController } from './cfrs.controller';
import { CFRsService } from './cfrs.service';
import { CheckinRepository } from '../checkin/checkin.repository';
import { UserRepository } from '../user/user.repository';
import { EvaluationCriteriaRepository } from '../evaluation-criteria/evaluation-criteria.repository';
import { UserStarRepository } from '../user-star/user-star.repository';
import { CycleRepository } from '../cycle/cycle.repository';

@Module({
  imports: [
    UserModule,
    TypeOrmModule.forFeature([
      CFRsEntity,
      CFRsRepository,
      CheckinRepository,
      UserRepository,
      EvaluationCriteriaRepository,
      UserStarRepository,
      CycleRepository,
    ]),
  ],
  controllers: [CFRsController],
  providers: [CFRsService],
})
export class FeedbackModule {}
