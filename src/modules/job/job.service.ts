import { Injectable, HttpStatus } from '@nestjs/common';
import { JobRepository } from './job.repository';
import { JobDTO } from './job.dto';
import { CommonMessage } from '@app/constants/app.enums';
import { ResponseModel } from '@app/constants/app.interface';

@Injectable()
export class JobService {
  constructor(private jobRepository: JobRepository) {}

  public async getListJob(): Promise<ResponseModel> {
    const data = await this.jobRepository.getListJob();
    return {
      statusCode: HttpStatus.OK,
      message: CommonMessage.SUCCESS,
      data: data,
    };
  }

  public async createJob(jobDTO: JobDTO): Promise<ResponseModel> {
    const data = await this.jobRepository.createJob(jobDTO);
    return {
      statusCode: HttpStatus.CREATED,
      message: CommonMessage.SUCCESS,
      data: data,
    };
  }

  public async getJobDetail(id: number): Promise<ResponseModel> {
    const data = await this.jobRepository.getJobDetail(id);
    return {
      statusCode: HttpStatus.OK,
      message: CommonMessage.SUCCESS,
      data: data,
    };
  }

  public async updateJob(id: number, jobDTO: Partial<JobDTO>): Promise<ResponseModel> {
    const data = await this.jobRepository.updateJob(id, jobDTO);
    return {
      statusCode: HttpStatus.OK,
      message: CommonMessage.SUCCESS,
      data: data,
    };
  }

  public async deleteJob(id: number): Promise<ResponseModel> {
    const data = await this.jobRepository.deleteJob(id);
    return {
      statusCode: HttpStatus.OK,
      message: CommonMessage.SUCCESS,
      data: data,
    };
  }
}
