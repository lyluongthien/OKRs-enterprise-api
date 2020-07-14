import { Repository, EntityRepository, TransactionRepository } from 'typeorm';

import { OkrsDTO } from './objective.dto';
import { ObjectiveEntity } from '@app/db/entities/objective.entity';

@EntityRepository(ObjectiveEntity)
export class ObjectiveRepository extends Repository<OkrsDTO> {
  public async createObjective(data: OkrsDTO): Promise<OkrsDTO> {
    return await this.save(data);
  }
}
