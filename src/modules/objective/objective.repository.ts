import { Repository, EntityRepository, EntityManager } from 'typeorm';
import { HttpException } from '@nestjs/common';

import { ObjectiveEntity } from '@app/db/entities/objective.entity';
import { OkrsDTO } from './objective.dto';
import { KeyResultEntity } from '@app/db/entities/key-result.entity';
import { DATABASE_EXCEPTION, TARGET_VALUE_INVALID } from '@app/constants/app.exeption';
import { CustomException } from '@app/services/exceptions/HandlerException';

@EntityRepository(ObjectiveEntity)
export class ObjectiveRepository extends Repository<ObjectiveEntity> {
  public async createAndUpdateOKRs(okrDTo: OkrsDTO, manager: EntityManager, userID: number): Promise<void> {
    try {
      okrDTo.objective.userId = userID;
      const objective = await manager.getRepository(ObjectiveEntity).save(okrDTo.objective);

      okrDTo.keyResult.map((data) => {
        if (data.targetValue < 1 || data.targetValue <= data.valueObtained) {
          throw new CustomException();
        }
        data.objectiveId = objective.id;
        return data.objectiveId;
      });
      await manager.getRepository(KeyResultEntity).save(okrDTo.keyResult);
    } catch (error) {
      if (error instanceof CustomException) {
        throw new HttpException(TARGET_VALUE_INVALID.message, TARGET_VALUE_INVALID.statusCode);
      } else {
        throw new HttpException(DATABASE_EXCEPTION.message, DATABASE_EXCEPTION.statusCode);
      }
    }
  }

  public async viewOKRs(cycleID: number, text: string): Promise<ObjectiveEntity[]> {
    try {
      const queryBuilder = await this.createQueryBuilder('objective')
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
        .leftJoinAndMapMany(
          'objective.alignmentObjective',
          ObjectiveEntity,
          'objectiveAlignment',
          'objectiveAlignment.id = any (objective.alignObjectivesId)',
        )
        .leftJoin('objective.user', 'users');
      if (cycleID) {
        if (text) {
          return await queryBuilder
            .where('objective.cycleId = :id', { id: cycleID })
            .andWhere('objective.title like :text', { text: '%' + text + '%' })
            .getMany();
        }
        return await queryBuilder.where('objective.cycleId = :id', { id: cycleID }).getMany();
      }
      return null;
    } catch (error) {
      throw new HttpException(DATABASE_EXCEPTION.message, DATABASE_EXCEPTION.statusCode);
    }
  }
  public async getDetailOKRs(id: number): Promise<ObjectiveEntity> {
    try {
      return await this.findOne({
        relations: ['keyResults', 'user'],
        where: { id },
      });
    } catch (error) {
      throw new HttpException(DATABASE_EXCEPTION.message, DATABASE_EXCEPTION.statusCode);
    }
  }

  public async deleteOKRs(id: number): Promise<number> {
    try {
      return (await this.delete({ id })).affected;
    } catch (error) {
      throw new HttpException(DATABASE_EXCEPTION.message, DATABASE_EXCEPTION.statusCode);
    }
  }
}
