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
          inferiorId: 2,
          superiorId: 1,
          content: 'Bạn làm rất tốt',
          evaluationCriteriaId: 3,
          objectiveId: 1,
          cycleId: 1,
        },
        {
          inferiorId: 3,
          superiorId: 1,
          content: 'Bạn làm tốt lắm',
          evaluationCriteriaId: 2,
          objectiveId: 2,
          cycleId: 2,
        },
        {
          inferiorId: 3,
          superiorId: 2,
          content: 'Bạn ngu quá',
          evaluationCriteriaId: 1,
          objectiveId: 1,
          cycleId: 2,
        },
      ])
      .execute();
  }
}
