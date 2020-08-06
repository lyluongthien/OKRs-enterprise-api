import { Repository, EntityRepository, ObjectLiteral, getConnection } from 'typeorm';
import { HttpException } from '@nestjs/common';

import { FeedbackEntity } from '@app/db/entities/feedback.entity';
import { FeedbackDTO } from './feedback.dto';
import { DATABASE_EXCEPTION } from '@app/constants/app.exeption';
import { TopStarType } from '@app/constants/app.enums';

@EntityRepository(FeedbackEntity)
export class FeedbackRepository extends Repository<FeedbackEntity> {
  public async createFeedBack(data: FeedbackDTO, senderId: number): Promise<void> {
    try {
      data.senderId = senderId;
      this.save(data);
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
}
