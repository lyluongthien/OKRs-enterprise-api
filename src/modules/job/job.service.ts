import { Injectable, HttpStatus, HttpException } from '@nestjs/common';
import { JobRepository } from './job.repository';
import { JobDTO, updateJobDTO } from './job.dto';
import { CommonMessage } from '@app/constants/app.enums';
import { ResponseModel } from '@app/constants/app.interface';
import { IPaginationOptions } from 'nestjs-typeorm-paginate';
import { JOB_EXIST } from '@app/constants/app.exeption';

@Injectable()
export class JobService {
  constructor(private _jobRepository: JobRepository) {}

  public async getListJob(): Promise<ResponseModel> {
    const data = await this._jobRepository.getListJob();
    return {
      statusCode: HttpStatus.OK,
      message: CommonMessage.SUCCESS,
      data: data,
    };
  }

  public async getJobs(options: IPaginationOptions): Promise<ResponseModel> {
    const data = await this._jobRepository.getJobs(options);
    return {
      statusCode: HttpStatus.OK,
      message: CommonMessage.SUCCESS,
      data: data,
    };
  }

  public async searchJob(text: string, options: IPaginationOptions): Promise<ResponseModel> {
    const data = await this._jobRepository.searchJob(text, options);
    return {
      statusCode: HttpStatus.OK,
      message: CommonMessage.SUCCESS,
      data: data,
    };
  }
  public async createJob(jobDTO: JobDTO): Promise<ResponseModel> {
    const jobs = await this._jobRepository.getListJob();
    const checkJobExist = (jobParam) => jobs.some(({ name }) => name == jobParam);
    if (checkJobExist(jobDTO.name)) {
      throw new HttpException(JOB_EXIST.message, JOB_EXIST.statusCode);
    }
    const data = await this._jobRepository.createJob(jobDTO);
    return {
      statusCode: HttpStatus.CREATED,
      message: CommonMessage.SUCCESS,
      data: data,
    };
  }

  public async getJobDetail(id: number): Promise<ResponseModel> {
    const data = await this._jobRepository.getJobDetail(id);
    return {
      statusCode: HttpStatus.OK,
      message: CommonMessage.SUCCESS,
      data: data,
    };
  }

  public async updateJob(id: number, jobDTO: Partial<updateJobDTO>): Promise<ResponseModel> {
    const jobs = await this._jobRepository.getListJob();
    const checkJobExist = (jobParam) => jobs.some(({ name }) => name == jobParam);
    if (checkJobExist(jobDTO.name)) {
      throw new HttpException(JOB_EXIST.message, JOB_EXIST.statusCode);
    }
    const data = await this._jobRepository.updateJob(id, jobDTO);
    return {
      statusCode: HttpStatus.OK,
      message: CommonMessage.SUCCESS,
      data: data,
    };
  }

  public async deleteJob(id: number): Promise<ResponseModel> {
    const data = await this._jobRepository.deleteJob(id);
    return {
      statusCode: HttpStatus.OK,
      message: CommonMessage.SUCCESS,
      data: data,
    };
  }
}
