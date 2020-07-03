import { Module } from '@nestjs/common';
import { JobController } from './job.controller';
import { JobService } from './job.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JobEntity } from '@app/db/entities/job.entity';
import { JobRepository } from './job.repository';

@Module({
  imports: [TypeOrmModule.forFeature([JobEntity, JobRepository])],
  controllers: [JobController],
  providers: [JobService],
})
export class JobModule {}
