import { Repository, EntityRepository, EntityManager, ObjectLiteral } from 'typeorm';

import { ObjectiveDTO } from './objective.dto';
import { ObjectiveEntity } from '@app/db/entities/objective.entity';

@EntityRepository(ObjectiveEntity)
export class ObjectiveRepository extends Repository<ObjectiveEntity> {
  public async createObjective(data: ObjectiveDTO): Promise<ObjectLiteral> {
    await this.save(data);
    return null;
  }
}
