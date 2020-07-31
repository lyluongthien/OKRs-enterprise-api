import { HttpException } from '@nestjs/common';
import { Repository, EntityRepository, ObjectLiteral } from 'typeorm';

import { EvaluationCriteriaEntity } from '@app/db/entities/evaluation-criteria.entity';
import { EvaluationDTO } from './evaluation-criteria.dto';
import { DATABASE_EXCEPTION } from '@app/constants/app.exeption';
import { IPaginationOptions, paginate } from 'nestjs-typeorm-paginate';

@EntityRepository(EvaluationCriteriaEntity)
export class EvaluationCriteriaRepository extends Repository<EvaluationCriteriaEntity> {
  public async getList(): Promise<EvaluationCriteriaEntity[]> {
    try {
      return await this.find();
    } catch (error) {
      throw new HttpException(DATABASE_EXCEPTION.message, DATABASE_EXCEPTION.statusCode);
    }
  }

  public async getEvaluationCriterias(option: IPaginationOptions): Promise<any> {
    try {
      const queryBuilder = await this.createQueryBuilder('criteria').orderBy('criteria.updatedAt', 'DESC');
      return await paginate<EvaluationCriteriaEntity>(queryBuilder, option);
    } catch (error) {
      throw new HttpException(DATABASE_EXCEPTION.message, DATABASE_EXCEPTION.statusCode);
    }
  }

  public async createCriteria(data: EvaluationDTO): Promise<EvaluationCriteriaEntity> {
    try {
      return await this.save(data);
    } catch (error) {
      throw new HttpException(DATABASE_EXCEPTION.message, DATABASE_EXCEPTION.statusCode);
    }
  }

  public async getCriteriaDetail(id: number): Promise<EvaluationCriteriaEntity> {
    try {
      return await this.findOne({ where: { id } });
    } catch (error) {
      throw new HttpException(DATABASE_EXCEPTION.message, DATABASE_EXCEPTION.statusCode);
    }
  }

  public async updateCriteria(id: number, data: Partial<EvaluationDTO>): Promise<EvaluationCriteriaEntity> {
    try {
      await this.update({ id }, data);
      return await this.findOne({ id });
    } catch (error) {
      throw new HttpException(DATABASE_EXCEPTION.message, DATABASE_EXCEPTION.statusCode);
    }
  }

  public async deleteCriteria(id: number): Promise<ObjectLiteral> {
    try {
      await this.delete({ id });
      return { isDeleted: true };
    } catch (error) {
      throw new HttpException(DATABASE_EXCEPTION.message, DATABASE_EXCEPTION.statusCode);
    }
  }
}
