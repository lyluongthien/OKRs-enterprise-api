import { Repository, EntityRepository, EntityManager } from 'typeorm';

import { ObjectiveEntity } from '@app/db/entities/objective.entity';
import { HttpException, HttpStatus } from '@nestjs/common';
import { CommonMessage } from '@app/constants/app.enums';
import { OkrsDTO } from './objective.dto';
import { KeyResultEntity } from '@app/db/entities/key-result.entity';

@EntityRepository(ObjectiveEntity)
export class ObjectiveRepository extends Repository<ObjectiveEntity> {
  public async createAndUpdateOKRs(okrDTo: OkrsDTO, manager: EntityManager, userID: number): Promise<void> {
    try {
      okrDTo.objective.userId = userID;
      const objective = await manager.getRepository(ObjectiveEntity).save(okrDTo.objective);

      for (let i = 0; i < okrDTo.keyResult.length; i++) {
        okrDTo.keyResult[i].id = objective.id;
      }
      await manager.getRepository(KeyResultEntity).save(okrDTo.keyResult);
    } catch (error) {
      throw new HttpException(CommonMessage.DATABASE_EXCEPTION, HttpStatus.BAD_REQUEST);
    }
  }

  public async viewOKRs(cycleID: number): Promise<ObjectiveEntity[]> {
    try {
      return await this.createQueryBuilder('objective')
        .select([
          'objective.id',
          'objective.progress',
          'objective.title',
          'objective.isRootObjective',
          'objective.userId',
          'objective.cycleId',
          'objective.alignObjectivesId',
          'users.id',
          'users.fullName',
          'users.isLeader',
        ])
        .leftJoin('objective.parentObjectives', 'parentObjective')
        .leftJoinAndSelect('objective.keyResults', 'keyresults')
        .leftJoin('objective.user', 'users')
        .leftJoin(
          'objective.alignmentObjective',
          'alignmentObjectives',
          'alignmentObjectives.id = any (objective.alignObjectivesId)',
        )
        .where('objective.cycleId = :id', { id: cycleID })
        .getMany();
    } catch (error) {
      throw new HttpException(CommonMessage.DATABASE_EXCEPTION, HttpStatus.BAD_REQUEST);
    }
  }
  public async getDetailOKRs(id: number): Promise<ObjectiveEntity> {
    try {
      return await this.findOne({
        relations: ['keyResults', 'user'],
        where: { id },
      });
    } catch (error) {
      throw new HttpException(CommonMessage.DATABASE_EXCEPTION, HttpStatus.BAD_REQUEST);
    }
  }

  public async deleteOKRs(id: number): Promise<number> {
    try {
      return (await this.delete({ id })).affected;
    } catch (error) {
      throw new HttpException(CommonMessage.DATABASE_EXCEPTION, HttpStatus.BAD_REQUEST);
    }
  }
}
