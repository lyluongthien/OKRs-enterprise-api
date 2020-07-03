import { Repository, EntityRepository, ObjectLiteral } from 'typeorm';
import { JobEntity } from '@app/db/entities/job.entity';
import { JobDTO } from './job.dto';

@EntityRepository(JobEntity)
export class JobRepository extends Repository<JobEntity> {
  public async getListJob(): Promise<JobEntity[]> {
    return await this.find();
  }

  public async createJob(data: JobDTO): Promise<JobEntity> {
    return await this.save(data);
  }

  public async getJobDetail(id: number): Promise<JobEntity> {
    return await this.findOne({ where: { id } });
  }

  public async updateJob(id: number, data: Partial<JobDTO>): Promise<JobEntity> {
    await this.update({ id }, data);
    return await this.findOne({ id });
  }

  public async deleteJob(id: number): Promise<ObjectLiteral> {
    await this.delete({ id });
    return { isDeleted: true };
  }
}
