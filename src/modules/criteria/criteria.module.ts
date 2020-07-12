import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { CriteriaController } from './criteria.controller';
import { CriteriaService } from './criteria.service';
import { EvaluationCriteriaEntity } from '@app/db/entities/evaluation-criteria.entity';
import { CriteriaRepository } from './criteria.repository';

@Module({
  imports: [TypeOrmModule.forFeature([EvaluationCriteriaEntity, CriteriaRepository])],
  controllers: [CriteriaController],
  providers: [CriteriaService],
})
export class CriteriaModule {}
