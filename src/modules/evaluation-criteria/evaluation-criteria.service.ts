import { Injectable, HttpStatus, HttpException } from '@nestjs/common';
import { IPaginationOptions } from 'nestjs-typeorm-paginate';

import { EvaluationCriteriaRepository } from './evaluation-criteria.repository';
import { EvaluationDTO } from './evaluation-criteria.dto';
import { ResponseModel } from '@app/constants/app.interface';
import { CommonMessage } from '@app/constants/app.enums';
import { EVALUATION_CRITERIA_EXIST } from '@app/constants/app.exeption';

@Injectable()
export class EvaluationCriteriaService {
  constructor(private _evaluationCriteriaRepository: EvaluationCriteriaRepository) {}

  public async getEvaluationCriterias(options: IPaginationOptions): Promise<ResponseModel> {
    const data = await this._evaluationCriteriaRepository.getEvaluationCriterias(options);
    return {
      statusCode: HttpStatus.OK,
      message: CommonMessage.SUCCESS,
      data: data,
    };
  }

  public async createCriteria(evaluationDTO: EvaluationDTO): Promise<ResponseModel> {
    const data = await this._evaluationCriteriaRepository.createCriteria(evaluationDTO);
    const evaluationCriterias = await this._evaluationCriteriaRepository.getList();
    const checkCriteriaExist = (criteriaParam) => evaluationCriterias.some(({ content }) => content == criteriaParam);
    if (checkCriteriaExist(evaluationDTO.content)) {
      throw new HttpException(EVALUATION_CRITERIA_EXIST.message, EVALUATION_CRITERIA_EXIST.statusCode);
    }
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
    const evaluationCriterias = await this._evaluationCriteriaRepository.getList();
    const checkCriteriaExist = (criteriaParam) => evaluationCriterias.some(({ content }) => content == criteriaParam);
    if (checkCriteriaExist(evaluationDTO.content)) {
      throw new HttpException(EVALUATION_CRITERIA_EXIST.message, EVALUATION_CRITERIA_EXIST.statusCode);
    }
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
