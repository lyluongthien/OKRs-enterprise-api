import { Repository, EntityRepository, ObjectLiteral } from 'typeorm';
import { EvaluationCriteriaEntity } from '@app/db/entities/evaluation-criteria.entity';
import { CriteriaDTO } from './criteria.dto';

@EntityRepository(EvaluationCriteriaEntity)
export class CriteriaRepository extends Repository<EvaluationCriteriaEntity> {
  public async getList(): Promise<EvaluationCriteriaEntity[]> {
    return await this.find();
  }

  public async createCriteria(data: CriteriaDTO): Promise<EvaluationCriteriaEntity> {
    return await this.save(data);
  }

  public async getCriteriaDetail(id: number): Promise<EvaluationCriteriaEntity> {
    return await this.findOne({ where: { id } });
  }

  public async updateCriteria(id: number, data: Partial<CriteriaDTO>): Promise<EvaluationCriteriaEntity> {
    await this.update({ id }, data);
    return await this.findOne({ id });
  }

  public async deleteCriteria(id: number): Promise<ObjectLiteral> {
    await this.delete({ id });
    return { isDeleted: true };
  }
}
