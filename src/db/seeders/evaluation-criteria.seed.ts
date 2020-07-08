import { Seeder, Factory } from 'typeorm-seeding';
import { Connection } from 'typeorm';
import { EvaluationCriteriaEntity } from '../entities/evaluation-criteria.entity';

export class EvaluationCriteriaSeeder implements Seeder {
  public async run(factory: Factory, connection: Connection): Promise<any> {
    await connection
      .createQueryBuilder()
      .insert()
      .into(EvaluationCriteriaEntity)
      .values([
        // { content: 'Bạn cần cố gắng hơn nữa', numberOfStar: 1, type: },
      ])
      .execute();
  }
}
