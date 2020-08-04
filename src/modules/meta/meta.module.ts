import { Module } from '@nestjs/common';
import { MetaController } from './meta.controller';
import { MetaService } from './meta.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JobRepository } from '../job/job.repository';
import { TeamRepository } from '../team/team.repository';
import { CycleRepository } from '../cycle/cycle.repository';
import { LessonRepository } from '../lesson/lesson.repository';

@Module({
  imports: [TypeOrmModule.forFeature([JobRepository, TeamRepository, CycleRepository, LessonRepository])],
  controllers: [MetaController],
  providers: [MetaService],
})
export class MetaModule {}
