import { Seeder, Factory } from 'typeorm-seeding';
import { Connection } from 'typeorm';
import { CycleEntity } from '../entities/cycle.entity';

export class Seeder1004Cycle implements Seeder {
  public async run(factory: Factory, connection: Connection): Promise<any> {
    await connection
      .createQueryBuilder()
      .insert()
      .into(CycleEntity)
      .values([
        { name: 'Summer 2020', startDate: '2020-05-01', endDate: '2020-08-31' },
        { name: 'Fall 2020', startDate: '2021-09-01', endDate: '2021-12-31' },
      ])
      .execute();
  }
}
