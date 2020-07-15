import { Repository, EntityRepository, ObjectLiteral } from 'typeorm';

import { ObjectiveDTO } from './objective.dto';
import { ObjectiveEntity } from '@app/db/entities/objective.entity';
import { Pagination, IPaginationOptions, paginate } from 'nestjs-typeorm-paginate';

@EntityRepository(ObjectiveEntity)
export class ObjectiveRepository extends Repository<ObjectiveEntity> {
  public async createObjective(data: ObjectiveDTO): Promise<ObjectLiteral> {
    await this.save(data);
    return null;
  }

  public async viewObjectives(options: IPaginationOptions, cycleID: number): Promise<Pagination<ObjectiveEntity>> {
    const queryBuilder = this.createQueryBuilder('objective')
      .select([
        'objective.id',
        'objective.progress',
        'objective.title',
        'objective.isRootObjective',
        'objective.userId',
        'objective.cycleId',
        'objective.parentObjectiveId',
        'objective.alignObjectivesId',
      ])
      .leftJoin(ObjectiveEntity, 'childObjective', '"childObjective"."parentObjectiveId" = objective.parentObjectiveId')
      .leftJoinAndSelect('objective.keyResults', 'keyresults')
      .leftJoinAndSelect('objective.user', 'user')
      .where('objective.cycleId = :id', { id: cycleID });
    return await paginate<ObjectiveEntity>(queryBuilder, options);
  }
}
