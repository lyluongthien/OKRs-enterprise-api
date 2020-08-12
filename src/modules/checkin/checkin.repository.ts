import { Repository, EntityRepository, EntityManager, getConnection, ObjectLiteral } from 'typeorm';
import { HttpException } from '@nestjs/common';

import { CheckinEntity } from '@app/db/entities/checkin.entity';
import { CheckinStatus, CheckinType } from '@app/constants/app.enums';
import { DATABASE_EXCEPTION } from '@app/constants/app.exeption';
import { CheckinDetailEntity } from '@app/db/entities/checkin-detail.entity';
import { IPaginationOptions, paginate } from 'nestjs-typeorm-paginate';

@EntityRepository(CheckinEntity)
export class CheckinRepository extends Repository<CheckinEntity> {
  /**
   * @param data
   * @param manager
   * @description: Create and update checkin. If id null => create new checkin else => Update
   */
  public async createUpdateCheckin(data: ObjectLiteral, manager: EntityManager): Promise<any> {
    try {
      return manager.getRepository(CheckinEntity).save(data);
    } catch (error) {
      throw new HttpException(DATABASE_EXCEPTION.message, DATABASE_EXCEPTION.statusCode);
    }
  }

  public async createUpdateCheckinDetail(data: ObjectLiteral, manager: EntityManager): Promise<any> {
    try {
      return manager.getRepository(CheckinDetailEntity).save(data);
    } catch (error) {
      throw new HttpException(DATABASE_EXCEPTION.message, DATABASE_EXCEPTION.statusCode);
    }
  }

  public async getWeeklyCheckin(id: number[]): Promise<ObjectLiteral[]> {
    try {
      return await getConnection().query(`select c."confidentLevel", count(c.id) as numberOfLevel from checkins c
      where c.id in (${id})
      group by c."confidentLevel"`);
    } catch (error) {
      throw new HttpException(DATABASE_EXCEPTION.message, DATABASE_EXCEPTION.statusCode);
    }
  }

  public async getCheckinById(id: number): Promise<CheckinEntity> {
    try {
      const queryBuilder = this.createQueryBuilder('checkin')
        .select([
          'checkin.id',
          'checkin.confidentLevel',
          'checkin.teamLeaderId',
          'checkin.checkinAt',
          'checkin.nextCheckinDate',
          'checkin.status',
          'objective.id',
          'objective.title',
          'objective.userId',
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
        .leftJoin('checkin.objective', 'objective')
        .leftJoin('checkin.checkinDetails', 'checkinDetails')
        .leftJoin('checkinDetails.keyResult', 'keyresult')
        .where('checkin.id= :id', { id })
        .getOne();

      return await queryBuilder;
    } catch (error) {
      throw new HttpException(DATABASE_EXCEPTION.message, DATABASE_EXCEPTION.statusCode);
    }
  }

  public async updateCheckinStatus(id: number, status: CheckinStatus, manager: EntityManager): Promise<void> {
    try {
      await manager.getRepository(CheckinEntity).update({ id }, { status: status });
    } catch (error) {
      throw new HttpException(DATABASE_EXCEPTION.message, DATABASE_EXCEPTION.statusCode);
    }
  }

  public async getCheckinByObjectiveId(id: number): Promise<CheckinEntity[]> {
    try {
      const checkins = this.find({ where: { objectiveId: id } });

      return checkins;
    } catch (error) {
      throw new HttpException(DATABASE_EXCEPTION.message, DATABASE_EXCEPTION.statusCode);
    }
  }

  public getDoneCheckinById(id: number, type: number): Promise<CheckinEntity[]> {
    try {
      let condition = null;
      if (type == CheckinType.MEMBER) {
        condition = 'user.id = :id AND objective.isRootObjective = false';
      } else {
        condition = 'checkin.teamLeaderId = :id';
      }
      return this.createQueryBuilder('checkin')
        .select([
          'checkin.id',
          'checkin.checkinAt',
          'objective.id',
          'objective.title',
          'cycle.name',
          'user.id',
          'user.fullName',
        ])
        .leftJoin('checkin.objective', 'objective')
        .leftJoin('objective.cycle', 'cycle')
        .leftJoin('objective.user', 'user')
        .where(condition, { id })
        .andWhere('checkin.status = :status', { status: CheckinStatus.DONE })
        .getMany();
    } catch (error) {
      throw new HttpException(DATABASE_EXCEPTION.message, DATABASE_EXCEPTION.statusCode);
    }
  }

  public async getCheckinRequest(teamId: number, cycleId: number, options: IPaginationOptions): Promise<any> {
    try {
      const queryBuilder = this.createQueryBuilder('checkin')
        .select([
          'checkin.id',
          'checkin.checkinAt',
          'objective.id',
          'objective.title',
          'user.id',
          'user.fullName',
          'team.name',
        ])
        .leftJoin('checkin.objective', 'objective')
        .leftJoin('objective.user', 'user')
        .leftJoin('objective.cycle', 'cycle')
        .leftJoin('user.team', 'team')
        .where('team.id= :team', { team: teamId })
        .andWhere('cycle.id = :cycle', { cycle: cycleId })
        .andWhere('checkin.status = :status', { status: CheckinStatus.PENDING });
      return await paginate<CheckinEntity>(queryBuilder, options);
    } catch (error) {
      throw new HttpException(DATABASE_EXCEPTION.message, DATABASE_EXCEPTION.statusCode);
    }
  }

  public getCheckin(): Promise<CheckinEntity[]> {
    try {
      return this.find();
    } catch (error) {
      throw new HttpException(DATABASE_EXCEPTION.message, DATABASE_EXCEPTION.statusCode);
    }
  }
}
