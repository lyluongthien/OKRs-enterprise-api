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

  public async createJob(data: JobDTO): Promise<ResponseModel> {
    const datas = await this.jobRepository.createJob(data);
    return {
      statusCode: HttpStatus.OK,
      message: CommonMessage.SUCCESS,
      data: datas,
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

  public async updateJob(id: number, data: Partial<JobDTO>): Promise<ResponseModel> {
    const datas = await this.jobRepository.updateJob(id, data);
    return {
      statusCode: HttpStatus.OK,
      message: CommonMessage.SUCCESS,
      data: datas,
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
