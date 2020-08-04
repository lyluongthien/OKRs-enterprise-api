import { Seeder, Factory } from 'typeorm-seeding';
import { Connection } from 'typeorm';
import { FeedbackEntity } from '../entities/feedback.entity';

export class Seeder5001Recognition implements Seeder {
  public async run(factory: Factory, connection: Connection): Promise<any> {
    await connection
      .createQueryBuilder()
      .insert()
      .into(FeedbackEntity)
      .values([
        {
          senderId: 9,
          receiverId: 11,
          content: 'Bạn làm rất tốt',
          evaluationCriteriaId: 3,
          isLeaderToStaff: true,
          checkinId: 2,
        },
        {
          senderId: 9,
          receiverId: 12,
          content: 'Bạn làm rất tốt',
          evaluationCriteriaId: 3,
          isLeaderToStaff: true,
          checkinId: 4,
        },
        {
          senderId: 11,
          receiverId: 9,
          content: 'Bạn làm rất tốt',
          evaluationCriteriaId: 3,
          isLeaderToStaff: false,
          checkinId: 2,
        },
        {
          senderId: 12,
          receiverId: 9,
          content: 'Bạn làm rất tốt',
          evaluationCriteriaId: 3,
          isLeaderToStaff: false,
          checkinId: 2,
        },
      ])
      .execute();
  }
}
