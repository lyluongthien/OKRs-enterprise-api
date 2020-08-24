import { Module } from '@nestjs/common';
import { RecognitionController } from './recognition.controller';
import { RecognitionService } from './recognition.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CFRsEntity } from '@app/db/entities/cfrs.entity';
import { RecognitionRepository } from './recognition.repository';
import { UserModule } from '../user/user.module';
import { EvaluationCriteriaRepository } from '../evaluation-criteria/evaluation-criteria.repository';
import { CycleRepository } from '../cycle/cycle.repository';
import { UserStarRepository } from '../user-star/user-star.repository';

@Module({
  imports: [
    UserModule,
    TypeOrmModule.forFeature([
      CFRsEntity,
      RecognitionRepository,
      EvaluationCriteriaRepository,
      CycleRepository,
      UserStarRepository,
    ]),
  ],
  controllers: [RecognitionController],
  providers: [RecognitionService],
})
export class RecognitionModule {}
