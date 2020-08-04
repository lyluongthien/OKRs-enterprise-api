import { Seeder, Factory } from 'typeorm-seeding';
import { Connection } from 'typeorm';
import { RecognitionEntity } from '../entities/recognition.entity';

export class Seeder5001Recognition implements Seeder {
  public async run(factory: Factory, connection: Connection): Promise<any> {
    await connection
      .createQueryBuilder()
      .insert()
      .into(RecognitionEntity)
      .values([
        {
          senderId: 9,
          receiverId: 11,
          content: 'Bạn làm rất tốt',
          evaluationCriteriaId: 3,
          objectiveId: 8,
          cycleId: 3,
        },
        {
          senderId: 9,
          receiverId: 12,
          content: 'Bạn làm tốt lắm',
          evaluationCriteriaId: 2,
          objectiveId: 9,
          cycleId: 3,
        },
        {
          senderId: 12,
          receiverId: 9,
          content: 'Quản lý rất tốt',
          evaluationCriteriaId: 3,
          objectiveId: 9,
          cycleId: 3,
        },
        {
          senderId: 11,
          receiverId: 9,
          content: 'Quản lý rất tốt',
          evaluationCriteriaId: 3,
          objectiveId: 8,
          cycleId: 3,
        },
      ])
      .execute();
  }
}
