import { Repository, EntityRepository, EntityManager } from 'typeorm';
import { HttpException } from '@nestjs/common';

import { ObjectiveEntity } from '@app/db/entities/objective.entity';
import { DATABASE_EXCEPTION } from '@app/constants/app.exeption';
import { OKRsType, OKRsLeaderType } from '@app/constants/app.enums';
import { ObjectiveDTO } from './objective.dto';

@EntityRepository(ObjectiveEntity)
export class ObjectiveRepository extends Repository<ObjectiveEntity> {
  public async createAndUpdateObjective(data: ObjectiveDTO, manager: EntityManager): Promise<ObjectiveEntity> {
    try {
      return await manager.getRepository(ObjectiveEntity).save(data);
    } catch (error) {
      throw new HttpException(DATABASE_EXCEPTION.message, DATABASE_EXCEPTION.statusCode);
    }
  }

  public async updateProgressOKRs(id: number, progress: number, manager: EntityManager): Promise<any> {
    try {
      return await manager.getRepository(ObjectiveEntity).update({ id }, { progress });
    } catch (error) {
      throw new HttpException(DATABASE_EXCEPTION.message, DATABASE_EXCEPTION.statusCode);
    }
  }

  public async updateStatusOKRs(id: number, isCompleted: boolean, manager: EntityManager): Promise<any> {
    try {
      return await manager.getRepository(ObjectiveEntity).update({ id }, { isCompleted });
    } catch (error) {
      throw new HttpException(DATABASE_EXCEPTION.message, DATABASE_EXCEPTION.statusCode);
    }
  }

  public async searchOKRs(cycleId: number, userId: number): Promise<ObjectiveEntity[]> {
    try {
      const queryBuilder = await this.createQueryBuilder('objective')
        .select([
          'objective.id',
          'objective.progress',
          'objective.title',
          'objective.isRootObjective',
          'objective.cycleId',
          'users.id',
          'users.fullName',
          'users.isLeader',
        ])
        .leftJoinAndSelect('objective.childObjectives', 'childObjective')
        .leftJoinAndSelect('objective.keyResults', 'keyresults')
        .leftJoinAndSelect('childObjective.keyResults', 'krs')
        .leftJoinAndMapMany(
          'objective.alignmentObjectives',
          ObjectiveEntity,
          'objectiveAlignment',
          'objectiveAlignment.id = any (objective.alignObjectivesId)',
        )
        .leftJoinAndSelect('objectiveAlignment.keyResults', 'aligmentKeyResults')
        .leftJoin('objective.user', 'users');
      if (cycleId) {
        if (userId) {
          return await queryBuilder
            .where('objective.cycleId = :cycleId', { cycleId })
            .andWhere('users.id = :userId', { userId })
            .getMany();
        }
        return await queryBuilder.where('objective.cycleId = :cycleId', { cycleId }).getMany();
      }
      return null;
    } catch (error) {
      throw new HttpException(DATABASE_EXCEPTION.message, DATABASE_EXCEPTION.statusCode);
    }
  }

  public async getListOKRs(id: number, type: OKRsLeaderType): Promise<ObjectiveEntity[]> {
    try {
      const queryBuilder = await this.createQueryBuilder('objective')
        .select(['objective.id', 'objective.title', 'users.id', 'users.email'])
        .leftJoin('objective.user', 'users');
      switch (type) {
        case OKRsLeaderType.ROOT:
          return await queryBuilder
            .where('objective.cycleId = :cycleId', { cycleId: id })
            .andWhere('objective.isRootObjective = true')
            .getMany();
        case OKRsLeaderType.TEAM_LEADER:
          return await queryBuilder
            .where('objective.cycleId = :cycleId', { cycleId: id })
            .andWhere('users.isLeader = :isLead', { isLead: true })
            .getMany();
        case OKRsLeaderType.ALL:
          return await queryBuilder
            .where('objective.cycleId = :cycleId', { cycleId: id })
            .andWhere('objective.isRootObjective = :root', { root: false })
            .getMany();
        default:
          return null;
      }
    } catch (error) {
      throw new HttpException(DATABASE_EXCEPTION.message, DATABASE_EXCEPTION.statusCode);
    }
  }

  public async viewListOKRs(cycleId: number, type: number, id?: number): Promise<ObjectiveEntity[]> {
    try {
      const queryBuilder = await this.createQueryBuilder('objective')
        .select([
          'objective.id',
          'objective.progress',
          'objective.title',
          'objective.isRootObjective',
          'objective.cycleId',
          'users.id',
          'users.fullName',
          'users.isLeader',
          'childUser.id',
          'childUser.fullName',
          'childUser.isLeader',
        ])
        .leftJoinAndSelect('objective.childObjectives', 'childObjective')
        .leftJoin('childObjective.user', 'childUser')
        .leftJoinAndSelect('objective.keyResults', 'keyresults')
        .leftJoinAndSelect('childObjective.keyResults', 'krs')
        .leftJoinAndMapMany(
          'objective.alignmentObjectives',
          ObjectiveEntity,
          'objectiveAlignment',
          'objectiveAlignment.id = any (objective.alignObjectivesId)',
        )
        .leftJoinAndSelect('objectiveAlignment.keyResults', 'aligmentKeyResults')
        .leftJoin('objective.user', 'users');
      if (cycleId) {
        await queryBuilder.where('objective.cycleId = :id', { id: cycleId });
        switch (type) {
          case OKRsType.ROOT:
            return await queryBuilder.andWhere('objective.isRootObjective = :root', { root: true }).getMany();
          case OKRsType.PERSONAL:
            return await queryBuilder
              .andWhere('users.id = :user', { user: id })
              .andWhere('objective.isRootObjective = :root', { root: false })
              .getMany();
          case OKRsType.TEAM:
            return await queryBuilder.andWhere('users.id = :user', { user: id }).getMany();
          default:
            return await queryBuilder.getMany();
        }
      }
      return null;
    } catch (error) {
      throw new HttpException(DATABASE_EXCEPTION.message, DATABASE_EXCEPTION.statusCode);
    }
  }

  public async getOKRsProgress(cycleId: number, type: number, id?: number): Promise<ObjectiveEntity[]> {
    try {
      const queryBuilder = await this.createQueryBuilder('objective')
        .select(['objective.progress'])
        .leftJoin('objective.user', 'users');
      if (cycleId) {
        await queryBuilder.where('objective.cycleId = :id', { id: cycleId });
        switch (type) {
          case OKRsType.ROOT:
            return await queryBuilder.andWhere('objective.isRootObjective = :root', { root: true }).getMany();
          case OKRsType.PERSONAL:
            return await queryBuilder
              .andWhere('users.id = :user', { user: id })
              .andWhere('objective.isRootObjective = :root', { root: false })
              .getMany();
          case OKRsType.TEAM:
            return await queryBuilder.andWhere('users.id = :user', { user: id }).getMany();
          default:
            return await queryBuilder.getMany();
        }
      }
      return null;
    } catch (error) {
      throw new HttpException(DATABASE_EXCEPTION.message, DATABASE_EXCEPTION.statusCode);
    }
  }

  public async getDetailOKRs(id: number): Promise<ObjectiveEntity> {
    try {
      return await this.createQueryBuilder('objective')
        .select([
          'objective.id',
          'objective.title',
          'objective.progress',
          'objective.isRootObjective',
          'parentObjective.id',
          'parentObjective.title',
          'users.id',
          'users.fullName',
        ])
        .leftJoin('objective.parentObjective', 'parentObjective')
        .leftJoinAndSelect('objective.keyResults', 'keyresults')
        .leftJoinAndMapMany(
          'objective.alignmentObjectives',
          ObjectiveEntity,
          'objectiveAlignment',
          'objectiveAlignment.id = any (objective.alignObjectivesId)',
        )
        .leftJoin('objective.user', 'users')
        .where('objective.id = :id', { id })
        .getOne();
    } catch (error) {
      throw new HttpException(DATABASE_EXCEPTION.message, DATABASE_EXCEPTION.statusCode);
    }
  }

  public async deleteObjective(id: number, manager: EntityManager): Promise<number> {
    try {
      return (await manager.getRepository(ObjectiveEntity).delete({ id })).affected;
    } catch (error) {
      throw new HttpException(DATABASE_EXCEPTION.message, DATABASE_EXCEPTION.statusCode);
    }
  }

  public async getListOKRsIds(): Promise<ObjectiveEntity[]> {
    try {
      return await this.find({ select: ['id'] });
    } catch (error) {
      throw new HttpException(DATABASE_EXCEPTION.message, DATABASE_EXCEPTION.statusCode);
    }
  }

  public async getOKRsByUserId(userId: number): Promise<ObjectiveEntity[]> {
    try {
      return await this.find({ select: ['id', 'title'], where: { userId } });
    } catch (error) {
      throw new HttpException(DATABASE_EXCEPTION.message, DATABASE_EXCEPTION.statusCode);
    }
  }

  public async getListOKRsCheckin(userId: number, cycleId: number, isRoot?: boolean): Promise<ObjectiveEntity[]> {
    try {
      let isRootOKRs = false;
      if (isRoot) {
        isRootOKRs = true;
      }
      const queryBuilder = await this.createQueryBuilder('objective')
        .select([
          'objective.id',
          'objective.title',
          'objective.progress',
          'objective.isCompleted',
          'keyresults.id',
          'keyresults.targetValue',
          'keyresults.startValue',
          'keyresults.valueObtained',
          'keyresults.content',
          'keyresults.linkPlans',
          'keyresults.linkResults',
          'measureUnit.type',
          'checkins.id',
          'checkins.status',
          'checkins.checkinAt',
          'checkins.nextCheckinDate',
          'checkins.progress',
        ])
        .leftJoin('objective.keyResults', 'keyresults')
        .leftJoin('objective.user', 'users')
        .leftJoin('objective.checkins', 'checkins')
        .leftJoin('keyresults.measureUnit', 'measureUnit')
        .where('objective.cycleId = :cycleId', { cycleId })
        .andWhere('users.id = :userId', { userId })
        .andWhere('objective.isRootObjective = :isRootOKRs', { isRootOKRs })
        .orderBy('objective.id', 'ASC')
        .addOrderBy('checkins.checkinAt', 'DESC')
        .getMany();

      return queryBuilder;
    } catch (error) {
      throw new HttpException(DATABASE_EXCEPTION.message, DATABASE_EXCEPTION.statusCode);
    }
  }

  public async getObjectiveCheckin(userId: number, objectiveId: number): Promise<ObjectiveEntity> {
    try {
      const queryBuilder = await this.createQueryBuilder('objective')
        .select([
          'objective.id',
          'objective.title',
          'objective.progress',
          'keyresults.id',
          'keyresults.content',
          'keyresults.targetValue',
          'checkins.id',
          'checkins.status',
          'checkins.checkinAt',
          'checkins.nextCheckinDate',
          'checkins.confidentLevel',
          'checkins.progress',
          'checkinDetails.id',
          'checkinDetails.valueObtained',
          'checkinDetails.confidentLevel',
          'checkinDetails.progress',
          'checkinDetails.problems',
          'checkinDetails.plans',
          'keyresult.id',
          'keyresult.content',
          'keyresult.targetValue',
          'keyresult.valueObtained',
        ])
        .leftJoin('objective.keyResults', 'keyresults')
        .leftJoin('objective.checkins', 'checkins')
        .leftJoin('checkins.checkinDetails', 'checkinDetails')
        .leftJoin('checkinDetails.keyResult', 'keyresult')
        .where('objective.id = :id', { id: objectiveId })
        .andWhere('objective.userId = :userId', { userId })
        .addOrderBy('checkins.checkinAt', 'DESC')
        .addOrderBy('keyresults.id', 'ASC')
        .addOrderBy('keyresult.id', 'ASC')
        .getOne();

      return queryBuilder;
    } catch (error) {
      throw new HttpException(error.message, DATABASE_EXCEPTION.statusCode);
    }
  }
}
