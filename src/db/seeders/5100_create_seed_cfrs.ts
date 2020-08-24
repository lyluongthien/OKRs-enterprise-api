import { Seeder, Factory } from 'typeorm-seeding';
import { Connection } from 'typeorm';
import { CFRsEntity } from '../entities/cfrs.entity';
import { TypeCFRsHistory } from '@app/constants/app.enums';

export class Seeder5001Recognition implements Seeder {
  public async run(factory: Factory, connection: Connection): Promise<any> {
    await connection
      .createQueryBuilder()
      .insert()
      .into(CFRsEntity)
      .values([
        {
          senderId: 9,
          receiverId: 11,
          content: 'Bạn làm rất tốt',
          evaluationCriteriaId: 3,
          objectiveId: 8,
          cycleId: 3,
          type: TypeCFRsHistory.RECOGNITION,
        },
        {
          senderId: 9,
          receiverId: 12,
          content: 'Bạn làm tốt lắm',
          evaluationCriteriaId: 2,
          objectiveId: 9,
          cycleId: 3,
          type: TypeCFRsHistory.RECOGNITION,
        },
        {
          senderId: 12,
          receiverId: 9,
          content: 'Quản lý rất tốt',
          evaluationCriteriaId: 3,
          objectiveId: 9,
          cycleId: 3,
          type: TypeCFRsHistory.RECOGNITION,
        },
        {
          senderId: 11,
          receiverId: 9,
          content: 'Quản lý rất tốt',
          evaluationCriteriaId: 3,
          objectiveId: 8,
          cycleId: 3,
          type: TypeCFRsHistory.RECOGNITION,
        },
        {
          senderId: 9,
          receiverId: 12,
          content: 'Quản lý rất tốt',
          evaluationCriteriaId: 8,
          checkinId: 1,
          cycleId: 3,
          type: TypeCFRsHistory.FEED_BACK,
        },
        {
          senderId: 9,
          receiverId: 11,
          content: 'Quản lý rất tốt',
          evaluationCriteriaId: 8,
          checkinId: 2,
          cycleId: 3,
          type: TypeCFRsHistory.FEED_BACK,
        },
        {
          senderId: 12,
          receiverId: 9,
          content: 'Quản lý rất tốt',
          evaluationCriteriaId: 8,
          checkinId: 1,
          cycleId: 3,
          type: TypeCFRsHistory.FEED_BACK,
        },
        {
          senderId: 11,
          receiverId: 9,
          content: 'Quản lý rất tốt',
          evaluationCriteriaId: 8,
          checkinId: 2,
          cycleId: 3,
          type: TypeCFRsHistory.FEED_BACK,
        },
      ])
      .execute();
  }
}
