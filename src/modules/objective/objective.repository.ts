import { Repository, EntityRepository, EntityManager } from 'typeorm';

import { ObjectiveEntity } from '@app/db/entities/objective.entity';
import { HttpException, HttpStatus } from '@nestjs/common';
import { CommonMessage } from '@app/constants/app.enums';
import { OkrsDTO } from './objective.dto';
import { KeyResultEntity } from '@app/db/entities/key-result.entity';

@EntityRepository(ObjectiveEntity)
export class ObjectiveRepository extends Repository<ObjectiveEntity> {
  public async createOKRs(okrDTo: OkrsDTO, manager?: EntityManager): Promise<void> {
    try {
      const objective = await manager.getRepository(ObjectiveEntity).save(okrDTo.objective);
      const keyResultRepository = manager.getRepository(KeyResultEntity);

      for (const value of okrDTo.keyResult) {
        value.objectiveId = objective.id;
        await keyResultRepository.save(value);
      }
    } catch (error) {
      throw new HttpException(CommonMessage.DATABASE_EXCEPTION, HttpStatus.BAD_REQUEST);
    }
  }

  public async updateOKRs(okrDTo: OkrsDTO, manager?: EntityManager): Promise<void> {
    try {
      const objective = await manager.getRepository(ObjectiveEntity).save(okrDTo.objective);
      const keyResultRepository = manager.getRepository(KeyResultEntity);

      for (const value of okrDTo.keyResult) {
        value.objectiveId = objective.id;
        await keyResultRepository.save(value);
      }
    } catch (error) {
      throw new HttpException(CommonMessage.DATABASE_EXCEPTION, HttpStatus.BAD_REQUEST);
    }
  }
  public async viewOKRs(cycleID: number): Promise<ObjectiveEntity[]> {
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
          'user.id',
          'user.fullName',
          'user.isLeader',
        ])
        .leftJoinAndSelect('objective.parentObjectives', 'parentObjective')
        .leftJoinAndSelect('objective.keyResults', 'keyresults')
        .leftJoin('objective.user', 'user')
        .where('objective.cycleId = :id', { id: cycleID })
        .getMany();
      return queryBuilder;
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
}
