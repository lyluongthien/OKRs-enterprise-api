import { Repository, EntityRepository, ObjectLiteral } from 'typeorm';
import { JobEntity } from '@app/db/entities/job.entity';
import { jobDTO } from './job.dto';

@EntityRepository(JobEntity)
export class JobRepository extends Repository<JobEntity> {
  public getListJob = async (): Promise<JobEntity[]> => {
    return await this.find();
  };

  public createJob = async (data: jobDTO): Promise<JobEntity> => {
    return await this.save(data);
  };

  public getJobDetail = async (id: number): Promise<JobEntity> => {
    return this.findOne({ where: { id } });
  };

  public updateJob = async (id: number, data: Partial<jobDTO>): Promise<JobEntity> => {
    await this.update({ id }, data);
    return this.findOne({ id });
  };

  public deleteJob = async (id: number): Promise<ObjectLiteral> => {
    await this.delete({ id });
    return { isDeleted: true };
  };
}
