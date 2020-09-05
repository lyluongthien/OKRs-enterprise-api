import { Repository, EntityRepository, EntityManager, getConnection, ObjectLiteral } from 'typeorm';
import { HttpException } from '@nestjs/common';

import { CheckinEntity } from '@app/db/entities/checkin.entity';
import { CheckinStatus, CheckinType, EvaluationCriteriaEnum } from '@app/constants/app.enums';
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

  public async getDetailListWaitingFeedback(id: number): Promise<CheckinEntity> {
    try {
      const queryBuilder = this.createQueryBuilder('checkin')
        .select([
          'checkin.id',
          'checkin.confidentLevel',
          'checkin.checkinAt',
          'objective.title',
          'user.fullName',
          'checkinDetails.valueObtained',
          'checkinDetails.confidentLevel',
          'checkinDetails.progress',
          'checkinDetails.problems',
          'checkinDetails.plans',
          'keyresult.content',
          'keyresult.targetValue',
        ])
        .leftJoin('checkin.objective', 'objective')
        .leftJoin('objective.user', 'user')
        .leftJoin('checkin.checkinDetails', 'checkinDetails')
        .leftJoin('checkinDetails.keyResult', 'keyresult')
        .where('checkin.id= :id', { id })
        .getOne();

      return await queryBuilder;
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
          'checkin.progress',
          'checkin.status',
          'objective.id',
          'objective.title',
          'objective.progress',
          'objective.createdAt',
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

  public async updateCheckinStatus(id: number, type: EvaluationCriteriaEnum, manager: EntityManager): Promise<void> {
    try {
      if (type == EvaluationCriteriaEnum.LEADER_TO_MEMBER) {
        await manager.getRepository(CheckinEntity).update({ id }, { isLeaderFeedBack: true });
      } else {
        await manager.getRepository(CheckinEntity).update({ id }, { isStaffFeedBack: true });
      }
    } catch (error) {
      throw new HttpException(DATABASE_EXCEPTION.message, DATABASE_EXCEPTION.statusCode);
    }
  }

  public async getCheckinByObjectiveId(id: number): Promise<CheckinEntity[]> {
    try {
      return await this.createQueryBuilder('checkin')
        .select([
          'checkin.id',
          'checkin.confidentLevel',
          'checkin.teamLeaderId',
          'checkin.checkinAt',
          'checkin.nextCheckinDate',
          'checkin.status',
          'objective.id',
          'objective.title',
        ])
        .leftJoin('checkin.objective', 'objective')
        .where('objective.id= :id', { id })
        .orderBy('checkin.checkinAt', 'DESC')
        .getMany();
    } catch (error) {
      throw new HttpException(DATABASE_EXCEPTION.message, DATABASE_EXCEPTION.statusCode);
    }
  }

  public async getDoneCheckinById(
    id: number,
    cycleId: number,
    type: CheckinType,
    feedBacktype: EvaluationCriteriaEnum,
    options?: IPaginationOptions,
  ): Promise<any> {
    try {
      let condition = null;
      if (type === CheckinType.MEMBER) {
        condition = 'checkin.teamLeaderId = :id and user.id <> :id';
      } else if (type == CheckinType.PERSONAL) {
        condition = 'user.id = :id and objective.isRootObjective = false';
      } else {
        condition = 'user.id = :id and objective.isRootObjective = true';
      }
      const feedBackType =
        feedBacktype == EvaluationCriteriaEnum.LEADER_TO_MEMBER
          ? 'checkin.isLeaderFeedBack = false'
          : 'checkin.isStaffFeedBack = false';

      const queryBuilder = await this.createQueryBuilder('checkin')
        .select([
          'checkin.id',
          'checkin.checkinAt',
          'objective.id',
          'objective.title',
          'user.id',
          'user.fullName',
          'user.avatarURL',
          'user.gravatarURL',
        ])
        .leftJoin('checkin.objective', 'objective')
        .leftJoin('objective.cycle', 'cycle')
        .leftJoin('objective.user', 'user')
        .leftJoin('user.team', 'team')
        .leftJoin('checkin.teamLeader', 'teamLeader')
        .where(condition, { id })
        .andWhere('user.isActive = true')
        .andWhere('teamLeader.isActive = true')
        .andWhere('checkin.status = :status', { status: CheckinStatus.DONE })
        .andWhere(feedBackType)
        .andWhere('cycle.id = :cycleId', { cycleId: cycleId });
      if (options) {
        return await paginate<CheckinEntity>(queryBuilder, options);
      }
      return await queryBuilder.getMany();
    } catch (error) {
      throw new HttpException(DATABASE_EXCEPTION.message, DATABASE_EXCEPTION.statusCode);
    }
  }

  public async getCheckinRequest(userId: number, cycleId: number, options: IPaginationOptions): Promise<any> {
    try {
      const queryBuilder = this.createQueryBuilder('checkin')
        .select([
          'checkin.id',
          'checkin.createdAt',
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
        .where('checkin.teamLeaderId= :leaderId', { leaderId: userId })
        .andWhere('cycle.id = :cycle', { cycle: cycleId })
        .andWhere('checkin.status = :status', { status: CheckinStatus.PENDING });
      return await paginate<CheckinEntity>(queryBuilder, options);
    } catch (error) {
      throw new HttpException(DATABASE_EXCEPTION.message, DATABASE_EXCEPTION.statusCode);
    }
  }

  public async getCheckin(): Promise<CheckinEntity[]> {
    try {
      return await this.find();
    } catch (error) {
      throw new HttpException(DATABASE_EXCEPTION.message, DATABASE_EXCEPTION.statusCode);
    }
  }

  public async getIndueCheckin(cycleId: number): Promise<ObjectLiteral[]> {
    try {
      const query = `SELECT count(c.id) AS inDueCheckin
      FROM checkins c
      LEFT JOIN objectives o ON c."objectiveId" = o.id
      WHERE c."checkinAt" <=
          (SELECT c2."nextCheckinDate"
           FROM checkins c2
           WHERE c2."objectiveId" = c."objectiveId"
             AND c2.id < c.id
             AND (c2.status = '${CheckinStatus.DONE}'
                  OR c2.status = '${CheckinStatus.CLOSED}')
           ORDER BY c2."nextCheckinDate" DESC
           LIMIT 1)
        AND (c.status = '${CheckinStatus.PENDING}' OR c.status = '${CheckinStatus.DONE}' 
        OR c.status = '${CheckinStatus.CLOSED}' )
        AND o."cycleId" = ${cycleId}`;
      return await this.query(query);
    } catch (error) {
      throw new HttpException(DATABASE_EXCEPTION.message, DATABASE_EXCEPTION.statusCode);
    }
  }

  public async getOverdueCheckin(cycleId: number): Promise<ObjectLiteral[]> {
    try {
      const query = `SELECT count(c.id) AS overDueCheckin
      FROM checkins c
      LEFT JOIN objectives o ON c."objectiveId" = o.id
      WHERE c."checkinAt" >
          (SELECT c2."nextCheckinDate"
           FROM checkins c2
           WHERE c2."objectiveId" = c."objectiveId"
             AND c2.id < c.id
             AND (c2.status = '${CheckinStatus.DONE}'
                  OR c2.status = '${CheckinStatus.CLOSED}')
           ORDER BY c2."nextCheckinDate" DESC
           LIMIT 1)
        AND (c.status = '${CheckinStatus.PENDING}' OR c.status = '${CheckinStatus.DONE}' 
        OR c.status = '${CheckinStatus.CLOSED}')
        AND o."cycleId" = ${cycleId}`;
      return await this.query(query);
    } catch (error) {
      throw new HttpException(DATABASE_EXCEPTION.message, DATABASE_EXCEPTION.statusCode);
    }
  }

  public async getNotYetCheckin(cycleId: number): Promise<ObjectLiteral[]> {
    try {
      const query = `SELECT count(o.id) as notYetCheckin
      FROM objectives o
      WHERE o."isCompleted" = FALSE
        AND o."cycleId" = ${cycleId}
        AND o.id NOT IN
          (SELECT DISTINCT coalesce(c."objectiveId", 0)
           FROM checkins c
           WHERE c.status = '${CheckinStatus.DONE}' or c.status = '${CheckinStatus.CLOSED}')`;
      return await this.query(query);
    } catch (error) {
      throw new HttpException(DATABASE_EXCEPTION.message, DATABASE_EXCEPTION.statusCode);
    }
  }

  public async getNotYetCheckinStatus(lastDay: string): Promise<ObjectLiteral[]> {
    try {
      const query = `
      SELECT count(o.id) as notYetCheckin
      FROM objectives o
      WHERE o."isCompleted" = FALSE
        AND o.id NOT IN
          (SELECT DISTINCT coalesce(c."objectiveId", 0)
           FROM checkins c
           WHERE (c.status = '${CheckinStatus.DONE}' or c.status = '${CheckinStatus.CLOSED}') 
           and c."checkinAt" <= '${lastDay}')`;
      return await this.query(query);
    } catch (error) {
      throw new HttpException(DATABASE_EXCEPTION.message, DATABASE_EXCEPTION.statusCode);
    }
  }

  public async getChartCheckin(userId: number, objectiveId: number): Promise<CheckinEntity[]> {
    try {
      const queryBuilder = await this.createQueryBuilder('checkin')
        .select(['checkin.progress', 'checkin.checkinAt'])
        .leftJoin('checkin.objective', 'objective')
        .where('objective.userId= :userId', { userId: userId })
        .andWhere('checkin.objectiveId = :objectiveId', { objectiveId: objectiveId })
        .andWhere('checkin.checkinAt NOTNULL')
        .orderBy('checkin.checkinAt', 'ASC');

      return queryBuilder.getMany();
    } catch (error) {
      throw new HttpException(DATABASE_EXCEPTION.message, DATABASE_EXCEPTION.statusCode);
    }
  }

  public async getOKRStatus(firstDay: string, lastDay: string): Promise<ObjectLiteral[]> {
    try {
      const query = `SELECT thisWeek."objectiveId",
              coalesce(thisWeek.progress, 0) - coalesce(lastweek.progress, 0) AS progressChanging,
              thisWeek."confidentLevel"
        FROM
        (SELECT c."objectiveId",
                c.id,
                c.progress,
                c."confidentLevel"
          FROM checkins c
          WHERE c."checkinAt" BETWEEN '${firstDay}'::date AND '${lastDay}'::date
            AND c."nextCheckinDate" =
              (SELECT c2."nextCheckinDate"
              FROM checkins c2
              WHERE c2."objectiveId" = c."objectiveId"
                AND (c2.status = 'Done'
                      OR c2.status = 'Closed')
              ORDER BY c2."nextCheckinDate" DESC
              LIMIT 1) 
              AND (c.status = 'Done' OR c.status = 'Closed')) AS thisWeek
        LEFT JOIN
        (SELECT c."objectiveId",
                c.progress
          FROM checkins c
          WHERE c."nextCheckinDate" =
              (SELECT sub."nextCheckinDate"
              FROM
                (SELECT c2."nextCheckinDate"
                  FROM checkins c2
                  WHERE c2."objectiveId" = c."objectiveId"
                    AND (c2.status = 'Done'
                        OR c2.status = 'Closed')
                  ORDER BY c2."nextCheckinDate" DESC
                  LIMIT 2) AS sub
              ORDER BY sub."nextCheckinDate" ASC
              LIMIT 1) AND (c.status = 'Done' OR c.status = 'Closed')) 
              AS lastWeek ON thisWeek."objectiveId" = lastweek."objectiveId"`;
      return this.query(query);
    } catch (error) {
      throw new HttpException(DATABASE_EXCEPTION.message, DATABASE_EXCEPTION.statusCode);
    }
  }
}
