import { Repository, EntityRepository, ObjectLiteral } from 'typeorm';
import { CycleEntity } from '@app/db/entities/cycle.entity';
import { CycleDTO } from './cycle.dto';

@EntityRepository(CycleEntity)
export class CycleRepository extends Repository<CycleEntity> {
  public async getList(): Promise<CycleEntity[]> {
    return await this.find();
  }

  public async createCycle(data: CycleDTO): Promise<CycleEntity> {
    return await this.save(data);
  }

  public async getCycleDetail(id: number): Promise<CycleEntity> {
    return await this.findOne({ where: { id } });
  }

  public async updateCycle(id: number, data: Partial<CycleDTO>): Promise<CycleEntity> {
    await this.update({ id }, data);
    return await this.findOne({ id });
  }

  public async deleteCycle(id: number): Promise<ObjectLiteral> {
    await this.delete({ id });
    return { isDeleted: true };
  }
}
