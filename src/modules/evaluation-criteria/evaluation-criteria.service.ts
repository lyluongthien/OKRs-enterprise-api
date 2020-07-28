import { Injectable, HttpStatus } from '@nestjs/common';
import { paginate, IPaginationOptions } from 'nestjs-typeorm-paginate';

import { EvaluationCriteriaEntity } from '@app/db/entities/evaluation-criteria.entity';
import { EvaluationCriteriaRepository } from './evaluation-criteria.repository';
import { EvaluationDTO } from './evaluation-criteria.dto';
import { ResponseModel } from '@app/constants/app.interface';
import { CommonMessage } from '@app/constants/app.enums';

@Injectable()
export class EvaluationCriteriaService {
  constructor(private _evaluationCriteriaRepository: EvaluationCriteriaRepository) {}

  public async getEvaluationCriterias(options: IPaginationOptions): Promise<ResponseModel> {
    const data = await paginate<EvaluationCriteriaEntity>(this._evaluationCriteriaRepository, options);
    return {
      statusCode: HttpStatus.OK,
      message: CommonMessage.SUCCESS,
      data: data,
    };
  }

  public async createCriteria(evaluationDTO: EvaluationDTO): Promise<ResponseModel> {
    const data = await this._evaluationCriteriaRepository.createCriteria(evaluationDTO);
    return {
      statusCode: HttpStatus.CREATED,
      message: CommonMessage.SUCCESS,
      data: data,
    };
  }

  public async getCriteriaDetail(id: number): Promise<ResponseModel> {
    const data = await this._evaluationCriteriaRepository.getCriteriaDetail(id);
    return {
      statusCode: HttpStatus.OK,
      message: CommonMessage.SUCCESS,
      data: data,
    };
  }

  public async updateCriteria(id: number, evaluationDTO: Partial<EvaluationDTO>): Promise<ResponseModel> {
    const data = await this._evaluationCriteriaRepository.updateCriteria(id, evaluationDTO);
    return {
      statusCode: HttpStatus.OK,
      message: CommonMessage.SUCCESS,
      data: data,
    };
  }

  public async deleteCriteria(id: number): Promise<ResponseModel> {
    const data = await this._evaluationCriteriaRepository.deleteCriteria(id);
    return {
      statusCode: HttpStatus.OK,
      message: CommonMessage.SUCCESS,
      data: data,
    };
  }
}
