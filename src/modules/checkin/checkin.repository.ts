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

  public getDoneCheckinById(id: number, type: CheckinType): Promise<CheckinEntity[]> {
    try {
      let condition = null;
      if (type == CheckinType.MEMBER) {
        condition = 'checkin.teamLeaderId = :id';
      } else {
        condition = 'user.id = :id';
      }
      return this.createQueryBuilder('checkin')
        .select([
          'checkin.id',
          'checkin.checkinAt',
          'objective.id',
          'objective.title',
          'cycle.id',
          'cycle.name',
          'user.id',
          'user.fullName',
          'user.gravatarURL',
          'user.avatarURL',
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

  public getIndueCheckin(cycleId: number): Promise<CheckinEntity> {
    try {
      const query = `SELECT count(c.id) AS inDueCheckin
      FROM checkins c
      LEFT JOIN objectives o ON c."objectiveId" = o.id
      WHERE c."checkinAt" <=
          (SELECT c2."nextCheckinDate"
           FROM checkins c2
           WHERE c2."objectiveId" = c."objectiveId"
             AND c2.id <> c.id
             AND (c2.status = '${CheckinStatus.DONE}'
                  OR c2.status = '${CheckinStatus.CLOSED}')
           ORDER BY c2."nextCheckinDate" DESC
           LIMIT 1)
        AND c.status = '${CheckinStatus.PENDING}'
        AND o."cycleId" = ${cycleId}`;
      return this.query(query);
    } catch (error) {
      throw new HttpException(DATABASE_EXCEPTION.message, DATABASE_EXCEPTION.statusCode);
    }
  }

  public getOverdueCheckin(cycleId: number): Promise<CheckinEntity[]> {
    try {
      const query = `SELECT count(c.id) AS overDueCheckin
      FROM checkins c
      LEFT JOIN objectives o ON c."objectiveId" = o.id
      WHERE c."checkinAt" >
          (SELECT c2."nextCheckinDate"
           FROM checkins c2
           WHERE c2."objectiveId" = c."objectiveId"
             AND c2.id <> c.id
             AND (c2.status = '${CheckinStatus.DONE}'
                  OR c2.status = '${CheckinStatus.CLOSED}')
           ORDER BY c2."nextCheckinDate" DESC
           LIMIT 1)
        AND c.status = '${CheckinStatus.PENDING}'
        AND o."cycleId" = ${cycleId}`;
      return this.query(query);
    } catch (error) {
      throw new HttpException(DATABASE_EXCEPTION.message, DATABASE_EXCEPTION.statusCode);
    }
  }

  public async getNotYetCheckin(cycleId: number): Promise<CheckinEntity[]> {
    try {
      const query = `SELECT count(o.id) as notYetCheckin
      FROM objectives o
      WHERE o."isCompleted" = FALSE
        AND o."cycleId" = ${cycleId}
        AND o.id NOT IN
          (SELECT DISTINCT c."objectiveId"
           FROM checkins c
           WHERE c.status = '${CheckinStatus.DRAFT}' )`;
      return this.query(query);
    } catch (error) {
      throw new HttpException(DATABASE_EXCEPTION.message, DATABASE_EXCEPTION.statusCode);
    }
  }

  public async getChartCheckin(userId: number, cycleId: number): Promise<CheckinEntity[]> {
    try {
      const queryBuilder = this.createQueryBuilder('checkin')
        .select(['checkin.progress', 'checkin.checkinAt'])
        .leftJoin('checkin.objective', 'objective')
        .leftJoin('objective.cycle', 'cycle')
        .where('objective.userId= :userId', { userId: userId })
        .andWhere('cycle.id = :cycle', { cycle: cycleId })
        .andWhere('checkin.status != :status', { status: CheckinStatus.PENDING })
        .orderBy('checkin.checkinAt', 'ASC');

      return queryBuilder.getMany();
    } catch (error) {
      throw new HttpException(DATABASE_EXCEPTION.message, DATABASE_EXCEPTION.statusCode);
    }
  }
}
