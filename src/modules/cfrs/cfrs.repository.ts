import { Repository, EntityRepository, ObjectLiteral, getConnection, EntityManager } from 'typeorm';
import { HttpException } from '@nestjs/common';

import { CFRsEntity } from '@app/db/entities/cfrs.entity';
import { CFRsDTO } from './cfrs.dto';
import { DATABASE_EXCEPTION } from '@app/constants/app.exeption';
import { TopStarType } from '@app/constants/app.enums';
import { IPaginationOptions, paginate } from 'nestjs-typeorm-paginate';

@EntityRepository(CFRsEntity)
export class CFRsRepository extends Repository<CFRsEntity> {
  public async createCFRs(data: CFRsDTO, manager: EntityManager): Promise<void> {
    try {
      await manager.getRepository(CFRsEntity).save(data);
    } catch (error) {
      throw new HttpException(DATABASE_EXCEPTION.message, DATABASE_EXCEPTION.statusCode);
    }
  }

  public async getSentCFRs(userId: number, cycleId: number, options: IPaginationOptions): Promise<any> {
    try {
      const queryBuilder = await this.createQueryBuilder('cfrs')
        .select([
          'cfrs.id',
          'cfrs.createdAt',
          'cfrs.content',
          'cfrs.type',
          'criteria.id',
          'criteria.content',
          'criteria.numberOfStar',
          'criteria.type',
          'receiver.fullName',
          'receiver.avatarURL',
          'receiver.gravatarURL',
          'checkin.id',
          'feedbackObjective.id',
          'feedbackObjective.title',
          'recognitionObjective.id',
          'recognitionObjective.title',
        ])
        .leftJoin('cfrs.evaluationCriteria', 'criteria')
        .leftJoin('cfrs.sender', 'sender')
        .leftJoin('cfrs.receiver', 'receiver')
        .leftJoin('cfrs.checkin', 'checkin')
        .leftJoin('checkin.objective', 'feedbackObjective')
        .leftJoin('cfrs.objective', 'recognitionObjective')
        .where('sender.id = :id', { id: userId })
        .andWhere('cfrs.cycleId = :cycleId', { cycleId })
        .orderBy('cfrs.createdAt', 'DESC');

      return await paginate<CFRsEntity>(queryBuilder, options);
    } catch (error) {
      throw new HttpException(DATABASE_EXCEPTION.message, DATABASE_EXCEPTION.statusCode);
    }
  }

  public async getReceivedCFRs(userId: number, cycleId: number, options: IPaginationOptions): Promise<any> {
    try {
      const queryBuilder = await this.createQueryBuilder('cfrs')
        .select([
          'cfrs.id',
          'cfrs.createdAt',
          'cfrs.content',
          'cfrs.type',
          'criteria.id',
          'criteria.content',
          'criteria.numberOfStar',
          'criteria.type',
          'receiver.fullName',
          'receiver.avatarURL',
          'receiver.gravatarURL',
          'checkin.id',
          'feedbackObjective.id',
          'feedbackObjective.title',
          'recognitionObjective.id',
          'recognitionObjective.title',
        ])
        .leftJoin('cfrs.evaluationCriteria', 'criteria')
        .leftJoin('cfrs.sender', 'sender')
        .leftJoin('cfrs.receiver', 'receiver')
        .leftJoin('cfrs.checkin', 'checkin')
        .leftJoin('checkin.objective', 'feedbackObjective')
        .leftJoin('cfrs.objective', 'recognitionObjective')
        .where('receiver.id = :id', { id: userId })
        .andWhere('cfrs.cycleId = :cycleId', { cycleId: cycleId })
        .orderBy('cfrs.createdAt', 'DESC');
      return await paginate<CFRsEntity>(queryBuilder, options);
    } catch (error) {
      throw new HttpException(DATABASE_EXCEPTION.message, DATABASE_EXCEPTION.statusCode);
    }
  }

  public async getAllCFRs(cycleId: number, options: IPaginationOptions): Promise<any> {
    try {
      const queryBuilder = await this.createQueryBuilder('cfrs')
        .select([
          'cfrs.id',
          'cfrs.createdAt',
          'cfrs.content',
          'cfrs.type',
          'criteria.id',
          'criteria.content',
          'criteria.numberOfStar',
          'criteria.type',
          'receiver.fullName',
          'receiver.avatarURL',
          'receiver.gravatarURL',
          'checkin.id',
          'feedbackObjective.id',
          'feedbackObjective.title',
          'recognitionObjective.id',
          'recognitionObjective.title',
        ])
        .leftJoin('cfrs.evaluationCriteria', 'criteria')
        .leftJoin('cfrs.sender', 'sender')
        .leftJoin('cfrs.receiver', 'receiver')
        .leftJoin('cfrs.checkin', 'checkin')
        .leftJoin('checkin.objective', 'feedbackObjective')
        .leftJoin('cfrs.objective', 'recognitionObjective')
        .where('cfrs.cycleId = :cycleId', { cycleId: cycleId })
        .orderBy('cfrs.createdAt', 'DESC');
      return await paginate<CFRsEntity>(queryBuilder, options);
    } catch (error) {
      throw new HttpException(DATABASE_EXCEPTION.message, DATABASE_EXCEPTION.statusCode);
    }
  }

  public async getTopStars(cycleId: number, type: TopStarType): Promise<ObjectLiteral[]> {
    try {
      const databaseType = type == TopStarType.SENDER ? 'senderId' : 'receiverId';
      return await getConnection()
        .query(`select feed.fullName, coalesce(feed.numberOfStar,0) + coalesce(reg.numberOfStar,0) as 
        numberOfStar from (
        select u.id as feedId, u."fullName" as fullName , SUM(ec."numberOfStar") as numberOfStar from feedbacks f 
        left join checkins c on c.id = f."checkinId" 
        left join objectives o on o.id = c."objectiveId" 
        left join users u on u.id = f."${databaseType}" 
        left join evaluation_criterias ec on ec.id = f."evaluationCriteriaId" 
        where o."cycleId" = ${cycleId}
        group by u.id) as feed
        left join (
        select u2.id as regId, u2."fullName", SUM(ec."numberOfStar" ) as numberOfStar from recognitions r2 
        left join users u2 on u2.id = r2."${databaseType}" 
        left join evaluation_criterias ec on ec.id = r2."evaluationCriteriaId" 
        group by u2.id) as reg on feed.feedId = reg.regId order by numberOfStar desc limit 5`);
    } catch (error) {
      throw new HttpException(DATABASE_EXCEPTION.message, DATABASE_EXCEPTION.statusCode);
    }
  }
  public async getFeedBackInWeek(
    firstDay: string,
    lastDay: string,
    firstOfLastWeek: string,
    lastOfLastWeek: string,
  ): Promise<ObjectLiteral[]> {
    try {
      const query = `SELECT 
        Sum(feed.numberOfFeedback) AS numberOfFeedback,
        Sum(coalesce(feed.numberOfFeedback, 0) - coalesce(feedLastWeek.numberOfLastFeedback, 0)) AS changing
      FROM
        (SELECT f.id, count(f.id) AS numberOfFeedback
        FROM feedbacks f
        WHERE f."createdAt" BETWEEN '${firstDay}' AND '${lastDay}'
        GROUP BY f.id) AS feed
      FULL OUTER JOIN
        (SELECT f.id, count(f.id) AS numberOfLastFeedback
        FROM feedbacks f
        WHERE f."createdAt" BETWEEN '${firstOfLastWeek}' AND '${lastOfLastWeek}'
        GROUP BY f.id) AS feedLastWeek ON feed.id = feedLastWeek.id`;

      return await this.query(query);
    } catch (error) {
      throw new HttpException(DATABASE_EXCEPTION.message, DATABASE_EXCEPTION.statusCode);
    }
  }

  public async getTopManagerUseCFRsInWeek(
    firstDay: string,
    lastDay: string,
    firstOfLastWeek: string,
    lastOfLastWeek: string,
    adminId: number,
  ): Promise<ObjectLiteral[]> {
    try {
      const query = `SELECT SUM(COALESCE (currentLeader.numberOfLeader, 0)) AS numberOfLeader,
              SUM(coalesce(currentLeader.numberOfLeader, 0) - coalesce(lastWeekLeader.numberOfLeader, 0)) AS changing
        FROM
        (SELECT coalesce(feed."senderId", reg."senderId") AS id,
                Count(coalesce(feed."senderId", reg."senderId")) AS numberOfLeader
          FROM
            (SELECT DISTINCT f."senderId"
            FROM feedbacks f
            LEFT JOIN users u ON u.id = f."senderId"
            WHERE (u."isLeader" = TRUE
                    OR u."roleId" = ${adminId})
              AND f."createdAt" BETWEEN '${firstDay}' AND '${lastDay}' ) AS feed
          FULL OUTER JOIN
            (SELECT DISTINCT r."senderId"
            FROM recognitions r
            LEFT JOIN users u ON u.id = r."senderId"
            WHERE (u."isLeader" = TRUE
                    OR u."roleId" = ${adminId})
              AND r."createdAt" BETWEEN '${firstDay}' AND '${lastDay}') AS reg ON feed."senderId" = reg."senderId"
          GROUP BY id) AS currentLeader
        FULL OUTER JOIN
        (SELECT coalesce(feed."senderId", reg."senderId") AS id,
                Count(coalesce(feed."senderId", reg."senderId")) AS numberOfLeader
          FROM
            (SELECT DISTINCT f."senderId"
            FROM feedbacks f
            LEFT JOIN users u ON u.id = f."senderId"
            WHERE (u."isLeader" = TRUE
                    OR u."roleId" = ${adminId})
              AND f."createdAt" BETWEEN '${firstOfLastWeek}' AND '${lastOfLastWeek}' ) AS feed
          FULL OUTER JOIN
            (SELECT DISTINCT r."senderId"
            FROM recognitions r
            LEFT JOIN users u ON u.id = r."senderId"
            WHERE (u."isLeader" = TRUE
                    OR u."roleId" = ${adminId})
              AND r."createdAt" BETWEEN '${firstOfLastWeek}' AND '${lastOfLastWeek}') AS reg ON feed."senderId" = reg."senderId"
          GROUP BY id) AS lastWeekLeader ON currentLeader.id = lastWeekLeader.id`;
      return await this.query(query);
    } catch (error) {
      throw new HttpException(DATABASE_EXCEPTION.message, DATABASE_EXCEPTION.statusCode);
    }
  }

  public async getDetailCFRs(cfrsId: number): Promise<CFRsEntity> {
    try {
      return await this.createQueryBuilder('cfrs')
        .select([
          'cfrs.id',
          'cfrs.type',
          'criteria.content',
          'sender.fullName',
          'receiver.fullName',
          'checkin.checkinAt',
          'feedbackObjective.id',
          'feedbackObjective.title',
          'cfrs.content',
          'recognitionObjective.id',
          'recognitionObjective.title',
        ])
        .leftJoin('cfrs.checkin', 'checkin')
        .leftJoin('cfrs.evaluationCriteria', 'criteria')
        .leftJoin('checkin.objective', 'feedbackObjective')
        .leftJoin('cfrs.objective', 'recognitionObjective')
        .leftJoin('cfrs.receiver', 'receiver')
        .leftJoin('cfrs.sender', 'sender')
        .where('cfrs.id = :id', { id: cfrsId })
        .getOne();
    } catch (error) {
      throw new HttpException(DATABASE_EXCEPTION.message, DATABASE_EXCEPTION.statusCode);
    }
  }
}
