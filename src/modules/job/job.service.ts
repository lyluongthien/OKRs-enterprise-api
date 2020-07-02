import { Injectable } from '@nestjs/common';
import { JobEntity } from '@app/db/entities/job.entity';
import { JobRepository } from './job.repository';
import { jobDTO } from './job.dto';
import { ObjectLiteral } from 'typeorm';

@Injectable()
export class JobService {
  constructor(private jobRepository: JobRepository) {}

  public getListJob(): Promise<JobEntity[]> {
    return this.jobRepository.getListJob();
  }

  public createJob(data: jobDTO): Promise<JobEntity> {
    return this.jobRepository.createJob(data);
  }

  public getJobDetail(id: number): Promise<JobEntity> {
    return this.jobRepository.getJobDetail(id);
  }

  public updateJob(id: number, data: Partial<jobDTO>): Promise<JobEntity> {
    return this.jobRepository.updateJob(id, data);
  }

  public deleteJob(id: number): Promise<ObjectLiteral> {
    return this.jobRepository.deleteJob(id);
  }
}
