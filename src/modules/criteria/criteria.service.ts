import { Injectable } from '@nestjs/common';
import { ObjectLiteral } from 'typeorm';
import { paginate, Pagination, IPaginationOptions } from 'nestjs-typeorm-paginate';

import { EvaluationCriteriaEntity } from '@app/db/entities/evaluation-criteria.entity';
import { CriteriaRepository } from './criteria.repository';
import { CriteriaDTO } from './criteria.dto';

@Injectable()
export class CriteriaService {
  constructor(private _criteriaRepository: CriteriaRepository) {}

  public getListCriteria(): Promise<EvaluationCriteriaEntity[]> {
    return this._criteriaRepository.getList();
  }
  public getCriteriaByPage(options: IPaginationOptions): Promise<Pagination<EvaluationCriteriaEntity>> {
    return paginate<EvaluationCriteriaEntity>(this._criteriaRepository, options);
  }

  public createCriteria(data: CriteriaDTO): Promise<EvaluationCriteriaEntity> {
    return this._criteriaRepository.createCriteria(data);
  }

  public getCriteriaDetail(id: number): Promise<EvaluationCriteriaEntity> {
    return this._criteriaRepository.getCriteriaDetail(id);
  }

  public updateCriteria(id: number, data: Partial<CriteriaDTO>): Promise<EvaluationCriteriaEntity> {
    return this._criteriaRepository.updateCriteria(id, data);
  }

  public deleteCriteria(id: number): Promise<ObjectLiteral> {
    return this._criteriaRepository.deleteCriteria(id);
  }
}
