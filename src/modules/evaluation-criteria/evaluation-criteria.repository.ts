import { HttpException, HttpStatus } from '@nestjs/common';
import { Repository, EntityRepository, ObjectLiteral } from 'typeorm';

import { EvaluationCriteriaEntity } from '@app/db/entities/evaluation-criteria.entity';
import { EvaluationDTO } from './evaluation-criteria.dto';
import { CommonMessage } from '@app/constants/app.enums';

@EntityRepository(EvaluationCriteriaEntity)
export class EvaluationCriteriaRepository extends Repository<EvaluationCriteriaEntity> {
  public async getList(): Promise<EvaluationCriteriaEntity[]> {
    return await this.find();
  }

  public async createCriteria(data: EvaluationDTO): Promise<EvaluationCriteriaEntity> {
    try {
      return await this.save(data);
    } catch (error) {
      throw new HttpException(CommonMessage.DATABASE_EXCEPTION, HttpStatus.BAD_REQUEST);
    }
  }

  public async getCriteriaDetail(id: number): Promise<EvaluationCriteriaEntity> {
    return await this.findOne({ where: { id } });
  }

  public async updateCriteria(id: number, data: Partial<EvaluationDTO>): Promise<EvaluationCriteriaEntity> {
    try {
      await this.update({ id }, data);
      return await this.findOne({ id });
    } catch (error) {
      throw new HttpException(CommonMessage.DATABASE_EXCEPTION, HttpStatus.BAD_REQUEST);
    }
  }

  public async deleteCriteria(id: number): Promise<ObjectLiteral> {
    await this.delete({ id });
    return { isDeleted: true };
  }
}
