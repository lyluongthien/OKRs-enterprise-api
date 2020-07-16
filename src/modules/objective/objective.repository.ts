import { Repository, EntityRepository, ObjectLiteral } from 'typeorm';

import { ObjectiveDTO } from './objective.dto';
import { ObjectiveEntity } from '@app/db/entities/objective.entity';
import { Pagination, IPaginationOptions, paginate } from 'nestjs-typeorm-paginate';
import { HttpException, HttpStatus } from '@nestjs/common';
import { CommonMessage } from '@app/constants/app.enums';

@EntityRepository(ObjectiveEntity)
export class ObjectiveRepository extends Repository<ObjectiveEntity> {
  public async createObjective(data: ObjectiveDTO): Promise<ObjectLiteral> {
    await this.save(data);
    return null;
  }

  public async viewOKRs(options: IPaginationOptions, cycleID: number): Promise<Pagination<ObjectiveEntity>> {
    try {
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
        //.leftJoin(ObjectiveEntity, 'childObjective', '"childObjective"."parentObjectiveId" = objective.id')
        .leftJoin('objective.objective', 'childObjective', '"childObjective"."parentObjectiveId" = objective.id')
        .select(['childObjective.id', 'childObjective.progress', 'childObjective.title'])
        .leftJoinAndSelect('objective.keyResults', 'keyresults')
        .leftJoinAndSelect('objective.user', 'user')
        .where('objective.cycleId = :id', { id: cycleID });
      return await paginate<ObjectiveEntity>(queryBuilder, options);
    } catch (error) {
      throw new HttpException(CommonMessage.DATABASE_EXCEPTION, HttpStatus.BAD_REQUEST);
    }
  }
  public async getDetailOKRs(id: number): Promise<ObjectiveEntity> {
    return await this.findOneOrFail({
      relations: ['keyResults', 'user'],
      where: { id },
    });
  }
}
