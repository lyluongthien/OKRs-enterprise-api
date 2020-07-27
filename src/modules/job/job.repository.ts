import { Repository, EntityRepository, ObjectLiteral } from 'typeorm';
import { JobEntity } from '@app/db/entities/job.entity';
import { JobDTO } from './job.dto';
import { DATABASE_EXCEPTION } from '@app/constants/app.exeption';
import { HttpException } from '@nestjs/common';

@EntityRepository(JobEntity)
export class JobRepository extends Repository<JobEntity> {
  public async getListJob(): Promise<JobEntity[]> {
    try {
      return await this.find();
    } catch (error) {
      throw new HttpException(DATABASE_EXCEPTION.message, DATABASE_EXCEPTION.statusCode);
    }
  }

  public async createJob(data: JobDTO): Promise<JobEntity> {
    try {
      return await this.save(data);
    } catch (error) {
      throw new HttpException(DATABASE_EXCEPTION.message, DATABASE_EXCEPTION.statusCode);
    }
  }

  public async getJobDetail(id: number): Promise<JobEntity> {
    try {
      return await this.findOne({ where: { id } });
    } catch (error) {
      throw new HttpException(DATABASE_EXCEPTION.message, DATABASE_EXCEPTION.statusCode);
    }
  }

  public async updateJob(id: number, data: Partial<JobDTO>): Promise<JobEntity> {
    try {
      await this.update({ id }, data);
      return await this.findOne({ id });
    } catch (error) {
      throw new HttpException(DATABASE_EXCEPTION.message, DATABASE_EXCEPTION.statusCode);
    }
  }

  public async deleteJob(id: number): Promise<ObjectLiteral> {
    try {
      await this.delete({ id });
      return { isDeleted: true };
    } catch (error) {
      throw new HttpException(DATABASE_EXCEPTION.message, DATABASE_EXCEPTION.statusCode);
    }
  }
}
