import { Seeder, Factory } from 'typeorm-seeding';
import { Connection } from 'typeorm';
import { CycleEntity } from '../entities/cycle.entity';

export class CycleSeeder implements Seeder {
  public async run(factory: Factory, connection: Connection): Promise<any> {
    await connection
      .createQueryBuilder()
      .insert()
      .into(CycleEntity)
      .values([
        { name: 'Summer 2020', startDate: '2020-01-01', endDate: '2020-01-01' },
        { name: 'Spring 2020', startDate: '2020-01-01', endDate: '2020-01-01' },
        { name: 'Fall 2020', startDate: '2020-01-01', endDate: '2020-01-01' },
      ])
      .execute();
  }
}
