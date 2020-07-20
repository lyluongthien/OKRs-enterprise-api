import { Module } from '@nestjs/common';
import { JobController } from './job.controller';
import { JobService } from './job.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JobEntity } from '@app/db/entities/job.entity';
import { JobRepository } from './job.repository';
import { UserModule } from '../user/user.module';

@Module({
  imports: [UserModule, TypeOrmModule.forFeature([JobEntity, JobRepository])],
  controllers: [JobController],
  providers: [JobService],
})
export class JobModule {}
