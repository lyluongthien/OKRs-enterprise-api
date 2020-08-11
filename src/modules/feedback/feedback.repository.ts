import { Repository, EntityRepository, ObjectLiteral, getConnection, EntityManager } from 'typeorm';
import { HttpException } from '@nestjs/common';

import { FeedbackEntity } from '@app/db/entities/feedback.entity';
import { FeedbackDTO } from './feedback.dto';
import { DATABASE_EXCEPTION } from '@app/constants/app.exeption';
import { TopStarType } from '@app/constants/app.enums';

@EntityRepository(FeedbackEntity)
export class FeedbackRepository extends Repository<FeedbackEntity> {
  public async createFeedBack(data: FeedbackDTO, senderId: number, manager: EntityManager): Promise<void> {
    try {
      data.senderId = senderId;
      await manager.getRepository(FeedbackEntity).save(data);
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
        group by u2.id) as reg on feed.feedId = reg.regId order by numberOfStar desc`);
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
      return await this.query(`select Sum(feed.numberOfFeedback) as numberOfFeedback, 
      Sum(coalesce(feed.numberOfFeedback, 0) - coalesce(feedLastWeek.numberOfLastFeedback, 0)) as changing from (
      select f.id,  count(f.id) as numberOfFeedback from feedbacks f 
      where f."createdAt" between '${firstDay}' and '${lastDay}'
      group by f.id) as feed
      full outer join  
      (select f.id, count(f.id) as numberOfLastFeedback from feedbacks f 
      where f."createdAt" between '${firstOfLastWeek}' and '${lastOfLastWeek}'
      group by f.id) as feedLastWeek on feed.id = feedLastWeek.id`);
    } catch (error) {
      throw new HttpException(DATABASE_EXCEPTION.message, DATABASE_EXCEPTION.statusCode);
    }
  }

  public async getTopManagerUseCFRsInWeek(
    firstDay: string,
    lastDay: string,
    firstOfLastWeek: string,
    lastOfLastWeek: string,
  ): Promise<ObjectLiteral[]> {
    try {
      return await this.query(`select SUM(coalesce (currentLeader.numberOfLeader, 0)) as numberOfLeader, 
      SUM(coalesce(currentLeader.numberOfLeader, 0) - coalesce(lastWeekLeader.numberOfLeader, 0)) as changing from 
      (select coalesce(feed."senderId", reg."senderId") as id, Count(coalesce(feed."senderId", reg."senderId")) as numberOfLeader
      from 
      (select distinct f."senderId" from feedbacks f 
      left join users u on u.id = f."senderId" 
      where (u."isLeader" = true or u."roleId" = 1) 
      and f."createdAt" between '${firstDay}' and '${lastDay}'
      ) as feed full outer join
      (select distinct r."senderId" from recognitions r
      left join users u on u.id = r."senderId" 
      where (u."isLeader" = true or u."roleId" = 1) 
      and r."createdAt" between '${firstDay}' and '${lastDay}') 
      as reg on feed."senderId" = reg."senderId"
      group by id) as currentLeader full outer join 
      (select coalesce(feed."senderId", reg."senderId") as id, Count(coalesce(feed."senderId", reg."senderId")) as numberOfLeader
      from 
      (select distinct f."senderId" from feedbacks f 
      left join users u on u.id = f."senderId" 
      where (u."isLeader" = true or u."roleId" = 1) 
      and f."createdAt" between '${firstOfLastWeek}' and '${lastOfLastWeek}'
      ) as feed full outer join
      (select distinct r."senderId" from recognitions r
      left join users u on u.id = r."senderId" 
      where (u."isLeader" = true or u."roleId" = 1) 
      and r."createdAt" between '${firstOfLastWeek}' and '${lastOfLastWeek}') 
      as reg on feed."senderId" = reg."senderId"
      group by id) as lastWeekLeader on currentLeader.id = lastWeekLeader.id`);
    } catch (error) {
      throw new HttpException(DATABASE_EXCEPTION.message, DATABASE_EXCEPTION.statusCode);
    }
  }
}
