import { Module } from '@nestjs/common';
import { MetaController } from './meta.controller';
import { MetaService } from './meta.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JobRepository } from '../job/job.repository';
import { TeamRepository } from '../team/team.repository';
import { CycleRepository } from '../cycle/cycle.repository';
import { LessonRepository } from '../lesson/lesson.repository';
import { EvaluationCriteriaRepository } from '../evaluation-criteria/evaluation-criteria.repository';
import { RoleRepository } from '../role/role.repository';
import { UserRepository } from '../user/user.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      JobRepository,
      TeamRepository,
      CycleRepository,
      LessonRepository,
      EvaluationCriteriaRepository,
      RoleRepository,
      UserRepository,
    ]),
  ],
  controllers: [MetaController],
  providers: [MetaService],
})
export class MetaModule {}
